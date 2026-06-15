import { useCallback, useEffect, useState } from 'react';
import { hasSeenTutorial, resetTutorial, setTutorialSeen } from '../services/tutorialStorage';
import type { TutorialStep } from '../components/tutorial/types';

export type UseTutorial = {
  isActive: boolean;
  showEntryModal: boolean;
  stepIndex: number;
  totalSteps: number;
  currentStep: TutorialStep | null;
  /** Entry modal "Yes" — begin coaching at step 0. */
  startTutorial: () => void;
  /** Advance a non-gated step ("Next"/"Got it"). */
  advance: () => void;
  /** Called from game handlers; advances only if the active step is gated and matches `id`. */
  completeStep: (id: string) => void;
  /** Skip mid-tutorial or entry "Skip" — marks seen, drops into the game. */
  skip: () => void;
  /** Header "?" — reopen the offer to replay. */
  reset: () => void;
};

/**
 * First-run tutorial controller for a single game.
 * Persistence (the seen flag) is fully self-contained here, so wiring a game
 * needs no App.tsx changes.
 */
export function useTutorial(gameKey: string, steps: TutorialStep[]): UseTutorial {
  const [isActive, setIsActive] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // On first mount: offer the tutorial only if it hasn't been seen yet.
  useEffect(() => {
    let cancelled = false;
    void hasSeenTutorial(gameKey).then((seen) => {
      if (!cancelled && !seen) setShowEntryModal(true);
    });
    return () => {
      cancelled = true;
    };
  }, [gameKey]);

  const finish = useCallback(() => {
    setIsActive(false);
    setShowEntryModal(false);
    setStepIndex(0);
    void setTutorialSeen(gameKey);
  }, [gameKey]);

  const startTutorial = useCallback(() => {
    setShowEntryModal(false);
    setStepIndex(0);
    if (steps.length > 0) {
      setIsActive(true);
    } else {
      void setTutorialSeen(gameKey);
    }
  }, [gameKey, steps.length]);

  const advance = useCallback(() => {
    setStepIndex((index) => {
      const next = index + 1;
      if (next >= steps.length) {
        finish();
        return index;
      }
      return next;
    });
  }, [steps.length, finish]);

  const completeStep = useCallback(
    (id: string) => {
      setStepIndex((index) => {
        const step = steps[index];
        if (!isActive || !step || !step.actionGated || step.id !== id) return index;
        const next = index + 1;
        if (next >= steps.length) {
          finish();
          return index;
        }
        return next;
      });
    },
    [isActive, steps, finish],
  );

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const reset = useCallback(() => {
    void resetTutorial(gameKey);
    setIsActive(false);
    setStepIndex(0);
    setShowEntryModal(true);
  }, [gameKey]);

  const currentStep = isActive ? steps[stepIndex] ?? null : null;

  return {
    isActive,
    showEntryModal,
    stepIndex,
    totalSteps: steps.length,
    currentStep,
    startTutorial,
    advance,
    completeStep,
    skip,
    reset,
  };
}
