/**
 * Unit 4 — Risk, Margin & Short Selling
 * Unlocks short selling (featureUnlocks key: 'shortSelling')
 * Unit ID: unit-risk-9
 * Lesson IDs: inv4-l1, inv4-l2, inv4-l3, inv4-practice, inv4-l4, inv4-l5
 */
import type { Lesson } from '../../types/lesson';
import type { Exercise, GuidebookEntry, PathUnit } from '../../types/learn';

function makeLesson(id: string, title: string, exercises: Exercise[], xp: number): Lesson {
  return {
    id, title,
    domain: 'investing', level: 'builder',
    unitId: 'unit-risk-9', unitTitle: 'Risk, Margin & Short Selling',
    courseTrackId: 'investing', moduleId: 'investing-advanced',
    durationMinutes: Math.max(4, Math.round(exercises.length * 1.3)),
    xp, prerequisites: [], difficulty: 3, learningObjectives: [`Understand and apply: ${title}.`],
    competencyIds: ['riskReturn', 'portfolioConstruction'],
    competencyTags: ['risk', 'margin', 'shorting', 'investing'],
    masteryWeight: 1, formulaRefs: [], misconceptions: [], steps: [], exercises,
  };
}

const ZIG: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center',
];

// ─── Lesson 1: Measuring Risk ─────────────────────────────────────────────────

const l1Exercises: Exercise[] = [
  {
    id: 'inv4-l1-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Surfacing the intuitive meaning of risk before formal definitions reveals and corrects misconceptions.',
    prompt: 'Most people fear investing because it feels risky. But is all risk the same? Think of two different investments — one "risky" and one "safe." What makes them different?',
    conceptReveal: 'Risk in finance means uncertainty of outcome — specifically, the range of possible returns. A savings account has near-zero variance; you know exactly what you\'ll earn. A startup stock has enormous variance; it might 10x or go to zero. Risk isn\'t inherently bad — higher uncertainty typically comes with the potential for higher returns. The goal is to take only the risks you\'re compensated for.',
    checkpoints: [
      'Risk = variance of outcomes, not just the chance of loss',
      'Higher potential return almost always comes with higher uncertainty',
      'The goal is being compensated fairly for the risk you accept',
    ],
  },
  {
    id: 'inv4-l1-e2',
    kind: 'matchPairs',
    competencyId: 'riskReturn',
    rationale: 'Standard deviation and beta are the two core risk metrics investors must know.',
    instruction: 'Match each risk concept to its meaning:',
    pairs: [
      { id: 'p1', term: 'Standard Deviation', definition: 'How spread out past returns have been (volatility)' },
      { id: 'p2', term: 'Beta', definition: 'How much a stock moves relative to the overall market' },
      { id: 'p3', term: 'Sharpe Ratio', definition: 'Return earned per unit of risk taken' },
      { id: 'p4', term: 'Max Drawdown', definition: 'Largest peak-to-trough decline over a period' },
    ],
  },
  {
    id: 'inv4-l1-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Beta interpretation is a practical skill for comparing stocks to the market.',
    prompt: 'A stock has a beta of 1.8. If the S&P 500 drops 10%, you\'d expect this stock to:',
    options: [
      { id: 'a', text: 'Drop about 10% — beta doesn\'t change the direction', isCorrect: false },
      { id: 'b', text: 'Drop about 18% — beta amplifies market moves', isCorrect: true },
      { id: 'c', text: 'Drop about 5.6% — high beta means more stable', isCorrect: false },
      { id: 'd', text: 'Rise 8% — high beta means inverse movement', isCorrect: false },
    ],
  },
  {
    id: 'inv4-l1-e4',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Clarifying that higher risk doesn\'t guarantee higher returns prevents a common misreading.',
    statement: 'Taking more risk always leads to higher returns.',
    isTrue: false,
  },
  {
    id: 'inv4-l1-e5',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'The risk-return tradeoff is the foundational principle of all asset pricing.',
    template: 'The ___ tradeoff describes the principle that assets offering higher potential returns must also carry higher ___.',
    blanks: ['risk-return', 'risk'],
    wordBank: ['risk-return', 'cost-benefit', 'risk', 'volatility', 'reward', 'liquidity'],
  },
  {
    id: 'inv4-l1-e6',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'Ranking asset classes by typical risk reinforces the spectrum concept.',
    instruction: 'Order these investments from lowest to highest typical risk:',
    items: [
      { id: 's1', text: 'US Treasury Bills (3-month)', rank: 1 },
      { id: 's2', text: 'Investment-Grade Corporate Bonds', rank: 2 },
      { id: 's3', text: 'S&P 500 Index Fund', rank: 3 },
      { id: 's4', text: 'Individual Small-Cap Growth Stock', rank: 4 },
      { id: 's5', text: 'Cryptocurrency (Bitcoin)', rank: 5 },
    ],
  },
];

// ─── Lesson 2: Systematic vs Unsystematic Risk ────────────────────────────────

const l2Exercises: Exercise[] = [
  {
    id: 'inv4-l2-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Distinguishing diversifiable from non-diversifiable risk is the foundation of portfolio theory.',
    prompt: 'If you own stock in only one airline and a pilot strike grounds all flights, your investment suffers. If you own 500 stocks across all industries, does the pilot strike still hurt you as much? Why or why not?',
    conceptReveal: 'Owning 500 stocks dilutes any single company\'s impact — that\'s unsystematic (diversifiable) risk. The airline\'s unique bad news barely moves your portfolio. But a global recession hitting all 500 stocks is systematic (market) risk — you can\'t diversify away from it. Modern Portfolio Theory says you\'re not compensated for taking unsystematic risk because it\'s easily avoided through diversification.',
    checkpoints: [
      'Unsystematic risk is company/industry-specific and can be diversified away',
      'Systematic risk affects the entire market and cannot be diversified away',
      'Investors are only compensated for bearing systematic (market) risk',
    ],
  },
  {
    id: 'inv4-l2-e2',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Sorting real-world events into systematic vs unsystematic builds the intuition for what can be hedged.',
    instruction: 'Classify each event as Systematic (market-wide) or Unsystematic (company/sector-specific):',
    buckets: [
      { id: 'sys', label: 'Systematic' },
      { id: 'unsys', label: 'Unsystematic' },
    ],
    items: [
      { id: 'i1', text: 'Federal Reserve raises interest rates by 0.75%', bucketId: 'sys' },
      { id: 'i2', text: 'A pharmaceutical company\'s drug fails FDA approval', bucketId: 'unsys' },
      { id: 'i3', text: 'Global recession causes consumer spending to collapse', bucketId: 'sys' },
      { id: 'i4', text: 'A retailer\'s CEO is caught in an accounting fraud', bucketId: 'unsys' },
      { id: 'i5', text: 'Inflation spikes to 8% unexpectedly', bucketId: 'sys' },
      { id: 'i6', text: 'A tech company loses a patent lawsuit to a competitor', bucketId: 'unsys' },
    ],
  },
  {
    id: 'inv4-l2-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Understanding that diversification has diminishing returns beyond ~20–30 stocks shapes realistic portfolio building.',
    prompt: 'Roughly how many stocks does research suggest are needed to eliminate most unsystematic risk?',
    options: [
      { id: 'a', text: '3–5 stocks', isCorrect: false },
      { id: 'b', text: '20–30 stocks across different industries', isCorrect: true },
      { id: 'c', text: 'Exactly 100 stocks', isCorrect: false },
      { id: 'd', text: 'You need at least 500 to meaningfully diversify', isCorrect: false },
    ],
  },
  {
    id: 'inv4-l2-e4',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'Applying the concept to a real portfolio allocation forces the learner to use both categories.',
    story: 'Alex has $20,000 split equally across: Apple, Microsoft, Google, Meta, and Amazon — all US mega-cap tech stocks.',
    choices: [
      { id: 'a', text: 'Unsystematic risk — five companies means five times more volatility', outcome: 'Actually the opposite: more stocks reduce single-company risk. But all five are in the same sector, so sector-wide moves hit the whole portfolio.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Sector concentration risk — all five stocks move together during tech sell-offs', outcome: 'Correct. Owning five tech giants reduces single-company risk but creates sector concentration. When tech sells off — rising rates, regulation fears — all five drop together.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Both systematic and unsystematic risk are fully eliminated with 5 stocks', outcome: 'Five stocks don\'t eliminate unsystematic risk, and sector concentration actually adds a new form of it. Systematic risk can never be fully eliminated.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv4-l2-e5',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Clarifying that systematic risk cannot be eliminated — only managed — is a key portfolio insight.',
    statement: 'Owning every stock in the world completely eliminates investment risk.',
    isTrue: false,
  },
  {
    id: 'inv4-l2-e6',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'Correlation is the mechanism that determines how well diversification works.',
    template: 'Diversification works best when assets have low or negative ___. When assets move together perfectly (correlation = ___), diversification provides no benefit.',
    blanks: ['correlation', '+1'],
    wordBank: ['correlation', 'beta', '+1', '-1', '0', 'variance'],
  },
];

// ─── Lesson 3: Margin Accounts ────────────────────────────────────────────────

const l3Exercises: Exercise[] = [
  {
    id: 'inv4-l3-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Understanding leverage intuitively before the mechanics prevents dangerous misconceptions.',
    prompt: 'You have $5,000 and borrow another $5,000 to invest $10,000 total. The investment rises 20%. How much did you make, and what\'s your return on YOUR $5,000? Now imagine it drops 20% instead — what happens?',
    conceptReveal: 'On a 20% gain: $10,000 → $12,000. After repaying the $5,000 loan, you have $7,000 — a 40% return on your $5,000! Leverage doubled your gain. On a 20% loss: $10,000 → $8,000. After repaying $5,000, you have $3,000 — a 40% loss on your own capital. Leverage amplifies both sides equally. This is why margin is described as a double-edged sword.',
    checkpoints: [
      'Leverage amplifies both gains and losses proportionally to the leverage ratio',
      'Borrowing to invest means you owe the loan regardless of what the investment does',
      'A 50% leveraged position doubles your effective exposure to market moves',
    ],
  },
  {
    id: 'inv4-l3-e2',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'Walking through a margin call sequence clarifies why it\'s so dangerous.',
    instruction: 'Put these margin call events in the correct order:',
    items: [
      { id: 's1', text: 'Investor borrows $5,000 from broker, buying $10,000 in stock (50% margin)', rank: 1 },
      { id: 's2', text: 'Stock drops 30% — portfolio value falls to $7,000', rank: 2 },
      { id: 's3', text: 'Broker calculates equity: $7,000 − $5,000 loan = $2,000 (20% equity, below 25% maintenance)', rank: 3 },
      { id: 's4', text: 'Broker issues margin call: deposit more cash or securities immediately', rank: 4 },
      { id: 's5', text: 'If investor can\'t meet the call, broker force-sells holdings to repay the loan', rank: 5 },
    ],
  },
  {
    id: 'inv4-l3-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Initial vs maintenance margin are distinct requirements that beginners often confuse.',
    prompt: 'The "maintenance margin" on a margin account is:',
    options: [
      { id: 'a', text: 'The amount you must deposit to open a leveraged position (typically 50%)', isCorrect: false },
      { id: 'b', text: 'The minimum equity percentage you must maintain — falling below triggers a margin call', isCorrect: true },
      { id: 'c', text: 'The annual fee your broker charges for providing the loan', isCorrect: false },
      { id: 'd', text: 'The maximum amount you can borrow at any time', isCorrect: false },
    ],
  },
  {
    id: 'inv4-l3-e4',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Margin interest is a real ongoing cost that beginners often overlook.',
    statement: 'Borrowing on margin is free — brokers lend the money as a service to attract active traders.',
    isTrue: false,
  },
  {
    id: 'inv4-l3-e5',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Distinguishing appropriate vs inappropriate uses of margin builds responsible judgment.',
    instruction: 'Sort each scenario into Reasonable Use of Margin or High Risk / Inadvisable:',
    buckets: [
      { id: 'ok', label: 'Reasonable Use' },
      { id: 'bad', label: 'High Risk / Inadvisable' },
    ],
    items: [
      { id: 'i1', text: 'Short-term bridge to avoid selling a long-term holding during a temporary cash need', bucketId: 'ok' },
      { id: 'i2', text: 'Borrowing 90% of position value to buy a meme stock', bucketId: 'bad' },
      { id: 'i3', text: 'Using 20% margin to slightly amplify a diversified ETF position', bucketId: 'ok' },
      { id: 'i4', text: 'Borrowing on margin to pay for living expenses', bucketId: 'bad' },
      { id: 'i5', text: 'Doubling down on a position already showing large losses', bucketId: 'bad' },
    ],
  },
  {
    id: 'inv4-l3-e6',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'The margin interest calculation is a practical skill for evaluating whether leveraged returns are worth the cost.',
    template: 'You borrow $10,000 on margin at 8% annual interest. If you hold the position for 6 months, you owe $___ in interest.',
    blanks: ['400'],
    wordBank: ['400', '800', '200', '480', '600'],
  },
];

// ─── Practice: Mixed Practice ─────────────────────────────────────────────────

const l4PracticeExercises: Exercise[] = [
  {
    id: 'inv4-p-e1',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Calculating the break-even return on a leveraged position is a fundamental margin skill.',
    prompt: 'You invest $8,000 of your own money and borrow $2,000 at 7% annual interest. What annual return on the full $10,000 do you need just to cover the interest?',
    options: [
      { id: 'a', text: '1.4%', isCorrect: true },
      { id: 'b', text: '2.0%', isCorrect: false },
      { id: 'c', text: '7.0%', isCorrect: false },
      { id: 'd', text: '3.5%', isCorrect: false },
    ],
  },
  {
    id: 'inv4-p-e2',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Clarifying that correlation — not quantity — drives diversification prevents the "20 stocks in tech" mistake.',
    statement: 'Owning 30 different stocks in the same sector provides full diversification against unsystematic risk.',
    isTrue: false,
  },
  {
    id: 'inv4-p-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Identifying the mechanism of a margin call under real numbers is a crucial safety concept.',
    prompt: 'You buy $20,000 in stock using $10,000 of your own money and $10,000 borrowed. The stock drops 40%. What is your equity position now?',
    options: [
      { id: 'a', text: '$2,000 equity (you still owe the full $10,000 loan)', isCorrect: true },
      { id: 'b', text: '$8,000 equity', isCorrect: false },
      { id: 'c', text: '$0 — you break even', isCorrect: false },
      { id: 'd', text: 'You lost $10,000 more than you invested', isCorrect: false },
    ],
  },
  {
    id: 'inv4-p-e4',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Synthesizing both risk types before moving into short selling solidifies the foundation.',
    prompt: 'Explain in your own words: why are investors NOT compensated for taking on unsystematic risk?',
    conceptReveal: 'Unsystematic risk is avoidable — just diversify. Because any rational investor would diversify it away for free, the market doesn\'t reward you for carrying it. If a stock carries company-specific risk AND pays a higher return, investors will buy it until the return falls to just what\'s fair for its systematic (market) risk. The price reflects only the risk you can\'t escape.',
    checkpoints: [
      'The market prices only the risk that cannot be eliminated — systematic risk',
      'Any premium for unsystematic risk would be quickly arbitraged away by diversified investors',
      'You can hold a fully undiversified portfolio but the market won\'t reward the extra risk',
    ],
  },
];

// ─── Lesson 5: Short Selling Mechanics ───────────────────────────────────────

const l5Exercises: Exercise[] = [
  {
    id: 'inv4-l4-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Prompting the learner to construct the short logic themselves prevents passive memorization.',
    prompt: 'You believe a stock trading at $100 is going to fall to $60. You don\'t own it. How could you profit from a decline without actually owning the stock first?',
    conceptReveal: 'You borrow the stock from someone who owns it (via your broker), sell it immediately at $100, wait for the price to drop, then buy it back at $60 — pocketing $40 per share. You return the borrowed shares to the lender. This is short selling: sell first, buy later, profit from the decline. The risk: if the stock rises to $150, you must still buy it back — now at a $50 loss per share.',
    checkpoints: [
      'Short selling = borrow shares → sell → wait for decline → buy back (cover) → return shares',
      'Profit = selling price − cover price (before fees and borrowing costs)',
      'Risk is theoretically unlimited: a stock can rise without limit',
    ],
  },
  {
    id: 'inv4-l4-e2',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'Sequencing the short sale lifecycle makes the multi-step mechanics stick.',
    instruction: 'Arrange the steps of a short sale in the correct order:',
    items: [
      { id: 's1', text: 'Broker locates shares to borrow on your behalf', rank: 1 },
      { id: 's2', text: 'You sell the borrowed shares at the current market price', rank: 2 },
      { id: 's3', text: 'Stock price declines as you expected', rank: 3 },
      { id: 's4', text: 'You "cover" by buying back the same number of shares at the lower price', rank: 4 },
      { id: 's5', text: 'Shares are returned to the lender; you keep the price difference (minus fees)', rank: 5 },
    ],
  },
  {
    id: 'inv4-l4-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'The asymmetric loss profile of short selling is the single most important risk concept.',
    prompt: 'What is the maximum possible loss on a short position in a stock?',
    options: [
      { id: 'a', text: 'The amount you initially received when selling the borrowed shares', isCorrect: false },
      { id: 'b', text: '100% of your initial investment, same as a long position', isCorrect: false },
      { id: 'c', text: 'Theoretically unlimited — because a stock\'s price can rise without limit', isCorrect: true },
      { id: 'd', text: '50% of the short proceeds, because brokers close positions at 50% loss', isCorrect: false },
    ],
  },
  {
    id: 'inv4-l4-e4',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Short sellers sometimes get "squeezed" — a critical concept after famous events like GameStop.',
    statement: 'A "short squeeze" occurs when a heavily shorted stock\'s price rises rapidly, forcing short sellers to cover at a loss, which drives the price even higher.',
    isTrue: true,
  },
  {
    id: 'inv4-l4-e5',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'Applying short selling logic to a real situation checks whether the mechanics are understood.',
    story: 'You short 100 shares of RetailCo at $80/share (receiving $8,000). The stock falls to $50. You decide to cover (buy back 100 shares at $50).',
    choices: [
      { id: 'a', text: '$3,000 — you sold at $80 and bought back at $50, saving $30/share × 100', outcome: 'Correct. Gross profit = (sell price − cover price) × shares = ($80 − $50) × 100 = $3,000. You\'ll then subtract any borrowing fees and interest for net profit.', isCorrect: true, score: 3 },
      { id: 'b', text: '$5,000 — you received $8,000 and now only pay $3,000 to cover', outcome: 'The $3,000 cover cost is added to your $8,000 proceeds, not subtracted from it to give $5,000. Gross profit = $8,000 − $5,000 = $3,000.', isCorrect: false, score: 0 },
      { id: 'c', text: '$8,000 — you keep everything you received from the original sale', outcome: 'You must buy back the shares to return them to the lender. The cover cost ($5,000) is subtracted from the original proceeds ($8,000), leaving $3,000 gross profit.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv4-l4-e6',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Understanding the different motivations for shorting — speculation vs hedging — shows its legitimate uses.',
    instruction: 'Sort these short selling motivations into Speculative or Hedging:',
    buckets: [
      { id: 'spec', label: 'Speculative' },
      { id: 'hedge', label: 'Hedging' },
    ],
    items: [
      { id: 'i1', text: 'Shorting a competitor\'s stock to profit if your investment thesis is right', bucketId: 'spec' },
      { id: 'i2', text: 'Shorting the S&P 500 to offset the risk of a large concentrated stock position', bucketId: 'hedge' },
      { id: 'i3', text: 'Betting a company will miss earnings and its stock will fall', bucketId: 'spec' },
      { id: 'i4', text: 'A fund manager shorts sector ETFs to reduce exposure before a macro announcement', bucketId: 'hedge' },
    ],
  },
];

// ─── Lesson 6: Risk Management Capstone ──────────────────────────────────────

const l6Exercises: Exercise[] = [
  {
    id: 'inv4-l5-e1',
    kind: 'miniStory',
    competencyId: 'riskReturn',
    rationale: 'A narrative walk through a leveraged short-squeeze loss makes the abstract danger visceral.',
    panels: [
      { text: 'I shorted GameShop at $20 — I\'m convinced it\'s going bankrupt. I borrowed 500 shares.', speaker: 'Tyler' },
      { text: 'Did you set a stop-loss? What\'s your max loss plan?', speaker: 'Alex' },
      { text: 'I didn\'t set one. The stock is clearly overvalued — it can\'t go much higher.', speaker: 'Tyler' },
      { text: 'A Reddit community just decided to squeeze it. It\'s at $80 now.', speaker: 'Alex' },
      { text: 'I can\'t cover at $80 — I only had $10,000 in my account. My broker is force-closing me.', speaker: 'Tyler' },
    ],
    choicePrompt: 'What risk management mistake did Tyler make that Alex warned about?',
    choices: [
      { id: 'a', text: 'Tyler shorted a stock — shorting is always illegal for retail investors', isCorrect: false, outcome: 'Short selling is legal for retail investors with a margin account. The mistake was the absence of a stop-loss, not the act of shorting.' },
      { id: 'b', text: 'Tyler had no stop-loss or maximum loss plan, and his conviction in a thesis didn\'t eliminate price risk', isCorrect: true, outcome: 'Exactly. A pre-set stop-loss (e.g., cover if stock reaches $30) would have limited the loss to $5,000 instead of a forced close at $80 with potentially catastrophic losses.' },
      { id: 'c', text: 'Tyler had too much cash in his account; he should have used more leverage', isCorrect: false, outcome: 'More leverage would have made the situation far worse. Tyler needed less risk exposure, not more.' },
    ],
  },
  {
    id: 'inv4-l5-e2',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'A position-sizing framework operationalizes risk management into actionable steps.',
    instruction: 'Put these risk management steps in the correct order before entering any leveraged or short trade:',
    items: [
      { id: 's1', text: 'Define your investment thesis and the specific condition that would invalidate it', rank: 1 },
      { id: 's2', text: 'Set a maximum acceptable loss as a percentage of your total portfolio (e.g., 2%)', rank: 2 },
      { id: 's3', text: 'Calculate maximum position size: Max loss $ ÷ (entry price × stop-loss %)', rank: 3 },
      { id: 's4', text: 'Enter the position at calculated size, with a stop-loss order pre-set', rank: 4 },
      { id: 's5', text: 'Monitor and adjust as the thesis evolves — close if the invalidation condition is met', rank: 5 },
    ],
  },
  {
    id: 'inv4-l5-e3',
    kind: 'calculator',
    competencyId: 'riskReturn',
    rationale: 'Calculating net short profit after borrowing costs makes the real cost of shorting tangible.',
    formulaKey: 'portfolioReturn',
    prompt: 'You short 200 shares at $60, cover at $45 after 3 months. Borrowing cost: 5%/year on the $12,000 position. Gross profit = $3,000. Borrowing cost = $150. Calculate your net profit.',
    targetLabel: 'Net Short Profit ($)',
    explanation: 'Net Profit = Gross Profit − Borrowing Cost. Adjust the sliders to see how borrowing costs eat into short profits.',
    inputs: [
      { id: 'grossProfit', label: 'Gross Profit ($)', value: 3000, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'borrowingCost', label: 'Borrowing Cost ($)', value: 150, min: 0, max: 1000, step: 25, prefix: '$' },
    ],
  },
  {
    id: 'inv4-l5-e4',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'A position-sizing decision with real numbers forces application of the 2% rule.',
    story: 'Your portfolio is $25,000. You want to short a $40 stock with a stop-loss at $48 (20% above entry). Using the 2% rule (max $500 loss per trade), how many shares can you short?',
    choices: [
      { id: 'a', text: '62 shares ($500 loss ÷ $8 stop distance = 62.5, round down)', outcome: 'Correct. The 2% rule limits your loss to $500. The stop distance is $48 − $40 = $8/share. Max shares = $500 ÷ $8 = 62.5, rounded down to 62.', isCorrect: true, score: 3 },
      { id: 'b', text: '12 shares ($500 ÷ $40 entry price)', outcome: 'This divides by the entry price, not the stop distance. The stop distance ($8) is what matters for position sizing — it determines how much you lose per share if stopped out.', isCorrect: false, score: 0 },
      { id: 'c', text: '125 shares (2% of $25,000 ÷ $40 per share)', outcome: 'This ignores the stop distance. 125 shares × $8 stop = $1,000 max loss — twice the 2% limit. Position sizing must account for the distance to the stop, not just the entry price.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv4-l5-e5',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Understanding what triggers a short squeeze helps traders anticipate danger zones.',
    prompt: 'Which combination of conditions most increases the risk of a short squeeze?',
    options: [
      { id: 'a', text: 'Low short interest + high trading volume + falling prices', isCorrect: false },
      { id: 'b', text: 'Very high short interest + a positive catalyst (surprise news) + low float', isCorrect: true },
      { id: 'c', text: 'Large institutional buying + stable earnings growth + low volatility', isCorrect: false },
    ],
  },
  {
    id: 'inv4-l5-e6',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'The final synthesis question tests whether the learner can articulate who should and shouldn\'t short.',
    prompt: 'A friend says "I want to short a stock to make money fast." What would you tell them about the risks specific to short selling that don\'t apply to regular stock buying?',
    conceptReveal: 'Three unique risks of shorting: (1) Unlimited loss — a stock can rise 1,000%, but a long position can only fall to zero. (2) Forced cover — your broker can issue a margin call or force-close your position at the worst moment. (3) Borrowing costs and short squeezes — high-demand shorts cost 50%+/year to borrow, and coordinated buying can spike the price violently. Shorting requires a strict loss limit, constant monitoring, and real conviction in your thesis.',
    checkpoints: [
      'Long max loss = 100%; short max loss = unlimited',
      'Margin calls can force you to close at a loss even if your thesis was right',
      'Short squeezes can be triggered by news or coordinated buying and move prices violently',
    ],
  },
];

// ─── Exports ──────────────────────────────────────────────────────────────────

export const riskMarginShortingGuidebook: GuidebookEntry[] = [
  {
    id: 'guide-risk-1',
    title: 'Risk Metrics Cheat Sheet',
    body: '• Standard Deviation: volatility — how wide the return distribution is.\n• Beta: market sensitivity — beta 1.5 means 1.5× the market\'s move.\n• Sharpe Ratio: return per unit of risk — higher is better.\n• Max Drawdown: worst historical peak-to-trough decline.\n\nNo single metric captures all risk. Use them together.',
  },
  {
    id: 'guide-risk-2',
    title: 'Systematic vs Unsystematic Risk',
    body: 'Unsystematic (company-specific) risk can be diversified away by owning 20–30 uncorrelated stocks. You earn no extra return for bearing it.\n\nSystematic (market) risk affects all assets and cannot be diversified away — only hedged with derivatives or reduced by holding lower-beta assets. This is the only risk the market compensates you for through higher expected returns.',
  },
  {
    id: 'guide-risk-3',
    title: 'How Margin Works',
    body: 'Initial margin (Reg T: 50%): minimum equity to open a leveraged position.\nMaintenance margin (~25%): minimum ongoing equity — falling below triggers a margin call.\n\nMargin interest accrues daily. A 2× leveraged position amplifies both gains and losses by 2×. Margin calls can force you to sell at the worst moment — always know your break-even.',
  },
  {
    id: 'guide-risk-4',
    title: 'Short Selling at a Glance',
    body: 'Mechanics: Borrow shares → sell at current price → wait for decline → buy back (cover) → return shares → keep the difference.\n\nUnique risks vs. long positions:\n• Max loss is theoretically unlimited (stock can rise without limit)\n• Borrowing costs (can reach 50%+/year for hard-to-borrow stocks)\n• Short squeeze: forced cover into a rapidly rising price\n• Margin calls can close your position at the worst moment',
  },
  {
    id: 'guide-risk-5',
    title: 'Position Sizing: The 2% Rule',
    body: 'Never risk more than 2% of your portfolio on a single trade.\n\nFormula: Max shares = (Portfolio × 2%) ÷ Stop distance per share\n\nExample: $20,000 portfolio, short at $50, stop at $60:\nMax loss = $400. Stop distance = $10/share. Max shares = $400 ÷ $10 = 40 shares.\n\nSizing to your stop — not to your conviction — keeps catastrophic losses survivable.',
  },
];

export const riskMarginShortingLessons: Record<string, Lesson> = {
  'inv4-l1': makeLesson('inv4-l1', 'Measuring Risk', l1Exercises, 65),
  'inv4-l2': makeLesson('inv4-l2', 'Systematic vs Unsystematic Risk', l2Exercises, 70),
  'inv4-l3': makeLesson('inv4-l3', 'Margin Accounts', l3Exercises, 80),
  'inv4-practice': makeLesson('inv4-practice', 'Mixed Practice', l4PracticeExercises, 50),
  'inv4-l4': makeLesson('inv4-l4', 'Short Selling Mechanics', l5Exercises, 90),
  'inv4-l5': makeLesson('inv4-l5', 'Risk Management Capstone', l6Exercises, 110),
};

export const riskMarginShortingUnit: PathUnit = {
  id: 'unit-risk-9',
  title: 'Risk, Margin & Short Selling',
  subtitle: 'Understand leverage before you use it',
  color: '#9B4CBE',
  icon: '⚖️',
  trackId: 'investing',
  competencyIds: ['riskReturn', 'portfolioConstruction'],
  nodes: [
    { id: 'inv4-l1-node',       type: 'lesson',   position: ZIG[0]!, lessonId: 'inv4-l1' },
    { id: 'inv4-l2-node',       type: 'lesson',   position: ZIG[1]!, lessonId: 'inv4-l2' },
    { id: 'inv4-l3-node',       type: 'lesson',   position: ZIG[2]!, lessonId: 'inv4-l3' },
    { id: 'inv4-practice-node', type: 'practice', position: ZIG[3]!, lessonId: 'inv4-practice' },
    { id: 'inv4-chest',         type: 'chest',    position: ZIG[4]!, chestReward: { brainBucks: 75, xp: 30 } },
    { id: 'inv4-l4-node',       type: 'lesson',   position: ZIG[5]!, lessonId: 'inv4-l4' },
    { id: 'inv4-l5-node',       type: 'lesson',   position: ZIG[6]!, lessonId: 'inv4-l5' },
    { id: 'inv4-trophy',        type: 'trophy',   position: ZIG[7]! },
  ],
  guidebook: riskMarginShortingGuidebook,
  masteryThreshold: 65,
};
