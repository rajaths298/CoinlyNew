import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Lesson, LessonPerformance, RealWorldQuest } from '../types/lesson';
import type { Exercise } from '../types/learn';
import ExerciseShell from '../components/exercises/ExerciseShell';
import FeedbackBanner from '../components/exercises/FeedbackBanner';
import MultipleChoiceView from '../components/exercises/MultipleChoiceView';
import TrueFalseView from '../components/exercises/TrueFalseView';
import FillBlankView from '../components/exercises/FillBlankView';
import MatchPairsView from '../components/exercises/MatchPairsView';
import CategorizeView from '../components/exercises/CategorizeView';
import TapToOrderView from '../components/exercises/TapToOrderView';
import ScenarioView from '../components/exercises/ScenarioView';
import MiniStoryView from '../components/exercises/MiniStoryView';
import CalculatorView from '../components/exercises/CalculatorView';
import RecallPromptView from '../components/exercises/RecallPromptView';
import SliderPlaygroundView from '../components/exercises/SliderPlaygroundView';
import Confetti from '../components/Confetti';
import { ICON } from '../components/ui/icons';
import { appColors as colors } from '../theme';

const MAX_MISTAKES = 3;

type FeedbackState = 'idle' | 'correct' | 'incorrect';

type Props = {
  aiHeaderButton?: React.ReactNode;
  lesson: Lesson;
  currentStreak?: number;
  onBack: () => void;
  onCompleteAndAdvance: (lesson: Lesson, performance?: LessonPerformance) => void;
  onQuestComplete?: (quest: RealWorldQuest) => void;
};

// ─── Summary screen ───────────────────────────────────────────────────────────

type SummaryProps = {
  lesson: Lesson;
  xpEarned: number;
  correctCount: number;
  totalScored: number;
  currentStreak: number;
  onContinue: () => void;
};

function SummaryScreen({ lesson, xpEarned, correctCount, totalScored, currentStreak, onContinue }: SummaryProps) {
  const insets = useSafeAreaInsets();
  const accuracy = totalScored > 0 ? Math.round((correctCount / totalScored) * 100) : 100;
  const isPerfect = accuracy === 100 && totalScored > 0;
  const brainBucksEarned = Math.floor(xpEarned * 0.3);

  return (
    <View style={[summaryStyles.screen, { paddingBottom: insets.bottom + 16 }]}>
      <Confetti />
      <View style={summaryStyles.content}>
        <Text style={summaryStyles.starIcon}>{isPerfect ? ICON.trophy : ICON.star}</Text>
        <Text style={summaryStyles.title}>{isPerfect ? 'Perfect!' : 'Lesson Complete!'}</Text>
        <Text style={summaryStyles.lessonTitle}>{lesson.title}</Text>

        <View style={summaryStyles.statsRow}>
          <View style={summaryStyles.stat}>
            <Text style={summaryStyles.statValue}>+{xpEarned}</Text>
            <Text style={summaryStyles.statLabel}>XP</Text>
          </View>
          {totalScored > 0 && (
            <View style={summaryStyles.stat}>
              <Text style={summaryStyles.statValue}>{accuracy}%</Text>
              <Text style={summaryStyles.statLabel}>Accuracy</Text>
            </View>
          )}
          <View style={summaryStyles.stat}>
            <Text style={summaryStyles.statValue}>+{brainBucksEarned}</Text>
            <Text style={summaryStyles.statLabel}>Brain Bucks</Text>
          </View>
        </View>

        <View style={summaryStyles.streakRow}>
          <Text style={summaryStyles.streakIcon}>{ICON.flame}</Text>
          <Text style={summaryStyles.streakText}>
            {currentStreak > 0 ? `${currentStreak} day streak` : 'Streak started!'}
          </Text>
        </View>

        {isPerfect && (
          <View style={summaryStyles.perfectBadge}>
            <Text style={summaryStyles.perfectText}>
              {ICON.check}  Perfect score! +{Math.round(xpEarned * 0.2)} bonus XP.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={summaryStyles.continueBtn} onPress={onContinue} activeOpacity={0.85}>
        <Text style={summaryStyles.continueBtnText}>CLAIM &amp; CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  starIcon: {
    fontSize: 72,
    color: colors.yellow,
    includeFontPadding: false,
    textAlign: 'center',
  },
  title: { fontSize: 28, fontWeight: '900', color: colors.black },
  lessonTitle: { fontSize: 16, color: colors.muted, fontWeight: '600', textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.yellow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 80,
  },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.black },
  statLabel: { fontSize: 11, fontWeight: '700', color: colors.black, textTransform: 'uppercase' },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.black,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  streakIcon: {
    fontSize: 14,
    color: colors.yellow,
    includeFontPadding: false,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  perfectBadge: {
    backgroundColor: '#D4EDDA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.positive,
    maxWidth: 280,
  },
  perfectText: { fontSize: 13, color: '#155724', fontWeight: '600', textAlign: 'center' },
  continueBtn: {
    backgroundColor: colors.black,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnText: { fontSize: 16, fontWeight: '800', color: colors.yellow, letterSpacing: 1 },
});

// ─── Main lesson player ───────────────────────────────────────────────────────

export default function LessonScreen({ lesson, currentStreak = 0, onBack, onCompleteAndAdvance }: Props) {
  const insets = useSafeAreaInsets();
  const exercises = lesson.exercises ?? [];
  const hasExercises = exercises.length > 0;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalScored, setTotalScored] = useState(0);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  const [answered, setAnswered] = useState(false);
  const [explainContext, setExplainContext] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);

  // Guard against double-tap advancing through exercises
  const advancingRef = useRef(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentExercise = exercises[exerciseIndex];
  const xpEarned = computeXp(lesson.xp, correctCount, totalScored);

  function computeXp(base: number, correct: number, total: number): number {
    if (total === 0) return base;
    const accuracy = correct / total;
    const multiplier = Math.pow(accuracy, 0.5) * 1.2;
    return Math.round(base * multiplier);
  }

  function animateNext() {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 120, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }

  function handleAnswer(isCorrect: boolean) {
    if (answered) return; // guard: reject double-answer
    setAnswered(true);

    const isScored = currentExercise?.kind !== 'recallPrompt';
    if (isScored) {
      setTotalScored((n) => n + 1);
      if (isCorrect) {
        setCorrectCount((n) => n + 1);
      } else {
        setMistakes((m) => Math.min(MAX_MISTAKES, m + 1));
      }
    }

    if (currentExercise?.kind === 'recallPrompt') {
      // Self-assessment — no feedback banner. Auto-advance after a brief pause
      // so the 'checked' phase is visible before moving on.
      setTimeout(() => handleContinue(), 350);
      return;
    }

    setExplainContext(buildExplainContext(currentExercise, isCorrect));
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
  }

  function handleContinue() {
    // Guard: prevent double-taps from skipping two exercises at once
    if (advancingRef.current) return;
    advancingRef.current = true;

    setFeedbackState('idle');
    setAnswered(false);
    setExplainContext('');

    const nextIndex = exerciseIndex + 1;
    if (nextIndex >= exercises.length || mistakes >= MAX_MISTAKES) {
      setShowSummary(true);
      advancingRef.current = false;
      return;
    }

    animateNext();
    setExerciseIndex(nextIndex);
    setExerciseKey((k) => k + 1);

    // Release guard after transition completes
    setTimeout(() => { advancingRef.current = false; }, 350);
  }

  function handleSummaryDone() {
    const performance: LessonPerformance = {
      firstTryCorrectCount: correctCount,
      totalScoredSteps: totalScored,
      hasRushedSteps: false,
    };
    try {
      onCompleteAndAdvance(lesson, performance);
    } catch {
      // Non-blocking: navigate back even if progress save fails
      onCompleteAndAdvance(lesson);
    }
  }

  if (!hasExercises) {
    return <FallbackLessonView lesson={lesson} onBack={onBack} onComplete={() => onCompleteAndAdvance(lesson)} />;
  }

  if (showSummary) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <SummaryScreen
          lesson={lesson}
          xpEarned={xpEarned}
          correctCount={correctCount}
          totalScored={totalScored}
          currentStreak={currentStreak}
          onContinue={handleSummaryDone}
        />
      </SafeAreaView>
    );
  }

  if (!currentExercise) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1 }}>
        <ExerciseShell
          exerciseIndex={exerciseIndex}
          totalExercises={exercises.length}
          mistakes={mistakes}
          maxMistakes={MAX_MISTAKES}
          feedbackState={feedbackState}
          feedbackRationale={currentExercise.rationale}
          explainContext={explainContext}
          onClose={onBack}
          onContinue={handleContinue}
        >
          <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
            <ExerciseRenderer
              key={exerciseKey}
              exercise={currentExercise}
              onAnswer={handleAnswer}
              answered={answered}
            />
          </Animated.View>
        </ExerciseShell>
      </View>
    </SafeAreaView>
  );
}

// ─── Explain-My-Answer context builder ───────────────────────────────────────

function buildExplainContext(exercise: Exercise, isCorrect: boolean): string {
  const result = isCorrect ? 'The learner answered correctly.' : 'The learner answered incorrectly.';
  switch (exercise.kind) {
    case 'multipleChoice': {
      const correct = exercise.options.find((o) => o.isCorrect);
      return `Question: ${exercise.prompt}\nCorrect answer: ${correct?.text ?? '(unknown)'}\n${result}\nHint: ${exercise.rationale}`;
    }
    case 'trueFalse':
      return `Statement: ${exercise.statement}\nCorrect answer: ${exercise.isTrue ? 'True' : 'False'}\n${result}\nHint: ${exercise.rationale}`;
    case 'fillBlank':
      return `Fill-in-the-blank template: ${exercise.template}\nCorrect blanks: ${exercise.blanks.join(', ')}\n${result}\nHint: ${exercise.rationale}`;
    case 'matchPairs':
      return `Match pairs exercise.\nPairs: ${exercise.pairs.map((p) => `${p.term} → ${p.definition}`).join('; ')}\n${result}\nHint: ${exercise.rationale}`;
    case 'categorize':
      return `Categorize exercise: ${exercise.instruction}\nBuckets: ${exercise.buckets.map((b) => b.label).join(', ')}\n${result}\nHint: ${exercise.rationale}`;
    case 'tapToOrder':
      return `Order exercise: ${exercise.instruction}\nCorrect order: ${exercise.items.sort((a, b) => a.rank - b.rank).map((i) => i.text).join(' → ')}\n${result}\nHint: ${exercise.rationale}`;
    case 'scenarioDecision': {
      const best = exercise.choices.find((c) => c.isCorrect);
      return `Scenario: ${exercise.story}\nBest choice: ${best?.text ?? '(unknown)'}\nOutcome: ${best?.outcome ?? ''}\n${result}\nHint: ${exercise.rationale}`;
    }
    case 'miniStory': {
      const best = exercise.choices.find((c) => c.isCorrect);
      return `Mini story exercise. Choice prompt: ${exercise.choicePrompt}\nBest choice: ${best?.text ?? '(unknown)'}\n${result}\nHint: ${exercise.rationale}`;
    }
    default:
      return `Finance exercise (${exercise.kind}).\nHint: ${exercise.rationale}\n${result}`;
  }
}

// ─── Exercise dispatcher ──────────────────────────────────────────────────────

type RendererProps = {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
};

function ExerciseRenderer({ exercise, onAnswer, answered }: RendererProps) {
  switch (exercise.kind) {
    case 'multipleChoice':
      return <MultipleChoiceView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'trueFalse':
      return <TrueFalseView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'fillBlank':
      return <FillBlankView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'matchPairs':
      return <MatchPairsView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'categorize':
      return <CategorizeView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'tapToOrder':
      return <TapToOrderView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'scenarioDecision':
      return <ScenarioView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'miniStory':
      return <MiniStoryView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'calculator':
      return <CalculatorView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'recallPrompt':
      return <RecallPromptView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    case 'sliderPlayground':
      return <SliderPlaygroundView exercise={exercise} onAnswer={onAnswer} answered={answered} />;
    default: {
      // Unknown kind — safe fallback: warn and auto-advance so the lesson can continue
      console.warn('[ExerciseRenderer] Unhandled exercise kind:', (exercise as { kind: string }).kind);
      // Auto-advance via onAnswer on next tick
      setTimeout(() => onAnswer(true), 0);
      return (
        <View style={fallbackExStyles.container}>
          <Text style={fallbackExStyles.text}>Exercise type not yet supported. Skipping…</Text>
        </View>
      );
    }
  }
}

const fallbackExStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
});

// ─── Fallback for old steps-based lessons ────────────────────────────────────

function FallbackLessonView({
  lesson,
  onBack,
  onComplete,
}: {
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[fallbackStyles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={fallbackStyles.header}>
        <TouchableOpacity onPress={onBack} style={fallbackStyles.backBtn}>
          <Text style={fallbackStyles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={fallbackStyles.title} numberOfLines={2}>{lesson.title}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={fallbackStyles.body}>
        <Text style={fallbackStyles.bodyText}>
          {lesson.learningObjectives.join('\n\n') || 'Work through the lesson material and complete it when ready.'}
        </Text>
      </ScrollView>
      <TouchableOpacity style={fallbackStyles.doneBtn} onPress={onComplete} activeOpacity={0.85}>
        <Text style={fallbackStyles.doneBtnText}>MARK COMPLETE</Text>
      </TouchableOpacity>
    </View>
  );
}

const fallbackStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4D4',
    gap: 8,
  },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 14, color: colors.muted, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '800', color: colors.black, lineHeight: 30 },
  body: { padding: 20 },
  bodyText: { fontSize: 15, color: '#3D4D40', lineHeight: 24 },
  doneBtn: {
    margin: 20,
    backgroundColor: colors.black,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 15, fontWeight: '800', color: colors.yellow, letterSpacing: 1 },
});
