/**
 * Unit 1 — Intro to Investing
 * Unlocks the Invest tab (featureUnlocks key: 'investTab')
 * Lesson IDs: inv1-l1, inv1-l2, inv1-l3, inv1-practice, inv1-l4, inv1-l5
 */
import type { Lesson } from '../../types/lesson';
import type { Exercise, GuidebookEntry, PathUnit } from '../../types/learn';

// ─── Helper ──────────────────────────────────────────────────────────────────

function makeLesson(
  id: string,
  title: string,
  exercises: Exercise[],
  xp: number,
): Lesson {
  return {
    id, title,
    domain: 'investing', level: 'beginner',
    unitId: 'unit-investing-6', unitTitle: 'Intro to Investing',
    courseTrackId: 'investing', moduleId: 'investing-foundations',
    durationMinutes: Math.max(4, Math.round(exercises.length * 1.3)),
    xp, prerequisites: [], difficulty: 1, learningObjectives: [`Understand and apply: ${title}.`],
    competencyIds: ['riskReturn', 'portfolioConstruction'],
    competencyTags: ['investing'],
    masteryWeight: 1, formulaRefs: [], misconceptions: [], steps: [], exercises,
  };
}

const ZIG: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center',
];

// ─── Lesson 1: Why Invest? ────────────────────────────────────────────────────

const l1Exercises: Exercise[] = [
  {
    id: 'inv1-l1-e1',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Connecting saving and investing reveals why parking cash long-term is a losing strategy.',
    prompt: 'If you put $10,000 in a savings account paying 0.5% for 10 years, do you think you\'ll have more or less real purchasing power at the end? Why?',
    conceptReveal: 'With inflation averaging ~3%/year and a 0.5% savings rate, your real return is −2.5%/year. After 10 years your $10,000 buys what $7,812 buys today. Investing in assets that outpace inflation is how you actually grow wealth.',
    checkpoints: [
      'Savings accounts rarely beat inflation — money loses real value',
      'Real return = nominal return − inflation rate',
      'Investing is how you stay ahead of rising prices over time',
    ],
  },
  {
    id: 'inv1-l1-e2',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'A savings account with a 0.5% yield feels safe, but 3% inflation means purchasing power shrinks every year — that is a guaranteed real loss.',
    statement: 'Keeping cash in a savings account yielding 0.5% while inflation runs at 3% means your money is growing in real terms.',
    isTrue: false,
  },
  {
    id: 'inv1-l1-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Real return = nominal return − inflation. 6% − 3% = 3% real. The other answers confuse nominal and real.',
    prompt: 'Your investment earns 6% per year. Inflation is 3%. What is your real return?',
    options: [
      { id: 'a', text: '9% — add them together', isCorrect: false },
      { id: 'b', text: '3% — subtract inflation from the nominal return', isCorrect: true },
      { id: 'c', text: '6% — inflation does not affect investment returns', isCorrect: false },
      { id: 'd', text: '2% — divide by inflation', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l1-e4',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'Three core reasons to invest: beat inflation, grow toward goals, and build long-term wealth.',
    template: 'People invest to ___ inflation, grow money toward ___, and build ___ wealth.',
    blanks: ['beat', 'goals', 'long-term'],
    wordBank: ['beat', 'ignore', 'goals', 'budgets', 'long-term', 'short-term', 'risky'],
  },
  {
    id: 'inv1-l1-e5',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Distinguishing inflation-beating assets from assets that lose to inflation is the core insight of this lesson.',
    instruction: 'Sort each asset by whether it typically beats or lags inflation over 10+ years.',
    buckets: [
      { id: 'beats', label: 'Beats inflation long-term' },
      { id: 'lags', label: 'Lags inflation long-term' },
    ],
    items: [
      { id: 'stocks', text: 'Diversified stock index fund (~7-10% avg return)', bucketId: 'beats' },
      { id: 'savings', text: 'Savings account at 0.5% APY', bucketId: 'lags' },
      { id: 'property', text: 'Real estate (historically)', bucketId: 'beats' },
      { id: 'mattress', text: 'Cash under a mattress', bucketId: 'lags' },
      { id: 'bonds', text: 'Diversified bond fund (~3-5% avg return)', bucketId: 'beats' },
      { id: 'checking', text: 'Checking account earning 0%', bucketId: 'lags' },
    ],
  },
  {
    id: 'inv1-l1-e6',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'Morgan\'s "safe" approach is actually the riskiest over time — guaranteed real loss to inflation. Starting to invest, even with a small portion, is the correct first step.',
    story: 'Morgan, 24, just started working and earns $3,000/month. Morgan has $5,000 saved and keeps it all in a checking account "until it feels safe to invest." Ten years later, inflation has eroded 26% of its purchasing power. What should Morgan have done?',
    choices: [
      { id: 'a', text: 'Invest most of it in a diversified fund while keeping a small cash buffer', outcome: 'Even a conservative 5% annual return would have more than doubled the real value. Starting early is the key lever.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Move it all to a higher-yield savings account', outcome: 'Better than 0%, but high-yield savings at 4-5% barely keeps pace with inflation and trails stock market returns over decades.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Wait — it\'s still early in Morgan\'s career, no rush', outcome: 'Every year of delay is years of compounding lost. Waiting until it "feels safe" costs dramatically more than starting small today.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv1-l1-e7',
    kind: 'matchPairs',
    competencyId: 'riskReturn',
    rationale: 'These four terms are the core vocabulary for understanding why idle cash loses value.',
    instruction: 'Match each term to its meaning.',
    pairs: [
      { id: 'infl', term: 'Inflation', definition: 'The gradual rise in prices that erodes purchasing power' },
      { id: 'nom', term: 'Nominal return', definition: 'Your headline % gain before subtracting inflation' },
      { id: 'real', term: 'Real return', definition: 'Your gain after subtracting inflation' },
      { id: 'pp', term: 'Purchasing power', definition: 'How much your money can actually buy' },
    ],
  },
  {
    id: 'inv1-l1-e8',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'Over long periods, assets that grow faster than inflation preserve the most purchasing power. Cash preserves the least.',
    instruction: 'Order these from BEST to WORST at protecting purchasing power over 20 years.',
    items: [
      { id: 's1', text: 'Diversified stock index fund (~7-10%/yr)', rank: 1 },
      { id: 's2', text: 'Diversified bond fund (~3-5%/yr)', rank: 2 },
      { id: 's3', text: 'High-yield savings account (~4%)', rank: 3 },
      { id: 's4', text: 'Cash under a mattress (0%)', rank: 4 },
    ],
  },
  {
    id: 'inv1-l1-e9',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Rule of 72 works for inflation too: 72 ÷ 3 ≈ 24 years for prices to double and cash to lose half its value.',
    prompt: 'If inflation averages 3% per year, roughly how long until prices double — meaning idle cash buys only half as much?',
    options: [
      { id: 'a', text: 'About 24 years', isCorrect: true },
      { id: 'b', text: 'About 10 years', isCorrect: false },
      { id: 'c', text: 'About 50 years', isCorrect: false },
      { id: 'd', text: 'About 3 years', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l1-e10',
    kind: 'miniStory',
    competencyId: 'riskReturn',
    rationale: '"Playing it safe" with cash is actually a guaranteed slow loss to inflation, while investing grows real wealth.',
    panels: [
      { text: 'Dana and Priya each receive $10,000. Dana keeps hers in checking "to be safe." Priya invests hers in a diversified index fund.', speaker: 'Narrator' },
      { text: 'Twenty years later, inflation averaged 3%. Dana\'s account still reads $10,000 — but it buys what ~$5,500 buys today. Priya\'s grew to about $38,000.', speaker: 'Narrator' },
    ],
    choicePrompt: 'Why did "playing it safe" cost Dana so much?',
    choices: [
      { id: 'a', text: 'Idle cash silently loses purchasing power to inflation every single year', isCorrect: true, outcome: 'Exactly. Doing "nothing" is not neutral — it locks in a guaranteed real loss while inflation marches on.' },
      { id: 'b', text: 'She actually came out ahead by avoiding all risk', isCorrect: false, outcome: 'Her nominal balance never fell, but her real wealth shrank by nearly half. Avoiding market risk exposed her fully to inflation risk.' },
    ],
  },
];

// ─── Lesson 2: The Magic of Compounding ──────────────────────────────────────

const l2Exercises: Exercise[] = [
  {
    id: 'inv1-l2-e1',
    kind: 'sliderPlayground',
    competencyId: 'riskReturn',
    rationale: 'The curve bends upward sharply after year 20 — that is compounding in action. Each year earns interest on previous interest, not just the original principal. Notice how the last 10 years add far more than the first 10.',
    prompt: 'Drag the years slider and watch $1,000 grow. Notice when the curve starts to bend.',
    explanation: 'Future Value = Principal × (1 + rate)ⁿ',
    targetLabel: 'Future value',
    formulaKey: 'compoundGrowth',
    inputs: [
      { id: 'principal', label: 'Starting amount', value: 1000, min: 1000, max: 1000, step: 1, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 7, max: 7, step: 1, suffix: '%' },
      { id: 'years', label: 'Years invested', value: 10, min: 1, max: 40, step: 1 },
    ],
    graph: { xInputId: 'years', xLabel: 'Years', yLabel: 'Value ($)' },
  },
  {
    id: 'inv1-l2-e2',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: '$1,000 x 1.07^30 is about $7,612, nearly 8 times the original. Simple interest (no compounding) would give only about $3,100.',
    prompt: 'You invest $1,000 at 7% per year for 30 years and leave it alone. About how much will it be worth?',
    options: [
      { id: 'a', text: 'About $7,612', isCorrect: true },
      { id: 'b', text: 'About $3,100 (simple interest, no compounding)', isCorrect: false },
      { id: 'c', text: 'About $2,100', isCorrect: false },
      { id: 'd', text: 'About $30,000', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l2-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Rule of 72: years to double = 72 ÷ annual return. At 8% → 72/8 = 9 years.',
    prompt: 'Using the Rule of 72, approximately how many years does it take to double your money at 8% annual return?',
    options: [
      { id: 'a', text: '5 years', isCorrect: false },
      { id: 'b', text: '9 years', isCorrect: true },
      { id: 'c', text: '12 years', isCorrect: false },
      { id: 'd', text: '16 years', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l2-e4',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'The Rule of 72 is a quick mental-math tool for doubling time — vital for comparing investment options.',
    template: 'Rule of 72: divide ___ by the annual return rate to estimate the years to ___ your money.',
    blanks: ['72', 'double'],
    wordBank: ['72', '100', 'double', 'triple', 'interest', 'rate'],
  },
  {
    id: 'inv1-l2-e5',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Starting 10 years earlier at the same rate can result in 2× or more wealth at retirement — the time variable is exponential, not linear.',
    statement: 'Investing $5,000/year starting at age 25 versus age 35 produces roughly the same retirement wealth, since you\'re contributing the same amount.',
    isTrue: false,
  },
  {
    id: 'inv1-l2-e6',
    kind: 'matchPairs',
    competencyId: 'riskReturn',
    rationale: 'These are the four core compound-growth variables every investor must understand to reason about portfolios.',
    instruction: 'Match each compounding concept to its correct definition.',
    pairs: [
      { id: 'principal', term: 'Principal', definition: 'The original sum of money invested' },
      { id: 'rate', term: 'Rate of return', definition: 'Annual percentage gain on the investment' },
      { id: 'time', term: 'Time horizon', definition: 'Number of years the money stays invested' },
      { id: 'rule72', term: 'Rule of 72', definition: 'Divide 72 by the rate to estimate years to double' },
    ],
  },
  {
    id: 'inv1-l2-e7',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Compounding is helped by time, higher returns, and reinvestment — and hurt by early withdrawals, fees, and delay.',
    instruction: 'Sort each factor by its effect on your final compounded balance.',
    buckets: [
      { id: 'up', label: 'Increases final value' },
      { id: 'down', label: 'Decreases final value' },
    ],
    items: [
      { id: 'early', text: 'Starting to invest earlier', bucketId: 'up' },
      { id: 'rate', text: 'Earning a higher annual return', bucketId: 'up' },
      { id: 'reinvest', text: 'Reinvesting your dividends', bucketId: 'up' },
      { id: 'withdraw', text: 'Withdrawing your gains every year', bucketId: 'down' },
      { id: 'fees', text: 'Paying high annual fees', bucketId: 'down' },
      { id: 'delay', text: 'Waiting 10 years to begin', bucketId: 'down' },
    ],
  },
  {
    id: 'inv1-l2-e8',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'A higher rate and more years both compound — but the exponent (years) and rate together decide the gap. Rank by final balance.',
    instruction: 'Order these from LARGEST to SMALLEST ending balance (all start at $1,000).',
    items: [
      { id: 's1', text: '$1,000 at 10% for 30 years (~$17,449)', rank: 1 },
      { id: 's2', text: '$1,000 at 7% for 30 years (~$7,612)', rank: 2 },
      { id: 's3', text: '$1,000 at 7% for 20 years (~$3,870)', rank: 3 },
      { id: 's4', text: '$1,000 at 7% for 10 years (~$1,967)', rank: 4 },
    ],
  },
  {
    id: 'inv1-l2-e9',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'The classic early-vs-late saver puzzle: Ben\'s 10 early years compound for decades and often beat Cara\'s 30 later years, despite Cara contributing 3× more.',
    story: 'Ben invests $200/month from age 25 to 35 (10 years), then never adds another dollar. Cara invests $200/month from age 35 to 65 (30 years). Both earn 8%. At 65, who has more?',
    choices: [
      { id: 'a', text: 'Ben — his early decade compounds for 40 years, often beating Cara\'s larger but later contributions', outcome: 'Correct — and surprising. Ben put in $24k, Cara put in $72k, yet Ben often ends up ahead. Time in the market is the dominant lever.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Cara — she contributed three times as much money', outcome: 'More contributions help, but they started 10 years later. Those missing early years of compounding are extremely hard to make up.', isCorrect: false, score: 1 },
      { id: 'c', text: 'They tie — same $200/month', outcome: 'They don\'t tie. The timing of the dollars matters enormously because early dollars compound the longest.', isCorrect: false, score: 0 },
    ],
  },
  {
    id: 'inv1-l2-e10',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Articulating the cost of delay cements why starting now beats starting bigger later.',
    prompt: 'A friend says "I\'ll start investing once I earn more — a few years won\'t matter." Using compounding, why is waiting so costly?',
    conceptReveal: 'Your earliest dollars compound the longest, so they do the heaviest lifting. Delaying even 5 years can cut your final balance by 30% or more, because you lose the years where growth builds on previous growth. The size of your contributions matters far less than how early they start working.',
    checkpoints: [
      'Early dollars have the most time to compound — they grow the most',
      'A 5-10 year delay can permanently shrink your final balance',
      'Starting small now beats starting big later',
    ],
  },
];

// ─── Lesson 3: Risk vs. Return ────────────────────────────────────────────────

const l3Exercises: Exercise[] = [
  {
    id: 'inv1-l3-e1',
    kind: 'sliderPlayground',
    competencyId: 'riskReturn',
    rationale: 'At 5% for 30 years $10,000 grows to $43k. At 8% it reaches $100k. That 3% difference — the reward for accepting more risk — is why asset allocation matters more than almost any other decision.',
    prompt: 'Drag the annual return slider. See how a 1% difference compounds into a massive gap over 30 years.',
    explanation: 'Future Value = $10,000 × (1 + rate)³⁰',
    targetLabel: 'Value after 30 years',
    formulaKey: 'compoundGrowth',
    inputs: [
      { id: 'principal', label: 'Starting amount', value: 10000, min: 10000, max: 10000, step: 1, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 5, min: 1, max: 12, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years invested', value: 30, min: 30, max: 30, step: 1 },
    ],
    graph: { xInputId: 'rate', xLabel: 'Annual return (%)', yLabel: 'Value ($)' },
  },
  {
    id: 'inv1-l3-e2',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Ordering assets by risk level is the foundation of building an age-appropriate portfolio.',
    instruction: 'Sort each asset by its typical risk level.',
    buckets: [
      { id: 'low', label: 'Lower risk' },
      { id: 'medium', label: 'Medium risk' },
      { id: 'high', label: 'Higher risk' },
    ],
    items: [
      { id: 'tbill', text: 'US Treasury bonds', bucketId: 'low' },
      { id: 'sp500', text: 'S&P 500 index fund', bucketId: 'medium' },
      { id: 'btc', text: 'Bitcoin', bucketId: 'high' },
      { id: 'muni', text: 'Municipal bond fund', bucketId: 'low' },
      { id: 'growth', text: 'Single high-growth tech stock', bucketId: 'high' },
      { id: 'balanced', text: 'Balanced 60/40 stocks-bonds fund', bucketId: 'medium' },
    ],
  },
  {
    id: 'inv1-l3-e3',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Risk tolerance is a personal assessment — it combines your financial ability to absorb loss AND your emotional comfort with volatility.',
    prompt: 'Which factor does NOT directly affect an investor\'s risk tolerance?',
    options: [
      { id: 'a', text: 'Their investment time horizon', isCorrect: false },
      { id: 'b', text: 'Their emotional comfort with market drops', isCorrect: false },
      { id: 'c', text: 'The colour of the investment platform\'s app icon', isCorrect: true },
      { id: 'd', text: 'Their financial ability to absorb potential losses', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l3-e4',
    kind: 'matchPairs',
    competencyId: 'riskReturn',
    rationale: 'These four terms are the vocabulary of every risk discussion. Understanding them prevents costly emotional mistakes.',
    instruction: 'Match each risk concept to its definition.',
    pairs: [
      { id: 'vol', term: 'Volatility', definition: 'How much an asset\'s price swings up and down' },
      { id: 'drawdown', term: 'Drawdown', definition: 'Peak-to-trough decline in an investment\'s value' },
      { id: 'div', term: 'Diversification', definition: 'Spreading money across assets to reduce total risk' },
      { id: 'tol', term: 'Risk tolerance', definition: 'How much potential loss you can comfortably accept' },
    ],
  },
  {
    id: 'inv1-l3-e5',
    kind: 'trueFalse',
    competencyId: 'riskReturn',
    rationale: 'Diversification reduces unsystematic (company-specific) risk without eliminating systematic (market-wide) risk — and it does NOT require sacrificing proportional expected return.',
    statement: 'Diversifying your portfolio by holding many assets always reduces your expected returns by the same amount it reduces your risk.',
    isTrue: false,
  },
  {
    id: 'inv1-l3-e6',
    kind: 'scenarioDecision',
    competencyId: 'riskReturn',
    rationale: 'Jamie\'s 30-year horizon and stable income signal a higher risk tolerance — a stock-heavy portfolio is appropriate. Bonds-only is too conservative and will likely underperform inflation after taxes.',
    story: 'Jamie, 28, is starting a retirement account. Goal: retire at 58. Stable job, no debt, $500/month to invest. An advisor offers two options: (A) 90% global stock index, 10% bonds; (B) 90% bonds, 10% stocks. Which fits Jamie\'s risk profile?',
    choices: [
      { id: 'a', text: 'Option A — stock-heavy; Jamie has 30 years to ride out market swings', outcome: 'Correct. A 30-year horizon means short-term volatility is recoverable. Stock-heavy portfolios historically deliver ~3× more wealth at retirement for this time horizon.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Option B — bonds; safer is always better', outcome: 'Safer is not always better for long horizons. At 30 years out, "safety" via bonds likely means a much smaller retirement fund. Bonds barely beat inflation over long periods.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Split 50/50 — compromise is always wisest', outcome: 'A 50/50 split reduces return significantly without meaningful benefit when the investor is 30 years from retirement. Risk tolerance should drive the decision, not a default compromise.', isCorrect: false, score: 1 },
    ],
  },
  {
    id: 'inv1-l3-e7',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'The extra return investors demand for accepting risk is the "risk premium" — the engine of the risk-return relationship.',
    template: 'Higher expected returns come with higher ___. The extra return you demand for taking it on is called the risk ___.',
    blanks: ['risk', 'premium'],
    wordBank: ['risk', 'premium', 'reward', 'safety', 'discount', 'return'],
  },
  {
    id: 'inv1-l3-e8',
    kind: 'tapToOrder',
    competencyId: 'riskReturn',
    rationale: 'Ranking assets along the risk spectrum is the foundation of matching a portfolio to your risk tolerance.',
    instruction: 'Order these from LOWEST to HIGHEST typical risk.',
    items: [
      { id: 's1', text: 'Insured savings account', rank: 1 },
      { id: 's2', text: 'US Treasury bond', rank: 2 },
      { id: 's3', text: 'Broad stock index fund', rank: 3 },
      { id: 's4', text: 'Single high-growth stock', rank: 4 },
      { id: 's5', text: 'Speculative crypto token', rank: 5 },
    ],
  },
  {
    id: 'inv1-l3-e9',
    kind: 'miniStory',
    competencyId: 'riskReturn',
    rationale: 'A paper loss feels like a real one. Recognising your emotional reaction helps you size risk you can actually live with — without abandoning a sound long-term plan.',
    panels: [
      { text: 'Riley, 30, builds a stock-heavy portfolio for retirement. Three months in, the market falls 18%.', speaker: 'Narrator' },
      { text: 'Riley feels sick watching the balance drop and is tempted to sell everything and "wait until things calm down."', speaker: 'Narrator' },
    ],
    choicePrompt: 'What does Riley\'s reaction reveal?',
    choices: [
      { id: 'a', text: 'Riley\'s true risk tolerance may be lower than the portfolio assumed — but with 30 years left, staying invested is still the wise move', isCorrect: true, outcome: 'Right. The feeling is real data about risk tolerance, but selling locks in the loss. A slightly less aggressive mix Riley can hold through dips beats an aggressive one they bail on.' },
      { id: 'b', text: 'Riley should sell now and buy back once the market looks safe', isCorrect: false, outcome: 'That\'s market timing — it usually means selling low and buying back higher. The drop is recoverable over a 30-year horizon.' },
    ],
  },
  {
    id: 'inv1-l3-e10',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Connecting risk level to time horizon is the practical payoff of the whole lesson.',
    prompt: 'Your cousin is saving both for a house deposit she needs in 2 years and for retirement in 35 years. Should both pots take the same risk? Why or why not?',
    conceptReveal: 'No — time horizon should drive risk. The 2-year house fund can\'t recover from a crash in time, so it belongs in low-risk cash or short-term bonds. The 35-year retirement fund can ride out volatility, so it can hold more stocks for higher expected growth. Always match an asset\'s risk to when you\'ll need the money.',
    checkpoints: [
      'Short horizons → low risk (you can\'t wait out a crash)',
      'Long horizons → more risk is appropriate (time smooths volatility)',
      'The same person can hold different risk levels for different goals',
    ],
  },
];

// ─── Mixed Practice ───────────────────────────────────────────────────────────

const practiceExercises: Exercise[] = [
  l1Exercises[1]!, // T/F: savings at 0.5% vs 3% inflation
  l2Exercises[2]!, // MC: Rule of 72 at 8%
  l3Exercises[1]!, // categorize: risk levels
  {
    id: 'inv1-practice-recap',
    kind: 'recallPrompt',
    competencyId: 'riskReturn',
    rationale: 'Linking inflation, compounding, and risk-return synthesises the three core building blocks of investing.',
    prompt: 'Connect the three ideas: how do inflation, compound growth, and risk-return trade-off work together to shape an investing strategy?',
    conceptReveal: 'Inflation is the enemy of idle cash — investing is the defence. Compounding is the engine — the longer you invest, the more your returns compound. Risk-return determines the fuel — higher risk assets grow faster, but suit longer horizons and investors who can stomach the swings.',
    checkpoints: [
      'Inflation = reason to invest rather than save passively',
      'Compounding = reason to start early and stay invested',
      'Risk-return = reason to match portfolio risk to your time horizon',
    ],
  },
  {
    id: 'inv1-pr-n1',
    kind: 'multipleChoice',
    competencyId: 'riskReturn',
    rationale: 'Real return = nominal − inflation. 8% − 3.5% = 4.5%.',
    prompt: 'An investment returns 8% this year while inflation runs at 3.5%. What is your real return?',
    options: [
      { id: 'a', text: '11.5%', isCorrect: false },
      { id: 'b', text: '4.5%', isCorrect: true },
      { id: 'c', text: '8%', isCorrect: false },
      { id: 'd', text: '2.3%', isCorrect: false },
    ],
  },
  {
    id: 'inv1-pr-n2',
    kind: 'fillBlank',
    competencyId: 'riskReturn',
    rationale: 'The Rule of 72 estimates doubling time: 72 ÷ annual return.',
    template: 'To estimate the years it takes to double your money, divide ___ by your annual return rate.',
    blanks: ['72'],
    wordBank: ['72', '100', '10', '50'],
  },
  {
    id: 'inv1-pr-n3',
    kind: 'categorize',
    competencyId: 'riskReturn',
    rationale: 'Reinforces which assets historically beat inflation over the long run.',
    instruction: 'Sort each by whether it typically beats or lags inflation over 10+ years.',
    buckets: [
      { id: 'beats', label: 'Beats inflation' },
      { id: 'lags', label: 'Lags inflation' },
    ],
    items: [
      { id: 'index', text: 'Total stock market index fund', bucketId: 'beats' },
      { id: 'reit', text: 'Real estate over decades', bucketId: 'beats' },
      { id: 'cash', text: 'Cash in a 0% checking account', bucketId: 'lags' },
      { id: 'cd', text: 'A 0.5% savings account', bucketId: 'lags' },
    ],
  },
  {
    id: 'inv1-pr-n4',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'A 35-year horizon can absorb short-term volatility, so a stock-heavy allocation is appropriate.',
    statement: 'A 25-year-old investing for retirement 35 years away can reasonably hold a stock-heavy portfolio.',
    isTrue: true,
  },
  {
    id: 'inv1-pr-n5',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'Reinforces the standard sequence for a sound long-term investing approach.',
    instruction: 'Order the steps of a sound long-term investing plan.',
    items: [
      { id: 's1', text: 'Set your goal, time horizon, and risk tolerance', rank: 1 },
      { id: 's2', text: 'Choose a diversified portfolio at that risk level', rank: 2 },
      { id: 's3', text: 'Automate regular contributions', rank: 3 },
      { id: 's4', text: 'Stay invested and review annually', rank: 4 },
    ],
  },
  {
    id: 'inv1-pr-n6',
    kind: 'matchPairs',
    competencyId: 'riskReturn',
    rationale: 'A mixed vocabulary check across inflation, compounding, and risk.',
    instruction: 'Match each concept to its definition.',
    pairs: [
      { id: 'p1', term: 'Real return', definition: 'Nominal return minus inflation' },
      { id: 'p2', term: 'Rule of 72', definition: 'Quick estimate of years to double your money' },
      { id: 'p3', term: 'Diversification', definition: 'Spreading money across assets to reduce risk' },
      { id: 'p4', term: 'Compounding', definition: 'Earning returns on your previous returns' },
    ],
  },
];

// ─── Lesson 4: Time Horizon & Patience ───────────────────────────────────────

const l4Exercises: Exercise[] = [
  {
    id: 'inv1-l4-e1',
    kind: 'sliderPlayground',
    competencyId: 'portfolioConstruction',
    rationale: 'Starting at 25 instead of 35 — investing for 40 years rather than 30 — with $10,000 at 7% is the difference between $149k and $76k. Not from saving more, just from giving compounding more time. Every year of delay costs more than the last.',
    prompt: 'Move the years slider. See what starting earlier — or later — does to the same $10,000 at 7%.',
    explanation: 'Future Value = $10,000 × (1 + 7%)ⁿ',
    targetLabel: 'Value at retirement',
    formulaKey: 'compoundGrowth',
    inputs: [
      { id: 'principal', label: 'Starting amount', value: 10000, min: 10000, max: 10000, step: 1, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 7, max: 7, step: 1, suffix: '%' },
      { id: 'years', label: 'Years invested', value: 20, min: 5, max: 40, step: 1 },
    ],
    graph: { xInputId: 'years', xLabel: 'Years invested', yLabel: 'Value ($)' },
  },
  {
    id: 'inv1-l4-e2',
    kind: 'miniStory',
    competencyId: 'behavior',
    rationale: 'Market timing — selling during crashes and buying back "at the right time" — is the most common way retail investors destroy returns.',
    panels: [
      { text: 'Alex invested $10,000 in an index fund in January. By March the market dropped 25%. Alex panicked and sold, moving everything to cash.', speaker: 'Narrator' },
      { text: 'By December the market had fully recovered and hit a new high. Alex never reinvested — "waiting for it to drop again."', speaker: 'Narrator' },
    ],
    choicePrompt: 'What was Alex\'s fundamental mistake?',
    choices: [
      { id: 'a', text: 'Trying to time the market instead of staying invested', outcome: 'Exactly. By selling at the bottom and missing the recovery, Alex locked in a 25% loss. Staying invested through the dip would have recovered everything and then some.', isCorrect: true },
      { id: 'b', text: 'Investing in January — timing the entry was wrong', outcome: 'Entry timing matters far less than staying invested. The real loss came from selling during the drop, not from when Alex started.', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l4-e3',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: '"Time in the market beats timing the market" is one of the most empirically supported principles in personal finance.',
    prompt: 'Which statement best reflects the evidence on market timing?',
    options: [
      { id: 'a', text: 'Professional fund managers consistently time the market successfully', isCorrect: false },
      { id: 'b', text: 'Time in the market consistently beats timing the market for retail investors', isCorrect: true },
      { id: 'c', text: 'Selling during crashes and re-entering later maximises returns', isCorrect: false },
      { id: 'd', text: 'Short-term trading is the primary way investors build wealth', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l4-e4',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'This sequence summarises the correct approach to long-term investing — set it, stay the course, and adjust only as the horizon shortens.',
    instruction: 'Order these steps for a sound long-term investment approach.',
    items: [
      { id: 's1', text: 'Determine your time horizon and risk tolerance', rank: 1 },
      { id: 's2', text: 'Choose a diversified portfolio matching that risk level', rank: 2 },
      { id: 's3', text: 'Set up automatic contributions and stay invested', rank: 3 },
      { id: 's4', text: 'Ignore short-term market noise and review annually', rank: 4 },
      { id: 's5', text: 'Gradually reduce risk as your horizon shortens', rank: 5 },
    ],
  },
  {
    id: 'inv1-l4-e5',
    kind: 'fillBlank',
    competencyId: 'behavior',
    rationale: 'The two emotional enemies of long-term investing are fear (selling in crashes) and greed (chasing hot assets). Staying the course defeats both.',
    template: 'The two emotional enemies of long-term investing are ___ (selling when markets fall) and ___ (chasing recent winners).',
    blanks: ['fear', 'greed'],
    wordBank: ['fear', 'greed', 'patience', 'doubt', 'excitement', 'caution'],
  },
  {
    id: 'inv1-l4-e6',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Missing the 10 best trading days in any decade roughly halves long-term returns — being out of the market on those days is extremely costly.',
    statement: 'Missing just the 10 best market days in a 20-year period has almost no impact on your final return because there are thousands of trading days.',
    isTrue: false,
  },
  {
    id: 'inv1-l4-e7',
    kind: 'matchPairs',
    competencyId: 'behavior',
    rationale: 'These four terms describe the behaviours that separate disciplined long-term investors from reactive ones.',
    instruction: 'Match each term to its meaning.',
    pairs: [
      { id: 'tim', term: 'Time in the market', definition: 'Staying invested through ups and downs' },
      { id: 'timing', term: 'Market timing', definition: 'Trying to buy low and sell high on predictions' },
      { id: 'dca', term: 'Dollar-cost averaging', definition: 'Investing a fixed amount on a set schedule' },
      { id: 'vol', term: 'Volatility', definition: 'The size of short-term swings in price' },
    ],
  },
  {
    id: 'inv1-l4-e8',
    kind: 'categorize',
    competencyId: 'behavior',
    rationale: 'Sorting helpful from harmful habits builds the behavioural discipline long-term investing requires.',
    instruction: 'Sort each habit by its effect on long-term returns.',
    buckets: [
      { id: 'help', label: 'Helps returns' },
      { id: 'hurt', label: 'Hurts returns' },
    ],
    items: [
      { id: 'auto', text: 'Automating monthly contributions', bucketId: 'help' },
      { id: 'reinv', text: 'Reinvesting dividends', bucketId: 'help' },
      { id: 'ignore', text: 'Ignoring short-term headlines', bucketId: 'help' },
      { id: 'panic', text: 'Selling everything during a crash', bucketId: 'hurt' },
      { id: 'check', text: 'Checking the balance hourly and reacting', bucketId: 'hurt' },
      { id: 'chase', text: 'Chasing last year\'s hottest fund', bucketId: 'hurt' },
    ],
  },
  {
    id: 'inv1-l4-e9',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'Downturns are when disciplined contributors buy the most shares per dollar — the opposite of the panic instinct.',
    story: 'The market just fell 22% in a month. Sasha is 32 with a retirement account she won\'t touch for 30 years. What is the wisest move?',
    choices: [
      { id: 'a', text: 'Keep contributing on schedule — the downturn lets each contribution buy more shares', outcome: 'Correct. For a long-horizon investor, a drop is effectively a sale. Automatic contributions during dips lower your average cost.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Sell to cash and wait for a clear bottom', outcome: 'Bottoms are only obvious in hindsight. Selling locks in the loss and risks missing the sharp recovery days.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Pause contributions until the market recovers', outcome: 'Pausing means you skip buying exactly when shares are cheapest — the costliest time to sit out.', isCorrect: false, score: 1 },
    ],
  },
  {
    id: 'inv1-l4-e10',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Stating the principle in their own words confirms the learner can apply it under pressure.',
    prompt: 'Explain why "time in the market beats timing the market" for a typical retail investor.',
    conceptReveal: 'A handful of the market\'s best days drive most long-term returns, and they often cluster right after big drops. To time the market you must be right twice — when to sell and when to buy back — which almost no one does consistently. Missing just the 10 best days over 20 years can roughly halve your return. Staying invested guarantees you capture those days.',
    checkpoints: [
      'The best days cluster near the worst days — being out risks missing them',
      'Timing requires being right twice; staying invested requires being right zero times',
      'Missing a few key days dramatically lowers long-term returns',
    ],
  },
];

// ─── Lesson 5: First Investment (scenario capstone) ───────────────────────────

const l5Exercises: Exercise[] = [
  {
    id: 'inv1-l5-e1',
    kind: 'miniStory',
    competencyId: 'portfolioConstruction',
    rationale: 'This capstone puts the whole unit\'s framework into practice through a realistic first-investment decision.',
    panels: [
      { text: 'Sam, 22, just landed their first real job. Net pay: $2,800/month. Expenses: $2,100. Monthly surplus: $700. Has $1,000 emergency fund (needs 3 months = ~$4,500 total). No investments yet.', speaker: 'Narrator' },
      { text: 'Sam\'s cousin says: "Just put your $700/month into crypto — it goes up fast." Sam\'s manager says: "Max your work pension contribution first."', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Sam prioritise with the $700 surplus?',
    choices: [
      { id: 'a', text: 'Build the emergency fund to 3 months first, then invest in a pension/index fund', outcome: 'Smart sequencing. An emergency fund prevents you from selling investments at the worst time. After that, a pension with employer match is a 50-100% instant return — hard to beat.', isCorrect: true },
      { id: 'b', text: 'Put it all into crypto for maximum growth', outcome: 'Without an emergency fund, one car repair could force Sam to sell crypto at a loss. Crypto is volatile — an appropriate vehicle only after foundations are solid.', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l5-e2',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'Sam contributes $144,000 ($300 x 480 months), but at 7% it compounds to roughly $780,000 over 40 years. A modest habit makes Sam a millionaire-adjacent saver.',
    prompt: 'Sam invests $300/month at 7% for 40 years. That is $144,000 of his own money put in. About how much will he have at retirement?',
    options: [
      { id: 'a', text: 'About $780,000', isCorrect: true },
      { id: 'b', text: 'About $144,000 (only what he put in)', isCorrect: false },
      { id: 'c', text: 'About $300,000', isCorrect: false },
      { id: 'd', text: 'About $1.5 million', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l5-e3',
    kind: 'multipleChoice',
    competencyId: 'portfolioConstruction',
    rationale: 'An employer pension match is a 50-100% instant guaranteed return on contributions — the single best "investment" available to most employees.',
    prompt: 'Sam\'s employer matches pension contributions 50 cents per dollar, up to 6% of salary. What is the effective return on Sam\'s matched contributions?',
    options: [
      { id: 'a', text: '7% — the expected stock market return', isCorrect: false },
      { id: 'b', text: '50% — a guaranteed instant return before any market gains', isCorrect: true },
      { id: 'c', text: '0% — the match doesn\'t count as return', isCorrect: false },
      { id: 'd', text: '6% — equal to the contribution percentage', isCorrect: false },
    ],
  },
  {
    id: 'inv1-l5-e4',
    kind: 'tapToOrder',
    competencyId: 'portfolioConstruction',
    rationale: 'This priority order — emergency fund → matched pension → other investments — is the standard recommended "investment ladder."',
    instruction: 'Order Sam\'s financial priorities from highest to lowest urgency.',
    items: [
      { id: 's1', text: 'Complete emergency fund (3–6 months of expenses)', rank: 1 },
      { id: 's2', text: 'Contribute to pension up to the employer match', rank: 2 },
      { id: 's3', text: 'Invest surplus in a low-cost index fund', rank: 3 },
      { id: 's4', text: 'Consider other investment vehicles as surplus grows', rank: 4 },
    ],
  },
  {
    id: 'inv1-l5-e5',
    kind: 'recallPrompt',
    competencyId: 'portfolioConstruction',
    rationale: 'Synthesising the full unit into a personal investing philosophy confirms real understanding.',
    prompt: 'You\'re 22 and have $200/month to invest. Walk through the decision: where does it go, and why?',
    conceptReveal: 'Step 1: Emergency fund first — 3-6 months of expenses before investing. Step 2: If employer pension match exists, contribute to capture it (50-100% instant return). Step 3: Invest remainder in a low-cost diversified index fund. Leave it alone for decades — compounding and time do the work.',
    checkpoints: [
      'Emergency fund = protection so you never have to sell investments at the wrong time',
      'Employer match = best guaranteed return available; never leave it uncaptured',
      'Index fund + time + patience = the reliable path to wealth for most people',
    ],
  },
  {
    id: 'inv1-l5-e6',
    kind: 'trueFalse',
    competencyId: 'portfolioConstruction',
    rationale: 'Paying off a 22% APR card is a guaranteed 22% return — better than the expected ~7% from stocks. High-interest debt comes first.',
    statement: 'Paying off a 22% APR credit card balance should usually come before investing spare cash in the stock market.',
    isTrue: true,
  },
  {
    id: 'inv1-l5-e7',
    kind: 'fillBlank',
    competencyId: 'portfolioConstruction',
    rationale: 'The standard priority ladder: emergency fund, employer match, then a low-cost index fund.',
    template: 'The standard order is: build an ___ fund, capture your employer ___, then invest in a low-cost ___ fund.',
    blanks: ['emergency', 'match', 'index'],
    wordBank: ['emergency', 'match', 'index', 'crypto', 'savings', 'bonus'],
  },
  {
    id: 'inv1-l5-e8',
    kind: 'matchPairs',
    competencyId: 'portfolioConstruction',
    rationale: 'These four building blocks appear in every beginner investing plan.',
    instruction: 'Match each term to its definition.',
    pairs: [
      { id: 'ef', term: 'Emergency fund', definition: '3-6 months of expenses kept in accessible cash' },
      { id: 'em', term: 'Employer match', definition: 'Free money your employer adds to your pension' },
      { id: 'if', term: 'Index fund', definition: 'A low-cost basket tracking the whole market' },
      { id: 'dca', term: 'Dollar-cost averaging', definition: 'Investing a set amount every month' },
    ],
  },
  {
    id: 'inv1-l5-e9',
    kind: 'categorize',
    competencyId: 'portfolioConstruction',
    rationale: 'Distinguishing financial foundations from optional extras sequences money decisions correctly.',
    instruction: 'Sort each action into what to do first vs. what can wait.',
    buckets: [
      { id: 'first', label: 'Do first' },
      { id: 'wait', label: 'Can wait' },
    ],
    items: [
      { id: 'ef', text: 'Build a starter emergency fund', bucketId: 'first' },
      { id: 'match', text: 'Capture the full employer match', bucketId: 'first' },
      { id: 'card', text: 'Pay off a 20% APR credit card', bucketId: 'first' },
      { id: 'stocks', text: 'Pick individual hot stocks', bucketId: 'wait' },
      { id: 'crypto', text: 'Explore crypto', bucketId: 'wait' },
      { id: 'extra', text: 'Open a taxable brokerage for extra savings', bucketId: 'wait' },
    ],
  },
  {
    id: 'inv1-l5-e10',
    kind: 'scenarioDecision',
    competencyId: 'portfolioConstruction',
    rationale: 'The capstone forces the learner to sequence a real budget: capture the free match, then clear high-interest debt while building a buffer.',
    story: 'Noah, 23, earns $3,200/month, has no emergency fund, a 19% APR card with $1,500 on it, and an employer that matches 100% of pension contributions up to 4% of pay. He has $400/month free. Where should the first dollars go?',
    choices: [
      { id: 'a', text: 'Capture the 4% match, then split the rest between the credit card and a small emergency buffer', outcome: 'Correct. The match is a 100% instant return — never skip it. After that, the 19% card is a guaranteed 19% "return" to pay down, alongside a starter buffer.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Put all $400 into a hot tech stock for fast growth', outcome: 'This skips free match money and ignores a 19% debt — a guaranteed loss — while taking concentrated risk. Foundations come first.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore the match and just pay the card minimum', outcome: 'Leaving the match on the table forfeits free money, and paying only the minimum lets 19% interest compound against him.', isCorrect: false, score: 1 },
    ],
  },
];

// ─── Guidebook ────────────────────────────────────────────────────────────────

export const introToInvestingGuidebook: GuidebookEntry[] = [
  {
    id: 'inv1-g1',
    title: 'Why Invest: Beating Inflation',
    body: 'Inflation averages 2–3% per year. A savings account paying 0.5% means your purchasing power shrinks ~2% annually. Investing in assets that historically return 6-10% is how you stay ahead. Real return = nominal return − inflation rate.',
  },
  {
    id: 'inv1-g2',
    title: 'Compound Growth Formula',
    body: 'Future Value = Principal × (1 + rate)^years. The power is in the exponent — doubling your time horizon does far more than doubling your contribution. Rule of 72: divide 72 by your annual return to estimate years to double (e.g. 7% → ~10 years).',
    formulaRef: 'compoundGrowth',
  },
  {
    id: 'inv1-g3',
    title: 'Risk vs. Return Trade-off',
    body: 'Higher potential return always comes with higher potential loss. Risk-free assets pay less because everyone wants them. Match your risk level to your time horizon: long horizon → more stocks; short horizon → more bonds/cash.',
  },
  {
    id: 'inv1-g4',
    title: 'Time in Market vs. Timing the Market',
    body: 'Missing even the 10 best trading days in a decade can halve your long-term returns. Selling during crashes and trying to re-enter at the bottom is a proven wealth-destroyer. Stay invested, ignore short-term noise, and rebalance annually.',
  },
  {
    id: 'inv1-g5',
    title: 'Your First Investment: The Priority Ladder',
    body: '1. Emergency fund (3-6 months of expenses). 2. Employer pension match (50-100% instant return — never leave this uncaptured). 3. Low-cost diversified index fund. 4. Increase contributions as income grows. This order maximises guaranteed returns before chasing market returns.',
  },
];

// ─── Lessons record ───────────────────────────────────────────────────────────

export const introToInvestingLessons: Record<string, Lesson> = {
  'inv1-l1':       makeLesson('inv1-l1',       'Why Invest?',               l1Exercises,       25),
  'inv1-l2':       makeLesson('inv1-l2',       'The Magic of Compounding',  l2Exercises,       30),
  'inv1-l3':       makeLesson('inv1-l3',       'Risk vs. Return',           l3Exercises,       25),
  'inv1-practice': makeLesson('inv1-practice', 'Mixed Practice',            practiceExercises, 15),
  'inv1-l4':       makeLesson('inv1-l4',       'Time Horizon & Patience',   l4Exercises,       25),
  'inv1-l5':       makeLesson('inv1-l5',       'First Investment',          l5Exercises,       35),
};

// ─── PathUnit ─────────────────────────────────────────────────────────────────

export const introToInvestingUnit: PathUnit = {
  id: 'unit-investing-6',
  title: 'Intro to Investing',
  subtitle: 'Why invest, how compounding works, risk vs. return, and making your first move.',
  color: '#BE9B4C',
  icon: '📈',
  trackId: 'investing',
  competencyIds: ['riskReturn', 'portfolioConstruction', 'behavior'],
  nodes: [
    { id: 'inv1-l1-node',       type: 'lesson',   position: ZIG[0]!, lessonId: 'inv1-l1' },
    { id: 'inv1-l2-node',       type: 'lesson',   position: ZIG[1]!, lessonId: 'inv1-l2' },
    { id: 'inv1-l3-node',       type: 'lesson',   position: ZIG[2]!, lessonId: 'inv1-l3' },
    { id: 'inv1-practice-node', type: 'practice', position: ZIG[3]!, lessonId: 'inv1-practice' },
    { id: 'inv1-chest',         type: 'chest',    position: ZIG[4]!, chestReward: { brainBucks: 75, xp: 30 } },
    { id: 'inv1-l4-node',       type: 'lesson',   position: ZIG[5]!, lessonId: 'inv1-l4' },
    { id: 'inv1-l5-node',       type: 'lesson',   position: ZIG[6]!, lessonId: 'inv1-l5' },
    { id: 'inv1-trophy',        type: 'trophy',   position: ZIG[7]! },
  ],
  guidebook: introToInvestingGuidebook,
  masteryThreshold: 65,
};
