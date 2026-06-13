import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AiHeaderButton from './src/components/AiHeaderButton';
import GlobalAiAssistant, { type AiChatMessage } from './src/components/GlobalAiAssistant';
import DashboardScreen from './src/screens/DashboardScreen';
import DailyTriviaScreen, { TRIVIA_CORRECT_REWARD, TRIVIA_PARTICIPATION_REWARD } from './src/screens/DailyTriviaScreen';
import GameScreen from './src/screens/GameScreen';
import LessonScreen from './src/screens/LessonScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignupScreen from './src/screens/SignupScreen';
import StartScreen from './src/screens/StartScreen';
import { getGameDefinition } from './src/data/gameDefinitions';
import {
  applyLessonCompletionToProgress,
  applyQuestCompletionToProgress,
  getLessonById,
  getNextLesson,
  updateReviewItemAfterLesson,
} from './src/data/lessonCatalog';
import { getPathLessonById } from './src/data/pathCatalog';
import { getDailyTriviaQuestion, getTodayDateStr } from './src/data/dailyTrivia';
import { createInitialLemonadeSession } from './src/engine/lemonadeEngine';
import { createInitialPropertySession } from './src/engine/propertyLadderEngine';
import { createInitialStartupSession } from './src/engine/startupStoryEngine';
import { createInitialStockMarketSession } from './src/engine/stockMarketEngine';
import { streamCoinlyAI, getCoinlyAiConnectionHelp, type LearningContext } from './src/services/aiAdvisor';
import { configureNotifications, maybeAskAfterFirstLesson, syncDailyReminder } from './src/services/notifications';
import { loadProgress, saveProgress } from './src/services/progressStorage';
import { loadPortfolio, savePortfolio, INITIAL_PORTFOLIO } from './src/services/portfolioStorage';
import { buildCoinlyFinancialContext, type CoinlyAppContext } from './src/services/budgetStorage';
import { loadStockMarketSession, resetStockMarketSession, saveStockMarketSession } from './src/services/stockMarketStorage';
import { getLocalDayKey } from './src/utils/dateKey';
import type {
  GameId,
  GameProgress,
  GameResult,
  LemonadeSession,
  PropertySession,
  StartupSession,
  StockMarketSession,
} from './src/types/game';
import type { Lesson, LessonPerformance, LessonProgress, RealWorldQuest } from './src/types/lesson';
import type { Portfolio } from './src/types/trading';
import type { OnboardingProfile, QuizAnswers, SignupProfile } from './src/types/onboarding';

type Screen = 'start' | 'onboarding' | 'signup' | 'dashboard' | 'lesson' | 'game' | 'dailyTrivia';
type DevSkipTarget = 'dashboard' | 'lesson';
type DashboardTab = 'home' | 'learn' | 'games' | 'budget' | 'explore';

const initialLessonProgress: LessonProgress = {
  completedLessonIds: [],
  xp: 0,
  streak: 0,
  brainBucks: 0,
  dailyXpGoal: 20,
  dailyXpEarned: 0,
  schemaVersion: 2,
};

const initialGameProgress: GameProgress = {
  results: [],
  inProgress: {},
};

const initialAiMessages: AiChatMessage[] = [{
  id: 'welcome',
  sender: 'ai',
  text: "Hi, I'm Coinly AI",
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
  const [lessonProgress, setLessonProgressRaw] = useState<LessonProgress>(initialLessonProgress);
  const [postLessonTab, setPostLessonTab] = useState<DashboardTab | undefined>();
  const [portfolio, setPortfolioRaw] = useState<Portfolio>(INITIAL_PORTFOLIO);
  const portfolioSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist to AsyncStorage on every progress change (debounced 500 ms)
  const setLessonProgress = useCallback((updater: LessonProgress | ((prev: LessonProgress) => LessonProgress)) => {
    setLessonProgressRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => { void saveProgress(next); }, 500);
      return next;
    });
  }, []);
  // Portfolio: TradingTab calls this directly with the already-saved portfolio,
  // so we just update state here. The tab handles its own debounced savePortfolio calls.
  const setPortfolio = useCallback((p: Portfolio) => {
    setPortfolioRaw(p);
    if (portfolioSaveTimerRef.current) clearTimeout(portfolioSaveTimerRef.current);
    portfolioSaveTimerRef.current = setTimeout(() => { void savePortfolio(p); }, 500);
  }, []);

  const [gameProgress, setGameProgress] = useState<GameProgress>(initialGameProgress);
  const [lemonadeSession, setLemonadeSession] = useState<LemonadeSession>(() => createInitialLemonadeSession());
  const [propertySession, setPropertySession] = useState<PropertySession>(() => createInitialPropertySession());
  const [startupSession, setStartupSession] = useState<StartupSession>(() => createInitialStartupSession());
  const [stockMarketSession, setStockMarketSession] = useState<StockMarketSession>(() => createInitialStockMarketSession());
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>();
  const [activeGameId, setActiveGameId] = useState<GameId | undefined>();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>(initialAiMessages);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const stockMarketSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeOpacity = useRef(new Animated.Value(1)).current;
  const routeTranslateY = useRef(new Animated.Value(0)).current;
  const activeLesson = profile
    ? (activeLessonId ? (getLessonById(activeLessonId) ?? getPathLessonById(activeLessonId)) : undefined) ?? (screen === 'lesson' ? getNextLesson(lessonProgress.completedLessonIds, profile) : undefined)
    : undefined;
  const activeGame = getGameDefinition(activeGameId);

  // Load persisted progress on first mount
  useEffect(() => {
    void configureNotifications();
    loadProgress().then((saved) => {
      if (saved.completedLessonIds.length > 0 || saved.xp > 0) {
        setLessonProgressRaw(saved);
      }
      void syncDailyReminder(saved);
    }).catch(() => {/* non-fatal */});
    loadPortfolio().then((saved) => {
      setPortfolioRaw(saved);
    }).catch(() => {/* non-fatal */});
    loadStockMarketSession()
      .then(setStockMarketSession)
      .catch(() => undefined);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (portfolioSaveTimerRef.current) clearTimeout(portfolioSaveTimerRef.current);
      if (stockMarketSaveTimerRef.current) clearTimeout(stockMarketSaveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the reminder ladder in sync with study state: meeting the daily goal
  // cancels today's 18:00 nudge, and each new day reschedules the next three.
  useEffect(() => {
    void syncDailyReminder(lessonProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonProgress.lastStreakDate, lessonProgress.dailyXpEarned]);

  // Ask for notification permission once, right after the first completed
  // lesson (their first win) — never on a cold first launch.
  useEffect(() => {
    if (lessonProgress.completedLessonIds.length >= 1) {
      void maybeAskAfterFirstLesson(lessonProgress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonProgress.completedLessonIds.length]);

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

  const handleUpdateStockMarketSession = useCallback((session: StockMarketSession) => {
    setStockMarketSession(session);
    if (stockMarketSaveTimerRef.current) clearTimeout(stockMarketSaveTimerRef.current);
    stockMarketSaveTimerRef.current = setTimeout(() => {
      void saveStockMarketSession(session);
    }, 300);
  }, []);

  const handleDevSkip = (target: DevSkipTarget) => {
    setQuizAnswers(devProfile.answers);
    setProfile(devProfile);
    setLessonProgress(initialLessonProgress);
    setGameProgress(initialGameProgress);
    setLemonadeSession(createInitialLemonadeSession());
    setPropertySession(createInitialPropertySession());
    setStartupSession(createInitialStartupSession());
    void saveProgress(initialLessonProgress);
    if (stockMarketSaveTimerRef.current) clearTimeout(stockMarketSaveTimerRef.current);
    void resetStockMarketSession().then(setStockMarketSession);
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
    setStartupSession(createInitialStartupSession());
    void saveProgress(initialLessonProgress);
    if (stockMarketSaveTimerRef.current) clearTimeout(stockMarketSaveTimerRef.current);
    void resetStockMarketSession().then(setStockMarketSession);
    setActiveLessonId(undefined);
    setActiveGameId(undefined);
    setScreen('start');
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setLessonProgress((current) => ({ ...current, activeLessonId: lesson.id }));
    setScreen('lesson');
  };

  const handleOpenDailyTrivia = () => {
    setScreen('dailyTrivia');
  };

  const handleDailyTriviaComplete = (wasCorrect: boolean) => {
    const today = getTodayDateStr();
    setLessonProgress((current) => {
      const prev = current.dailyTrivia;
      let triviaStreak = 1;
      if (prev?.lastTriviaDate) {
        const prevMs = new Date(prev.lastTriviaDate).getTime();
        const todayMs = new Date(today).getTime();
        const diffDays = (todayMs - prevMs) / 86_400_000;
        if (diffDays < 2) triviaStreak = (prev.triviaStreak ?? 0) + 1;
      }
      const question = getDailyTriviaQuestion(today);
      const questionKey = question ? `${question.lessonId}:${question.exerciseIdx}` : '';
      return {
        ...current,
        brainBucks: (current.brainBucks ?? 0) + (wasCorrect ? TRIVIA_CORRECT_REWARD : TRIVIA_PARTICIPATION_REWARD),
        dailyTrivia: {
          date: today,
          questionKey,
          answered: true,
          wasCorrect,
          triviaStreak,
          lastTriviaDate: today,
        },
      };
    });
    setPostLessonTab('home');
    setScreen('dashboard');
  };

  const handleCompleteAndAdvanceLesson = (lesson: Lesson, performance?: LessonPerformance) => {
    const isMixedPractice = lesson.moduleId === 'mixed-practice';
    // Path lessons are those authored in pathCatalog (duo-*, u2-*, u3-*, etc.)
    const isPathLesson = !!getPathLessonById(lesson.id);

    if (isMixedPractice) {
      // Mixed-practice nodes: update review queue, return to path
      const wasCorrect = performance
        ? performance.totalScoredSteps > 0 && performance.firstTryCorrectCount / performance.totalScoredSteps >= 0.6
        : true;
      setLessonProgress((current) => {
        let updated = { ...current, xp: current.xp + lesson.xp };
        for (const sourceLessonId of (lesson.prerequisites.length === 0 ? [] : lesson.prerequisites)) {
          updated = updateReviewItemAfterLesson(updated, sourceLessonId, wasCorrect);
        }
        return updated;
      });
      setActiveLessonId(undefined);
      setPostLessonTab('learn');
      setScreen('dashboard');
      return;
    }

    if (isPathLesson) {
      // Path lessons never chain into the legacy catalog — save and return to path.
      setLessonProgress((current) => applyLessonCompletionToProgress(current, lesson, performance));
      setActiveLessonId(undefined);
      setPostLessonTab('learn');
      setScreen('dashboard');
      return;
    }

    // Legacy catalog lessons — not used in the new path flow; kept for backwards compat
    setLessonProgress((current) => applyLessonCompletionToProgress(current, lesson, performance));
    setActiveLessonId(undefined);
    setScreen('dashboard');
  };

  const handleChestOpened = (chestId: string, reward: { brainBucks: number; xp: number }) => {
    setLessonProgress((current) => ({
      ...current,
      xp: current.xp + reward.xp,
      brainBucks: (current.brainBucks ?? 0) + reward.brainBucks,
      completedChestIds: [...(current.completedChestIds ?? []), chestId],
    }));
  };

  const handleQuestComplete = (quest: RealWorldQuest) => {
    setLessonProgress((current) =>
      applyQuestCompletionToProgress(current, quest.id, quest.xpReward, quest.badgeId),
    );
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
    // gameProgress isn't persisted; this stamp lets the daily game quest
    // survive an app restart.
    setLessonProgress((current) => ({ ...current, lastGamePlayedDate: getLocalDayKey() }));
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

    const aiId = `ai-${Date.now()}`;
    try {
      const financialContext = await buildCoinlyFinancialContext(profile, buildAppContext());

      const learningCtx: LearningContext = {
        completed_lesson_count: lessonProgress.completedLessonIds.length,
        total_xp: lessonProgress.xp,
        streak: lessonProgress.streak,
        active_lesson_title: activeLesson?.title,
        active_game_title: activeGame?.title,
        mastery: lessonProgress.mastery as Record<string, unknown> | undefined,
        review_queue_count: lessonProgress.reviewQueue?.length ?? 0,
        last_studied_at: lessonProgress.lastStudiedAt,
        recent_lesson_attempts: lessonProgress.lessonAttempts?.slice(-3).map((attempt) => ({
          lessonId: attempt.lessonId,
          score: attempt.score,
          maxScore: attempt.maxScore,
          passed: attempt.passed,
          confidence: attempt.confidence,
          missedCompetencyIds: attempt.missedCompetencyIds,
        })),
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

      await streamCoinlyAI(
        text,
        history,
        financialContext,
        learningCtx,
        userProfile,
        (full) => {
          setIsAiTyping(false);
          setAiMessages((current) =>
            current.some((message) => message.id === aiId)
              ? current.map((message) => (message.id === aiId ? { ...message, text: full } : message))
              : [...current, { id: aiId, sender: 'ai', text: full }],
          );
        },
      );
    } catch (error) {
      const help = getCoinlyAiConnectionHelp(error);
      setAiMessages((current) =>
        current.some((message) => message.id === aiId)
          ? current.map((message) => (message.id === aiId ? { ...message, text: message.text || help } : message))
          : [...current, { id: aiId, sender: 'ai', text: help }],
      );
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
          portfolio={portfolio}
          onOpenLesson={handleOpenLesson}
          onLaunchGame={handleLaunchGame}
          onChestOpened={handleChestOpened}
          onUpdatePortfolio={setPortfolio}
          onOpenDailyTrivia={handleOpenDailyTrivia}
          initialTab={postLessonTab}
        />
      );
    }

    if (screen === 'dailyTrivia' && profile) {
      const today = getTodayDateStr();
      const question = getDailyTriviaQuestion(today);
      if (question) {
        return (
          <DailyTriviaScreen
            question={question}
            lessonProgress={lessonProgress}
            onComplete={handleDailyTriviaComplete}
            onBack={() => setScreen('dashboard')}
          />
        );
      }
      // No question available — fall back to dashboard
      setScreen('dashboard');
      return null;
    }

    if (screen === 'lesson' && profile) {
      const lesson = (activeLessonId ? (getLessonById(activeLessonId) ?? getPathLessonById(activeLessonId)) : undefined)
        ?? getNextLesson(lessonProgress.completedLessonIds, profile);
      if (lesson) {
        return (
          <LessonScreen
            key={lesson.id}
            aiHeaderButton={aiHeaderButton}
            lesson={lesson}
            currentStreak={lessonProgress.streak}
            onBack={() => setScreen('dashboard')}
            onCompleteAndAdvance={handleCompleteAndAdvanceLesson}
            onQuestComplete={handleQuestComplete}
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
            startupSession={startupSession}
            stockMarketSession={stockMarketSession}
            onBack={() => setScreen('dashboard')}
            onComplete={handleCompleteGame}
            onUpdateLemonadeSession={setLemonadeSession}
            onUpdatePropertySession={setPropertySession}
            onUpdateStartupSession={setStartupSession}
            onUpdateStockMarketSession={handleUpdateStockMarketSession}
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
  if (screen === 'dailyTrivia') return 'Daily Trivia';
  return 'Game';
}

const styles = StyleSheet.create({
  route: {
    flex: 1,
  },
});
