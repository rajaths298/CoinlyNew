import type { MarketAssetKind } from '../services/marketData';

export type OrderSide = 'buy' | 'sell' | 'short' | 'cover';
export type ChartRange = '1W' | '1M' | '3M' | '1Y';

/** A single historical daily close price */
export type PricePoint = {
  date: string;   // YYYY-MM-DD
  close: number;
};

/** An open position in the portfolio */
export type Holding = {
  id: string;           // "{symbol}:{side}" e.g. "AAPL:long"
  symbol: string;
  label: string;
  kind: MarketAssetKind;
  coinGeckoId?: string;
  side: 'long' | 'short';
  qty: number;          // shares / coins (fractional)
  avgCost: number;      // cost basis per share/coin
};

/** A pending limit order awaiting price trigger */
export type PendingOrder = {
  id: string;
  symbol: string;
  label: string;
  kind: MarketAssetKind;
  coinGeckoId?: string;
  side: OrderSide;
  qty: number;
  limitPrice: number;
  createdAt: string;
};

/** An executed transaction in the history log */
export type Transaction = {
  id: string;
  symbol: string;
  label: string;
  side: OrderSide;
  qty: number;
  price: number;
  total: number;         // qty * price
  executedAt: string;
};

/** Daily portfolio value snapshot for performance chart */
export type PortfolioSnapshot = {
  date: string;          // YYYY-MM-DD
  value: number;
};

/** Full persisted portfolio state */
export type Portfolio = {
  schemaVersion: 1;
  cash: number;
  holdings: Holding[];
  pendingOrders: PendingOrder[];
  transactions: Transaction[];
  snapshots: PortfolioSnapshot[];
  watchlistSymbols: string[];
};
