import AsyncStorage from '@react-native-async-storage/async-storage';
import * as cloudSync from './cloudSync';

// One namespaced flag per game. Absent key = tutorial not yet seen (migration-safe).
const keyFor = (gameKey: string) => `@coinly_tutorial_seen_${gameKey}_v1`;

export async function hasSeenTutorial(gameKey: string): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(gameKey));
    return raw === 'true';
  } catch {
    // Non-fatal: treat as not-seen so the offer can still appear.
    return false;
  }
}

export async function setTutorialSeen(gameKey: string): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(gameKey), 'true');
  } catch {
    // Non-fatal: the in-memory tutorial state already reflects completion.
  }
  // Mirror to the cloud so the flag follows the user across devices.
  void cloudSync.markTutorialSeen(gameKey);
}

/** Write cloud tutorial-seen flags into the local keys so useTutorial sees them. */
export async function restoreSeenFromCloud(flags: Record<string, boolean>): Promise<void> {
  try {
    const seen = Object.keys(flags).filter((g) => flags[g]);
    await Promise.all(seen.map((g) => AsyncStorage.setItem(keyFor(g), 'true')));
  } catch {
    // Non-fatal.
  }
}

export async function resetTutorial(gameKey: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(keyFor(gameKey));
  } catch {
    // Non-fatal.
  }
}
