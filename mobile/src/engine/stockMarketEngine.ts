import {
  fetchLiveQuote,
  searchAssetsByQuery,
  type MarketAsset,
  type SearchResult,
} from '../services/marketData';
import type {
  GameResult,
  StockMarketAssetKind,
  StockMarketPosition,
  StockMarketQuote,
  StockMarketRival,
  StockMarketSession,
  StockMarketTrade,
  StockMarketTradeSide,
} from '../types/game';

export const STOCK_MARKET_STARTING_CASH = 100000;
export const STOCK_MARKET_MAX_ROUNDS = 6;

type StockMarketAssetSeed = {
  symbol: string;
  label: string;
  kind: StockMarketAssetKind;
  fallbackPrice: number;
  fallbackChangePercent: number;
};

export type StockMarketLeaderboardRow = {
  id: string;
  name: string;
  netWorth: number;
  returnPercent: number;
  lastMove: string;
  isPlayer: boolean;
};

export const stockMarketAssetCatalog: StockMarketAssetSeed[] = [
  { symbol: 'SPY', label: 'S&P 500 ETF', kind: 'etf', fallbackPrice: 621.84, fallbackChangePercent: 0.24 },
  { symbol: 'QQQ', label: 'Nasdaq 100 ETF', kind: 'etf', fallbackPrice: 518.00, fallbackChangePercent: 0.31 },
  { symbol: 'AAPL', label: 'Apple', kind: 'stock', fallbackPrice: 196.58, fallbackChangePercent: -0.18 },
  { symbol: 'MSFT', label: 'Microsoft', kind: 'stock', fallbackPrice: 457.00, fallbackChangePercent: 0.42 },
  { symbol: 'NVDA', label: 'Nvidia', kind: 'stock', fallbackPrice: 135.00, fallbackChangePercent: 1.05 },
  { symbol: 'TSLA', label: 'Tesla', kind: 'stock', fallbackPrice: 352.00, fallbackChangePercent: -0.74 },
  { symbol: 'GOOGL', label: 'Alphabet', kind: 'stock', fallbackPrice: 178.00, fallbackChangePercent: 0.16 },
  { symbol: 'AMZN', label: 'Amazon', kind: 'stock', fallbackPrice: 225.00, fallbackChangePercent: 0.28 },
];

export function createInitialStockMarketSession(): StockMarketSession {
  const quotes = stockMarketAssetCatalog.map((asset) => fallbackStockMarketQuote(asset));
  const now = new Date().toISOString();
  return recordStockMarketSnapshot({
    status: 'playing',
    round: 1,
    maxRounds: STOCK_MARKET_MAX_ROUNDS,
    startingCash: STOCK_MARKET_STARTING_CASH,
    cash: STOCK_MARKET_STARTING_CASH,
    realizedProfit: 0,
    holdings: [],
    quotes,
    selectedSymbol: 'SPY',
    trades: [],
    snapshots: [],
    rivals: createInitialRivals(quotes),
    lastMessage: 'Round 1 is open. Build a portfolio and try to beat the rivals.',
    startedAt: now,
    updatedAt: now,
  }, 'Game started');
}

export function normalizeStockMarketSession(session?: StockMarketSession): StockMarketSession {
  if (!session) return createInitialStockMarketSession();
  const fallback = createInitialStockMarketSession();
  return {
    ...fallback,
    ...session,
    maxRounds: session.maxRounds || STOCK_MARKET_MAX_ROUNDS,
    startingCash: session.startingCash || STOCK_MARKET_STARTING_CASH,
    cash: Number.isFinite(session.cash) ? session.cash : STOCK_MARKET_STARTING_CASH,
    holdings: Array.isArray(session.holdings) ? session.holdings : [],
    quotes: Array.isArray(session.quotes) && session.quotes.length > 0 ? session.quotes : fallback.quotes,
    selectedSymbol: session.selectedSymbol || 'SPY',
    trades: Array.isArray(session.trades) ? session.trades : [],
    snapshots: Array.isArray(session.snapshots) ? session.snapshots : [],
    rivals: Array.isArray(session.rivals) && session.rivals.length > 0 ? session.rivals : fallback.rivals,
    startedAt: session.startedAt || fallback.startedAt,
    updatedAt: session.updatedAt || session.startedAt || fallback.updatedAt,
  };
}

export async function fetchStockMarketQuote(
  asset: StockMarketAssetSeed,
  previous?: StockMarketQuote,
): Promise<StockMarketQuote> {
  const searchResult: SearchResult = {
    id: asset.symbol,
    symbol: asset.symbol,
    name: asset.label,
    kind: asset.kind,
    source: 'Yahoo',
  };

  try {
    const live = await fetchLiveQuote(searchResult);
    return stockMarketQuoteFromMarketAsset(live, 'Live');
  } catch {
    if (previous && previous.source !== 'Demo' && Number.isFinite(previous.price) && previous.price > 0) {
      return {
        ...previous,
        source: 'Cached',
        fetchedAt: new Date().toISOString(),
      };
    }
    return fallbackStockMarketQuote(asset);
  }
}

export async function searchStockMarketQuotes(query: string): Promise<StockMarketQuote[]> {
  const results = await searchAssetsByQuery(query);
  const stockResults = results.filter((result) => result.kind === 'stock' || result.kind === 'etf').slice(0, 6);
  const quotes = await Promise.all(stockResults.map(async (result): Promise<StockMarketQuote | null> => {
    try {
      return stockMarketQuoteFromMarketAsset(await fetchLiveQuote(result));
    } catch {
      const fallback = stockMarketAssetCatalog.find((asset) => asset.symbol === result.symbol);
      return fallback ? fallbackStockMarketQuote(fallback) : null;
    }
  }));
  return quotes.filter((quote): quote is StockMarketQuote => quote !== null);
}

export function stockMarketQuoteFromMarketAsset(
  asset: MarketAsset,
  source: StockMarketQuote['source'] = asset.isFallback ? 'Demo' : 'Live',
): StockMarketQuote {
  return {
    symbol: asset.symbol,
    label: asset.label,
    kind: asset.kind === 'etf' ? 'etf' : 'stock',
    price: roundMoney(asset.price),
    changePercent: Number.isFinite(asset.changePercent) ? Number(asset.changePercent) : 0,
    source,
    provider: asset.source,
    isFallback: asset.isFallback || source !== 'Live',
    fetchedAt: new Date().toISOString(),
  };
}

export function syncStockMarketQuotes(
  session: StockMarketSession,
  incomingQuotes: StockMarketQuote[],
): StockMarketSession {
  const quoteMap = new Map<string, StockMarketQuote>();
  session.quotes.forEach((quote) => quoteMap.set(quote.symbol, quote));
  incomingQuotes.forEach((quote) => quoteMap.set(quote.symbol, quote));

  const orderedSymbols = [
    ...stockMarketAssetCatalog.map((asset) => asset.symbol),
    ...session.quotes.map((quote) => quote.symbol).filter((symbol) => !stockMarketAssetCatalog.some((asset) => asset.symbol === symbol)),
    ...incomingQuotes.map((quote) => quote.symbol).filter((symbol) => !stockMarketAssetCatalog.some((asset) => asset.symbol === symbol)),
  ];

  const seen = new Set<string>();
  const quotes = orderedSymbols
    .filter((symbol) => {
      if (seen.has(symbol)) return false;
      seen.add(symbol);
      return quoteMap.has(symbol);
    })
    .map((symbol) => quoteMap.get(symbol) as StockMarketQuote);

  const nextQuoteMap = new Map(quotes.map((quote) => [quote.symbol, quote]));
  const holdings = updatePositionPrices(session.holdings, nextQuoteMap);
  const rivals = session.rivals.map((rival) => revalueRival(rival, nextQuoteMap));
  const selectedSymbol = nextQuoteMap.has(session.selectedSymbol) ? session.selectedSymbol : quotes[0]?.symbol ?? 'SPY';

  return {
    ...session,
    quotes,
    holdings,
    rivals,
    selectedSymbol,
    updatedAt: new Date().toISOString(),
  };
}

export function executeStockMarketTrade(
  session: StockMarketSession,
  quote: StockMarketQuote,
  side: StockMarketTradeSide,
  dollarAmount: number,
): { session: StockMarketSession; error?: string } {
  if (session.status === 'finished') {
    return { session, error: 'This match is finished. Start a new match to trade again.' };
  }
  if (!Number.isFinite(dollarAmount) || dollarAmount <= 0) {
    return { session, error: 'Enter a dollar amount greater than $0.' };
  }
  if (!Number.isFinite(quote.price) || quote.price <= 0) {
    return { session, error: 'This asset does not have a usable price yet.' };
  }

  const total = roundMoney(dollarAmount);
  const shares = total / quote.price;

  if (side === 'buy') {
    if (total > session.cash + 0.01) {
      return { session, error: `Insufficient cash. Available: ${formatMoney(session.cash)}.` };
    }

    const nextHoldings = upsertPosition(session.holdings, quote, shares, quote.price);
    const trade = createTrade(session, quote, side, shares, total);
    return {
      session: recordStockMarketSnapshot({
        ...session,
        cash: roundMoney(session.cash - total),
        holdings: nextHoldings,
        trades: [trade, ...session.trades],
        lastMessage: `Bought ${formatShares(shares)} shares of ${quote.symbol} at ${formatMoney(quote.price)}.`,
        updatedAt: new Date().toISOString(),
      }, `Bought ${quote.symbol}`),
    };
  }

  const holding = session.holdings.find((position) => position.symbol === quote.symbol);
  if (!holding) return { session, error: `You do not own any ${quote.symbol} yet.` };

  const maxSaleValue = holding.shares * quote.price;
  if (total > maxSaleValue + 0.01) {
    return { session, error: `You can sell up to ${formatMoney(maxSaleValue)} of ${quote.symbol}.` };
  }

  const sellShares = Math.min(holding.shares, shares);
  const sellTotal = roundMoney(sellShares * quote.price);
  const realizedProfit = (quote.price - holding.avgCost) * sellShares;
  const nextHoldings = reducePosition(session.holdings, quote.symbol, sellShares);
  const trade = createTrade(session, quote, side, sellShares, sellTotal);
  return {
    session: recordStockMarketSnapshot({
      ...session,
      cash: roundMoney(session.cash + sellTotal),
      realizedProfit: roundMoney(session.realizedProfit + realizedProfit),
      holdings: nextHoldings,
      trades: [trade, ...session.trades],
      lastMessage: `Sold ${formatShares(sellShares)} shares of ${quote.symbol} at ${formatMoney(quote.price)}.`,
      updatedAt: new Date().toISOString(),
    }, `Sold ${quote.symbol}`),
  };
}

export function advanceStockMarketRound(session: StockMarketSession): StockMarketSession {
  if (session.status === 'finished') return session;

  const quoteMap = new Map(session.quotes.map((quote) => [quote.symbol, quote]));
  const rivals = session.rivals.map((rival) => applyRivalStrategy(rival, session.quotes, session.round));
  const revaluedRivals = rivals.map((rival) => revalueRival(rival, quoteMap));
  const isFinalRound = session.round >= session.maxRounds;

  if (isFinalRound) {
    const finishedSession: StockMarketSession = {
      ...session,
      status: 'finished',
      holdings: updatePositionPrices(session.holdings, quoteMap),
      rivals: revaluedRivals,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    const rank = getPlayerRank(finishedSession);
    return recordStockMarketSnapshot({
      ...finishedSession,
      lastMessage: `Match complete. You finished #${rank} with ${formatMoney(getStockMarketNetWorth(finishedSession))}.`,
    }, 'Match complete');
  }

  return recordStockMarketSnapshot({
    ...session,
    round: session.round + 1,
    holdings: updatePositionPrices(session.holdings, quoteMap),
    rivals: revaluedRivals,
    lastMessage: `Round ${session.round + 1} is open. Rivals updated their portfolios.`,
    updatedAt: new Date().toISOString(),
  }, `Round ${session.round + 1}`);
}

export function getStockMarketNetWorth(session: StockMarketSession): number {
  const quoteMap = new Map(session.quotes.map((quote) => [quote.symbol, quote]));
  return roundMoney(session.cash + getHoldingsValue(session.holdings, quoteMap));
}

export function getStockMarketInvestedValue(session: StockMarketSession): number {
  const quoteMap = new Map(session.quotes.map((quote) => [quote.symbol, quote]));
  return roundMoney(getHoldingsValue(session.holdings, quoteMap));
}

export function getStockMarketUnrealizedProfit(session: StockMarketSession): number {
  const quoteMap = new Map(session.quotes.map((quote) => [quote.symbol, quote]));
  return roundMoney(session.holdings.reduce((sum, holding) => {
    const price = quoteMap.get(holding.symbol)?.price ?? holding.lastPrice;
    return sum + (price - holding.avgCost) * holding.shares;
  }, 0));
}

export function getStockMarketLeaderboard(session: StockMarketSession): StockMarketLeaderboardRow[] {
  const playerNetWorth = getStockMarketNetWorth(session);
  const rows: StockMarketLeaderboardRow[] = [
    {
      id: 'player',
      name: 'You',
      netWorth: playerNetWorth,
      returnPercent: returnPercent(playerNetWorth, session.startingCash),
      lastMove: session.trades[0]
        ? `${session.trades[0].side.toUpperCase()} ${session.trades[0].symbol}`
        : 'Holding cash',
      isPlayer: true,
    },
    ...session.rivals.map((rival) => ({
      id: rival.id,
      name: rival.name,
      netWorth: roundMoney(rival.netWorth),
      returnPercent: rival.returnPercent,
      lastMove: rival.lastMove,
      isPlayer: false,
    })),
  ];

  return rows.sort((a, b) => b.netWorth - a.netWorth);
}

export function recordStockMarketSnapshot(session: StockMarketSession, label: string): StockMarketSession {
  const now = new Date().toISOString();
  const value = getStockMarketNetWorth(session);
  const investedValue = getStockMarketInvestedValue(session);
  const source = summarizeQuoteSource(session.quotes);
  const snapshot = {
    id: `stock-snapshot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    label,
    value,
    cash: roundMoney(session.cash),
    investedValue,
    returnPercent: returnPercent(value, session.startingCash),
    source,
  };
  const existingSnapshots = Array.isArray(session.snapshots) ? session.snapshots : [];
  const shouldReplaceLatest = existingSnapshots[0]
    && sameCalendarDate(existingSnapshots[0].timestamp, now)
    && existingSnapshots[0].label === label;
  const snapshots = shouldReplaceLatest
    ? [snapshot, ...existingSnapshots.slice(1)]
    : [snapshot, ...existingSnapshots];

  return {
    ...session,
    snapshots: snapshots.slice(0, 120),
    updatedAt: now,
  };
}

export function toStockMarketGameResult(session: StockMarketSession, competency: string): GameResult {
  const netWorth = getStockMarketNetWorth(session);
  const profit = roundMoney(netWorth - session.startingCash);
  const rank = getPlayerRank(session);
  const returnPct = returnPercent(netWorth, session.startingCash);
  const rankScore = Math.max(0, 74 - (rank - 1) * 17);
  const returnScore = Math.max(0, Math.min(18, 8 + returnPct * 2));
  const diversificationScore = Math.min(8, session.holdings.length * 2);
  const performance = Math.max(0, Math.min(100, Math.round(rankScore + returnScore + diversificationScore)));

  return {
    gameId: 'first-place',
    competency,
    performance,
    timeSpentSeconds: session.maxRounds * 40,
    timestamp: new Date().toISOString(),
    revenue: Math.round(netWorth),
    costs: session.startingCash,
    profit: Math.round(profit),
    feedback: buildResultFeedback(rank, profit, session.holdings.length),
    eventTitle: `Finished #${rank}`,
  };
}

function summarizeQuoteSource(quotes: StockMarketQuote[]): StockMarketQuote['source'] {
  if (quotes.some((quote) => quote.source === 'Live')) return 'Live';
  if (quotes.some((quote) => quote.source === 'Cached')) return 'Cached';
  return 'Demo';
}

function sameCalendarDate(left: string, right: string): boolean {
  const leftDate = new Date(left);
  const rightDate = new Date(right);
  if (Number.isNaN(leftDate.getTime()) || Number.isNaN(rightDate.getTime())) return false;
  return leftDate.toDateString() === rightDate.toDateString();
}

function fallbackStockMarketQuote(asset: StockMarketAssetSeed): StockMarketQuote {
  return {
    symbol: asset.symbol,
    label: asset.label,
    kind: asset.kind,
    price: asset.fallbackPrice,
    changePercent: asset.fallbackChangePercent,
    source: 'Demo',
    provider: 'Demo',
    isFallback: true,
    fetchedAt: new Date().toISOString(),
  };
}

function createInitialRivals(quotes: StockMarketQuote[]): StockMarketRival[] {
  const base: StockMarketRival[] = [
    createRival('index-ivy', 'Index Ivy', 'index'),
    createRival('mo-mason', 'Momentum Mason', 'momentum'),
    createRival('tech-tara', 'Tech Tara', 'tech'),
    createRival('cash-cam', 'Cash Cam', 'conservative'),
  ];
  const quoteMap = new Map(quotes.map((quote) => [quote.symbol, quote]));
  return base
    .map((rival) => applyRivalStrategy(rival, quotes, 1))
    .map((rival) => revalueRival(rival, quoteMap));
}

function createRival(
  id: string,
  name: string,
  strategy: StockMarketRival['strategy'],
): StockMarketRival {
  return {
    id,
    name,
    strategy,
    cash: STOCK_MARKET_STARTING_CASH,
    holdings: [],
    netWorth: STOCK_MARKET_STARTING_CASH,
    returnPercent: 0,
    lastMove: 'Waiting for quotes',
  };
}

function applyRivalStrategy(
  rival: StockMarketRival,
  quotes: StockMarketQuote[],
  round: number,
): StockMarketRival {
  const bySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));
  let next = { ...rival, holdings: [...rival.holdings] };

  if (rival.strategy === 'index') {
    const deploy = round === 1 ? next.cash * 0.74 : next.cash * 0.18;
    next = rivalBuyDollars(next, bySymbol.get('SPY'), deploy * 0.72);
    next = rivalBuyDollars(next, bySymbol.get('QQQ'), deploy * 0.28);
    return { ...next, lastMove: 'Added broad index exposure' };
  }

  if (rival.strategy === 'momentum') {
    const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
    const target = sorted[0] ?? bySymbol.get('SPY');
    const deploy = target && target.changePercent > 0 ? next.cash * 0.46 : next.cash * 0.18;
    next = rivalBuyDollars(next, target, deploy);
    return { ...next, lastMove: target ? `Chased ${target.symbol} momentum` : 'Held cash' };
  }

  if (rival.strategy === 'tech') {
    const deploy = round === 1 ? next.cash * 0.68 : next.cash * 0.38;
    const techSymbols = ['NVDA', 'MSFT', 'AAPL', 'QQQ'];
    techSymbols.forEach((symbol) => {
      next = rivalBuyDollars(next, bySymbol.get(symbol), deploy / techSymbols.length);
    });
    return { ...next, lastMove: 'Stacked large-cap tech' };
  }

  const spy = bySymbol.get('SPY');
  const deploy = round === 1 ? next.cash * 0.25 : (spy && spy.changePercent >= -1 ? next.cash * 0.08 : 0);
  next = rivalBuyDollars(next, spy, deploy);
  return { ...next, lastMove: deploy > 0 ? 'Kept most money in cash' : 'Waited out volatility' };
}

function rivalBuyDollars(
  rival: StockMarketRival,
  quote: StockMarketQuote | undefined,
  amount: number,
): StockMarketRival {
  if (!quote || amount <= 1 || quote.price <= 0 || rival.cash <= 1) return rival;
  const total = roundMoney(Math.min(amount, rival.cash));
  const shares = total / quote.price;
  return {
    ...rival,
    cash: roundMoney(rival.cash - total),
    holdings: upsertPosition(rival.holdings, quote, shares, quote.price),
  };
}

function revalueRival(
  rival: StockMarketRival,
  quoteMap: Map<string, StockMarketQuote>,
): StockMarketRival {
  const holdings = updatePositionPrices(rival.holdings, quoteMap);
  const netWorth = roundMoney(rival.cash + getHoldingsValue(holdings, quoteMap));
  return {
    ...rival,
    holdings,
    netWorth,
    returnPercent: returnPercent(netWorth, STOCK_MARKET_STARTING_CASH),
  };
}

function upsertPosition(
  holdings: StockMarketPosition[],
  quote: StockMarketQuote,
  shares: number,
  price: number,
): StockMarketPosition[] {
  const existing = holdings.find((position) => position.symbol === quote.symbol);
  if (!existing) {
    return [
      ...holdings,
      {
        symbol: quote.symbol,
        label: quote.label,
        kind: quote.kind,
        shares,
        avgCost: price,
        lastPrice: price,
      },
    ];
  }

  const nextShares = existing.shares + shares;
  const avgCost = ((existing.shares * existing.avgCost) + (shares * price)) / nextShares;
  return holdings.map((position) => (
    position.symbol === quote.symbol
      ? { ...position, shares: nextShares, avgCost, lastPrice: price }
      : position
  ));
}

function reducePosition(
  holdings: StockMarketPosition[],
  symbol: string,
  shares: number,
): StockMarketPosition[] {
  return holdings
    .map((position) => {
      if (position.symbol !== symbol) return position;
      const nextShares = position.shares - shares;
      return nextShares <= 0.000001 ? null : { ...position, shares: nextShares };
    })
    .filter((position): position is StockMarketPosition => position !== null);
}

function updatePositionPrices(
  holdings: StockMarketPosition[],
  quoteMap: Map<string, StockMarketQuote>,
): StockMarketPosition[] {
  return holdings.map((holding) => ({
    ...holding,
    lastPrice: quoteMap.get(holding.symbol)?.price ?? holding.lastPrice,
  }));
}

function getHoldingsValue(
  holdings: StockMarketPosition[],
  quoteMap: Map<string, StockMarketQuote>,
): number {
  return holdings.reduce((sum, holding) => {
    const price = quoteMap.get(holding.symbol)?.price ?? holding.lastPrice;
    return sum + holding.shares * price;
  }, 0);
}

function createTrade(
  session: StockMarketSession,
  quote: StockMarketQuote,
  side: StockMarketTradeSide,
  shares: number,
  total: number,
): StockMarketTrade {
  return {
    id: `stock-trade-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    round: session.round,
    side,
    symbol: quote.symbol,
    label: quote.label,
    shares,
    price: quote.price,
    total,
    source: quote.source,
    timestamp: new Date().toISOString(),
  };
}

function getPlayerRank(session: StockMarketSession): number {
  const leaderboard = getStockMarketLeaderboard(session);
  return leaderboard.findIndex((row) => row.id === 'player') + 1;
}

function returnPercent(value: number, startingValue: number): number {
  return startingValue > 0 ? ((value - startingValue) / startingValue) * 100 : 0;
}

function buildResultFeedback(rank: number, profit: number, holdingCount: number): string {
  if (rank === 1 && profit >= 0) {
    return 'You beat every rival by balancing position size, risk, and market exposure.';
  }
  if (profit >= 0 && holdingCount >= 2) {
    return 'You finished with a gain and avoided putting the whole account into one idea.';
  }
  if (profit >= 0) {
    return 'You made money, but a wider mix of holdings could make the portfolio less fragile.';
  }
  return 'The account ended below $100,000. Review position size and avoid concentrating too much in one fast mover.';
}

function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

function formatShares(value: number): string {
  return value >= 10 ? value.toFixed(2) : value.toFixed(4);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
