import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LessonProgress } from '../types/lesson';

const STORAGE_KEY = '@coinly_progress_v2';

const defaultProgress: LessonProgress = {
  completedLessonIds: [],
  xp: 0,
  streak: 0,
  brainBucks: 0,
  dailyXpGoal: 20,
  dailyXpEarned: 0,
  schemaVersion: 2,
};

export async function saveProgress(progress: LessonProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, schemaVersion: 2 }));
  } catch {
    // storage failure is non-fatal — progress lives in React state
  }
}

export async function loadProgress(): Promise<LessonProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed.schemaVersion || (parsed.schemaVersion as number) < 2) {
      return migrate(parsed);
    }
    return parsed as LessonProgress;
  } catch {
    return { ...defaultProgress };
  }
}

export async function clearProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function migrate(old: Record<string, unknown>): LessonProgress {
  const base: LessonProgress = {
    completedLessonIds: (old.completedLessonIds as string[]) ?? [],
    xp: (old.xp as number) ?? 0,
    streak: (old.streak as number) ?? 0,
    brainBucks: 0,
    dailyXpGoal: 20,
    dailyXpEarned: 0,
    completedChestIds: [],
    schemaVersion: 2,
  };
  return { ...old, ...base } as LessonProgress;
}
