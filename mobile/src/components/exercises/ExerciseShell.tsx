import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeedbackBanner from './FeedbackBanner';
import { appColors as colors } from '../../theme';

// Flat heart symbols — text presentation selector prevents emoji rendering
const HEART_FULL  = '♥︎'; // ♥︎ solid heart
const HEART_EMPTY = '♥︎'; // same shape, different opacity via style

type FeedbackState = 'idle' | 'correct' | 'incorrect';

type Props = {
  exerciseIndex: number;
  totalExercises: number;
  mistakes: number;
  maxMistakes: number;
  feedbackState: FeedbackState;
  feedbackRationale: string;
  explainContext?: string;
  onClose: () => void;
  onContinue: () => void;
  children: React.ReactNode;
};

export default function ExerciseShell({
  exerciseIndex,
  totalExercises,
  mistakes,
  maxMistakes,
  feedbackState,
  feedbackRationale,
  explainContext,
  onClose,
  onContinue,
  children,
}: Props) {
  const progress = totalExercises > 0 ? (exerciseIndex / totalExercises) * 100 : 0;
  const heartsLeft = maxMistakes - mistakes;

  return (
    <View style={styles.shell}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.hearts}>
          {Array.from({ length: maxMistakes }).map((_, i) => (
            <Text
              key={i}
              style={[styles.heartIcon, i >= heartsLeft && styles.heartLost]}
            >
              {i < heartsLeft ? HEART_FULL : HEART_EMPTY}
            </Text>
          ))}
        </View>
      </View>

      {/* Exercise content */}
      <View style={styles.content}>{children}</View>

      {/* Feedback banner (slides up from bottom) */}
      <View style={styles.feedbackArea}>
        <FeedbackBanner
          state={feedbackState}
          rationale={feedbackRationale}
          explainContext={explainContext}
          onContinue={onContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#FFFDF4',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: '#6B745F',
    fontWeight: '700',
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#E8E4D4',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F5C142',
    borderRadius: 5,
  },
  hearts: {
    flexDirection: 'row',
    gap: 2,
  },
  heartIcon: {
    fontSize: 14,
    color: '#C0392B',
    includeFontPadding: false,
  },
  heartLost: {
    color: '#D0CCB8',
  },
  content: {
    flex: 1,
  },
  feedbackArea: {
    // FeedbackBanner renders itself when not idle
  },
});
