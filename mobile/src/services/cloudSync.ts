/**
 * cloudSync — cloud-first state sync with a local cache fallback.
 *
 * Strategy (per Phase-2 brief):
 *  - LOAD: try Supabase first; on success refresh the per-user AsyncStorage
 *    cache and return cloud data; on failure fall back to the cache. Never
 *    blocks first paint.
 *  - SAVE: write the per-user cache immediately (instant UX) + push to Supabase
 *    on a short debounce in the background. A failed push marks the domain
 *    "dirty" (persisted) and keeps the latest value queued for retry.
 *  - RESYNC: on app foreground, first flush dirty domains (so unsynced local
 *    edits aren't clobbered), then re-pull to catch other-device changes.
 *
 * The existing *Storage.ts services remain as-is; this owns its own per-user
 * cache so multiple accounts on one device never collide, and the legacy
 * unkeyed storage is treated purely as the one-time migration source.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';
import * as db from '../lib/db';
import { sanitizeDisplayName } from '../lib/sanitize';
import { loadProgress as loadLegacyProgress } from './progressStorage';
import { loadPortfolio as loadLegacyPortfolio } from './portfolioStorage';
import { loadStockMarketSession as loadLegacyStock } from './stockMarketStorage';
import { budgetStorageKey } from './budgetStorage';
import type { LessonProgress } from '../types/lesson';
import type { Portfolio } from '../types/trading';
import type { QuizAnswers } from '../types/onboarding';
import type { StockMarketSession, LemonadeSession, PropertySession, StartupSession } from '../types/game';

// ─── types ──────────────────────────────────────────────────────────────────

export type GameKey = 'stockMarket' | 'lemonade' | 'property' | 'startup' | 'budget';

/** App-level metadata that has no dedicated column; stored in game_states[meta]. */
export type AppMeta = {
  onboardingAnswers?: QuizAnswers;
  profileName?: string;
  tutorialsSeen?: Record<string, boolean>;
};

export type SyncSnapshot = {
  progress: LessonProgress | null;
  portfolio: Portfolio | null;
  profile: db.ProfileRow | null;
  meta: AppMeta | null;
  games: {
    stockMarket: StockMarketSession | null;
    lemonade: LemonadeSession | null;
    property: PropertySession | null;
    startup: StartupSession | null;
    budget: unknown | null;
  };
};

// ─── active user ──────────────────────────────────────────────────────────────

let currentUserId: string | null = null;
export function setActiveUser(id: string) { currentUserId = id; }
export function clearActiveUser() {
  currentUserId = null;
  for (const k of Object.keys(timers)) clearTimeout(timers[k]);
  Object.keys(latest).forEach((k) => delete latest[k]);
  dirty.clear();
}
export function getActiveUser() { return currentUserId; }

/**
 * Resolve the active user id, binding it from the live session if needed.
 * Used right after sign-up, where the session arrives asynchronously via
 * onAuthStateChange and currentUserId may not be set by the hydrate effect yet.
 */
export async function ensureActiveUser(): Promise<string | null> {
  if (currentUserId) return currentUserId;
  try {
    const { data } = await supabase.auth.getSession();
    const id = data.session?.user.id ?? null;
    if (id) setActiveUser(id);
    return id;
  } catch {
    return null;
  }
}

// ─── cache plumbing ─────────────────────────────────────────────────────────

const PROGRESS = '@coinly_sync_progress';
const PORTFOLIO = '@coinly_sync_portfolio';
const META = '@coinly_sync_meta';
const DIRTY = '@coinly_sync_dirty';
const MIGRATION_FLAG = '@coinly_migration_prompted';
const gameCache = (k: string) => `@coinly_sync_game_${k}`;
const userKey = (base: string, uid: string) => `${base}:${uid}`;

async function readCache<T>(base: string, uid: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(userKey(base, uid));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
async function writeCache(base: string, uid: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(userKey(base, uid), JSON.stringify(value));
  } catch {
    // Non-fatal — value still lives in React state and the retry queue.
  }
}

// ─── dirty queue + debounced background push ────────────────────────────────

const timers: Record<string, ReturnType<typeof setTimeout>> = {};
const latest: Record<string, unknown> = {};
const dirty = new Set<string>();

function markDirty(domain: string) {
  dirty.add(domain);
  if (currentUserId) void writeCache(DIRTY, currentUserId, [...dirty]);
}
function clearDirty(domain: string) {
  dirty.delete(domain);
  if (currentUserId) void writeCache(DIRTY, currentUserId, [...dirty]);
}

/**
 * Debounce a background cloud push. The domain is marked dirty up front (and
 * the dirty set is persisted per-user), so a change made just before sign-out or
 * a crash is recovered from the cache on the next login. Cleared on a successful
 * push. clearActiveUser only resets the in-memory state, never the persisted
 * dirty list, so unsynced work survives but can't bleed into a different account.
 */
function debouncePush(domain: string, push: () => Promise<boolean>) {
  markDirty(domain);
  if (timers[domain]) clearTimeout(timers[domain]);
  timers[domain] = setTimeout(async () => {
    const ok = await push();
    if (ok) clearDirty(domain);
    else markDirty(domain);
  }, 600);
}

// ─── loads (cloud-first, cache fallback) ──────────────────────────────────────

async function pullProgress(uid: string): Promise<LessonProgress | null> {
  const cloud = await db.loadProgress(uid);
  if (cloud) { await writeCache(PROGRESS, uid, cloud); return cloud; }
  return readCache<LessonProgress>(PROGRESS, uid);
}
async function pullPortfolio(uid: string): Promise<Portfolio | null> {
  const cloud = await db.loadPortfolio(uid);
  if (cloud) { await writeCache(PORTFOLIO, uid, cloud); return cloud; }
  return readCache<Portfolio>(PORTFOLIO, uid);
}
async function pullMeta(uid: string): Promise<AppMeta | null> {
  const cloud = await db.loadGameState<AppMeta>(uid, 'meta');
  if (cloud) { await writeCache(META, uid, cloud); return cloud; }
  return readCache<AppMeta>(META, uid);
}
async function pullGame<T>(uid: string, key: GameKey): Promise<T | null> {
  const cloud = await db.loadGameState<T>(uid, key);
  if (cloud) { await writeCache(gameCache(key), uid, cloud); return cloud; }
  return readCache<T>(gameCache(key), uid);
}

async function pullAll(uid: string): Promise<SyncSnapshot> {
  const [progress, portfolio, profile, meta, stockMarket, lemonade, property, startup, budget] = await Promise.all([
    pullProgress(uid),
    pullPortfolio(uid),
    db.loadProfile(uid),
    pullMeta(uid),
    pullGame<StockMarketSession>(uid, 'stockMarket'),
    pullGame<LemonadeSession>(uid, 'lemonade'),
    pullGame<PropertySession>(uid, 'property'),
    pullGame<StartupSession>(uid, 'startup'),
    pullGame<unknown>(uid, 'budget'),
  ]);
  return { progress, portfolio, profile, meta, games: { stockMarket, lemonade, property, startup, budget } };
}

/** Call once on auth: bind the user, flush any leftover dirty writes, pull all. */
export async function hydrateAll(userId: string): Promise<SyncSnapshot> {
  setActiveUser(userId);
  const savedDirty = await readCache<string[]>(DIRTY, userId);
  if (savedDirty) savedDirty.forEach((d) => dirty.add(d));
  await flushDirty();
  return pullAll(userId);
}

// ─── saves (write-through: cache now, cloud in background) ─────────────────────

export function saveProgress(progress: LessonProgress) {
  const uid = currentUserId;
  if (!uid) return;
  latest.progress = progress;
  void writeCache(PROGRESS, uid, progress);
  debouncePush('progress', () => db.saveProgress(uid, latest.progress as LessonProgress));
}

export function savePortfolio(portfolio: Portfolio) {
  const uid = currentUserId;
  if (!uid) return;
  latest.portfolio = portfolio;
  void writeCache(PORTFOLIO, uid, portfolio);
  debouncePush('portfolio', () => db.savePortfolio(uid, latest.portfolio as Portfolio));
}

export function saveGame(key: GameKey, state: unknown) {
  const uid = currentUserId;
  if (!uid) return;
  const domain = `game:${key}`;
  latest[domain] = state;
  void writeCache(gameCache(key), uid, state);
  debouncePush(domain, () => db.saveGameState(uid, key, latest[domain]));
}

// ─── meta (onboarding answers, tutorial flags, display name) ───────────────────

export async function saveMeta(partial: Partial<AppMeta>) {
  const uid = currentUserId;
  if (!uid) return;
  const current = (latest.meta as AppMeta) ?? (await readCache<AppMeta>(META, uid)) ?? {};
  const next: AppMeta = { ...current, ...partial };
  latest.meta = next;
  await writeCache(META, uid, next);
  debouncePush('meta', () => db.saveGameState(uid, 'meta', latest.meta));
}

export async function saveOnboardingAnswers(answers: QuizAnswers, profileName?: string) {
  await saveMeta(profileName !== undefined ? { onboardingAnswers: answers, profileName } : { onboardingAnswers: answers });
}

/** Mirror a tutorial-seen flag to the cloud (AsyncStorage flag handled by tutorialStorage). */
export async function markTutorialSeen(gameKey: string) {
  const uid = currentUserId;
  if (!uid) return;
  const current = (latest.meta as AppMeta) ?? (await readCache<AppMeta>(META, uid)) ?? {};
  await saveMeta({ tutorialsSeen: { ...(current.tutorialsSeen ?? {}), [gameKey]: true } });
}

// ─── profile ──────────────────────────────────────────────────────────────────

export async function saveDisplayName(displayName: string): Promise<boolean> {
  const uid = currentUserId;
  if (!uid) return false;
  const clean = sanitizeDisplayName(displayName);
  void saveMeta({ profileName: clean }); // keep an offline copy
  return db.saveProfile(uid, { displayName: clean });
}

// ─── budget bridge ─────────────────────────────────────────────────────────────
// BudgetStudio and the AI financial-context builder both read the legacy
// `budgetStorageKey`. On hydrate we seed it from the cloud snapshot so the budget
// follows the user; on save BudgetStudio also calls saveGame('budget', …).

export async function restoreBudgetLegacy(snapshot: unknown): Promise<void> {
  try {
    if (snapshot != null) await AsyncStorage.setItem(budgetStorageKey, JSON.stringify(snapshot));
  } catch {
    // Non-fatal.
  }
}

// ─── flush + foreground resync ─────────────────────────────────────────────────

async function flushOne(uid: string, domain: string): Promise<boolean> {
  if (domain === 'progress') {
    const v = (latest.progress as LessonProgress) ?? (await readCache<LessonProgress>(PROGRESS, uid));
    return v ? db.saveProgress(uid, v) : true;
  }
  if (domain === 'portfolio') {
    const v = (latest.portfolio as Portfolio) ?? (await readCache<Portfolio>(PORTFOLIO, uid));
    return v ? db.savePortfolio(uid, v) : true;
  }
  if (domain === 'meta') {
    const v = (latest.meta as AppMeta) ?? (await readCache<AppMeta>(META, uid));
    return v ? db.saveGameState(uid, 'meta', v) : true;
  }
  if (domain.startsWith('game:')) {
    const key = domain.slice(5);
    const v = latest[domain] ?? (await readCache<unknown>(gameCache(key), uid));
    return v != null ? db.saveGameState(uid, key, v) : true;
  }
  return true;
}

async function flushDirty(): Promise<void> {
  const uid = currentUserId;
  if (!uid) return;
  for (const domain of [...dirty]) {
    const ok = await flushOne(uid, domain);
    if (ok) clearDirty(domain);
  }
}

let foregroundHandler: ((snap: SyncSnapshot) => void) | null = null;
let appStateSub: { remove: () => void } | null = null;

/** Register a handler that receives a fresh cloud snapshot on each foreground. */
export function subscribeForeground(handler: (snap: SyncSnapshot) => void): () => void {
  foregroundHandler = handler;
  if (!appStateSub) {
    appStateSub = AppState.addEventListener('change', async (state) => {
      if (state !== 'active') return;
      const uid = currentUserId;
      if (!uid) return;
      await flushDirty();
      const snap = await pullAll(uid);
      foregroundHandler?.(snap);
    });
  }
  return () => { foregroundHandler = null; };
}

// ─── one-time migration of legacy (pre-auth) local data ────────────────────────

export type LegacyLocal = {
  progress: LessonProgress;
  portfolio: Portfolio;
  stockMarket: StockMarketSession | null;
  budget: unknown | null;
  tutorialsSeen: Record<string, boolean>;
};

/** Read the legacy unkeyed AsyncStorage state written before auth existed. */
export async function readLegacyLocal(): Promise<LegacyLocal> {
  const [progress, portfolio, stockMarket] = await Promise.all([
    loadLegacyProgress(),
    loadLegacyPortfolio(),
    loadLegacyStock().catch(() => null),
  ]);
  let budget: unknown | null = null;
  const tutorialsSeen: Record<string, boolean> = {};
  try {
    const raw = await AsyncStorage.getItem(budgetStorageKey);
    if (raw) budget = JSON.parse(raw);
  } catch {
    // ignore
  }
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (const k of keys) {
      const m = /^@coinly_tutorial_seen_(.+)_v1$/.exec(k);
      if (m) tutorialsSeen[m[1]] = true;
    }
  } catch {
    // ignore
  }
  return { progress, portfolio, stockMarket, budget, tutorialsSeen };
}

/** True when cloud is still at defaults AND meaningful local data exists (once per account/device). */
export async function shouldOfferMigration(userId: string): Promise<boolean> {
  const prompted = await AsyncStorage.getItem(userKey(MIGRATION_FLAG, userId));
  if (prompted) return false;
  const cloud = await db.loadProgress(userId);
  const cloudEmpty = !cloud || ((cloud.xp ?? 0) === 0 && (cloud.completedLessonIds?.length ?? 0) === 0);
  if (!cloudEmpty) return false;
  const legacy = await loadLegacyProgress();
  return (legacy.xp ?? 0) > 0 || (legacy.completedLessonIds?.length ?? 0) > 0;
}

export async function markMigrationPrompted(userId: string): Promise<void> {
  await AsyncStorage.setItem(userKey(MIGRATION_FLAG, userId), '1');
}

/** Push legacy local data to the cloud, then mark the prompt as shown. */
export async function runMigration(userId: string, legacy: LegacyLocal): Promise<void> {
  setActiveUser(userId);
  await db.saveProgress(userId, legacy.progress);
  await db.savePortfolio(userId, legacy.portfolio);
  if (legacy.stockMarket) await db.saveGameState(userId, 'stockMarket', legacy.stockMarket);
  if (legacy.budget != null) await db.saveGameState(userId, 'budget', legacy.budget);
  if (Object.keys(legacy.tutorialsSeen).length) await db.saveGameState(userId, 'meta', { tutorialsSeen: legacy.tutorialsSeen });
  await markMigrationPrompted(userId);
}
