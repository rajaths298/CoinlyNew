import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { PopIn } from '../ui/animations';
import { ICON } from '../ui/icons';
import type { DailyQuest } from './homeInsights';

type Props = {
  quests: DailyQuest[];
};

export default function DailyQuestsCard({ quests }: Props) {
  const doneCount = quests.filter((quest) => quest.done).length;
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>DAILY QUESTS</Text>
        <Text style={styles.counter}>{doneCount}/{quests.length}</Text>
      </View>
      {quests.map((quest, index) => (
        <View key={quest.id} style={[styles.row, index > 0 && styles.rowDivider]}>
          <View style={[styles.checkbox, quest.done && styles.checkboxDone]}>
            {quest.done ? (
              <PopIn>
                <Text style={styles.checkmark}>{ICON.check}</Text>
              </PopIn>
            ) : null}
          </View>
          <Text style={[styles.label, quest.done && styles.labelDone]} numberOfLines={1}>
            {quest.label}
          </Text>
          <View style={styles.rewardChip}>
            <Text style={styles.rewardText}>{quest.rewardLabel}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 8,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  eyebrow: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
    color: colors.black,
  },
  counter: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 36, 29, 0.12)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.black,
  },
  checkmark: {
    fontSize: 13,
    color: colors.yellow,
    includeFontPadding: false,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    fontWeight: '600',
  },
  labelDone: {
    color: colors.muted,
  },
  rewardChip: {
    borderWidth: 1.5,
    borderColor: colors.black,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(223, 175, 63, 0.18)',
  },
  rewardText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
    color: colors.black,
    letterSpacing: 0.5,
  },
});
