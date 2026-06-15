import type { RefObject } from 'react';
import type { View } from 'react-native';

export type TutorialStep = {
  /** Stable id, used by completeStep() to advance action-gated steps. */
  id: string;
  /** Element to spotlight. Omit (or measure off-screen) for a centered bubble. */
  targetRef?: RefObject<View | null>;
  heading: string;
  body: string;
  /** If true, the overlay hides "Next" and waits for the player to act
   *  (the tap passes through to the real control, which calls completeStep). */
  actionGated?: boolean;
  /** If false, the screen is NOT dimmed/blocked — used for live phases
   *  (e.g. the Lemonade timed round) so the player can keep interacting. */
  dim?: boolean;
};
