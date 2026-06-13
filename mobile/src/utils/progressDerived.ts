// Shared streak / daily-goal derivations, used by both the Home tab and the
// notification scheduler so "studied today" and "goal met" have exactly one
// definition.

import { getLocalDayKey } from './dateKey';
import type { LessonProgress } from '../types/lesson';

export type StreakStatus = {
  studiedToday: boolean;
  atRisk: boolean;
};

export function getStreakStatus(progress: LessonProgress, now: Date = new Date()): StreakStatus {
  const studiedToday = progress.lastStreakDate === getLocalDayKey(now);
  return {
    studiedToday,
    // A 0-day streak has nothing to protect — show neutral framing instead.
    atRisk: progress.streak > 0 && !studiedToday,
  };
}

export type DailyGoalStatus = {
  earned: number;
  goal: number;
  met: boolean;
};

// dailyXpEarned holds yesterday's value until the first lesson of a new day
// resets it, so every read must be gated on studiedToday.
export function getDailyGoalStatus(progress: LessonProgress, now: Date = new Date()): DailyGoalStatus {
  const { studiedToday } = getStreakStatus(progress, now);
  const goal = progress.dailyXpGoal ?? 20;
  const earned = studiedToday ? (progress.dailyXpEarned ?? 0) : 0;
  return { earned, goal, met: earned >= goal };
}
