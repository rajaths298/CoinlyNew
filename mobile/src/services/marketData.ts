import type { PricePoint } from '../types/trading';

export type MarketAssetKind = 'stock' | 'etf' | 'crypto' | 'forex' | 'nft';

export type MarketAsset = {
  id: string;
  label: string;
  symbol: string;
  kind: MarketAssetKind;
  coinGeckoId?: string;      // present for crypto / CoinGecko-sourced assets
  price: number;
  change?: number;           // absolute price change (day)
  changePercent?: number;    // % change from open/previous close
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  marketCap?: number;
  source: 'CoinGecko' | 'Yahoo' | 'Stooq' | 'Demo';
  isFallback: boolean;
  fetchedAt?: number;        // Date.now() — used by consumers for staleness
};

export type MoneyWorldTopicId = 'markets' | 'companies' | 'crypto' | 'ratesHousing' | 'businessSectors';

export type MoneyWorldTopic = {
  id: MoneyWorldTopicId;
  label: string;
  shortLabel: string;
  description: string;
  pulseLabel: string;
};

export type MoneyWorldTopicFeed = {
  topic: MoneyWorldTopic;
  assets: MarketAsset[];
  news: FinanceNewsItem[];
  assetError?: string;
  newsError?: string;
};

type WatchAsset = {
  id: string;
  label: string;
  symbol: string;
  kind: MarketAssetKind;
  coinGeckoId?: string;
  yahooSymbol?: string;
  stooqSymbol?: string;
  fallbackPrice: number;
  fallbackChangePercent: number;
};

type MoneyWorldTopicConfig = {
  topic: MoneyWorldTopic;
  assets: SearchResult[];
  newsSymbols: string[];
};

export const defaultWatchlist: WatchAsset[] = [
  { id: 'spy',      label: 'S&P 500 ETF',   symbol: 'SPY',  kind: 'etf',    stooqSymbol: 'spy.us',  fallbackPrice: 621.84,  fallbackChangePercent: 0.24  },
  { id: 'qqq',      label: 'Nasdaq 100 ETF', symbol: 'QQQ',  kind: 'etf',    stooqSymbol: 'qqq.us',  fallbackPrice: 556.22,  fallbackChangePercent: 0.41  },
  { id: 'aapl',     label: 'Apple',          symbol: 'AAPL', kind: 'stock',  stooqSymbol: 'aapl.us', fallbackPrice: 196.58,  fallbackChangePercent: -0.18 },
  { id: 'msft',     label: 'Microsoft',      symbol: 'MSFT', kind: 'stock',  stooqSymbol: 'msft.us', fallbackPrice: 472.30,  fallbackChangePercent: 0.33  },
  { id: 'nvda',     label: 'NVIDIA',         symbol: 'NVDA', kind: 'stock',  stooqSymbol: 'nvda.us', fallbackPrice: 142.17,  fallbackChangePercent: 1.08  },
  { id: 'tsla',     label: 'Tesla',          symbol: 'TSLA', kind: 'stock',  stooqSymbol: 'tsla.us', fallbackPrice: 318.45,  fallbackChangePercent: -0.92 },
  { id: 'bitcoin',  label: 'Bitcoin',        symbol: 'BTC',  kind: 'crypto', coinGeckoId: 'bitcoin', fallbackPrice: 108420,  fallbackChangePercent: 1.35  },
  { id: 'ethereum', label: 'Ethereum',       symbol: 'ETH',  kind: 'crypto', coinGeckoId: 'ethereum',fallbackPrice: 3865,    fallbackChangePercent: 0.72  },
];

const moneyWorldTopicConfigs: Record<MoneyWorldTopicId, MoneyWorldTopicConfig> = {
  markets: {
    topic: {
      id: 'markets',
      label: 'Markets',
      shortLabel: 'Markets',
      description: 'Major indexes, broad ETFs, and the daily market mood.',
      pulseLabel: 'Index pulse',
    },
    assets: [
      quoteSeed('SPY', 'S&P 500 ETF', 'etf'),
      quoteSeed('QQQ', 'Nasdaq 100 ETF', 'etf'),
      quoteSeed('DIA', 'Dow Industrials ETF', 'etf'),
      quoteSeed('IWM', 'Russell 2000 ETF', 'etf'),
    ],
    newsSymbols: ['SPY', 'QQQ', 'DIA', 'IWM'],
  },
  companies: {
    topic: {
      id: 'companies',
      label: 'Companies',
      shortLabel: 'Companies',
      description: 'Big public companies that shape jobs, products, and portfolios.',
      pulseLabel: 'Company pulse',
    },
    assets: [
      quoteSeed('AAPL', 'Apple', 'stock'),
      quoteSeed('MSFT', 'Microsoft', 'stock'),
      quoteSeed('NVDA', 'Nvidia', 'stock'),
      quoteSeed('TSLA', 'Tesla', 'stock'),
    ],
    newsSymbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'],
  },
  crypto: {
    topic: {
      id: 'crypto',
      label: 'Crypto',
      shortLabel: 'Crypto',
      description: 'Live digital asset prices and crypto market headlines.',
      pulseLabel: 'Crypto pulse',
    },
    assets: [
      cryptoQuoteSeed('bitcoin', 'Bitcoin', 'BTC'),
      cryptoQuoteSeed('ethereum', 'Ethereum', 'ETH'),
      cryptoQuoteSeed('solana', 'Solana', 'SOL'),
      cryptoQuoteSeed('chainlink', 'Chainlink', 'LINK'),
    ],
    newsSymbols: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
  },
  ratesHousing: {
    topic: {
      id: 'ratesHousing',
      label: 'Rates & Housing',
      shortLabel: 'Housing',
      description: 'Bonds, mortgage exposure, real estate, and homebuilder signals.',
      pulseLabel: 'Rate-sensitive pulse',
    },
    assets: [
      quoteSeed('TLT', 'Long-Term Treasury ETF', 'etf'),
      quoteSeed('MBB', 'Mortgage-Backed Bond ETF', 'etf'),
      quoteSeed('VNQ', 'Real Estate ETF', 'etf'),
      quoteSeed('XHB', 'Homebuilders ETF', 'etf'),
    ],
    newsSymbols: ['TLT', 'MBB', 'VNQ', 'XHB'],
  },
  businessSectors: {
    topic: {
      id: 'businessSectors',
      label: 'Business Sectors',
      shortLabel: 'Sectors',
      description: 'Technology, banks, energy, health care, and consumer demand.',
      pulseLabel: 'Sector pulse',
    },
    assets: [
      quoteSeed('XLK', 'Technology ETF', 'etf'),
      quoteSeed('XLF', 'Financials ETF', 'etf'),
      quoteSeed('XLE', 'Energy ETF', 'etf'),
      quoteSeed('XLV', 'Health Care ETF', 'etf'),
    ],
    newsSymbols: ['XLK', 'XLF', 'XLE', 'XLV', 'XLY'],
  },
};

export const moneyWorldTopics: MoneyWorldTopic[] = [
  moneyWorldTopicConfigs.markets.topic,
  moneyWorldTopicConfigs.companies.topic,
  moneyWorldTopicConfigs.crypto.topic,
  moneyWorldTopicConfigs.ratesHousing.topic,
  moneyWorldTopicConfigs.businessSectors.topic,
];

function quoteSeed(symbol: string, name: string, kind: MarketAssetKind): SearchResult {
  return {
    id: symbol,
    symbol,
    name,
    kind,
    source: 'Yahoo',
  };
}

function cryptoQuoteSeed(id: string, name: string, symbol: string): SearchResult {
  return {
    id,
    symbol,
    name,
    kind: 'crypto',
    source: 'CoinGecko',
  };
}

// ─── Current quotes ───────────────────────────────────────────────────────────

export async function fetchMarketAssets(assets = defaultWatchlist): Promise<MarketAsset[]> {
  return Promise.all(assets.map(fetchAsset));
}

export async function fetchMoneyWorldTopicFeed(topicId: MoneyWorldTopicId): Promise<MoneyWorldTopicFeed> {
  const config = moneyWorldTopicConfigs[topicId] ?? moneyWorldTopicConfigs.markets;
  const [assetResult, newsResult] = await Promise.allSettled([
    fetchLiveTopicAssets(config.assets),
    fetchFinanceNews({ symbols: config.newsSymbols, limit: 6 }),
  ]);

  return {
    topic: config.topic,
    assets: assetResult.status === 'fulfilled' ? assetResult.value.assets : [],
    news: newsResult.status === 'fulfilled' ? newsResult.value : [],
    assetError: assetResult.status === 'fulfilled' ? assetResult.value.error : 'Live quotes are unavailable right now.',
    newsError: newsResult.status === 'fulfilled'
      ? (newsResult.value.length === 0 ? 'No live headlines came back for this topic.' : undefined)
      : 'Live headlines are unavailable right now.',
  };
}

async function fetchLiveTopicAssets(results: SearchResult[]): Promise<{ assets: MarketAsset[]; error?: string }> {
  const settled = await Promise.allSettled(results.map((result) => fetchLiveQuote(result)));
  const assets = settled
    .filter((result): result is PromiseFulfilledResult<MarketAsset> => result.status === 'fulfilled')
    .map((result) => result.value);
  const rejectedCount = settled.length - assets.length;

  return {
    assets,
    error: rejectedCount > 0 ? `${rejectedCount} live quote${rejectedCount === 1 ? '' : 's'} could not be loaded.` : undefined,
  };
}

async function fetchAsset(asset: WatchAsset): Promise<MarketAsset> {
  try {
    if (asset.kind === 'crypto' && asset.coinGeckoId) return await fetchCryptoAssetWithYahooFallback(asset);
    return await fetchYahooAsset(asset, asset.yahooSymbol ?? asset.symbol);
  } catch {
    return fallbackAsset(asset);
  }
}

async function fetchCryptoAssetWithYahooFallback(asset: WatchAsset): Promise<MarketAsset> {
  try {
    return await fetchCryptoAsset(asset);
  } catch {
    return fetchYahooCryptoAsset(asset);
  }
}

async function fetchCryptoAsset(asset: WatchAsset): Promise<MarketAsset> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${asset.coinGeckoId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('CoinGecko request failed');

  const data = await response.json();
  const item = data[asset.coinGeckoId ?? ''];
  const price = Number(item?.usd);
  if (!Number.isFinite(price)) throw new Error('CoinGecko price missing');

  const changePercent = Number(item?.usd_24h_change);
  const marketCap = Number(item?.usd_market_cap);
  const volume = Number(item?.usd_24h_vol);

  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    coinGeckoId: asset.coinGeckoId,
    price,
    change: Number.isFinite(changePercent) ? (price * changePercent) / (100 + changePercent) : undefined,
    changePercent: Number.isFinite(changePercent) ? changePercent : undefined,
    marketCap: Number.isFinite(marketCap) ? marketCap : undefined,
    volume: Number.isFinite(volume) ? volume : undefined,
    source: 'CoinGecko',
    isFallback: false,
    fetchedAt: Date.now(),
  };
}

async function fetchStooqAsset(asset: WatchAsset): Promise<MarketAsset> {
  // Format: symbol, date, time, open, high, low, close, volume
  const url = `https://stooq.com/q/l/?s=${asset.stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Stooq request failed');

  const csv = await response.text();
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length < 2) throw new Error('Stooq CSV missing rows');

  const values = rows[1]!.split(',');
  const open = Number(values[3]);
  const high = Number(values[4]);
  const low = Number(values[5]);
  const price = Number(values[6]);
  const volume = Number(values[7]);
  if (!Number.isFinite(price) || price <= 0) throw new Error('Stooq price missing');

  const changePercent = Number.isFinite(open) && open > 0 ? ((price - open) / open) * 100 : undefined;
  const change = Number.isFinite(open) && open > 0 ? price - open : undefined;

  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    price,
    change,
    changePercent,
    open: Number.isFinite(open) ? open : undefined,
    high: Number.isFinite(high) ? high : undefined,
    low: Number.isFinite(low) ? low : undefined,
    volume: Number.isFinite(volume) && volume > 0 ? volume : undefined,
    source: 'Stooq',
    isFallback: false,
    fetchedAt: Date.now(),
  };
}

async function fetchYahooAsset(asset: WatchAsset, yahooSymbol: string): Promise<MarketAsset> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;
  const data = await fetchYahooJson(url) as Record<string, unknown>;
  const chart = data['chart'] as Record<string, unknown> | undefined;
  const result = (chart?.['result'] as Array<Record<string, unknown>> | undefined)?.[0];
  if (!result || chart?.['error']) throw new Error('Yahoo chart data missing');

  const meta = (result['meta'] as Record<string, unknown> | undefined) ?? {};
  const quote = ((result['indicators'] as Record<string, unknown> | undefined)?.['quote'] as Array<Record<string, unknown>> | undefined)?.[0] ?? {};
  const closes = toNumberArray(quote['close']);
  const latestCloseIndex = latestFiniteIndex(closes);
  const closePrice = latestCloseIndex >= 0 ? closes[latestCloseIndex] : undefined;
  const parsedPrice = numberFrom(meta['regularMarketPrice'])
    ?? numberFrom(meta['postMarketPrice'])
    ?? numberFrom(meta['preMarketPrice'])
    ?? closePrice;

  if (parsedPrice === undefined || parsedPrice <= 0) throw new Error('Yahoo price missing');
  const price = parsedPrice;

  const previousClose = numberFrom(meta['chartPreviousClose'])
    ?? numberFrom(meta['previousClose'])
    ?? previousFiniteBefore(closes, latestCloseIndex);
  const open = valueAt(quote['open'], latestCloseIndex);
  const high = valueAt(quote['high'], latestCloseIndex);
  const low = valueAt(quote['low'], latestCloseIndex);
  const volume = valueAt(quote['volume'], latestCloseIndex);
  const change = previousClose && previousClose > 0 ? price - previousClose : undefined;
  const changePercent = change !== undefined && previousClose && previousClose > 0
    ? (change / previousClose) * 100
    : undefined;

  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    price,
    change,
    changePercent,
    open,
    high,
    low,
    volume,
    source: 'Yahoo',
    isFallback: false,
    fetchedAt: Date.now(),
  };
}

async function fetchYahooCryptoAsset(asset: WatchAsset): Promise<MarketAsset> {
  const quote = await fetchYahooAsset(asset, `${asset.symbol.toUpperCase()}-USD`);
  return {
    ...quote,
    kind: 'crypto',
    coinGeckoId: asset.coinGeckoId,
  };
}

function fallbackAsset(asset: WatchAsset): MarketAsset {
  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    coinGeckoId: asset.coinGeckoId,
    price: asset.fallbackPrice,
    changePercent: asset.fallbackChangePercent,
    source: 'Demo',
    isFallback: true,
    fetchedAt: Date.now(),
  };
}

function numberFrom(value: unknown): number | undefined {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function toNumberArray(value: unknown): Array<number | undefined> {
  if (!Array.isArray(value)) return [];
  return value.map(numberFrom);
}

function latestFiniteIndex(values: Array<number | undefined>): number {
  for (let i = values.length - 1; i >= 0; i -= 1) {
    const value = values[i];
    if (Number.isFinite(value) && (value ?? 0) > 0) return i;
  }
  return -1;
}

function previousFiniteBefore(values: Array<number | undefined>, index: number): number | undefined {
  for (let i = Math.min(index - 1, values.length - 1); i >= 0; i -= 1) {
    const value = values[i];
    if (Number.isFinite(value) && (value ?? 0) > 0) return value;
  }
  return undefined;
}

function valueAt(values: unknown, index: number): number | undefined {
  if (index < 0 || !Array.isArray(values)) return undefined;
  return numberFrom(values[index]);
}

function addCacheBust(url: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`;
}

function unwrapJinaText(text: string): string {
  const marker = 'Markdown Content:';
  const markerIndex = text.indexOf(marker);
  return markerIndex >= 0 ? text.slice(markerIndex + marker.length).trim() : text.trim();
}

async function fetchYahooText(url: string): Promise<string> {
  let directError: unknown = null;
  try {
    const response = await fetch(url);
    if (response.ok) return response.text();
    directError = new Error(`Yahoo request failed with ${response.status}`);
  } catch (err) {
    directError = err;
  }

  const proxiedUrl = `https://r.jina.ai/http://${addCacheBust(url)}`;
  const proxied = await fetch(proxiedUrl);
  if (!proxied.ok) {
    throw directError instanceof Error
      ? directError
      : new Error(`Yahoo fallback failed with ${proxied.status}`);
  }
  return unwrapJinaText(await proxied.text());
}

async function fetchYahooJson(url: string): Promise<unknown> {
  return JSON.parse(await fetchYahooText(url));
}

// ─── Historical price data (for charts) ──────────────────────────────────────

/** Fetch daily historical prices for a stock/ETF from Stooq.
 *  Returns oldest-first PricePoint array (left→right on chart).
 *  Falls back to empty array on error (CORS on web, rate-limit, etc.) */
export async function fetchStooqHistorical(
  stooqSymbol: string,
  days: number,
): Promise<PricePoint[]> {
  try {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
    const url = `https://stooq.com/q/d/l/?s=${stooqSymbol}&d1=${fmt(start)}&d2=${fmt(end)}&i=d`;

    const response = await fetch(url);
    if (!response.ok) return [];

    const csv = await response.text();
    const rows = csv.trim().split(/\r?\n/).slice(1); // skip header
    const points: PricePoint[] = [];

    for (const row of rows) {
      const cols = row.split(',');
      const date = cols[1];   // YYYY-MM-DD
      const close = Number(cols[5]); // close column
      if (date && Number.isFinite(close) && close > 0) {
        points.push({ date: date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'), close });
      }
    }

    // Stooq returns newest-first; we want oldest-first for charts
    return points.reverse();
  } catch {
    return [];
  }
}

/** Fetch historical prices for crypto from CoinGecko.
 *  Returns oldest-first PricePoint array. */
export async function fetchCoinGeckoHistorical(
  coinGeckoId: string,
  days: number,
): Promise<PricePoint[]> {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart?vs_currency=usd&days=${days}`;
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    const pricesRaw: [number, number][] = data.prices ?? [];

    // For days <= 1 CoinGecko returns hourly; for 2+ it returns daily.
    // Subsample to at most 60 points to keep charts fast.
    const step = Math.max(1, Math.floor(pricesRaw.length / 60));
    const points: PricePoint[] = [];

    for (let i = 0; i < pricesRaw.length; i += step) {
      const [ts, price] = pricesRaw[i]!;
      const date = new Date(ts).toISOString().slice(0, 10);
      points.push({ date, close: price });
    }

    return points; // already oldest-first from CoinGecko
  } catch {
    return [];
  }
}

// ─── Single quote for the trading flow ────────────────────────────────────────

/** Fetch a live quote for any asset by symbol/kind.
 *  Used by the trading system when the asset isn't already in the watchlist cache. */
export async function fetchQuoteForAsset(
  symbol: string,
  kind: MarketAssetKind,
  coinGeckoId?: string,
  label?: string,
): Promise<MarketAsset> {
  const name = label ?? symbol;
  if (kind === 'crypto' && coinGeckoId) {
    const result = await fetchCryptoAssetWithYahooFallback({
      id: coinGeckoId, label: name, symbol, kind: 'crypto',
      coinGeckoId, fallbackPrice: 0, fallbackChangePercent: 0,
    });
    return result;
  }

  return fetchYahooAsset({
    id: symbol, label: name, symbol, kind,
    fallbackPrice: 0, fallbackChangePercent: 0,
  }, symbol);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export type SearchResult = {
  id: string;
  symbol: string;
  name: string;
  kind: MarketAssetKind;
  source: 'Yahoo' | 'CoinGecko';
};

// Names/symbols matching these patterns are tokenized-equity wrappers, not real securities.
const TOKENIZED_NAME_PATTERNS = [
  /tokenized/i,
  /xstock/i,
  /\bondo\b/i,           // catches "Ondo Finance", "Apple Ondo", "AAPLON" names
  /stock on chain/i,
  /defichain/i,
  /bittrex.*stock/i,
  /wrapped.*stock/i,
];

// Suffixes appended to real ticker symbols by tokenized-equity platforms (e.g. AAPLON, AAPLX).
const TOKENIZED_SYMBOL_SUFFIXES = ['ON', 'X', 'T', 'PERP'];

function isTokenizedProduct(name: string, symbol?: string, queryTicker?: string): boolean {
  if (TOKENIZED_NAME_PATTERNS.some((p) => p.test(name))) return true;
  // If we know the original ticker being searched, filter variants like AAPLON / AAPLX
  if (queryTicker && symbol) {
    const q = queryTicker.toUpperCase();
    const s = symbol.toUpperCase();
    if (s !== q && s.startsWith(q)) {
      const suffix = s.slice(q.length);
      if (TOKENIZED_SYMBOL_SUFFIXES.includes(suffix)) return true;
    }
  }
  return false;
}

export async function searchAssetsByQuery(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const stockResults: SearchResult[] = [];
  const cryptoResults: SearchResult[] = [];

  try {
    const [yahooRes, cgRes] = await Promise.allSettled([
      fetchYahooJson(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}`),
      fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`),
    ]);

    if (yahooRes.status === 'fulfilled') {
      const data = yahooRes.value as Record<string, unknown>;
      for (const item of (data.quotes ?? []) as Array<Record<string, unknown>>) {
        if (stockResults.length >= 4) break;
        let kind: MarketAssetKind | null = null;
        if (item['quoteType'] === 'EQUITY') kind = 'stock';
        else if (item['quoteType'] === 'ETF') kind = 'etf';
        else if (item['quoteType'] === 'MUTUALFUND') kind = 'etf';
        if (!kind) continue;

        const name = String(item['shortname'] ?? item['longname'] ?? item['symbol']);
        const sym  = String(item['symbol']);
        if (isTokenizedProduct(name, sym, q)) continue; // skip tokenized-equity wrappers

        stockResults.push({
          id: String(item['symbol']),
          symbol: String(item['symbol']),
          name,
          kind,
          source: 'Yahoo',
        });
      }
    }

    if (cgRes.status === 'fulfilled' && cgRes.value.ok) {
      const data = await cgRes.value.json();
      let added = 0;
      for (const coin of (data.coins ?? []) as Array<Record<string, unknown>>) {
        if (added >= 2) break;
        const coinName = String(coin['name']);
        const coinSym  = String(coin['symbol']).toUpperCase();
        if (isTokenizedProduct(coinName, coinSym, q)) continue; // skip tokenized-equity crypto
        cryptoResults.push({
          id: String(coin['id']),
          symbol: coinSym,
          name: coinName,
          kind: 'crypto',
          source: 'CoinGecko',
        });
        added++;
      }
    }
  } catch (err) {
    console.warn('searchAssetsByQuery error', err);
  }

  // Exact symbols/names should win across asset classes, so "bitcoin" returns BTC
  // before Bitcoin ETFs while "AAPL" still returns Apple stock first.
  const upperQ = q.toUpperCase();
  const lowerQ = q.toLowerCase();
  const rank = (r: SearchResult) => {
    const symbol = r.symbol.toUpperCase();
    const name = r.name.toLowerCase();
    const id = r.id.toLowerCase();
    if (symbol === upperQ || name === lowerQ || id === lowerQ) return 0;
    if (r.kind === 'crypto' && (name.startsWith(lowerQ) || id.startsWith(lowerQ))) return 1;
    if ((r.kind === 'stock' || r.kind === 'etf') && symbol.startsWith(upperQ)) return 2;
    if (name.includes(lowerQ)) return r.kind === 'crypto' ? 3 : 4;
    return 5;
  };

  return [...stockResults, ...cryptoResults].sort((a, b) => rank(a) - rank(b));
}

export async function fetchLiveQuote(result: SearchResult): Promise<MarketAsset> {
  if (result.kind === 'crypto') {
    return fetchCryptoAssetWithYahooFallback({
      id: result.id, label: result.name, symbol: result.symbol,
      kind: 'crypto', coinGeckoId: result.id,
      fallbackPrice: 0, fallbackChangePercent: 0,
    });
  }

  return fetchYahooAsset({
    id: result.id, label: result.name, symbol: result.symbol, kind: result.kind,
    fallbackPrice: 0, fallbackChangePercent: 0,
  }, result.symbol);
}

// ─── News ─────────────────────────────────────────────────────────────────────

export type FinanceNewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
};

export type FinanceNewsOptions = {
  symbols?: string[];
  limit?: number;
};

function parseRss(xml: string, limit = 8): FinanceNewsItem[] {
  const items: FinanceNewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  const clean = (s: string) =>
    s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

  while ((m = itemRe.exec(xml)) !== null && items.length < limit) {
    const x = m[1]!;
    const title = /<title>([\s\S]*?)<\/title>/.exec(x)?.[1];
    const link  = /<link>([\s\S]*?)<\/link>/.exec(x)?.[1];
    const desc  = /<description>([\s\S]*?)<\/description>/.exec(x)?.[1];
    const date  = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(x)?.[1];
    const guid  = /<guid[^>]*>([\s\S]*?)<\/guid>/.exec(x)?.[1];
    if (title && link) {
      items.push({
        id: guid ?? link,
        title: clean(title),
        description: desc ? clean(desc) : '',
        link: link.trim(),
        pubDate: date?.trim() ?? '',
      });
    }
  }
  return items;
}

function parseYahooMarkdownNews(markdown: string, limit = 8): FinanceNewsItem[] {
  const items: FinanceNewsItem[] = [];
  const lines = markdown.split(/\r?\n/);

  for (let i = 0; i < lines.length && items.length < limit; i += 1) {
    const line = lines[i]?.trim() ?? '';
    const match = /^#{2,4}\s+\[(.+?)\]\((https?:\/\/[^\s)]+)\)/.exec(line)
      ?? /^\[(.+?)\]\((https?:\/\/[^\s)]+)\)/.exec(line);
    if (!match) continue;

    const title = match[1]?.trim();
    const link = match[2]?.trim();
    if (!title || !link) continue;
    if (/^https?:\/\//.test(title) || items.some((item) => item.link === link)) continue;

    let description = '';
    for (let j = i + 1; j < lines.length; j += 1) {
      const nextLine = lines[j]?.trim() ?? '';
      if (!nextLine) continue;
      if (nextLine.startsWith('#') || /^\[.+?\]\(https?:\/\//.test(nextLine) || /^https?:\/\//.test(nextLine)) break;
      description = nextLine.replace(/\[(.*?)\]\(.*?\)/g, '$1');
      break;
    }

    items.push({
      id: link,
      title,
      description,
      link,
      pubDate: 'Live feed',
    });
  }

  return items;
}

function dedupeNewsItems(items: FinanceNewsItem[], limit: number): FinanceNewsItem[] {
  const seen = new Set<string>();
  const deduped: FinanceNewsItem[] = [];

  for (const item of items) {
    const key = item.link || item.id || item.title;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= limit) break;
  }

  return deduped;
}

const defaultFinanceNewsSymbols = ['AAPL', 'MSFT', 'SPY', 'GOOG', 'TSLA'];

/** General market news, or symbol-specific news when symbols are provided. */
export async function fetchFinanceNews(options: FinanceNewsOptions = {}): Promise<FinanceNewsItem[]> {
  const symbols = options.symbols?.filter(Boolean);
  const feedSymbols = symbols && symbols.length > 0 ? symbols : defaultFinanceNewsSymbols;
  const limit = options.limit ?? 8;
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${feedSymbols.map((symbol) => encodeURIComponent(symbol)).join(',')}`;

  try {
    const text = await fetchYahooText(url);
    const rssItems = parseRss(text, limit);
    return dedupeNewsItems(rssItems.length > 0 ? rssItems : parseYahooMarkdownNews(text, limit), limit);
  } catch {
    return [];
  }
}

/** Per-asset news by ticker symbol */
export async function fetchAssetNews(symbol: string): Promise<FinanceNewsItem[]> {
  try {
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}`;
    const text = await fetchYahooText(url);
    const rssItems = parseRss(text, 6);
    return dedupeNewsItems(rssItems.length > 0 ? rssItems : parseYahooMarkdownNews(text, 6), 6);
  } catch {
    return [];
  }
}
