import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import SignInScreen from './src/screens/auth/SignInScreen';
import { appColors } from './src/theme';
import AiHeaderButton from './src/components/AiHeaderButton';
import GlobalAiAssistant, { type AiChatMessage } from './src/components/GlobalAiAssistant';
import DashboardScreen from './src/screens/DashboardScreen';
import DailyTriviaScreen, { TRIVIA_CORRECT_REWARD, TRIVIA_PARTICIPATION_REWARD } from './src/screens/DailyTriviaScreen';
import GameScreen from './src/screens/GameScreen';
import LessonScreen from './src/screens/LessonScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
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
import { createInitialStockMarketSession, normalizeStockMarketSession } from './src/engine/stockMarketEngine';
import { streamCoinlyAI, getCoinlyAiConnectionHelp, type LearningContext } from './src/services/aiAdvisor';
import { configureNotifications, maybeAskAfterFirstLesson, syncDailyReminder } from './src/services/notifications';
import { INITIAL_PORTFOLIO } from './src/services/portfolioStorage';
import { buildCoinlyFinancialContext, type CoinlyAppContext } from './src/services/budgetStorage';
import * as cloudSync from './src/services/cloudSync';
import type { SyncSnapshot } from './src/services/cloudSync';
import { restoreSeenFromCloud } from './src/services/tutorialStorage';
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

type Screen = 'start' | 'onboarding' | 'signup' | 'signin' | 'dashboard' | 'lesson' | 'game' | 'dailyTrivia' | 'profile';
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

function AuthedApp() {
  const { user } = useAuth();
  const userId = user?.id;
  const [screen, setScreen] = useState<Screen>(
    devSkipTarget === 'dashboard' || devSkipTarget === 'lesson' ? devSkipTarget : 'start',
  );
  const [migrationOpen, setMigrationOpen] = useState(false);
  // True while a signed-in user's cloud state is loading, so we show the splash
  // instead of flashing the logged-out StartScreen before landing on the dashboard.
  const [hydrating, setHydrating] = useState<boolean>(!!userId);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(
    devSkipTarget ? devProfile.answers : {},
  );
  const [profile, setProfile] = useState<OnboardingProfile | null>(
    devSkipTarget ? devProfile : null,
  );
  const [lessonProgress, setLessonProgressRaw] = useState<LessonProgress>(initialLessonProgress);
  const [postLessonTab, setPostLessonTab] = useState<DashboardTab | undefined>();
  const [portfolio, setPortfolioRaw] = useState<Portfolio>(INITIAL_PORTFOLIO);

  // Progress: update React state, then hand off to cloudSync, which writes the
  // per-user cache immediately and pushes to Supabase on a debounce (with retry).
  const setLessonProgress = useCallback((updater: LessonProgress | ((prev: LessonProgress) => LessonProgress)) => {
    setLessonProgressRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      cloudSync.saveProgress(next);
      return next;
    });
  }, []);
  // Portfolio: TradingTab persists via cloudSync itself; here we mirror the value
  // into React state and the cache/cloud so the rest of the app stays in sync.
  const setPortfolio = useCallback((p: Portfolio) => {
    setPortfolioRaw(p);
    cloudSync.savePortfolio(p);
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
  const routeOpacity = useRef(new Animated.Value(1)).current;
  const routeTranslateY = useRef(new Animated.Value(0)).current;
  const activeLesson = profile
    ? (activeLessonId ? (getLessonById(activeLessonId) ?? getPathLessonById(activeLessonId)) : undefined) ?? (screen === 'lesson' ? getNextLesson(lessonProgress.completedLessonIds, profile) : undefined)
    : undefined;
  const activeGame = getGameDefinition(activeGameId);

  // Apply a cloud snapshot to local state (hydrate / foreground resync / post-
  // migration). Uses the raw setters so re-applying cloud data never re-saves.
  const applySnapshot = useCallback((snap: SyncSnapshot) => {
    if (snap.progress) {
      setLessonProgressRaw(snap.progress);
      void syncDailyReminder(snap.progress);
    }
    if (snap.portfolio) setPortfolioRaw(snap.portfolio);
    if (snap.games.stockMarket) setStockMarketSession(normalizeStockMarketSession(snap.games.stockMarket));
    if (snap.games.lemonade) setLemonadeSession(snap.games.lemonade);
    if (snap.games.property) setPropertySession(snap.games.property);
    if (snap.games.startup) setStartupSession(snap.games.startup);
    if (snap.games.budget != null) void cloudSync.restoreBudgetLegacy(snap.games.budget);
    if (snap.meta?.tutorialsSeen) void restoreSeenFromCloud(snap.meta.tutorialsSeen);
  }, []);

  // Configure notifications once on launch (independent of auth).
  useEffect(() => {
    void configureNotifications();
  }, []);

  // Cloud sync, keyed on the signed-in user. Handles three transitions:
  //  - signed out -> in: hydrate from Supabase (cache fallback), reconstruct the
  //    onboarding profile, offer one-time migration, and re-sync on foreground.
  //  - in -> out: clear in-memory state and return to the logged-out StartScreen.
  //  - launch with a restored session: show the splash until the dashboard loads.
  const prevUserIdRef = useRef<string | undefined>(userId);
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    if (!userId) {
      // Only reset on an actual sign-out (not a logged-out cold start / dev skip).
      if (prevUserId) {
        cloudSync.clearActiveUser();
        setProfile(null);
        setQuizAnswers({});
        setLessonProgressRaw(initialLessonProgress);
        setPortfolioRaw(INITIAL_PORTFOLIO);
        setGameProgress(initialGameProgress);
        setLemonadeSession(createInitialLemonadeSession());
        setPropertySession(createInitialPropertySession());
        setStartupSession(createInitialStartupSession());
        setStockMarketSession(createInitialStockMarketSession());
        setScreen('start');
      }
      setHydrating(false);
      return;
    }

    let cancelled = false;
    setHydrating(true);

    void (async () => {
      const snap = await cloudSync.hydrateAll(userId);
      if (cancelled) return;
      applySnapshot(snap);

      // Reconstruct the onboarding profile from the cloud so a returning user (or
      // a fresh sign-in) lands on the dashboard. After sign-up handleSignupComplete
      // has already set the profile, so this is skipped.
      if (!profile) {
        const answers = snap.meta?.onboardingAnswers ?? {};
        const name =
          snap.profile?.displayName ??
          snap.meta?.profileName ??
          (user?.user_metadata?.display_name as string | undefined) ??
          '';
        setQuizAnswers(answers);
        setProfile({ user: { name, email: user?.email ?? '' }, answers });
        setScreen('dashboard');
      }

      if (await cloudSync.shouldOfferMigration(userId) && !cancelled) {
        setMigrationOpen(true);
      }
      if (!cancelled) setHydrating(false);
    })();

    const unsubscribe = cloudSync.subscribeForeground((snap) => {
      if (!cancelled) applySnapshot(snap);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
    cloudSync.saveGame('stockMarket', session);
  }, []);

  const handleUpdateLemonadeSession = useCallback((session: LemonadeSession) => {
    setLemonadeSession(session);
    cloudSync.saveGame('lemonade', session);
  }, []);

  const handleUpdatePropertySession = useCallback((session: PropertySession) => {
    setPropertySession(session);
    cloudSync.saveGame('property', session);
  }, []);

  const handleUpdateStartupSession = useCallback((session: StartupSession) => {
    setStartupSession(session);
    cloudSync.saveGame('startup', session);
  }, []);

  // Reset every game session to its initial state and persist (dev skip / restart).
  const resetGameSessions = useCallback(() => {
    const lemonade = createInitialLemonadeSession();
    const property = createInitialPropertySession();
    const startup = createInitialStartupSession();
    const stock = createInitialStockMarketSession();
    setLemonadeSession(lemonade);
    setPropertySession(property);
    setStartupSession(startup);
    setStockMarketSession(stock);
    cloudSync.saveGame('lemonade', lemonade);
    cloudSync.saveGame('property', property);
    cloudSync.saveGame('startup', startup);
    cloudSync.saveGame('stockMarket', stock);
  }, []);

  const handleDevSkip = (target: DevSkipTarget) => {
    setQuizAnswers(devProfile.answers);
    setProfile(devProfile);
    setLessonProgress(initialLessonProgress); // persists via cloudSync
    setGameProgress(initialGameProgress);
    resetGameSessions();
    setActiveLessonId(undefined);
    setActiveGameId(undefined);
    setScreen(target);
  };

  const handleLogIn = () => {
    setScreen('signin');
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('signup');
  };

  // Called by the existing SignupScreen AFTER supabase.auth.signUp succeeds.
  const handleSignupComplete = (signupUser: SignupProfile) => {
    setProfile({ user: signupUser, answers: quizAnswers });
    setScreen('dashboard');
    // Persist onboarding answers + chosen name so a new device reconstructs the
    // profile. The session arrives asynchronously from signUp, so resolve the
    // user id explicitly rather than relying on the hydrate effect's timing.
    void (async () => {
      const id = await cloudSync.ensureActiveUser();
      if (!id) return;
      await cloudSync.saveOnboardingAnswers(quizAnswers, signupUser.name);
      await cloudSync.saveDisplayName(signupUser.name);
    })();
  };

  const handleRestart = () => {
    setQuizAnswers({});
    setProfile(null);
    setLessonProgress(initialLessonProgress); // persists via cloudSync
    setGameProgress(initialGameProgress);
    resetGameSessions();
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

  const handleMigrateConfirm = async () => {
    setMigrationOpen(false);
    if (!userId) return;
    const legacy = await cloudSync.readLegacyLocal();
    await cloudSync.runMigration(userId, legacy);
    applySnapshot(await cloudSync.hydrateAll(userId));
  };

  const handleMigrateDecline = async () => {
    setMigrationOpen(false);
    if (userId) await cloudSync.markMigrationPrompted(userId);
  };

  const renderScreen = () => {
    // While a signed-in user's cloud state loads, hold the splash so we never
    // flash the logged-out StartScreen before the dashboard appears.
    if (hydrating && !profile) return <AuthSplash />;

    const aiHeaderButton = profile ? <AiHeaderButton onPress={() => setIsAiOpen(true)} /> : undefined;
    const profileButton = profile ? (
      <ProfileHeaderButton
        initial={(profile.user.name || profile.user.email || '?').trim().charAt(0).toUpperCase()}
        onPress={() => setScreen('profile')}
      />
    ) : null;

    if (screen === 'signin') {
      return (
        <SignInScreen
          onBack={() => setScreen('start')}
          onSignUpLink={() => setScreen('onboarding')}
        />
      );
    }

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
          onGoToLogin={() => setScreen('signin')}
        />
      );
    }

    if (screen === 'dashboard' && profile) {
      return (
        <DashboardScreen
          aiHeaderButton={<>{profileButton}{aiHeaderButton}</>}
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

    if (screen === 'profile' && profile) {
      return (
        <ProfileScreen
          lessonProgress={lessonProgress}
          displayName={profile.user.name}
          onBack={() => setScreen('dashboard')}
          onDisplayNameChange={(name) =>
            setProfile((p) => (p ? { ...p, user: { ...p.user, name } } : p))
          }
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
            onUpdateLemonadeSession={handleUpdateLemonadeSession}
            onUpdatePropertySession={handleUpdatePropertySession}
            onUpdateStartupSession={handleUpdateStartupSession}
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
        onDevSkip={__DEV__ ? handleDevSkip : undefined}
      />
    );
  };

  return (
    <>
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
      <Modal visible={migrationOpen} transparent animationType="fade" onRequestClose={handleMigrateDecline}>
        <View style={styles.migrateBackdrop}>
          <View style={styles.migrateCard}>
            <Text style={styles.migrateTitle}>Import your progress?</Text>
            <Text style={styles.migrateBody}>
              We found existing progress saved on this device. Import it into your account so it syncs across all your devices?
            </Text>
            <TouchableOpacity style={styles.migratePrimary} activeOpacity={0.85} onPress={handleMigrateConfirm}>
              <Text style={styles.migratePrimaryText}>IMPORT PROGRESS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.migrateSecondary} activeOpacity={0.7} onPress={handleMigrateDecline}>
              <Text style={styles.migrateSecondaryText}>NO THANKS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

/** Compact round avatar button shown in the dashboard header to open Profile. */
function ProfileHeaderButton({ initial, onPress }: { initial: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.profileButton} activeOpacity={0.78} onPress={onPress}>
      <Text style={styles.profileButtonText}>{initial}</Text>
    </TouchableOpacity>
  );
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthSplash() {
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold });
  return (
    <View style={styles.splash}>
      {fontsLoaded ? <Text style={styles.splashWordmark}>Coinly</Text> : null}
      <ActivityIndicator color={appColors.black} style={styles.splashSpinner} />
    </View>
  );
}

function AuthGate() {
  const { loading } = useAuth();
  // While the persisted session restores, show the splash. Otherwise the app
  // boots into its existing flow (StartScreen -> onboarding -> sign up / sign in);
  // Supabase auth is wired into those existing screens, and the session controls
  // cloud sync. AuthedApp shows a brief splash while it hydrates a signed-in user.
  if (loading) return <AuthSplash />;
  return <AuthedApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AuthGate />
      </SafeAreaProvider>
    </AuthProvider>
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
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.green,
  },
  splashWordmark: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 64,
    color: appColors.black,
    includeFontPadding: false,
  },
  splashSpinner: {
    marginTop: 20,
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.yellow,
    borderWidth: 2,
    borderColor: appColors.black,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 3,
  },
  profileButtonText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: appColors.black,
    includeFontPadding: false,
  },
  migrateBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,36,29,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  migrateCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: appColors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: appColors.black,
    padding: 24,
  },
  migrateTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: appColors.black,
    includeFontPadding: false,
    marginBottom: 12,
  },
  migrateBody: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: appColors.muted,
    marginBottom: 24,
  },
  migratePrimary: {
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColors.black,
    backgroundColor: appColors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  migratePrimaryText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    letterSpacing: 1,
    color: appColors.black,
  },
  migrateSecondary: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  migrateSecondaryText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 1,
    color: appColors.muted,
  },
});
