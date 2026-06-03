import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CalculatorExercise } from '../../types/learn';

type Props = {
  exercise: CalculatorExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

function calcResult(formulaKey: string, values: Record<string, number>): number {
  switch (formulaKey) {
    case 'opportunityCost':
    case 'compoundGrowth': {
      const p = values['principal'] ?? 1000;
      const r = (values['rate'] ?? 7) / 100;
      const n = values['years'] ?? 10;
      return Math.round(p * Math.pow(1 + r, n));
    }
    case 'emergencyFund': {
      const rent = values['rent'] ?? 0;
      const food = values['food'] ?? 0;
      const utilities = values['utilities'] ?? 0;
      const transport = values['transport'] ?? 0;
      const months = values['months'] ?? 6;
      return Math.round((rent + food + utilities + transport) * months);
    }
    case 'budgetSurplus':
    case 'budgetBalance': {
      const income = values['income'] ?? 0;
      // Support both a single 'expenses' key and a 'fixed'+'variable' split
      const expenses =
        (values['expenses'] ?? 0) +
        (values['fixed'] ?? 0) +
        (values['variable'] ?? 0);
      return Math.round(income - expenses);
    }
    case 'loanPayment': {
      const principal = values['principal'] ?? 1000;
      const r = (values['rate'] ?? 5) / 100 / 12;
      const n = values['months'] ?? 12;
      if (r === 0) return Math.round(principal / n);
      return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    case 'savingsGoal': {
      // Monthly payment needed to reach a future goal
      // PMT = FV × r / ((1+r)^n − 1),  where r = monthly rate, n = months
      const goal = values['goal'] ?? 0;
      const n = Math.max(1, values['months'] ?? 12);
      const annualRate = values['rate'] ?? 0;
      const r = annualRate / 100 / 12;
      if (r === 0) return Math.round(goal / n);
      return Math.round((goal * r) / (Math.pow(1 + r, n) - 1));
    }
    case 'annualCost': {
      const daily = values['daily'] ?? 0;
      const days = values['days'] ?? 365;
      const years = values['years'] ?? 1;
      return Math.round(daily * days * years);
    }
    default:
      return 0;
  }
}

export default function CalculatorView({ exercise, onAnswer, answered }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(exercise.inputs.map((inp) => [inp.id, inp.value])),
  );
  const [submitted, setSubmitted] = useState(false);

  const result = calcResult(exercise.formulaKey, values);

  function adjust(id: string, delta: number) {
    if (answered) return;
    setValues((prev) => {
      const input = exercise.inputs.find((inp) => inp.id === id)!;
      const next = Math.min(input.max, Math.max(input.min, (prev[id] ?? input.value) + delta));
      return { ...prev, [id]: next };
    });
  }

  function handleSubmit() {
    if (answered) return;
    setSubmitted(true);
    onAnswer(true); // calculator exercises are always "correct" once submitted
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <Text style={styles.formula}>{exercise.explanation}</Text>

      {exercise.inputs.map((input) => {
        const val = values[input.id] ?? input.value;
        return (
          <View key={input.id} style={styles.inputRow}>
            <Text style={styles.inputLabel}>{input.label}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => adjust(input.id, -input.step)}
                disabled={answered}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepValue}>
                {input.prefix ?? ''}{val.toLocaleString()}{input.suffix ?? ''}
              </Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => adjust(input.id, input.step)}
                disabled={answered}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>{exercise.targetLabel}</Text>
        <Text style={styles.resultValue}>${result.toLocaleString()}</Text>
      </View>

      {!answered && (
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>CONFIRM</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  prompt: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 26,
  },
  formula: {
    fontSize: 13,
    color: '#6B745F',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#D0CCB8',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10241D',
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5C142',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10241D',
    lineHeight: 24,
  },
  stepValue: {
    minWidth: 80,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#10241D',
  },
  resultBox: {
    backgroundColor: '#F5C142',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 4,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10241D',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10241D',
  },
  submitBtn: {
    backgroundColor: '#10241D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 1,
  },
});
