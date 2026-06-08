/**
 * featureUnlocks — registry mapping unlock keys → lesson IDs that must all
 * be completed before the feature becomes available.
 *
 * Add new entries here to gate any feature behind learning progress.
 * Games, advanced tools, or any future feature can hook in the same way.
 */
import type { LessonProgress } from '../types/lesson';

export type UnlockKey = 'investTab' | 'shortSelling' | 'crypto';

// ─── Registry ─────────────────────────────────────────────────────────────────

// All lesson IDs in the unit whose completion grants this unlock.
// Keep in sync with unit definitions in pathCatalog.ts.
const UNLOCK_LESSONS: Record<UnlockKey, string[]> = {
  // Invest tab: complete Intro to Investing (unit-investing-6)
  investTab: ['inv1-l1', 'inv1-l2', 'inv1-l3', 'inv1-practice', 'inv1-l4', 'inv1-l5'],
  // Short selling: complete Risk, Margin & Short Selling (unit-risk-9)
  shortSelling: ['inv4-l1', 'inv4-l2', 'inv4-l3', 'inv4-practice', 'inv4-l4', 'inv4-l5'],
  // Crypto trading: complete Crypto unit (unit-crypto-10)
  crypto: ['inv5-l1', 'inv5-l2', 'inv5-l3', 'inv5-practice', 'inv5-l4', 'inv5-l5'],
};

/** Unit IDs for navigation — used by lock screens to link to the gating unit. */
export const UNLOCK_UNIT_IDS: Record<UnlockKey, string> = {
  investTab: 'unit-investing-6',
  shortSelling: 'unit-risk-9',
  crypto: 'unit-crypto-10',
};

/** Human-readable unit titles for lock screen copy. */
export const UNLOCK_UNIT_TITLES: Record<UnlockKey, string> = {
  investTab: 'Intro to Investing',
  shortSelling: 'Risk, Margin & Short Selling',
  crypto: 'Crypto',
};

// ─── Public helpers ────────────────────────────────────────────────────────────

export function isFeatureUnlocked(key: UnlockKey, progress: LessonProgress): boolean {
  const ids = UNLOCK_LESSONS[key];
  const done = new Set(progress.completedLessonIds);
  return ids.every((id) => done.has(id));
}

export function featureUnlockProgress(
  key: UnlockKey,
  progress: LessonProgress,
): { done: number; total: number } {
  const ids = UNLOCK_LESSONS[key];
  const done = new Set(progress.completedLessonIds);
  return { done: ids.filter((id) => done.has(id)).length, total: ids.length };
}
