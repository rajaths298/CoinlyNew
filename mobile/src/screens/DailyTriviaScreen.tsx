import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TriviaQuestion } from '../data/dailyTrivia';
import type { LessonProgress } from '../types/lesson';

export const TRIVIA_CORRECT_REWARD = 5;
export const TRIVIA_PARTICIPATION_REWARD = 2;

type Props = {
  question: TriviaQuestion;
  lessonProgress: LessonProgress;
  onComplete: (wasCorrect: boolean) => void;
  onBack: () => void;
};

type AnswerState =
  | { phase: 'unanswered' }
  | { phase: 'revealed'; chosenId: string; wasCorrect: boolean };

export default function DailyTriviaScreen({
  question,
  lessonProgress,
  onComplete,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const [answerState, setAnswerState] = useState<AnswerState>({ phase: 'unanswered' });
  const { exercise } = question;
  const triviaStreak = lessonProgress.dailyTrivia?.triviaStreak ?? 0;

  function handleMultipleChoiceAnswer(optionId: string) {
    if (exercise.kind !== 'multipleChoice') return;
    const correct = exercise.options.find((o) => o.isCorrect)?.id === optionId;
    setAnswerState({ phase: 'revealed', chosenId: optionId, wasCorrect: correct });
  }

  function handleTrueFalseAnswer(answer: boolean) {
    if (exercise.kind !== 'trueFalse') return;
    const correct = answer === exercise.isTrue;
    setAnswerState({ phase: 'revealed', chosenId: answer ? 'true' : 'false', wasCorrect: correct });
  }

  function handleScenarioAnswer(choiceId: string) {
    if (exercise.kind !== 'scenarioDecision') return;
    const correct = exercise.choices.find((c) => c.isCorrect)?.id === choiceId;
    setAnswerState({ phase: 'revealed', chosenId: choiceId, wasCorrect: correct });
  }

  const isRevealed = answerState.phase === 'revealed';
  const wasCorrect = isRevealed ? answerState.wasCorrect : false;
  const chosenId = isRevealed ? answerState.chosenId : null;
  const reward = wasCorrect ? TRIVIA_CORRECT_REWARD : TRIVIA_PARTICIPATION_REWARD;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.eyebrow}>TODAY'S CHALLENGE</Text>
          {triviaStreak > 0 && (
            <Text style={styles.streakBadge}>{triviaStreak} day streak</Text>
          )}
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson context */}
        <Text style={styles.lessonLabel}>{question.lessonTitle}</Text>

        {/* Question body */}
        {exercise.kind === 'multipleChoice' && (
          <MultipleChoiceQuestion
            exercise={exercise}
            chosenId={chosenId}
            isRevealed={isRevealed}
            onAnswer={handleMultipleChoiceAnswer}
          />
        )}

        {exercise.kind === 'trueFalse' && (
          <TrueFalseQuestion
            exercise={exercise}
            chosenId={chosenId}
            isRevealed={isRevealed}
            onAnswer={handleTrueFalseAnswer}
          />
        )}

        {exercise.kind === 'scenarioDecision' && (
          <ScenarioQuestion
            exercise={exercise}
            chosenId={chosenId}
            isRevealed={isRevealed}
            onAnswer={handleScenarioAnswer}
          />
        )}

        {/* Reveal panel */}
        {isRevealed && (
          <View style={[styles.resultPanel, wasCorrect ? styles.resultCorrect : styles.resultIncorrect]}>
            <Text style={[styles.resultLabel, wasCorrect ? styles.resultLabelCorrect : styles.resultLabelIncorrect]}>
              {wasCorrect ? 'Correct!' : 'Not quite'}
            </Text>
            <Text style={[styles.resultRationale, wasCorrect ? styles.resultRationaleCorrect : styles.resultRationaleIncorrect]}>
              {exercise.rationale}
            </Text>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>
                +{reward} Brain Bucks
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.doneBtn, wasCorrect ? styles.doneBtnCorrect : styles.doneBtnIncorrect]}
              onPress={() => onComplete(wasCorrect)}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>DONE</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── MultipleChoiceQuestion ───────────────────────────────────────────────────

import type { MultipleChoiceExercise } from '../types/learn';

function MultipleChoiceQuestion({
  exercise,
  chosenId,
  isRevealed,
  onAnswer,
}: {
  exercise: MultipleChoiceExercise;
  chosenId: string | null;
  isRevealed: boolean;
  onAnswer: (id: string) => void;
}) {
  return (
    <View>
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      {exercise.context ? (
        <Text style={styles.context}>{exercise.context}</Text>
      ) : null}
      <View style={styles.optionList}>
        {exercise.options.map((opt) => {
          const isChosen = chosenId === opt.id;
          const isCorrect = opt.isCorrect;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.option,
                !isRevealed && isChosen && styles.optionSelected,
                isRevealed && isCorrect && styles.optionCorrect,
                isRevealed && isChosen && !isCorrect && styles.optionWrong,
              ]}
              onPress={() => !isRevealed && onAnswer(opt.id)}
              activeOpacity={isRevealed ? 1 : 0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  isRevealed && isCorrect && styles.optionTextCorrect,
                  isRevealed && isChosen && !isCorrect && styles.optionTextWrong,
                ]}
              >
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── TrueFalseQuestion ────────────────────────────────────────────────────────

import type { TrueFalseExercise } from '../types/learn';

function TrueFalseQuestion({
  exercise,
  chosenId,
  isRevealed,
  onAnswer,
}: {
  exercise: TrueFalseExercise;
  chosenId: string | null;
  isRevealed: boolean;
  onAnswer: (val: boolean) => void;
}) {
  const correctId = exercise.isTrue ? 'true' : 'false';

  return (
    <View>
      <Text style={styles.prompt}>{exercise.statement}</Text>
      <View style={styles.tfRow}>
        {(['true', 'false'] as const).map((val) => {
          const isChosen = chosenId === val;
          const isCorrect = val === correctId;
          return (
            <TouchableOpacity
              key={val}
              style={[
                styles.tfBtn,
                styles.tfBtnFlex,
                !isRevealed && isChosen && styles.optionSelected,
                isRevealed && isCorrect && styles.optionCorrect,
                isRevealed && isChosen && !isCorrect && styles.optionWrong,
              ]}
              onPress={() => !isRevealed && onAnswer(val === 'true')}
              activeOpacity={isRevealed ? 1 : 0.8}
            >
              <Text
                style={[
                  styles.tfBtnText,
                  isRevealed && isCorrect && styles.optionTextCorrect,
                  isRevealed && isChosen && !isCorrect && styles.optionTextWrong,
                ]}
              >
                {val === 'true' ? 'True' : 'False'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── ScenarioQuestion ─────────────────────────────────────────────────────────

import type { ScenarioExercise } from '../types/learn';

function ScenarioQuestion({
  exercise,
  chosenId,
  isRevealed,
  onAnswer,
}: {
  exercise: ScenarioExercise;
  chosenId: string | null;
  isRevealed: boolean;
  onAnswer: (id: string) => void;
}) {
  return (
    <View>
      <View style={styles.storyBox}>
        <Text style={styles.storyText}>{exercise.story}</Text>
      </View>
      <View style={styles.optionList}>
        {exercise.choices.map((choice) => {
          const isChosen = chosenId === choice.id;
          const isCorrect = choice.isCorrect;
          return (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.option,
                !isRevealed && isChosen && styles.optionSelected,
                isRevealed && isCorrect && styles.optionCorrect,
                isRevealed && isChosen && !isCorrect && styles.optionWrong,
              ]}
              onPress={() => !isRevealed && onAnswer(choice.id)}
              activeOpacity={isRevealed ? 1 : 0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  isRevealed && isCorrect && styles.optionTextCorrect,
                  isRevealed && isChosen && !isCorrect && styles.optionTextWrong,
                ]}
              >
                {choice.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CREAM = '#FFFDF4';
const DARK = '#10241D';
const GOLD = '#F5C142';
const MUTED = '#6B745F';
const BORDER = '#D0CCB8';
const POSITIVE = '#1F7A3D';
const NEGATIVE = '#A33A2F';
const POSITIVE_BG = '#D4EDDA';
const NEGATIVE_BG = '#F8D7DA';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: MUTED,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: MUTED,
    letterSpacing: 1.2,
  },
  streakBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: GOLD,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  lessonLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 4,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    color: DARK,
    lineHeight: 28,
    marginBottom: 20,
  },
  context: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    marginBottom: 16,
    marginTop: -10,
  },
  storyBox: {
    backgroundColor: '#F5F0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  storyText: {
    fontSize: 14,
    color: DARK,
    lineHeight: 21,
  },
  optionList: {
    gap: 10,
  },
  option: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
  },
  optionSelected: {
    borderColor: DARK,
    backgroundColor: '#F0EDE0',
  },
  optionCorrect: {
    borderColor: POSITIVE,
    backgroundColor: POSITIVE_BG,
  },
  optionWrong: {
    borderColor: NEGATIVE,
    backgroundColor: NEGATIVE_BG,
  },
  optionText: {
    fontSize: 15,
    color: DARK,
    fontWeight: '500',
    lineHeight: 21,
  },
  optionTextCorrect: {
    color: '#155724',
    fontWeight: '700',
  },
  optionTextWrong: {
    color: '#721C24',
  },
  tfRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  tfBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfBtnFlex: {
    flex: 1,
  },
  tfBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
  },
  resultPanel: {
    marginTop: 28,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1.5,
  },
  resultCorrect: {
    backgroundColor: POSITIVE_BG,
    borderColor: POSITIVE,
  },
  resultIncorrect: {
    backgroundColor: NEGATIVE_BG,
    borderColor: NEGATIVE,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '800',
  },
  resultLabelCorrect: {
    color: POSITIVE,
  },
  resultLabelIncorrect: {
    color: NEGATIVE,
  },
  resultRationale: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  resultRationaleCorrect: {
    color: '#155724',
  },
  resultRationaleIncorrect: {
    color: '#721C24',
  },
  rewardRow: {
    marginTop: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B8860B',
  },
  doneBtn: {
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
  },
  doneBtnCorrect: {
    backgroundColor: POSITIVE,
  },
  doneBtnIncorrect: {
    backgroundColor: NEGATIVE,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
