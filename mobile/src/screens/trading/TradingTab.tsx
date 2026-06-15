/**
 * TradingTab — virtual paper-trading simulator living inside the Invest tab.
 * Contains four inner screens (Market / Asset Detail / Portfolio / History)
 * and the OrderTicket bottom-sheet modal, all managed via local nav state.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { appColors as colors } from '../../theme';
import LineChart from '../../components/trading/LineChart';
import {
  fetchMarketAssets,
  fetchLiveQuote,
  fetchQuoteForAsset,
  fetchStooqHistorical,
  fetchCoinGeckoHistorical,
  fetchAssetNews,
  fetchFinanceNews,
  searchAssetsByQuery,
  type MarketAsset,
  type FinanceNewsItem,
  type SearchResult,
} from '../../services/marketData';
import {
  computeHoldingPnl,
  computeTotalValue,
  executeBuy,
  executeSell,
  executeShort,
  executeCover,
  addTodaySnapshot,
  checkLimitOrders,
  isCryptoUnlocked,
  isShortingUnlocked,
  cryptoUnlockProgress,
} from '../../services/portfolioEngine';
// Persist trades through the cloud-sync layer (same single-arg signature as the
// old local store): writes the per-user cache immediately and pushes to Supabase.
import { savePortfolio } from '../../services/cloudSync';
import type { Portfolio, Holding, ChartRange, PricePoint } from '../../types/trading';
import type { LessonProgress } from '../../types/lesson';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavState =
  | { screen: 'market' }
  | { screen: 'detail'; asset: MarketAsset }
  | { screen: 'portfolio' }
  | { screen: 'history' };

type MainTab = 'market' | 'portfolio' | 'history';

type Props = {
  portfolio: Portfolio;
  onUpdatePortfolio: (p: Portfolio) => void;
  lessonProgress: LessonProgress;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const fmtCompact = (n: number) => {
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return fmt.format(n);
};
const fmtPct  = (n: number | undefined) => n === undefined ? '—' : `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
const fmtQty  = (n: number) => n < 1 ? n.toFixed(6) : n.toFixed(4).replace(/\.?0+$/, '');
const timeFmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

// Delay label — quiet muted text, not a coloured chip
function DelayLabel({ asset }: { asset: MarketAsset }) {
  if (asset.isFallback)          return <Text style={S.delayDemo}>DEMO</Text>;
  if (asset.kind === 'crypto')   return <Text style={S.delayLive}>LIVE</Text>;
  return <Text style={S.delayDelayed}>15 MIN</Text>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TradingTab({ portfolio, onUpdatePortfolio, lessonProgress }: Props) {
  const [nav, setNav] = useState<NavState>({ screen: 'market' });
  const [quotes, setQuotes] = useState<Map<string, MarketAsset>>(new Map());
  const [orderTicket, setOrderTicket] = useState<MarketAsset | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeMain: MainTab =
    nav.screen === 'portfolio' ? 'portfolio' :
    nav.screen === 'history'   ? 'history'   : 'market';

  const mergeQuotes = useCallback((assets: MarketAsset[]) => {
    setQuotes((prev) => {
      const next = new Map(prev);
      for (const a of assets) next.set(a.symbol, a);
      return next;
    });
  }, []);

  const refreshQuotes = useCallback(async () => {
    const assets = await fetchMarketAssets();
    mergeQuotes(assets);
    const extraSymbols = portfolio.holdings
      .map((h) => h.symbol)
      .filter((s) => !assets.some((a) => a.symbol === s));
    if (extraSymbols.length > 0) {
      const extra = await Promise.allSettled(
        extraSymbols.map((s) => {
          const h = portfolio.holdings.find((x) => x.symbol === s)!;
          return fetchQuoteForAsset(s, h.kind, h.coinGeckoId, h.label);
        }),
      );
      mergeQuotes(extra.flatMap((r) => r.status === 'fulfilled' ? [r.value] : []));
    }
  }, [portfolio.holdings, mergeQuotes]);

  useEffect(() => {
    void refreshQuotes();
    pollRef.current = setInterval(() => { void refreshQuotes(); }, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [refreshQuotes]);

  useEffect(() => {
    if (quotes.size === 0) return;
    const priceMap = new Map<string, number>();
    quotes.forEach((a, sym) => priceMap.set(sym, a.price));
    const updated = checkLimitOrders(portfolio, priceMap);
    if (updated !== portfolio) { onUpdatePortfolio(updated); void savePortfolio(updated); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  useEffect(() => {
    if (quotes.size === 0) return;
    const priceMap = new Map<string, number>();
    quotes.forEach((a, sym) => priceMap.set(sym, a.price));
    const snapped = addTodaySnapshot(portfolio, computeTotalValue(portfolio, priceMap));
    if (snapped.snapshots[0]?.value !== portfolio.snapshots[0]?.value) {
      onUpdatePortfolio(snapped); void savePortfolio(snapped);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  function handleExecuteOrder(
    asset: MarketAsset, side: 'buy'|'sell'|'short'|'cover',
    qty: number, orderKind: 'market'|'limit', limitPrice?: number,
  ) {
    if (orderKind === 'limit' && limitPrice !== undefined) {
      const order = {
        id: `ord-${Date.now()}`, symbol: asset.symbol, label: asset.label,
        kind: asset.kind, coinGeckoId: asset.coinGeckoId, side, qty, limitPrice,
        createdAt: new Date().toISOString(),
      };
      const updated = { ...portfolio, pendingOrders: [order, ...portfolio.pendingOrders] };
      onUpdatePortfolio(updated); void savePortfolio(updated);
      setOrderTicket(null); return;
    }
    const price = quotes.get(asset.symbol)?.price ?? asset.price;
    let result;
    if (side === 'buy')        result = executeBuy(portfolio, asset, qty, price);
    else if (side === 'sell')  result = executeSell(portfolio, asset, qty, price);
    else if (side === 'short') result = executeShort(portfolio, asset, qty, price);
    else                       result = executeCover(portfolio, asset, qty, price);
    if ('error' in result) { Alert.alert('Order rejected', result.error); return; }
    onUpdatePortfolio(result.portfolio); void savePortfolio(result.portfolio);
    setOrderTicket(null);
  }

  const priceMap = useMemo(() => {
    const m = new Map<string, number>();
    quotes.forEach((a, s) => m.set(s, a.price));
    return m;
  }, [quotes]);

  const totalValue = computeTotalValue(portfolio, priceMap);

  return (
    <View style={S.root}>
      {/* Top navigation */}
      <View style={S.topNav}>
        {nav.screen === 'detail' ? (
          <TouchableOpacity onPress={() => setNav({ screen: 'market' })} style={S.backBtn} activeOpacity={0.7}>
            <Text style={S.backBtnText}>← BACK</Text>
          </TouchableOpacity>
        ) : (
          <View style={S.tabRow}>
            {(['market', 'portfolio', 'history'] as MainTab[]).map((t) => (
              <TouchableOpacity key={t}
                style={[S.tab, activeMain === t && S.tabActive]}
                onPress={() => setNav({ screen: t })} activeOpacity={0.7}
              >
                <Text style={[S.tabText, activeMain === t && S.tabTextActive]}>
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={S.cashPill}>
          <Text style={S.cashLabel}>CASH</Text>
          <Text style={S.cashValue}>{fmt.format(portfolio.cash)}</Text>
        </View>
      </View>

      {nav.screen === 'market' && (
        <MarketScreen quotes={quotes} portfolio={portfolio}
          lessonProgress={lessonProgress}
          onAssetTap={(a) => setNav({ screen: 'detail', asset: a })}
          onQuoteFetched={(a) => mergeQuotes([a])} />
      )}
      {nav.screen === 'detail' && (
        <AssetDetailScreen
          asset={quotes.get(nav.asset.symbol) ?? nav.asset}
          lessonProgress={lessonProgress}
          onTrade={(a) => setOrderTicket(a)} />
      )}
      {nav.screen === 'portfolio' && (
        <PortfolioScreen portfolio={portfolio} quotes={quotes} totalValue={totalValue}
          onAssetTap={(a) => setNav({ screen: 'detail', asset: a })}
          onReset={() => {
            Alert.alert('Reset portfolio?',
              'Wipe all positions and reset cash to $100,000? This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => {
                  const fresh = { ...portfolio, cash: 100_000, holdings: [], pendingOrders: [], transactions: [], snapshots: [] };
                  onUpdatePortfolio(fresh); void savePortfolio(fresh);
                }},
              ],
            );
          }} />
      )}
      {nav.screen === 'history' && (
        <HistoryScreen portfolio={portfolio}
          onCancelOrder={(id) => {
            const updated = { ...portfolio, pendingOrders: portfolio.pendingOrders.filter((o) => o.id !== id) };
            onUpdatePortfolio(updated); void savePortfolio(updated);
          }} />
      )}

      {orderTicket && (
        <OrderTicketModal
          asset={quotes.get(orderTicket.symbol) ?? orderTicket}
          portfolio={portfolio} lessonProgress={lessonProgress}
          onClose={() => setOrderTicket(null)} onExecute={handleExecuteOrder} />
      )}
    </View>
  );
}

// ─── Market Screen ────────────────────────────────────────────────────────────

function MarketScreen({ quotes, portfolio, lessonProgress, onAssetTap, onQuoteFetched }: {
  quotes: Map<string, MarketAsset>; portfolio: Portfolio;
  lessonProgress: LessonProgress;
  onAssetTap: (a: MarketAsset) => void; onQuoteFetched: (a: MarketAsset) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [news, setNews] = useState<FinanceNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetchFinanceNews().then((n) => { setNews(n); setNewsLoading(false); });
  }, []);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true); setSearchResults([]);
    try { setSearchResults(await searchAssetsByQuery(searchQuery)); }
    catch { /* ignore */ } finally { setIsSearching(false); }
  }

  async function handleSelectResult(r: SearchResult) {
    setSearchResults([]); setSearchQuery('');
    try { const q = await fetchLiveQuote(r); onQuoteFetched(q); onAssetTap(q); }
    catch { /* ignore */ }
  }

  const cryptoOk = isCryptoUnlocked(lessonProgress);
  const watchlistAssets = portfolio.watchlistSymbols
    .map((s) => quotes.get(s)).filter((a): a is MarketAsset => a !== undefined);
  const movers = Array.from(quotes.values())
    .filter((a) => a.changePercent !== undefined)
    .sort((a, b) => Math.abs(b.changePercent ?? 0) - Math.abs(a.changePercent ?? 0))
    .slice(0, 6);

  return (
    <ScrollView contentContainerStyle={S.screenPad} showsVerticalScrollIndicator={false}>

      {/* Search — yellow panel matching original ExploreTab */}
      <View style={S.searchPanel}>
        <Text style={S.searchEyebrow}>MARKET LOOKUP</Text>
        <View style={S.searchBar}>
          <TextInput style={S.searchInput} placeholder="Ticker or name (e.g. AAPL, bitcoin)…"
            placeholderTextColor="rgba(16,36,29,0.45)" value={searchQuery}
            onChangeText={setSearchQuery} onSubmitEditing={handleSearch}
            autoCapitalize="characters" autoCorrect={false} returnKeyType="search" />
          <TouchableOpacity style={S.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
            <Text style={S.searchBtnText}>GO</Text>
          </TouchableOpacity>
        </View>

        {isSearching && <ActivityIndicator style={{ marginTop: 14 }} color={colors.black} />}

        {searchResults.length > 0 && (
          <View style={S.resultsList}>
            {searchResults.map((r, i) => {
              const locked = r.kind === 'crypto' && !cryptoOk;
              return (
                <TouchableOpacity key={`${r.id}-${i}`}
                  style={[S.resultRow, locked && { opacity: 0.45 }]}
                  activeOpacity={locked ? 1 : 0.75}
                  onPress={locked ? undefined : () => handleSelectResult(r)}
                >
                  <View style={S.kindTag}><Text style={S.kindTagText}>{r.kind.toUpperCase()}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={S.resultName} numberOfLines={1}>{r.name}</Text>
                    <Text style={S.resultSymbol}>{r.symbol}</Text>
                  </View>
                  {locked && <Text style={S.lockedCaption}>Complete Crypto unit to unlock</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Watchlist */}
      <SectionHeader label="WATCHLIST" />
      {watchlistAssets.length === 0
        ? <Text style={S.emptyNote}>Fetching market data…</Text>
        : <View style={S.listPanel}>
            {watchlistAssets.map((a, i) => (
              <AssetRow key={a.symbol} asset={a} last={i === watchlistAssets.length - 1}
                onTap={() => onAssetTap(a)} />
            ))}
          </View>
      }

      {/* Top Movers */}
      {movers.length > 0 && <>
        <SectionHeader label="TODAY'S MOVERS" />
        <View style={S.listPanel}>
          {movers.map((a, i) => (
            <AssetRow key={`m-${a.symbol}`} asset={a} last={i === movers.length - 1}
              onTap={() => onAssetTap(a)} />
          ))}
        </View>
      </>}

      {/* News */}
      <SectionHeader label="MARKET NEWS" />
      {newsLoading
        ? <ActivityIndicator color={colors.black} style={{ marginVertical: 12 }} />
        : news.length === 0
          ? <Text style={S.emptyNote}>No news available.</Text>
          : <View style={S.newsList}>
              {news.map((item) => (
                <TouchableOpacity key={item.id} style={S.newsCard}
                  onPress={() => Linking.openURL(item.link)} activeOpacity={0.75}>
                  <Text style={S.newsTitle} numberOfLines={3}>{item.title}</Text>
                  <Text style={S.newsDate}>{item.pubDate}</Text>
                </TouchableOpacity>
              ))}
            </View>
      }
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Asset Detail Screen ──────────────────────────────────────────────────────

function AssetDetailScreen({ asset, lessonProgress, onTrade }: {
  asset: MarketAsset; lessonProgress: LessonProgress; onTrade: (a: MarketAsset) => void;
}) {
  const [range, setRange] = useState<ChartRange>('1M');
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [news, setNews] = useState<FinanceNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const rangeDays: Record<ChartRange, number> = { '1W': 7, '1M': 30, '3M': 90, '1Y': 365 };

  useEffect(() => {
    setChartLoading(true); setChartData([]);
    const load = async () => {
      const pts = asset.kind === 'crypto' && asset.coinGeckoId
        ? await fetchCoinGeckoHistorical(asset.coinGeckoId, rangeDays[range])
        : await fetchStooqHistorical(
            (asset.symbol.includes('.') ? asset.symbol : `${asset.symbol}.us`).toLowerCase(),
            rangeDays[range],
          );
      setChartData(pts); setChartLoading(false);
    };
    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.symbol, range]);

  useEffect(() => {
    setNewsLoading(true);
    fetchAssetNews(asset.symbol).then((n) => { setNews(n); setNewsLoading(false); });
  }, [asset.symbol]);

  const isUp = (asset.changePercent ?? 0) >= 0;
  const changeColor = isUp ? colors.positive : colors.negative;
  const cryptoOk = isCryptoUnlocked(lessonProgress);
  const isLocked = asset.kind === 'crypto' && !cryptoOk;

  return (
    <ScrollView contentContainerStyle={S.screenPad} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={S.detailHeader}>
        <View style={{ flex: 1 }}>
          <View style={S.detailTitleRow}>
            <View style={S.assetBadge}><Text style={S.assetBadgeText}>{asset.symbol.slice(0, 4)}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text style={S.detailSymbol}>{asset.symbol}</Text>
                <View style={S.kindTag}><Text style={S.kindTagText}>{asset.kind.toUpperCase()}</Text></View>
                <DelayLabel asset={asset} />
              </View>
              <Text style={S.detailLabel}>{asset.label}</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={S.detailPrice}>{fmt.format(asset.price)}</Text>
          <Text style={[S.detailChange, { color: changeColor }]}>
            {asset.change !== undefined ? `${isUp ? '+' : ''}${fmt.format(asset.change)}  ` : ''}{fmtPct(asset.changePercent)}
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={S.chartCard}>
        <View style={S.rangeRow}>
          {(['1W', '1M', '3M', '1Y'] as ChartRange[]).map((r) => (
            <TouchableOpacity key={r} style={[S.rangeBtn, range === r && S.rangeBtnActive]} onPress={() => setRange(r)}>
              <Text style={[S.rangeBtnText, range === r && S.rangeBtnTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {chartLoading
          ? <View style={S.chartPlaceholder}><ActivityIndicator color={colors.black} /><Text style={S.chartNote}>Loading…</Text></View>
          : chartData.length < 2
            ? <View style={S.chartPlaceholder}>
                <Text style={S.chartNote}>
                  {asset.kind !== 'crypto' ? 'Chart unavailable on web (CORS). Works on device.' : 'Chart unavailable.'}
                </Text>
              </View>
            : <LineChart points={chartData} width={340} height={140} />
        }
      </View>

      {/* Key Stats */}
      <SectionHeader label="KEY STATS" />
      <View style={S.statsGrid}>
        <StatCell label="Open"     value={asset.open      ? fmt.format(asset.open)      : '—'} />
        <StatCell label="Day High" value={asset.high      ? fmt.format(asset.high)      : '—'} />
        <StatCell label="Day Low"  value={asset.low       ? fmt.format(asset.low)       : '—'} />
        <StatCell label="Volume"   value={asset.volume    ? fmtCompact(asset.volume)    : '—'} />
        <StatCell label="Mkt Cap"  value={asset.marketCap ? fmtCompact(asset.marketCap) : '—'} />
        <StatCell label="Source"   value={asset.isFallback ? 'Demo' : asset.source} />
      </View>

      {/* Trade / Lock */}
      {isLocked ? (
        <View style={S.lockBanner}>
          <Text style={S.lockEyebrow}>CRYPTO TRADING LOCKED</Text>
          <Text style={S.lockBody}>
            Complete the Crypto unit in the Learn tab to unlock crypto trading.{'\n'}
            {cryptoUnlockProgress(lessonProgress).done}/{cryptoUnlockProgress(lessonProgress).total} lessons done.
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={S.tradeBtn} onPress={() => onTrade(asset)} activeOpacity={0.85}>
          <Text style={S.tradeBtnText}>TRADE {asset.symbol}</Text>
        </TouchableOpacity>
      )}

      {/* News */}
      <SectionHeader label="NEWS" />
      {newsLoading
        ? <ActivityIndicator color={colors.black} style={{ marginVertical: 8 }} />
        : news.length === 0
          ? <Text style={S.emptyNote}>No news for {asset.symbol}.</Text>
          : <View style={S.newsList}>
              {news.map((item) => (
                <TouchableOpacity key={item.id} style={S.newsCard}
                  onPress={() => Linking.openURL(item.link)} activeOpacity={0.75}>
                  <Text style={S.newsTitle} numberOfLines={3}>{item.title}</Text>
                  <Text style={S.newsDate}>{item.pubDate}</Text>
                </TouchableOpacity>
              ))}
            </View>
      }
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Portfolio Screen ─────────────────────────────────────────────────────────

function PortfolioScreen({ portfolio, quotes, totalValue, onAssetTap, onReset }: {
  portfolio: Portfolio; quotes: Map<string, MarketAsset>; totalValue: number;
  onAssetTap: (a: MarketAsset) => void; onReset: () => void;
}) {
  const totalReturn    = totalValue - 100_000;
  const totalReturnPct = (totalReturn / 100_000) * 100;
  const isUp           = totalReturn >= 0;

  const snapPoints = useMemo<PricePoint[]>(
    () => [...portfolio.snapshots].reverse().map((s) => ({ date: s.date, close: s.value })),
    [portfolio.snapshots],
  );

  return (
    <ScrollView contentContainerStyle={S.screenPad} showsVerticalScrollIndicator={false}>
      {/* Portfolio hero — dark featurePanel */}
      <View style={S.portfolioHero}>
        <Text style={S.heroEyebrow}>TOTAL PORTFOLIO VALUE</Text>
        <Text style={S.heroValue}>{fmt.format(totalValue)}</Text>
        <Text style={[S.heroReturn, { color: isUp ? colors.positive : colors.negative }]}>
          {isUp ? '+' : ''}{fmt.format(totalReturn)} ({fmtPct(totalReturnPct)}) all-time
        </Text>
      </View>

      {/* Performance chart */}
      {snapPoints.length >= 2 && (
        <View style={S.chartCard}>
          <Text style={S.chartCardEyebrow}>PERFORMANCE</Text>
          <LineChart points={snapPoints} width={340} height={120} />
        </View>
      )}

      {/* Summary metrics */}
      <SectionHeader label="SUMMARY" />
      <View style={S.statsGrid}>
        <StatCell label="Cash"        value={fmt.format(portfolio.cash)} />
        <StatCell label="Invested"    value={fmt.format(totalValue - portfolio.cash)} />
        <StatCell label="Positions"   value={String(portfolio.holdings.length)} />
        <StatCell label="Open Orders" value={String(portfolio.pendingOrders.length)} />
      </View>

      {/* Holdings */}
      <SectionHeader label="HOLDINGS" />
      {portfolio.holdings.length === 0
        ? <Text style={S.emptyNote}>No open positions. Search an asset and place your first trade.</Text>
        : portfolio.holdings.map((h) => {
            const q     = quotes.get(h.symbol);
            const price = q?.price ?? h.avgCost;
            const { pnl, pnlPct } = computeHoldingPnl(h, price);
            return (
              <TouchableOpacity key={h.id} style={S.holdingCard}
                onPress={() => q && onAssetTap(q)} activeOpacity={0.75}>
                <View style={S.assetBadge}><Text style={S.assetBadgeText}>{h.symbol.slice(0, 4)}</Text></View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={S.holdingSymbol}>{h.symbol}</Text>
                    {h.side === 'short' && <View style={S.shortTag}><Text style={S.shortTagText}>SHORT</Text></View>}
                  </View>
                  <Text style={S.holdingDetail}>{fmtQty(h.qty)} sh · avg {fmt.format(h.avgCost)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={S.holdingValue}>{fmt.format(price * h.qty)}</Text>
                  <Text style={[S.holdingPnl, { color: pnl >= 0 ? colors.positive : colors.negative }]}>
                    {pnl >= 0 ? '+' : ''}{fmt.format(pnl)} ({fmtPct(pnlPct)})
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
      }

      <TouchableOpacity style={S.resetBtn} onPress={onReset} activeOpacity={0.8}>
        <Text style={S.resetBtnText}>RESET PORTFOLIO</Text>
      </TouchableOpacity>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── History Screen ───────────────────────────────────────────────────────────

function HistoryScreen({ portfolio, onCancelOrder }: {
  portfolio: Portfolio; onCancelOrder: (id: string) => void;
}) {
  return (
    <ScrollView contentContainerStyle={S.screenPad} showsVerticalScrollIndicator={false}>
      {portfolio.pendingOrders.length > 0 && <>
        <SectionHeader label="OPEN LIMIT ORDERS" />
        {portfolio.pendingOrders.map((o) => (
          <View key={o.id} style={S.orderCard}>
            <View style={S.kindTag}><Text style={S.kindTagText}>{o.side.toUpperCase()}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={S.orderSymbol}>{o.symbol}  ·  LIMIT @ {fmt.format(o.limitPrice)}</Text>
              <Text style={S.orderDetail}>{fmtQty(o.qty)} shares  ·  {timeFmt(o.createdAt)}</Text>
            </View>
            <TouchableOpacity style={S.cancelBtn} onPress={() => onCancelOrder(o.id)} activeOpacity={0.8}>
              <Text style={S.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        ))}
      </>}

      <SectionHeader label="TRANSACTION HISTORY" />
      {portfolio.transactions.length === 0
        ? <Text style={S.emptyNote}>No transactions yet.</Text>
        : portfolio.transactions.map((tx) => {
            const credit = tx.side === 'sell' || tx.side === 'cover';
            return (
              <View key={tx.id} style={S.txCard}>
                <View style={S.txSide}>
                  <Text style={S.txSideText}>{tx.side.toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={S.txSymbol}>{tx.symbol}</Text>
                  <Text style={S.txDetail}>{fmtQty(tx.qty)} @ {fmt.format(tx.price)}  ·  {timeFmt(tx.executedAt)}</Text>
                </View>
                <Text style={[S.txTotal, { color: credit ? colors.positive : colors.negative }]}>
                  {credit ? '+' : '-'}{fmt.format(tx.total)}
                </Text>
              </View>
            );
          })
      }
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Order Ticket Modal ───────────────────────────────────────────────────────

function OrderTicketModal({ asset, portfolio, lessonProgress, onClose, onExecute }: {
  asset: MarketAsset; portfolio: Portfolio; lessonProgress: LessonProgress;
  onClose: () => void;
  onExecute: (a: MarketAsset, side: 'buy'|'sell'|'short'|'cover', qty: number, ok: 'market'|'limit', limitPrice?: number) => void;
}) {
  type Side = 'buy' | 'sell' | 'short' | 'cover';
  const [side, setSide]           = useState<Side>('buy');
  const [orderKind, setOrderKind] = useState<'market'|'limit'>('market');
  const [dollarInput, setDollarInput] = useState('');
  const [limitInput,  setLimitInput]  = useState('');

  const shortOk  = isShortingUnlocked(lessonProgress);
  const price    = asset.price;
  const dollars  = parseFloat(dollarInput) || 0;
  const qty      = dollars > 0 && price > 0 ? dollars / price : 0;
  const limitPrice = parseFloat(limitInput) || price;
  const execPrice  = orderKind === 'limit' ? limitPrice : price;
  const cost       = qty * execPrice;

  const holding   = portfolio.holdings.find((h) => h.symbol === asset.symbol &&
    (side === 'sell' ? h.side === 'long' : h.side === 'short'));
  const maxSell   = holding?.qty ?? 0;
  const maxDollars = maxSell * price;

  function canSubmit() {
    if (qty <= 0) return false;
    if (side === 'buy')   return cost <= portfolio.cash;
    if (side === 'sell')  return qty <= maxSell + 0.000001;
    if (side === 'short') return portfolio.cash >= cost * 0.5;
    return qty <= maxSell + 0.000001 && cost <= portfolio.cash;
  }

  const preview = () => {
    if (side === 'buy')   return `Buy ${fmtQty(qty)} shares for ${fmt.format(cost)}`;
    if (side === 'sell')  return `Sell ${fmtQty(qty)} shares for ${fmt.format(cost)}`;
    if (side === 'short') return `Short ${fmtQty(qty)} shares at ${fmt.format(execPrice)}`;
    return `Cover ${fmtQty(qty)} shares for ${fmt.format(cost)}`;
  };
  const cashAfter = () => {
    if (side === 'buy' || side === 'cover')  return portfolio.cash - cost;
    return portfolio.cash + cost;
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={S.modalOverlay}>
        <View style={S.modalSheet}>
          {/* Header — yellow search-panel treatment */}
          <View style={S.ticketHeader}>
            <View>
              <Text style={S.ticketEyebrow}>TRADE</Text>
              <Text style={S.ticketName}>{asset.label}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={S.ticketPrice}>{fmt.format(price)}</Text>
              <DelayLabel asset={asset} />
            </View>
          </View>

          {/* Side tabs */}
          <View style={S.sideTabs}>
            {(['buy', 'sell', 'short', 'cover'] as Side[]).map((t) => {
              const locked = (t === 'short' || t === 'cover') && !shortOk;
              return (
                <TouchableOpacity key={t}
                  style={[S.sideTab, side === t && S.sideTabActive, locked && { opacity: 0.38 }]}
                  onPress={locked ? undefined : () => setSide(t)}
                  activeOpacity={locked ? 1 : 0.8}
                >
                  <Text style={[S.sideTabText, side === t && S.sideTabTextActive]}>
                    {t.toUpperCase()}{locked ? ' 🔒' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {side === 'short' && (
            <View style={S.warningBox}>
              <Text style={S.warningText}>Short selling carries unlimited downside risk. Losses grow if the price rises.</Text>
            </View>
          )}

          {(side === 'sell' || side === 'cover') && (
            <View style={S.maxRow}>
              <Text style={S.maxText}>Max: {fmtQty(maxSell)} shares ({fmt.format(maxDollars)})</Text>
              <TouchableOpacity onPress={() => setDollarInput(maxDollars.toFixed(2))}>
                <Text style={S.maxAllText}>SELL ALL</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Order type */}
          <View style={S.orderTypeRow}>
            {(['market', 'limit'] as const).map((ok) => (
              <TouchableOpacity key={ok}
                style={[S.orderTypeBtn, orderKind === ok && S.orderTypeBtnActive]}
                onPress={() => setOrderKind(ok)}>
                <Text style={[S.orderTypeBtnText, orderKind === ok && S.orderTypeBtnTextActive]}>
                  {ok === 'market' ? 'MARKET' : 'LIMIT'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {orderKind === 'limit' && (
            <View style={S.inputGroup}>
              <Text style={S.inputLabel}>LIMIT PRICE ($)</Text>
              <TextInput style={S.amountInput} value={limitInput} onChangeText={setLimitInput}
                keyboardType="decimal-pad" placeholder={price.toFixed(2)} placeholderTextColor={colors.muted} />
            </View>
          )}

          <View style={S.inputGroup}>
            <Text style={S.inputLabel}>DOLLAR AMOUNT {qty > 0 ? `· ≈ ${fmtQty(qty)} SHARES` : ''}</Text>
            <TextInput style={S.amountInput} value={dollarInput} onChangeText={setDollarInput}
              keyboardType="decimal-pad" placeholder="$0.00" placeholderTextColor={colors.muted} />
          </View>

          {qty > 0 && (
            <View style={S.previewBox}>
              <Text style={S.previewLine}>{preview()}</Text>
              <Text style={S.previewLine}>Cash after: {fmt.format(cashAfter())}</Text>
              {orderKind === 'limit' && (
                <Text style={S.previewNote}>
                  Executes when price {side === 'buy' || side === 'cover' ? '≤' : '≥'} {fmt.format(limitPrice)}
                </Text>
              )}
            </View>
          )}

          <View style={S.ticketActions}>
            <TouchableOpacity style={S.cancelAction} onPress={onClose} activeOpacity={0.8}>
              <Text style={S.cancelActionText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.confirmAction, !canSubmit() && S.confirmActionDisabled]}
              onPress={() => canSubmit() && onExecute(asset, side, qty, orderKind, orderKind === 'limit' ? limitPrice : undefined)}
              disabled={!canSubmit()} activeOpacity={0.85}>
              <Text style={S.confirmActionText}>
                {orderKind === 'limit' ? 'PLACE LIMIT ORDER' : 'CONFIRM ORDER'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={S.ticketDisclaimer}>
            Virtual money only — for learning. Prices {asset.kind !== 'crypto' ? '~15 min delayed' : 'near real-time'}. Not financial advice.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return <Text style={S.sectionHeader}>{label}</Text>;
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={S.statCell}>
      <Text style={S.statLabel}>{label}</Text>
      <Text style={S.statValue}>{value}</Text>
    </View>
  );
}

/** Single asset row — sits inside a listPanel container */
function AssetRow({ asset, last, onTap }: { asset: MarketAsset; last: boolean; onTap: () => void }) {
  const isUp = (asset.changePercent ?? 0) >= 0;
  return (
    <TouchableOpacity style={[S.assetRow, !last && S.assetRowBorder]} onPress={onTap} activeOpacity={0.75}>
      <View style={S.assetBadge}><Text style={S.assetBadgeText}>{asset.symbol.slice(0, 4)}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={S.assetName}>{asset.label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={S.assetSymbol}>{asset.symbol}</Text>
          <DelayLabel asset={asset} />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={S.assetPrice}>{fmt.format(asset.price)}</Text>
        <Text style={[S.assetChange, { color: isUp ? colors.positive : colors.negative }]}>
          {fmtPct(asset.changePercent)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },

  // ── Top navigation ──
  topNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 2, borderBottomColor: colors.black,
    backgroundColor: colors.white, gap: 10,
  },
  tabRow:         { flexDirection: 'row', gap: 6, flex: 1 },
  tab:            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 2, borderColor: colors.black },
  tabActive:      { backgroundColor: colors.black },
  tabText:        { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.black, letterSpacing: 0.3 },
  tabTextActive:  { color: colors.yellow },
  backBtn:        { paddingVertical: 6, paddingRight: 12 },
  backBtnText:    { fontFamily: 'BebasNeue_400Regular', fontSize: 16, color: colors.black },
  cashPill: {
    backgroundColor: colors.black, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center',
  },
  cashLabel: { fontFamily: 'BebasNeue_400Regular', fontSize: 10, color: colors.yellow, letterSpacing: 1 },
  cashValue: { fontFamily: 'BebasNeue_400Regular', fontSize: 15, color: colors.yellow },

  // ── Screen padding ──
  screenPad: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },

  // ── Section header ──
  sectionHeader: {
    fontFamily: 'BebasNeue_400Regular', fontSize: 19, color: colors.black,
    marginTop: 24, marginBottom: 10,
  },

  // ── Delay labels (quiet, muted — green/red reserved for price moves only) ──
  delayLive:    { fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.muted },
  delayDelayed: { fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.muted },
  delayDemo:    { fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.muted },

  // ── Ticker badge (dark circle, gold text — uniform for all assets) ──
  assetBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center',
  },
  assetBadgeText: { fontFamily: 'BebasNeue_400Regular', fontSize: 15, color: colors.yellow },

  // ── Asset kind tag (dark pill, gold Bebas text) ──
  kindTag:     { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: colors.black, borderRadius: 4, minWidth: 44, alignItems: 'center' },
  kindTagText: { fontFamily: 'BebasNeue_400Regular', fontSize: 12, color: colors.yellow },

  // ── Search panel (yellow box matching original) ──
  searchPanel: {
    marginBottom: 4,
    backgroundColor: colors.yellow,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  searchEyebrow: { fontFamily: 'BebasNeue_400Regular', fontSize: 19, color: colors.black, marginBottom: 10 },
  searchBar: { flexDirection: 'row', gap: 8 },
  searchInput: {
    flex: 1, height: 52, backgroundColor: colors.white,
    borderRadius: 8, paddingHorizontal: 16,
    color: colors.black, fontFamily: 'BebasNeue_400Regular', fontSize: 20,
    borderWidth: 2, borderColor: colors.black,
  },
  searchBtn:    { width: 64, height: 52, backgroundColor: colors.black, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  searchBtnText:{ fontFamily: 'BebasNeue_400Regular', fontSize: 22, color: colors.yellow },

  // ── Search results (white bordered container) ──
  resultsList: {
    marginTop: 14, backgroundColor: colors.white,
    borderRadius: 8, borderWidth: 2, borderColor: colors.black, overflow: 'hidden',
  },
  resultRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(16,36,29,0.1)' },
  resultName:   { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15, color: colors.black },
  resultSymbol: { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.black, opacity: 0.6, marginTop: 1 },
  lockedCaption:{ fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.muted },

  // ── Asset list panel (bordered container) ──
  listPanel: {
    borderWidth: 2, borderColor: colors.black, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12,
  },
  assetRow:       { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  assetRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(16,36,29,0.12)' },
  assetName:      { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15, color: colors.black },
  assetSymbol:    { fontFamily: 'BebasNeue_400Regular', fontSize: 12, color: colors.black, opacity: 0.68 },
  assetPrice:     { fontSize: 15, fontWeight: '900', color: colors.black },
  assetChange:    { fontSize: 12, fontWeight: '900', marginTop: 1 },

  // ── News ──
  newsList: { gap: 12 },
  newsCard: {
    backgroundColor: colors.white, borderRadius: 12, padding: 16,
    borderWidth: 2, borderColor: colors.black,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 2,
  },
  newsTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, color: colors.black, lineHeight: 24, includeFontPadding: false },
  newsDate:  { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.black, opacity: 0.7, marginTop: 8 },

  // ── Asset detail ──
  detailHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 },
  detailTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  detailSymbol: { fontFamily: 'BebasNeue_400Regular', fontSize: 24, color: colors.black },
  detailLabel:  { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 14, color: colors.muted, marginTop: 3 },
  detailPrice:  { fontFamily: 'BebasNeue_400Regular', fontSize: 28, color: colors.black },
  detailChange: { fontSize: 13, fontWeight: '700', textAlign: 'right', marginTop: 2 },

  // ── Chart card ──
  chartCard: {
    borderWidth: 2, borderColor: colors.black, borderRadius: 8,
    padding: 14, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 4,
  },
  chartCardEyebrow: { fontFamily: 'BebasNeue_400Regular', fontSize: 15, color: colors.black, opacity: 0.68, marginBottom: 10 },
  rangeRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  rangeBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 2, borderColor: colors.black },
  rangeBtnActive: { backgroundColor: colors.black },
  rangeBtnText: { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.black },
  rangeBtnTextActive: { color: colors.yellow },
  chartPlaceholder: { height: 100, alignItems: 'center', justifyContent: 'center', gap: 8 },
  chartNote: { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.muted, textAlign: 'center' },

  // ── Stats grid ──
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  statCell: {
    flex: 1, minWidth: '28%', borderWidth: 2, borderColor: colors.black,
    borderRadius: 8, padding: 10, backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statLabel: { fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.black, opacity: 0.6, marginBottom: 3 },
  statValue: { fontFamily: 'BebasNeue_400Regular', fontSize: 16, color: colors.black },

  // ── Trade button (same as yellowButton in app) ──
  tradeBtn: {
    marginTop: 18, height: 48, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.black, borderRadius: 24,
  },
  tradeBtnText: { fontFamily: 'BebasNeue_400Regular', fontSize: 21, color: colors.yellow },

  // ── Lock banner (featurePanel / dark card) ──
  lockBanner: { marginTop: 18, backgroundColor: colors.black, padding: 18, borderRadius: 8 },
  lockEyebrow: { fontFamily: 'BebasNeue_400Regular', fontSize: 19, color: colors.yellow },
  lockBody:    { marginTop: 8, color: colors.white, fontSize: 14, lineHeight: 21 },

  // ── Portfolio ──
  portfolioHero: {
    marginBottom: 4, backgroundColor: colors.black,
    padding: 18, borderRadius: 8,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 14, elevation: 4,
  },
  heroEyebrow: { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.yellow, letterSpacing: 1 },
  heroValue:   { fontFamily: 'BebasNeue_400Regular', fontSize: 44, color: colors.yellow, marginTop: 4 },
  heroReturn:  { fontFamily: 'BebasNeue_400Regular', fontSize: 18, marginTop: 6 },

  holdingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, padding: 14, borderRadius: 8,
    borderWidth: 2, borderColor: colors.black, marginBottom: 10,
  },
  holdingSymbol: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: colors.black },
  holdingDetail: { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.black, opacity: 0.6, marginTop: 1 },
  holdingValue:  { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: colors.black },
  holdingPnl:    { fontFamily: 'BebasNeue_400Regular', fontSize: 14, marginTop: 1 },

  shortTag:     { backgroundColor: colors.negative, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  shortTagText: { fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.white },

  resetBtn:     { marginTop: 20, borderWidth: 2, borderColor: colors.black, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  resetBtnText: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: colors.black },

  // ── History ──
  orderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.white, borderWidth: 2, borderColor: colors.black,
    borderRadius: 8, padding: 12, marginBottom: 10,
  },
  orderSymbol: { fontFamily: 'BebasNeue_400Regular', fontSize: 15, color: colors.black },
  orderDetail: { fontFamily: 'BebasNeue_400Regular', fontSize: 12, color: colors.black, opacity: 0.6, marginTop: 1 },
  cancelBtn:     { backgroundColor: colors.black, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  cancelBtnText: { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.yellow },

  txCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.white, borderWidth: 2, borderColor: colors.black,
    borderRadius: 8, padding: 12, marginBottom: 10,
  },
  txSide:    { width: 44, height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black },
  txSideText:{ fontFamily: 'BebasNeue_400Regular', fontSize: 11, color: colors.yellow },
  txSymbol:  { fontFamily: 'BebasNeue_400Regular', fontSize: 16, color: colors.black },
  txDetail:  { fontFamily: 'BebasNeue_400Regular', fontSize: 12, color: colors.black, opacity: 0.6, marginTop: 1 },
  txTotal:   { fontFamily: 'BebasNeue_400Regular', fontSize: 15 },

  // ── Order Ticket Modal ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(16,36,29,0.55)', justifyContent: 'flex-end' },
  modalSheet:   { backgroundColor: colors.white, borderTopLeftRadius: 14, borderTopRightRadius: 14, padding: 20, paddingBottom: 32 },

  ticketHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    backgroundColor: colors.yellow, margin: -20, marginBottom: 16,
    padding: 16, borderTopLeftRadius: 14, borderTopRightRadius: 14,
  },
  ticketEyebrow: { fontFamily: 'BebasNeue_400Regular', fontSize: 15, color: colors.black, opacity: 0.7 },
  ticketName:    { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.black, marginTop: 2 },
  ticketPrice:   { fontFamily: 'BebasNeue_400Regular', fontSize: 22, color: colors.black },

  sideTabs: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  sideTab:        { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 2, borderColor: colors.black, alignItems: 'center' },
  sideTabActive:  { backgroundColor: colors.black },
  sideTabText:    { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.black },
  sideTabTextActive: { color: colors.yellow },

  warningBox: {
    backgroundColor: colors.yellow, borderRadius: 8, padding: 10, marginBottom: 10,
    borderWidth: 2, borderColor: colors.black,
  },
  warningText: { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.black, lineHeight: 19 },

  maxRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  maxText:   { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.muted },
  maxAllText:{ fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.black, fontWeight: '800' },

  orderTypeRow:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  orderTypeBtn:       { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 2, borderColor: colors.black, alignItems: 'center' },
  orderTypeBtnActive: { backgroundColor: colors.black },
  orderTypeBtnText:   { fontFamily: 'BebasNeue_400Regular', fontSize: 14, color: colors.black },
  orderTypeBtnTextActive: { color: colors.yellow },

  inputGroup:  { marginBottom: 12 },
  inputLabel:  { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.black, opacity: 0.68, marginBottom: 5 },
  amountInput: {
    borderWidth: 2, borderColor: colors.black, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'BebasNeue_400Regular', fontSize: 22, color: colors.black,
    backgroundColor: colors.white,
  },

  previewBox:  {
    borderWidth: 2, borderColor: colors.black, borderRadius: 8,
    padding: 12, marginBottom: 12, gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  previewLine: { fontFamily: 'BebasNeue_400Regular', fontSize: 15, color: colors.black },
  previewNote: { fontFamily: 'BebasNeue_400Regular', fontSize: 13, color: colors.muted, marginTop: 2 },

  ticketActions: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 10 },
  cancelAction:  { flex: 1, paddingVertical: 14, borderRadius: 24, borderWidth: 2, borderColor: colors.black, alignItems: 'center' },
  cancelActionText: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: colors.black },
  confirmAction: { flex: 2, paddingVertical: 14, borderRadius: 24, backgroundColor: colors.black, alignItems: 'center' },
  confirmActionDisabled: { opacity: 0.3 },
  confirmActionText: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: colors.yellow, letterSpacing: 0.5 },

  ticketDisclaimer: { fontFamily: 'BebasNeue_400Regular', fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 17 },

  emptyNote: { fontFamily: 'BebasNeue_400Regular', fontSize: 16, color: colors.muted, textAlign: 'center', marginVertical: 20 },
});
