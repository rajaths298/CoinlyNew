/**
 * Unit 3 — Funds: ETFs & Index Funds
 * Unit ID: unit-etfs-8
 * Lesson IDs: inv3-l1, inv3-l2, inv3-l3, inv3-practice, inv3-l4, inv3-l5
 */
import type { Lesson } from '../../types/lesson';
import type { Exercise, GuidebookEntry, PathUnit } from '../../types/learn';

function makeLesson(id: string, title: string, exercises: Exercise[], xp: number): Lesson {
  return {
    id, title,
    domain: 'etfs', level: 'beginner',
    unitId: 'unit-etfs-8', unitTitle: 'Funds: ETFs & Index Funds',
    courseTrackId: 'investing', moduleId: 'investing-funds',
    durationMinutes: Math.max(4, Math.round(exercises.length * 1.3)),
    xp, prerequisites: [], difficulty: 2, learningObjectives: [`Understand and apply: ${title}.`],
    competencyIds: ['portfolioConstruction', 'riskReturn'],
    competencyTags: ['etfs', 'investing'],
    masteryWeight: 1, formulaRefs: [], misconceptions: [], steps: [], exercises,
  };
}

const ZIG: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center',
];

// ─── Lesson 1: What Is a Fund? ────────────────────────────────────────────────

const l1Exercises: Exercise[] = [
  {
    id: 'inv3-l1-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Understanding why pooled vehicles exist reveals the core value proposition of funds.',
    prompt: 'Imagine 1,000 investors each with $1,000. What problem does pooling their money together solve that each investor can\'t solve alone?',
    conceptReveal: 'Individually, $1,000 buys maybe one stock. Pooled together, $1,000,000 can buy hundreds of securities — giving every participant instant diversification. Funds also let a professional (or an algorithm) handle research, rebalancing, and record-keeping at low cost per dollar.',
    checkpoints: [
      'Pooling money enables diversification that small amounts can\'t achieve alone',
      'Funds spread research and transaction costs across all investors',
      'Every fund share represents a proportional slice of the whole basket',
    ],
  },
  {
    id: 'inv3-l1-e2',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Knowing what a fund "share" actually represents prevents the misconception that you\'re buying a single company.',
    prompt: 'When you buy one share of a stock ETF, you actually own:',
    options: [
      { id: 'a', text: 'One share of every company in the ETF', isCorrect: false },
      { id: 'b', text: 'A proportional claim on the fund\'s entire basket of securities', isCorrect: true },
      { id: 'c', text: 'A single stock chosen by the fund manager', isCorrect: false },
      { id: 'd', text: 'A bond issued by the ETF provider', isCorrect: false },
    ],
  },
  {
    id: 'inv3-l1-e3',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'Distinguishing fund types early builds the vocabulary for the rest of the unit.',
    instruction: 'Match each fund type to its key characteristic:',
    pairs: [
      { id: 'p1', term: 'Mutual Fund', definition: 'Priced once per day at end of trading' },
      { id: 'p2', term: 'ETF', definition: 'Trades on an exchange throughout the day like a stock' },
      { id: 'p3', term: 'Index Fund', definition: 'Tracks a benchmark; no stock-picking manager' },
      { id: 'p4', term: 'Actively Managed Fund', definition: 'Manager tries to beat the market' },
    ],
  },
  {
    id: 'inv3-l1-e4',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'A fund owning 500 stocks means if one goes bankrupt, the fund barely moves.',
    statement: 'If one company inside an ETF goes bankrupt, the entire ETF loses most of its value.',
    isTrue: false,
  },
  {
    id: 'inv3-l1-e5',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'The NAV concept is fundamental to understanding how mutual fund pricing works.',
    template: 'The price of a mutual fund share is called its ___ and is calculated once per day after the market closes.',
    blanks: ['NAV'],
    wordBank: ['NAV', 'EPS', 'P/E ratio', 'spread', 'yield'],
  },
  {
    id: 'inv3-l1-e6',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Sorting these traits reinforces which structures have which features.',
    instruction: 'Sort each characteristic to the correct fund type:',
    buckets: [
      { id: 'etf', label: 'ETF' },
      { id: 'mf', label: 'Traditional Mutual Fund' },
    ],
    items: [
      { id: 'i1', text: 'Can be bought at 2 pm on any trading day', bucketId: 'etf' },
      { id: 'i2', text: 'Price set once at 4 pm EST', bucketId: 'mf' },
      { id: 'i3', text: 'Often has $0 minimum investment', bucketId: 'etf' },
      { id: 'i4', text: 'May have minimum initial investment of $1,000+', bucketId: 'mf' },
      { id: 'i5', text: 'Listed on NYSE or Nasdaq', bucketId: 'etf' },
      { id: 'i6', text: 'Purchased directly from fund company', bucketId: 'mf' },
    ],
  },
];

// ─── Lesson 2: ETFs vs Mutual Funds ──────────────────────────────────────────

const l2Exercises: Exercise[] = [
  {
    id: 'inv3-l2-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Prompting reflection on structure differences builds intuition before the formal comparison.',
    prompt: 'Both ETFs and mutual funds hold a basket of stocks. If they own the same stocks, why does it matter which wrapper you use?',
    conceptReveal: 'The wrapper determines: when you can trade (all day vs. end of day), tax efficiency (ETFs have a built-in mechanism that avoids taxable distributions), minimum investment, and sometimes costs. Same ingredients, very different packaging.',
    checkpoints: [
      'ETFs trade intraday; mutual funds price once at market close',
      'ETFs are generally more tax-efficient due to the in-kind creation/redemption mechanism',
      'Both can hold identical underlying securities with different investor experiences',
    ],
  },
  {
    id: 'inv3-l2-e2',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Walking through the ETF creation mechanism explains why ETFs are tax-efficient.',
    instruction: 'Put the ETF share creation process in the correct order:',
    items: [
      { id: 's1', text: 'Large institution (authorized participant) buys a basket of stocks matching the ETF\'s index', rank: 1 },
      { id: 's2', text: 'Authorized participant delivers the stock basket to the ETF provider', rank: 2 },
      { id: 's3', text: 'ETF provider issues new ETF shares to the authorized participant', rank: 3 },
      { id: 's4', text: 'Authorized participant sells new ETF shares on the open market', rank: 4 },
    ],
  },
  {
    id: 'inv3-l2-e3',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Tax efficiency is one of the strongest practical arguments for ETFs over mutual funds.',
    prompt: 'Why are ETFs typically more tax-efficient than mutual funds that hold the same stocks?',
    options: [
      { id: 'a', text: 'ETFs pay no taxes at all', isCorrect: false },
      { id: 'b', text: 'The in-kind creation/redemption process lets ETFs avoid selling securities, which would trigger capital gains', isCorrect: true },
      { id: 'c', text: 'ETFs are registered as non-profit vehicles', isCorrect: false },
      { id: 'd', text: 'ETF managers are better at picking tax-loss harvest opportunities', isCorrect: false },
    ],
  },
  {
    id: 'inv3-l2-e4',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'Applying the ETF vs. mutual fund tradeoff to a real scenario builds practical judgment.',
    story: 'Nia wants to invest $200/month in an S&P 500 fund. She might need to sell quickly in an emergency. Her brokerage offers both an S&P 500 ETF (expense ratio: 0.03%) and an S&P 500 mutual fund (expense ratio: 0.04%, no early redemption fee).',
    choices: [
      { id: 'a', text: 'ETF — lower cost, trades anytime, same underlying index', outcome: 'Correct. ETFs trade intraday so she can sell instantly if needed. The lower expense ratio also saves compounding dollars over time.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Mutual fund — she might need liquidity so mutual funds are safer', outcome: 'Mutual funds are not more liquid — you can only sell at end-of-day NAV. The ETF is equally accessible and cheaper.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Neither — she should just keep the money in a savings account', outcome: 'A savings account at 0.5% will lose real purchasing power to inflation over time. Both fund options are better for long-term growth.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv3-l2-e5',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'A common myth is that ETFs are riskier because they trade like stocks — the intraday pricing is a feature, not a hazard.',
    statement: 'Because ETFs trade throughout the day like individual stocks, they are inherently riskier than mutual funds holding the same securities.',
    isTrue: false,
  },
  {
    id: 'inv3-l2-e6',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'The bid-ask spread is a real (if small) cost that ETF investors should be aware of.',
    template: 'When you buy an ETF, you pay the ___ price. When you sell, you receive the ___ price. The difference is the bid-ask spread.',
    blanks: ['ask', 'bid'],
    wordBank: ['ask', 'bid', 'NAV', 'market', 'limit', 'offer'],
  },
];

// ─── Lesson 3: Index Funds & Passive Investing ────────────────────────────────

const l3Exercises: Exercise[] = [
  {
    id: 'inv3-l3-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Challenging the "I can beat the market" intuition up front is critical to understanding why passive wins.',
    prompt: 'Most professional fund managers fail to beat the S&P 500 index over 10+ years. Why would highly paid experts with research teams and Bloomberg terminals underperform a simple index?',
    conceptReveal: 'Three forces work against active managers: (1) fees — a 1% annual fee compounds into a huge drag; (2) trading costs — every buy/sell eats a spread; (3) the market is made of all investors collectively — if half beat the index, half must also underperform it. After fees, the average active manager must lose. Passive funds win by simply not playing that losing game.',
    checkpoints: [
      'Active management fees compound over time, creating a massive hurdle to overcome',
      'Markets aggregate information from millions of participants — hard to consistently exploit',
      'After costs, the average active fund must underperform the index by definition',
    ],
  },
  {
    id: 'inv3-l3-e2',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Understanding what an index actually is prevents confusion between the index and the fund tracking it.',
    prompt: 'The S&P 500 is best described as:',
    options: [
      { id: 'a', text: 'A fund you can buy shares in directly', isCorrect: false },
      { id: 'b', text: 'A list of 500 large US companies weighted by market cap, used as a benchmark', isCorrect: true },
      { id: 'c', text: 'A government agency that regulates US stocks', isCorrect: false },
      { id: 'd', text: 'The average price of the 500 most expensive US stocks', isCorrect: false },
    ],
  },
  {
    id: 'inv3-l3-e3',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Distinguishing index approaches helps investors understand what they\'re actually buying.',
    instruction: 'Sort each fund description into Passive or Active:',
    buckets: [
      { id: 'passive', label: 'Passive (Index)' },
      { id: 'active', label: 'Active (Managed)' },
    ],
    items: [
      { id: 'i1', text: 'Automatically holds all S&P 500 companies by market weight', bucketId: 'passive' },
      { id: 'i2', text: 'Manager reviews earnings reports weekly and adjusts holdings', bucketId: 'active' },
      { id: 'i3', text: 'Rebalances only when the index reconstitutes quarterly', bucketId: 'passive' },
      { id: 'i4', text: 'Seeks to beat the Russell 2000 by picking the best small-caps', bucketId: 'active' },
      { id: 'i5', text: 'Holds every stock in the total US market in proportion to size', bucketId: 'passive' },
      { id: 'i6', text: 'Uses a quant model to tilt toward momentum and quality factors', bucketId: 'active' },
    ],
  },
  {
    id: 'inv3-l3-e4',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Sequencing the compounding fee drag shows concretely why even 1% matters over decades.',
    instruction: 'Order these outcomes from best to worst after 30 years on a $10,000 investment growing 7%/year:',
    items: [
      { id: 's1', text: 'Index fund at 0.03% expense ratio (~$76,000)', rank: 1 },
      { id: 's2', text: 'Index fund at 0.20% expense ratio (~$71,000)', rank: 2 },
      { id: 's3', text: 'Active fund at 1.0% expense ratio (~$57,000)', rank: 3 },
      { id: 's4', text: 'Active fund at 1.5% expense ratio (~$51,000)', rank: 4 },
    ],
  },
  {
    id: 'inv3-l3-e5',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Many new investors fear that passive means they\'re exposed to every crash — clarifying market-cap weighting helps.',
    statement: 'An S&P 500 index fund automatically shifts away from stocks that are falling and into stocks that are rising.',
    isTrue: true,
  },
  {
    id: 'inv3-l3-e6',
    kind: 'miniStory',
    competencyId: 'portfolioConstruction',
    rationale: 'A narrative comparison makes the long-run passive vs. active outcome emotionally concrete.',
    panels: [
      { text: 'I picked an actively managed growth fund for my IRA. It\'s up 12% this year — way better than the boring S&P 500 which only did 10%.', speaker: 'Marcus' },
      { text: 'Nice short-term! But what\'s the expense ratio?', speaker: 'Elena' },
      { text: 'About 1.2%. Is that a lot?', speaker: 'Marcus' },
      { text: 'Over 30 years it could cost you $100,000+ in compounding drag vs. a 0.03% index fund. And most active funds that beat the market in year 1 underperform by year 5.', speaker: 'Elena' },
      { text: 'So the fund that looks better this year might actually be worse over my whole career?', speaker: 'Marcus' },
    ],
    choicePrompt: 'What is Elena\'s core point about the 1.2% expense ratio?',
    choices: [
      { id: 'a', text: 'It\'s fine as long as the fund outperforms by more than 1.2% per year', isCorrect: false, outcome: 'The problem is that most active funds don\'t consistently beat by 1.2%+ after costs. Elena is pointing out that this rarely happens over long horizons.' },
      { id: 'b', text: 'It compounds into a huge drag over decades, and most active funds don\'t outperform long-term after costs', isCorrect: true, outcome: 'Exactly right. The fee drag is silent but relentless — and the majority of active funds underperform their benchmark over 15-20 year periods.' },
      { id: 'c', text: 'Expense ratios only matter in years when the market is flat', isCorrect: false, outcome: 'Expense ratios are charged every year regardless of market conditions — making them especially costly during strong bull markets when the compounding drag is largest.' },
    ],
  },
];

// ─── Practice: Mixed Practice ─────────────────────────────────────────────────

const l4PracticeExercises: Exercise[] = [
  {
    id: 'inv3-p-e1',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'NAV is the core pricing concept for mutual funds — must be solid.',
    prompt: 'A mutual fund has $50 million in assets, $500,000 in liabilities, and 2 million shares outstanding. What is its NAV per share?',
    options: [
      { id: 'a', text: '$24.75', isCorrect: true },
      { id: 'b', text: '$25.00', isCorrect: false },
      { id: 'c', text: '$25.25', isCorrect: false },
      { id: 'd', text: '$50.00', isCorrect: false },
    ],
  },
  {
    id: 'inv3-p-e2',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Clarifying that index funds can come in both mutual fund and ETF wrappers is a common confusion.',
    statement: 'Index funds are always ETFs.',
    isTrue: false,
  },
  {
    id: 'inv3-p-e3',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Passive investing\'s core insight must be internalized.',
    prompt: 'Over a 20-year period, roughly what percentage of actively managed US equity funds underperform their benchmark index?',
    options: [
      { id: 'a', text: 'Around 20%', isCorrect: false },
      { id: 'b', text: 'Around 40%', isCorrect: false },
      { id: 'c', text: 'Around 60%', isCorrect: false },
      { id: 'd', text: 'Over 90%', isCorrect: true },
    ],
  },
  {
    id: 'inv3-p-e4',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Synthesizing the unit\'s key insight cements the passive investing case.',
    prompt: 'In your own words, explain to a friend why a boring 0.04% S&P 500 index fund might beat most "smart" actively managed funds over 20 years.',
    conceptReveal: 'Lower costs (0.04% vs 1%+) compound over decades. Active managers must beat the index by their full fee just to break even. Most can\'t — and the ones who do often can\'t sustain it. The index fund wins by not losing to fees and bad stock-picking years.',
    checkpoints: [
      'Cost advantage compounds dramatically over 20+ years',
      'Active managers must consistently beat by more than their fee — very hard to do',
      'Passive funds avoid the behavioral mistakes active managers make chasing performance',
    ],
  },
];

// ─── Lesson 5: Expense Ratios & Fees ─────────────────────────────────────────

const l5Exercises: Exercise[] = [
  {
    id: 'inv3-l4-e1',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Computing the true cost of a 1% fee makes the abstract number concrete and alarming.',
    prompt: 'You invest $10,000 growing at 8%/year for 30 years. What do you think the difference is between paying 0.05% vs 1.0% in annual fees?',
    conceptReveal: 'At 0.05%: ~$99,500 final balance. At 1.0%: ~$74,300 final balance. The 0.95% fee difference costs you ~$25,200 — more than double your original investment, gone purely to fees. That\'s the power of compounding working against you.',
    checkpoints: [
      'Even a seemingly small 1% fee compounds into tens of thousands of dollars lost',
      'The fee is taken every year from your entire balance — not just your gain',
      'Low-cost index funds exist with expense ratios under 0.05%',
    ],
  },
  {
    id: 'inv3-l4-e2',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'Investors face multiple fee types — knowing what each one is prevents surprise costs.',
    instruction: 'Match each fee to its definition:',
    pairs: [
      { id: 'p1', term: 'Expense Ratio', definition: 'Annual % deducted from fund assets for operating costs' },
      { id: 'p2', term: 'Front-End Load', definition: 'Sales commission charged when you buy fund shares' },
      { id: 'p3', term: 'Back-End Load', definition: 'Sales commission charged when you sell fund shares' },
      { id: 'p4', term: '12b-1 Fee', definition: 'Annual fee used to pay for fund marketing and distribution' },
    ],
  },
  {
    id: 'inv3-l4-e3',
    kind: 'calculator',
    competencyId: 'portfolioConstruction',
    rationale: 'Showing how a tiny expense ratio difference compounds over 20 years makes fee sensitivity visceral.',
    formulaKey: 'compoundGrowth',
    prompt: 'Calculate the 20-year growth of $5,000 in a fund with a net annual return of 6.95% (7% gross minus 0.05% expense ratio).',
    targetLabel: 'Future Value',
    explanation: 'Future Value = Principal × (1 + rate/100)^years. The 0.05% ER barely reduces the 7% return — compare this to a 1% ER fund to see the cost of fees.',
    inputs: [
      { id: 'principal', label: 'Starting Amount ($)', value: 5000, min: 1000, max: 50000, step: 500, prefix: '$' },
      { id: 'rate', label: 'Net Annual Return (%)', value: 6.95, min: 1, max: 12, step: 0.05, suffix: '%' },
      { id: 'years', label: 'Years', value: 20, min: 1, max: 40, step: 1 },
    ],
  },
  {
    id: 'inv3-l4-e4',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'No-load funds are the norm now but beginners confuse "no load" with "no fees."',
    prompt: 'A fund advertised as "no-load" means:',
    options: [
      { id: 'a', text: 'There are no fees of any kind', isCorrect: false },
      { id: 'b', text: 'There is no sales commission (load) but there may still be an expense ratio', isCorrect: true },
      { id: 'c', text: 'The fund is guaranteed not to lose money', isCorrect: false },
      { id: 'd', text: 'You cannot sell the fund for at least one year', isCorrect: false },
    ],
  },
  {
    id: 'inv3-l4-e5',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'The expense ratio is already reflected in price — it\'s never a separate charge.',
    template: 'You never see the expense ratio as a separate charge. Instead, it is automatically ___ from the fund\'s assets each day.',
    blanks: ['deducted'],
    wordBank: ['deducted', 'added', 'reported', 'invoiced', 'waived'],
  },
  {
    id: 'inv3-l4-e6',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Higher fees do not mean better performance — this misconception is costly.',
    statement: 'Paying a higher expense ratio is usually worth it because higher-fee funds tend to deliver better performance.',
    isTrue: false,
  },
];

// ─── Lesson 6: Pick a Fund — Capstone ────────────────────────────────────────

const l6Exercises: Exercise[] = [
  {
    id: 'inv3-l5-e1',
    kind: 'miniStory',
    competencyId: 'portfolioConstruction',
    rationale: 'A narrative context makes the fund-selection criteria feel real and consequential.',
    panels: [
      { text: 'I finally have $3,000 to invest. My coworker says I should buy the Apex Growth Fund — it returned 22% last year!', speaker: 'Jordan' },
      { text: 'Did you check its 10-year average, or just last year\'s return?', speaker: 'Sam' },
      { text: 'Just last year. It has a 1.5% expense ratio but that seems fine if returns are 22%.', speaker: 'Jordan' },
      { text: 'One hot year doesn\'t mean much. What\'s the expense ratio on a comparable index ETF?', speaker: 'Sam' },
      { text: 'About 0.03%. That\'s a huge difference. But surely the fund manager can keep beating the market?', speaker: 'Jordan' },
    ],
    choicePrompt: 'What should Jordan research before deciding?',
    choices: [
      { id: 'a', text: '5- and 10-year risk-adjusted returns vs. the index, after fees — not just last year\'s number', isCorrect: true, outcome: 'Exactly right. One great year proves nothing — the real test is sustained after-fee outperformance over a full market cycle.' },
      { id: 'b', text: 'The fund manager\'s educational background and years of experience', isCorrect: false, outcome: 'Manager credentials don\'t predict future returns. The data shows that even experienced managers with elite credentials underperform their benchmark after fees over 15+ years.' },
      { id: 'c', text: 'Whether the fund has a five-star Morningstar rating this year', isCorrect: false, outcome: 'Single-year ratings mostly capture recent momentum. Studies show 5-star funds revert toward average performance in subsequent periods.' },
    ],
  },
  {
    id: 'inv3-l5-e2',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'A systematic fund-evaluation checklist creates a repeatable process for future decisions.',
    instruction: 'Put these fund-comparison steps in a logical order:',
    items: [
      { id: 's1', text: 'Decide what you want to own: US total market, S&P 500, international, bonds, etc.', rank: 1 },
      { id: 's2', text: 'Find all funds or ETFs that track that same index or category', rank: 2 },
      { id: 's3', text: 'Filter for expense ratio — prefer under 0.20% for broad index funds', rank: 3 },
      { id: 's4', text: 'Check fund size and liquidity (AUM > $500M for ETFs)', rank: 4 },
      { id: 's5', text: 'Compare 5- and 10-year returns vs. benchmark to confirm tracking accuracy', rank: 5 },
      { id: 's6', text: 'Buy and automate regular contributions', rank: 6 },
    ],
  },
  {
    id: 'inv3-l5-e3',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Distinguishing red from green flags in a fund prospectus is a practical skill.',
    instruction: 'Sort these fund characteristics into Green Flag (investor-friendly) or Red Flag (watch out):',
    buckets: [
      { id: 'green', label: 'Green Flag' },
      { id: 'red', label: 'Red Flag' },
    ],
    items: [
      { id: 'i1', text: 'Expense ratio: 0.03%', bucketId: 'green' },
      { id: 'i2', text: 'Front-end sales load: 5%', bucketId: 'red' },
      { id: 'i3', text: 'Tracks the total US stock market index', bucketId: 'green' },
      { id: 'i4', text: 'Manager turnover: 3 managers in 5 years', bucketId: 'red' },
      { id: 'i5', text: 'AUM: $120 billion', bucketId: 'green' },
      { id: 'i6', text: 'Advertises last year\'s #1 performance ranking', bucketId: 'red' },
    ],
  },
  {
    id: 'inv3-l5-e4',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'Applying all the unit\'s criteria to a final choice cements the decision framework.',
    story: 'Jordan has narrowed to three S&P 500 options:\n• Vanguard VOO ETF: 0.03% ER, $400B AUM, tracks S&P 500\n• Apex Growth Mutual Fund: 1.5% ER, 5-year avg 9.1% (S&P 500 returned 10.2% same period)\n• ProCapital S&P 500 ETF: 0.15% ER, $2B AUM, tracks S&P 500',
    choices: [
      { id: 'a', text: 'Apex Growth — it\'s actively managed so has upside to outperform', outcome: 'Apex already underperforms after fees (9.1% vs 10.2%) and charges 1.5%. The data makes this the worst choice.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Vanguard VOO — lowest cost, most liquid, tracks the exact same index', outcome: 'Correct. 0.03% ER and $400B AUM means the tightest spreads and lowest tracking error. For a core long-term holding, this wins.', isCorrect: true, score: 3 },
      { id: 'c', text: 'ProCapital — similar cost to VOO and gives diversification across providers', outcome: 'ProCapital at 0.15% is 5× more expensive than VOO for the identical exposure. Spreading across providers isn\'t necessary — index funds aren\'t counterparty risks.', isCorrect: false, score: 1 },
    ],
  },
  {
    id: 'inv3-l5-e5',
    kind: 'calculator',
    competencyId: 'portfolioConstruction',
    rationale: 'The 30-year compound comparison between index and active fees is the capstone argument for low-cost investing.',
    formulaKey: 'compoundGrowth',
    prompt: 'Jordan invests $3,000 for 30 years in an index fund growing at 7% net. Calculate the final value.',
    targetLabel: 'Index Fund Final Value',
    explanation: 'Compare this to an active fund at 5.5% net (7% − 1.5% ER). The difference illustrates exactly what fees cost over a career.',
    inputs: [
      { id: 'principal', label: 'Starting Amount ($)', value: 3000, min: 500, max: 20000, step: 500, prefix: '$' },
      { id: 'rate', label: 'Net Annual Return (%)', value: 7.0, min: 1, max: 12, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years', value: 30, min: 5, max: 40, step: 1 },
    ],
  },
  {
    id: 'inv3-l5-e6',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'The final synthesis question ensures the learner can articulate the whole unit\'s argument.',
    prompt: 'In 2–3 sentences, make the case for index fund investing to someone who thinks they can just pick a few great stocks and beat the market.',
    conceptReveal: 'Most professional managers with full-time research teams, unlimited data, and decades of experience still fail to beat a simple index fund over 10+ years. The culprits: costs, taxes, and the fact that the market already prices in most available information. By owning the whole market at rock-bottom cost, you guarantee yourself the market return — which beats most active alternatives after fees.',
    checkpoints: [
      'Active management success rarely persists — this year\'s winner is often next year\'s loser',
      'Costs are the most predictable drag on returns — minimize them',
      'Index funds guarantee you the market return; active funds gamble on beating it, usually after fees',
    ],
  },
];

// ─── Exports ──────────────────────────────────────────────────────────────────

export const fundsAndEtfsGuidebook: GuidebookEntry[] = [
  {
    id: 'guide-etf-1',
    title: 'Fund Types at a Glance',
    body: 'All funds pool investor money to buy a basket of securities. ETFs trade on exchanges like stocks (intraday pricing, no minimums). Mutual funds price once at market close (NAV) and may require minimums. Index funds follow a rules-based benchmark — they come in both ETF and mutual fund wrappers.',
  },
  {
    id: 'guide-etf-2',
    title: 'Why Passive Beats Active (Most of the Time)',
    body: 'Over 20 years, 90%+ of actively managed US equity funds underperform their benchmark index after fees (SPIVA data). The market prices information quickly, making it hard to consistently exploit edges. Passive funds sidestep this: they don\'t try to win — they just don\'t lose to fees, taxes, and bad-timing trades.',
  },
  {
    id: 'guide-etf-3',
    title: 'Expense Ratio — The Silent Drag',
    body: 'The expense ratio is an annual % of your assets deducted automatically from the fund\'s NAV. A 1% ratio on a $50,000 balance is $500/year — and that $500 also never gets to compound. On $10,000 growing at 7% for 30 years, switching from 1% to 0.05% ER adds ~$25,000 to your balance.',
    formulaRef: 'compoundGrowth',
  },
  {
    id: 'guide-etf-4',
    title: 'ETF Tax Efficiency',
    body: 'ETFs use an "in-kind" creation/redemption mechanism: authorized participants swap stock baskets for ETF shares without the fund selling securities. This avoids triggering capital gains distributions that mutual fund investors receive even if they didn\'t sell a single share. For taxable accounts, ETFs are almost always more tax-efficient.',
  },
  {
    id: 'guide-etf-5',
    title: 'Fund Selection Checklist',
    body: '1. Define what you want to own (US total market? International? Bonds?).\n2. Find funds tracking that category.\n3. Compare expense ratios — prefer under 0.20% for broad index funds.\n4. Check AUM: over $500M for ETFs to ensure liquidity and tight bid-ask spreads.\n5. Verify the fund tracks the index closely (low tracking error).\n6. Ignore last year\'s return ranking — it rarely repeats.',
  },
];

export const fundsAndEtfsLessons: Record<string, Lesson> = {
  'inv3-l1': makeLesson('inv3-l1', 'What Is a Fund?', l1Exercises, 60),
  'inv3-l2': makeLesson('inv3-l2', 'ETFs vs Mutual Funds', l2Exercises, 70),
  'inv3-l3': makeLesson('inv3-l3', 'Index Funds & Passive Investing', l3Exercises, 80),
  'inv3-practice': makeLesson('inv3-practice', 'Mixed Practice', l4PracticeExercises, 50),
  'inv3-l4': makeLesson('inv3-l4', 'Expense Ratios & Fees', l5Exercises, 75),
  'inv3-l5': makeLesson('inv3-l5', 'Pick a Fund', l6Exercises, 100),
};

export const fundsAndEtfsUnit: PathUnit = {
  id: 'unit-etfs-8',
  title: 'Funds: ETFs & Index Funds',
  subtitle: 'Own the whole market for nearly nothing',
  color: '#4C7ABE',
  icon: '🗂️',
  trackId: 'etfs',
  competencyIds: ['portfolioConstruction', 'riskReturn'],
  nodes: [
    { id: 'inv3-l1-node',       type: 'lesson',   position: ZIG[0]!, lessonId: 'inv3-l1' },
    { id: 'inv3-l2-node',       type: 'lesson',   position: ZIG[1]!, lessonId: 'inv3-l2' },
    { id: 'inv3-l3-node',       type: 'lesson',   position: ZIG[2]!, lessonId: 'inv3-l3' },
    { id: 'inv3-practice-node', type: 'practice', position: ZIG[3]!, lessonId: 'inv3-practice' },
    { id: 'inv3-chest',         type: 'chest',    position: ZIG[4]!, chestReward: { brainBucks: 75, xp: 30 } },
    { id: 'inv3-l4-node',       type: 'lesson',   position: ZIG[5]!, lessonId: 'inv3-l4' },
    { id: 'inv3-l5-node',       type: 'lesson',   position: ZIG[6]!, lessonId: 'inv3-l5' },
    { id: 'inv3-trophy',        type: 'trophy',   position: ZIG[7]! },
  ],
  guidebook: fundsAndEtfsGuidebook,
  masteryThreshold: 65,
};
