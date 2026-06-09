import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LessonProgress } from '../types/lesson';

export const lessonProgressStorageKey = 'coinly-lesson-progress-v1';

export const defaultLessonProgress: LessonProgress = {
  completedLessonIds: [],
  xp: 0,
  streak: 0,
  dailyGoal: {
    date: new Date().toISOString().slice(0, 10),
    targetLessons: 1,
    completedToday: 0,
  },
  placementLevel: 'foundations',
};

export async function loadLessonProgress(): Promise<LessonProgress> {
  const raw = await AsyncStorage.getItem(lessonProgressStorageKey);
  if (!raw) return defaultLessonProgress;

  try {
    return normalizeLessonProgress(JSON.parse(raw) as Partial<LessonProgress>);
  } catch {
    return defaultLessonProgress;
  }
}

export async function saveLessonProgress(progress: LessonProgress): Promise<void> {
  await AsyncStorage.setItem(lessonProgressStorageKey, JSON.stringify(normalizeLessonProgress(progress)));
}

export async function resetLessonProgress(): Promise<LessonProgress> {
  await AsyncStorage.removeItem(lessonProgressStorageKey);
  return defaultLessonProgress;
}

export function normalizeLessonProgress(progress: Partial<LessonProgress> | null | undefined): LessonProgress {
  const base = progress ?? {};
  const today = new Date().toISOString().slice(0, 10);
  return {
    completedLessonIds: Array.isArray(base.completedLessonIds) ? base.completedLessonIds : [],
    xp: typeof base.xp === 'number' && Number.isFinite(base.xp) ? base.xp : 0,
    streak: typeof base.streak === 'number' && Number.isFinite(base.streak) ? base.streak : 0,
    activeLessonId: typeof base.activeLessonId === 'string' ? base.activeLessonId : undefined,
    activityResponses: base.activityResponses ?? {},
    lessonAttempts: Array.isArray(base.lessonAttempts) ? base.lessonAttempts : [],
    lastStudiedAt: typeof base.lastStudiedAt === 'string' ? base.lastStudiedAt : undefined,
    dailyGoal: {
      date: base.dailyGoal?.date ?? today,
      targetLessons: typeof base.dailyGoal?.targetLessons === 'number' ? base.dailyGoal.targetLessons : 1,
      completedToday: typeof base.dailyGoal?.completedToday === 'number' ? base.dailyGoal.completedToday : 0,
    },
    placementLevel: base.placementLevel ?? 'foundations',
    mastery: base.mastery ?? {},
    assessmentResults: Array.isArray(base.assessmentResults) ? base.assessmentResults : [],
    reviewQueue: Array.isArray(base.reviewQueue) ? base.reviewQueue : [],
    certificates: Array.isArray(base.certificates) ? base.certificates : [],
  };
}
