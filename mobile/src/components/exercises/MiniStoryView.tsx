import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MiniStoryExercise } from '../../types/learn';
import { ICON } from '../ui/icons';

type Props = {
  exercise: MiniStoryExercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

export default function MiniStoryView({ exercise, onAnswer, answered }: Props) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const showingPanels = panelIndex < exercise.panels.length;
  const currentPanel = exercise.panels[panelIndex];

  function handleNextPanel() {
    setPanelIndex((i) => i + 1);
  }

  function handleChoice(choiceId: string) {
    if (answered) return;
    setSelected(choiceId);
    const choice = exercise.choices.find((c) => c.id === choiceId);
    if (choice) onAnswer(choice.isCorrect);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{ICON.lines}  STORY</Text>
      </View>

      {/* Previous panels */}
      {exercise.panels.slice(0, panelIndex).map((panel, i) => (
        <View key={i} style={styles.panelPrev}>
          {panel.speaker ? <Text style={styles.speaker}>{panel.speaker}</Text> : null}
          <Text style={styles.panelTextPrev}>{panel.text}</Text>
        </View>
      ))}

      {/* Current panel */}
      {showingPanels && currentPanel ? (
        <View style={styles.panel}>
          {currentPanel.speaker ? (
            <Text style={styles.speaker}>{currentPanel.speaker}</Text>
          ) : null}
          <Text style={styles.panelText}>{currentPanel.text}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNextPanel} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>CONTINUE →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Choice point
        <View style={styles.choiceSection}>
          <Text style={styles.choicePrompt}>{exercise.choicePrompt}</Text>
          <View style={styles.choices}>
            {exercise.choices.map((choice) => {
              const isSelected = selected === choice.id;
              return (
                <TouchableOpacity
                  key={choice.id}
                  style={[
                    styles.choice,
                    isSelected && styles.choiceSelected,
                    answered && isSelected && (choice.isCorrect ? styles.choiceCorrect : styles.choiceWrong),
                  ]}
                  onPress={() => handleChoice(choice.id)}
                  disabled={answered}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.choiceText, isSelected && !answered && styles.choiceTextSel]}>
                    {choice.text}
                  </Text>
                  {answered && isSelected && (
                    <Text style={styles.outcomeText}>{choice.outcome}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 14 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10241D',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#F5C142', letterSpacing: 1 },
  panel: {
    backgroundColor: '#F8F5E8',
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F5C142',
  },
  panelPrev: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    opacity: 0.7,
  },
  speaker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B745F',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  panelText: {
    fontSize: 16,
    color: '#10241D',
    lineHeight: 24,
    fontWeight: '500',
  },
  panelTextPrev: {
    fontSize: 14,
    color: '#6B745F',
    lineHeight: 20,
  },
  nextBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#10241D',
    borderRadius: 20,
  },
  nextBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F5C142',
    letterSpacing: 0.5,
  },
  choiceSection: { gap: 12 },
  choicePrompt: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10241D',
    lineHeight: 24,
  },
  choices: { gap: 10 },
  choice: {
    borderWidth: 2,
    borderColor: '#D0CCB8',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
    gap: 4,
  },
  choiceSelected: { borderColor: '#10241D', backgroundColor: '#10241D' },
  choiceCorrect: { borderColor: '#1F7A3D', backgroundColor: '#D4EDDA' },
  choiceWrong: { borderColor: '#A33A2F', backgroundColor: '#F8D7DA' },
  choiceText: { fontSize: 14, fontWeight: '600', color: '#10241D', lineHeight: 20 },
  choiceTextSel: { color: '#fff' },
  outcomeText: { fontSize: 13, color: '#3D4D40', lineHeight: 18, fontStyle: 'italic' },
});
