import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createInitialStockMarketSession,
  normalizeStockMarketSession,
} from '../engine/stockMarketEngine';
import type { StockMarketSession } from '../types/game';

const STOCK_MARKET_STORAGE_KEY = '@coinly_stock_market_game_v1';

export async function loadStockMarketSession(): Promise<StockMarketSession> {
  try {
    const raw = await AsyncStorage.getItem(STOCK_MARKET_STORAGE_KEY);
    if (!raw) return createInitialStockMarketSession();
    return normalizeStockMarketSession(JSON.parse(raw) as StockMarketSession);
  } catch {
    return createInitialStockMarketSession();
  }
}

export async function saveStockMarketSession(session: StockMarketSession): Promise<void> {
  try {
    await AsyncStorage.setItem(STOCK_MARKET_STORAGE_KEY, JSON.stringify(normalizeStockMarketSession(session)));
  } catch {
    // Non-fatal: keep the in-memory game even if local persistence fails.
  }
}

export async function resetStockMarketSession(): Promise<StockMarketSession> {
  const fresh = createInitialStockMarketSession();
  await saveStockMarketSession(fresh);
  return fresh;
}
