import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gameDefinitions } from '../data/gameDefinitions';
import {
  computeNodeStates,
  getNextPathLesson,
  getPathLessonById,
  getPathProgress,
  getPathUnits,
  getUnitMasteryTier,
  getUnitState,
  type UnitState,
} from '../data/pathCatalog';
import LearnHUD from '../components/path/LearnHUD';
import PathNodeButton from '../components/path/PathNodeButton';
import PathSegment from '../components/path/PathSegment';
import { fetchMarketAssets, searchAssetsByQuery, fetchLiveQuote, fetchFinanceNews, type MarketAsset, type FinanceNewsItem, type SearchResult } from '../services/marketData';
import { askCoinlyAI, getCoinlyAiConnectionHelp, type FinancialContext } from '../services/aiAdvisor';
import { appColors as colors } from '../theme';
import { ICON } from '../components/ui/icons';
import type { GameDefinition, GameId, GameProgress } from '../types/game';
import type { Lesson, LessonProgress } from '../types/lesson';
import type { OnboardingProfile } from '../types/onboarding';
import BudgetStudio from './BudgetStudio';

type DashboardTab = 'home' | 'learn' | 'games' | 'budget' | 'explore';

type Props = {
  aiHeaderButton?: React.ReactNode;
  profile: OnboardingProfile;
  lessonProgress: LessonProgress;
  gameProgress: GameProgress;
  onOpenLesson: (lesson: Lesson) => void;
  onLaunchGame: (gameId: GameId) => void;
  onChestOpened?: (chestId: string, reward: { brainBucks: number; xp: number }) => void;
  initialTab?: DashboardTab;
};

const tabItems: Array<{ id: DashboardTab; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'learn', label: 'Learn', icon: 'L' },
  { id: 'games', label: 'Games', icon: 'G' },
  { id: 'budget', label: 'Budget', icon: 'B' },
  { id: 'explore', label: 'Explore', icon: 'E' },
];

export default function DashboardScreen({
  aiHeaderButton,
  profile,
  lessonProgress,
  gameProgress,
  onOpenLesson,
  onLaunchGame,
  onChestOpened,
  initialTab,
}: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab ?? 'home');
  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>([]);
  const [marketStatus, setMarketStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loadingGame, setLoadingGame] = useState<GameDefinition | null>(null);
  const tabOpacity = useRef(new Animated.Value(1)).current;
  const tabTranslateY = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;

  const nextPathLesson = useMemo(
    () => getNextPathLesson(lessonProgress),
    [lessonProgress],
  );
  const pathProgress = useMemo(
    () => getPathProgress(lessonProgress),
    [lessonProgress],
  );
  const firstName = profile.user.name.split(' ')[0] || profile.user.name;

  useEffect(() => {
    let isMounted = true;

    fetchMarketAssets()
      .then((assets) => {
        if (!isMounted) return;
        setMarketAssets(assets);
        setMarketStatus(assets.some((asset) => asset.isFallback) ? 'fallback' : 'ready');
        setLastUpdated(formatUpdateTime(new Date()));
      })
      .catch(() => {
        if (!isMounted) return;
        setMarketStatus('fallback');
        setLastUpdated(formatUpdateTime(new Date()));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    tabOpacity.setValue(0);
    tabTranslateY.setValue(14);
    Animated.parallel([
      Animated.timing(tabOpacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(tabTranslateY, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, tabOpacity, tabTranslateY]);

  useEffect(() => {
    if (!loadingGame) return;
    loadingProgress.setValue(0);
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [loadingGame, loadingProgress]);

  if (!fontsLoaded) return null;

  if (loadingGame) {
    return (
      <GameLoadingPage
        game={loadingGame}
        insetsTop={insets.top}
        insetsBottom={insets.bottom}
        progress={loadingProgress}
        aiHeaderButton={aiHeaderButton}
        onBack={() => setLoadingGame(null)}
        onContinue={() => {
          const gameId = loadingGame.id;
          setLoadingGame(null);
          if (loadingGame.isPlayable) onLaunchGame(gameId);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 104 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.wordmark}>Coinly</Text>
          <View style={styles.headerRightActions}>
            {aiHeaderButton}
          </View>
        </View>

        <Animated.View
          style={{
            opacity: tabOpacity,
            transform: [{ translateY: tabTranslateY }],
          }}
        >
          {activeTab === 'home' ? (
            <HomeTab
              firstName={firstName}
              lessonProgress={lessonProgress}
              nextPathLesson={nextPathLesson}
              pathProgress={pathProgress}
              marketAssets={marketAssets}
              marketStatus={marketStatus}
              lastUpdated={lastUpdated}
              onStartLesson={nextPathLesson ? () => onOpenLesson(nextPathLesson) : undefined}
            />
          ) : null}

          {activeTab === 'learn' ? (
            <LearnTab
              lessonProgress={lessonProgress}
              profile={profile}
              onOpenLesson={onOpenLesson}
              onChestOpened={onChestOpened}
            />
          ) : null}

          {activeTab === 'games' ? (
            <GamesTab
              lessonProgress={lessonProgress}
              gameProgress={gameProgress}
              onLaunchGame={setLoadingGame}
            />
          ) : null}

          <View style={activeTab === 'budget' ? undefined : styles.hiddenTab}>
            <BudgetStudio profile={profile} />
          </View>

          {activeTab === 'explore' ? (
            <ExploreTab
              profile={profile}
              marketAssets={marketAssets}
              marketStatus={marketStatus}
              lastUpdated={lastUpdated}
            />
          ) : null}
        </Animated.View>
      </ScrollView>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 12 }]}>
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabTextActive]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

type HomeProps = {
  firstName: string;
  lessonProgress: LessonProgress;
  nextPathLesson: Lesson | undefined;
  pathProgress: { completed: number; total: number };
  marketAssets: MarketAsset[];
  marketStatus: 'loading' | 'ready' | 'fallback';
  lastUpdated: string | null;
  onStartLesson?: () => void;
};

function HomeTab({
  firstName,
  lessonProgress,
  nextPathLesson,
  pathProgress,
  marketAssets,
  marketStatus,
  lastUpdated,
  onStartLesson,
}: HomeProps) {
  return (
    <View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TODAY</Text>
        <Text style={styles.title}>Keep learning, {firstName}</Text>
        <Text style={styles.body}>
          Work through bite-sized lessons, build XP, and keep your streak alive on your
          personal finance learning path.
        </Text>
      </View>

      {nextPathLesson ? (
        <View style={styles.featurePanel}>
          <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>CONTINUE</Text>
          <Text style={styles.featureTitle}>{nextPathLesson.title}</Text>
          <Text style={styles.featureBody}>
            {nextPathLesson.exercises?.length ?? 0} exercises · {nextPathLesson.xp} XP
          </Text>
          <TouchableOpacity style={styles.yellowButton} activeOpacity={0.86} onPress={onStartLesson}>
            <Text style={styles.yellowButtonText}>CONTINUE YOUR PATH</Text>
          </TouchableOpacity>
        </View>
      ) : pathProgress.total > 0 ? (
        <View style={styles.featurePanel}>
          <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>ALL CAUGHT UP</Text>
          <Text style={styles.featureTitle}>Unit complete!</Text>
          <Text style={styles.featureBody}>
            You've finished all available lessons. More content coming soon.
          </Text>
        </View>
      ) : null}

      <View style={styles.metricRow}>
        <MetricBox label="XP" value={`${lessonProgress.xp}`} />
        <MetricBox label="Streak" value={`${lessonProgress.streak} DAY`} />
        <MetricBox label="Path" value={`${pathProgress.completed}/${pathProgress.total}`} />
      </View>

      <MarketPreview assets={marketAssets.slice(0, 4)} status={marketStatus} lastUpdated={lastUpdated} />
    </View>
  );
}

type LearnProps = {
  lessonProgress: LessonProgress;
  profile: OnboardingProfile;
  onOpenLesson: (lesson: Lesson) => void;
  onChestOpened?: (chestId: string, reward: { brainBucks: number; xp: number }) => void;
};

function LearnTab({ lessonProgress, profile, onOpenLesson, onChestOpened }: LearnProps) {
  const pathUnits = getPathUnits(profile);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  if (selectedUnitId) {
    const unit = pathUnits.find((u) => u.id === selectedUnitId);
    if (unit) {
      return (
        <UnitPathView
          unit={unit}
          lessonProgress={lessonProgress}
          onOpenLesson={onOpenLesson}
          onChestOpened={onChestOpened}
          onBack={() => setSelectedUnitId(null)}
        />
      );
    }
  }

  return (
    <View>
      <TabHero
        eyebrow="LEARN"
        title="Your learning path"
        body="Bite-sized lessons, interactive exercises, and real-world finance skills. Earn XP and Brain Bucks as you go."
      />
      <LearnHUD
        streak={lessonProgress.streak}
        brainBucks={lessonProgress.brainBucks ?? 0}
      />
      <View style={styles.gameGrid}>
        {pathUnits.map((unit, idx) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            unitIndex={idx + 1}
            lessonProgress={lessonProgress}
            onPress={() => setSelectedUnitId(unit.id)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── UnitCard (mirrors GameCard exactly) ─────────────────────────────────────

type UnitCardProps = {
  unit: import('../types/learn').PathUnit;
  unitIndex: number;
  lessonProgress: LessonProgress;
  onPress: () => void;
};

const UNIT_STATE_LABEL: Record<UnitState, string> = {
  locked: 'LOCKED',
  available: 'START HERE',
  inProgress: 'IN PROGRESS',
  completed: 'COMPLETE',
};

const UNIT_STATE_TOKEN: Record<UnitState, string> = {
  locked: 'LOCKED',
  available: 'OPEN',
  inProgress: 'CONTINUE',
  completed: 'REVIEW',
};

function UnitCard({ unit, unitIndex, lessonProgress, onPress }: UnitCardProps) {
  const state = getUnitState(unit, lessonProgress);
  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';
  const inProgress = state === 'inProgress';

  const lessonNodes = unit.nodes.filter((n) => n.type === 'lesson' || n.type === 'practice');
  const completedIds = new Set(lessonProgress.completedLessonIds);

  const cardStyle = [
    styles.gameCard,
    isLocked && styles.gameCardLocked,
    isCompleted && styles.unitCardComplete,
    !isLocked && !inProgress && !isCompleted && styles.unitCardAvailable,
  ];

  const textColor = isCompleted ? colors.white : colors.buttonText;

  return (
    <TouchableOpacity
      style={cardStyle}
      activeOpacity={isLocked ? 1 : 0.84}
      onPress={isLocked ? undefined : onPress}
      disabled={isLocked}
    >
      <View style={styles.gameCardHeader}>
        <Text style={[styles.gameLabel, { color: textColor }]}>
          {UNIT_STATE_LABEL[state]}
        </Text>
        <Text style={[styles.gameToken, { color: textColor }]}>
          {UNIT_STATE_TOKEN[state]}
        </Text>
      </View>

      <View style={styles.masteryRow}>
        {lessonNodes.map((node) => {
          const done = node.lessonId ? completedIds.has(node.lessonId) : false;
          return (
            <View
              key={node.id}
              style={[
                styles.masteryRing,
                { borderColor: textColor },
                done && { backgroundColor: textColor },
              ]}
            />
          );
        })}
      </View>

      <Text style={[styles.gameTitle, { color: textColor }]}>{unit.title}</Text>
      <Text style={[styles.gameBody, { color: textColor }]}>{unit.subtitle}</Text>
      <Text style={[styles.gameMeta, { color: textColor }]}>
        UNIT {unitIndex} / {lessonNodes.length} LESSONS / {unit.trackId.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

// ─── UnitPathView (winding path for a single unit) ───────────────────────────

type UnitPathViewProps = {
  unit: import('../types/learn').PathUnit;
  lessonProgress: LessonProgress;
  onOpenLesson: (lesson: Lesson) => void;
  onChestOpened?: (chestId: string, reward: { brainBucks: number; xp: number }) => void;
  onBack: () => void;
};

function UnitPathView({ unit, lessonProgress, onOpenLesson, onChestOpened, onBack }: UnitPathViewProps) {
  const [chestModal, setChestModal] = useState<{ id: string; brainBucks: number; xp: number } | null>(null);
  const [gbVisible, setGbVisible] = useState(false);
  const nodeStates = computeNodeStates(unit, lessonProgress);
  const masteryTier = getUnitMasteryTier(unit, lessonProgress);

  function handleNodePress(nodeId: string, lessonId?: string, chestReward?: { brainBucks: number; xp: number }) {
    if (lessonId) {
      const lesson = getPathLessonById(lessonId);
      if (lesson) onOpenLesson(lesson);
      return;
    }
    if (chestReward) setChestModal({ id: nodeId, ...chestReward });
  }

  function handleClaimChest() {
    if (!chestModal) return;
    onChestOpened?.(chestModal.id, { brainBucks: chestModal.brainBucks, xp: chestModal.xp });
    setChestModal(null);
  }

  const TIER_LABEL: Record<import('../types/learn').MasteryTier, string> = {
    bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', legendary: 'LEGENDARY',
  };

  return (
    <View>
      {/* Dark card header — matches featurePanel style */}
      <View style={styles.featurePanel}>
        <View style={styles.unitPathHeaderRow}>
          <TouchableOpacity onPress={onBack} style={styles.unitPathBack}>
            <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>← BACK</Text>
          </TouchableOpacity>
          {masteryTier ? (
            <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>{TIER_LABEL[masteryTier]}</Text>
          ) : null}
        </View>
        <Text style={styles.featureTitle}>{unit.title}</Text>
        <Text style={styles.featureBody}>{unit.subtitle}</Text>
        {unit.guidebook.length > 0 && (
          <TouchableOpacity onPress={() => setGbVisible(true)} style={styles.unitPathGbBtn}>
            <Text style={styles.yellowButtonText}>{ICON.lines}  GUIDEBOOK</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.pathColumn}>
        {unit.nodes.map((node, nodeIdx) => {
          const state = nodeStates[node.id] ?? 'locked';
          const prevNode = unit.nodes[nodeIdx - 1];
          const prevState = prevNode ? (nodeStates[prevNode.id] ?? 'locked') : 'completed';
          const segmentCompleted = prevState === 'completed';
          const lesson = node.lessonId ? getPathLessonById(node.lessonId) : undefined;
          const nodeLabel = lesson?.title ?? (node.type === 'chest' ? `+${node.chestReward?.brainBucks ?? 0} BB` : undefined);

          return (
            <View key={node.id}>
              {nodeIdx > 0 && (
                <View style={[
                  styles.pathSegmentRow,
                  node.position === 'left' && styles.pathLeft,
                  node.position === 'right' && styles.pathRight,
                ]}>
                  <PathSegment completed={segmentCompleted} />
                </View>
              )}
              <View style={[
                styles.pathNodeRow,
                node.position === 'left' && styles.pathLeft,
                node.position === 'right' && styles.pathRight,
              ]}>
                <PathNodeButton
                  nodeId={node.id}
                  type={node.type}
                  state={state}
                  label={nodeLabel}
                  onPress={() => handleNodePress(node.id, node.lessonId, node.chestReward)}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.unitBottomSpacer} />

      {/* Guidebook modal */}
      <Modal visible={gbVisible} animationType="slide" onRequestClose={() => setGbVisible(false)}>
        <View style={[styles.featurePanel, { borderRadius: 0, marginTop: 0 }]}>
          <View style={styles.unitPathHeaderRow}>
            <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>{ICON.lines}  GUIDEBOOK</Text>
            <TouchableOpacity onPress={() => setGbVisible(false)}>
              <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>✕ CLOSE</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.featureTitle, { fontSize: 24 }]}>{unit.title}</Text>
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={{ padding: 20, gap: 16 }}>
          {unit.guidebook.map((entry) => (
            <View key={entry.id} style={styles.gbEntry}>
              <Text style={styles.gbEntryTitle}>{entry.title}</Text>
              <Text style={styles.gbEntryBody}>{entry.body}</Text>
            </View>
          ))}
        </ScrollView>
      </Modal>

      {/* Chest reward modal */}
      <Modal visible={chestModal !== null} transparent animationType="fade" onRequestClose={() => setChestModal(null)}>
        <View style={styles.chestOverlay}>
          <View style={styles.chestCard}>
            <Text style={styles.chestEmoji}>{ICON.box}</Text>
            <Text style={styles.chestTitle}>Reward Chest!</Text>
            <Text style={styles.chestBody}>
              You earned {chestModal?.brainBucks} Brain Bucks and {chestModal?.xp} XP!
            </Text>
            <TouchableOpacity style={styles.chestButton} onPress={handleClaimChest}>
              <Text style={styles.chestButtonText}>CLAIM REWARD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type GamesProps = {
  lessonProgress: LessonProgress;
  gameProgress: GameProgress;
  onLaunchGame: (game: GameDefinition) => void;
};

function GamesTab({ lessonProgress, gameProgress, onLaunchGame }: GamesProps) {
  const completedCount = lessonProgress.completedLessonIds.length;
  const playNext = gameDefinitions.find((game) => game.id === 'lemonade-empire') ?? gameDefinitions[0];
  const completedGames = gameProgress.results.length;
  const lastResult = gameProgress.results[gameProgress.results.length - 1];

  return (
    <View>
      <TabHero
        eyebrow="GAMES"
        title="Money arcade"
        body="Coach-picked games, open exploration, mastery rings, and short tycoon runs that build real money instincts."
      />

      <View style={styles.gameHeroPanel}>
        <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>PLAY NEXT</Text>
        <Text style={styles.featureTitle}>{playNext.title}</Text>
        <Text style={styles.featureBody}>
          {playNext.coachReason} Your current streak is {lessonProgress.streak} day.
        </Text>
        <TouchableOpacity
          style={styles.yellowButton}
          activeOpacity={0.86}
          onPress={() => onLaunchGame(playNext)}
        >
          <Text style={styles.yellowButtonText}>LOAD LEMONADE EMPIRE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.zonePanel}>
        <ZoneRow zone="Continue" value={lastResult ? `${lastResult.eventTitle} / $${lastResult.profit} profit` : 'No saved run yet'} />
        <ZoneRow zone="By Topic" value="Games grouped by competency domain" />
        <ZoneRow zone="Challenges" value="Daily timed practice" />
        <ZoneRow zone="Mastery Map" value={`${completedGames} game results logged`} />
        <ZoneRow zone="All Games" value={`${gameDefinitions.length} games in the catalogue`} />
      </View>

      <View style={styles.gameGrid}>
        {gameDefinitions.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isLocked={!game.isPlayable}
            onPress={() => onLaunchGame(game)}
          />
        ))}
      </View>
    </View>
  );
}

type GameCardProps = {
  game: GameDefinition;
  isLocked: boolean;
  onPress: () => void;
};

function GameCard({ game, isLocked, onPress }: GameCardProps) {
  return (
    <TouchableOpacity
      style={[styles.gameCard, isLocked && styles.gameCardLocked]}
      activeOpacity={0.84}
      onPress={onPress}
    >
      <View style={styles.gameCardHeader}>
        <Text style={styles.gameLabel}>{game.isPlayable ? 'PLAYABLE' : 'COMING NEXT'}</Text>
        <Text style={styles.gameToken}>{isLocked ? 'PREVIEW' : 'PLAY'}</Text>
      </View>
      <View style={styles.masteryRow}>
        {[1, 2, 3, 4, 5].map((ring) => (
          <View
            key={ring}
            style={[styles.masteryRing, ring <= game.mastery && styles.masteryRingFilled]}
          />
        ))}
      </View>
      <Text style={styles.gameTitle}>{game.title}</Text>
      <Text style={styles.gameBody}>{game.fantasy}</Text>
      <Text style={styles.gameMeta}>{game.status.toUpperCase()} / {game.estimatedTime} / {game.domain}</Text>
    </TouchableOpacity>
  );
}

function ZoneRow({ zone, value }: { zone: string; value: string }) {
  return (
    <View style={styles.zoneRow}>
      <Text style={styles.zoneName}>{zone}</Text>
      <Text style={styles.zoneValue}>{value}</Text>
    </View>
  );
}

type Transaction = {
  id: string;
  amount: number;
  category: string;
  emoji: string;
  time: string;
};

const CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'transport', label: 'Ride', emoji: '🚕' },
  { id: 'shopping', label: 'Shop', emoji: '🛍️' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'fun', label: 'Fun', emoji: '🎉' },
  { id: 'bills', label: 'Bills', emoji: '🧾' },
  { id: 'health', label: 'Health', emoji: '💊' },
  { id: 'sub', label: 'Subs', emoji: '📺' },
];

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

type Holding = {
  id: string;
  name: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  change24h: number;
  emoji: string;
};

type FinGoal = {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  deadline: string;
  color: string;
};

const MOCK_HOLDINGS: Holding[] = [
  { id: '1', name: 'Apple Inc.', ticker: 'AAPL', shares: 5, avgCost: 175.00, currentPrice: 198.50, change24h: 1.2, emoji: '🍎' },
  { id: '2', name: 'Bitcoin', ticker: 'BTC', shares: 0.015, avgCost: 62000, currentPrice: 67800, change24h: 3.4, emoji: '₿' },
  { id: '3', name: 'S&P 500 ETF', ticker: 'VOO', shares: 3, avgCost: 410, currentPrice: 438, change24h: -0.3, emoji: '📈' },
  { id: '4', name: 'Ethereum', ticker: 'ETH', shares: 0.5, avgCost: 3200, currentPrice: 3650, change24h: 2.1, emoji: '💎' },
];

const MOCK_GOALS: FinGoal[] = [
  { id: '1', name: 'Emergency Fund', emoji: '🛡️', target: 5000, saved: 1850, deadline: 'Dec 2026', color: '#10B981' },
  { id: '2', name: 'New MacBook', emoji: '💻', target: 2500, saved: 900, deadline: 'Aug 2026', color: '#6366F1' },
  { id: '3', name: 'Japan Trip', emoji: '✈️', target: 4000, saved: 650, deadline: 'Mar 2027', color: '#F59E0B' },
];

type BudgetSubTab = 'spend' | 'invest' | 'goals';

function BudgetTab({ profile }: { profile: OnboardingProfile }) {
  const savingHabit = firstAnswer(profile, 'savingHabit', 'Just starting');
  const baseDaily = savingHabit === 'Consistent' ? 100 : savingHabit === 'Sometimes' ? 65 : 40;

  const [subTab, setSubTab] = useState<BudgetSubTab>('spend');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [streak, setStreak] = useState(3);
  const [spareChangeStash, setSpareChangeStash] = useState(0);

  const [holdings] = useState<Holding[]>(MOCK_HOLDINGS);
  const [goals, setGoals] = useState<FinGoal[]>(MOCK_GOALS);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{
    id: '0', sender: 'ai',
    text: "Hey! I'm Coinly AI. I can use your local spending, portfolio, and goals to coach your next move, or answer any general questions you have."
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const safeToSpend = Math.max(0, baseDaily - totalSpent);
  const spentPercentage = Math.min(100, (totalSpent / baseDaily) * 100);

  const totalPortfolioValue = holdings.reduce((s, h) => s + h.shares * h.currentPrice, 0);
  const totalPortfolioCost = holdings.reduce((s, h) => s + h.shares * h.avgCost, 0);
  const totalPL = totalPortfolioValue - totalPortfolioCost;
  const totalPLPct = totalPortfolioCost > 0 ? (totalPL / totalPortfolioCost) * 100 : 0;

  const totalGoalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalGoalTarget = goals.reduce((s, g) => s + g.target, 0);

  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: spentPercentage,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [spentPercentage, barAnim]);

  const buildFinancialContext = (): FinancialContext => ({
    dailyBudget: baseDaily,
    totalSpentToday: totalSpent,
    safeToSpend,
    streak,
    spareChangeStash,
    holdings: holdings.map(h => ({
      name: h.name, ticker: h.ticker, shares: h.shares,
      value: h.shares * h.currentPrice,
      plPct: ((h.currentPrice - h.avgCost) / h.avgCost) * 100,
    })),
    totalPortfolioValue,
    totalPL,
    goals: goals.map(g => ({ name: g.name, target: g.target, saved: g.saved, pct: (g.saved / g.target) * 100 })),
    recentTransactions: transactions.slice(0, 5).map(t => ({ category: t.category, amount: t.amount })),
  });

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isAiTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    const history = chatMessages
      .filter(m => m.id !== '0')
      .map(m => ({ role: m.sender === 'user' ? 'user' as const : 'assistant' as const, content: m.text }));

    try {
      const aiResponse = await askCoinlyAI(userMsg.text, history, buildFinancialContext());
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: getCoinlyAiConnectionHelp(error) }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAddExpense = () => {
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) return;

    const ceil = Math.ceil(amt);
    const spareChange = ceil - amt;

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: amt,
      category: selectedCategory.label,
      emoji: selectedCategory.emoji,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTransactions([newTx, ...transactions]);
    setExpenseAmount('');
    
    if (spareChange > 0) {
      setSpareChangeStash(prev => prev + spareChange);
    }

    if (totalSpent + ceil > baseDaily) {
      setStreak(0);
    }

    if (spareChange > 0 && Math.random() > 0.6) {
       setTimeout(() => {
         const aiMsg: ChatMessage = {
           id: Date.now().toString(),
           sender: 'ai',
           text: `I just swept $${spareChange.toFixed(2)} from your ${newTx.category} into your stash! Small amounts add up quickly.`
         };
         setChatMessages(prev => [...prev, aiMsg]);
       }, 1500);
    } else if (amt > 20) {
       setTimeout(() => {
         const aiMsg: ChatMessage = {
           id: Date.now().toString(),
           sender: 'ai',
           text: `Whoa, $${amt.toFixed(2)} on ${newTx.category}. That's quite a bit. Could we invest half of that next time?`
         };
         setChatMessages(prev => [...prev, aiMsg]);
       }, 1500);
    }
  };

  const latestAiMsg = chatMessages.filter(m => m.sender === 'ai').slice(-1)[0];

  return (
    <View>
      <TouchableOpacity style={styles.aiBannerCard} onPress={() => setIsChatOpen(true)} activeOpacity={0.85}>
        <View style={styles.aiBannerLeft}>
          <View style={styles.aiBannerDot} />
          <Text style={styles.aiBannerTitle}>Coinly AI</Text>
        </View>
        <Text style={styles.aiBannerMsg} numberOfLines={2}>
          {latestAiMsg?.text ?? 'Tap to chat with your AI advisor'}
        </Text>
        <Text style={styles.aiBannerCta}>TAP TO CHAT →</Text>
      </TouchableOpacity>

      <View style={styles.trackerHeroCard}>
        <View style={styles.trackerHeader}>
          <Text style={styles.trackerDate}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{ICON.flame} {streak} Day Streak</Text>
            </View>
          )}
        </View>
        <Text style={styles.safeToSpendLabel}>REMAINING TODAY</Text>
        <Text style={[styles.safeToSpendAmount, safeToSpend === 0 && { color: '#E53E3E' }]}>
          ${safeToSpend.toFixed(2)}
        </Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              { 
                width: barAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                backgroundColor: barAnim.interpolate({
                  inputRange: [0, 75, 100],
                  outputRange: [colors.black, '#DD6B20', '#E53E3E']
                })
              }
            ]} 
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>Spent: ${totalSpent.toFixed(2)}</Text>
          <Text style={styles.progressText}>Budget: ${baseDaily.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.stashCard}>
        <View>
          <Text style={styles.stashLabel}>SPARE CHANGE STASH</Text>
          <Text style={styles.stashAmount}>${spareChangeStash.toFixed(2)}</Text>
        </View>
        <Text style={styles.stashIcon}>🌱</Text>
      </View>

      <View style={styles.quickAddPanel}>
        <Text style={styles.panelEyebrow}>QUICK ADD EXPENSE</Text>
        <View style={styles.expenseInputRow}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.expenseInput}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="rgba(0,0,0,0.3)"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
          />
          <TouchableOpacity style={styles.expenseAddButton} onPress={handleAddExpense}>
            <Text style={styles.expenseAddText}>ADD</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryBadge, selectedCategory.id === cat.id && styles.categoryBadgeActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[styles.categoryLabel, selectedCategory.id === cat.id && styles.categoryLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recentTransactionsPanel}>
        <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>TODAY'S SPENDING</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyTransactionsText}>No expenses yet today. Keep it up!</Text>
          </View>
        ) : (
          transactions.map(tx => (
            <View key={tx.id} style={styles.transactionCard}>
              <View style={styles.txIconContainer}>
                <Text style={styles.txEmoji}>{tx.emoji}</Text>
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txCategory}>{tx.category}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <Text style={styles.txAmount}>-${tx.amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      <Modal visible={isChatOpen} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setIsChatOpen(false)}>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Coinly AI Advisor</Text>
            <TouchableOpacity onPress={() => setIsChatOpen(false)}>
              <Text style={styles.chatClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.chatHistory} contentContainerStyle={{ padding: 16, gap: 12 }}>
            {chatMessages.map(msg => (
              <View key={msg.id} style={[styles.chatBubble, msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleAi]}>
                <Text style={[styles.chatText, msg.sender === 'user' ? styles.chatTextUser : styles.chatTextAi]}>{msg.text}</Text>
              </View>
            ))}
            {isAiTyping && (
              <View style={[styles.chatBubble, styles.chatBubbleAi]}>
                <Text style={[styles.chatText, styles.chatTextAi]}>Thinking...</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask me anything about money..."
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendChatMessage}
              editable={!isAiTyping}
            />
            <TouchableOpacity style={[styles.chatSendBtn, isAiTyping && { opacity: 0.5 }]} onPress={handleSendChatMessage} disabled={isAiTyping}>
              <Text style={styles.chatSendText}>{isAiTyping ? '...' : 'SEND'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

type ExploreProps = {
  profile: OnboardingProfile;
  marketAssets: MarketAsset[];
  marketStatus: 'loading' | 'ready' | 'fallback';
  lastUpdated: string | null;
};

function ExploreTab({ profile, marketAssets, marketStatus, lastUpdated }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [news, setNews] = useState<FinanceNewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  // Animation value for fade in
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    fetchFinanceNews().then((data) => {
      if (isMounted) {
        setNews(data);
        setIsNewsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    });
    return () => { isMounted = false; };
  }, [fadeAnim]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    setSelectedAsset(null);
    try {
      const results = await searchAssetsByQuery(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.warn('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (result: SearchResult) => {
    setSearchResults([]);
    setIsFetchingQuote(true);
    try {
      const quote = await fetchLiveQuote(result);
      setSelectedAsset(quote);
    } catch (err) {
      console.warn('Quote fetch failed', err);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  return (
    <View>
      <TabHero
        eyebrow="EXPLORE"
        title="Live markets"
        body="Discover real-time stock prices, read the latest finance news, and view your custom watchlist."
      />
      
      <View style={styles.searchPanel}>
        <Text style={styles.searchEyebrow}>MARKET LOOKUP</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Enter symbol (e.g., AAPL)..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
            <Text style={styles.searchButtonText}>GO</Text>
          </TouchableOpacity>
        </View>
        {isSearching ? (
          <ActivityIndicator style={{ marginTop: 16 }} color={colors.black} />
        ) : searchResults.length > 0 ? (
          <View style={styles.searchResultsContainer}>
            {searchResults.map((result, idx) => (
              <TouchableOpacity
                key={`${result.id}-${idx}`}
                style={styles.searchResultItem}
                activeOpacity={0.7}
                onPress={() => handleSelectResult(result)}
              >
                <View style={styles.searchResultBadge}>
                  <Text style={styles.searchResultBadgeText}>{result.kind.toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.searchResultName} numberOfLines={1}>{result.name}</Text>
                  <Text style={styles.searchResultSymbol}>{result.symbol}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : isFetchingQuote ? (
          <ActivityIndicator style={{ marginTop: 16 }} color={colors.black} />
        ) : selectedAsset ? (
          <View style={styles.searchResultCard}>
            <MarketRow asset={selectedAsset} />
          </View>
        ) : null}
      </View>

      <View style={styles.newsPanel}>
        <View style={styles.marketHeader}>
          <Text style={styles.panelEyebrow}>TOP HEADLINES</Text>
        </View>
        {isNewsLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.black} />
            <Text style={styles.loadingText}>Fetching latest news...</Text>
          </View>
        ) : (
          <Animated.View style={[styles.newsList, { opacity: fadeAnim }]}>
            {news.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.newsCard}
                activeOpacity={0.7}
                onPress={() => Linking.openURL(item.link)}
              >
                <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
                <Text style={styles.newsDate}>{item.pubDate}</Text>
              </TouchableOpacity>
            ))}
            {news.length === 0 && <Text style={styles.loadingText}>No news available.</Text>}
          </Animated.View>
        )}
      </View>

      <MarketPreview assets={marketAssets} status={marketStatus} lastUpdated={lastUpdated} expanded />
    </View>
  );
}

type GameLoadingProps = {
  game: GameDefinition;
  insetsTop: number;
  insetsBottom: number;
  progress: Animated.Value;
  aiHeaderButton?: React.ReactNode;
  onBack: () => void;
  onContinue: () => void;
};

function GameLoadingPage({
  game,
  insetsTop,
  insetsBottom,
  progress,
  aiHeaderButton,
  onBack,
  onContinue,
}: GameLoadingProps) {
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['8%', '100%'],
  });

  return (
    <View style={styles.loadingScreen}>
      <View style={[styles.loadingHeader, { paddingTop: insetsTop + 18 }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
          <Text style={styles.restartText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.wordmark}>Coinly</Text>
        <View style={styles.headerRightActions}>
          <Text style={styles.restartText}>GAME</Text>
          {aiHeaderButton}
        </View>
      </View>

      <View style={styles.loadingContent}>
        <Text style={styles.loadingEyebrow}>COACH PICK</Text>
        <Text style={styles.loadingTitle}>{game.title}</Text>
        <Text style={styles.loadingBody}>
          Loading a {game.domain.toLowerCase()} game for {game.competency.toLowerCase()}.
          {game.isPlayable ? ' Get ready to play.' : ' This one is mapped as a preview for now.'}
        </Text>

        <View style={styles.loadingStats}>
          <MetricBox label="Status" value={game.status.toUpperCase()} />
          <MetricBox label="Time" value={game.estimatedTime.toUpperCase()} />
          <MetricBox label="Rings" value={`${game.mastery}/5`} />
        </View>

        <View style={styles.loadingBarTrack}>
          <Animated.View style={[styles.loadingBarFill, { width: progressWidth }]} />
        </View>

        <View style={styles.loadingCard}>
          <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>WHY THIS GAME</Text>
          <Text style={styles.featureBody}>
            {game.coachReason}
          </Text>
          {!game.isPlayable ? <Text style={styles.loadingHint}>Full mechanics are coming after the flagship games.</Text> : null}
        </View>
      </View>

      <View style={[styles.loadingFooter, { paddingBottom: insetsBottom + 22 }]}>
        <TouchableOpacity style={styles.yellowButton} activeOpacity={0.86} onPress={onContinue}>
          <Text style={styles.yellowButtonText}>{game.isPlayable ? 'ENTER GAME' : 'BACK TO ARCADE'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TabHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

type MarketPreviewProps = {
  assets: MarketAsset[];
  status: 'loading' | 'ready' | 'fallback';
  lastUpdated: string | null;
  expanded?: boolean;
};

function MarketPreview({ assets, status, lastUpdated, expanded }: MarketPreviewProps) {
  return (
    <View style={styles.marketPanel}>
      <View style={styles.marketHeader}>
        <View>
          <Text style={styles.panelEyebrow}>WATCHLIST</Text>
          <Text style={styles.disclaimer}>For learning only</Text>
        </View>
        <Text style={styles.updatedText}>{status === 'loading' ? 'Loading' : lastUpdated}</Text>
      </View>

      {status === 'loading' ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.black} />
          <Text style={styles.loadingText}>Fetching market snapshots...</Text>
        </View>
      ) : null}

      {status !== 'loading' ? (
        <View style={styles.marketList}>
          {assets.map((asset) => (
            <MarketRow key={asset.id} asset={asset} expanded={expanded} />
          ))}
        </View>
      ) : null}

      {status === 'fallback' ? (
        <Text style={styles.fallbackText}>Some values are demo fallbacks because a free data source did not respond.</Text>
      ) : null}
    </View>
  );
}

function MarketRow({ asset, expanded }: { asset: MarketAsset; expanded?: boolean }) {
  const isPositive = (asset.changePercent ?? 0) >= 0;

  return (
    <View style={styles.marketRow}>
      <View style={styles.assetBadge}>
        <Text style={styles.assetBadgeText}>{asset.symbol.slice(0, 3)}</Text>
      </View>
      <View style={styles.assetInfo}>
        <Text style={styles.assetLabel}>{asset.label}</Text>
        <Text style={styles.assetMeta}>
          {asset.symbol} / {asset.source}
          {asset.isFallback ? ' fallback' : ''}
        </Text>
      </View>
      <View style={styles.assetPriceBlock}>
        <Text style={styles.assetPrice}>{formatCurrency(asset.price)}</Text>
        <Text style={[styles.assetChange, isPositive ? styles.positiveText : styles.negativeText]}>
          {formatPercent(asset.changePercent)}
        </Text>
      </View>
      {expanded ? <View style={styles.marketRowRule} /> : null}
    </View>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function PlanCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.planCard}>
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planBody}>{body}</Text>
    </View>
  );
}

function firstAnswer(profile: OnboardingProfile, key: string, fallback: string) {
  return profile.answers[key]?.[0] ?? fallback;
}

function formatUpdateTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

function formatPercent(value?: number) {
  if (value === undefined) return '--';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.green,
  },
  content: {
    paddingHorizontal: 20,
  },
  hiddenTab: {
    display: 'none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRightActions: {
    minWidth: 174,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  wordmark: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    includeFontPadding: false,
  },
  restartText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  hero: {
    marginTop: 38,
  },
  eyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  title: {
    marginTop: 8,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 46,
    lineHeight: 51,
    includeFontPadding: false,
  },
  body: {
    marginTop: 16,
    color: colors.black,
    fontSize: 16,
    lineHeight: 23,
  },
  featurePanel: {
    marginTop: 28,
    backgroundColor: colors.black,
    padding: 18,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  gameHeroPanel: {
    marginTop: 28,
    backgroundColor: colors.black,
    padding: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.yellow,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  panelEyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  panelEyebrowOnDark: {
    color: colors.yellow,
  },
  featureTitle: {
    marginTop: 8,
    color: colors.yellow,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    lineHeight: 38,
    includeFontPadding: false,
  },
  featureBody: {
    marginTop: 12,
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  yellowButton: {
    marginTop: 18,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 24,
  },
  yellowButtonText: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 21,
  },
  metricRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    minHeight: 82,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 193, 66, 0.16)',
  },
  metricLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  metricValue: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 18,
  },
  progressPanel: {
    marginTop: 28,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressValue: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 18,
  },
  progressSubtext: {
    marginTop: 8,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  masteryGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  masteryCard: {
    width: '47%',
    minHeight: 96,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(245, 193, 66, 0.14)',
  },
  masteryPercent: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    includeFontPadding: false,
  },
  masteryName: {
    marginTop: 6,
    color: colors.black,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  courseSectionHeader: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    includeFontPadding: false,
  },
  sectionMeta: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  trackGrid: {
    marginTop: 14,
    gap: 12,
  },
  trackCard: {
    minHeight: 128,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  trackIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackIconText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
  },
  trackCopy: {
    flex: 1,
  },
  trackTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    includeFontPadding: false,
  },
  trackBody: {
    marginTop: 6,
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  trackProgressTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 36, 29, 0.18)',
    overflow: 'hidden',
  },
  trackProgressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  trackMeta: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  reviewPanel: {
    marginTop: 14,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  reviewLesson: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 36, 29, 0.18)',
  },
  reviewTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 15,
  },
  reviewMeta: {
    marginTop: 4,
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.72,
  },
  reviewEmpty: {
    padding: 14,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  assessmentPanel: {
    marginTop: 18,
    backgroundColor: colors.black,
    padding: 18,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  unitList: {
    marginTop: 18,
    gap: 16,
  },
  unitCard: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  unitEyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  unitTitle: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 29,
    includeFontPadding: false,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  moduleHeaderCopy: {
    flex: 1,
  },
  modulePercent: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
  },
  moduleDescription: {
    marginTop: 10,
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  nodeGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  lessonNode: {
    width: '47%',
    minHeight: 82,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
  },
  lessonNodeComplete: {
    backgroundColor: colors.black,
  },
  lessonNodeLocked: {
    opacity: 0.62,
  },
  lessonNodeNumber: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  lessonNodeNumberComplete: {
    color: colors.yellow,
  },
  lessonNodeText: {
    color: colors.black,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  lessonNodeTextComplete: {
    color: colors.yellow,
  },
  lessonNodeMeta: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
  },
  cardList: {
    marginTop: 18,
    gap: 14,
  },
  gameGrid: {
    marginTop: 18,
    gap: 14,
  },
  zonePanel: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    overflow: 'hidden',
  },
  zoneRow: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 36, 29, 0.18)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  zoneName: {
    width: 86,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  zoneValue: {
    flex: 1,
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  gameCard: {
    minHeight: 132,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 14,
    padding: 16,
    backgroundColor: colors.yellow,
  },
  gameCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.72,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  gameLabel: {
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  gameToken: {
    color: colors.buttonText,
    fontSize: 12,
    fontWeight: '900',
  },
  gameTitle: {
    marginTop: 10,
    color: colors.buttonText,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    includeFontPadding: false,
  },
  gameBody: {
    marginTop: 10,
    color: colors.buttonText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  gameMeta: {
    marginTop: 12,
    color: colors.buttonText,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  masteryRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 6,
  },
  masteryRing: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.buttonText,
  },
  masteryRingFilled: {
    backgroundColor: colors.buttonText,
  },
  planCard: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  planTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    includeFontPadding: false,
  },
  planBody: {
    marginTop: 10,
    color: colors.black,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  marketPanel: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  disclaimer: {
    marginTop: 2,
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.72,
  },
  updatedText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  loadingRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.black,
    fontWeight: '700',
  },
  marketList: {
    marginTop: 14,
    gap: 12,
  },
  marketRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetBadgeText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  assetInfo: {
    flex: 1,
  },
  assetLabel: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  assetMeta: {
    marginTop: 2,
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.68,
  },
  assetPriceBlock: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  assetChange: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '900',
  },
  positiveText: {
    color: colors.positive,
  },
  negativeText: {
    color: colors.negative,
  },
  fallbackText: {
    marginTop: 12,
    color: colors.black,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  marketRowRule: {
    display: 'none',
  },
  searchPanel: {
    marginTop: 28,
    backgroundColor: colors.yellow,
    padding: 18,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  searchEyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 19,
  },
  searchBarContainer: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  searchBarInput: {
    flex: 1,
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
    borderWidth: 2,
    borderColor: colors.black,
  },
  searchButton: {
    width: 64,
    height: 52,
    backgroundColor: colors.black,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
  },
  searchResultCard: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.black,
  },
  searchResultsContainer: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 36, 29, 0.1)',
    gap: 12,
  },
  searchResultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.black,
    borderRadius: 4,
    minWidth: 54,
    alignItems: 'center',
  },
  searchResultBadgeText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 12,
  },
  searchResultName: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
  },
  searchResultSymbol: {
    marginTop: 2,
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
  },
  newsPanel: {
    marginTop: 24,
  },
  newsList: {
    marginTop: 14,
    gap: 14,
  },
  newsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  newsTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    lineHeight: 26,
    includeFontPadding: false,
  },
  newsDate: {
    marginTop: 8,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    opacity: 0.7,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.green,
  },
  loadingHeader: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  loadingEyebrow: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 23,
  },
  loadingTitle: {
    marginTop: 10,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 54,
    lineHeight: 58,
    includeFontPadding: false,
  },
  loadingBody: {
    marginTop: 18,
    color: colors.black,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '800',
  },
  loadingStats: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 10,
  },
  loadingBarTrack: {
    marginTop: 26,
    height: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(16, 36, 29, 0.16)',
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  loadingCard: {
    marginTop: 24,
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 18,
  },
  loadingHint: {
    marginTop: 14,
    color: colors.yellow,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
  },
  loadingFooter: {
    paddingHorizontal: 22,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 6,
    paddingTop: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.black,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.yellow,
  },
  tabIcon: {
    color: colors.white,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  tabLabel: {
    marginTop: 2,
    color: colors.white,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.buttonText,
  },
  trackerHeroCard: {
    marginTop: 24,
    backgroundColor: colors.yellow,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackerDate: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    color: colors.black,
    opacity: 0.8,
  },
  streakBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.black,
  },
  streakText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: colors.black,
  },
  safeToSpendLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: colors.black,
    opacity: 0.7,
  },
  safeToSpendAmount: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 64,
    lineHeight: 64,
    color: colors.black,
    marginTop: 4,
  },
  progressContainer: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 6,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: colors.black,
    opacity: 0.7,
  },
  quickAddPanel: {
    marginTop: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.black,
  },
  expenseInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  currencySymbol: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 32,
    color: colors.black,
  },
  expenseInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 32,
    color: colors.black,
  },
  expenseAddButton: {
    height: 56,
    paddingHorizontal: 24,
    backgroundColor: colors.black,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseAddText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: colors.yellow,
  },
  categoryScroll: {
    marginTop: 16,
    flexDirection: 'row',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryBadgeActive: {
    backgroundColor: colors.yellow,
    borderColor: colors.black,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    opacity: 0.6,
  },
  categoryLabelActive: {
    opacity: 1,
  },
  recentTransactionsPanel: {
    marginTop: 32,
    marginBottom: 40,
  },
  emptyTransactions: {
    marginTop: 16,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyTransactionsText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    color: colors.white,
    opacity: 0.7,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.black,
  },
  txIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txEmoji: {
    fontSize: 24,
  },
  txDetails: {
    flex: 1,
    marginLeft: 16,
  },
  txCategory: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: colors.black,
  },
  txTime: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: colors.black,
    opacity: 0.5,
    marginTop: 4,
  },
  txAmount: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
    color: '#E53E3E',
  },
  aiBannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiBannerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  aiBannerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  aiBannerMsg: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 12,
  },
  aiBannerCta: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    color: colors.yellow,
    letterSpacing: 1,
  },
  stashCard: {
    marginTop: 16,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  stashLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: '#94A3B8',
  },
  stashAmount: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 40,
    color: '#10B981',
    marginTop: 4,
  },
  stashIcon: {
    fontSize: 40,
  },
  fabAi: {
    marginTop: 12,
    backgroundColor: colors.black,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  fabAiText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: colors.white,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chatTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: colors.black,
  },
  chatClose: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    color: colors.black,
    opacity: 0.6,
  },
  chatHistory: {
    flex: 1,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
  },
  chatBubbleAi: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chatBubbleUser: {
    backgroundColor: colors.yellow,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  chatText: {
    fontSize: 16,
    lineHeight: 24,
  },
  chatTextAi: {
    color: colors.black,
  },
  chatTextUser: {
    color: colors.black,
    fontWeight: '500',
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  chatInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.black,
  },
  chatSendBtn: {
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: colors.black,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    color: colors.yellow,
  },
  subTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  subTabBtnActive: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  subTabText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.6,
  },
  subTabTextActive: {
    color: colors.black,
    opacity: 1,
  },
  breakdownCard: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.black,
  },
  breakdownTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    opacity: 0.5,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  breakdownEmoji: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  breakdownCat: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    width: 50,
  },
  breakdownBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 4,
  },
  breakdownAmt: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    width: 65,
    textAlign: 'right',
  },
  portfolioHeader: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 8,
  },
  portfolioLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: '#94A3B8',
  },
  portfolioValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 48,
    color: colors.white,
    marginTop: 4,
  },
  portfolioPLRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  portfolioPL: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
  },
  portfolioPLLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: '#64748B',
  },
  allocationRow: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  allocationSlice: {
    height: '100%',
    borderRadius: 4,
  },
  holdingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.black,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  holdingEmoji: {
    fontSize: 28,
  },
  holdingName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: colors.black,
  },
  holdingTicker: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: colors.black,
    opacity: 0.5,
    marginTop: 2,
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingPrice: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: colors.black,
  },
  holdingChange: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    marginTop: 2,
  },
  insightCard: {
    marginTop: 20,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  insightEmoji: {
    fontSize: 24,
  },
  insightText: {
    flex: 1,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    color: '#92400E',
    lineHeight: 22,
  },
  goalsSummaryCard: {
    backgroundColor: colors.yellow,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalsSummaryLabel: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    opacity: 0.6,
  },
  goalsSummaryValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 48,
    color: colors.black,
    marginTop: 4,
  },
  goalsSummaryRight: {
    alignItems: 'flex-end',
  },
  goalsSummaryPct: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 36,
    color: colors.black,
  },
  goalsSummaryOf: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: colors.black,
    opacity: 0.5,
  },
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.black,
  },
  goalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 28,
  },
  goalName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: colors.black,
  },
  goalDeadline: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    color: colors.black,
    opacity: 0.5,
    marginTop: 2,
  },
  goalPct: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
    color: colors.black,
  },
  goalBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  goalBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  goalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalSaved: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.black,
    opacity: 0.6,
  },
  goalContributeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goalContributeText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    color: colors.white,
  },
  addGoalBtn: {
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  addGoalBtnText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    color: colors.white,
    opacity: 0.6,
  },

  // ─── Unit card states ─────────────────────────────────────────────────────────
  unitCardAvailable: {
    backgroundColor: colors.white,
  },
  unitCardComplete: {
    backgroundColor: colors.positive,
  },
  // ─── Unit path header ─────────────────────────────────────────────────────────
  unitPathHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  unitPathBack: {
    paddingVertical: 2,
  },
  unitPathGbBtn: {
    marginTop: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 22,
  },
  // ─── Guidebook entry ─────────────────────────────────────────────────────────
  gbEntry: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
  },
  gbEntryTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 8,
  },
  gbEntryBody: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 21,
    fontWeight: '600',
  },
  // ─── Path UI styles ──────────────────────────────────────────────────────────
  pathColumn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pathNodeRow: {
    alignSelf: 'center',
  },
  pathSegmentRow: {
    alignSelf: 'center',
  },
  pathLeft: {
    alignSelf: 'flex-start',
    marginLeft: 60,
  },
  pathRight: {
    alignSelf: 'flex-end',
    marginRight: 60,
  },
  unitBottomSpacer: {
    height: 24,
  },
  chestOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chestCard: {
    backgroundColor: '#FFFDF4',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: 300,
    gap: 12,
  },
  chestEmoji: {
    fontSize: 48,
    color: colors.yellow,
    includeFontPadding: false,
    textAlign: 'center',
  },
  chestTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10241D',
  },
  chestBody: {
    fontSize: 15,
    color: '#3D4D40',
    textAlign: 'center',
    lineHeight: 22,
  },
  chestButton: {
    marginTop: 8,
    backgroundColor: '#F5C142',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  chestButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10241D',
    letterSpacing: 1,
  },
});
