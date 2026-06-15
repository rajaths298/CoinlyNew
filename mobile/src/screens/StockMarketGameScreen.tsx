import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  advanceStockMarketRound,
  createInitialStockMarketSession,
  executeStockMarketTrade,
  fetchStockMarketQuote,
  getStockMarketInvestedValue,
  getStockMarketLeaderboard,
  getStockMarketNetWorth,
  getStockMarketUnrealizedProfit,
  normalizeStockMarketSession,
  recordStockMarketSnapshot,
  searchStockMarketQuotes,
  stockMarketAssetCatalog,
  syncStockMarketQuotes,
  toStockMarketGameResult,
} from '../engine/stockMarketEngine';
import { appColors as colors } from '../theme';
import { useTutorial } from '../hooks/useTutorial';
import TutorialOverlay from '../components/tutorial/TutorialOverlay';
import TutorialEntryModal from '../components/tutorial/TutorialEntryModal';
import TutorialHelpButton from '../components/tutorial/TutorialHelpButton';
import type { TutorialStep } from '../components/tutorial/types';
import type {
  GameDefinition,
  GameResult,
  StockMarketQuote,
  StockMarketSession,
  StockMarketTradeSide,
} from '../types/game';

type Props = {
  aiHeaderButton?: React.ReactNode;
  game: GameDefinition;
  stockMarketSession?: StockMarketSession;
  onBack: () => void;
  onComplete: (result: GameResult) => void;
  onUpdateStockMarketSession?: (session: StockMarketSession) => void;
};

const DEFAULT_ORDER_AMOUNT = '5000';

export default function StockMarketGameScreen({
  aiHeaderButton,
  game,
  stockMarketSession,
  onBack,
  onComplete,
  onUpdateStockMarketSession,
}: Props) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    BebasNeue_400Regular,
  });
  const [session, setSession] = useState<StockMarketSession>(() => normalizeStockMarketSession(stockMarketSession));
  const [orderSide, setOrderSide] = useState<StockMarketTradeSide>('buy');
  const [orderAmount, setOrderAmount] = useState(DEFAULT_ORDER_AMOUNT);
  const [orderError, setOrderError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockMarketQuote[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const completedRef = useRef(false);
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
    onUpdateStockMarketSession?.(session);
  }, [onUpdateStockMarketSession, session]);

  useEffect(() => {
    if (!stockMarketSession) return;
    const normalized = normalizeStockMarketSession(stockMarketSession);
    if (normalized.updatedAt !== sessionRef.current.updatedAt) {
      sessionRef.current = normalized;
      setSession(normalized);
    }
  }, [stockMarketSession]);

  useEffect(() => {
    void refreshQuotes(true, 'Check-in');
  }, []);

  const quoteMap = useMemo(() => new Map(session.quotes.map((quote) => [quote.symbol, quote])), [session.quotes]);
  const selectedQuote = quoteMap.get(session.selectedSymbol) ?? session.quotes[0];
  const netWorth = getStockMarketNetWorth(session);
  const investedValue = getStockMarketInvestedValue(session);
  const unrealizedProfit = getStockMarketUnrealizedProfit(session);
  const totalProfit = netWorth - session.startingCash;
  const leaderboard = getStockMarketLeaderboard(session);
  const playerRank = leaderboard.findIndex((row) => row.isPlayer) + 1;

  const scrollRef = useRef<ScrollView>(null);
  const searchRef = useRef<View>(null);
  const boardRef = useRef<View>(null);
  const ticketRef = useRef<View>(null);
  const buyButtonRef = useRef<View>(null);
  const portfolioRef = useRef<View>(null);
  const nextRoundRef = useRef<View>(null);
  const tutorialSteps = useMemo<TutorialStep[]>(() => [
    { id: 'search', targetRef: searchRef, heading: 'Find an asset', body: 'Research anything — type a ticker like AAPL or a name like Bitcoin and tap Search. The board above also has ready picks.' },
    { id: 'select', targetRef: boardRef, actionGated: true, heading: 'Pick something to trade', body: 'Tap any asset card to select it. Green means it is up today, red means down.' },
    { id: 'ticket', targetRef: ticketRef, heading: 'Build your order', body: 'Choose Buy, then a dollar amount — you start with $100,000 in virtual cash. The chips are quick presets.' },
    { id: 'buy', targetRef: buyButtonRef, actionGated: true, heading: 'Place the trade', body: 'Tap Buy Shares — your order fills instantly at the live price.' },
    { id: 'portfolio', targetRef: portfolioRef, heading: 'Track your holdings', body: 'Everything you own shows here with live profit and loss.' },
    { id: 'next', targetRef: nextRoundRef, heading: 'Advance the market', body: 'When you are done, advance to the next round to let prices change. That is the loop — happy trading!' },
  ], []);
  const tutorial = useTutorial(game.id, tutorialSteps);

  if (!fontsLoaded) return null;

  function commitSession(nextSession: StockMarketSession) {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }

  async function loadFreshQuotes(current: StockMarketSession) {
    return Promise.all(
      stockMarketAssetCatalog.map((asset) => (
        fetchStockMarketQuote(
          asset,
          current.quotes.find((quote) => quote.symbol === asset.symbol),
        )
      )),
    );
  }

  async function refreshQuotes(silent = false, snapshotLabel = 'Price refresh', shouldRecordSnapshot = true) {
    if (!silent) setOrderError('');
    setIsRefreshing(true);
    try {
      const current = sessionRef.current;
      const freshQuotes = await loadFreshQuotes(current);
      const syncedSession = syncStockMarketQuotes(current, freshQuotes);
      const nextSession = shouldRecordSnapshot
        ? recordStockMarketSnapshot(syncedSession, snapshotLabel)
        : syncedSession;
      commitSession(nextSession);
      return nextSession;
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleSearch() {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;
    setIsSearching(true);
    setOrderError('');
    try {
      const results = await searchStockMarketQuotes(cleanQuery);
      setSearchResults(results.slice(0, 5));
      if (results.length === 0) {
        setOrderError('No stock or ETF matches found.');
      }
    } catch {
      setOrderError('Search is unavailable right now. Try a ticker from the board.');
    } finally {
      setIsSearching(false);
    }
  }

  function selectQuote(quote: StockMarketQuote) {
    const synced = syncStockMarketQuotes(sessionRef.current, [quote]);
    commitSession({
      ...synced,
      selectedSymbol: quote.symbol,
      lastMessage: `${quote.symbol} selected at ${formatMoney(quote.price)}.`,
    });
    setSearchResults([]);
    setOrderError('');
    tutorial.completeStep('select');
  }

  function selectSymbol(symbol: string) {
    const quote = quoteMap.get(symbol);
    if (!quote) return;
    commitSession({
      ...sessionRef.current,
      selectedSymbol: symbol,
      lastMessage: `${symbol} selected at ${formatMoney(quote.price)}.`,
    });
    setOrderError('');
    tutorial.completeStep('select');
  }

  function executeTrade() {
    if (!selectedQuote) return;
    const amount = parseDollarInput(orderAmount);
    const result = executeStockMarketTrade(sessionRef.current, selectedQuote, orderSide, amount);
    if (result.error) {
      setOrderError(result.error);
      return;
    }
    setOrderError('');
    commitSession(result.session);
    tutorial.completeStep('buy');
  }

  async function advanceRound() {
    if (isAdvancing) return;
    setIsAdvancing(true);
    setOrderError('');
    try {
      const refreshed = await refreshQuotes(true, 'Round quote update', false);
      const nextSession = advanceStockMarketRound(refreshed);
      commitSession(nextSession);
      if (nextSession.status === 'finished' && !completedRef.current) {
        completedRef.current = true;
        onComplete(toStockMarketGameResult(nextSession, game.competency));
      }
    } finally {
      setIsAdvancing(false);
    }
  }

  function resetMatch() {
    completedRef.current = false;
    const nextSession = createInitialStockMarketSession();
    commitSession(nextSession);
    setOrderSide('buy');
    setOrderAmount(DEFAULT_ORDER_AMOUNT);
    setOrderError('');
    setSearchQuery('');
    setSearchResults([]);
    void refreshQuotes(true, 'New match');
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inlineHeader}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.headerAction}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.wordmark}>Coinly</Text>
          <View style={styles.headerRightActions}>
            <Text style={styles.headerAction}>GAME</Text>
            <TutorialHelpButton onPress={tutorial.reset} />
            {aiHeaderButton}
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>MARKET MATCH</Text>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.body}>{game.fantasy}</Text>
        </View>

        {session.status === 'finished' ? (
          <FinishedView
            session={session}
            leaderboard={leaderboard}
            netWorth={netWorth}
            totalProfit={totalProfit}
            onBack={onBack}
            onReset={resetMatch}
          />
        ) : (
          <>
            <View style={styles.darkPanel}>
              <View style={styles.darkPanelHeader}>
                <View>
                  <Text style={styles.darkEyebrow}>ROUND {session.round} OF {session.maxRounds}</Text>
                  <Text style={styles.darkTitle}>Rank #{playerRank}</Text>
                </View>
                <TouchableOpacity style={styles.refreshButton} activeOpacity={0.82} onPress={() => void refreshQuotes(false)}>
                  {isRefreshing ? <ActivityIndicator color={colors.black} /> : <Text style={styles.refreshButtonText}>REFRESH</Text>}
                </TouchableOpacity>
              </View>
              <Text style={styles.darkBody}>{session.lastMessage}</Text>
            </View>

            <View style={styles.metricGrid}>
              <MetricCard label="Net Worth" value={formatMoney(netWorth)} tone={totalProfit >= 0 ? 'good' : 'bad'} />
              <MetricCard label="Cash" value={formatMoney(session.cash)} />
              <MetricCard label="Invested" value={formatMoney(investedValue)} />
              <MetricCard label="Unrealized" value={formatSignedMoney(unrealizedProfit)} tone={unrealizedProfit >= 0 ? 'good' : 'bad'} />
            </View>

            <SectionTitle title="Market Board" action={`${liveCount(session.quotes)} live`} />
            <View style={styles.marketGrid} ref={boardRef}>
              {session.quotes.map((quote) => (
                <TouchableOpacity
                  key={quote.symbol}
                  style={[styles.marketCard, quote.symbol === session.selectedSymbol && styles.marketCardSelected]}
                  activeOpacity={0.84}
                  onPress={() => selectSymbol(quote.symbol)}
                >
                  <View style={styles.marketCardTop}>
                    <View style={styles.symbolBlock}>
                      <Text style={styles.symbolText}>{quote.symbol}</Text>
                      <Text style={styles.assetName} numberOfLines={1}>{quote.label}</Text>
                    </View>
                    <SourceBadge quote={quote} />
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>{formatMoney(quote.price)}</Text>
                    <Text style={[styles.changeText, quote.changePercent >= 0 ? styles.goodText : styles.badText]}>
                      {formatPercent(quote.changePercent)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.searchSection} ref={searchRef}>
              <Text style={styles.sectionTitle}>Search Stocks and ETFs</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Ticker or company"
                  placeholderTextColor="rgba(16,36,29,0.45)"
                  autoCapitalize="characters"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} activeOpacity={0.84} onPress={handleSearch}>
                  {isSearching ? <ActivityIndicator color={colors.black} /> : <Text style={styles.searchButtonText}>SEARCH</Text>}
                </TouchableOpacity>
              </View>
              {searchResults.length > 0 ? (
                <View style={styles.searchResults}>
                  {searchResults.map((quote) => (
                    <TouchableOpacity key={quote.symbol} style={styles.searchResultRow} activeOpacity={0.84} onPress={() => selectQuote(quote)}>
                      <View style={styles.searchResultText}>
                        <Text style={styles.searchResultSymbol}>{quote.symbol}</Text>
                        <Text style={styles.searchResultName} numberOfLines={1}>{quote.label}</Text>
                      </View>
                      <Text style={styles.searchResultPrice}>{formatMoney(quote.price)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.ticket} ref={ticketRef}>
              <View style={styles.ticketHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Order Ticket</Text>
                  <Text style={styles.ticketAsset}>{selectedQuote ? `${selectedQuote.symbol} at ${formatMoney(selectedQuote.price)}` : 'Select an asset'}</Text>
                </View>
                {selectedQuote ? <SourceBadge quote={selectedQuote} /> : null}
              </View>
              <View style={styles.sideRow}>
                <TouchableOpacity
                  style={[styles.sideButton, orderSide === 'buy' && styles.sideButtonActive]}
                  activeOpacity={0.84}
                  onPress={() => setOrderSide('buy')}
                >
                  <Text style={styles.sideButtonText}>BUY</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sideButton, orderSide === 'sell' && styles.sideButtonActive]}
                  activeOpacity={0.84}
                  onPress={() => setOrderSide('sell')}
                >
                  <Text style={styles.sideButtonText}>SELL</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.amountInput}
                value={orderAmount}
                onChangeText={setOrderAmount}
                keyboardType="decimal-pad"
                placeholder="$ amount"
                placeholderTextColor="rgba(16,36,29,0.45)"
              />
              <View style={styles.amountChips}>
                {['1000', '5000', '10000', '25000'].map((amount) => (
                  <TouchableOpacity key={amount} style={styles.amountChip} activeOpacity={0.84} onPress={() => setOrderAmount(amount)}>
                    <Text style={styles.amountChipText}>{formatCompactMoney(Number(amount))}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.amountChip}
                  activeOpacity={0.84}
                  onPress={() => setOrderAmount(orderSide === 'buy' ? String(Math.floor(session.cash)) : String(Math.floor(selectedHoldingValue(session, selectedQuote))) )}
                >
                  <Text style={styles.amountChipText}>MAX</Text>
                </TouchableOpacity>
              </View>
              {orderError ? <Text style={styles.errorText}>{orderError}</Text> : null}
              <View ref={buyButtonRef}>
                <TouchableOpacity
                  style={[styles.primaryButton, !selectedQuote && styles.disabledButton]}
                  activeOpacity={0.86}
                  onPress={executeTrade}
                  disabled={!selectedQuote}
                >
                  <Text style={styles.primaryButtonText}>{orderSide === 'buy' ? 'BUY SHARES' : 'SELL SHARES'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View ref={portfolioRef}>
              <SectionTitle title="Portfolio" action={`${session.holdings.length} holdings`} />
            </View>
            {session.holdings.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No positions yet</Text>
                <Text style={styles.emptyBody}>Choose a stock or ETF, enter a dollar amount, and place your first paper trade.</Text>
              </View>
            ) : (
              <View style={styles.holdingList}>
                {session.holdings.map((holding) => {
                  const quote = quoteMap.get(holding.symbol);
                  const price = quote?.price ?? holding.lastPrice;
                  const value = holding.shares * price;
                  const pnl = (price - holding.avgCost) * holding.shares;
                  return (
                    <TouchableOpacity key={holding.symbol} style={styles.holdingRow} activeOpacity={0.84} onPress={() => selectSymbol(holding.symbol)}>
                      <View style={styles.holdingMain}>
                        <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                        <Text style={styles.holdingMeta}>{formatShares(holding.shares)} shares / avg {formatMoney(holding.avgCost)}</Text>
                      </View>
                      <View style={styles.holdingValueBlock}>
                        <Text style={styles.holdingValue}>{formatMoney(value)}</Text>
                        <Text style={[styles.holdingPnl, pnl >= 0 ? styles.goodText : styles.badText]}>{formatSignedMoney(pnl)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <SectionTitle title="Growth Journal" action={`${session.snapshots.length} saves`} />
            <GrowthJournal session={session} />

            <SectionTitle title="Leaderboard" action="5 players" />
            <Leaderboard rows={leaderboard} />

            <SectionTitle title="Trade Log" action={`${session.trades.length} orders`} />
            {session.trades.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No trades yet</Text>
                <Text style={styles.emptyBody}>Your buy and sell orders will appear here after execution.</Text>
              </View>
            ) : (
              <View style={styles.tradeList}>
                {session.trades.slice(0, 6).map((trade) => (
                  <View key={trade.id} style={styles.tradeRow}>
                    <View style={styles.tradeMain}>
                      <Text style={styles.tradeTitle}>{trade.side.toUpperCase()} {trade.symbol}</Text>
                      <Text style={styles.tradeMeta}>Round {trade.round} / {formatShares(trade.shares)} shares / {trade.source}</Text>
                    </View>
                    <Text style={styles.tradeValue}>{formatMoney(trade.total)}</Text>
                  </View>
                ))}
              </View>
            )}

            <View ref={nextRoundRef}>
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={advanceRound}>
                {isAdvancing ? <ActivityIndicator color={colors.black} /> : <Text style={styles.primaryButtonText}>{session.round >= session.maxRounds ? 'FINISH MATCH' : 'NEXT ROUND'}</Text>}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      <TutorialEntryModal
        visible={tutorial.showEntryModal}
        gameTitle={game.title}
        onYes={tutorial.startTutorial}
        onSkip={tutorial.skip}
      />
      <TutorialOverlay
        step={tutorial.currentStep}
        stepIndex={tutorial.stepIndex}
        totalSteps={tutorial.totalSteps}
        onAdvance={tutorial.advance}
        onSkip={tutorial.skip}
        scrollRef={scrollRef}
      />
    </View>
  );
}

function FinishedView({
  session,
  leaderboard,
  netWorth,
  totalProfit,
  onBack,
  onReset,
}: {
  session: StockMarketSession;
  leaderboard: ReturnType<typeof getStockMarketLeaderboard>;
  netWorth: number;
  totalProfit: number;
  onBack: () => void;
  onReset: () => void;
}) {
  const rank = leaderboard.findIndex((row) => row.isPlayer) + 1;
  return (
    <>
      <View style={styles.darkPanel}>
        <Text style={styles.darkEyebrow}>FINAL RESULT</Text>
        <Text style={styles.darkTitle}>Finished #{rank}</Text>
        <Text style={styles.darkBody}>
          Final account value: {formatMoney(netWorth)}. Total P/L: {formatSignedMoney(totalProfit)}.
        </Text>
      </View>
      <View style={styles.metricGrid}>
        <MetricCard label="Starting" value={formatMoney(session.startingCash)} />
        <MetricCard label="Final" value={formatMoney(netWorth)} tone={totalProfit >= 0 ? 'good' : 'bad'} />
        <MetricCard label="Realized" value={formatSignedMoney(session.realizedProfit)} tone={session.realizedProfit >= 0 ? 'good' : 'bad'} />
        <MetricCard label="Trades" value={String(session.trades.length)} />
      </View>
      <SectionTitle title="Growth Journal" action={`${session.snapshots.length} saves`} />
      <GrowthJournal session={session} />
      <SectionTitle title="Final Leaderboard" action="complete" />
      <Leaderboard rows={leaderboard} />
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={onReset}>
        <Text style={styles.primaryButtonText}>NEW MATCH</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={onBack}>
        <Text style={styles.secondaryButtonText}>BACK TO ARCADE</Text>
      </TouchableOpacity>
    </>
  );
}

function GrowthJournal({ session }: { session: StockMarketSession }) {
  const snapshots = Array.isArray(session.snapshots) ? session.snapshots : [];
  if (snapshots.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No saved history yet</Text>
        <Text style={styles.emptyBody}>Refresh prices or make a trade to save a portfolio value checkpoint.</Text>
      </View>
    );
  }

  const latest = snapshots[0];
  const first = snapshots[snapshots.length - 1];
  const lifetimeChange = latest.value - first.value;
  const sortedOldestFirst = [...snapshots].reverse().slice(-10);
  const minValue = Math.min(...sortedOldestFirst.map((snapshot) => snapshot.value));
  const maxValue = Math.max(...sortedOldestFirst.map((snapshot) => snapshot.value));
  const range = Math.max(1, maxValue - minValue);

  return (
    <View style={styles.journalPanel}>
      <View style={styles.journalSummary}>
        <View style={styles.journalSummaryItem}>
          <Text style={styles.journalLabel}>Started</Text>
          <Text style={styles.journalValue}>{formatShortDate(first.timestamp)}</Text>
        </View>
        <View style={styles.journalSummaryItem}>
          <Text style={styles.journalLabel}>Latest Value</Text>
          <Text style={styles.journalValue}>{formatMoney(latest.value)}</Text>
        </View>
        <View style={styles.journalSummaryItem}>
          <Text style={styles.journalLabel}>Since First Save</Text>
          <Text style={[styles.journalValue, lifetimeChange >= 0 ? styles.goodText : styles.badText]}>
            {formatSignedMoney(lifetimeChange)}
          </Text>
        </View>
      </View>

      <View style={styles.historyBars}>
        {sortedOldestFirst.map((snapshot) => {
          const barHeight = 24 + ((snapshot.value - minValue) / range) * 58;
          return (
            <View key={snapshot.id} style={styles.historyBarWrap}>
              <View style={[styles.historyBar, { height: barHeight }]} />
            </View>
          );
        })}
      </View>

      <View style={styles.snapshotList}>
        {snapshots.slice(0, 5).map((snapshot) => (
          <View key={snapshot.id} style={styles.snapshotRow}>
            <View style={styles.snapshotMain}>
              <Text style={styles.snapshotTitle}>{snapshot.label}</Text>
              <Text style={styles.snapshotMeta}>{formatShortDate(snapshot.timestamp)} / {snapshot.source}</Text>
            </View>
            <View style={styles.snapshotValueBlock}>
              <Text style={styles.snapshotValue}>{formatMoney(snapshot.value)}</Text>
              <Text style={[styles.snapshotReturn, snapshot.returnPercent >= 0 ? styles.goodText : styles.badText]}>
                {formatPercent(snapshot.returnPercent)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function SourceBadge({ quote }: { quote: StockMarketQuote }) {
  return (
    <View style={[styles.sourceBadge, quote.source === 'Live' ? styles.sourceLive : quote.source === 'Cached' ? styles.sourceCached : styles.sourceDemo]}>
      <Text style={styles.sourceBadgeText}>{quote.source.toUpperCase()}</Text>
    </View>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'good' | 'bad';
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, tone === 'good' ? styles.goodText : tone === 'bad' ? styles.badText : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionAction}>{action.toUpperCase()}</Text>
    </View>
  );
}

function Leaderboard({ rows }: { rows: ReturnType<typeof getStockMarketLeaderboard> }) {
  return (
    <View style={styles.leaderboard}>
      {rows.map((row, index) => (
        <View key={row.id} style={[styles.leaderRow, row.isPlayer && styles.playerRow]}>
          <Text style={styles.rankText}>#{index + 1}</Text>
          <View style={styles.leaderMain}>
            <Text style={styles.leaderName}>{row.name}</Text>
            <Text style={styles.leaderMove} numberOfLines={1}>{row.lastMove}</Text>
          </View>
          <View style={styles.leaderValueBlock}>
            <Text style={styles.leaderValue}>{formatMoney(row.netWorth)}</Text>
            <Text style={[styles.leaderReturn, row.returnPercent >= 0 ? styles.goodText : styles.badText]}>
              {formatPercent(row.returnPercent)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function selectedHoldingValue(session: StockMarketSession, quote?: StockMarketQuote) {
  if (!quote) return 0;
  const holding = session.holdings.find((position) => position.symbol === quote.symbol);
  return holding ? holding.shares * quote.price : 0;
}

function liveCount(quotes: StockMarketQuote[]) {
  return quotes.filter((quote) => quote.source === 'Live').length;
}

function parseDollarInput(value: string) {
  const cleaned = value.replace(/[$,\s]/g, '');
  return Number(cleaned);
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return '$0';
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

function formatCompactMoney(value: number) {
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;
  return formatMoney(value);
}

function formatSignedMoney(value: number) {
  const prefix = value >= 0 ? '+' : '-';
  return `${prefix}${formatMoney(Math.abs(value))}`;
}

function formatPercent(value: number) {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

function formatShares(value: number) {
  return value >= 10 ? value.toFixed(2) : value.toFixed(4);
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Saved';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.green },
  content: { paddingHorizontal: 20 },
  inlineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerAction: { width: 62, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  headerRightActions: { minWidth: 132, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  wordmark: { color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30, includeFontPadding: false },
  hero: { marginTop: 28 },
  eyebrow: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  title: { marginTop: 8, color: colors.black, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 42, lineHeight: 46, includeFontPadding: false },
  body: { marginTop: 14, color: colors.black, fontSize: 16, lineHeight: 23, fontWeight: '700' },
  darkPanel: { marginTop: 22, backgroundColor: colors.black, borderRadius: 8, padding: 16 },
  darkPanelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  darkEyebrow: { color: colors.yellow, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  darkTitle: { marginTop: 8, color: colors.yellow, fontFamily: 'PlayfairDisplay_700Bold', fontSize: 30 },
  darkBody: { marginTop: 9, color: colors.white, fontSize: 14, lineHeight: 21, fontWeight: '700' },
  refreshButton: { minWidth: 96, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.black, paddingHorizontal: 14 },
  refreshButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  metricGrid: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '47%', minHeight: 76, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 11, justifyContent: 'space-between', backgroundColor: colors.white },
  metricLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  metricValue: { color: colors.black, fontWeight: '900', fontSize: 19 },
  goodText: { color: colors.positive },
  badText: { color: colors.negative },
  sectionHeader: { marginTop: 24, marginBottom: 10, minHeight: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sectionTitle: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 23 },
  sectionAction: { color: colors.muted, fontFamily: 'BebasNeue_400Regular', fontSize: 16, textAlign: 'right' },
  marketGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  marketCard: { width: '47%', minHeight: 126, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 11, backgroundColor: colors.white, justifyContent: 'space-between' },
  marketCardSelected: { backgroundColor: colors.yellow },
  marketCardTop: { gap: 8 },
  symbolBlock: { minHeight: 44 },
  symbolText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 25 },
  assetName: { marginTop: 2, color: colors.black, fontSize: 12, fontWeight: '800' },
  priceRow: { marginTop: 10, gap: 3 },
  priceText: { color: colors.black, fontSize: 19, fontWeight: '900' },
  changeText: { fontSize: 13, fontWeight: '900' },
  sourceBadge: { alignSelf: 'flex-start', minHeight: 22, borderRadius: 4, borderWidth: 1.5, borderColor: colors.black, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  sourceLive: { backgroundColor: '#BEE3C2' },
  sourceCached: { backgroundColor: '#F6D58F' },
  sourceDemo: { backgroundColor: '#F5C5B4' },
  sourceBadgeText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 13 },
  searchSection: { marginTop: 24 },
  searchRow: { marginTop: 10, flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1, minHeight: 48, borderWidth: 2, borderColor: colors.black, borderRadius: 8, paddingHorizontal: 12, color: colors.black, backgroundColor: colors.white, fontWeight: '800' },
  searchButton: { width: 96, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.black },
  searchButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 18 },
  searchResults: { marginTop: 10, gap: 8 },
  searchResultRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 10, backgroundColor: colors.white },
  searchResultText: { flex: 1 },
  searchResultSymbol: { color: colors.black, fontWeight: '900', fontSize: 15 },
  searchResultName: { marginTop: 2, color: colors.muted, fontSize: 12, fontWeight: '800' },
  searchResultPrice: { color: colors.black, fontWeight: '900', fontSize: 15 },
  ticket: { marginTop: 24, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 14, backgroundColor: 'rgba(255,255,255,0.25)' },
  ticketHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  ticketAsset: { marginTop: 3, color: colors.black, fontSize: 13, fontWeight: '800' },
  sideRow: { marginTop: 14, flexDirection: 'row', gap: 8 },
  sideButton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 22, backgroundColor: colors.white },
  sideButtonActive: { backgroundColor: colors.yellow },
  sideButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 19 },
  amountInput: { marginTop: 12, minHeight: 52, borderWidth: 2, borderColor: colors.black, borderRadius: 8, paddingHorizontal: 12, color: colors.black, backgroundColor: colors.white, fontWeight: '900', fontSize: 18 },
  amountChips: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amountChip: { minWidth: 62, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.black, borderRadius: 18, backgroundColor: colors.white, paddingHorizontal: 10 },
  amountChipText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 16 },
  errorText: { marginTop: 10, color: colors.negative, fontWeight: '900', lineHeight: 20 },
  primaryButton: { marginTop: 20, minHeight: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.yellow, borderRadius: 27, borderWidth: 2, borderColor: colors.black, paddingHorizontal: 16 },
  primaryButtonText: { color: colors.buttonText, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  secondaryButton: { marginTop: 12, minHeight: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderRadius: 26, borderWidth: 2, borderColor: colors.black, paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 21 },
  disabledButton: { opacity: 0.48 },
  emptyState: { minHeight: 78, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 13, backgroundColor: 'rgba(255,255,255,0.25)' },
  emptyTitle: { color: colors.black, fontWeight: '900', fontSize: 15 },
  emptyBody: { marginTop: 5, color: colors.black, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  holdingList: { gap: 9 },
  holdingRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 11, backgroundColor: colors.white },
  holdingMain: { flex: 1 },
  holdingSymbol: { color: colors.black, fontWeight: '900', fontSize: 16 },
  holdingMeta: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: '800' },
  holdingValueBlock: { alignItems: 'flex-end' },
  holdingValue: { color: colors.black, fontWeight: '900', fontSize: 15 },
  holdingPnl: { marginTop: 3, fontWeight: '900', fontSize: 12 },
  journalPanel: { borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 12, backgroundColor: colors.white },
  journalSummary: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  journalSummaryItem: { flexGrow: 1, minWidth: '30%', minHeight: 58, borderWidth: 1.5, borderColor: colors.black, borderRadius: 8, padding: 8, justifyContent: 'space-between', backgroundColor: colors.green },
  journalLabel: { color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 14 },
  journalValue: { color: colors.black, fontWeight: '900', fontSize: 15 },
  historyBars: { marginTop: 13, height: 92, flexDirection: 'row', alignItems: 'flex-end', gap: 5, borderWidth: 1.5, borderColor: colors.black, borderRadius: 8, paddingHorizontal: 8, paddingBottom: 8, backgroundColor: 'rgba(223,175,63,0.14)' },
  historyBarWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  historyBar: { width: '100%', maxWidth: 26, minHeight: 12, borderWidth: 1.5, borderColor: colors.black, borderRadius: 4, backgroundColor: colors.yellow },
  snapshotList: { marginTop: 12, gap: 8 },
  snapshotRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(16,36,29,0.2)', paddingTop: 8 },
  snapshotMain: { flex: 1 },
  snapshotTitle: { color: colors.black, fontWeight: '900', fontSize: 14 },
  snapshotMeta: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: '800' },
  snapshotValueBlock: { alignItems: 'flex-end' },
  snapshotValue: { color: colors.black, fontWeight: '900', fontSize: 14 },
  snapshotReturn: { marginTop: 3, fontSize: 12, fontWeight: '900' },
  leaderboard: { gap: 8 },
  leaderRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 10, backgroundColor: colors.white },
  playerRow: { backgroundColor: colors.yellow },
  rankText: { width: 34, color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
  leaderMain: { flex: 1 },
  leaderName: { color: colors.black, fontWeight: '900', fontSize: 15 },
  leaderMove: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: '800' },
  leaderValueBlock: { alignItems: 'flex-end', maxWidth: 110 },
  leaderValue: { color: colors.black, fontWeight: '900', fontSize: 14 },
  leaderReturn: { marginTop: 3, fontSize: 12, fontWeight: '900' },
  tradeList: { gap: 8 },
  tradeRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderWidth: 2, borderColor: colors.black, borderRadius: 8, padding: 10, backgroundColor: colors.white },
  tradeMain: { flex: 1 },
  tradeTitle: { color: colors.black, fontWeight: '900', fontSize: 14 },
  tradeMeta: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: '800' },
  tradeValue: { color: colors.black, fontWeight: '900', fontSize: 14 },
});
