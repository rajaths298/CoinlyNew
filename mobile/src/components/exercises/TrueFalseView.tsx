import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TrueFalseExercise } from '../../types/learn';

type Props = {
  exercise: TrueFalseExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function TrueFalseView({ exercise, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null);

  function handleSelect(value: boolean) {
    if (answered) return;
    setSelected(value);
    onAnswer(value === exercise.isTrue);
  }

  function buttonStyle(value: boolean) {
    const isSelected = selected === value;
    const isRight = value === exercise.isTrue;
    if (answered && isSelected) {
      return [styles.btn, isRight ? styles.btnCorrect : styles.btnWrong];
    }
    if (isSelected) return [styles.btn, styles.btnSelected];
    return [styles.btn];
  }

  function textStyle(value: boolean) {
    const isSelected = selected === value;
    if (isSelected) return [styles.btnText, styles.btnTextSelected];
    return [styles.btnText];
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>TRUE OR FALSE?</Text>
      </View>
      <Text style={styles.statement}>{exercise.statement}</Text>
      <View style={styles.choices}>
        <TouchableOpacity style={buttonStyle(true)} onPress={() => handleSelect(true)} disabled={answered} activeOpacity={0.8}>
          <Text style={styles.choiceIcon}>✓</Text>
          <Text style={textStyle(true)}>TRUE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyle(false)} onPress={() => handleSelect(false)} disabled={answered} activeOpacity={0.8}>
          <Text style={styles.choiceIcon}>✗</Text>
          <Text style={textStyle(false)}>FALSE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20, alignItems: 'center' },
  badge: {
    backgroundColor: '#10241D',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1.5,
  },
  statement: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10241D',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 8,
  },
  choices: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  btn: {
    flex: 1,
    minHeight: 90,
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnSelected: {
    borderColor: '#10241D',
    backgroundColor: '#10241D',
  },
  btnCorrect: {
    borderColor: '#1F7A3D',
    backgroundColor: '#D4EDDA',
  },
  btnWrong: {
    borderColor: '#A33A2F',
    backgroundColor: '#F8D7DA',
  },
  choiceIcon: {
    fontSize: 24,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10241D',
  },
  btnTextSelected: {
    color: '#fff',
  },
});
