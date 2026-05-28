import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AiHeaderButton from './src/components/AiHeaderButton';
import GlobalAiAssistant, { type AiChatMessage } from './src/components/GlobalAiAssistant';
import DashboardScreen from './src/screens/DashboardScreen';
import GameScreen from './src/screens/GameScreen';
import LessonScreen from './src/screens/LessonScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignupScreen from './src/screens/SignupScreen';
import StartScreen from './src/screens/StartScreen';
import { getGameDefinition } from './src/data/gameDefinitions';
import {
  applyLessonCompletionToProgress,
  getLessonById,
  getNextLesson,
  getNextLessonAfter,
} from './src/data/lessonCatalog';
import { createInitialLemonadeSession } from './src/engine/lemonadeEngine';
import { createInitialPropertySession } from './src/engine/propertyLadderEngine';
import { askCoinlyAI, getCoinlyAiConnectionHelp, type LearningContext } from './src/services/aiAdvisor';
import { buildCoinlyFinancialContext, type CoinlyAppContext } from './src/services/budgetStorage';
import type { GameId, GameProgress, GameResult, LemonadeSession, PropertySession } from './src/types/game';
import type { Lesson, LessonProgress } from './src/types/lesson';
import type { OnboardingProfile, QuizAnswers, SignupProfile } from './src/types/onboarding';

type Screen = 'start' | 'onboarding' | 'signup' | 'dashboard' | 'lesson' | 'game';
type DevSkipTarget = 'dashboard' | 'lesson';

const initialLessonProgress: LessonProgress = {
  completedLessonIds: [],
  xp: 0,
  streak: 0,
};

const initialGameProgress: GameProgress = {
  results: [],
  inProgress: {},
};

const initialAiMessages: AiChatMessage[] = [{
  id: 'welcome',
  sender: 'ai',
  text: "I'm Coinly AI, ready offline in this app. Ask me about your budget, lessons, games, investing, or goals.",
}];

const devSkipTarget = process.env.EXPO_PUBLIC_COINLY_SKIP as DevSkipTarget | undefined;
const devProfile: OnboardingProfile = {
  user: {
    name: 'Coinly Developer',
    email: 'dev@coinly.local',
  },
  answers: {
    primaryGoal: ['All of the above'],
    experience: ['New'],
    risk: ['Balanced'],
    timeHorizon: ['5+ years'],
    savingHabit: ['Consistent'],
    budgetFocus: ['Saving target'],
    learningStyle: ['Guided lessons'],
    interests: ['Stocks', 'ETFs', 'Crypto'],
  },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>(
    devSkipTarget === 'dashboard' || devSkipTarget === 'lesson' ? devSkipTarget : 'start',
  );
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(
    devSkipTarget ? devProfile.answers : {},
  );
  const [profile, setProfile] = useState<OnboardingProfile | null>(
    devSkipTarget ? devProfile : null,
  );
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>(initialLessonProgress);
  const [gameProgress, setGameProgress] = useState<GameProgress>(initialGameProgress);
  const [lemonadeSession, setLemonadeSession] = useState<LemonadeSession>(() => createInitialLemonadeSession());
  const [propertySession, setPropertySession] = useState<PropertySession>(() => createInitialPropertySession());
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>();
  const [activeGameId, setActiveGameId] = useState<GameId | undefined>();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>(initialAiMessages);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const routeOpacity = useRef(new Animated.Value(1)).current;
  const routeTranslateY = useRef(new Animated.Value(0)).current;
  const activeLesson = profile
    ? getLessonById(activeLessonId) ?? (screen === 'lesson' ? getNextLesson(lessonProgress.completedLessonIds, profile) : undefined)
    : undefined;
  const activeGame = getGameDefinition(activeGameId);

  useEffect(() => {
    routeOpacity.setValue(0);
    routeTranslateY.setValue(18);
    Animated.parallel([
      Animated.timing(routeOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(routeTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [routeOpacity, routeTranslateY, screen]);

  const handleGetStarted = () => {
    setScreen('onboarding');
  };

  const handleDevSkip = (target: DevSkipTarget) => {
    setQuizAnswers(devProfile.answers);
    setProfile(devProfile);
    setLessonProgress(initialLessonProgress);
    setGameProgress(initialGameProgress);
    setLemonadeSession(createInitialLemonadeSession());
    setPropertySession(createInitialPropertySession());
    setActiveLessonId(undefined);
    setActiveGameId(undefined);
    setScreen(target);
  };

  const handleLogIn = () => {
    // TODO: navigate to login screen
    console.log('Log In pressed');
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('signup');
  };

  const handleSignupComplete = (user: SignupProfile) => {
    setProfile({ user, answers: quizAnswers });
    setScreen('dashboard');
  };

  const handleRestart = () => {
    setQuizAnswers({});
    setProfile(null);
    setLessonProgress(initialLessonProgress);
    setGameProgress(initialGameProgress);
    setLemonadeSession(createInitialLemonadeSession());
    setPropertySession(createInitialPropertySession());
    setActiveLessonId(undefined);
    setActiveGameId(undefined);
    setScreen('start');
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setLessonProgress((current) => ({ ...current, activeLessonId: lesson.id }));
    setScreen('lesson');
  };

  const handleCompleteAndAdvanceLesson = (lesson: Lesson) => {
    const completedLessonIds = lessonProgress.completedLessonIds.includes(lesson.id)
      ? lessonProgress.completedLessonIds
      : [...lessonProgress.completedLessonIds, lesson.id];
    const nextLesson = getNextLessonAfter(lesson.id, completedLessonIds, profile ?? undefined);

    setLessonProgress((current) => applyLessonCompletionToProgress(current, lesson));

    if (nextLesson && !completedLessonIds.includes(nextLesson.id)) {
      setActiveLessonId(nextLesson.id);
      setLessonProgress((current) => ({ ...current, activeLessonId: nextLesson.id }));
      setScreen('lesson');
      return;
    }

    setActiveLessonId(undefined);
    setScreen('dashboard');
  };

  const handleLaunchGame = (gameId: GameId) => {
    setActiveGameId(gameId);
    setScreen('game');
  };

  const handleCompleteGame = (result: GameResult) => {
    setGameProgress((current) => ({
      ...current,
      results: [...current.results, result],
    }));
  };

  const buildAppContext = (): CoinlyAppContext => ({
    screen,
    pageTitle: getPageTitle(screen),
    lessonTitle: activeLesson?.title,
    gameTitle: activeGame?.title,
    userName: profile?.user.name,
    answers: profile?.answers ?? quizAnswers,
  });

  const handleSendAiMessage = async () => {
    const text = aiInput.trim();
    if (!text || isAiTyping) return;

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
    };
    const history = aiMessages
      .filter((message) => message.id !== 'welcome')
      .map((message) => ({
        role: message.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: message.text,
      }));

    setAiMessages((current) => [...current, userMessage]);
    setAiInput('');
    setIsAiTyping(true);

    try {
      const financialContext = await buildCoinlyFinancialContext(profile, buildAppContext());

      const learningCtx: LearningContext = {
        completed_lesson_count: lessonProgress.completedLessonIds.length,
        total_xp: lessonProgress.xp,
        streak: lessonProgress.streak,
        active_lesson_title: activeLesson?.title,
        active_game_title: activeGame?.title,
        mastery: lessonProgress.mastery as Record<string, unknown> | undefined,
        recent_game_results: gameProgress.results.slice(-5).map((r) => ({
          gameId: r.gameId,
          competency: r.competency,
          performance: r.performance,
          profit: r.profit,
          feedback: r.feedback,
        })),
      };

      const userProfile: Record<string, unknown> = {
        user: profile?.user,
        answers: profile?.answers,
      };

      const reply = await askCoinlyAI(text, history, financialContext, learningCtx, userProfile);
      setAiMessages((current) => [...current, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
      }]);
    } catch (error) {
      setAiMessages((current) => [...current, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: getCoinlyAiConnectionHelp(error),
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const renderScreen = () => {
    const aiHeaderButton = profile ? <AiHeaderButton onPress={() => setIsAiOpen(true)} /> : undefined;

    if (screen === 'onboarding') {
      return (
        <OnboardingScreen
          aiHeaderButton={aiHeaderButton}
          onBackToStart={() => setScreen('start')}
          onComplete={handleQuizComplete}
        />
      );
    }

    if (screen === 'signup') {
      return (
        <SignupScreen
          aiHeaderButton={aiHeaderButton}
          onBack={() => setScreen('onboarding')}
          onComplete={handleSignupComplete}
        />
      );
    }

    if (screen === 'dashboard' && profile) {
      return (
        <DashboardScreen
          aiHeaderButton={aiHeaderButton}
          profile={profile}
          lessonProgress={lessonProgress}
          gameProgress={gameProgress}
          onOpenLesson={handleOpenLesson}
          onLaunchGame={handleLaunchGame}
        />
      );
    }

    if (screen === 'lesson' && profile) {
      const lesson = getLessonById(activeLessonId)
        ?? getNextLesson(lessonProgress.completedLessonIds, profile);
      if (lesson) {
        return (
          <LessonScreen
            key={lesson.id}
            aiHeaderButton={aiHeaderButton}
            lesson={lesson}
            onBack={() => setScreen('dashboard')}
            onCompleteAndAdvance={handleCompleteAndAdvanceLesson}
          />
        );
      }
    }

    if (screen === 'game' && profile) {
      const game = getGameDefinition(activeGameId);
      if (game) {
        return (
          <GameScreen
            aiHeaderButton={aiHeaderButton}
            game={game}
            lemonadeSession={lemonadeSession}
            propertySession={propertySession}
            onBack={() => setScreen('dashboard')}
            onComplete={handleCompleteGame}
            onUpdateLemonadeSession={setLemonadeSession}
            onUpdatePropertySession={setPropertySession}
          />
        );
      }
    }

    return (
      <StartScreen
        aiHeaderButton={aiHeaderButton}
        onGetStarted={handleGetStarted}
        onLogIn={handleLogIn}
        onDevSkip={handleDevSkip}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <Animated.View
        style={[
          styles.route,
          {
            opacity: routeOpacity,
            transform: [{ translateY: routeTranslateY }],
          },
        ]}
      >
        {renderScreen()}
      </Animated.View>
      {profile && (
        <GlobalAiAssistant
          visible={isAiOpen}
          messages={aiMessages}
          input={aiInput}
          isTyping={isAiTyping}
          onChangeInput={setAiInput}
          onClose={() => setIsAiOpen(false)}
          onSend={handleSendAiMessage}
        />
      )}
    </SafeAreaProvider>
  );
}

function getPageTitle(screen: Screen) {
  if (screen === 'start') return 'Start';
  if (screen === 'onboarding') return 'Onboarding';
  if (screen === 'signup') return 'Signup';
  if (screen === 'dashboard') return 'Dashboard';
  if (screen === 'lesson') return 'Lesson';
  return 'Game';
}

const styles = StyleSheet.create({
  route: {
    flex: 1,
  },
});
