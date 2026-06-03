import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MatchPairsExercise } from '../../types/learn';

type Props = {
  exercise: MatchPairsExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function MatchPairsView({ exercise, onAnswer, answered }: Props) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  const matchedTermIds = new Set(Object.keys(matched));
  const matchedDefIds = new Set(Object.values(matched));

  // Shuffle definitions once (stable)
  const [shuffledDefs] = useState(() => [...exercise.pairs].sort(() => Math.random() - 0.5));

  function handleTermPress(pairId: string) {
    if (answered || matchedTermIds.has(pairId)) return;
    setSelectedTerm(pairId);
    setWrongPair(null);
  }

  function handleDefPress(pairId: string) {
    if (answered || matchedDefIds.has(pairId) || !selectedTerm) return;
    if (selectedTerm === pairId) {
      // correct match
      const newMatched = { ...matched, [selectedTerm]: pairId };
      setMatched(newMatched);
      setSelectedTerm(null);
      // check if all done
      if (Object.keys(newMatched).length === exercise.pairs.length) {
        onAnswer(true);
      }
    } else {
      // wrong pair
      setWrongPair(pairId);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedTerm(null);
        onAnswer(false);
      }, 800);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>
      <View style={styles.columns}>
        <View style={styles.col}>
          {exercise.pairs.map((pair) => (
            <TouchableOpacity
              key={pair.id}
              style={[
                styles.card,
                selectedTerm === pair.id && styles.cardSelected,
                matchedTermIds.has(pair.id) && styles.cardMatched,
              ]}
              onPress={() => handleTermPress(pair.id)}
              disabled={answered || matchedTermIds.has(pair.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cardText, matchedTermIds.has(pair.id) && styles.cardMatchedText]}>
                {pair.term}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.col}>
          {shuffledDefs.map((pair) => (
            <TouchableOpacity
              key={pair.id}
              style={[
                styles.card,
                wrongPair === pair.id && styles.cardWrong,
                matchedDefIds.has(pair.id) && styles.cardMatched,
              ]}
              onPress={() => handleDefPress(pair.id)}
              disabled={answered || matchedDefIds.has(pair.id) || !selectedTerm}
              activeOpacity={0.8}
            >
              <Text style={[styles.cardText, styles.defText, matchedDefIds.has(pair.id) && styles.cardMatchedText]}>
                {pair.definition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  instruction: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 26,
  },
  columns: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
    gap: 8,
  },
  card: {
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 56,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: '#F5C142',
    backgroundColor: '#FFF8E0',
  },
  cardMatched: {
    borderColor: '#1F7A3D',
    backgroundColor: '#D4EDDA',
  },
  cardWrong: {
    borderColor: '#A33A2F',
    backgroundColor: '#F8D7DA',
  },
  cardText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10241D',
    lineHeight: 18,
  },
  defText: {
    fontWeight: '500',
  },
  cardMatchedText: {
    color: '#1F7A3D',
  },
});
