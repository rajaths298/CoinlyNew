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
  source: 'CoinGecko' | 'Stooq' | 'Demo';
  isFallback: boolean;
  fetchedAt?: number;        // Date.now() — used by consumers for staleness
};

type WatchAsset = {
  id: string;
  label: string;
  symbol: string;
  kind: MarketAssetKind;
  coinGeckoId?: string;
  yahooSymbol?: string;
  fallbackPrice: number;
  fallbackChangePercent: number;
};

export const defaultWatchlist: WatchAsset[] = [
<<<<<<< Updated upstream
  { id: 'spy',      label: 'S&P 500 ETF',  symbol: 'SPY',  kind: 'etf',    stooqSymbol: 'spy.us',  fallbackPrice: 621.84,  fallbackChangePercent: 0.24  },
  { id: 'aapl',     label: 'Apple',         symbol: 'AAPL', kind: 'stock',  stooqSymbol: 'aapl.us', fallbackPrice: 196.58,  fallbackChangePercent: -0.18 },
  { id: 'bitcoin',  label: 'Bitcoin',       symbol: 'BTC',  kind: 'crypto', coinGeckoId: 'bitcoin', fallbackPrice: 108420,  fallbackChangePercent: 1.35  },
  { id: 'ethereum', label: 'Ethereum',      symbol: 'ETH',  kind: 'crypto', coinGeckoId: 'ethereum',fallbackPrice: 3865,    fallbackChangePercent: 0.72  },
=======
  {
    id: 'spy',
    label: 'S&P 500 ETF',
    symbol: 'SPY',
    kind: 'etf',
    yahooSymbol: 'SPY',
    fallbackPrice: 621.84,
    fallbackChangePercent: 0.24,
  },
  {
    id: 'aapl',
    label: 'Apple',
    symbol: 'AAPL',
    kind: 'stock',
    yahooSymbol: 'AAPL',
    fallbackPrice: 196.58,
    fallbackChangePercent: -0.18,
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    symbol: 'BTC',
    kind: 'crypto',
    coinGeckoId: 'bitcoin',
    fallbackPrice: 108420,
    fallbackChangePercent: 1.35,
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    symbol: 'ETH',
    kind: 'crypto',
    coinGeckoId: 'ethereum',
    fallbackPrice: 3865,
    fallbackChangePercent: 0.72,
  },
>>>>>>> Stashed changes
];

// ─── Current quotes ───────────────────────────────────────────────────────────

export async function fetchMarketAssets(assets = defaultWatchlist): Promise<MarketAsset[]> {
  return Promise.all(assets.map(fetchAsset));
}

async function fetchAsset(asset: WatchAsset): Promise<MarketAsset> {
  try {
<<<<<<< Updated upstream
    if (asset.kind === 'crypto' && asset.coinGeckoId) return await fetchCryptoAsset(asset);
    if (asset.stooqSymbol) return await fetchStooqAsset(asset);
=======
    if (asset.kind === 'crypto' && asset.coinGeckoId) {
      return await fetchCryptoAsset(asset);
    }

    if (asset.yahooSymbol) {
      return await fetchYahooAsset(asset, asset.yahooSymbol);
    }
>>>>>>> Stashed changes
  } catch {
    return fallbackAsset(asset);
  }
  return fallbackAsset(asset);
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

<<<<<<< Updated upstream
async function fetchStooqAsset(asset: WatchAsset): Promise<MarketAsset> {
  // Format: symbol, date, time, open, high, low, close, volume
  const url = `https://stooq.com/q/l/?s=${asset.stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
=======
async function fetchYahooAsset(asset: WatchAsset, yahooSymbol: string): Promise<MarketAsset> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
>>>>>>> Stashed changes
  const response = await fetch(url);
  if (!response.ok) throw new Error('Yahoo request failed');

  const data = await response.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('Yahoo data missing');

<<<<<<< Updated upstream
  const values = rows[1]!.split(',');
  const open = Number(values[3]);
  const high = Number(values[4]);
  const low = Number(values[5]);
  const price = Number(values[6]);
  const volume = Number(values[7]);
  if (!Number.isFinite(price) || price <= 0) throw new Error('Stooq price missing');

  const changePercent = Number.isFinite(open) && open > 0 ? ((price - open) / open) * 100 : undefined;
  const change = Number.isFinite(open) && open > 0 ? price - open : undefined;
=======
  const price = meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose || meta.previousClose;
  const changePercent = (price && previousClose && previousClose > 0)
    ? ((price - previousClose) / previousClose) * 100
    : undefined;

  if (!Number.isFinite(price)) throw new Error('Yahoo price missing');
>>>>>>> Stashed changes

  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    price,
    change,
    changePercent,
<<<<<<< Updated upstream
    open: Number.isFinite(open) ? open : undefined,
    high: Number.isFinite(high) ? high : undefined,
    low: Number.isFinite(low) ? low : undefined,
    volume: Number.isFinite(volume) && volume > 0 ? volume : undefined,
    source: 'Stooq',
=======
    source: 'Yahoo',
>>>>>>> Stashed changes
    isFallback: false,
    fetchedAt: Date.now(),
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
    const result = await fetchCryptoAsset({
      id: coinGeckoId, label: name, symbol, kind: 'crypto',
      coinGeckoId, fallbackPrice: 0, fallbackChangePercent: 0,
    });
    return result;
  }

  let stooqSym = symbol;
  if (!stooqSym.includes('.')) stooqSym = `${symbol}.US`;

  return fetchStooqAsset({
    id: symbol, label: name, symbol, kind,
    stooqSymbol: stooqSym.toLowerCase(),
    fallbackPrice: 0, fallbackChangePercent: 0,
  });
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
      fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}`),
      fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`),
    ]);

    if (yahooRes.status === 'fulfilled' && yahooRes.value.ok) {
      const data = await yahooRes.value.json();
      for (const item of (data.quotes ?? []) as Array<Record<string, unknown>>) {
        if (stockResults.length >= 4) break;
        let kind: MarketAssetKind | null = null;
<<<<<<< Updated upstream
        if (item['quoteType'] === 'EQUITY') kind = 'stock';
        else if (item['quoteType'] === 'ETF') kind = 'etf';
        else if (item['quoteType'] === 'MUTUALFUND') kind = 'etf';
        if (!kind) continue;
=======
        if (q.quoteType === 'EQUITY') kind = 'stock';
        else if (q.quoteType === 'ETF') kind = 'etf';
        else if (q.quoteType === 'CURRENCY') kind = 'forex';
        else if (q.quoteType === 'MUTUALFUND') kind = 'etf';
        else if (q.quoteType === 'INDEX') kind = 'etf';
        else if (q.quoteType === 'FUTURE') kind = 'forex';
        else if (q.quoteType === 'CRYPTOCURRENCY') continue; 
>>>>>>> Stashed changes

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

  // Stocks/ETFs first; within each group exact-ticker match ranks top.
  const upperQ = q.toUpperCase();
  const rank = (r: SearchResult) => (r.symbol === upperQ ? 0 : 1);
  stockResults.sort((a, b) => rank(a) - rank(b));

  return [...stockResults, ...cryptoResults];
}

export async function fetchLiveQuote(result: SearchResult): Promise<MarketAsset> {
  if (result.kind === 'crypto') {
    return fetchCryptoAsset({
      id: result.id, label: result.name, symbol: result.symbol,
      kind: 'crypto', coinGeckoId: result.id,
      fallbackPrice: 0, fallbackChangePercent: 0,
    });
  }

  let stooqSymbol = result.symbol;
  if (!stooqSymbol.includes('.')) stooqSymbol = `${stooqSymbol}.US`;

<<<<<<< Updated upstream
  return fetchStooqAsset({
    id: result.id, label: result.name, symbol: result.symbol, kind: result.kind,
    stooqSymbol: stooqSymbol.toLowerCase(),
    fallbackPrice: 0, fallbackChangePercent: 0,
  });
=======
  return await fetchYahooAsset({
    id: result.id,
    label: result.name,
    symbol: result.symbol,
    kind: result.kind,
    yahooSymbol: result.id,
    fallbackPrice: 0,
    fallbackChangePercent: 0
  }, result.id);
>>>>>>> Stashed changes
}

// ─── News ─────────────────────────────────────────────────────────────────────

export type FinanceNewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
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

/** General market news */
export async function fetchFinanceNews(): Promise<FinanceNewsItem[]> {
  try {
    const url = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL,MSFT,SPY,GOOG,TSLA';
    const r = await fetch(url);
    if (!r.ok) return [];
    return parseRss(await r.text(), 8);
  } catch {
    return [];
  }
}

/** Per-asset news by ticker symbol */
export async function fetchAssetNews(symbol: string): Promise<FinanceNewsItem[]> {
  try {
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}`;
    const r = await fetch(url);
    if (!r.ok) return [];
    return parseRss(await r.text(), 6);
  } catch {
    return [];
  }
}
