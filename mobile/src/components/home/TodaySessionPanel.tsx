import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { PressableScale } from '../ui/animations';
import type { Lesson } from '../../types/lesson';

type Props = {
  nextLesson: Lesson | undefined;
  reviewDueCount: number;
  streakAtRisk: boolean;
  onStart?: () => void;
};

export default function TodaySessionPanel({ nextLesson, reviewDueCount, streakAtRisk, onStart }: Props) {
  if (!nextLesson) {
    return (
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>ALL CAUGHT UP</Text>
        <Text style={styles.title}>Unit complete!</Text>
        <Text style={styles.body}>
          You&apos;ve finished all available lessons. Review any unit to keep your streak sharp.
        </Text>
      </View>
    );
  }

  const metaParts = [
    `${nextLesson.exercises?.length ?? 0} exercises`,
    `${nextLesson.xp} XP`,
  ];
  if (reviewDueCount > 0) {
    metaParts.push(`${reviewDueCount} ${reviewDueCount === 1 ? 'review' : 'reviews'} due`);
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.eyebrow}>TODAY&apos;S SESSION</Text>
      <Text style={styles.title}>{nextLesson.title}</Text>
      <Text style={styles.body}>{metaParts.join(' · ')}</Text>
      <PressableScale innerStyle={styles.button} activeScale={0.97} onPress={onStart}>
        <Text style={styles.buttonText}>
          {streakAtRisk ? 'PROTECT YOUR STREAK' : "START TODAY'S SESSION"}
        </Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 16,
    backgroundColor: colors.black,
    padding: 16,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  eyebrow: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  title: {
    marginTop: 6,
    color: colors.yellow,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 27,
    lineHeight: 32,
    includeFontPadding: false,
  },
  body: {
    marginTop: 8,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 24,
  },
  buttonText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 21,
  },
});
