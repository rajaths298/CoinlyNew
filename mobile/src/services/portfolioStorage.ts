import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Portfolio } from '../types/trading';

const KEY = '@coinly_portfolio_v1';

export const INITIAL_PORTFOLIO: Portfolio = {
  schemaVersion: 1,
  cash: 100_000,
  holdings: [],
  pendingOrders: [],
  transactions: [],
  snapshots: [],
  watchlistSymbols: ['SPY', 'AAPL', 'BTC', 'ETH'],
};

export async function loadPortfolio(): Promise<Portfolio> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...INITIAL_PORTFOLIO };
    const parsed = JSON.parse(raw) as Partial<Portfolio>;
    // Merge with defaults to safely add new fields on schema v1
    return {
      ...INITIAL_PORTFOLIO,
      ...parsed,
      schemaVersion: 1,
    };
  } catch {
    return { ...INITIAL_PORTFOLIO };
  }
}

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(portfolio));
  } catch {
    // Non-fatal — state lives in React even if persist fails
  }
}

export async function resetPortfolio(): Promise<Portfolio> {
  const fresh: Portfolio = { ...INITIAL_PORTFOLIO };
  await savePortfolio(fresh);
  return fresh;
}
