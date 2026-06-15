/**
 * db.ts — typed, RLS-scoped Supabase data access for all synced state.
 *
 * Every function is best-effort: it try/catches and returns null (loads) or
 * resolves void (saves) on failure, so a network blip or an unrun migration
 * can never throw into the UI. cloudSync.ts layers caching + retries on top.
 *
 * Column mapping is intentionally lossless: the rich local LessonProgress and
 * Portfolio objects keep their named, queryable columns AND stash every
 * remaining field in an `extra jsonb` column (added by the Phase-2 migration).
 */
import { supabase } from './supabase';
import { INITIAL_PORTFOLIO } from '../services/portfolioStorage';
import { isFeatureUnlocked, UNLOCK_UNIT_IDS, type UnlockKey } from '../services/featureUnlocks';
import type { LessonProgress } from '../types/lesson';
import type { Portfolio } from '../types/trading';

// ─── small helpers ──────────────────────────────────────────────────────────

function warn(scope: string, error: unknown) {
  if (__DEV__) console.warn(`[db] ${scope} failed:`, error);
}

/** Drop a set of keys from an object (used to compute the `extra` payload). */
function omit<T extends Record<string, unknown>>(obj: T, keys: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    if (!keys.includes(k)) out[k] = (obj as Record<string, unknown>)[k];
  }
  return out;
}

// ─── user_progress ────────────────────────────────────────────────────────────

// Fields that get their own queryable column; everything else rides in `extra`.
const NAMED_PROGRESS_KEYS = [
  'completedLessonIds',
  'xp',
  'streak',
  'brainBucks',
  'badges',
  'mastery',
  'reviewQueue',
] as const;

function computeUnlockedKeys(progress: LessonProgress): UnlockKey[] {
  return (Object.keys(UNLOCK_UNIT_IDS) as UnlockKey[]).filter((k) => isFeatureUnlocked(k, progress));
}

export async function loadProgress(userId: string): Promise<LessonProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('xp, streak, brain_bucks, completed_lesson_ids, badges, mastery, review_queue, last_active_date, extra')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const extra = (data.extra ?? {}) as Partial<LessonProgress>;
    return {
      ...extra,
      completedLessonIds: data.completed_lesson_ids ?? extra.completedLessonIds ?? [],
      xp: data.xp ?? extra.xp ?? 0,
      streak: data.streak ?? extra.streak ?? 0,
      brainBucks: data.brain_bucks ?? extra.brainBucks ?? 0,
      badges: data.badges ?? extra.badges,
      mastery: data.mastery ?? extra.mastery,
      reviewQueue: data.review_queue ?? extra.reviewQueue,
    };
  } catch (error) {
    warn('loadProgress', error);
    return null;
  }
}

export async function saveProgress(userId: string, progress: LessonProgress): Promise<boolean> {
  try {
    const row = {
      id: userId,
      xp: progress.xp ?? 0,
      streak: progress.streak ?? 0,
      brain_bucks: progress.brainBucks ?? 0,
      completed_lesson_ids: progress.completedLessonIds ?? [],
      unlocked_feature_keys: computeUnlockedKeys(progress),
      badges: progress.badges ?? [],
      review_queue: progress.reviewQueue ?? [],
      mastery: progress.mastery ?? {},
      last_active_date: progress.lastStudiedAt ?? progress.lastStreakDate ?? null,
      extra: omit(progress as unknown as Record<string, unknown>, NAMED_PROGRESS_KEYS),
    };
    const { error } = await supabase.from('user_progress').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (error) {
    warn('saveProgress', error);
    return false;
  }
}

// ─── portfolios ────────────────────────────────────────────────────────────────

export async function loadPortfolio(userId: string): Promise<Portfolio | null> {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('virtual_cash, holdings, order_history, watchlist, extra')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const extra = (data.extra ?? {}) as Partial<Portfolio>;
    return {
      schemaVersion: 1,
      cash: data.virtual_cash ?? INITIAL_PORTFOLIO.cash,
      holdings: data.holdings ?? [],
      transactions: data.order_history ?? [],
      watchlistSymbols: data.watchlist ?? INITIAL_PORTFOLIO.watchlistSymbols,
      pendingOrders: extra.pendingOrders ?? [],
      snapshots: extra.snapshots ?? [],
    };
  } catch (error) {
    warn('loadPortfolio', error);
    return null;
  }
}

export async function savePortfolio(userId: string, portfolio: Portfolio): Promise<boolean> {
  try {
    const row = {
      id: userId,
      virtual_cash: portfolio.cash ?? INITIAL_PORTFOLIO.cash,
      holdings: portfolio.holdings ?? [],
      order_history: portfolio.transactions ?? [],
      watchlist: portfolio.watchlistSymbols ?? [],
      extra: {
        schemaVersion: portfolio.schemaVersion ?? 1,
        pendingOrders: portfolio.pendingOrders ?? [],
        snapshots: portfolio.snapshots ?? [],
      },
    };
    const { error } = await supabase.from('portfolios').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (error) {
    warn('savePortfolio', error);
    return false;
  }
}

// ─── game_states (one row per user per game_key) ────────────────────────────────

export async function loadGameState<T = unknown>(userId: string, gameKey: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from('game_states')
      .select('state')
      .eq('user_id', userId)
      .eq('game_key', gameKey)
      .maybeSingle();
    if (error) throw error;
    return (data?.state ?? null) as T | null;
  } catch (error) {
    warn(`loadGameState(${gameKey})`, error);
    return null;
  }
}

export async function saveGameState(userId: string, gameKey: string, state: unknown): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('game_states')
      .upsert(
        { user_id: userId, game_key: gameKey, state, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,game_key' },
      );
    if (error) throw error;
    return true;
  } catch (error) {
    warn(`saveGameState(${gameKey})`, error);
    return false;
  }
}

// ─── profiles ────────────────────────────────────────────────────────────────

export type ProfileRow = {
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
};

export async function loadProfile(userId: string): Promise<ProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, username, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      displayName: data.display_name ?? null,
      username: data.username ?? null,
      avatarUrl: data.avatar_url ?? null,
    };
  } catch (error) {
    warn('loadProfile', error);
    return null;
  }
}

export async function saveProfile(
  userId: string,
  partial: Partial<{ displayName: string; username: string; avatarUrl: string }>,
): Promise<boolean> {
  try {
    const row: Record<string, unknown> = { id: userId };
    if (partial.displayName !== undefined) row.display_name = partial.displayName;
    if (partial.username !== undefined) row.username = partial.username;
    if (partial.avatarUrl !== undefined) row.avatar_url = partial.avatarUrl;
    const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (error) {
    warn('saveProfile', error);
    return false;
  }
}
