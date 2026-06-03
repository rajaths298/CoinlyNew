import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { ICON } from '../ui/icons';

type Props = {
  streak: number;
  brainBucks: number;
  onStreakPress?: () => void;
};

export default function LearnHUD({ streak, brainBucks, onStreakPress }: Props) {
  return (
    <View style={styles.hud}>
      <TouchableOpacity style={styles.pill} onPress={onStreakPress} activeOpacity={0.8}>
        <Text style={styles.pillIcon}>{ICON.flame}</Text>
        <Text style={styles.pillText}>{streak}</Text>
        <Text style={styles.pillLabel}>STREAK</Text>
      </TouchableOpacity>

      <View style={styles.pill}>
        <Text style={styles.pillIcon}>{ICON.diamond}</Text>
        <Text style={styles.pillText}>{brainBucks}</Text>
        <Text style={styles.pillLabel}>BRAIN BUCKS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 0,
    paddingVertical: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  pillIcon: {
    fontSize: 15,
    color: colors.yellow,
    includeFontPadding: false,
  },
  pillText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.yellow,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
});
