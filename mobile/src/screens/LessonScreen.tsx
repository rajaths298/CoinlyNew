import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appColors as colors } from '../theme';
import type { CalculatorInput, Lesson, LessonActivity } from '../types/lesson';

type Props = {
  aiHeaderButton?: React.ReactNode;
  lesson: Lesson;
  onBack: () => void;
  onCompleteAndAdvance: (lesson: Lesson) => void;
};

type CalculatorResult = {
  value: number;
  suffix?: string;
  prefix?: string;
};

const reflectionOptions = [
  'I can explain this out loud',
  'I need one more practice rep',
  'Add this to my review queue',
];

export default function LessonScreen({
  aiHeaderButton,
  lesson,
  onBack,
  onCompleteAndAdvance,
}: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const visibleSteps = lesson.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [calculatorValues, setCalculatorValues] = useState<Record<string, number>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const popScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setStepIndex(0);
    setRevealed(false);
    setSelectedOption(null);
    setCalculatorValues({});
    setIsAdvancing(false);
    opacity.setValue(1);
    translateY.setValue(0);
    popScale.setValue(1);
  }, [lesson.id, opacity, popScale, translateY]);

  if (!fontsLoaded) return null;

  const activeStep = visibleSteps[stepIndex];
  const isFinalStep = stepIndex >= Math.max(visibleSteps.length - 1, 0);
  const progress = visibleSteps.length === 0
    ? 100
    : Math.round(((stepIndex + 1) / visibleSteps.length) * 100);
  const canContinue = !activeStep || isActivityReady(activeStep, revealed, selectedOption);

  const animateForward = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 130,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 14,
        duration: 130,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      opacity.setValue(0);
      translateY.setValue(-12);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handlePrimary = () => {
    if (isAdvancing) return;

    if (!activeStep) {
      setIsAdvancing(true);
      onCompleteAndAdvance(lesson);
      return;
    }

    if (activeStep.type === 'reveal' && !revealed) {
      setRevealed(true);
      Animated.sequence([
        Animated.timing(popScale, {
          toValue: 1.04,
          duration: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(popScale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!canContinue) return;

    if (isFinalStep) {
      setIsAdvancing(true);
      onCompleteAndAdvance(lesson);
      return;
    }

    animateForward(() => {
      setRevealed(false);
      setSelectedOption(null);
      setStepIndex((current) => current + 1);
    });
  };

  const adjustCalculatorInput = (step: LessonActivity, input: CalculatorInput, delta: number) => {
    const key = getCalculatorKey(step, input.id);
    const current = calculatorValues[key] ?? input.value;
    const next = Math.max(input.min, Math.min(input.max, current + delta));
    setCalculatorValues((values) => ({ ...values, [key]: next }));
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
          <Text style={styles.headerAction}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.wordmark}>Coinly</Text>
        <View style={styles.headerRightActions}>
          <Text style={styles.headerAction}>{lesson.xp} XP</Text>
          {aiHeaderButton}
        </View>
      </View>

      <View style={styles.stepHud}>
        <View style={styles.stepDots}>
          {visibleSteps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.stepDot,
                index <= stepIndex && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.comboText}>
          STEP {Math.min(stepIndex + 1, Math.max(visibleSteps.length, 1))}/{Math.max(visibleSteps.length, 1)}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
          {activeStep ? (
            <>
              <Text style={styles.eyebrow}>{getStepLabel(activeStep.type)}</Text>
              <Text style={styles.title}>{activeStep.title}</Text>
              <Text style={styles.body}>{activeStep.body}</Text>
              <TagRow values={[lesson.unitTitle, `${lesson.durationMinutes} min`, `Difficulty ${lesson.difficulty}`]} />
              {renderActivity({
                step: activeStep,
                lesson,
                revealed,
                selectedOption,
                calculatorValues,
                onSelectOption: setSelectedOption,
                onReveal: handlePrimary,
                onAdjustCalculatorInput: adjustCalculatorInput,
                popScale,
              })}
            </>
          ) : (
            <>
              <Text style={styles.eyebrow}>LESSON</Text>
              <Text style={styles.title}>{lesson.title}</Text>
              <Text style={styles.body}>
                This lesson has no activities yet. You can still complete it and continue.
              </Text>
            </>
          )}
        </ScrollView>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 22 }]}>
        <TouchableOpacity
          style={[styles.primaryButton, !canContinue && styles.primaryButtonDisabled]}
          activeOpacity={0.86}
          onPress={handlePrimary}
        >
          <Text style={styles.primaryButtonText}>
            {getPrimaryLabel(activeStep, revealed, canContinue, isFinalStep, isAdvancing)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function renderActivity(input: {
  step: LessonActivity;
  lesson: Lesson;
  revealed: boolean;
  selectedOption: string | null;
  calculatorValues: Record<string, number>;
  onSelectOption: (value: string) => void;
  onReveal: () => void;
  onAdjustCalculatorInput: (step: LessonActivity, calculatorInput: CalculatorInput, delta: number) => void;
  popScale: Animated.Value;
}) {
  const {
    step,
    lesson,
    revealed,
    selectedOption,
    calculatorValues,
    onSelectOption,
    onReveal,
    onAdjustCalculatorInput,
    popScale,
  } = input;

  if (step.type === 'reading' || step.type === 'concept') {
    return (
      <View style={styles.metadataPanel}>
        {step.prompt ? (
          <View style={styles.teachingBlock}>
            <Text style={styles.metadataTitle}>KEY IDEA</Text>
            <Text style={styles.metadataText}>{step.prompt}</Text>
          </View>
        ) : null}
        {step.reveal ? (
          <View style={styles.teachingBlock}>
            <Text style={styles.metadataTitle}>WORKED EXAMPLE</Text>
            <Text style={styles.metadataText}>{step.reveal}</Text>
          </View>
        ) : null}
        <Text style={styles.metadataTitle}>LEARNING OBJECTIVES</Text>
        {lesson.learningObjectives.map((objective) => (
          <Text key={objective} style={styles.metadataText}>- {objective}</Text>
        ))}
        <View style={styles.warningBox}>
          <Text style={styles.warningLabel}>COMMON TRAP</Text>
          <Text style={styles.warningText}>{lesson.misconceptions[0]}</Text>
        </View>
      </View>
    );
  }

  if (step.type === 'reveal') {
    return (
      <Animated.View style={{ transform: [{ scale: popScale }] }}>
        <TouchableOpacity
          style={[styles.revealBox, revealed && styles.revealBoxOpen]}
          activeOpacity={0.82}
          onPress={onReveal}
        >
          <Text style={[styles.revealText, revealed && styles.revealTextOpen]}>
            {revealed ? step.reveal : 'Tap the card to unlock the example'}
          </Text>
          <Text style={[styles.revealBadge, revealed && styles.revealBadgeOpen]}>
            {revealed ? '+INSIGHT' : 'LOCKED'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (step.type === 'calculator' && step.calculator) {
    const values = getCalculatorValues(step, calculatorValues);
    const result = computeCalculatorResult(step.calculator.formulaKey, values);
    return (
      <View style={styles.activityPanel}>
        <Text style={styles.promptLabel}>FORMULA</Text>
        <Text style={styles.formulaText}>{step.calculator.formula}</Text>
        <View style={styles.calculatorRows}>
          {step.calculator.inputs.map((calculatorInput) => {
            const value = values[calculatorInput.id] ?? calculatorInput.value;
            return (
              <View key={calculatorInput.id} style={styles.calculatorRow}>
                <View style={styles.calculatorCopy}>
                  <Text style={styles.calculatorLabel}>{calculatorInput.label}</Text>
                  <Text style={styles.calculatorValue}>
                    {formatInputValue(value, calculatorInput)}
                  </Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    activeOpacity={0.8}
                    onPress={() => onAdjustCalculatorInput(step, calculatorInput, -calculatorInput.step)}
                  >
                    <Text style={styles.stepperText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    activeOpacity={0.8}
                    onPress={() => onAdjustCalculatorInput(step, calculatorInput, calculatorInput.step)}
                  >
                    <Text style={styles.stepperText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>{step.calculator.resultLabel}</Text>
          <Text style={styles.resultValue}>{formatCalculatorResult(result)}</Text>
          <Text style={styles.resultExplanation}>{step.calculator.explanation}</Text>
        </View>
      </View>
    );
  }

  if (step.type === 'sort' && step.sortItems) {
    const sortedItems = [...step.sortItems].sort((a, b) => a.rank - b.rank);
    return (
      <View style={styles.activityPanel}>
        <Text style={styles.promptLabel}>{step.prompt ?? 'Pick the first move'}</Text>
        <View style={styles.choiceList}>
          {sortedItems.map((item) => (
            <ChoiceButton
              key={item.id}
              id={item.id}
              text={item.text}
              isSelected={selectedOption === item.id}
              onPress={onSelectOption}
            />
          ))}
        </View>
        {selectedOption ? (
          <Text style={styles.outcomeText}>
            Priority locked. Strong financial decisions usually protect essentials before optimizing upside.
          </Text>
        ) : null}
      </View>
    );
  }

  if (step.type === 'matching' && step.matchingPairs) {
    return (
      <View style={styles.activityPanel}>
        <Text style={styles.promptLabel}>{step.prompt ?? 'Choose a pair'}</Text>
        <View style={styles.choiceList}>
          {step.matchingPairs.map((pair) => (
            <ChoiceButton
              key={pair.id}
              id={pair.id}
              text={`${pair.term}: ${pair.match}`}
              isSelected={selectedOption === pair.id}
              onPress={onSelectOption}
            />
          ))}
        </View>
        {selectedOption ? (
          <Text style={styles.outcomeText}>Connection saved. You are training recall plus use, not flashcard recall alone.</Text>
        ) : null}
      </View>
    );
  }

  if (step.type === 'reflection' && !step.choices) {
    return (
      <View style={styles.activityPanel}>
        <Text style={styles.promptLabel}>REFLECTION</Text>
        <Text style={styles.promptText}>{step.prompt}</Text>
        <View style={styles.choiceList}>
          {reflectionOptions.map((option) => (
            <ChoiceButton
              key={option}
              id={option}
              text={option}
              isSelected={selectedOption === option}
              onPress={onSelectOption}
            />
          ))}
        </View>
      </View>
    );
  }

  const choices = step.choices ?? step.actionChoices ?? [];
  const selectedChoice = choices.find((choice) => choice.id === selectedOption);
  const isQuizLike = step.type === 'quiz' || step.type === 'exam';

  return (
    <View style={styles.activityPanel}>
      {step.scenarioContext ? <Text style={styles.contextText}>{step.scenarioContext}</Text> : null}
      {step.simulationGoal ? <Text style={styles.contextText}>Goal: {step.simulationGoal}</Text> : null}
      {step.projectDeliverable ? <Text style={styles.contextText}>Deliverable: {step.projectDeliverable}</Text> : null}
      <Text style={styles.promptLabel}>{step.question ?? step.prompt ?? 'Choose your move'}</Text>
      <View style={styles.choiceList}>
        {choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            id={choice.id}
            text={choice.text}
            isSelected={selectedOption === choice.id}
            isCorrect={isQuizLike && selectedOption === choice.id ? choice.correct : undefined}
            onPress={onSelectOption}
          />
        ))}
      </View>
      {selectedChoice ? (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackLabel}>
            {isQuizLike && selectedChoice.correct ? 'CORRECT' : isQuizLike ? 'REVIEW THIS' : 'CONSEQUENCE'}
          </Text>
          <Text style={styles.feedbackText}>
            {selectedChoice.outcome ?? step.explanation ?? 'Choice recorded.'}
          </Text>
          {step.explanation ? <Text style={styles.feedbackExplain}>{step.explanation}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

function ChoiceButton({
  id,
  text,
  isSelected,
  isCorrect,
  onPress,
}: {
  id: string;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  onPress: (value: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.choiceButton,
        isSelected && styles.choiceButtonSelected,
        isSelected && isCorrect === false && styles.choiceButtonReview,
      ]}
      activeOpacity={0.82}
      onPress={() => onPress(id)}
    >
      <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>{text}</Text>
    </TouchableOpacity>
  );
}

function TagRow({ values }: { values: string[] }) {
  return (
    <View style={styles.tagRow}>
      {values.map((value) => (
        <View key={value} style={styles.tagChip}>
          <Text style={styles.tagText}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function isActivityReady(step: LessonActivity, revealed: boolean, selectedOption: string | null) {
  if (step.type === 'reveal') return revealed;
  if (step.type === 'calculator' || step.type === 'reading' || step.type === 'concept') return true;
  const hasChoices = Boolean(step.choices?.length || step.actionChoices?.length);
  const hasSortItems = Boolean(step.sortItems?.length);
  const hasMatchingPairs = Boolean(step.matchingPairs?.length);
  if (!hasChoices && !hasSortItems && !hasMatchingPairs && step.type !== 'reflection') return true;
  return Boolean(selectedOption);
}

function getPrimaryLabel(
  step: LessonActivity | undefined,
  revealed: boolean,
  canContinue: boolean,
  isFinalStep: boolean,
  isAdvancing: boolean,
) {
  if (isAdvancing) return 'LOADING NEXT';
  if (!step) return 'COMPLETE & CONTINUE';
  if (canContinue && isFinalStep) return 'COMPLETE & CONTINUE';
  if (!step) return 'CONTINUE';
  if (step.type === 'reveal' && !revealed) return 'UNLOCK CARD';
  if (!canContinue) {
    if (step.type === 'quiz' || step.type === 'exam') return 'PICK AN ANSWER';
    if (step.type === 'project') return 'PICK DELIVERABLE';
    return 'CHOOSE A MOVE';
  }
  if (step.type === 'calculator') return 'SAVE & CONTINUE';
  if (step.type === 'exam') return 'SUBMIT ANSWER';
  if (step.type === 'project') return 'SUBMIT PROJECT';
  return 'CONTINUE';
}

function getStepLabel(stepType: string) {
  const labels: Record<string, string> = {
    concept: 'LEARN',
    reading: 'SEMINAR',
    reveal: 'UNLOCK',
    action: 'CHALLENGE',
    scenario: 'SCENARIO',
    calculator: 'CALCULATOR',
    sort: 'SORT',
    matching: 'MATCH',
    decision: 'DECISION',
    simulation: 'SIMULATION',
    reflection: 'REFLECT',
    quiz: 'QUIZ',
    caseStudy: 'CASE',
    project: 'PROJECT',
    exam: 'EXAM',
  };
  return labels[stepType] ?? stepType.toUpperCase();
}

function getCalculatorValues(step: LessonActivity, calculatorValues: Record<string, number>) {
  const values: Record<string, number> = {};
  step.calculator?.inputs.forEach((input) => {
    values[input.id] = calculatorValues[getCalculatorKey(step, input.id)] ?? input.value;
  });
  return values;
}

function getCalculatorKey(step: LessonActivity, inputId: string) {
  return `${step.id}:${inputId}`;
}

function computeCalculatorResult(formulaKey: string, values: Record<string, number>): CalculatorResult {
  if (formulaKey === 'opportunityCost') {
    return {
      value: Math.max(0, (values.nextBestValue ?? 0) - (values.chosenValue ?? 0)),
      prefix: '$',
    };
  }

  if (formulaKey === 'annualCost') {
    return {
      value: (values.monthlyCost ?? 0) * 12 + (values.extraFees ?? 0),
      prefix: '$',
    };
  }

  if (formulaKey === 'compoundGrowth') {
    const principal = values.principal ?? 0;
    const monthlyContribution = values.contribution ?? 0;
    const monthlyRate = ((values.rate ?? 0) / 100) / 12;
    const months = Math.max(1, (values.years ?? 1) * 12);
    const principalValue = principal * Math.pow(1 + monthlyRate, months);
    const contributionValue = monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    return { value: principalValue + contributionValue, prefix: '$' };
  }

  if (formulaKey === 'loanPayment') {
    const principal = values.principal ?? 0;
    const monthlyRate = ((values.rate ?? 0) / 100) / 12;
    const months = values.months ?? 1;
    const payment = monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return { value: payment, prefix: '$' };
  }

  if (formulaKey === 'deductibleReserve') {
    return {
      value: Math.max(0, (values.deductible ?? 0) + (values.uncovered ?? 0) - (values.cashOnHand ?? 0)),
      prefix: '$',
    };
  }

  if (formulaKey === 'emergencyFund') {
    return {
      value: Math.max(0, (values.monthlyEssentials ?? 0) * (values.months ?? 0) - (values.currentSavings ?? 0)),
      prefix: '$',
    };
  }

  if (formulaKey === 'netWorth') {
    return {
      value: (values.assets ?? 0) - (values.liabilities ?? 0),
      prefix: '$',
    };
  }

  if (formulaKey === 'profitMargin') {
    const revenue = Math.max(1, values.revenue ?? 1);
    return {
      value: (((values.revenue ?? 0) - (values.costs ?? 0) - (values.taxReserve ?? 0)) / revenue) * 100,
      suffix: '%',
    };
  }

  if (formulaKey === 'taxWithholding') {
    return {
      value: Math.max(0, (values.perCheck ?? 0) * (values.checks ?? 0) - (values.credits ?? 0)),
      prefix: '$',
    };
  }

  if (formulaKey === 'portfolioReturn') {
    const stocksWeight = (values.stocksWeight ?? 0) / 100;
    const stockReturn = values.stockReturn ?? 0;
    const bondReturn = values.bondReturn ?? 0;
    return { value: stocksWeight * stockReturn + (1 - stocksWeight) * bondReturn, suffix: '%' };
  }

  if (formulaKey === 'utilization') {
    const limit = Math.max(1, values.limit ?? 1);
    return {
      value: ((values.balance ?? 0) / limit) * 100,
      suffix: '%',
    };
  }

  if (formulaKey === 'savingsGoal') {
    const target = values.target ?? 0;
    const current = values.current ?? 0;
    const months = Math.max(1, values.months ?? 1);
    return { value: Math.max(0, (target - current) / months), prefix: '$' };
  }

  return {
    value: (values.income ?? 0) - (values.fixed ?? 0) - (values.variable ?? 0) - (values.saving ?? 0),
    prefix: '$',
  };
}

function formatCalculatorResult(result: CalculatorResult) {
  const formatted = result.suffix === '%'
    ? result.value.toFixed(1)
    : result.value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `${result.prefix ?? ''}${formatted}${result.suffix ?? ''}`;
}

function formatInputValue(value: number, input: CalculatorInput) {
  return `${input.prefix ?? ''}${value.toLocaleString()}${input.suffix ?? ''}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.green,
  },
  header: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 68,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  headerRightActions: {
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  wordmark: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    includeFontPadding: false,
  },
  stepHud: {
    marginTop: 16,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  stepDots: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  stepDot: {
    flex: 1,
    maxWidth: 28,
    height: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 36, 29, 0.18)',
  },
  stepDotActive: {
    backgroundColor: colors.yellow,
  },
  comboText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  progressTrack: {
    height: 7,
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  card: {
    flex: 1,
    marginTop: 10,
  },
  cardScroll: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 34,
  },
  eyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 21,
  },
  title: {
    marginTop: 10,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
    lineHeight: 44,
    includeFontPadding: false,
  },
  body: {
    marginTop: 16,
    color: colors.black,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  tagRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  tagText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: '900',
  },
  metadataPanel: {
    marginTop: 22,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  teachingBlock: {
    marginBottom: 16,
  },
  metadataTitle: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  metadataText: {
    marginTop: 8,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  warningBox: {
    marginTop: 16,
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 14,
  },
  warningLabel: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  warningText: {
    marginTop: 6,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  revealBox: {
    marginTop: 24,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    minHeight: 96,
    padding: 18,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  revealBoxOpen: {
    backgroundColor: colors.black,
  },
  revealText: {
    color: colors.black,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
  },
  revealTextOpen: {
    color: colors.yellow,
  },
  revealBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  revealBadgeOpen: {
    color: colors.yellow,
  },
  activityPanel: {
    marginTop: 24,
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 16,
  },
  promptLabel: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  promptText: {
    marginTop: 8,
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  contextText: {
    marginBottom: 12,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    opacity: 0.9,
  },
  formulaText: {
    marginTop: 8,
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '900',
  },
  calculatorRows: {
    marginTop: 16,
    gap: 10,
  },
  calculatorRow: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: 'rgba(245, 193, 66, 0.42)',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  calculatorCopy: {
    flex: 1,
  },
  calculatorLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.8,
  },
  calculatorValue: {
    marginTop: 2,
    color: colors.yellow,
    fontSize: 18,
    fontWeight: '900',
  },
  stepper: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    color: colors.buttonText,
    fontSize: 22,
    fontWeight: '900',
  },
  resultBox: {
    marginTop: 16,
    backgroundColor: colors.yellow,
    borderRadius: 8,
    padding: 14,
  },
  resultLabel: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  resultValue: {
    marginTop: 4,
    color: colors.buttonText,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    includeFontPadding: false,
  },
  resultExplanation: {
    marginTop: 8,
    color: colors.buttonText,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '800',
  },
  choiceList: {
    marginTop: 14,
    gap: 10,
  },
  choiceButton: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: colors.yellow,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: colors.yellow,
  },
  choiceButtonReview: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  choiceText: {
    color: colors.yellow,
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 18,
  },
  choiceTextSelected: {
    color: colors.buttonText,
  },
  outcomeText: {
    marginTop: 14,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  feedbackBox: {
    marginTop: 16,
    borderRadius: 8,
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedbackLabel: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  feedbackText: {
    marginTop: 6,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  feedbackExplain: {
    marginTop: 8,
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    opacity: 0.82,
  },
  rewardRow: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rewardPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  rewardPillDark: {
    alignSelf: 'flex-start',
    backgroundColor: colors.black,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  rewardText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  rewardTextDark: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  footer: {
    paddingHorizontal: 24,
  },
  primaryButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 28,
  },
  primaryButtonDisabled: {
    opacity: 0.62,
  },
  primaryButtonText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 23,
  },
});
