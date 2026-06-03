import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RecallPromptExercise } from '../../types/learn';
import { ICON } from '../ui/icons';

type Props = {
  exercise: RecallPromptExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

type Phase = 'think' | 'revealed' | 'checked';

export default function RecallPromptView({ exercise, onAnswer, answered }: Props) {
  const [phase, setPhase] = useState<Phase>('think');
  const [checks, setChecks] = useState<Set<number>>(new Set());

  function handleThought() {
    setPhase('revealed');
  }

  function toggleCheck(i: number) {
    if (phase === 'checked') return;
    setChecks((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function handleDone() {
    setPhase('checked');
    // recall prompts always count as "correct" — no wrong answer, just reflection
    onAnswer(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{ICON.diamond}  RECALL</Text>
      </View>

      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {phase === 'think' && (
        <View style={styles.thinkBox}>
          <Text style={styles.thinkHint}>Take a moment to think before tapping below.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleThought} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>I'VE THOUGHT ABOUT IT →</Text>
          </TouchableOpacity>
        </View>
      )}

      {(phase === 'revealed' || phase === 'checked') && (
        <View style={styles.revealBox}>
          <Text style={styles.revealLabel}>THE CONCEPT</Text>
          <Text style={styles.revealText}>{exercise.conceptReveal}</Text>
        </View>
      )}

      {(phase === 'revealed' || phase === 'checked') && (
        <View style={styles.checklistBox}>
          <Text style={styles.checklistLabel}>How did you do? Check off what you got right:</Text>
          {exercise.checkpoints.map((cp, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.checkRow, checks.has(i) && styles.checkRowChecked]}
              onPress={() => toggleCheck(i)}
              disabled={phase === 'checked'}
              activeOpacity={0.8}
            >
              <Text style={styles.checkIcon}>{checks.has(i) ? '✓' : '○'}</Text>
              <Text style={[styles.checkText, checks.has(i) && styles.checkTextChecked]}>{cp}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {phase === 'revealed' && (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  badge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#10241D',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 30,
  },
  thinkBox: {
    backgroundColor: '#FFF8E0',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F5C142',
  },
  thinkHint: {
    fontSize: 14,
    color: '#6B745F',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  revealBox: {
    backgroundColor: '#10241D',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  revealLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 2,
  },
  revealText: {
    fontSize: 15,
    color: '#FFFDF4',
    lineHeight: 23,
    fontWeight: '500',
  },
  checklistBox: {
    gap: 10,
  },
  checklistLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10241D',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#D0CCB8',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  checkRowChecked: {
    borderColor: '#1F7A3D',
    backgroundColor: '#D4EDDA',
  },
  checkIcon: {
    fontSize: 16,
    color: '#10241D',
    marginTop: 1,
  },
  checkText: {
    flex: 1,
    fontSize: 14,
    color: '#10241D',
    lineHeight: 20,
  },
  checkTextChecked: {
    color: '#155724',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#10241D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1,
  },
});
