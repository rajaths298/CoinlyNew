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
  {
    id: 'inv2-l1-e7',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Tracing a share from a private company to your brokerage account demystifies what "owning a stock" means.',
    instruction: 'Order how a share reaches you, from start to finish.',
    items: [
      { id: 's1', text: 'A company is founded and owned privately', rank: 1 },
      { id: 's2', text: 'It sells shares to the public in an IPO', rank: 2 },
      { id: 's3', text: 'Those shares trade between investors on an exchange', rank: 3 },
      { id: 's4', text: 'You buy a share through your broker', rank: 4 },
    ],
  },
  {
    id: 'inv2-l1-e8',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'With a long horizon and no need for income, a diversified growth fund beats betting on one dividend stock for its "income."',
    story: 'Sam, 24, is investing for retirement 35 years away and needs no income now. He is choosing between a single mature high-dividend utility stock and a diversified growth-oriented index fund.',
    choices: [
      { id: 'a', text: 'The diversified growth fund — long horizon, no income need, and broad diversification', outcome: 'Correct. Growth compounds best over decades, and the fund spreads risk across hundreds of companies instead of one.', isCorrect: true, score: 3 },
      { id: 'b', text: 'The single dividend stock — dividends are guaranteed income', outcome: 'Dividends are never guaranteed — they can be cut — and a single stock carries concentrated risk Sam doesn\'t need.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Split 50/50 between the two', outcome: 'The single-stock half still adds concentrated risk and current income he doesn\'t need for 35 years.', isCorrect: false, score: 1 },
    ],
  },
  {
    id: 'inv2-l1-e9',
    kind: 'miniStory',
    competencyId: 'portfolioConstruction',
    rationale: 'Share price alone is meaningless without share count — market cap is what measures a company\'s size.',
    panels: [
      { text: 'Jordan sees Company A at $8 a share and Company B at $400 a share. "A is way cheaper — I\'ll buy it!"', speaker: 'Narrator' },
      { text: 'But Company A has 5 billion shares (a $40B market cap), while Company B has 50 million shares (a $20B market cap).', speaker: 'Narrator' },
    ],
    choicePrompt: 'What did Jordan get wrong?',
    choices: [
      { id: 'a', text: 'Share price alone says nothing about a company\'s size or value — market cap does', isCorrect: true, outcome: 'Exactly. Company A is actually twice the size of Company B despite the lower share price. Always look at market cap, not just the sticker price.' },
      { id: 'b', text: 'Nothing — a lower share price always means a cheaper company', isCorrect: false, outcome: 'Not so. A company can lower its share price simply by issuing more shares. Price per share ignores how many shares exist.' },
    ],
  },
  {
    id: 'inv2-l1-e10',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Reinvesting all profits instead of paying dividends is the hallmark of a growth company financing its own expansion.',
    prompt: 'A profitable company chooses to reinvest all of its earnings rather than pay a dividend. This is most typical of:',
    options: [
      { id: 'a', text: 'A growth company expanding the business', isCorrect: true },
      { id: 'b', text: 'A mature utility company', isCorrect: false },
      { id: 'c', text: 'A government bond issuer', isCorrect: false },
      { id: 'd', text: 'A money market fund', isCorrect: false },
    ],
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
  {
    id: 'inv2-l2-e7',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'Prices come from supply and demand, and expected news is "priced in" before it arrives.',
    template: 'Stock prices are set by ___ and demand. When good news is already expected, we say it is already ___ in.',
    blanks: ['supply', 'priced'],
    wordBank: ['supply', 'priced', 'demand', 'baked', 'factored', 'locked'],
  },
  {
    id: 'inv2-l2-e8',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Primary market = new shares issued by the company; secondary market = existing shares traded between investors.',
    instruction: 'Sort each transaction into the primary or secondary market.',
    buckets: [
      { id: 'primary', label: 'Primary market' },
      { id: 'secondary', label: 'Secondary market' },
    ],
    items: [
      { id: 'ipo', text: 'A company raises cash in its IPO', bucketId: 'primary' },
      { id: 'buy', text: 'You buy 10 shares from another investor', bucketId: 'secondary' },
      { id: 'startup', text: 'A startup issues new shares to early backers', bucketId: 'primary' },
      { id: 'day', text: 'Traders swap shares all afternoon', bucketId: 'secondary' },
      { id: 'followon', text: 'A company issues brand-new shares in a follow-on offering', bucketId: 'primary' },
      { id: 'resell', text: 'You resell shares you bought last year', bucketId: 'secondary' },
    ],
  },
  {
    id: 'inv2-l2-e9',
    kind: 'miniStory',
    competencyId: 'behavior',
    rationale: 'A bear market is a temporary decline; for a long-horizon investor it lowers the cost of future purchases rather than signalling permanent loss.',
    panels: [
      { text: 'The news says: "Stocks entered a bear market today, down 21% from the peak." Avery panics: "I should sell before it all disappears!"', speaker: 'Narrator' },
      { text: 'Avery is 28 and invests a fixed amount every month for retirement decades away.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What is the better way for Avery to think about a bear market?',
    choices: [
      { id: 'a', text: 'A bear market is a temporary decline; for a long-horizon investor it means buying at lower prices', isCorrect: true, outcome: 'Right. Markets have always recovered to new highs over long periods. Avery\'s monthly contributions now buy more shares per dollar.' },
      { id: 'b', text: 'A bear market means stocks won\'t recover, so cash out now', isCorrect: false, outcome: 'Selling locks in the loss. Historically every bear market has eventually given way to a new bull market.' },
    ],
  },
  {
    id: 'inv2-l2-e10',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'A market order during trading hours is routed to an exchange and matched with a seller at the current price.',
    prompt: 'You enter a market order to buy a stock during trading hours. What happens?',
    options: [
      { id: 'a', text: 'Your broker routes it to an exchange, where it is matched with a seller and executed at the current market price', isCorrect: true },
      { id: 'b', text: 'The company sells you brand-new shares directly', isCorrect: false },
      { id: 'c', text: 'The price is fixed at yesterday\'s closing price', isCorrect: false },
      { id: 'd', text: 'Nothing happens until the market closes for the day', isCorrect: false },
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
  {
    id: 'inv2-l3-e7',
    kind: 'tapToOrder',
    competencyId: 'financialAnalysis',
    rationale: 'A lower P/E means you pay less per dollar of earnings. Ranking them builds intuition for relative valuation.',
    instruction: 'Order these from the CHEAPEST to the most EXPENSIVE valuation by P/E.',
    items: [
      { id: 's1', text: 'P/E of 8', rank: 1 },
      { id: 's2', text: 'P/E of 15', rank: 2 },
      { id: 's3', text: 'P/E of 28', rank: 3 },
      { id: 's4', text: 'P/E of 60', rank: 4 },
    ],
  },
  {
    id: 'inv2-l3-e8',
    kind: 'scenarioDecision',
    competencyId: 'financialAnalysis',
    rationale: 'A high P/E reflects high growth expectations — it can be justified or a sign of overpricing. Context (peers and growth) decides.',
    story: 'TechCo trades at a P/E of 75 while its industry average is 22. A friend says, "High P/E means it\'s a great company — definitely buy." How should you read it?',
    choices: [
      { id: 'a', text: 'A high P/E means the market expects fast growth — compare it to peers and the actual growth rate before deciding', outcome: 'Correct. A 75 P/E only makes sense if earnings are growing fast enough to grow into it. Always judge P/E against peers and growth.', isCorrect: true, score: 3 },
      { id: 'b', text: 'A high P/E always means overpriced — never buy', outcome: 'Not always. Fast-growing companies can deserve a premium P/E. The number alone isn\'t a verdict.', isCorrect: false, score: 1 },
      { id: 'c', text: 'A high P/E guarantees high future returns', outcome: 'It guarantees nothing — a high P/E actually raises the bar the company must clear to justify its price.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv2-l3-e9',
    kind: 'miniStory',
    competencyId: 'financialAnalysis',
    rationale: 'A big price move on very low volume lacks conviction and is less likely to be sustained.',
    panels: [
      { text: 'A small stock jumps 9% on a Tuesday. Pat is excited: "It\'s breaking out!"', speaker: 'Narrator' },
      { text: 'But only 4,000 shares traded all day — about a tenth of its normal volume.', speaker: 'Narrator' },
    ],
    choicePrompt: 'Why should Pat be cautious?',
    choices: [
      { id: 'a', text: 'A big move on very low volume has little conviction behind it and may not hold', isCorrect: true, outcome: 'Right. Thin volume means a few trades moved the price. Sustained moves usually come with heavy, confirming volume.' },
      { id: 'b', text: 'Volume doesn\'t matter — the price move is all that counts', isCorrect: false, outcome: 'Volume is exactly what confirms (or undermines) a price move. Low volume makes a move easy to reverse.' },
    ],
  },
  {
    id: 'inv2-l3-e10',
    kind: 'multipleChoice',
    competencyId: 'financialAnalysis',
    rationale: 'EPS = net profit ÷ shares outstanding. $200M ÷ 50M = $4.00.',
    prompt: 'A company earns $200 million in profit and has 50 million shares outstanding. What is its earnings per share (EPS)?',
    options: [
      { id: 'a', text: '$4.00', isCorrect: true },
      { id: 'b', text: '$0.25', isCorrect: false },
      { id: 'c', text: '$250 million', isCorrect: false },
      { id: 'd', text: '$40.00', isCorrect: false },
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
  {
    id: 'inv2-pr-n1',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Market cap = price × shares. $80 × 3,000,000 = $240,000,000.',
    prompt: 'A company has 3,000,000 shares trading at $80 each. What is its market capitalisation?',
    options: [
      { id: 'a', text: '$240 million', isCorrect: true },
      { id: 'b', text: '$80 million', isCorrect: false },
      { id: 'c', text: '$24 million', isCorrect: false },
      { id: 'd', text: '$3 million', isCorrect: false },
    ],
  },
  {
    id: 'inv2-pr-n2',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'Stocks pay off two ways: capital gains and dividends.',
    template: 'Stocks can generate returns through ___ gains (the price rising) and through ___ (cash paid from profits).',
    blanks: ['capital', 'dividends'],
    wordBank: ['capital', 'dividends', 'interest', 'coupons', 'rent', 'fees'],
  },
  {
    id: 'inv2-pr-n3',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'On the secondary market your money goes to the seller, not the company. Apple was paid at its IPO.',
    statement: 'When you buy Apple shares on the stock exchange today, your money goes directly to Apple Inc.',
    isTrue: false,
  },
  {
    id: 'inv2-pr-n4',
    kind: 'categorize',
    competencyId: 'financialAnalysis',
    rationale: 'Separating short-term price signals from fundamental valuation keeps "what the price is doing" distinct from "what the business is worth."',
    instruction: 'Sort each data point into price-action signal or fundamental metric.',
    buckets: [
      { id: 'price', label: 'Price-action signal' },
      { id: 'fund', label: 'Fundamental metric' },
    ],
    items: [
      { id: 'chg', text: 'Daily % change (+2.1%)', bucketId: 'price' },
      { id: 'pe', text: 'P/E ratio of 19×', bucketId: 'fund' },
      { id: 'volspike', text: 'Volume spike to 4× average', bucketId: 'price' },
      { id: 'eps', text: 'EPS of $3.10', bucketId: 'fund' },
      { id: 'hi', text: 'Trading at a 52-week high', bucketId: 'price' },
      { id: 'margin', text: 'Profit margin of 18%', bucketId: 'fund' },
    ],
  },
  {
    id: 'inv2-pr-n5',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'A vocabulary check across the unit\'s core market concepts.',
    instruction: 'Match each term to its definition.',
    pairs: [
      { id: 'p1', term: 'Market cap', definition: 'Share price × total shares outstanding' },
      { id: 'p2', term: 'Dividend', definition: 'A share of profits paid to shareholders' },
      { id: 'p3', term: 'Bear market', definition: 'A decline of 20%+ from a recent high' },
      { id: 'p4', term: 'IPO', definition: 'A company first selling shares to the public' },
    ],
  },
  {
    id: 'inv2-pr-n6',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Reordering a trade from order to settlement reinforces how the market plumbing works.',
    instruction: 'Order the steps of a stock trade.',
    items: [
      { id: 's1', text: 'You place a buy order with your broker', rank: 1 },
      { id: 's2', text: 'The broker routes it to the exchange', rank: 2 },
      { id: 's3', text: 'The exchange matches it with a seller', rank: 3 },
      { id: 's4', text: 'The trade executes and later settles', rank: 4 },
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
  {
    id: 'inv2-l4-e7',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'These four terms are the vocabulary of diversification and the risks it can and cannot remove.',
    instruction: 'Match each term to its definition.',
    pairs: [
      { id: 'p1', term: 'Diversification', definition: 'Spreading money across assets to lower total risk' },
      { id: 'p2', term: 'Correlation', definition: 'How closely two assets move together' },
      { id: 'p3', term: 'Unsystematic risk', definition: 'Company-specific risk you can diversify away' },
      { id: 'p4', term: 'Systematic risk', definition: 'Market-wide risk you cannot diversify away' },
    ],
  },
  {
    id: 'inv2-l4-e8',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Ranking portfolios by diversification — from one stock to a global multi-asset fund — makes the concept concrete.',
    instruction: 'Order these from LEAST to MOST diversified.',
    items: [
      { id: 's1', text: 'A single company\'s stock', rank: 1 },
      { id: 's2', text: 'Five stocks, all in tech', rank: 2 },
      { id: 's3', text: 'An S&P 500 index fund', rank: 3 },
      { id: 's4', text: 'A global stock + bond fund', rank: 4 },
    ],
  },
  {
    id: 'inv2-l4-e9',
    kind: 'miniStory',
    competencyId: 'portfolioConstruction',
    rationale: 'Holding your employer\'s stock plus your salary doubles your exposure to one company — a hidden concentration risk.',
    panels: [
      { text: 'Morgan works at CarCo and has put 80% of her investments into CarCo stock. "I know this company best," she says.', speaker: 'Narrator' },
      { text: 'Then CarCo hits trouble: layoffs begin and the stock falls 50%.', speaker: 'Narrator' },
    ],
    choicePrompt: 'Why was Morgan\'s position especially risky?',
    choices: [
      { id: 'a', text: 'Her paycheck AND her savings both depended on one company — when it struggled, she was hit twice', isCorrect: true, outcome: 'Exactly. Concentrating savings in your employer doubles down on a single risk. Diversifying away from it protects you if the company stumbles.' },
      { id: 'b', text: 'It wasn\'t risky — knowing the company well removes the danger', isCorrect: false, outcome: 'Familiarity doesn\'t reduce concentration risk. Even insiders can\'t prevent a downturn, and her job already ties her to CarCo.' },
    ],
  },
  {
    id: 'inv2-l4-e10',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Diversification benefit depends on low correlation — combining assets that move differently smooths the ride.',
    prompt: 'Adding which asset to an all-US-stock portfolio would improve diversification the MOST?',
    options: [
      { id: 'a', text: 'A government bond fund', isCorrect: true },
      { id: 'b', text: 'Another US large-cap stock fund', isCorrect: false },
      { id: 'c', text: 'A US tech-sector fund', isCorrect: false },
      { id: 'd', text: 'A second S&P 500 index fund', isCorrect: false },
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
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: '$5,000 x 1.09^20 is about $28,000. Simple interest would give only about $14,000, so compounding more than doubles the difference.',
    prompt: "Priya puts $5,000 in an S&P 500 index fund averaging 9% a year for 20 years. About how much will it be worth?",
    options: [
      { id: 'a', text: 'About $28,000', isCorrect: true },
      { id: 'b', text: 'About $14,000 (simple interest, no compounding)', isCorrect: false },
      { id: 'c', text: 'About $9,500', isCorrect: false },
      { id: 'd', text: 'About $50,000', isCorrect: false },
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
  {
    id: 'inv2-l5-e6',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'A low-cost index fund holds hundreds of companies, so a single bankruptcy barely dents it — the opposite of a single-stock bet.',
    statement: 'A broad index fund can lose most of its value if one of its companies goes bankrupt.',
    isTrue: false,
  },
  {
    id: 'inv2-l5-e7',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'Index funds win on cost and breadth: low fees and instant diversification.',
    template: 'A good core holding for a beginner is a ___-cost ___ fund, which gives instant diversification across the whole market.',
    blanks: ['low', 'index'],
    wordBank: ['low', 'index', 'high', 'active', 'hedge', 'single'],
  },
  {
    id: 'inv2-l5-e8',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'These four ideas anchor the case for low-cost index investing.',
    instruction: 'Match each term to its definition.',
    pairs: [
      { id: 'p1', term: 'Index fund', definition: 'A fund that passively tracks a market benchmark' },
      { id: 'p2', term: 'Expense ratio', definition: 'The annual % fee a fund charges' },
      { id: 'p3', term: 'Active fund', definition: 'A fund whose manager tries to beat the market' },
      { id: 'p4', term: 'Rebalancing', definition: 'Restoring your target mix of assets' },
    ],
  },
  {
    id: 'inv2-l5-e9',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Distinguishing solid portfolio habits from common rookie mistakes cements the unit\'s lessons.',
    instruction: 'Sort each into a smart habit or a rookie mistake.',
    buckets: [
      { id: 'smart', label: 'Smart habit' },
      { id: 'mistake', label: 'Rookie mistake' },
    ],
    items: [
      { id: 'auto', text: 'Automating monthly contributions', bucketId: 'smart' },
      { id: 'lowfee', text: 'Choosing low-fee index funds', bucketId: 'smart' },
      { id: 'rebal', text: 'Rebalancing once a year', bucketId: 'smart' },
      { id: 'concentrate', text: 'Putting it all in one hot stock', bucketId: 'mistake' },
      { id: 'chase', text: 'Buying last year\'s top-performing fund', bucketId: 'mistake' },
      { id: 'panic', text: 'Selling everything when the market dips', bucketId: 'mistake' },
    ],
  },
  {
    id: 'inv2-l5-e10',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'The capstone choice rewards broad, low-cost diversification over chasing a single stock or a high-fee active fund.',
    story: 'Priya, 27, has $6,000 to invest for retirement. She is choosing between: (A) a low-cost total-market index fund, (B) putting it all into one trending EV stock, or (C) an active fund charging 1.4% that beat the market last year.',
    choices: [
      { id: 'a', text: 'The low-cost total-market index fund — broad diversification at minimal cost', outcome: 'Correct. It spreads risk across thousands of companies and keeps fees tiny, which compounds into a big advantage over decades.', isCorrect: true, score: 3 },
      { id: 'b', text: 'All-in on the trending EV stock for maximum upside', outcome: 'A single stock can soar or collapse. With one holding, one piece of bad news can wipe out a big chunk of her savings.', isCorrect: false, score: 0 },
      { id: 'c', text: 'The active fund — it beat the market last year', outcome: 'One good year rarely repeats, and a 1.4% fee is a steep, certain drag that most active funds fail to overcome long-term.', isCorrect: false, score: 1 },
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
