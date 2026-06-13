import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { AnimatedNumber } from '../ui/animations';
import { ICON } from '../ui/icons';

type Props = {
  firstName: string;
  streak: number;
  streakAtRisk: boolean;
  studiedToday: boolean;
  brainBucks: number;
  dailyXpEarned: number;
  dailyXpGoal: number;
};

export default function HomeHeader({
  firstName,
  streak,
  streakAtRisk,
  studiedToday,
  brainBucks,
  dailyXpEarned,
  dailyXpGoal,
}: Props) {
  const goalPercent = Math.min(100, Math.round((dailyXpEarned / Math.max(1, dailyXpGoal)) * 100));
  const goalMet = dailyXpEarned >= dailyXpGoal;
  const streakLabel = streak === 0 ? 'START A STREAK' : streakAtRisk ? 'STREAK AT RISK' : 'STREAK SAFE';

  // Gentle pulse on the streak pill while it's at risk — motion draws the eye
  // to the one thing that loses value at midnight.
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!streakAtRisk) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [streakAtRisk, pulse]);

  const goalFill = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(goalFill, {
      toValue: goalPercent,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width interpolation can't run on the native driver
    }).start();
  }, [goalPercent, goalFill]);

  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>
        <Text style={styles.greetingEyebrow}>{getGreeting()}, </Text>
        <Text style={styles.greetingName}>{firstName}</Text>
      </Text>

      <View style={styles.pillRow}>
        <Animated.View style={[styles.pill, streakAtRisk && styles.pillAtRisk, { opacity: pulse }]}>
          <Text style={[styles.pillIcon, streakAtRisk && styles.pillTextAtRisk]}>{ICON.flame}</Text>
          {streak > 0 ? (
            <AnimatedNumber value={streak} style={[styles.pillValue, streakAtRisk && styles.pillTextAtRisk]} />
          ) : null}
          <Text style={[styles.pillLabel, streakAtRisk && styles.pillLabelAtRisk]}>{streakLabel}</Text>
        </Animated.View>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>{ICON.diamond}</Text>
          <AnimatedNumber value={brainBucks} style={styles.pillValue} />
          <Text style={styles.pillLabel}>BRAIN BUCKS</Text>
        </View>
      </View>

      <View style={styles.goalBlock}>
        <View style={styles.goalLabelRow}>
          <Text style={styles.goalLabel}>DAILY GOAL</Text>
          <Text style={[styles.goalValue, goalMet && styles.goalValueMet]}>
            {goalMet ? `GOAL MET ${ICON.check}` : `${dailyXpEarned} / ${dailyXpGoal} XP`}
          </Text>
        </View>
        <View style={styles.goalTrack}>
          <Animated.View
            style={[
              styles.goalFill,
              {
                width: goalFill.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
              goalMet && styles.goalFillMet,
            ]}
          />
        </View>
        {!studiedToday ? (
          <Text style={styles.goalHint}>
            {streak > 0 ? 'One lesson today keeps your streak alive.' : 'One short lesson starts your streak.'}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function getGreeting(now: Date = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
  },
  greeting: {
    includeFontPadding: false,
  },
  greetingEyebrow: {
    color: colors.muted,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    lineHeight: 27,
  },
  greetingName: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    lineHeight: 27,
  },
  pillRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
  },
  pillAtRisk: {
    backgroundColor: colors.negative,
  },
  pillIcon: {
    fontSize: 14,
    color: colors.yellow,
    includeFontPadding: false,
  },
  pillValue: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.yellow,
  },
  pillTextAtRisk: {
    color: colors.white,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  pillLabelAtRisk: {
    opacity: 0.95,
  },
  goalBlock: {
    marginTop: 12,
  },
  goalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  goalLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    color: colors.black,
    letterSpacing: 0.8,
  },
  goalValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    color: colors.black,
    letterSpacing: 0.8,
  },
  goalValueMet: {
    color: colors.positive,
  },
  goalTrack: {
    marginTop: 6,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(16, 36, 29, 0.14)',
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.yellow,
  },
  goalFillMet: {
    backgroundColor: colors.positive,
  },
  goalHint: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
