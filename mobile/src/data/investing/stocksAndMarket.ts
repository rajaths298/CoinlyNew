/**
 * Unit 2 — Stocks & the Market
 * Lesson IDs: inv2-l1 … inv2-l5 + inv2-practice
 */
import type { Lesson } from '../../types/lesson';
import type { Exercise, GuidebookEntry, PathUnit } from '../../types/learn';

function makeLesson(id: string, title: string, exercises: Exercise[], xp: number): Lesson {
  return {
    id, title,
    domain: 'stocks', level: 'beginner',
    unitId: 'unit-stocks-7', unitTitle: 'Stocks & the Market',
    courseTrackId: 'stocks', moduleId: 'stocks-foundations',
    durationMinutes: Math.max(4, Math.round(exercises.length * 1.3)),
    xp, prerequisites: [], difficulty: 1, learningObjectives: [`Understand and apply: ${title}.`],
    competencyIds: ['portfolioConstruction', 'riskReturn'],
    competencyTags: ['stocks'],
    masteryWeight: 1, formulaRefs: [], misconceptions: [], steps: [], exercises,
  };
}

const ZIG: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center',
];

// ─── Lesson 1: What Is a Stock? ───────────────────────────────────────────────

const l1Exercises: Exercise[] = [
  {
    id: 'inv2-l1-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Stocks represent real partial ownership — not just a price on a screen.',
    prompt: 'If a company has 1,000,000 shares outstanding and you own 1,000 shares, what does that actually mean in practical terms?',
    conceptReveal: 'You own 0.1% of the company. You have a proportional claim on its assets and earnings. If it pays dividends, you receive 0.1% of the total payout. If it\'s acquired, you receive 0.1% of the sale price. Stocks are ownership stakes, not lottery tickets.',
    checkpoints: [
      'Shares represent fractional ownership of a real business',
      'Shareholders have claims on earnings (dividends) and assets (in liquidation)',
      'Share price × shares outstanding = market capitalisation — the market\'s valuation of the whole company',
    ],
  },
  {
    id: 'inv2-l1-e2',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'These four terms form the vocabulary every stock investor needs before reading any financial news.',
    instruction: 'Match each stock concept to its definition.',
    pairs: [
      { id: 'share', term: 'Share', definition: 'A single unit of fractional ownership in a company' },
      { id: 'div', term: 'Dividend', definition: 'A portion of company profits paid to shareholders' },
      { id: 'mktcap', term: 'Market capitalisation', definition: 'Share price × total shares outstanding' },
      { id: 'ipo', term: 'IPO', definition: 'Initial Public Offering — when a company first sells shares to the public' },
    ],
  },
  {
    id: 'inv2-l1-e3',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Market cap = price × shares. $150 × 2,000,000 = $300,000,000. Knowing this prevents confusing a high share price with a large company (or vice versa).',
    prompt: 'A company has 2,000,000 shares outstanding, each trading at $150. What is its market capitalisation?',
    options: [
      { id: 'a', text: '$150 million', isCorrect: false },
      { id: 'b', text: '$300 million', isCorrect: true },
      { id: 'c', text: '$2 million', isCorrect: false },
      { id: 'd', text: '$300,000', isCorrect: false },
    ],
  },
  {
    id: 'inv2-l1-e4',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Growth stocks reinvest profits; dividend stocks return them. Both are valid strategies for different goals.',
    instruction: 'Sort each characteristic into Growth Stock or Dividend Stock.',
    buckets: [
      { id: 'growth', label: 'Growth stock' },
      { id: 'div', label: 'Dividend stock' },
    ],
    items: [
      { id: 'reinvest', text: 'Reinvests profits to expand the business', bucketId: 'growth' },
      { id: 'payout', text: 'Pays regular cash distributions to shareholders', bucketId: 'div' },
      { id: 'volatile', text: 'Often more volatile; higher upside potential', bucketId: 'growth' },
      { id: 'income', text: 'Attractive for investors seeking steady income', bucketId: 'div' },
      { id: 'noDiv', text: 'Typically pays little or no dividend', bucketId: 'growth' },
      { id: 'mature', text: 'Usually a mature company with stable cash flows', bucketId: 'div' },
    ],
  },
  {
    id: 'inv2-l1-e5',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Shareholders do not guarantee a return — dividends can be cut and share prices can fall. Ownership means sharing both the upside AND the downside.',
    statement: 'As a shareholder, you are guaranteed to receive dividends every quarter.',
    isTrue: false,
  },
  {
    id: 'inv2-l1-e6',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'The two ways stocks return money to investors — capital gains and dividends — are both important to understand.',
    template: 'Stocks can generate returns two ways: through ___ gains (price rising) and through ___ (cash paid from profits).',
    blanks: ['capital', 'dividends'],
    wordBank: ['capital', 'interest', 'dividends', 'coupons', 'income', 'nominal'],
  },
];

// ─── Lesson 2: How the Market Works ──────────────────────────────────────────

const l2Exercises: Exercise[] = [
  {
    id: 'inv2-l2-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Understanding price formation prevents mystifying the market — prices are simply supply and demand in action.',
    prompt: 'A company reports record profits. Why might its stock price still fall on the day of the announcement?',
    conceptReveal: 'If investors already expected those profits (or better), the news is "priced in." Stock prices reflect expectations about the future, not just current performance. If results match expectations, the price barely moves. If they beat expectations, it rises. If they disappoint — even while being profitable — it falls.',
    checkpoints: [
      'Stock prices reflect future expectations, not just current results',
      '"Buy the rumour, sell the news" — prices often move before announcements',
      'Earnings surprises (beats or misses vs. expectations) drive price moves, not absolute numbers',
    ],
  },
  {
    id: 'inv2-l2-e2',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Exchanges are organised marketplaces that match buyers with sellers and provide transparency, regulation, and liquidity.',
    prompt: 'What is the primary role of a stock exchange (e.g. NYSE, NASDAQ)?',
    options: [
      { id: 'a', text: 'To set fair prices for all stocks', isCorrect: false },
      { id: 'b', text: 'To provide a regulated marketplace matching buyers and sellers', isCorrect: true },
      { id: 'c', text: 'To guarantee investors never lose money', isCorrect: false },
      { id: 'd', text: 'To lend money to companies that need capital', isCorrect: false },
    ],
  },
  {
    id: 'inv2-l2-e3',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'Primary vs. secondary market and bull vs. bear are foundational market vocabulary.',
    instruction: 'Match each market term to its definition.',
    pairs: [
      { id: 'primary', term: 'Primary market', definition: 'Where companies first issue new shares (e.g. via an IPO)' },
      { id: 'secondary', term: 'Secondary market', definition: 'Where existing shares are traded between investors' },
      { id: 'bull', term: 'Bull market', definition: 'A sustained period of rising prices (up 20%+ from a low)' },
      { id: 'bear', term: 'Bear market', definition: 'A sustained decline of 20% or more from a recent high' },
    ],
  },
  {
    id: 'inv2-l2-e4',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Following the sequence of a trade from order to settlement shows how professional markets operate beneath the surface.',
    instruction: 'Order the steps of a stock trade from start to finish.',
    items: [
      { id: 's1', text: 'Investor places a buy order via their broker', rank: 1 },
      { id: 's2', text: 'Broker routes the order to the stock exchange', rank: 2 },
      { id: 's3', text: 'Exchange matches the buy order with a sell order', rank: 3 },
      { id: 's4', text: 'Trade executes at the agreed price', rank: 4 },
      { id: 's5', text: 'Settlement occurs — shares and cash officially change hands (T+2)', rank: 5 },
    ],
  },
  {
    id: 'inv2-l2-e5',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'When you buy shares on the secondary market, the money goes to the seller — the original company received its capital at the IPO, not in subsequent trades.',
    statement: 'When you buy shares of Apple on the stock market today, the money goes directly to Apple Inc.',
    isTrue: false,
  },
  {
    id: 'inv2-l2-e6',
    kind: 'scenarioDecision',
    competencyId: 'behavior',
    rationale: 'A market index measures the overall health of the market — not every stock in it. An individual stock can crash while the index rises.',
    story: 'The S&P 500 index is up 12% this year, but Riley\'s single stock holding is down 35%. Riley says: "The market is up, so my stock must recover soon." Is Riley\'s reasoning sound?',
    choices: [
      { id: 'a', text: 'No — an index rising does not mean every stock in it rises', outcome: 'Correct. The S&P 500 is an average of 500 companies. A single stock can dramatically underperform or go to zero regardless of what the index does.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Yes — if the market is up, all stocks should follow eventually', outcome: 'Many individual stocks underperform the index permanently. Some go bankrupt while the index climbs. Index performance and individual stock performance are not directly linked.', isCorrect: false, score: 0 },
    ],
  },
];

// ─── Lesson 3: Reading a Stock Quote ─────────────────────────────────────────

const l3Exercises: Exercise[] = [
  {
    id: 'inv2-l3-e1',
    kind: 'recallPrompt',
    competencyId: 'financialAnalysis',
    rationale: 'A stock quote contains several distinct data points — being able to read them quickly is a core investor skill.',
    prompt: 'Look at this quote: AAPL — $198.50 / +1.23 (+0.62%) / Vol: 54.2M / 52W: $164.08–$199.62. What can you tell from these numbers?',
    conceptReveal: 'Price is $198.50 — close to its 52-week high of $199.62. It\'s up $1.23 (+0.62%) today. Volume of 54.2M means heavy trading. The 52-week range ($164.08–$199.62) shows the stock has risen significantly from its yearly low. Trading near highs with high volume can signal strong momentum.',
    checkpoints: [
      'Price + % change = today\'s performance',
      '52-week range = how the current price compares to its recent history',
      'Volume = how many shares traded — high volume confirms price moves',
    ],
  },
  {
    id: 'inv2-l3-e2',
    kind: 'matchPairs',
    competencyId: 'financialAnalysis',
    rationale: 'These six quote fields appear on every trading platform — recognising them instantly removes friction from investment decisions.',
    instruction: 'Match each quote field to what it tells you.',
    pairs: [
      { id: 'pe', term: 'P/E ratio', definition: 'Price divided by earnings per share — how much you pay per dollar of profit' },
      { id: 'vol', term: 'Volume', definition: 'Number of shares traded in a session — measures liquidity and interest' },
      { id: '52w', term: '52-week range', definition: 'The highest and lowest prices over the past year' },
      { id: 'eps', term: 'EPS', definition: 'Earnings per share — company\'s profit divided by shares outstanding' },
    ],
  },
  {
    id: 'inv2-l3-e3',
    kind: 'multipleChoice',
    competencyId: 'financialAnalysis',
    rationale: 'P/E = price / EPS. $100 / $5 = P/E of 20. This means investors pay $20 for every $1 of annual earnings — a valuation metric.',
    prompt: 'A stock trades at $100. Its earnings per share (EPS) is $5. What is its Price-to-Earnings (P/E) ratio?',
    options: [
      { id: 'a', text: '5', isCorrect: false },
      { id: 'b', text: '10', isCorrect: false },
      { id: 'c', text: '20', isCorrect: true },
      { id: 'd', text: '500', isCorrect: false },
    ],
  },
  {
    id: 'inv2-l3-e4',
    kind: 'fillBlank',
    competencyId: 'financialAnalysis',
    rationale: 'The P/E ratio is the most widely cited valuation metric — a high P/E means investors expect faster growth; a low P/E may mean undervaluation or slower growth expectations.',
    template: 'A high P/E ratio means investors are paying more for each dollar of ___ — often because they expect strong future ___.',
    blanks: ['earnings', 'growth'],
    wordBank: ['earnings', 'revenue', 'growth', 'dividends', 'loss', 'assets'],
  },
  {
    id: 'inv2-l3-e5',
    kind: 'trueFalse',
    competencyId: 'financialAnalysis',
    rationale: 'Volume confirms price moves. A large price swing on very low volume may not be sustained — there is limited real buying or selling pressure behind it.',
    statement: 'High trading volume on a price increase makes the move more significant and more likely to be sustained than the same increase on very low volume.',
    isTrue: true,
  },
  {
    id: 'inv2-l3-e6',
    kind: 'categorize',
    competencyId: 'financialAnalysis',
    rationale: 'Separating price-action signals from fundamental valuation metrics helps investors distinguish what the market is doing today from what a company is actually worth.',
    instruction: 'Sort each data point: is it a price-action signal or a fundamental valuation metric?',
    buckets: [
      { id: 'price', label: 'Price-action signal' },
      { id: 'fund', label: 'Fundamental valuation metric' },
    ],
    items: [
      { id: 'pct', text: 'Daily % change (+1.5%)', bucketId: 'price' },
      { id: 'pe', text: 'P/E ratio of 28×', bucketId: 'fund' },
      { id: 'vol', text: 'Volume spike to 3× average', bucketId: 'price' },
      { id: 'eps', text: 'EPS of $4.50 (up 15% year-on-year)', bucketId: 'fund' },
      { id: '52h', text: 'Trading at 52-week high', bucketId: 'price' },
      { id: 'pb', text: 'Price-to-book ratio of 2.1×', bucketId: 'fund' },
    ],
  },
];

// ─── Mixed Practice ───────────────────────────────────────────────────────────

const practiceExercises: Exercise[] = [
  l1Exercises[2]!, // MC: market cap calculation
  l2Exercises[4]!, // T/F: buying shares gives money to the company
  l3Exercises[2]!, // MC: P/E calculation
  {
    id: 'inv2-practice-recap',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Linking stock ownership, market mechanics, and reading a quote creates the mental model needed for any trading decision.',
    prompt: 'You\'re about to buy your first individual stock. Walk through what you\'d check on the quote page and why.',
    conceptReveal: 'Check: (1) Current price vs 52-week range — is it near a high or a low, and why? (2) P/E ratio — how does it compare to industry peers? (3) Volume — is there real trading activity behind the price? (4) EPS trend — are earnings growing? A stock is a business stake; the quote page is the business\'s health summary.',
    checkpoints: [
      '52-week range gives context — "cheap" only means something relative to history and peers',
      'P/E compares similar companies — a 50× P/E needs a strong growth justification',
      'Volume confirms the legitimacy of price moves',
    ],
  },
];

// ─── Lesson 4: Don't Put All Your Eggs in One Basket ─────────────────────────

const l4Exercises: Exercise[] = [
  {
    id: 'inv2-l4-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Diversification is the only "free lunch" in investing — it reduces risk without proportionally reducing expected return.',
    prompt: 'If you own stock in only one company and it goes bankrupt, you lose everything. If you own 500 companies equally and one goes bankrupt, what happens?',
    conceptReveal: 'You lose 1/500th = 0.2% of your portfolio. Diversification converts catastrophic company-specific risk into a manageable small loss. The broader principle: spreading investments across uncorrelated assets reduces the variance of your total return without reducing its expected value.',
    checkpoints: [
      'Company-specific (unsystematic) risk nearly vanishes with diversification across 20-30 uncorrelated stocks',
      'Market-wide (systematic) risk cannot be diversified away — only managed via asset class mix',
      'Diversification is the only strategy that reduces risk without equally cutting expected return',
    ],
  },
  {
    id: 'inv2-l4-e2',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Correlation is the key concept: assets that move independently provide better diversification than assets that move together.',
    prompt: 'Which pair of assets provides BETTER diversification when held together?',
    options: [
      { id: 'a', text: 'Two tech stocks that both track the NASDAQ index', isCorrect: false },
      { id: 'b', text: 'A stock index fund and a government bond fund', isCorrect: true },
      { id: 'c', text: 'Apple stock and Microsoft stock (both in tech)', isCorrect: false },
      { id: 'd', text: 'Two oil companies in the same market', isCorrect: false },
    ],
  },
  {
    id: 'inv2-l4-e3',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Diversification eliminates unsystematic risk but NOT systematic (market) risk. In a broad crash, even diversified portfolios fall — just less than concentrated ones.',
    statement: 'A fully diversified portfolio will not fall during a broad market crash.',
    isTrue: false,
  },
  {
    id: 'inv2-l4-e4',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'Unsystematic vs. systematic risk is the key distinction between what diversification can and cannot do.',
    template: 'Diversification eliminates ___ risk (company-specific) but cannot eliminate ___ risk (market-wide downturns).',
    blanks: ['unsystematic', 'systematic'],
    wordBank: ['unsystematic', 'systematic', 'credit', 'liquidity', 'random', 'total'],
  },
  {
    id: 'inv2-l4-e5',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'Concentration in a single sector multiplies sector-specific risk. Taylor\'s portfolio looks diversified by stock count but all five are tech — it\'s effectively one bet.',
    story: 'Taylor has $10,000 invested: $2,000 each in Apple, Google, Amazon, Microsoft, and Meta. Is Taylor well-diversified?',
    choices: [
      { id: 'a', text: 'No — all five are US mega-cap tech; they\'re highly correlated', outcome: 'Correct. When tech sells off (as in 2022, when the sector fell 40%+), all five fall together. True diversification requires different sectors, geographies, and asset classes.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Yes — five different companies is good diversification', outcome: 'Five companies sounds diversified but correlation is what matters, not count. These five move almost in lockstep. A tech sector fund would provide the same diversification with lower fees.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Partially — better than one stock, but not as good as an index fund', outcome: 'Better than one stock, but the sector concentration is a real problem. An S&P 500 index fund holds 500 companies across 11 sectors — far superior diversification.', isCorrect: false, score: 1 },
    ],
  },
  {
    id: 'inv2-l4-e6',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Knowing which risks can be diversified away vs. which cannot shapes how much diversification is worth pursuing.',
    instruction: 'Sort each risk: can it be reduced by diversification, or not?',
    buckets: [
      { id: 'can', label: 'Reduced by diversification' },
      { id: 'cannot', label: 'Cannot be diversified away' },
    ],
    items: [
      { id: 'ceo', text: 'A company\'s CEO resigns unexpectedly', bucketId: 'can' },
      { id: 'recession', text: 'Global recession depresses all equity markets', bucketId: 'cannot' },
      { id: 'fraud', text: 'One company commits accounting fraud', bucketId: 'can' },
      { id: 'rates', text: 'Central bank raises interest rates sharply', bucketId: 'cannot' },
      { id: 'recall', text: 'A product recall hurts a single company\'s earnings', bucketId: 'can' },
      { id: 'inflation', text: 'Inflation spikes, reducing real returns across markets', bucketId: 'cannot' },
    ],
  },
];

// ─── Lesson 5: Build a Mini Portfolio (scenario capstone) ────────────────────

const l5Exercises: Exercise[] = [
  {
    id: 'inv2-l5-e1',
    kind: 'miniStory',
    competencyId: 'portfolioConstruction',
    rationale: 'Applying the unit\'s concepts to a realistic portfolio construction scenario reinforces the full picture.',
    panels: [
      { text: 'Priya, 30, has $5,000 to invest for the first time. She\'s read about stocks and wants to "pick the best ones." She\'s narrowed it to: Tesla, a NASDAQ-100 ETF, or 20 individual tech stocks she researched for a month.', speaker: 'Narrator' },
      { text: 'Her friend says: "Just buy the S&P 500 index fund — it beats 90% of active managers." Her brother says: "Tesla is going to the moon."', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Priya do with her $5,000?',
    choices: [
      { id: 'a', text: 'Buy the S&P 500 index fund — broad diversification, low fees, proven track record', outcome: 'Best choice for a first-time investor. Instant exposure to 500 companies across all sectors, expense ratios under 0.1%, and historically outperforms most active stock-pickers over 10+ years.', isCorrect: true },
      { id: 'b', text: 'Research more individual stocks — knowledge equals edge', outcome: 'Even professional fund managers with full-time research teams fail to beat the index consistently. Research effort rarely compensates for the added concentration risk of picking individual stocks.', isCorrect: false },
    ],
  },
  {
    id: 'inv2-l5-e2',
    kind: 'calculator',
    competencyId: 'portfolioConstruction',
    rationale: 'Comparing a diversified $5,000 index investment against a single-stock bet shows the power of staying diversified through volatility.',
    formulaKey: 'portfolioReturn',
    prompt: 'Model Priya\'s $5,000 in an S&P 500 index fund at a 9% average annual return over 20 years.',
    targetLabel: 'Portfolio value',
    explanation: 'Future Value = Principal × (1 + rate)^years. The S&P 500 has averaged ~10% annually (pre-inflation) over the past 30 years. Lower the rate to see how fees or underperformance compound against you.',
    inputs: [
      { id: 'principal', label: 'Initial investment', value: 5000, min: 500, max: 50000, step: 500, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 9, min: 2, max: 14, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years invested', value: 20, min: 5, max: 40, step: 1 },
    ],
  },
  {
    id: 'inv2-l5-e3',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'A structured portfolio-building process prevents emotional decisions and ensures each choice is deliberate.',
    instruction: 'Order the steps to build a well-constructed beginner stock portfolio.',
    items: [
      { id: 's1', text: 'Define your goal (retirement, house deposit, 10 years)', rank: 1 },
      { id: 's2', text: 'Decide on a stock/bond split based on your time horizon', rank: 2 },
      { id: 's3', text: 'Choose low-cost index funds for broad exposure', rank: 3 },
      { id: 's4', text: 'Set up automatic monthly contributions', rank: 4 },
      { id: 's5', text: 'Review and rebalance once per year', rank: 5 },
    ],
  },
  {
    id: 'inv2-l5-e4',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Studies consistently show ~90% of active fund managers underperform their benchmark index over 15+ years, primarily due to fees and the difficulty of consistent stock selection.',
    prompt: 'Over a 15-year period, approximately what fraction of actively managed funds underperform their benchmark index?',
    options: [
      { id: 'a', text: 'About 30%', isCorrect: false },
      { id: 'b', text: 'About 50%', isCorrect: false },
      { id: 'c', text: 'About 90%', isCorrect: true },
      { id: 'd', text: 'About 10%', isCorrect: false },
    ],
  },
  {
    id: 'inv2-l5-e5',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Synthesising stock ownership, market mechanics, quote reading, and diversification into a coherent investment approach confirms mastery of the unit.',
    prompt: 'Explain in your own words why a low-cost index fund is often the best starting point for a new investor, using what you\'ve learned about stocks, the market, and diversification.',
    conceptReveal: 'An index fund is a diversified basket of stocks (e.g. all 500 in the S&P 500) that passively tracks the market. It eliminates unsystematic risk by spreading across hundreds of companies and sectors, has expense ratios under 0.1% (vs 1%+ for active funds), and historically outperforms most stock-pickers. You own real businesses, benefit from compound growth, and spend zero time researching individual stocks.',
    checkpoints: [
      'Instant diversification — 500 companies in one trade, eliminating company-specific risk',
      'Low cost — fees as low as 0.03%, vs 1%+ for active funds (fees compound against you)',
      'Beats ~90% of professional managers over 15 years — evidence, not luck',
    ],
  },
];

// ─── Guidebook ────────────────────────────────────────────────────────────────

export const stocksAndMarketGuidebook: GuidebookEntry[] = [
  {
    id: 'inv2-g1',
    title: 'What Is a Stock?',
    body: 'A share is a fractional ownership stake in a company. Market capitalisation = price × shares outstanding. Shareholders receive dividends (if paid) and capital gains if the price rises. They also bear the risk of loss.',
  },
  {
    id: 'inv2-g2',
    title: 'How Prices Form',
    body: 'Stock prices reflect supply (sellers) and demand (buyers) at any moment. Prices are driven by expectations about future earnings, not just current results. "Priced in" means the market already expected the news — so good news can cause a price drop if it was less good than expected.',
  },
  {
    id: 'inv2-g3',
    title: 'Reading a Quote',
    body: 'Key fields: price, % change (daily), volume (shares traded), 52-week range (H/L), P/E ratio (price ÷ EPS), EPS (earnings per share). P/E compares value across peers — a high P/E requires high growth to justify it.',
  },
  {
    id: 'inv2-g4',
    title: 'Diversification',
    body: 'Spreading investments across uncorrelated assets reduces unsystematic (company-specific) risk. It cannot eliminate systematic (market-wide) risk. The benefit of diversification is greatest when assets have low correlation — e.g., stocks + bonds, domestic + international.',
  },
  {
    id: 'inv2-g5',
    title: 'The Case for Index Funds',
    body: 'Index funds track a benchmark (e.g. S&P 500) at very low cost (~0.03%). Over 15 years, ~90% of actively managed funds underperform their index. For most investors, a diversified index fund is the most rational starting point.',
    formulaRef: 'portfolioReturn',
  },
];

// ─── Lessons record ───────────────────────────────────────────────────────────

export const stocksAndMarketLessons: Record<string, Lesson> = {
  'inv2-l1':       makeLesson('inv2-l1',       'What Is a Stock?',                          l1Exercises,       25),
  'inv2-l2':       makeLesson('inv2-l2',       'How the Market Works',                      l2Exercises,       25),
  'inv2-l3':       makeLesson('inv2-l3',       'Reading a Stock Quote',                     l3Exercises,       25),
  'inv2-practice': makeLesson('inv2-practice', 'Mixed Practice',                            practiceExercises, 15),
  'inv2-l4':       makeLesson('inv2-l4',       "Don't Put All Your Eggs in One Basket",     l4Exercises,       30),
  'inv2-l5':       makeLesson('inv2-l5',       'Build a Mini Portfolio',                    l5Exercises,       35),
};

// ─── PathUnit ─────────────────────────────────────────────────────────────────

export const stocksAndMarketUnit: PathUnit = {
  id: 'unit-stocks-7',
  title: 'Stocks & the Market',
  subtitle: 'Ownership, exchanges, reading a quote, and why diversification is your best edge.',
  color: '#BE4C4C',
  icon: '📉',
  trackId: 'stocks',
  competencyIds: ['portfolioConstruction', 'riskReturn', 'financialAnalysis'],
  nodes: [
    { id: 'inv2-l1-node',       type: 'lesson',   position: ZIG[0]!, lessonId: 'inv2-l1' },
    { id: 'inv2-l2-node',       type: 'lesson',   position: ZIG[1]!, lessonId: 'inv2-l2' },
    { id: 'inv2-l3-node',       type: 'lesson',   position: ZIG[2]!, lessonId: 'inv2-l3' },
    { id: 'inv2-practice-node', type: 'practice', position: ZIG[3]!, lessonId: 'inv2-practice' },
    { id: 'inv2-chest',         type: 'chest',    position: ZIG[4]!, chestReward: { brainBucks: 75, xp: 30 } },
    { id: 'inv2-l4-node',       type: 'lesson',   position: ZIG[5]!, lessonId: 'inv2-l4' },
    { id: 'inv2-l5-node',       type: 'lesson',   position: ZIG[6]!, lessonId: 'inv2-l5' },
    { id: 'inv2-trophy',        type: 'trophy',   position: ZIG[7]! },
  ],
  guidebook: stocksAndMarketGuidebook,
  masteryThreshold: 65,
};
