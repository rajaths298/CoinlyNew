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
  getLearningPathIdForUnit,
  getLearningPaths,
  getNextPathLesson,
  getPathLessonById,
  getPathProgress,
  getPathUnits,
  getStartingPathId,
  getUnitCompletion,
  getUnitLessonNodes,
  getUnitMasteryTier,
  getUnitState,
  type LearningPathId,
  type UnitState,
} from '../data/pathCatalog';
import HomeTab from '../components/home/HomeTab';
import { FadeSlideIn } from '../components/ui/animations';
import LearnHUD from '../components/path/LearnHUD';
import PathNodeButton from '../components/path/PathNodeButton';
import PathSegment from '../components/path/PathSegment';
import {
  fetchFinanceNews,
  fetchLiveQuote,
  fetchMarketAssets,
  fetchMoneyWorldTopicFeed,
  moneyWorldTopics,
  searchAssetsByQuery,
  type FinanceNewsItem,
  type MarketAsset,
  type MoneyWorldTopicFeed,
  type MoneyWorldTopicId,
} from '../services/marketData';
import { askCoinlyAI, getCoinlyAiConnectionHelp, type FinancialContext } from '../services/aiAdvisor';
import { appColors as colors } from '../theme';
import { ICON } from '../components/ui/icons';
import type { GameDefinition, GameId, GameProgress } from '../types/game';
import type { Lesson, LessonDomain, LessonProgress } from '../types/lesson';
import type { PathUnit } from '../types/learn';
import type { OnboardingProfile } from '../types/onboarding';
import BudgetStudio from './BudgetStudio';

type DashboardTab = 'home' | 'learn' | 'games' | 'budget' | 'explore';

type Props = {
  aiHeaderButton?: React.ReactNode;
  profile: OnboardingProfile;
  lessonProgress: LessonProgress;
  gameProgress: GameProgress;
  portfolio: import('../types/trading').Portfolio;
  onOpenLesson: (lesson: Lesson) => void;
  onLaunchGame: (gameId: GameId) => void;
  onChestOpened?: (chestId: string, reward: { brainBucks: number; xp: number }) => void;
  onUpdatePortfolio: (p: import('../types/trading').Portfolio) => void;
  onOpenDailyTrivia?: () => void;
  initialTab?: DashboardTab;
};

const tabItems: Array<{ id: DashboardTab; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'learn', label: 'Learn', icon: 'L' },
  { id: 'games', label: 'Games', icon: 'G' },
  { id: 'budget', label: 'Budget', icon: 'B' },
  { id: 'explore', label: 'Explore', icon: 'E' },
];

type LearnTrackId = 'all' | LearningPathId;

type LearnTrack = {
  id: LearnTrackId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
};

type LearnSprintChoice = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
};

type LearnSprintQuestion = {
  id: string;
  trackId: string;
  eyebrow: string;
  title: string;
  prompt: string;
  lessonId: string;
  choices: LearnSprintChoice[];
};

const learnTracks: LearnTrack[] = [
  {
    id: 'all',
    label: 'All',
    eyebrow: 'EVERY PATH',
    title: 'Money, markets, and business',
    description: 'Every learning path in one skill tree — from a child\'s first coins to retirement and wealth building.',
    accent: colors.black,
  },
  ...getLearningPaths().map((path) => ({
    id: path.id,
    label: path.title,
    eyebrow: path.ageRange.toUpperCase(),
    title: path.tagline,
    description: path.description,
    accent: path.accent,
  })),
];

const learnSprintQuestions: LearnSprintQuestion[] = [
  {
    id: 'sprint-money-cost',
    trackId: 'financial',
    eyebrow: 'MONEY SPRINT',
    title: 'Opportunity cost check',
    prompt: 'You can spend $600 on a phone upgrade or keep your current phone and put the $600 toward a car fund. What is the real tradeoff?',
    lessonId: 'duo-l1',
    choices: [
      { id: 'a', text: 'The phone costs only $600, so the car fund is unrelated.', isCorrect: false, feedback: 'The car fund is the alternative you give up. The cost is the phone plus the missed progress toward mobility.' },
      { id: 'b', text: 'The upgrade costs $600 plus the delayed car fund goal.', isCorrect: true, feedback: 'Correct. Opportunity cost means naming the best alternative path you are giving up.' },
      { id: 'c', text: 'There is no tradeoff if the phone is on sale.', isCorrect: false, feedback: 'A sale changes price, not the fact that the same cash cannot do two jobs at once.' },
    ],
  },
  {
    id: 'sprint-money-buffer',
    trackId: 'financial',
    eyebrow: 'MONEY SPRINT',
    title: 'Emergency fund move',
    prompt: 'A student has $900 saved and monthly essentials of $1,200. They receive a $400 refund. What is the strongest next move?',
    lessonId: 'duo-l1',
    choices: [
      { id: 'a', text: 'Add it to the emergency fund until at least one month is covered.', isCorrect: true, feedback: 'Correct. The first milestone is getting a basic buffer between life and debt.' },
      { id: 'b', text: 'Invest it in a volatile stock because the return could be higher.', isCorrect: false, feedback: 'Emergency money needs stability and access. Higher return is not useful if the money drops before an emergency.' },
      { id: 'c', text: 'Spend it because refunds are bonus money.', isCorrect: false, feedback: 'A refund is still money. Treating windfalls with a plan is how buffers grow.' },
    ],
  },
  {
    id: 'sprint-money-credit',
    trackId: 'financial',
    eyebrow: 'CREDIT SPRINT',
    title: 'Utilization move',
    prompt: 'Your card limit is $2,000 and the statement will close with a $1,500 balance. You have $800 cash available. What helps credit readiness most?',
    lessonId: 'u8-l2',
    choices: [
      { id: 'a', text: 'Pay before the statement closes to lower reported utilization.', isCorrect: true, feedback: 'Correct. Lower reported utilization can improve the credit picture before a lender or landlord checks it.' },
      { id: 'b', text: 'Carry the balance to prove you can use debt.', isCorrect: false, feedback: 'Carrying debt adds interest cost and does not prove responsibility. On-time payment and lower utilization matter more.' },
      { id: 'c', text: 'Apply for three new cards immediately.', isCorrect: false, feedback: 'New applications can add inquiries and do not fix the current high reported balance.' },
    ],
  },
  {
    id: 'sprint-money-tax',
    trackId: 'financial',
    eyebrow: 'TAX SPRINT',
    title: 'Side income reserve',
    prompt: 'A student earns $700 freelancing and no tax is withheld. What should happen before that money gets treated as spendable?',
    lessonId: 'u9-l4',
    choices: [
      { id: 'a', text: 'Set aside a tax reserve and track business expenses.', isCorrect: true, feedback: 'Correct. Untaxed income needs a reserve, and expenses should be documented while details are fresh.' },
      { id: 'b', text: 'Spend it all because the client already paid.', isCorrect: false, feedback: 'Client payment is gross income. It is not automatically after-tax spending money.' },
      { id: 'c', text: 'Wait until filing season to reconstruct every expense.', isCorrect: false, feedback: 'Waiting makes records weaker and can create a cash surprise.' },
    ],
  },
  {
    id: 'sprint-money-insurance',
    trackId: 'financial',
    eyebrow: 'RISK SPRINT',
    title: 'Deductible reality',
    prompt: 'A cheaper policy has a $1,500 deductible, but you only have $250 saved. What is the risk?',
    lessonId: 'u12-l2',
    choices: [
      { id: 'a', text: 'The monthly premium is the only number that matters.', isCorrect: false, feedback: 'A low premium can hide a cash problem if the deductible would force debt during a claim.' },
      { id: 'b', text: 'A claim could still create a cash crunch.', isCorrect: true, feedback: 'Correct. Insurance reduces large risk, but deductibles and uncovered costs still need liquid savings.' },
      { id: 'c', text: 'Insurance always pays instantly with no cash needed.', isCorrect: false, feedback: 'Claims take process and may require deductibles, documentation, and uncovered costs.' },
    ],
  },
  {
    id: 'sprint-money-career',
    trackId: 'financial',
    eyebrow: 'CAREER SPRINT',
    title: 'Total compensation',
    prompt: 'Job A pays $2,000 more. Job B has better health coverage, a retirement match, and a shorter commute. What should you compare?',
    lessonId: 'u10-l3',
    choices: [
      { id: 'a', text: 'Salary only, because benefits are not real money.', isCorrect: false, feedback: 'Benefits, commute, learning, and time all change the real value of an offer.' },
      { id: 'b', text: 'Total compensation and quality-of-life costs.', isCorrect: true, feedback: 'Correct. The strongest offer is about spendable pay, benefits, growth, time, and risk together.' },
      { id: 'c', text: 'Whichever title sounds cooler.', isCorrect: false, feedback: 'Title can matter, but it should not replace the full compensation and growth analysis.' },
    ],
  },
  {
    id: 'sprint-money-housing',
    trackId: 'financial',
    eyebrow: 'HOUSING SPRINT',
    title: 'Rent reality check',
    prompt: 'A renter can technically qualify for an apartment, but move-in costs would wipe out their emergency fund. What should they check before signing?',
    lessonId: 'u14-l1',
    choices: [
      { id: 'a', text: 'Total monthly cost, move-in cash, lease terms, and savings room.', isCorrect: true, feedback: 'Correct. Approval is not the same as affordability; the lease needs to survive month one and month three.' },
      { id: 'b', text: 'Only whether the apartment has good photos.', isCorrect: false, feedback: 'Photos do not pay utilities, deposits, commute costs, or emergency expenses.' },
      { id: 'c', text: 'Whether friends think the neighborhood sounds cool.', isCorrect: false, feedback: 'Social approval is not a housing budget. Total cost and written terms matter first.' },
    ],
  },
  {
    id: 'sprint-money-auto',
    trackId: 'financial',
    eyebrow: 'AUTO SPRINT',
    title: 'Payment trap',
    prompt: 'A dealer lowers the monthly payment by stretching a loan from 48 to 72 months. What should the buyer compare?',
    lessonId: 'u15-l2',
    choices: [
      { id: 'a', text: 'APR, term, fees, total interest, and repair risk.', isCorrect: true, feedback: 'Correct. A smaller payment can still cost more and keep the loan around longer.' },
      { id: 'b', text: 'Only the lower monthly payment.', isCorrect: false, feedback: 'Monthly payment alone can hide a more expensive loan.' },
      { id: 'c', text: 'Only the color and trim package.', isCorrect: false, feedback: 'Preference matters after the financing and total cost make sense.' },
    ],
  },
  {
    id: 'sprint-invest-risk',
    trackId: 'investing',
    eyebrow: 'INVESTING SPRINT',
    title: 'Risk and time horizon',
    prompt: 'You need money for tuition in 8 months. Which investment choice fits best?',
    lessonId: 'inv1-l1',
    choices: [
      { id: 'a', text: 'A single fast-growing stock.', isCorrect: false, feedback: 'Short horizons cannot absorb stock volatility. The risk of needing to sell during a dip is too high.' },
      { id: 'b', text: 'Cash or a high-yield savings account.', isCorrect: true, feedback: 'Correct. Near-term money should prioritize stability and access over return.' },
      { id: 'c', text: 'Crypto because it trades every day.', isCorrect: false, feedback: 'Liquidity is not the same as stability. A liquid asset can still drop sharply.' },
    ],
  },
  {
    id: 'sprint-invest-diversify',
    trackId: 'investing',
    eyebrow: 'INVESTING SPRINT',
    title: 'Diversification check',
    prompt: 'A portfolio owns five different AI software stocks. What is the hidden risk?',
    lessonId: 'inv1-l1',
    choices: [
      { id: 'a', text: 'It is diversified because there are five tickers.', isCorrect: false, feedback: 'Ticker count is not enough. If all five respond to the same sector risk, they can fall together.' },
      { id: 'b', text: 'It is concentrated in one theme and sector.', isCorrect: true, feedback: 'Correct. Real diversification spreads across sectors, geographies, and asset types.' },
      { id: 'c', text: 'It has no risk if the companies are profitable.', isCorrect: false, feedback: 'Profitable companies can still be overvalued or hit by sector-wide shocks.' },
    ],
  },
  {
    id: 'sprint-invest-fees',
    trackId: 'investing',
    eyebrow: 'INVESTING SPRINT',
    title: 'Fee drag',
    prompt: 'Two broad funds track similar markets. One charges 0.03% and one charges 1.00% each year. What should you investigate?',
    lessonId: 'inv3-l4',
    choices: [
      { id: 'a', text: 'Whether the higher fee buys something meaningfully better.', isCorrect: true, feedback: 'Correct. Fees compound against you, so higher cost needs a clear reason.' },
      { id: 'b', text: 'Choose the higher fee because expensive means premium.', isCorrect: false, feedback: 'Investment cost is not like a luxury label. Higher fees can lower long-term return.' },
      { id: 'c', text: 'Ignore fees because they are small percentages.', isCorrect: false, feedback: 'Small annual percentages can matter a lot over decades.' },
    ],
  },
  {
    id: 'sprint-invest-position',
    trackId: 'investing',
    eyebrow: 'INVESTING SPRINT',
    title: 'Position size',
    prompt: 'A beginner wants to put 80% of their money into one stock after seeing a viral post. What is the main issue?',
    lessonId: 'inv2-l1',
    choices: [
      { id: 'a', text: 'Single-company concentration can dominate the whole portfolio.', isCorrect: true, feedback: 'Correct. A good thesis still needs position sizing, diversification, and downside planning.' },
      { id: 'b', text: 'Viral posts guarantee future returns.', isCorrect: false, feedback: 'Attention is not analysis. A viral idea can still be overpriced or wrong.' },
      { id: 'c', text: 'Risk disappears if the investor is excited.', isCorrect: false, feedback: 'Emotion does not change business risk, valuation risk, or market risk.' },
    ],
  },
  {
    id: 'sprint-invest-retirement',
    trackId: 'investing',
    eyebrow: 'RETIREMENT SPRINT',
    title: 'Match first',
    prompt: 'An employer matches retirement contributions up to a limit, and the worker has stable cash flow. What is usually the first target?',
    lessonId: 'u16-l1',
    choices: [
      { id: 'a', text: 'Contribute enough to capture the available match.', isCorrect: true, feedback: 'Correct. The match is part of compensation and can be a strong first retirement milestone.' },
      { id: 'b', text: 'Ignore it because retirement is far away.', isCorrect: false, feedback: 'Time is the advantage. Waiting can lose both match dollars and compounding years.' },
      { id: 'c', text: 'Pick investments only by recent social media hype.', isCorrect: false, feedback: 'Retirement needs a durable process, not attention-driven picks.' },
    ],
  },
  {
    id: 'sprint-invest-crisis',
    trackId: 'investing',
    eyebrow: 'INVESTOR SPRINT',
    title: 'Downturn plan',
    prompt: 'A diversified long-term portfolio drops 14%, but the money is not needed for 20 years. What should happen before selling?',
    lessonId: 'u17-l5',
    choices: [
      { id: 'a', text: 'Review time horizon, emergency cash, allocation, and written rules.', isCorrect: true, feedback: 'Correct. A plan written before panic is stronger than a decision made inside fear.' },
      { id: 'b', text: 'Sell everything because a drop always means failure.', isCorrect: false, feedback: 'Volatility can happen even when a long-term plan is still valid.' },
      { id: 'c', text: 'Borrow money to double down emotionally.', isCorrect: false, feedback: 'Leverage can turn volatility into forced selling risk.' },
    ],
  },
  {
    id: 'sprint-business-margin',
    trackId: 'business',
    eyebrow: 'FOUNDER SPRINT',
    title: 'Unit economics check',
    prompt: 'A creator sells a $25 guide. Platform fees are $3, ads cost $9 per buyer, and support costs $2. What matters before scaling?',
    lessonId: 'u6-l1',
    choices: [
      { id: 'a', text: 'Whether the $25 revenue sounds impressive.', isCorrect: false, feedback: 'Revenue is not the score. The question is how much contribution remains after costs.' },
      { id: 'b', text: 'Whether the guide leaves enough margin after $14 of costs.', isCorrect: true, feedback: 'Correct. Each sale contributes $11 before fixed costs and tax. Scaling starts with that math.' },
      { id: 'c', text: 'Whether the ad has the most likes.', isCorrect: false, feedback: 'Likes are weak unless they turn into profitable buyers.' },
    ],
  },
  {
    id: 'sprint-business-cash',
    trackId: 'business',
    eyebrow: 'FOUNDER SPRINT',
    title: 'Cash timing check',
    prompt: 'A studio wins a $6,000 project, but the client pays 45 days after delivery and contractors need $2,500 upfront. What should the founder negotiate?',
    lessonId: 'u6-l1',
    choices: [
      { id: 'a', text: 'A deposit and milestone payments.', isCorrect: true, feedback: 'Correct. Payment terms should match cash outflows so profit does not create a cash crunch.' },
      { id: 'b', text: 'A nicer project announcement.', isCorrect: false, feedback: 'Publicity does not pay contractors. The bottleneck is cash timing.' },
      { id: 'c', text: 'Nothing, because $6,000 revenue is enough.', isCorrect: false, feedback: 'Revenue due later cannot cover cash needed now. Terms matter.' },
    ],
  },
  {
    id: 'sprint-business-segment',
    trackId: 'business',
    eyebrow: 'FOUNDER SPRINT',
    title: 'Customer focus',
    prompt: 'A founder says their app is for "everyone who wants to be productive." What should they tighten first?',
    lessonId: 'u13-l1',
    choices: [
      { id: 'a', text: 'The specific customer, urgent problem, and switching reason.', isCorrect: true, feedback: 'Correct. A narrow segment makes the offer easier to build, sell, and test.' },
      { id: 'b', text: 'The logo animation.', isCorrect: false, feedback: 'Brand polish cannot replace knowing who has the pain and why they would switch.' },
      { id: 'c', text: 'The number of features.', isCorrect: false, feedback: 'More features can make the product harder to understand if the core customer is vague.' },
    ],
  },
  {
    id: 'sprint-business-pipeline',
    trackId: 'business',
    eyebrow: 'FOUNDER SPRINT',
    title: 'Follow-up system',
    prompt: 'A prospect liked the demo but has not replied for a week. What is the professional next move?',
    lessonId: 'u13-l4',
    choices: [
      { id: 'a', text: 'Send a useful recap with the problem, offer, next step, and deadline.', isCorrect: true, feedback: 'Correct. Good follow-up lowers decision friction without being chaotic.' },
      { id: 'b', text: 'Send ten vague check-ins today.', isCorrect: false, feedback: 'Pressure does not add value. The follow-up should make the decision clearer.' },
      { id: 'c', text: 'Delete the lead forever because silence always means no.', isCorrect: false, feedback: 'Buyers get busy. One clear follow-up belongs in a healthy pipeline.' },
    ],
  },
  {
    id: 'sprint-business-systems',
    trackId: 'business',
    eyebrow: 'FOUNDER SPRINT',
    title: 'Operator dashboard',
    prompt: 'Sales are up, but receipts are messy, inventory is unclear, and customers complain about slow updates. What should happen before buying more ads?',
    lessonId: 'u11-l5',
    choices: [
      { id: 'a', text: 'Build a weekly system for books, inventory, customer issues, and task ownership.', isCorrect: true, feedback: 'Correct. More demand can amplify messy operations if the business has no operating rhythm.' },
      { id: 'b', text: 'Ignore operations because sales growth fixes everything.', isCorrect: false, feedback: 'Sales growth can create cash, service, and quality problems if operations are fragile.' },
      { id: 'c', text: 'Hire randomly without documenting any process.', isCorrect: false, feedback: 'Delegation works best when the task, quality standard, and feedback loop are clear.' },
    ],
  },
  {
    id: 'sprint-business-product',
    trackId: 'business',
    eyebrow: 'PRODUCT SPRINT',
    title: 'MVP bottleneck',
    prompt: 'A marketplace gets signups, but users abandon before booking. What should the founder test next?',
    lessonId: 'u18-l3',
    choices: [
      { id: 'a', text: 'A focused booking-flow experiment with a clear conversion metric.', isCorrect: true, feedback: 'Correct. The test should target the visible bottleneck instead of rebuilding everything.' },
      { id: 'b', text: 'A random feature competitors have.', isCorrect: false, feedback: 'Competitor copying can miss the actual user drop-off.' },
      { id: 'c', text: 'More traffic before fixing the broken flow.', isCorrect: false, feedback: 'More traffic can amplify a conversion problem.' },
    ],
  },
  {
    id: 'sprint-business-legal',
    trackId: 'business',
    eyebrow: 'FOUNDER SPRINT',
    title: 'Contract before chaos',
    prompt: 'A client wants a $4,000 project delivered fast but refuses a deposit or written scope. What protects the founder?',
    lessonId: 'u19-l2',
    choices: [
      { id: 'a', text: 'Written scope, deposit, milestones, and payment terms before work starts.', isCorrect: true, feedback: 'Correct. Clear terms protect time, cash flow, and expectations.' },
      { id: 'b', text: 'Start immediately and hope payment arrives later.', isCorrect: false, feedback: 'Hope is not an accounts receivable process.' },
      { id: 'c', text: 'Let the scope expand without changing price.', isCorrect: false, feedback: 'Scope creep without price control damages margin.' },
    ],
  },
];

export default function DashboardScreen({
  aiHeaderButton,
  profile,
  lessonProgress,
  gameProgress,
  onOpenLesson,
  onLaunchGame,
  onChestOpened,
  onUpdatePortfolio,
  onOpenDailyTrivia,
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
  const tabBounce = useRef(new Animated.Value(1)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;

  const nextPathLesson = useMemo(
    () => getNextPathLesson(lessonProgress, profile),
    [lessonProgress, profile],
  );
  const firstName = profile.user.name.split(' ')[0] || profile.user.name;

  useEffect(() => {
    let isMounted = true;

    const loadMarketAssets = () => {
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
    };

    loadMarketAssets();
    // Keep ticker prices live; 60s keeps 8 symbols well inside free API tiers.
    const refreshInterval = setInterval(loadMarketAssets, 60000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    tabOpacity.setValue(0);
    tabTranslateY.setValue(14);
    tabBounce.setValue(0.8);
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
      Animated.spring(tabBounce, {
        toValue: 1,
        friction: 4,
        tension: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, tabOpacity, tabTranslateY, tabBounce]);

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
              profile={profile}
              lessonProgress={lessonProgress}
              gameProgress={gameProgress}
              nextPathLesson={nextPathLesson}
              marketAssets={marketAssets}
              marketStatus={marketStatus}
              lastUpdated={lastUpdated}
              onStartLesson={nextPathLesson ? () => onOpenLesson(nextPathLesson) : undefined}
              onOpenDailyTrivia={onOpenDailyTrivia}
              onNavigate={setActiveTab}
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
              <Animated.View
                style={[styles.tabButtonInner, isActive && { transform: [{ scale: tabBounce }] }]}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabTextActive]}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
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
  const [selectedTrack, setSelectedTrack] = useState<LearnTrackId>(() => getStartingPathId(profile));
  const [sprintIndex, setSprintIndex] = useState(0);
  const [selectedSprintChoiceId, setSelectedSprintChoiceId] = useState<string | null>(null);
  const activeTrack = learnTracks.find((track) => track.id === selectedTrack) ?? learnTracks[0]!;
  const visibleUnits = pathUnits.filter((unit) => selectedTrack === 'all' || getLearnTrackForUnit(unit) === selectedTrack);
  const pathProgress = getPathProgress(lessonProgress);
  const nextLesson = getNextPathLesson(lessonProgress, profile);
  const dailyGoal = lessonProgress.dailyXpGoal ?? 20;
  const dailyEarned = lessonProgress.dailyXpEarned ?? 0;
  const dailyPercent = Math.min(100, Math.round((dailyEarned / Math.max(1, dailyGoal)) * 100));
  const activeUnit = nextLesson ? pathUnits.find((unit) => unit.id === nextLesson.unitId) : undefined;
  const sprintQuestions = getSprintQuestionsForTrack(selectedTrack);
  const activeSprint = sprintQuestions[sprintIndex % sprintQuestions.length]!;
  const selectedSprintChoice = activeSprint.choices.find((choice) => choice.id === selectedSprintChoiceId);

  function handleSelectTrack(trackId: LearnTrackId) {
    setSelectedTrack(trackId);
    setSprintIndex(0);
    setSelectedSprintChoiceId(null);
  }

  function handleNextSprint() {
    setSprintIndex((current) => current + 1);
    setSelectedSprintChoiceId(null);
  }

  function handleOpenSprintLesson() {
    const lesson = getPathLessonById(activeSprint.lessonId);
    if (lesson) onOpenLesson(lesson);
  }

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
      <FadeSlideIn delay={0}>
        <View style={styles.learnHero}>
          <Text style={styles.eyebrow}>LEARN</Text>
          <Text style={styles.learnHeroTitle}>Build real money skills</Text>
          <Text style={styles.learnHeroBody}>
            Bite-sized drills for financial literacy, investing, business, and entrepreneurship.
          </Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={70}>
        <LearnHUD
          streak={lessonProgress.streak}
          brainBucks={lessonProgress.brainBucks ?? 0}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={140}>
        <View style={styles.learnStatsGrid}>
          <LearningStat label="XP" value={`${lessonProgress.xp}`} detail="earned" />
          <LearningStat label="Today" value={`${dailyEarned}/${dailyGoal}`} detail={`${dailyPercent}% goal`} />
          <LearningStat label="Path" value={`${pathProgress.completed}/${pathProgress.total}`} detail="lessons" />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={210} style={styles.nextLessonPanel}>
        <View style={styles.nextLessonCopy}>
          <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>NEXT LESSON</Text>
          <Text style={styles.nextLessonTitle}>{nextLesson?.title ?? 'All lessons complete'}</Text>
          <Text style={styles.nextLessonBody}>
            {nextLesson
              ? `${activeUnit?.title ?? nextLesson.unitTitle} / ${nextLesson.exercises?.length ?? 0} exercises / ${nextLesson.xp} XP`
              : 'You finished the current curriculum. Review any unit to keep your streak sharp.'}
          </Text>
        </View>
        {nextLesson ? (
          <TouchableOpacity style={styles.nextLessonButton} activeOpacity={0.86} onPress={() => onOpenLesson(nextLesson)}>
            <Text style={styles.nextLessonButtonText}>{ICON.star}  START</Text>
          </TouchableOpacity>
        ) : null}
      </FadeSlideIn>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.learnTrackRail}
        contentContainerStyle={styles.learnTrackRailContent}
      >
        {learnTracks.map((track) => {
          const isActive = selectedTrack === track.id;
          const trackStats = getTrackProgress(pathUnits, lessonProgress, track.id);
          return (
            <TouchableOpacity
              key={track.id}
              style={[styles.learnTrackChip, isActive && { backgroundColor: track.accent, borderColor: track.accent }]}
              activeOpacity={0.82}
              onPress={() => handleSelectTrack(track.id)}
            >
              <Text style={[styles.learnTrackChipLabel, isActive && styles.learnTrackChipLabelActive]}>{track.label}</Text>
              <Text style={[styles.learnTrackChipMeta, isActive && styles.learnTrackChipMetaActive]}>
                {trackStats.completed}/{trackStats.total}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.trackFocusPanel, { borderColor: activeTrack.accent }]}>
        <Text style={[styles.trackFocusEyebrow, { color: activeTrack.accent }]}>{activeTrack.eyebrow}</Text>
        <Text style={styles.trackFocusTitle}>{activeTrack.title}</Text>
        <Text style={styles.trackFocusBody}>{activeTrack.description}</Text>
        <View style={styles.trackFocusMetaRow}>
          <Text style={styles.trackFocusMeta}>{visibleUnits.length} units</Text>
          <Text style={styles.trackFocusMeta}>{getTrackProgress(pathUnits, lessonProgress, selectedTrack).total} lessons</Text>
        </View>
      </View>

      <SkillSprintPanel
        sprint={activeSprint}
        selectedChoice={selectedSprintChoice}
        onChoose={setSelectedSprintChoiceId}
        onNext={handleNextSprint}
        onOpenLesson={handleOpenSprintLesson}
      />

      <View style={styles.dailyDrillPanel}>
        <Text style={styles.panelEyebrow}>TODAY'S DRILLS</Text>
        <DailyDrillRow title="Complete one lesson" value={nextLesson?.title ?? 'Review a completed unit'} progress={nextLesson ? dailyPercent : 100} />
        <DailyDrillRow title="Practice decision math" value="Budgets, margins, risk, and tradeoffs" progress={Math.min(100, Math.round((pathProgress.completed / Math.max(1, pathProgress.total)) * 100))} />
        <DailyDrillRow title="Bank the win" value={`${lessonProgress.brainBucks ?? 0} Brain Bucks available`} progress={Math.min(100, (lessonProgress.brainBucks ?? 0) % 100)} />
      </View>

      <View style={styles.courseSectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{selectedTrack === 'all' ? 'Skill Tree' : activeTrack.label}</Text>
          <Text style={styles.sectionMeta}>{getTrackProgress(pathUnits, lessonProgress, selectedTrack).completed} complete</Text>
        </View>
      </View>

      <View style={styles.gameGrid}>
        {visibleUnits.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            unitIndex={pathUnits.indexOf(unit) + 1}
            lessonProgress={lessonProgress}
            onPress={() => setSelectedUnitId(unit.id)}
          />
        ))}
      </View>
    </View>
  );
}

function LearningStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <View style={styles.learningStat}>
      <Text style={styles.learningStatLabel}>{label}</Text>
      <Text style={styles.learningStatValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.learningStatDetail}>{detail}</Text>
    </View>
  );
}

function DailyDrillRow({ title, value, progress }: { title: string; value: string; progress: number }) {
  const width = `${Math.max(8, Math.min(100, progress))}%` as const;
  return (
    <View style={styles.dailyDrillRow}>
      <View style={styles.dailyDrillCopy}>
        <Text style={styles.dailyDrillTitle}>{title}</Text>
        <Text style={styles.dailyDrillValue} numberOfLines={1}>{value}</Text>
      </View>
      <View style={styles.dailyDrillProgressTrack}>
        <View style={[styles.dailyDrillProgressFill, { width }]} />
      </View>
    </View>
  );
}

type SkillSprintPanelProps = {
  sprint: LearnSprintQuestion;
  selectedChoice?: LearnSprintChoice;
  onChoose: (choiceId: string) => void;
  onNext: () => void;
  onOpenLesson: () => void;
};

function SkillSprintPanel({
  sprint,
  selectedChoice,
  onChoose,
  onNext,
  onOpenLesson,
}: SkillSprintPanelProps) {
  const track = learnTracks.find((item) => item.id === sprint.trackId) ?? learnTracks[0]!;
  return (
    <View style={[styles.skillSprintPanel, { borderColor: track.accent }]}>
      <View style={styles.skillSprintHeader}>
        <View style={styles.skillSprintCopy}>
          <Text style={[styles.trackFocusEyebrow, { color: track.accent }]}>{sprint.eyebrow}</Text>
          <Text style={styles.skillSprintTitle}>{sprint.title}</Text>
        </View>
        <View style={[styles.skillSprintBadge, { backgroundColor: track.accent }]}>
          <Text style={styles.skillSprintBadgeText}>{track.label}</Text>
        </View>
      </View>

      <Text style={styles.skillSprintPrompt}>{sprint.prompt}</Text>

      <View style={styles.skillSprintChoices}>
        {sprint.choices.map((choice) => {
          const isSelected = selectedChoice?.id === choice.id;
          const hasAnswered = selectedChoice !== undefined;
          return (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.skillSprintChoice,
                isSelected && styles.skillSprintChoiceSelected,
                hasAnswered && isSelected && (choice.isCorrect ? styles.skillSprintChoiceCorrect : styles.skillSprintChoiceWrong),
              ]}
              activeOpacity={0.82}
              onPress={() => onChoose(choice.id)}
            >
              <Text style={[styles.skillSprintChoiceText, isSelected && !hasAnswered && styles.skillSprintChoiceTextSelected]}>
                {choice.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedChoice ? (
        <View style={[
          styles.skillSprintFeedback,
          selectedChoice.isCorrect ? styles.skillSprintFeedbackCorrect : styles.skillSprintFeedbackWrong,
        ]}>
          <Text style={styles.skillSprintFeedbackTitle}>
            {selectedChoice.isCorrect ? 'Good call' : 'Try the logic'}
          </Text>
          <Text style={styles.skillSprintFeedbackBody}>{selectedChoice.feedback}</Text>
          <View style={styles.skillSprintActions}>
            <TouchableOpacity style={styles.skillSprintActionSecondary} onPress={onNext} activeOpacity={0.82}>
              <Text style={styles.skillSprintActionSecondaryText}>NEXT SPRINT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skillSprintActionPrimary} onPress={onOpenLesson} activeOpacity={0.82}>
              <Text style={styles.skillSprintActionPrimaryText}>OPEN LESSON</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

// ─── UnitCard (mirrors GameCard exactly) ─────────────────────────────────────

type UnitCardProps = {
  unit: PathUnit;
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
  const track = learnTracks.find((item) => item.id === getLearnTrackForUnit(unit)) ?? learnTracks[0]!;
  const unitProgress = getUnitCompletion(unit, lessonProgress);
  const nextLesson = getUnitNextLesson(unit, lessonProgress);
  const progressWidth = `${unitProgress.percent}%` as const;
  const lessonLabel = unitProgress.total === 1 ? 'lesson' : 'lessons';
  const cardStyle = [
    styles.unitCourseCard,
    isLocked && styles.unitCourseCardLocked,
    isCompleted && styles.unitCourseCardComplete,
    !isLocked && !isCompleted && { borderColor: track.accent },
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      activeOpacity={isLocked ? 1 : 0.84}
      onPress={isLocked ? undefined : onPress}
      disabled={isLocked}
    >
      <View style={styles.unitCourseHeader}>
        <View style={[styles.unitCourseBadge, !isLocked && { backgroundColor: track.accent }]}>
          <Text style={styles.unitCourseBadgeText}>{unitIndex}</Text>
        </View>
        <View style={styles.unitCourseHeaderCopy}>
          <Text style={[styles.unitCourseEyebrow, isCompleted && styles.unitCourseTextOnDark]}>
            {UNIT_STATE_LABEL[state]} / {track.label.toUpperCase()}
          </Text>
          <Text style={[styles.unitCourseTitle, isCompleted && styles.unitCourseTextOnDark]} numberOfLines={2}>
            {unit.title}
          </Text>
        </View>
        <Text style={[styles.unitCourseToken, isCompleted && styles.unitCourseTokenOnDark]}>
          {UNIT_STATE_TOKEN[state]}
        </Text>
      </View>

      <Text style={[styles.unitCourseBody, isCompleted && styles.unitCourseTextOnDark]}>{unit.subtitle}</Text>

      <View style={styles.unitCourseProgressTrack}>
        <View style={[styles.unitCourseProgressFill, { width: progressWidth, backgroundColor: isCompleted ? colors.yellow : track.accent }]} />
      </View>

      <View style={styles.unitCourseFooter}>
        <Text style={[styles.unitCourseMeta, isCompleted && styles.unitCourseTextOnDark]} numberOfLines={1}>
          {unitProgress.completed}/{unitProgress.total} {lessonLabel}
        </Text>
        <Text style={[styles.unitCourseMeta, isCompleted && styles.unitCourseTextOnDark]} numberOfLines={1}>
          {nextLesson && !isLocked ? `Next: ${nextLesson.title}` : isLocked ? 'Complete the prior unit' : 'Review anytime'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── UnitPathView (winding path for a single unit) ───────────────────────────

type UnitPathViewProps = {
  unit: PathUnit;
  lessonProgress: LessonProgress;
  onOpenLesson: (lesson: Lesson) => void;
  onChestOpened?: (chestId: string, reward: { brainBucks: number; xp: number }) => void;
  onBack: () => void;
};

function UnitPathView({ unit, lessonProgress, onOpenLesson, onChestOpened, onBack }: UnitPathViewProps) {
  const insets = useSafeAreaInsets();
  const [chestModal, setChestModal] = useState<{ id: string; brainBucks: number; xp: number } | null>(null);
  const [gbVisible, setGbVisible] = useState(false);
  const nodeStates = computeNodeStates(unit, lessonProgress);
  const masteryTier = getUnitMasteryTier(unit, lessonProgress);
  const unitProgress = getUnitCompletion(unit, lessonProgress);
  const nextLesson = getUnitNextLesson(unit, lessonProgress);
  const unitTrack = learnTracks.find((track) => track.id === getLearnTrackForUnit(unit)) ?? learnTracks[0]!;

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
        <View style={styles.unitPathProgressTrack}>
          <View style={[styles.unitPathProgressFill, { width: `${unitProgress.percent}%`, backgroundColor: unitTrack.accent }]} />
        </View>
        <View style={styles.unitPathMetaRow}>
          <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>{unitProgress.completed}/{unitProgress.total} LESSONS</Text>
          <Text style={[styles.panelEyebrow, styles.panelEyebrowOnDark]}>{nextLesson ? `${nextLesson.xp} XP NEXT` : 'REVIEW MODE'}</Text>
        </View>
        {unit.guidebook.length > 0 && (
          <TouchableOpacity onPress={() => setGbVisible(true)} style={styles.unitPathGbBtn}>
            <Text style={styles.yellowButtonText}>{ICON.lines}  GUIDEBOOK</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.unitSyllabusPanel}>
        <Text style={styles.panelEyebrow}>UNIT PLAN</Text>
        {getUnitLessonNodes(unit).map((node, index) => {
          const lesson = node.lessonId ? getPathLessonById(node.lessonId) : undefined;
          const state = nodeStates[node.id] ?? 'locked';
          return (
            <View key={node.id} style={styles.unitSyllabusRow}>
              <View style={[styles.unitSyllabusIndex, state === 'completed' && styles.unitSyllabusIndexComplete]}>
                <Text style={[styles.unitSyllabusIndexText, state === 'completed' && styles.unitSyllabusIndexTextComplete]}>
                  {state === 'completed' ? ICON.check : index + 1}
                </Text>
              </View>
              <View style={styles.unitSyllabusCopy}>
                <Text style={styles.unitSyllabusTitle} numberOfLines={1}>{lesson?.title ?? 'Lesson'}</Text>
                <Text style={styles.unitSyllabusMeta}>
                  {state.toUpperCase()} / {lesson?.exercises?.length ?? 0} drills / {lesson?.xp ?? 0} XP
                </Text>
              </View>
            </View>
          );
        })}
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
        <View style={[styles.featurePanel, { borderRadius: 0, marginTop: 0, paddingTop: insets.top + 14 }]}>
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
      <FadeSlideIn delay={0}>
        <TabHero
          eyebrow="GAMES"
          title="Money arcade"
          body="Coach-picked games, open exploration, mastery rings, and short tycoon runs that build real money instincts."
        />
      </FadeSlideIn>

      <FadeSlideIn delay={80} style={styles.gameHeroPanel}>
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
      </FadeSlideIn>

      <FadeSlideIn delay={160} style={styles.zonePanel}>
        <ZoneRow zone="Continue" value={lastResult ? `${lastResult.eventTitle} / $${lastResult.profit} profit` : 'No saved run yet'} />
        <ZoneRow zone="By Topic" value="Games grouped by competency domain" />
        <ZoneRow zone="Challenges" value="Daily timed practice" />
        <ZoneRow zone="Mastery Map" value={`${completedGames} game results logged`} />
        <ZoneRow zone="All Games" value={`${gameDefinitions.length} games in the catalogue`} />
      </FadeSlideIn>

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

// Web-only: a non-clickable cursor for coming-soon cards. `cursor` is a valid
// react-native-web style but isn't in this RN version's CursorValue union, and
// it is harmlessly ignored on native.
const webDefaultCursor = { cursor: 'default' } as unknown as import('react-native').ViewStyle;

function GameCard({ game, isLocked, onPress }: GameCardProps) {
  const content = (
    <>
      <View style={styles.gameCardHeader}>
        <Text style={styles.gameLabel}>{game.isPlayable ? 'PLAYABLE' : 'COMING NEXT'}</Text>
        <Text style={styles.gameToken}>{isLocked ? 'LOCKED' : 'PLAY'}</Text>
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
    </>
  );

  // Coming-soon games are completely non-interactive: no onPress, no pointer
  // events at all, and a default (non-clickable) cursor on web. Visuals are
  // unchanged from the playable cards apart from the existing locked style.
  if (isLocked) {
    return (
      <View
        style={[styles.gameCard, styles.gameCardLocked, webDefaultCursor]}
        pointerEvents="none"
      >
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.gameCard} activeOpacity={0.84} onPress={onPress}>
      {content}
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
    text: "Hi, I'm Coinly AI"
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
  marketAssets: MarketAsset[];
  marketStatus: 'loading' | 'ready' | 'fallback';
  lastUpdated: string | null;
};

function ExploreTab({ marketAssets, marketStatus, lastUpdated }: ExploreProps) {
  const [selectedTopic, setSelectedTopic] = useState<MoneyWorldTopicId>('markets');
  const [topicFeed, setTopicFeed] = useState<MoneyWorldTopicFeed | null>(null);
  const [isTopicLoading, setIsTopicLoading] = useState(true);
  const [topicError, setTopicError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketAsset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [relatedNews, setRelatedNews] = useState<FinanceNewsItem[]>([]);
  const [isRelatedNewsLoading, setIsRelatedNewsLoading] = useState(false);
  const [relatedNewsError, setRelatedNewsError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchRequestId = useRef(0);
  const relatedNewsRequestId = useRef(0);
  const activeTopic = topicFeed?.topic
    ?? moneyWorldTopics.find((topic) => topic.id === selectedTopic)
    ?? moneyWorldTopics[0];

  useEffect(() => {
    let isMounted = true;
    fadeAnim.setValue(0);
    setIsTopicLoading(true);
    setTopicError(null);

    fetchMoneyWorldTopicFeed(selectedTopic)
      .then((feed) => {
        if (!isMounted) return;
        setTopicFeed(feed);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Money world feed failed', err);
        setTopicFeed(null);
        setTopicError('The live money world feed could not load. Try another topic in a moment.');
      })
      .finally(() => {
        if (isMounted) setIsTopicLoading(false);
      });

    return () => { isMounted = false; };
  }, [fadeAnim, selectedTopic]);

  const handleSearch = async () => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) {
      setSearchResults([]);
      setSearchError('Type a company, ETF, crypto, or money topic to search live markets.');
      return;
    }

    const requestId = searchRequestId.current + 1;
    searchRequestId.current = requestId;
    setIsSearching(true);
    setSearchResults([]);
    setSelectedAsset(null);
    setRelatedNews([]);
    setRelatedNewsError(null);
    setSearchError(null);

    const localResults = getLocalLiveSearchResults(cleanQuery, [
      ...marketAssets,
      ...(topicFeed?.assets ?? []),
    ]);
    if (localResults.length > 0) {
      setSearchResults(localResults);
      setIsSearching(false);
      return;
    }

    try {
      const results = await searchAssetsByQuery(cleanQuery);
      const assets = await Promise.all(
        results.map((result) => fetchLiveQuote(result).catch((err) => {
          console.warn('Failed to fetch quote for', result.id, err);
          return null;
        })),
      );
      if (searchRequestId.current !== requestId) return;
      const liveAssets = assets.filter((asset): asset is MarketAsset => asset !== null);
      setSearchResults(liveAssets);
      if (liveAssets.length === 0) {
        setSearchError('No live results came back for that search. Try a ticker like AAPL, SPY, BTC, or XHB.');
      }
    } catch (err) {
      console.warn('Search failed', err);
      if (searchRequestId.current === requestId) {
        setSearchError('Live search failed. Try again in a moment.');
      }
    } finally {
      if (searchRequestId.current === requestId) setIsSearching(false);
    }
  };

  const handleSelectResult = (asset: MarketAsset) => {
    setSearchResults([]);
    setSelectedAsset(asset);
    setRelatedNews([]);
    setRelatedNewsError(null);
    setIsRelatedNewsLoading(true);

    const requestId = relatedNewsRequestId.current + 1;
    relatedNewsRequestId.current = requestId;
    fetchFinanceNews({ symbols: getNewsSymbolsForAsset(asset), limit: 4 })
      .then((items) => {
        if (relatedNewsRequestId.current !== requestId) return;
        setRelatedNews(items);
        setRelatedNewsError(items.length === 0 ? 'No live related headlines came back for this asset.' : null);
      })
      .catch((err) => {
        console.warn('Related news failed', err);
        if (relatedNewsRequestId.current === requestId) {
          setRelatedNewsError('Related live headlines are unavailable right now.');
        }
      })
      .finally(() => {
        if (relatedNewsRequestId.current === requestId) setIsRelatedNewsLoading(false);
      });
  };

  return (
    <View>
      <TabHero
        eyebrow="EXPLORE"
        title="Money world live"
        body="Explore real companies, markets, crypto, housing, and business sectors through live public data."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.topicRail}
        contentContainerStyle={styles.topicRailContent}
      >
        {moneyWorldTopics.map((topic) => {
          const isActive = selectedTopic === topic.id;
          return (
            <TouchableOpacity
              key={topic.id}
              style={[styles.topicChip, isActive && styles.topicChipActive]}
              activeOpacity={0.82}
              onPress={() => setSelectedTopic(topic.id)}
            >
              <Text style={[styles.topicChipText, isActive && styles.topicChipTextActive]}>
                {topic.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.explorePulsePanel}>
        <View style={styles.explorePanelHeader}>
          <View style={styles.explorePanelCopy}>
            <Text style={styles.panelEyebrow}>{activeTopic.pulseLabel}</Text>
            <Text style={styles.explorePanelTitle}>{activeTopic.label}</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.explorePanelBody}>{activeTopic.description}</Text>

        {isTopicLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.black} />
            <Text style={styles.loadingText}>Loading live signals...</Text>
          </View>
        ) : topicError ? (
          <Text style={styles.exploreErrorText}>{topicError}</Text>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {topicFeed?.assets.length ? (
              <View style={styles.marketList}>
                {topicFeed.assets.map((asset) => (
                  <MarketRow key={asset.id} asset={asset} expanded />
                ))}
              </View>
            ) : (
              <Text style={styles.loadingText}>No live quotes came back for this topic.</Text>
            )}
            {topicFeed?.assetError ? (
              <Text style={styles.exploreErrorText}>{topicFeed.assetError}</Text>
            ) : null}
          </Animated.View>
        )}
      </View>

      <View style={styles.searchPanel}>
        <Text style={styles.searchEyebrow}>LIVE LOOKUP</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="AAPL, bitcoin, XHB..."
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
        <Text style={styles.searchHint}>Search a company, ETF, crypto asset, index fund, or rate-sensitive fund.</Text>
        {isSearching ? (
          <ActivityIndicator style={{ marginTop: 16 }} color={colors.black} />
        ) : searchResults.length > 0 ? (
          <View style={styles.searchResultsContainer}>
            {searchResults.map((asset, idx) => (
              <TouchableOpacity
                key={`${asset.id}-${idx}`}
                style={[
                  styles.searchResultTapRow,
                  idx === searchResults.length - 1 && styles.searchResultTapRowLast,
                ]}
                activeOpacity={0.7}
                onPress={() => handleSelectResult(asset)}
              >
                <MarketRow asset={asset} />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        {searchError ? <Text style={styles.exploreErrorText}>{searchError}</Text> : null}
      </View>

      {selectedAsset ? (
        <View style={styles.assetDeepDivePanel}>
          <View style={styles.explorePanelHeader}>
            <View style={styles.explorePanelCopy}>
              <Text style={styles.panelEyebrow}>LIVE DEEP DIVE</Text>
              <Text style={styles.explorePanelTitle}>{selectedAsset.label}</Text>
            </View>
            <View style={styles.assetTypePill}>
              <Text style={styles.assetTypePillText}>{selectedAsset.kind.toUpperCase()}</Text>
            </View>
          </View>
          <MarketRow asset={selectedAsset} expanded />
          <View style={styles.assetMetricRow}>
            <View style={styles.assetMetricBox}>
              <Text style={styles.assetMetricLabel}>SOURCE</Text>
              <Text style={styles.assetMetricValue} numberOfLines={1}>{selectedAsset.source}</Text>
            </View>
            <View style={styles.assetMetricBox}>
              <Text style={styles.assetMetricLabel}>SYMBOL</Text>
              <Text style={styles.assetMetricValue} numberOfLines={1}>{selectedAsset.symbol}</Text>
            </View>
            <View style={styles.assetMetricBox}>
              <Text style={styles.assetMetricLabel}>MOVE</Text>
              <Text
                style={[
                  styles.assetMetricValue,
                  (selectedAsset.changePercent ?? 0) >= 0 ? styles.positiveText : styles.negativeText,
                ]}
                numberOfLines={1}
              >
                {formatPercent(selectedAsset.changePercent)}
              </Text>
            </View>
          </View>

          <View style={styles.relatedNewsHeader}>
            <Text style={styles.panelEyebrow}>RELATED HEADLINES</Text>
          </View>
          {isRelatedNewsLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.black} />
              <Text style={styles.loadingText}>Finding live related headlines...</Text>
            </View>
          ) : (
            <NewsList news={relatedNews} emptyText={relatedNewsError ?? 'No related headlines available.'} compact />
          )}
        </View>
      ) : null}

      <View style={styles.newsPanel}>
        <View style={styles.marketHeader}>
          <View>
            <Text style={styles.panelEyebrow}>LIVE HEADLINES</Text>
            <Text style={styles.disclaimer}>{activeTopic.label}</Text>
          </View>
        </View>
        {isTopicLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.black} />
            <Text style={styles.loadingText}>Fetching latest news...</Text>
          </View>
        ) : (
          <Animated.View style={[styles.newsList, { opacity: fadeAnim }]}>
            <NewsList
              news={topicFeed?.news ?? []}
              emptyText={topicFeed?.newsError ?? 'No live headlines available for this topic.'}
            />
          </Animated.View>
        )}
      </View>

      <MarketPreview assets={marketAssets} status={marketStatus} lastUpdated={lastUpdated} expanded />
    </View>
  );
}

function NewsList({
  news,
  emptyText,
  compact,
}: {
  news: FinanceNewsItem[];
  emptyText: string;
  compact?: boolean;
}) {
  if (news.length === 0) {
    return <Text style={styles.loadingText}>{emptyText}</Text>;
  }

  return (
    <View style={compact ? styles.relatedNewsList : styles.newsListInline}>
      {news.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.newsCard, compact && styles.newsCardCompact]}
          activeOpacity={0.7}
          onPress={() => Linking.openURL(item.link)}
        >
          <Text style={[styles.newsTitle, compact && styles.newsTitleCompact]} numberOfLines={compact ? 2 : 3}>
            {item.title}
          </Text>
          {!compact && item.description ? (
            <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <Text style={styles.newsDate} numberOfLines={1}>{item.pubDate || 'Live feed'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getNewsSymbolsForAsset(asset: MarketAsset) {
  if (asset.kind === 'crypto') {
    return [`${asset.symbol}-USD`];
  }

  return [asset.symbol];
}

function getLocalLiveSearchResults(query: string, assets: MarketAsset[]) {
  const cleanQuery = query.trim().toUpperCase();
  const matches = assets.filter((asset) => {
    if (asset.isFallback) return false;
    return asset.symbol.toUpperCase() === cleanQuery
      || asset.label.toUpperCase().includes(cleanQuery);
  });

  return dedupeAssets(matches).slice(0, 4);
}

function dedupeAssets(assets: MarketAsset[]) {
  const seen = new Set<string>();
  return assets.filter((asset) => {
    const key = `${asset.source}-${asset.symbol}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
        <Text style={styles.assetLabel} numberOfLines={1}>{asset.label}</Text>
        <Text style={styles.assetMeta} numberOfLines={1}>
          {asset.symbol} / {asset.source}
          {asset.isFallback ? ' fallback' : ''}
        </Text>
      </View>
      <View style={styles.assetPriceBlock}>
        <Text style={styles.assetPrice} numberOfLines={1}>{formatCurrency(asset.price)}</Text>
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

function getLearnTrackForUnit(unit: PathUnit): Exclude<LearnTrackId, 'all'> {
  return getLearningPathIdForUnit(unit);
}

function getUnitNextLesson(unit: PathUnit, progress: LessonProgress) {
  const completedIds = new Set(progress.completedLessonIds);
  const nextNode = getUnitLessonNodes(unit).find((node) => node.lessonId && !completedIds.has(node.lessonId));
  return nextNode?.lessonId ? getPathLessonById(nextNode.lessonId) : undefined;
}

function getTrackProgress(units: PathUnit[], progress: LessonProgress, trackId: LearnTrackId) {
  const filteredUnits = trackId === 'all'
    ? units
    : units.filter((unit) => getLearnTrackForUnit(unit) === trackId);
  return filteredUnits.reduce(
    (acc, unit) => {
      const unitProgress = getUnitCompletion(unit, progress);
      acc.completed += unitProgress.completed;
      acc.total += unitProgress.total;
      return acc;
    },
    { completed: 0, total: 0 },
  );
}

function getSprintQuestionsForTrack(trackId: LearnTrackId) {
  if (trackId === 'all') return learnSprintQuestions;
  const filtered = learnSprintQuestions.filter((question) => {
    const lesson = getPathLessonById(question.lessonId);
    if (!lesson) return false;
    const unit = getPathUnits().find((candidate) => candidate.id === lesson.unitId);
    return unit ? getLearningPathIdForUnit(unit) === trackId : false;
  });
  // Some paths (e.g. Little Savers) have no dedicated sprint yet — fall back to
  // the full set so the Skill Sprint panel always has a question to show.
  return filtered.length > 0 ? filtered : learnSprintQuestions;
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
  learnHero: {
    marginTop: 34,
  },
  learnHeroTitle: {
    marginTop: 8,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 44,
    lineHeight: 49,
    includeFontPadding: false,
  },
  learnHeroBody: {
    marginTop: 14,
    color: colors.black,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
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
  learnStatsGrid: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 10,
  },
  learningStat: {
    flex: 1,
    minHeight: 86,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  learningStatLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  learningStatValue: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 19,
  },
  learningStatDetail: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  nextLessonPanel: {
    marginTop: 18,
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.yellow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  nextLessonCopy: {
    flex: 1,
    minWidth: 0,
  },
  nextLessonTitle: {
    marginTop: 6,
    color: colors.yellow,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 27,
    lineHeight: 31,
    includeFontPadding: false,
  },
  nextLessonBody: {
    marginTop: 8,
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  nextLessonButton: {
    minWidth: 86,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  nextLessonButtonText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
  },
  learnTrackRail: {
    marginTop: 18,
  },
  learnTrackRailContent: {
    gap: 8,
    paddingRight: 4,
  },
  learnTrackChip: {
    minWidth: 98,
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  learnTrackChipLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  learnTrackChipLabelActive: {
    color: colors.white,
  },
  learnTrackChipMeta: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  learnTrackChipMetaActive: {
    color: colors.yellow,
  },
  trackFocusPanel: {
    marginTop: 16,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
  },
  trackFocusEyebrow: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  trackFocusTitle: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
    lineHeight: 34,
    includeFontPadding: false,
  },
  trackFocusBody: {
    marginTop: 8,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  trackFocusMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  trackFocusMeta: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  skillSprintPanel: {
    marginTop: 18,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
  },
  skillSprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  skillSprintCopy: {
    flex: 1,
    minWidth: 0,
  },
  skillSprintTitle: {
    marginTop: 4,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    lineHeight: 32,
    includeFontPadding: false,
  },
  skillSprintBadge: {
    minWidth: 76,
    minHeight: 34,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillSprintBadgeText: {
    color: colors.white,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  skillSprintPrompt: {
    marginTop: 12,
    color: colors.black,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
  },
  skillSprintChoices: {
    marginTop: 14,
    gap: 10,
  },
  skillSprintChoice: {
    minHeight: 54,
    borderWidth: 2,
    borderColor: 'rgba(16, 36, 29, 0.18)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  skillSprintChoiceSelected: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  skillSprintChoiceCorrect: {
    borderColor: colors.positive,
    backgroundColor: '#D4EDDA',
  },
  skillSprintChoiceWrong: {
    borderColor: colors.negative,
    backgroundColor: '#F8D7DA',
  },
  skillSprintChoiceText: {
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  skillSprintChoiceTextSelected: {
    color: colors.white,
  },
  skillSprintFeedback: {
    marginTop: 14,
    borderRadius: 8,
    padding: 14,
    borderWidth: 2,
  },
  skillSprintFeedbackCorrect: {
    borderColor: colors.positive,
    backgroundColor: '#D4EDDA',
  },
  skillSprintFeedbackWrong: {
    borderColor: colors.negative,
    backgroundColor: '#F8D7DA',
  },
  skillSprintFeedbackTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 15,
  },
  skillSprintFeedbackBody: {
    marginTop: 6,
    color: colors.black,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  skillSprintActions: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  skillSprintActionSecondary: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillSprintActionSecondaryText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  skillSprintActionPrimary: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillSprintActionPrimaryText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  dailyDrillPanel: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 14,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  dailyDrillRow: {
    minHeight: 54,
    justifyContent: 'center',
    gap: 8,
  },
  dailyDrillCopy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dailyDrillTitle: {
    flex: 1,
    color: colors.black,
    fontWeight: '900',
    fontSize: 14,
  },
  dailyDrillValue: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textAlign: 'right',
  },
  dailyDrillProgressTrack: {
    height: 7,
    borderRadius: 7,
    backgroundColor: 'rgba(16, 36, 29, 0.16)',
    overflow: 'hidden',
  },
  dailyDrillProgressFill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.yellow,
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    color: '#8A9BB5',
    textTransform: 'uppercase' as const,
    marginTop: 28,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  unitCourseCard: {
    minHeight: 188,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 15,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  unitCourseCardLocked: {
    opacity: 0.54,
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
  },
  unitCourseCardComplete: {
    backgroundColor: colors.positive,
    borderColor: colors.positive,
  },
  unitCourseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  unitCourseBadge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitCourseBadgeText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
  },
  unitCourseHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  unitCourseEyebrow: {
    color: colors.muted,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  unitCourseTitle: {
    marginTop: 3,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 25,
    lineHeight: 29,
    includeFontPadding: false,
  },
  unitCourseToken: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
  },
  unitCourseTokenOnDark: {
    color: colors.yellow,
  },
  unitCourseBody: {
    marginTop: 12,
    color: colors.black,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  unitCourseProgressTrack: {
    marginTop: 14,
    height: 9,
    borderRadius: 9,
    backgroundColor: 'rgba(16, 36, 29, 0.14)',
    overflow: 'hidden',
  },
  unitCourseProgressFill: {
    height: '100%',
    borderRadius: 9,
  },
  unitCourseFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  unitCourseMeta: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  unitCourseTextOnDark: {
    color: colors.white,
  },
  lockScreen: {
    alignItems: 'center' as const,
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 16,
  },
  lockIcon: {
    fontSize: 48,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center' as const,
  },
  lockBody: {
    fontSize: 15,
    color: '#8A9BB5',
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  lockEmphasis: {
    color: '#BE9B4C',
    fontWeight: '600' as const,
  },
  lockProgress: {
    fontSize: 13,
    color: '#8A9BB5',
  },
  lockCta: {
    marginTop: 8,
    backgroundColor: '#BE9B4C',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  lockCtaText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700' as const,
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
  triviaCard: {
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#F5C142',
    backgroundColor: '#FFFDF4',
    overflow: 'hidden',
  },
  triviaCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
  },
  triviaEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B8860B',
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  triviaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10241D',
    marginBottom: 2,
  },
  triviaBody: {
    fontSize: 12,
    color: '#6B745F',
    lineHeight: 17,
  },
  triviaBtn: {
    backgroundColor: '#F5C142',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  triviaBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10241D',
    letterSpacing: 0.5,
  },
  triviaDoneBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  triviaDoneBadgeCorrect: {
    backgroundColor: '#D4EDDA',
  },
  triviaDoneBadgeMissed: {
    backgroundColor: '#F0EDE0',
  },
  triviaDoneBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B745F',
    letterSpacing: 0.5,
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
    lineHeight: 20,
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
    minWidth: 0,
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
    maxWidth: 118,
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
  topicRail: {
    marginTop: 24,
  },
  topicRailContent: {
    gap: 8,
    paddingRight: 4,
  },
  topicChip: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  topicChipActive: {
    backgroundColor: colors.black,
  },
  topicChipText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  topicChipTextActive: {
    color: colors.yellow,
  },
  explorePulsePanel: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  explorePanelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  explorePanelCopy: {
    flex: 1,
    minWidth: 0,
  },
  explorePanelTitle: {
    marginTop: 6,
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 29,
    lineHeight: 33,
    includeFontPadding: false,
  },
  explorePanelBody: {
    marginTop: 10,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  liveBadge: {
    minWidth: 54,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadgeText: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  exploreErrorText: {
    marginTop: 12,
    color: colors.black,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '900',
    opacity: 0.76,
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
  searchHint: {
    marginTop: 10,
    color: colors.black,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    opacity: 0.72,
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
  searchResultTapRow: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 36, 29, 0.1)',
  },
  searchResultTapRowLast: {
    borderBottomWidth: 0,
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
  newsListInline: {
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
  newsCardCompact: {
    padding: 14,
    borderRadius: 8,
    shadowOpacity: 0,
    elevation: 0,
  },
  newsTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    lineHeight: 26,
    includeFontPadding: false,
  },
  newsTitleCompact: {
    fontSize: 16,
    lineHeight: 21,
  },
  newsDescription: {
    marginTop: 8,
    color: colors.black,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    opacity: 0.72,
  },
  newsDate: {
    marginTop: 8,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    opacity: 0.7,
  },
  assetDeepDivePanel: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
  },
  assetTypePill: {
    minWidth: 58,
    height: 32,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
  },
  assetTypePillText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
  },
  assetMetricRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  assetMetricBox: {
    flex: 1,
    minHeight: 70,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 193, 66, 0.18)',
  },
  assetMetricLabel: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
  },
  assetMetricValue: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  relatedNewsHeader: {
    marginTop: 18,
  },
  relatedNewsList: {
    marginTop: 12,
    gap: 10,
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
  tabButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
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
  unitPathProgressTrack: {
    marginTop: 16,
    height: 9,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 253, 244, 0.18)',
    overflow: 'hidden',
  },
  unitPathProgressFill: {
    height: '100%',
    borderRadius: 9,
  },
  unitPathMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  unitSyllabusPanel: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    padding: 14,
    backgroundColor: colors.white,
  },
  unitSyllabusRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 46,
  },
  unitSyllabusIndex: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  unitSyllabusIndexComplete: {
    backgroundColor: colors.positive,
    borderColor: colors.positive,
  },
  unitSyllabusIndexText: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 13,
  },
  unitSyllabusIndexTextComplete: {
    color: colors.white,
  },
  unitSyllabusCopy: {
    flex: 1,
    minWidth: 0,
  },
  unitSyllabusTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 14,
  },
  unitSyllabusMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
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
