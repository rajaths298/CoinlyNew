export type MarketAssetKind = 'stock' | 'etf' | 'crypto' | 'forex' | 'nft';

export type MarketAsset = {
  id: string;
  label: string;
  symbol: string;
  kind: MarketAssetKind;
  price: number;
  changePercent?: number;
  source: 'CoinGecko' | 'Stooq' | 'Demo';
  isFallback: boolean;
};

type WatchAsset = {
  id: string;
  label: string;
  symbol: string;
  kind: MarketAssetKind;
  coinGeckoId?: string;
  stooqSymbol?: string;
  fallbackPrice: number;
  fallbackChangePercent: number;
};

export const defaultWatchlist: WatchAsset[] = [
  {
    id: 'spy',
    label: 'S&P 500 ETF',
    symbol: 'SPY',
    kind: 'etf',
    stooqSymbol: 'spy.us',
    fallbackPrice: 621.84,
    fallbackChangePercent: 0.24,
  },
  {
    id: 'aapl',
    label: 'Apple',
    symbol: 'AAPL',
    kind: 'stock',
    stooqSymbol: 'aapl.us',
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
];

export async function fetchMarketAssets(assets = defaultWatchlist): Promise<MarketAsset[]> {
  const results = await Promise.all(assets.map((asset) => fetchAsset(asset)));
  return results;
}

async function fetchAsset(asset: WatchAsset): Promise<MarketAsset> {
  try {
    if (asset.kind === 'crypto' && asset.coinGeckoId) {
      return await fetchCryptoAsset(asset);
    }

    if (asset.stooqSymbol) {
      return await fetchStooqAsset(asset);
    }
  } catch {
    return fallbackAsset(asset);
  }

  return fallbackAsset(asset);
}

async function fetchCryptoAsset(asset: WatchAsset): Promise<MarketAsset> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${asset.coinGeckoId}&vs_currencies=usd&include_24hr_change=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('CoinGecko request failed');

  const data = await response.json();
  const item = data[asset.coinGeckoId ?? ''];
  const price = Number(item?.usd);
  if (!Number.isFinite(price)) throw new Error('CoinGecko price missing');

  const changePercent = Number(item?.usd_24h_change);
  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    price,
    changePercent: Number.isFinite(changePercent) ? changePercent : undefined,
    source: 'CoinGecko',
    isFallback: false,
  };
}

async function fetchStooqAsset(asset: WatchAsset): Promise<MarketAsset> {
  const url = `https://stooq.com/q/l/?s=${asset.stooqSymbol}&f=sd2t2ohlcv&h&e=csv`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Stooq request failed');

  const csv = await response.text();
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length < 2) throw new Error('Stooq CSV missing rows');

  const values = rows[1].split(',');
  const open = Number(values[3]);
  const price = Number(values[6]);
  const changePercent = Number.isFinite(open) && open > 0 ? ((price - open) / open) * 100 : undefined;
  if (!Number.isFinite(price)) throw new Error('Stooq price missing');

  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    price,
    changePercent,
    source: 'Stooq',
    isFallback: false,
  };
}

function fallbackAsset(asset: WatchAsset): MarketAsset {
  return {
    id: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    kind: asset.kind,
    price: asset.fallbackPrice,
    changePercent: asset.fallbackChangePercent,
    source: 'Demo',
    isFallback: true,
  };
}

export type FinanceNewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
};

export type SearchResult = {
  id: string;
  symbol: string;
  name: string;
  kind: MarketAssetKind;
  source: 'Yahoo' | 'CoinGecko';
};

export async function searchAssetsByQuery(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const results: SearchResult[] = [];

  try {
    const [yahooRes, cgRes] = await Promise.allSettled([
      fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(cleanQuery)}`),
      fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(cleanQuery)}`)
    ]);

    if (yahooRes.status === 'fulfilled' && yahooRes.value.ok) {
      const data = await yahooRes.value.json();
      const quotes = data.quotes || [];
      for (const q of quotes) {
        if (results.length >= 3) break;
        
        let kind: MarketAssetKind | null = null;
        if (q.quoteType === 'EQUITY') kind = 'stock';
        else if (q.quoteType === 'ETF') kind = 'etf';
        else if (q.quoteType === 'CURRENCY') kind = 'forex';
        else if (q.quoteType === 'CRYPTOCURRENCY') continue; 

        if (kind) {
          results.push({
            id: q.symbol,
            symbol: q.symbol,
            name: q.shortname || q.longname || q.symbol,
            kind,
            source: 'Yahoo'
          });
        }
      }
    }

    if (cgRes.status === 'fulfilled' && cgRes.value.ok) {
      const data = await cgRes.value.json();
      let cryptoCount = 0;
      let nftCount = 0;
      
      for (const coin of (data.coins || [])) {
        if (cryptoCount >= 2) break;
        results.push({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          kind: 'crypto',
          source: 'CoinGecko'
        });
        cryptoCount++;
      }
      
      for (const nft of (data.nfts || [])) {
        if (nftCount >= 1) break;
        results.push({
          id: nft.id,
          symbol: nft.symbol,
          name: nft.name,
          kind: 'nft',
          source: 'CoinGecko'
        });
        nftCount++;
      }
    }
  } catch (err) {
    console.warn('searchAssetsByQuery error', err);
  }

  return results;
}

export async function fetchLiveQuote(result: SearchResult): Promise<MarketAsset> {
  if (result.kind === 'crypto') {
    return await fetchCryptoAsset({
      id: result.id,
      label: result.name,
      symbol: result.symbol,
      kind: 'crypto',
      coinGeckoId: result.id,
      fallbackPrice: 0,
      fallbackChangePercent: 0
    });
  }

  if (result.kind === 'nft') {
    const url = `https://api.coingecko.com/api/v3/nfts/${result.id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('CoinGecko NFT request failed');
    const data = await response.json();
    const price = data.floor_price?.usd;
    const changePercent = data.floor_price_in_usd_24h_percentage_change;
    if (!Number.isFinite(price)) throw new Error('NFT price missing');
    return {
      id: result.id,
      label: result.name,
      symbol: result.symbol,
      kind: 'nft',
      price,
      changePercent: Number.isFinite(changePercent) ? changePercent : undefined,
      source: 'CoinGecko',
      isFallback: false,
    };
  }

  let stooqSymbol = result.id;
  if (result.kind === 'stock' || result.kind === 'etf') {
    if (!stooqSymbol.includes('.')) {
      stooqSymbol = `${stooqSymbol}.US`;
    }
  } else if (result.kind === 'forex') {
    stooqSymbol = stooqSymbol.replace('=X', '');
  }

  return await fetchStooqAsset({
    id: result.id,
    label: result.name,
    symbol: result.symbol,
    kind: result.kind,
    stooqSymbol: stooqSymbol,
    fallbackPrice: 0,
    fallbackChangePercent: 0
  });
}

export async function fetchFinanceNews(): Promise<FinanceNewsItem[]> {
  try {
    const url = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL,MSFT,SPY,GOOG,TSLA';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch RSS');

    const xml = await response.text();
    const items: FinanceNewsItem[] = [];
    
    // Extract items using regex since we don't have a robust XML parser
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemXml);
      const descMatch = /<description>([\s\S]*?)<\/description>/.exec(itemXml);
      const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemXml);
      const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemXml);
      const guidMatch = /<guid[^>]*>([\s\S]*?)<\/guid>/.exec(itemXml);
      
      if (titleMatch && linkMatch) {
        items.push({
          id: guidMatch ? guidMatch[1] : linkMatch[1],
          title: titleMatch[1]
            .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim(),
          description: descMatch ? descMatch[1]
            .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
            .replace(/<[^>]+>/g, '') // remove HTML tags
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim() : '',
          link: linkMatch[1].trim(),
          pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
        });
      }
    }
    
    return items.slice(0, 5); // Return top 5 news items
  } catch (err) {
    console.error('fetchFinanceNews error', err);
    return [];
  }
}

