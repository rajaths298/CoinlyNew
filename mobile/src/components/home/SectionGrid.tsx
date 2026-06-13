import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { appColors as colors } from '../../theme';
import { PressableScale } from '../ui/animations';

export type SectionTab = 'learn' | 'games' | 'budget' | 'explore';

export type SectionCard = {
  tab: SectionTab;
  title: string;
  line: string;
  action: string;
  lineTone?: 'positive' | 'negative';
};

type Props = {
  cards: SectionCard[];
  onNavigate: (tab: SectionTab) => void;
};

export default function SectionGrid({ cards, onNavigate }: Props) {
  return (
    <View style={styles.grid}>
      {cards.map((card) => (
        <PressableScale
          key={card.tab}
          style={styles.cardSlot}
          innerStyle={styles.card}
          onPress={() => onNavigate(card.tab)}
        >
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text
            style={[
              styles.cardLine,
              card.lineTone === 'positive' && styles.cardLinePositive,
              card.lineTone === 'negative' && styles.cardLineNegative,
            ]}
            numberOfLines={2}
          >
            {card.line}
          </Text>
          <Text style={styles.cardAction}>{card.action}</Text>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardSlot: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  card: {
    flex: 1,
    minHeight: 104,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
  },
  cardTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 21,
    color: colors.black,
    letterSpacing: 0.6,
  },
  cardLine: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
    color: colors.muted,
    flexGrow: 1,
  },
  cardLinePositive: {
    color: colors.positive,
    fontWeight: '700',
  },
  cardLineNegative: {
    color: colors.negative,
    fontWeight: '700',
  },
  cardAction: {
    marginTop: 8,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    letterSpacing: 0.8,
  },
});
