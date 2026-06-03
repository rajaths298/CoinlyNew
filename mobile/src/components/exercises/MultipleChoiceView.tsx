import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MultipleChoiceExercise } from '../../types/learn';

type Props = {
  exercise: MultipleChoiceExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function MultipleChoiceView({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(optionId: string) {
    if (answered) return;
    setSelected(optionId);
    const option = exercise.options.find((o) => o.id === optionId);
    if (option) onAnswer(option.isCorrect);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {exercise.context ? (
        <View style={styles.contextBox}>
          <Text style={styles.contextText}>{exercise.context}</Text>
        </View>
      ) : null}
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      <View style={styles.options}>
        {exercise.options.map((option) => {
          const isSelected = selected === option.id;
          const showResult = answered && isSelected;
          const optionStyle = [
            styles.option,
            isSelected && styles.optionSelected,
            showResult && (option.isCorrect ? styles.optionCorrect : styles.optionWrong),
          ];
          return (
            <TouchableOpacity
              key={option.id}
              style={optionStyle}
              onPress={() => handleSelect(option.id)}
              activeOpacity={0.75}
              disabled={answered}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  contextBox: {
    backgroundColor: '#F0EDD8',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F5C142',
  },
  contextText: {
    fontSize: 14,
    color: '#3D4D40',
    lineHeight: 20,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 28,
  },
  options: { gap: 10 },
  option: {
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#10241D',
    backgroundColor: '#10241D',
  },
  optionCorrect: {
    borderColor: '#1F7A3D',
    backgroundColor: '#D4EDDA',
  },
  optionWrong: {
    borderColor: '#A33A2F',
    backgroundColor: '#F8D7DA',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10241D',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#fff',
  },
});
