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
    kind: 'calculator',
    competencyId: 'riskReturn',
    rationale: 'Seeing compound growth visually makes the math tangible. $1,000 at 7% for 30 years = ~$7,612 — nearly 8× the original.',
    formulaKey: 'compoundGrowth',
    prompt: 'See how $1,000 grows at 7% annually. Try 10, 20, and 30 years to see how time supercharges growth.',
    targetLabel: 'Future value',
    explanation: 'Future Value = Principal × (1 + rate)^years. Notice how each extra decade adds exponentially more, not just linearly.',
    inputs: [
      { id: 'principal', label: 'Starting amount', value: 1000, min: 100, max: 50000, step: 100, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 1, max: 15, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years invested', value: 30, min: 1, max: 40, step: 1 },
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
    kind: 'calculator',
    competencyId: 'portfolioConstruction',
    rationale: 'Sam investing $300/month (after building the emergency fund) at 7% for 40 years grows to ~$780,000 — making Sam a millionaire from a modest $300/month habit.',
    formulaKey: 'compoundGrowth',
    prompt: 'Model Sam\'s outcome: $300/month invested at 7% annually for 40 years. What will Sam\'s portfolio be worth at retirement?',
    targetLabel: 'Retirement value',
    explanation: 'FV = monthly contribution × ((1+rate)^years − 1) / rate. Small, consistent contributions compound dramatically over decades.',
    inputs: [
      { id: 'principal', label: 'Monthly investment', value: 300, min: 50, max: 2000, step: 50, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 2, max: 12, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years to retirement', value: 40, min: 10, max: 45, step: 1 },
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
