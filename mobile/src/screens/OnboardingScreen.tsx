import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
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
import { colors } from '../theme';
import type { QuizAnswers } from '../types/onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type IntroSlide = {
  eyebrow: string;
  title: string;
  body: string;
};

type QuizQuestion = {
  id: string;
  eyebrow: string;
  title: string;
  options: string[];
  multiple?: boolean;
};

const introSlides: IntroSlide[] = [
  {
    eyebrow: 'SETUP',
    title: 'Build your money map',
    body: 'In about two minutes, Coinly will tune your lessons, budget goals, and investing basics around how you want to grow.',
  },
  {
    eyebrow: 'PERSONALIZE',
    title: 'Answer a few quick taps',
    body: 'No spreadsheets. No pressure. Pick what fits today and unlock a dashboard that feels built for you.',
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    id: 'primaryGoal',
    eyebrow: 'GOAL',
    title: 'What do you want Coinly to help with first?',
    options: ['Grow money', 'Learn investing', 'Budget better', 'All of the above'],
  },
  {
    id: 'experience',
    eyebrow: 'EXPERIENCE',
    title: 'How comfortable are you with investing?',
    options: ['New', 'Some basics', 'Actively investing'],
  },
  {
    id: 'risk',
    eyebrow: 'RISK',
    title: 'What level of risk feels right?',
    options: ['Cautious', 'Balanced', 'Aggressive'],
  },
  {
    id: 'timeHorizon',
    eyebrow: 'TIMING',
    title: 'What timeline are you thinking about?',
    options: ['Short-term', '1-3 years', '5+ years'],
  },
  {
    id: 'savingHabit',
    eyebrow: 'SAVING',
    title: 'How often are you saving money now?',
    options: ['Just starting', 'Sometimes', 'Consistent'],
  },
  {
    id: 'budgetFocus',
    eyebrow: 'BUDGET',
    title: 'Where should your budget focus go?',
    options: ['Spending control', 'Saving target', 'Debt payoff', 'Investing more'],
  },
  {
    id: 'learningStyle',
    eyebrow: 'LEARNING',
    title: 'How do you like to learn?',
    options: ['Quick tips', 'Guided lessons', 'Visual examples', 'Challenges'],
  },
  {
    id: 'interests',
    eyebrow: 'INTERESTS',
    title: 'Pick the topics you care about.',
    options: ['Stocks', 'Crypto', 'ETFs', 'Budgeting', 'Credit', 'Entrepreneurship'],
    multiple: true,
  },
];

type Props = {
  aiHeaderButton?: React.ReactNode;
  onBackToStart: () => void;
  onComplete: (answers: QuizAnswers) => void;
};

export default function OnboardingScreen({ aiHeaderButton, onBackToStart, onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const [slideIndex, setSlideIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const slides = useMemo(
    () => [
      ...introSlides.map((slide) => ({ kind: 'intro' as const, slide })),
      ...quizQuestions.map((question) => ({ kind: 'quiz' as const, question })),
    ],
    [],
  );

  if (!fontsLoaded) return null;

  const activeSlide = slides[slideIndex];
  const quizIndex = slideIndex - introSlides.length;
  const isQuiz = activeSlide.kind === 'quiz';
  const activeAnswer = isQuiz ? answers[activeSlide.question.id] ?? [] : [];
  const isLastSlide = slideIndex === slides.length - 1;
  const canContinue = !isQuiz || activeAnswer.length > 0;
  const progress = isQuiz ? (quizIndex + 1) / quizQuestions.length : 0;

  const animateTo = (nextIndex: number) => {
    if (isAnimating || nextIndex < 0 || nextIndex >= slides.length) return;

    const direction = nextIndex > slideIndex ? 1 : -1;
    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -28 * direction,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSlideIndex(nextIndex);
      translateX.setValue(28 * direction);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => setIsAnimating(false));
    });
  };

  const handleNext = () => {
    if (!canContinue || isAnimating) return;
    if (isLastSlide) {
      onComplete(answers);
      return;
    }
    animateTo(slideIndex + 1);
  };

  const handleBack = () => {
    if (isAnimating) return;
    if (slideIndex === 0) {
      onBackToStart();
      return;
    }
    animateTo(slideIndex - 1);
  };

  const toggleAnswer = (question: QuizQuestion, option: string) => {
    setAnswers((current) => {
      const selected = current[question.id] ?? [];
      if (!question.multiple) {
        return { ...current, [question.id]: [option] };
      }

      const nextSelected = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];
      return { ...current, [question.id]: nextSelected };
    });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.75}>
          <Text style={styles.headerAction}>{slideIndex === 0 ? 'CLOSE' : 'BACK'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Coinly</Text>

        <View style={styles.headerRightActions}>
          <Text style={styles.headerAction}>{isQuiz ? `${quizIndex + 1}/8` : 'INTRO'}</Text>
          {aiHeaderButton}
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${isQuiz ? progress * 100 : 8}%` }]} />
      </View>

      <Animated.View
        style={[
          styles.slide,
          {
            opacity,
            transform: [{ translateX }],
          },
        ]}
      >
        {activeSlide.kind === 'intro' ? (
          <View style={styles.introContent}>
            <Text style={styles.eyebrow}>{activeSlide.slide.eyebrow}</Text>
            <Text style={styles.introTitle}>{activeSlide.slide.title}</Text>
            <Text style={styles.body}>{activeSlide.slide.body}</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.quizContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.eyebrow}>{activeSlide.question.eyebrow}</Text>
            <Text style={styles.questionTitle}>{activeSlide.question.title}</Text>
            {activeSlide.question.multiple ? (
              <Text style={styles.hint}>Choose one or more.</Text>
            ) : null}

            <View style={styles.optionList}>
              {activeSlide.question.options.map((option) => {
                const isSelected = activeAnswer.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    activeOpacity={0.82}
                    onPress={() => toggleAnswer(activeSlide.question, option)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 22 }]}>
        <TouchableOpacity
          style={[styles.nextButton, (!canContinue || isAnimating) && styles.nextButtonDisabled]}
          disabled={!canContinue || isAnimating}
          activeOpacity={0.86}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{isLastSlide ? 'UNLOCK DASHBOARD' : 'NEXT'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.green,
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 58,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  headerRightActions: {
    minWidth: 170,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  headerTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    includeFontPadding: false,
  },
  progressTrack: {
    height: 5,
    marginHorizontal: 24,
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
  },
  introContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 70,
  },
  quizContent: {
    paddingTop: 72,
    paddingBottom: 24,
  },
  eyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  introTitle: {
    maxWidth: SCREEN_WIDTH - 48,
    marginTop: 14,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 58,
    lineHeight: 62,
    includeFontPadding: false,
  },
  questionTitle: {
    marginTop: 14,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 38,
    lineHeight: 43,
    includeFontPadding: false,
  },
  body: {
    marginTop: 24,
    color: colors.black,
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 320,
  },
  hint: {
    marginTop: 14,
    color: colors.black,
    fontSize: 15,
    opacity: 0.72,
  },
  optionList: {
    marginTop: 32,
    gap: 12,
  },
  optionCard: {
    minHeight: 56,
    borderWidth: 2,
    borderColor: colors.black,
    paddingHorizontal: 18,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: colors.black,
  },
  optionText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: colors.yellow,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  nextButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 28,
  },
  nextButtonDisabled: {
    opacity: 0.42,
  },
  nextButtonText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
});
