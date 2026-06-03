import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { FillBlankExercise } from '../../types/learn';

type Props = {
  exercise: FillBlankExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function FillBlankView({ exercise, onAnswer, answered }: Props) {
  const [filled, setFilled] = useState<(string | null)[]>(
    new Array(exercise.blanks.length).fill(null),
  );
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const allFilled = filled.every((f) => f !== null);

  function handleWordTap(word: string) {
    if (answered || usedWords.has(word)) return;
    const nextEmptyIndex = filled.findIndex((f) => f === null);
    if (nextEmptyIndex === -1) return;
    const newFilled = [...filled];
    newFilled[nextEmptyIndex] = word;
    setFilled(newFilled);
    setUsedWords((prev) => new Set([...prev, word]));
  }

  function handleBlankTap(index: number) {
    if (answered) return;
    const word = filled[index];
    if (!word) return;
    const newFilled = [...filled];
    newFilled[index] = null;
    setFilled(newFilled);
    setUsedWords((prev) => {
      const next = new Set(prev);
      next.delete(word);
      return next;
    });
  }

  function handleCheck() {
    if (!allFilled || answered) return;
    setSubmitted(true);
    const isCorrect = exercise.blanks.every((blank, i) =>
      filled[i]?.toLowerCase() === blank.toLowerCase(),
    );
    onAnswer(isCorrect);
  }

  // Render the template with blank boxes interspersed
  const parts = exercise.template.split('___');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.instruction}>Fill in the blanks</Text>

      <View style={styles.templateRow}>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <Text style={styles.templateText}>{part}</Text>
            {i < exercise.blanks.length && (
              <TouchableOpacity
                style={[
                  styles.blank,
                  filled[i] && styles.blankFilled,
                  submitted && filled[i]?.toLowerCase() === exercise.blanks[i]?.toLowerCase()
                    ? styles.blankCorrect
                    : submitted && filled[i] !== null
                      ? styles.blankWrong
                      : null,
                ]}
                onPress={() => handleBlankTap(i)}
                disabled={answered}
              >
                <Text style={styles.blankText}>{filled[i] ?? '___'}</Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.wordBank}>
        {exercise.wordBank.map((word) => (
          <TouchableOpacity
            key={word}
            style={[styles.word, usedWords.has(word) && styles.wordUsed]}
            onPress={() => handleWordTap(word)}
            disabled={answered || usedWords.has(word)}
            activeOpacity={0.75}
          >
            <Text style={[styles.wordText, usedWords.has(word) && styles.wordTextUsed]}>
              {word}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {allFilled && !answered && (
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheck} activeOpacity={0.85}>
          <Text style={styles.checkBtnText}>CHECK</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  instruction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B745F',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  templateText: {
    fontSize: 17,
    color: '#10241D',
    fontWeight: '600',
    lineHeight: 26,
  },
  blank: {
    minWidth: 80,
    borderBottomWidth: 2,
    borderBottomColor: '#10241D',
    paddingHorizontal: 6,
    paddingBottom: 2,
    alignItems: 'center',
  },
  blankFilled: {
    backgroundColor: '#F5C142',
    borderRadius: 6,
    borderBottomColor: 'transparent',
  },
  blankCorrect: {
    backgroundColor: '#D4EDDA',
    borderBottomColor: '#1F7A3D',
  },
  blankWrong: {
    backgroundColor: '#F8D7DA',
    borderBottomColor: '#A33A2F',
  },
  blankText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10241D',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  word: {
    borderWidth: 2,
    borderColor: '#10241D',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  wordUsed: {
    borderColor: '#D0CCB8',
    backgroundColor: '#F0EDD8',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10241D',
  },
  wordTextUsed: {
    color: '#A0A8A0',
  },
  checkBtn: {
    backgroundColor: '#10241D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1,
  },
});
