import type { Portfolio, Holding, Transaction, PortfolioSnapshot } from '../types/trading';
import type { MarketAsset } from './marketData';
import type { LessonProgress } from '../types/lesson';
import { isFeatureUnlocked, featureUnlockProgress } from './featureUnlocks';

// ─── Feature gating — delegates to the generic featureUnlocks registry ────────

export function isInvestTabUnlocked(progress: LessonProgress): boolean {
  return isFeatureUnlocked('investTab', progress);
}

export function investTabUnlockProgress(progress: LessonProgress): { done: number; total: number } {
  return featureUnlockProgress('investTab', progress);
}

export function isCryptoUnlocked(progress: LessonProgress): boolean {
  return isFeatureUnlocked('crypto', progress);
}

export function isShortingUnlocked(progress: LessonProgress): boolean {
  return isFeatureUnlocked('shortSelling', progress);
}

export function cryptoUnlockProgress(progress: LessonProgress): { done: number; total: number } {
  return featureUnlockProgress('crypto', progress);
}

export function shortingUnlockProgress(progress: LessonProgress): { done: number; total: number } {
  return featureUnlockProgress('shortSelling', progress);
}

// ─── P&L valuation ────────────────────────────────────────────────────────────

export type HoldingPnl = {
  marketValue: number;
  pnl: number;
  pnlPct: number;
};

export function computeHoldingPnl(holding: Holding, currentPrice: number): HoldingPnl {
  if (holding.side === 'long') {
    const marketValue = holding.qty * currentPrice;
    const costBasis = holding.qty * holding.avgCost;
    const pnl = marketValue - costBasis;
    return { marketValue, pnl, pnlPct: costBasis > 0 ? (pnl / costBasis) * 100 : 0 };
  }
  // Short: profit = sold high, cover low. Proceeds were added to cash at entry.
  // Net P&L = (avgCost - currentPrice) × qty
  const pnl = (holding.avgCost - currentPrice) * holding.qty;
  const initialProceeds = holding.avgCost * holding.qty;
  return {
    marketValue: -currentPrice * holding.qty, // liability against cash
    pnl,
    pnlPct: initialProceeds > 0 ? (pnl / initialProceeds) * 100 : 0,
  };
}

/** Total value = cash + Σ long market values − Σ short cover costs */
export function computeTotalValue(portfolio: Portfolio, quotes: Map<string, number>): number {
  let value = portfolio.cash;
  for (const h of portfolio.holdings) {
    const price = quotes.get(h.symbol) ?? h.avgCost;
    if (h.side === 'long') {
      value += price * h.qty;
    } else {
      value -= price * h.qty; // short: owe this much to cover
    }
  }
  return value;
}

// ─── Order execution (pure functions — return new portfolio or error string) ──

export type OrderResult = { portfolio: Portfolio } | { error: string };

function makeTx(
  symbol: string,
  label: string,
  side: Transaction['side'],
  qty: number,
  price: number,
): Transaction {
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    symbol,
    label,
    side,
    qty,
    price,
    total: qty * price,
    executedAt: new Date().toISOString(),
  };
}

function upsertHolding(
  holdings: Holding[],
  asset: MarketAsset,
  side: 'long' | 'short',
  qty: number,
  price: number,
): Holding[] {
  const id = `${asset.symbol}:${side}`;
  const existing = holdings.find((h) => h.id === id);
  if (existing) {
    const newQty = existing.qty + qty;
    const newAvgCost = (existing.qty * existing.avgCost + qty * price) / newQty;
    return holdings.map((h) => (h.id === id ? { ...h, qty: newQty, avgCost: newAvgCost } : h));
  }
  return [
    ...holdings,
    {
      id,
      symbol: asset.symbol,
      label: asset.label,
      kind: asset.kind,
      coinGeckoId: asset.coinGeckoId,
      side,
      qty,
      avgCost: price,
    },
  ];
}

function reduceHolding(
  holdings: Holding[],
  symbol: string,
  side: 'long' | 'short',
  qty: number,
): Holding[] {
  const id = `${symbol}:${side}`;
  return holdings
    .map((h) => {
      if (h.id !== id) return h;
      const newQty = h.qty - qty;
      return newQty < 0.000001 ? null : { ...h, qty: newQty };
    })
    .filter((h): h is Holding => h !== null);
}

export function executeBuy(
  portfolio: Portfolio,
  asset: MarketAsset,
  qty: number,
  price: number,
): OrderResult {
  if (qty <= 0) return { error: 'Quantity must be greater than zero.' };
  const cost = qty * price;
  if (cost > portfolio.cash + 0.01) {
    return { error: `Insufficient cash. Cost: $${cost.toFixed(2)}, available: $${portfolio.cash.toFixed(2)}.` };
  }
  const tx = makeTx(asset.symbol, asset.label, 'buy', qty, price);
  return {
    portfolio: {
      ...portfolio,
      cash: portfolio.cash - cost,
      holdings: upsertHolding(portfolio.holdings, asset, 'long', qty, price),
      transactions: [tx, ...portfolio.transactions],
    },
  };
}

export function executeSell(
  portfolio: Portfolio,
  asset: MarketAsset,
  qty: number,
  price: number,
): OrderResult {
  if (qty <= 0) return { error: 'Quantity must be greater than zero.' };
  const holding = portfolio.holdings.find((h) => h.symbol === asset.symbol && h.side === 'long');
  if (!holding) return { error: `You don't hold any ${asset.symbol}.` };
  if (qty > holding.qty + 0.000001) {
    return { error: `You only hold ${holding.qty.toFixed(6)} shares of ${asset.symbol}.` };
  }
  const proceeds = qty * price;
  const tx = makeTx(asset.symbol, asset.label, 'sell', qty, price);
  return {
    portfolio: {
      ...portfolio,
      cash: portfolio.cash + proceeds,
      holdings: reduceHolding(portfolio.holdings, asset.symbol, 'long', qty),
      transactions: [tx, ...portfolio.transactions],
    },
  };
}

export function executeShort(
  portfolio: Portfolio,
  asset: MarketAsset,
  qty: number,
  price: number,
): OrderResult {
  if (qty <= 0) return { error: 'Quantity must be greater than zero.' };
  // Require 50% margin reserve beyond the short proceeds to withstand adverse moves
  const reserve = qty * price * 0.5;
  if (portfolio.cash < reserve) {
    return {
      error: `Insufficient margin reserve. Need $${reserve.toFixed(2)} (50% of position value), have $${portfolio.cash.toFixed(2)}.`,
    };
  }
  const proceeds = qty * price;
  const tx = makeTx(asset.symbol, asset.label, 'short', qty, price);
  return {
    portfolio: {
      ...portfolio,
      cash: portfolio.cash + proceeds, // receive short sale proceeds
      holdings: upsertHolding(portfolio.holdings, asset, 'short', qty, price),
      transactions: [tx, ...portfolio.transactions],
    },
  };
}

export function executeCover(
  portfolio: Portfolio,
  asset: MarketAsset,
  qty: number,
  price: number,
): OrderResult {
  if (qty <= 0) return { error: 'Quantity must be greater than zero.' };
  const holding = portfolio.holdings.find((h) => h.symbol === asset.symbol && h.side === 'short');
  if (!holding) return { error: `No short position in ${asset.symbol}.` };
  if (qty > holding.qty + 0.000001) {
    return { error: `Short position is only ${holding.qty.toFixed(6)} shares.` };
  }
  const cost = qty * price;
  if (cost > portfolio.cash + 0.01) {
    return { error: `Insufficient cash to cover. Need $${cost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}.` };
  }
  const tx = makeTx(asset.symbol, asset.label, 'cover', qty, price);
  return {
    portfolio: {
      ...portfolio,
      cash: portfolio.cash - cost, // pay to buy back borrowed shares
      holdings: reduceHolding(portfolio.holdings, asset.symbol, 'short', qty),
      transactions: [tx, ...portfolio.transactions],
    },
  };
}

// ─── Limit order processing ────────────────────────────────────────────────────

export function checkLimitOrders(portfolio: Portfolio, quotes: Map<string, number>): Portfolio {
  let current = portfolio;
  const filled: string[] = [];

  for (const order of current.pendingOrders) {
    const price = quotes.get(order.symbol);
    if (price === undefined) continue;

    const triggered =
      ((order.side === 'buy' || order.side === 'cover') && price <= order.limitPrice) ||
      ((order.side === 'sell' || order.side === 'short') && price >= order.limitPrice);

    if (!triggered) continue;

    // Build a minimal MarketAsset for the execution functions
    const fakeAsset: MarketAsset = {
      id: order.symbol,
      label: order.label,
      symbol: order.symbol,
      kind: order.kind,
      coinGeckoId: order.coinGeckoId,
      price,
      isFallback: false,
      source: 'Stooq',
    };

    let result: OrderResult;
    if (order.side === 'buy') result = executeBuy(current, fakeAsset, order.qty, price);
    else if (order.side === 'sell') result = executeSell(current, fakeAsset, order.qty, price);
    else if (order.side === 'short') result = executeShort(current, fakeAsset, order.qty, price);
    else result = executeCover(current, fakeAsset, order.qty, price);

    if ('portfolio' in result) {
      current = result.portfolio;
      filled.push(order.id);
    }
  }

  if (filled.length === 0) return current;
  return { ...current, pendingOrders: current.pendingOrders.filter((o) => !filled.includes(o.id)) };
}

// ─── Snapshot ─────────────────────────────────────────────────────────────────

export function addTodaySnapshot(portfolio: Portfolio, totalValue: number): Portfolio {
  const today = new Date().toISOString().slice(0, 10);
  const MAX = 365;

  if (portfolio.snapshots[0]?.date === today) {
    const snapshots = portfolio.snapshots.map((s) =>
      s.date === today ? { ...s, value: totalValue } : s,
    );
    return { ...portfolio, snapshots };
  }

  const snapshot: PortfolioSnapshot = { date: today, value: totalValue };
  return { ...portfolio, snapshots: [snapshot, ...portfolio.snapshots].slice(0, MAX) };
}
