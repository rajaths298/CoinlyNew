import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ScenarioExercise } from '../../types/learn';

type Props = {
  exercise: ScenarioExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function ScenarioView({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(choiceId: string) {
    if (answered) return;
    setSelected(choiceId);
    const choice = exercise.choices.find((c) => c.id === choiceId);
    if (choice) onAnswer(choice.isCorrect);
  }

  const selectedChoice = exercise.choices.find((c) => c.id === selected);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.storyBox}>
        <Text style={styles.storyLabel}>SCENARIO</Text>
        <Text style={styles.storyText}>{exercise.story}</Text>
      </View>

      <Text style={styles.choicePrompt}>What do you do?</Text>

      <View style={styles.choices}>
        {exercise.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isCorrect = choice.isCorrect;
          return (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choice,
                isSelected && styles.choiceSelected,
                answered && isSelected && (isCorrect ? styles.choiceCorrect : styles.choiceWrong),
              ]}
              onPress={() => handleSelect(choice.id)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={[styles.choiceText, isSelected && !answered && styles.choiceTextSelected]}>
                {choice.text}
              </Text>
              {answered && isSelected && (
                <Text style={styles.outcomeText}>{choice.outcome}</Text>
              )}
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
  storyBox: {
    backgroundColor: '#10241D',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  storyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 2,
  },
  storyText: {
    fontSize: 15,
    color: '#FFFDF4',
    lineHeight: 22,
    fontWeight: '500',
  },
  choicePrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10241D',
  },
  choices: { gap: 10 },
  choice: {
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
    gap: 6,
  },
  choiceSelected: {
    borderColor: '#10241D',
    backgroundColor: '#10241D',
  },
  choiceCorrect: {
    borderColor: '#1F7A3D',
    backgroundColor: '#D4EDDA',
  },
  choiceWrong: {
    borderColor: '#A33A2F',
    backgroundColor: '#F8D7DA',
  },
  choiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10241D',
    lineHeight: 20,
  },
  choiceTextSelected: {
    color: '#fff',
  },
  outcomeText: {
    fontSize: 13,
    color: '#3D4D40',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
