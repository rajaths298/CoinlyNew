import type { OnboardingProfile } from '../types/onboarding';
import type { Lesson, LessonDomain, LessonProgress } from '../types/lesson';
import type {
  Exercise,
  GuidebookEntry,
  MasteryTier,
  PathNode,
  PathNodeState,
  PathUnit,
} from '../types/learn';
import {
  introToInvestingLessons,
  introToInvestingUnit,
  stocksAndMarketLessons,
  stocksAndMarketUnit,
  fundsAndEtfsLessons,
  fundsAndEtfsUnit,
  riskMarginShortingLessons,
  riskMarginShortingUnit,
  cryptoUnitLessons,
  cryptoUnit,
} from './investing';

// ─── Unit accent colors (one per track) ──────────────────────────────────────

const UNIT_COLORS: Record<string, string> = {
  foundations: '#4C9BE8',
  budgeting: '#E87C4C',
  saving: '#4CBE8A',
  credit: '#BE4C7A',
  debt: '#9B4CBE',
  investing: '#BE9B4C',
  etfs: '#4C7ABE',
  stocks: '#BE4C4C',
  crypto: '#4CBEBE',
  taxes: '#7ABE4C',
  insurance: '#BE7A4C',
  career: '#4CBE4C',
  entrepreneurship: '#BE4CBE',
  advanced: '#8B4CBE',
};

const UNIT_ICONS: Record<string, string> = {
  foundations: '🏛️',
  budgeting: '📊',
  saving: '🏦',
  credit: '💳',
  debt: '⚖️',
  investing: '📈',
  etfs: '🗂️',
  stocks: '📉',
  crypto: '🪙',
  taxes: '🧾',
  insurance: '🛡️',
  career: '💼',
  entrepreneurship: '🚀',
  advanced: '🎓',
};

// ─── Seeded lessons for Unit 1 "Money Basics" ────────────────────────────────

const lesson1Exercises: Exercise[] = [
  {
    id: 'l1-e1',
    kind: 'recallPrompt',
    competencyId: 'moneyMindset',
    rationale: 'Money needs three core properties to function in an economy.',
    prompt: 'Before we dive in — what do you think makes something work as money?',
    conceptReveal: 'Money works because it serves three roles: a medium of exchange (lets you trade without barter), a unit of account (lets you compare prices), and a store of value (holds worth over time).',
    checkpoints: [
      'It lets people trade without finding a direct swap partner',
      'It lets everyone compare prices in a common unit',
      'It holds value so you can save and spend later',
    ],
  },
  {
    id: 'l1-e2',
    kind: 'trueFalse',
    competencyId: 'moneyMindset',
    rationale: "Paper money has almost no intrinsic value — a $20 bill is worth $20 because society collectively agrees it is (fiat currency). The paper itself is nearly worthless.",
    statement: 'A $20 bill is valuable because it\'s made of special, rare materials.',
    isTrue: false,
  },
  {
    id: 'l1-e3',
    kind: 'multipleChoice',
    competencyId: 'moneyMindset',
    rationale: "Money's three official functions are medium of exchange, unit of account, and store of value. Showing social status is a cultural side-effect, not a core economic function.",
    prompt: "Which of these is NOT one of money's three core economic functions?",
    options: [
      { id: 'a', text: 'Medium of exchange', isCorrect: false },
      { id: 'b', text: 'Unit of account', isCorrect: false },
      { id: 'c', text: 'A way to show social status', isCorrect: true },
      { id: 'd', text: 'Store of value', isCorrect: false },
    ],
  },
  {
    id: 'l1-e4',
    kind: 'multipleChoice',
    competencyId: 'moneyMindset',
    rationale: "Barter requires a 'double coincidence of wants' — you need to find someone who has exactly what you want AND wants exactly what you have. This becomes exponentially harder as an economy grows.",
    prompt: 'Why did pure barter economies struggle to scale beyond small communities?',
    options: [
      { id: 'a', text: 'People were dishonest in ancient times', isCorrect: false },
      { id: 'b', text: "It requires a 'double coincidence of wants'", isCorrect: true },
      { id: 'c', text: 'Goods were too heavy to carry', isCorrect: false },
      { id: 'd', text: 'There were no prices to compare', isCorrect: false },
    ],
  },
  {
    id: 'l1-e5',
    kind: 'fillBlank',
    competencyId: 'moneyMindset',
    rationale: "The three functions of money are medium of exchange, unit of account, and store of value — the foundation of every modern financial system.",
    template: 'Money serves as a ___ of exchange, a ___ of account, and a ___ of value.',
    blanks: ['medium', 'unit', 'store'],
    wordBank: ['medium', 'unit', 'store', 'source', 'form', 'system'],
  },
];

const lesson2Exercises: Exercise[] = [
  {
    id: 'l2-e1',
    kind: 'recallPrompt',
    competencyId: 'moneyMindset',
    rationale: 'Every financial decision involves an opportunity cost — the value of the best alternative path you gave up.',
    prompt: "If you spend $1,000 on a vacation right now, what might you be giving up?",
    conceptReveal: "The opportunity cost is the value of your best foregone alternative. Spending $1,000 on a vacation means giving up whatever that money could have done otherwise — invested at 7% for 10 years, it grows to ~$1,967.",
    checkpoints: [
      'Every financial choice has a hidden cost — the next-best option',
      "Opportunity cost is often invisible — you have to actively think it through",
      'Investing vs. spending now is a classic opportunity cost trade-off',
    ],
  },
  {
    id: 'l2-e2',
    kind: 'multipleChoice',
    competencyId: 'moneyMindset',
    rationale: 'Opportunity cost = the value of the best alternative. 2 hours × $20/hr = $40 of foregone income.',
    prompt: 'You spend 2 hours studying personal finance instead of working your side job at $20/hr. What is the opportunity cost of studying?',
    options: [
      { id: 'a', text: 'Zero — learning is priceless', isCorrect: false },
      { id: 'b', text: '$40 in foregone income', isCorrect: true },
      { id: 'c', text: '$20 in foregone income', isCorrect: false },
      { id: 'd', text: 'The cost of the course materials', isCorrect: false },
    ],
  },
  {
    id: 'l2-e3',
    kind: 'scenarioDecision',
    competencyId: 'moneyMindset',
    rationale: "The car is an investment in future earning power — $7/hr more × 40 hrs/week = $280/week extra, recovering $5,000 in ~18 weeks. The vacation is a pure consumption expense with no financial return.",
    story: "You have $5,000 saved. Your current job pays $15/hr. A better job paying $22/hr just opened — but it requires reliable transportation. You don't have a car. What do you do with the $5,000?",
    choices: [
      {
        id: 'a',
        text: 'Buy a reliable used car',
        outcome: 'The $7/hr raise pays back the car cost in about 18 weeks. Strong financial move.',
        isCorrect: true,
        score: 3,
      },
      {
        id: 'b',
        text: 'Take a vacation — you deserve it',
        outcome: 'You feel refreshed but miss the higher-paying job opportunity. The $5,000 is spent, not invested.',
        isCorrect: false,
        score: 0,
      },
      {
        id: 'c',
        text: 'Leave it in savings and keep the current job',
        outcome: 'Safe but costly — you forgo $280/week in extra earnings while your savings earn minimal interest.',
        isCorrect: false,
        score: 1,
      },
    ],
  },
  {
    id: 'l2-e4',
    kind: 'calculator',
    competencyId: 'moneyMindset',
    rationale: 'Compound growth turns the opportunity cost of spending into a real dollar figure. $2,000 at 7% for 10 years = ~$3,934. That is the opportunity cost of spending the money today.',
    formulaKey: 'compoundGrowth',
    prompt: "You could invest $2,000 today at 7% annually for 10 years. Calculate what you'd have — that's the opportunity cost of spending it now.",
    targetLabel: 'Future value',
    explanation: 'Future value = Principal × (1 + rate)^years. Every dollar you spend today could have become more tomorrow.',
    inputs: [
      { id: 'principal', label: 'Amount to invest', value: 2000, min: 100, max: 50000, step: 100, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 1, max: 15, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years', value: 10, min: 1, max: 40, step: 1 },
    ],
  },
  {
    id: 'l2-e5',
    kind: 'trueFalse',
    competencyId: 'moneyMindset',
    rationale: "Holding cash in a savings account — or under a mattress — has an opportunity cost: the return you could have earned investing it. Inflation also erodes its real value over time.",
    statement: "Choosing to do nothing with your money (leaving it in cash) has zero opportunity cost.",
    isTrue: false,
  },
];

const lesson3Exercises: Exercise[] = [
  {
    id: 'l3-e1',
    kind: 'fillBlank',
    competencyId: 'cashFlow',
    rationale: 'Net income is what you actually take home. Gross income minus taxes and deductions equals net income — the number you budget from.',
    template: 'Net income = gross income ___ taxes ___ deductions.',
    blanks: ['minus', 'minus'],
    wordBank: ['minus', 'plus', 'times', 'divided by', 'and'],
  },
  {
    id: 'l3-e2',
    kind: 'categorize',
    competencyId: 'cashFlow',
    rationale: "Needs are essentials you can't reasonably live without (shelter, food, utilities, health coverage). Wants are everything above that baseline. The distinction drives budgeting decisions.",
    instruction: 'Sort each item into Needs or Wants.',
    buckets: [
      { id: 'needs', label: 'Needs' },
      { id: 'wants', label: 'Wants' },
    ],
    items: [
      { id: 'rent', text: 'Monthly rent', bucketId: 'needs' },
      { id: 'netflix', text: 'Netflix subscription', bucketId: 'wants' },
      { id: 'groceries', text: 'Groceries', bucketId: 'needs' },
      { id: 'gym', text: 'Gym membership', bucketId: 'wants' },
      { id: 'electricity', text: 'Electricity bill', bucketId: 'needs' },
      { id: 'concerts', text: 'Concert tickets', bucketId: 'wants' },
      { id: 'health', text: 'Health insurance', bucketId: 'needs' },
      { id: 'games', text: 'Video games', bucketId: 'wants' },
    ],
  },
  {
    id: 'l3-e3',
    kind: 'matchPairs',
    competencyId: 'cashFlow',
    rationale: "Understanding these four terms is the foundation of every budget and cash-flow conversation.",
    instruction: 'Match each term to its correct definition.',
    pairs: [
      { id: 'gross', term: 'Gross income', definition: 'Total earnings before any taxes or deductions' },
      { id: 'net', term: 'Net income', definition: 'Take-home pay after taxes and deductions' },
      { id: 'fixed', term: 'Fixed expense', definition: 'Cost that stays the same every month (e.g., rent)' },
      { id: 'variable', term: 'Variable expense', definition: 'Cost that changes month to month (e.g., dining out)' },
    ],
  },
  {
    id: 'l3-e4',
    kind: 'multipleChoice',
    competencyId: 'cashFlow',
    rationale: '$4,000 × (1 − 0.25) = $4,000 × 0.75 = $3,000. Always calculate your budget from net income, not gross.',
    prompt: 'Your gross monthly income is $4,000. After a 25% tax rate, your net monthly income is:',
    options: [
      { id: 'a', text: '$4,000', isCorrect: false },
      { id: 'b', text: '$3,500', isCorrect: false },
      { id: 'c', text: '$3,000', isCorrect: true },
      { id: 'd', text: '$2,500', isCorrect: false },
    ],
  },
  {
    id: 'l3-e5',
    kind: 'trueFalse',
    competencyId: 'cashFlow',
    rationale: "Lifestyle inflation — spending rising to match (or exceed) income — is one of the biggest wealth destroyers. A raise doesn't automatically mean more savings unless you intentionally redirect the increase.",
    statement: 'A higher salary always means you will save more money.',
    isTrue: false,
  },
];

const lesson4Exercises: Exercise[] = [
  {
    id: 'l4-e1',
    kind: 'recallPrompt',
    competencyId: 'budgetDesign',
    rationale: 'The 50/30/20 rule is the most widely taught starting budget framework.',
    prompt: 'If you had to divide your take-home pay into percentages for needs, wants, and saving — what would your split be?',
    conceptReveal: "The 50/30/20 rule: allocate 50% to needs (rent, groceries, utilities), 30% to wants (dining, entertainment, subscriptions), and 20% to savings and debt payoff.",
    checkpoints: [
      '50% covers necessities — the non-negotiables',
      '30% for lifestyle spending — guilt-free wants',
      '20% is your wealth-building slice',
    ],
  },
  {
    id: 'l4-e2',
    kind: 'fillBlank',
    competencyId: 'budgetDesign',
    rationale: "50/30/20 is a flexible starting framework — the exact percentages can shift based on your income and goals, but the core idea (needs, wants, future) stays the same.",
    template: 'The 50/30/20 rule allocates ___% to needs, ___% to wants, and ___% to savings or debt payoff.',
    blanks: ['50', '30', '20'],
    wordBank: ['50', '30', '20', '40', '25', '15', '10'],
  },
  {
    id: 'l4-e3',
    kind: 'matchPairs',
    competencyId: 'budgetDesign',
    rationale: "There are many budgeting methods — zero-based, 50/30/20, envelope, and pay-yourself-first are the most common. Knowing what each means lets you pick the right tool.",
    instruction: 'Match each budgeting method to its description.',
    pairs: [
      { id: 'zb', term: 'Zero-based budget', definition: 'Every dollar of income is assigned a specific job' },
      { id: '5030', term: '50/30/20 rule', definition: 'Needs / wants / savings percentage split' },
      { id: 'env', term: 'Envelope method', definition: 'Cash divided into physical spending categories' },
      { id: 'pyf', term: 'Pay-yourself-first', definition: 'Savings auto-transferred before you spend anything' },
    ],
  },
  {
    id: 'l4-e4',
    kind: 'scenarioDecision',
    competencyId: 'budgetDesign',
    rationale: "Variable discretionary expenses (dining out) are the fastest lever to pull. Cutting $200/month from dining has immediate impact. Adding income streams (second job) takes longer to set up and sustain.",
    story: "Your net income is $3,000/month. Fixed costs: rent $900, car $300. Variable costs: groceries $400, subscriptions $150, dining out $400. Current savings: $0. What's your first move to start building savings?",
    choices: [
      {
        id: 'a',
        text: 'Cut dining out by $200 and redirect it to savings',
        outcome: 'Immediately frees $200/month — $2,400/year — with minimal lifestyle disruption.',
        isCorrect: true,
        score: 3,
      },
      {
        id: 'b',
        text: 'Get a second job to earn more first',
        outcome: 'Earning more can help long-term, but it takes time to arrange and you still need spending discipline.',
        isCorrect: false,
        score: 1,
      },
      {
        id: 'c',
        text: 'Cancel all subscriptions immediately',
        outcome: 'Saves $150 — less than dining out — and may cause frustration. Dining out is the bigger lever.',
        isCorrect: false,
        score: 1,
      },
    ],
  },
  {
    id: 'l4-e5',
    kind: 'multipleChoice',
    competencyId: 'budgetDesign',
    rationale: "Zero-based means income − all assigned categories = $0. Savings is treated as an assigned 'expense' category (money going to your future self). It does NOT mean you spend everything.",
    prompt: "In a zero-based budget, 'zero-based' means:",
    options: [
      { id: 'a', text: 'You spend every dollar you earn', isCorrect: false },
      { id: 'b', text: 'Income minus all budget categories equals $0', isCorrect: true },
      { id: 'c', text: 'You start with a savings balance of zero', isCorrect: false },
      { id: 'd', text: 'You only track expenses, not income', isCorrect: false },
    ],
  },
];

const lesson5Exercises: Exercise[] = [
  {
    id: 'l5-e1',
    kind: 'trueFalse',
    competencyId: 'savingSystems',
    rationale: "An emergency fund is specifically for unexpected negative events — job loss, medical bills, car breakdown. Using it for deals or travel defeats its purpose and leaves you exposed.",
    statement: 'An emergency fund is money set aside for great sales, travel opportunities, and life upgrades.',
    isTrue: false,
  },
  {
    id: 'l5-e2',
    kind: 'multipleChoice',
    competencyId: 'savingSystems',
    rationale: "3 months covers stable dual-income households with low job-loss risk. 6 months is safer for single-income, variable-income, or less stable employment situations.",
    prompt: 'Most financial advisors recommend an emergency fund covering:',
    options: [
      { id: 'a', text: '1 month of all expenses', isCorrect: false },
      { id: 'b', text: '3–6 months of essential expenses', isCorrect: true },
      { id: 'c', text: 'Exactly $10,000', isCorrect: false },
      { id: 'd', text: '12 months of total income', isCorrect: false },
    ],
  },
  {
    id: 'l5-e3',
    kind: 'calculator',
    competencyId: 'savingSystems',
    rationale: 'Monthly essentials × 6 = your target. Knowing your exact number makes it a concrete, achievable goal rather than a vague intention.',
    formulaKey: 'emergencyFund',
    prompt: 'Your monthly essentials: rent $900, food $350, utilities $150, transport $200. Calculate your 6-month emergency fund target.',
    targetLabel: '6-month target',
    explanation: 'Emergency fund = monthly essential expenses × months of coverage. Use only true essentials — not wants.',
    inputs: [
      { id: 'rent', label: 'Rent / housing', value: 900, min: 0, max: 5000, step: 50, prefix: '$' },
      { id: 'food', label: 'Food / groceries', value: 350, min: 0, max: 2000, step: 25, prefix: '$' },
      { id: 'utilities', label: 'Utilities', value: 150, min: 0, max: 1000, step: 25, prefix: '$' },
      { id: 'transport', label: 'Transport', value: 200, min: 0, max: 2000, step: 25, prefix: '$' },
      { id: 'months', label: 'Months of coverage', value: 6, min: 3, max: 12, step: 1 },
    ],
  },
  {
    id: 'l5-e4',
    kind: 'scenarioDecision',
    competencyId: 'savingSystems',
    rationale: "Emergency funds exist precisely for this — unexpected essential expenses. Putting it on 22% APR credit generates ~$27/month in interest. The emergency fund protected you; rebuilding it is now the priority.",
    story: "You have $1,200 in your emergency fund. Your car breaks down and needs $800 in repairs — you need it to get to work. You also have $1,500 in credit card debt at 22% APR. What do you do?",
    choices: [
      {
        id: 'a',
        text: 'Pay the $800 repair from the emergency fund and then rebuild it',
        outcome: 'Perfect use of an emergency fund. Rebuild it over the next 3–4 months before tackling extra debt payments.',
        isCorrect: true,
        score: 3,
      },
      {
        id: 'b',
        text: 'Put the repair on the credit card to preserve the emergency fund',
        outcome: '22% APR means you pay ~$15/month in extra interest. Your emergency fund stays intact but grows more expensive debt.',
        isCorrect: false,
        score: 1,
      },
      {
        id: 'c',
        text: 'Pay off the credit card first, then deal with the car',
        outcome: 'Eliminating high-interest debt is smart long-term, but you still need transportation now. This creates a new emergency.',
        isCorrect: false,
        score: 0,
      },
    ],
  },
  {
    id: 'l5-e5',
    kind: 'recallPrompt',
    competencyId: 'savingSystems',
    rationale: 'Security and peace of mind are the two returns on an emergency fund — the first financial and the second psychological.',
    prompt: "In your own words: what are the two main things an emergency fund gives you?",
    conceptReveal: "An emergency fund gives you: (1) Financial security — the ability to cover unexpected costs without going into debt. (2) Peace of mind — reduced financial anxiety, which research shows improves decision-making in other areas of life.",
    checkpoints: [
      'Covers unexpected costs so you avoid high-interest debt',
      'Reduces financial stress and improves overall decision-making',
    ],
  },
];

// Practice node: mixed exercises pulled from lessons 1–3
const practiceExercises: Exercise[] = [
  lesson1Exercises[2]!, // MC: three functions of money
  lesson2Exercises[4]!, // T/F: doing nothing has zero opportunity cost
  lesson3Exercises[1]!, // Categorize: needs vs wants
  {
    id: 'practice-recap',
    kind: 'recallPrompt',
    competencyId: 'moneyMindset',
    rationale: 'Connecting money basics, opportunity cost, and income/expenses is the foundation of every financial decision.',
    prompt: "Quick synthesis: how do opportunity cost and net income together shape what you can afford?",
    conceptReveal: "Every purchase has an opportunity cost — what you forgo. Your net income is the constraint. Great financial decisions maximize the value of each dollar by weighing alternatives within your real take-home budget.",
    checkpoints: [
      'Opportunity cost = best alternative foregone',
      'Budget from net income, not gross',
      "Every spending decision has a 'what else could this have done?' question",
    ],
  },
];

// ─── Lessons as Lesson objects ────────────────────────────────────────────────

function makeDuoLesson(
  id: string,
  title: string,
  exercises: Exercise[],
  xp: number,
): Lesson {
  return {
    id,
    title,
    domain: 'foundations',
    level: 'beginner',
    unitId: 'unit-foundations-1',
    unitTitle: 'Money Basics',
    courseTrackId: 'foundations',
    moduleId: 'foundations-foundations',
    durationMinutes: Math.max(3, Math.round(exercises.length * 1.2)),
    xp,
    prerequisites: [],
    difficulty: 1,
    learningObjectives: [],
    competencyIds: ['moneyMindset'],
    competencyTags: ['foundations'],
    masteryWeight: 1,
    formulaRefs: [],
    misconceptions: [],
    steps: [],
    exercises,
  };
}

export const duoLessons: Record<string, Lesson> = {
  'duo-l1': makeDuoLesson('duo-l1', 'What Is Money?', lesson1Exercises, 20),
  'duo-l2': makeDuoLesson('duo-l2', 'Opportunity Cost', lesson2Exercises, 25),
  'duo-l3': makeDuoLesson('duo-l3', 'Income vs. Expenses', lesson3Exercises, 20),
  'duo-practice-1': makeDuoLesson('duo-practice-1', 'Mixed Practice', practiceExercises, 15),
  'duo-l4': makeDuoLesson('duo-l4', 'Budgeting Basics', lesson4Exercises, 25),
  'duo-l5': makeDuoLesson('duo-l5', 'Emergency Fund', lesson5Exercises, 30),
};

// ─── Guidebook for Unit 1 ────────────────────────────────────────────────────

const unit1Guidebook: GuidebookEntry[] = [
  {
    id: 'g1',
    title: 'The Three Functions of Money',
    body: "Money works as: (1) a medium of exchange — facilitates trade without barter; (2) a unit of account — a common measure for prices; (3) a store of value — preserves purchasing power over time.",
  },
  {
    id: 'g2',
    title: 'Opportunity Cost',
    body: "Every financial choice has an opportunity cost: the value of the best alternative you gave up. When you spend $100 on dinner, the opportunity cost might be $100 invested — which grows to ~$197 in 10 years at 7%.",
    formulaRef: 'compoundGrowth',
  },
  {
    id: 'g3',
    title: 'Gross vs. Net Income',
    body: "Gross income is what you earn before deductions. Net income (take-home pay) is what you actually have to budget with. Always build your budget from net income.",
  },
  {
    id: 'g4',
    title: 'The 50/30/20 Budget Rule',
    body: "Allocate 50% of net income to needs (rent, food, utilities), 30% to wants (entertainment, dining), and 20% to savings and debt payoff. It's a starting framework — adjust as your situation evolves.",
  },
  {
    id: 'g5',
    title: 'Emergency Fund',
    body: "Keep 3–6 months of essential expenses in an accessible savings account. This prevents debt-spiral when unexpected costs hit. Build it before aggressively investing.",
    formulaRef: 'emergencyFund',
  },
];

// ─── Lesson factory (generic) ────────────────────────────────────────────────

function makeLesson(
  id: string,
  title: string,
  exercises: Exercise[],
  xp: number,
  unitId: string,
  domain: LessonDomain,
  unitTitle: string,
): Lesson {
  return {
    id, title, domain, level: 'beginner', unitId, unitTitle,
    courseTrackId: domain, moduleId: `${domain}-${domain}`,
    durationMinutes: Math.max(3, Math.round(exercises.length * 1.2)),
    xp, prerequisites: [], difficulty: 1, learningObjectives: [],
    competencyIds: ['moneyMindset'], competencyTags: [domain],
    masteryWeight: 1, formulaRefs: [], misconceptions: [], steps: [], exercises,
  };
}

// ─── Unit 2 — Budgeting Foundations ──────────────────────────────────────────

const u2l1: Exercise[] = [
  { id: 'u2-l1-e1', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'Needs are essentials; wants improve quality of life but aren\'t required.',
    prompt: 'If your income dropped 30% tomorrow, which expenses would you cut first — and which would you absolutely protect?',
    conceptReveal: 'Needs: housing, food, utilities, transport to work, health care. Wants: dining out, streaming, gym, entertainment. Always protect needs first; wants are the primary lever.',
    checkpoints: ['Needs = non-negotiable essentials for survival and work','Wants = lifestyle upgrades above that baseline','The boundary shifts by context (internet may be a need for remote workers)'] },
  { id: 'u2-l1-e2', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Rent, groceries, and utilities keep you housed and fed. Streaming, dining out, and gym memberships are discretionary.',
    instruction: 'Sort each item into Needs or Wants.',
    buckets: [{ id: 'needs', label: 'Needs' }, { id: 'wants', label: 'Wants' }],
    items: [
      { id: 'rent', text: 'Monthly rent', bucketId: 'needs' },
      { id: 'netflix', text: 'Streaming subscription', bucketId: 'wants' },
      { id: 'groceries', text: 'Groceries', bucketId: 'needs' },
      { id: 'gym', text: 'Gym membership', bucketId: 'wants' },
      { id: 'electric', text: 'Electricity bill', bucketId: 'needs' },
      { id: 'dine', text: 'Weekly dining out', bucketId: 'wants' },
    ] },
  { id: 'u2-l1-e3', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'Rent/mortgage is a non-negotiable cost of housing — the clearest example of a need.',
    prompt: "Which of these is most clearly a 'need'?",
    options: [
      { id: 'a', text: 'Monthly gym membership', isCorrect: false },
      { id: 'b', text: 'Rent or mortgage payment', isCorrect: true },
      { id: 'c', text: 'Streaming services', isCorrect: false },
      { id: 'd', text: 'Weekly restaurant meals', isCorrect: false },
    ] },
  { id: 'u2-l1-e4', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'Context shifts the boundary — a car is a need in a rural area with no transit, a want for a city-dweller with great public transport.',
    statement: 'The line between a need and a want is exactly the same for every person.',
    isTrue: false },
  { id: 'u2-l1-e5', kind: 'fillBlank', competencyId: 'budgetDesign',
    rationale: 'Prioritising needs first is the foundation of any effective budget.',
    template: 'When budgeting, protect your ___ first. Cut your ___ when money is tight.',
    blanks: ['needs', 'wants'],
    wordBank: ['needs', 'wants', 'savings', 'income', 'debts', 'goals'] },
  { id: 'u2-l1-e6', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'Dining out and subscriptions are wants — they\'re the fastest cuts with the least harm to daily functioning.',
    story: 'Your hours were cut 25%. You need to trim $400/month. You spend: $250 dining out, $120 subscriptions, $450 groceries, $950 rent. Best first move?',
    choices: [
      { id: 'a', text: 'Cut dining out by $200 + cancel 2 subscriptions', outcome: 'Saves ~$280 immediately from pure wants. High impact, low disruption.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Move to a cheaper apartment', outcome: 'Good long-term, but moving costs money and takes weeks. Not an immediate fix.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Cut groceries by $300', outcome: 'Cutting food this aggressively hurts health and energy. Wants are the better lever.', isCorrect: false, score: 0 },
    ] },
  { id: 'u2-l1-e7', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'Fixed vs variable and needs vs wants are the four core budget vocabulary terms.',
    instruction: 'Match each term to its correct definition.',
    pairs: [
      { id: 'need', term: 'Need', definition: 'Essential expense required for basic living' },
      { id: 'want', term: 'Want', definition: 'Desirable expense that improves quality of life' },
      { id: 'fixed', term: 'Fixed expense', definition: 'Same cost every month (rent, car payment)' },
      { id: 'variable', term: 'Variable expense', definition: 'Fluctuates month to month (groceries, gas)' },
    ] },
];

const u2l2: Exercise[] = [
  { id: 'u2-l2-e1', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'A budget is a spending plan — every dollar gets a purpose before you spend it.',
    prompt: 'Walk through how you\'d build a personal budget from scratch in three steps.',
    conceptReveal: '1) List net (take-home) income. 2) List all expenses — fixed first, then variable. 3) Subtract expenses from income. Positive = surplus; negative = deficit.',
    checkpoints: ['Always start from net income, never gross','List fixed costs first — they don\'t change','Surplus/deficit is your financial health signal'] },
  { id: 'u2-l2-e2', kind: 'fillBlank', competencyId: 'budgetDesign',
    rationale: 'The basic budget equation is the starting point for all personal finance planning.',
    template: 'Monthly budget: ___ income − ___ expenses = budget ___',
    blanks: ['net', 'total', 'surplus'],
    wordBank: ['net', 'gross', 'total', 'fixed', 'surplus', 'deficit', 'variable'] },
  { id: 'u2-l2-e3', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Fixed expenses are predictable; variable expenses fluctuate and are where you find savings.',
    instruction: 'Sort each expense into Fixed or Variable.',
    buckets: [{ id: 'fixed', label: 'Fixed' }, { id: 'variable', label: 'Variable' }],
    items: [
      { id: 'rent', text: 'Monthly rent', bucketId: 'fixed' },
      { id: 'gas', text: 'Petrol / gas bill', bucketId: 'variable' },
      { id: 'car', text: 'Car loan payment', bucketId: 'fixed' },
      { id: 'dining', text: 'Dining out', bucketId: 'variable' },
      { id: 'insure', text: 'Car insurance premium', bucketId: 'fixed' },
      { id: 'groceries', text: 'Weekly groceries', bucketId: 'variable' },
    ] },
  { id: 'u2-l2-e4', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: '$3,200 − ($850 + $400 + $300 + $250 + $200) = $3,200 − $2,000 = $1,200 surplus.',
    prompt: 'Net income: $3,200. Rent: $850. Groceries: $400. Car: $300. Utilities: $250. Subscriptions: $200. What is the monthly surplus?',
    options: [
      { id: 'a', text: '$800', isCorrect: false },
      { id: 'b', text: '$1,200', isCorrect: true },
      { id: 'c', text: '$1,000', isCorrect: false },
      { id: 'd', text: '$1,400', isCorrect: false },
    ] },
  { id: 'u2-l2-e5', kind: 'tapToOrder', competencyId: 'budgetDesign',
    rationale: 'Starting with income sets the ceiling; fixed costs come next since they\'re non-negotiable; variable last since those are your levers.',
    instruction: 'Order these budget-building steps correctly.',
    items: [
      { id: 's1', text: 'Calculate your net (take-home) income', rank: 1 },
      { id: 's2', text: 'List all fixed monthly expenses', rank: 2 },
      { id: 's3', text: 'List variable and discretionary expenses', rank: 3 },
      { id: 's4', text: 'Subtract total expenses from income', rank: 4 },
      { id: 's5', text: 'Adjust categories until you reach your goals', rank: 5 },
    ] },
  { id: 'u2-l2-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'A budget is a tool for intentional spending — a well-designed budget includes a deliberate "fun" category.',
    statement: 'Having a budget means you can never spend money on entertainment.',
    isTrue: false },
  { id: 'u2-l2-e7', kind: 'calculator', competencyId: 'budgetDesign',
    rationale: 'Surplus = income − fixed − variable. Positive = savings capacity; negative = cuts needed.',
    formulaKey: 'budgetSurplus',
    prompt: 'Calculate your monthly budget surplus by adjusting your income and expense sliders.',
    targetLabel: 'Monthly surplus',
    explanation: 'Surplus = Net income − Fixed expenses − Variable expenses. A negative number means spending more than you earn.',
    inputs: [
      { id: 'income', label: 'Net monthly income', value: 3000, min: 1000, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Fixed expenses', value: 1200, min: 0, max: 8000, step: 50, prefix: '$' },
      { id: 'variable', label: 'Variable expenses', value: 800, min: 0, max: 3000, step: 50, prefix: '$' },
    ] },
  { id: 'u2-l2-e8', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'Cutting variable wants (dining, gym) is the fastest lever with the least essential impact.',
    story: 'Your budget shows a $400/month deficit. Fixed: rent $1,100, insurance $200. Variable: groceries $450, dining $350, streaming $80, gym $60. Best immediate fix?',
    choices: [
      { id: 'a', text: 'Cut dining by $300 and cancel gym ($60)', outcome: 'Saves $360/month immediately from pure wants. Nearly closes the gap.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Get a roommate to split rent', outcome: 'Could save $500+ long-term, but takes weeks to arrange.', isCorrect: false, score: 2 },
      { id: 'c', text: 'Cut groceries by $400', outcome: 'Cutting food this aggressively risks nutrition. Better levers exist.', isCorrect: false, score: 0 },
    ] },
];

const u2l3: Exercise[] = [
  { id: 'u2-l3-e1', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'The 50/30/20 rule is the most widely taught starting budget framework.',
    prompt: 'How would you split $3,000 take-home pay across needs, wants, and savings?',
    conceptReveal: '50% ($1,500) to needs, 30% ($900) to wants, 20% ($600) to savings and debt payoff. It\'s a starting framework — adjust as your life evolves.',
    checkpoints: ['50% covers non-negotiable essentials','30% is guilt-free lifestyle spending','20% is your wealth-building allocation'] },
  { id: 'u2-l3-e2', kind: 'fillBlank', competencyId: 'budgetDesign',
    rationale: 'Knowing the percentages by heart lets you quickly sanity-check any budget.',
    template: 'The 50/30/20 rule: ___% to needs, ___% to wants, ___% to savings.',
    blanks: ['50', '30', '20'],
    wordBank: ['50', '30', '20', '40', '25', '15', '10'] },
  { id: 'u2-l3-e3', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: '$4,000 × 30% = $1,200 allocated to wants.',
    prompt: 'On a $4,000 net monthly income using 50/30/20, how much is budgeted for wants?',
    options: [
      { id: 'a', text: '$800', isCorrect: false },
      { id: 'b', text: '$1,200', isCorrect: true },
      { id: 'c', text: '$2,000', isCorrect: false },
      { id: 'd', text: '$1,600', isCorrect: false },
    ] },
  { id: 'u2-l3-e4', kind: 'calculator', competencyId: 'budgetDesign',
    rationale: 'Applying 50/30/20 to your own income makes the framework concrete and actionable.',
    formulaKey: 'budgetSurplus',
    prompt: 'Apply the 50/30/20 rule to a $2,800/month take-home. How much goes to each category?',
    targetLabel: 'Savings amount',
    explanation: 'Needs = income × 0.50. Wants = income × 0.30. Savings = income × 0.20. Adjust your income to see how the categories shift.',
    inputs: [
      { id: 'income', label: 'Monthly net income', value: 2800, min: 1000, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Needs (50%)', value: 1400, min: 0, max: 8000, step: 50, prefix: '$' },
      { id: 'variable', label: 'Wants (30%)', value: 840, min: 0, max: 3000, step: 50, prefix: '$' },
    ] },
  { id: 'u2-l3-e5', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Correctly categorising expenses into the 50/30/20 buckets is the first step to applying the rule.',
    instruction: 'Sort each expense into its 50/30/20 category.',
    buckets: [{ id: 'needs', label: 'Needs (50%)' }, { id: 'wants', label: 'Wants (30%)' }, { id: 'savings', label: 'Savings (20%)' }],
    items: [
      { id: 'rent', text: 'Rent payment', bucketId: 'needs' },
      { id: 'invest', text: 'Monthly investment transfer', bucketId: 'savings' },
      { id: 'dining', text: 'Restaurant meals', bucketId: 'wants' },
      { id: 'health', text: 'Health insurance premium', bucketId: 'needs' },
      { id: 'stream', text: 'Streaming services', bucketId: 'wants' },
      { id: 'emerg', text: 'Emergency fund contribution', bucketId: 'savings' },
    ] },
  { id: 'u2-l3-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: '50/30/20 is a starting guideline, not a rule. High-rent cities may need a 60/20/20 split. The key is intentional allocation, not exact percentages.',
    statement: 'The 50/30/20 rule must be followed exactly — no adjustments allowed.',
    isTrue: false },
  { id: 'u2-l3-e7', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'When housing exceeds 50%, either find cheaper housing, increase income, or aggressively cut wants to compensate.',
    story: 'You moved to a new city. Rent alone is 60% of your take-home pay. Under 50/30/20 you\'re already 10% over budget just on housing. What do you do?',
    choices: [
      { id: 'a', text: 'Cut wants to 20% temporarily and save 20%', outcome: 'Smart compromise — you protect savings and adapt until income grows or you find cheaper housing.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Ignore the framework; budget frameworks don\'t apply to high-rent cities', outcome: 'Budgets always apply. Ignoring them means losing track of spending completely.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Stop saving entirely until you earn more', outcome: 'No savings means no financial cushion — and the habit of not saving is hard to reverse.', isCorrect: false, score: 0 },
    ] },
];

const u2l4: Exercise[] = [
  { id: 'u2-l4-e1', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'Small recurring costs are the most common source of "missing" money in a budget.',
    panels: [
      { text: 'Alex earns $3,200/month and has a budget on paper. But at the end of each month, there\'s always $300 that can\'t be accounted for.', speaker: 'Narrator' },
      { text: 'Alex sits down and combs through three months of bank statements. The culprit? Four forgotten subscriptions ($85), frequent takeaway orders ($130), and coffee runs ($70).', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Alex do with these findings?',
    choices: [
      { id: 'a', text: 'Cancel unused subscriptions and set a $100/month dining budget', outcome: 'Exactly right — Alex identified the leaks and set concrete limits. The "mystery" $300 becomes intentional savings.', isCorrect: true },
      { id: 'b', text: 'Earn more money to cover the gap', outcome: 'Earning more helps long-term, but untracked spending will just expand to fill higher income.', isCorrect: false },
    ] },
  { id: 'u2-l4-e2', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A spending "leak" is a recurring small cost that adds up significantly without being noticed.',
    prompt: "A spending 'leak' is best described as:",
    options: [
      { id: 'a', text: 'A one-off large unexpected expense', isCorrect: false },
      { id: 'b', text: 'A recurring small cost that adds up unnoticed', isCorrect: true },
      { id: 'c', text: 'Money stolen or lost', isCorrect: false },
      { id: 'd', text: 'A bank fee charged without warning', isCorrect: false },
    ] },
  { id: 'u2-l4-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: '$5/day × 365 = $1,825/year. Over 10 years at 7% growth, that\'s over $25,000. Small habits compound dramatically.',
    statement: 'Spending $5 a day on coffee is too small to matter for your annual budget.',
    isTrue: false },
  { id: 'u2-l4-e4', kind: 'fillBlank', competencyId: 'behavior',
    rationale: 'Annual cost is daily spend × 365. Knowing this number makes "small" costs visible.',
    template: '$5/day × 365 days = $___/year. Over 10 years, that\'s a significant opportunity cost.',
    blanks: ['1825'],
    wordBank: ['1825', '1500', '2000', '500', '365', '1200'] },
  { id: 'u2-l4-e5', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'A systematic monthly review catches leaks before they compound.',
    instruction: 'Order these steps for a monthly spending review.',
    items: [
      { id: 's1', text: 'Download or print your bank/card statements', rank: 1 },
      { id: 's2', text: 'Categorise every transaction', rank: 2 },
      { id: 's3', text: 'Compare actual spending to your budgeted amounts', rank: 3 },
      { id: 's4', text: 'Identify categories that went over budget', rank: 4 },
      { id: 's5', text: 'Set a specific limit for next month in those categories', rank: 5 },
    ] },
  { id: 'u2-l4-e6', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Cancelling unused subscriptions has the clearest ROI — you get nothing from services you don\'t use.',
    story: 'After tracking for one month, you find $220 in subscriptions you barely use: $15 music, $13 streaming, $40 software, $12 news, $25 fitness app, $115 others. What\'s your move?',
    choices: [
      { id: 'a', text: 'Audit and cancel anything unused for 30+ days', outcome: 'Perfect. If you haven\'t used it in a month, you likely won\'t miss it. Instant savings.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Keep everything — you might use them later', outcome: '"Might use later" costs $2,640/year. Cancel and re-subscribe if you actually need it.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Downgrade each to a cheaper tier', outcome: 'Better than nothing, but auditing first is more effective — many services are unused entirely.', isCorrect: false, score: 1 },
    ] },
  { id: 'u2-l4-e7', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Tracking creates awareness; awareness enables intentional change.',
    prompt: 'After tracking your spending for one month, what\'s the one insight you\'d act on first?',
    conceptReveal: 'Most people find: (1) More subscriptions than expected. (2) Dining/takeaway much higher than estimated. (3) Small daily purchases adding to hundreds monthly. The key is to pick one change and make it automatic.',
    checkpoints: ['Identify your largest unplanned category','Set a concrete cap for it next month','Automate savings before discretionary spending reaches your account'] },
];

const u2Practice: Exercise[] = [
  u2l1[2]!, // MC: "which is a need"
  u2l2[3]!, // MC: budget surplus calculation
  u2l3[1]!, // fill blank: 50/30/20 percentages
  u2l4[2]!, // T/F: $5/day coffee
];

const u2l5: Exercise[] = [
  { id: 'u2-l5-e1', kind: 'miniStory', competencyId: 'budgetDesign',
    rationale: 'Applying budgeting in a realistic scenario solidifies every concept from the unit.',
    panels: [
      { text: 'Jordan, 23, just started their first full-time job. Net pay: $2,800/month. Jordan has no budget yet and keeps running out of money by the 25th of each month.', speaker: 'Narrator' },
      { text: 'Jordan lists expenses: rent $900, utilities $150, groceries $350, transport $200, streaming $50, dining out $400, clothes $200, miscellaneous $300.', speaker: 'Jordan' },
    ],
    choicePrompt: 'What should Jordan do first?',
    choices: [
      { id: 'a', text: 'Compare totals to income and find the deficit', outcome: 'Total expenses = $2,550. Surplus = $250. But there\'s no savings category yet — that\'s the next fix.', isCorrect: true },
      { id: 'b', text: 'Immediately cancel all non-essential spending', outcome: 'Overcorrection. Understanding the numbers first prevents cutting things Jordan actually needs.', isCorrect: false },
    ] },
  { id: 'u2-l5-e2', kind: 'calculator', competencyId: 'budgetDesign',
    rationale: 'Jordan\'s 50/30/20 targets give a benchmark to compare actual spending against.',
    formulaKey: 'budgetSurplus',
    prompt: 'Apply 50/30/20 to Jordan\'s $2,800/month. Calculate the target for each category.',
    targetLabel: 'Savings target',
    explanation: 'Needs (50%) = $1,400. Wants (30%) = $840. Savings (20%) = $560. Compare these to Jordan\'s actuals.',
    inputs: [
      { id: 'income', label: 'Jordan\'s net income', value: 2800, min: 2000, max: 5000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Needs (target: 50%)', value: 1400, min: 0, max: 3000, step: 50, prefix: '$' },
      { id: 'variable', label: 'Wants (target: 30%)', value: 840, min: 0, max: 2000, step: 50, prefix: '$' },
    ] },
  { id: 'u2-l5-e3', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Correctly categorising Jordan\'s spending reveals where the 50/30/20 targets are being exceeded.',
    instruction: "Categorise Jordan's actual expenses.",
    buckets: [{ id: 'needs', label: 'Needs' }, { id: 'wants', label: 'Wants' }],
    items: [
      { id: 'rent', text: 'Rent $900', bucketId: 'needs' },
      { id: 'util', text: 'Utilities $150', bucketId: 'needs' },
      { id: 'groc', text: 'Groceries $350', bucketId: 'needs' },
      { id: 'trans', text: 'Transport $200', bucketId: 'needs' },
      { id: 'stream', text: 'Streaming $50', bucketId: 'wants' },
      { id: 'dine', text: 'Dining out $400', bucketId: 'wants' },
      { id: 'cloth', text: 'Clothing $200', bucketId: 'wants' },
    ] },
  { id: 'u2-l5-e4', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'Jordan\'s wants ($650) are below the 30% target ($840), but there\'s no savings yet. The fix is to add savings as a budget line before spending the surplus.',
    story: 'Jordan\'s needs = $1,600 (57% of income — over target). Wants = $650 (23%). No savings. Surplus = $250 sitting in a current account. What should Jordan do with month 2?',
    choices: [
      { id: 'a', text: 'Automate $250 into savings on pay day, look to reduce needs category', outcome: 'Right. Automating savings first prevents "spending the surplus." Then work on reducing needs (e.g. cheaper groceries or transport).', isCorrect: true, score: 3 },
      { id: 'b', text: 'Spend the surplus on something fun — it was earned', outcome: 'This keeps Jordan in the same cycle. No savings buffer means any unexpected cost causes stress.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Cut all wants until needs are exactly 50%', outcome: 'Overcorrection — Jordan\'s wants are actually fine. The issue is over-spending in needs and missing savings.', isCorrect: false, score: 1 },
    ] },
  { id: 'u2-l5-e5', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'Jordan\'s biggest overage is in needs (57% vs 50% target), mainly driven by rent. The actionable fix without moving is to find cheaper transport or grocery options.',
    prompt: 'Jordan\'s needs category is 57% of income. Rent is fixed. Which adjustment has the biggest impact?',
    options: [
      { id: 'a', text: 'Cut streaming services', isCorrect: false },
      { id: 'b', text: 'Reduce grocery spend with meal planning', isCorrect: true },
      { id: 'c', text: 'Cancel all dining out', isCorrect: false },
      { id: 'd', text: 'Stop buying clothes entirely', isCorrect: false },
    ] },
  { id: 'u2-l5-e6', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'Synthesising the unit\'s lessons into concrete advice reinforces the concepts.',
    prompt: 'What would you tell Jordan to do differently in month 3 to build lasting financial habits?',
    conceptReveal: 'Three moves: (1) Automate savings transfer on pay day before spending. (2) Set a specific dining-out budget and track it weekly. (3) Review the budget monthly — compare actual vs. planned and adjust one thing.',
    checkpoints: ['Automate savings before you can spend the surplus','Dining and groceries are the most adjustable variable costs','Monthly reviews catch drift before it compounds'] },
];

// ─── Unit 3 — Saving & Emergency Funds ───────────────────────────────────────

const u3l1: Exercise[] = [
  { id: 'u3-l1-e1', kind: 'recallPrompt', competencyId: 'savingSystems',
    rationale: 'Understanding the "why" behind saving makes the habit sustainable.',
    prompt: 'Why do you think saving money matters? What does it actually buy you?',
    conceptReveal: 'Saving buys: (1) Security — a cushion against unexpected costs. (2) Options — the freedom to say yes to opportunities and no to bad situations. (3) Future capability — compound growth turns savings into wealth over time.',
    checkpoints: ['Savings = financial security and peace of mind','Savings give you options, not just money','Starting early amplifies results dramatically via compound growth'] },
  { id: 'u3-l1-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Compound growth is the core mechanism that makes early saving so powerful — returns earn returns.',
    prompt: 'Why does saving early produce dramatically better outcomes than saving the same amount later?',
    options: [
      { id: 'a', text: 'Early savers get higher interest rates', isCorrect: false },
      { id: 'b', text: 'Compound growth — returns earn returns over time', isCorrect: true },
      { id: 'c', text: 'Banks reward long-term customers with bonuses', isCorrect: false },
      { id: 'd', text: 'Inflation affects late savers more', isCorrect: false },
    ] },
  { id: 'u3-l1-e3', kind: 'fillBlank', competencyId: 'savingSystems',
    rationale: 'The compound growth formula is the foundation of understanding why time in market matters.',
    template: 'Compound growth formula: Future Value = Principal × (1 + rate) ^ ___',
    blanks: ['years'],
    wordBank: ['years', 'months', 'rate', 'interest', 'time', 'value'] },
  { id: 'u3-l1-e4', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'Waiting 10 years to start saving can cost you more than half your final balance — time is the most valuable ingredient.',
    statement: 'Starting to save at 35 instead of 25 only reduces your retirement savings by a small amount.',
    isTrue: false },
  { id: 'u3-l1-e5', kind: 'calculator', competencyId: 'savingSystems',
    rationale: '$200/month at 7% for 30 years = ~$227,000. Starting 10 years later at 20 years = ~$98,000. Time adds $129,000 without adding a single extra dollar of contributions.',
    formulaKey: 'compoundGrowth',
    prompt: 'See how $200/month at 7% grows over 30 years vs 20 years.',
    targetLabel: 'Future value',
    explanation: 'Every year you wait shrinks the final balance significantly. Compound growth rewards patience.',
    inputs: [
      { id: 'principal', label: 'Monthly savings', value: 200, min: 50, max: 2000, step: 50, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 1, max: 12, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years saving', value: 30, min: 5, max: 40, step: 1 },
    ] },
  { id: 'u3-l1-e6', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'These four saving motivators map to different financial goals and time horizons.',
    instruction: 'Match each saving reason to its correct description.',
    pairs: [
      { id: 'emerg', term: 'Emergency fund', definition: 'Protects against unexpected costs without debt' },
      { id: 'retire', term: 'Retirement savings', definition: 'Compound growth over decades for financial independence' },
      { id: 'goal', term: 'Goal-based saving', definition: 'Targeted amount for a specific future purchase' },
      { id: 'opport', term: 'Opportunity saving', definition: 'Capital available to act on investment opportunities' },
    ] },
  { id: 'u3-l1-e7', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Windfall money is most impactful when directed to the highest-priority financial gap first.',
    story: 'You receive a $1,000 tax refund. You have no emergency fund, $2,000 in credit card debt at 20% APR, and no retirement savings. What do you do?',
    choices: [
      { id: 'a', text: 'Put $500 in a starter emergency fund; use $500 to reduce credit card debt', outcome: 'Balanced: starter fund prevents new debt during emergencies; the $500 debt reduction saves ~$100/year in interest.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Put all of it into investing for retirement', outcome: 'With 20% APR debt and no emergency fund, investing is the wrong priority — the debt return is guaranteed at 20%.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Spend it — you\'ve worked hard and deserve it', outcome: 'Nothing wrong with enjoying money, but a $1,000 windfall has much more lasting impact when directed strategically.', isCorrect: false, score: 0 },
    ] },
];

const u3l2: Exercise[] = [
  { id: 'u3-l2-e1', kind: 'recallPrompt', competencyId: 'savingSystems',
    rationale: '"Pay yourself first" is the single most impactful habit shift in personal finance.',
    prompt: 'What does "pay yourself first" mean — and why does it work better than saving whatever\'s left over?',
    conceptReveal: 'Pay yourself first: transfer savings automatically on pay day, before you spend anything. "Save the leftovers" fails because spending expands to fill available income. Automation removes willpower from the equation.',
    checkpoints: ['Transfer savings immediately on pay day, not at month end','Automation beats willpower every time','Even $50/month automated beats $200 "when I get around to it"'] },
  { id: 'u3-l2-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Automating savings removes the temptation to spend it and ensures consistency regardless of willpower.',
    prompt: 'Why does automating savings produce better results than manually saving "what\'s left"?',
    options: [
      { id: 'a', text: 'Banks offer better rates for automatic transfers', isCorrect: false },
      { id: 'b', text: 'It removes the decision and prevents leftover-spending', isCorrect: true },
      { id: 'c', text: 'You earn compound interest on the transfer fee', isCorrect: false },
      { id: 'd', text: 'Automatic savings are tax-free', isCorrect: false },
    ] },
  { id: 'u3-l2-e3', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'Even $25–50/month automated creates the habit. Starting small and increasing over time is far more effective than waiting until you "can afford to save more".',
    statement: 'You should only automate savings once you can afford to save at least $500/month.',
    isTrue: false },
  { id: 'u3-l2-e4', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Automating on pay day before discretionary spending is the right sequence.',
    instruction: 'Order these steps to set up a "pay yourself first" system.',
    items: [
      { id: 's1', text: 'Decide on a savings amount (even $50/month)', rank: 1 },
      { id: 's2', text: 'Open a separate savings account if needed', rank: 2 },
      { id: 's3', text: 'Set up an automatic transfer on pay day', rank: 3 },
      { id: 's4', text: 'Budget the remaining income for expenses', rank: 4 },
      { id: 's5', text: 'Increase the transfer amount when income grows', rank: 5 },
    ] },
  { id: 'u3-l2-e5', kind: 'fillBlank', competencyId: 'savingSystems',
    rationale: 'The sequence matters: save first, then spend what remains.',
    template: 'In a pay-yourself-first system: income arrives → ___ transfer → spend what ___',
    blanks: ['automatic savings', 'remains'],
    wordBank: ['automatic savings', 'manual savings', 'remains', 'is left', 'is budgeted', 'is tracked'] },
  { id: 'u3-l2-e6', kind: 'calculator', competencyId: 'savingSystems',
    rationale: 'Automating $100/month at 5% for 10 years = ~$15,500. Waiting 2 years to start = ~$12,300. The two-year delay costs $3,200.',
    formulaKey: 'compoundGrowth',
    prompt: 'See the impact of automating $100/month now vs. starting 2 years later.',
    targetLabel: 'Total saved',
    explanation: 'Every month you delay costs you compound returns. Automate today at any amount.',
    inputs: [
      { id: 'principal', label: 'Monthly auto-transfer', value: 100, min: 25, max: 1000, step: 25, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 5, min: 1, max: 12, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years saving', value: 10, min: 1, max: 40, step: 1 },
    ] },
  { id: 'u3-l2-e7', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Starting small and automating beats planning to save more "soon" — soon rarely comes.',
    story: 'You get a $200/month pay rise. Your options: (A) Add $200 to spending, (B) Automate $150 to savings + keep $50 for spending, (C) Wait until next year to decide.',
    choices: [
      { id: 'a', text: 'Automate $150/month to savings, add $50 to spending', outcome: 'Lifestyle creep: +$50 (reasonable). Savings boost: $1,800/year automated. Over 20 years at 6% = ~$70,000 more.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Add all $200 to spending — reward yourself', outcome: 'Full lifestyle inflation. The raise makes no long-term financial difference — you\'ll feel broke at the higher spend level too.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Wait until next year to decide what to do', outcome: 'Delay is expensive. 12 months × $150 = $1,800 in missed savings contributions — and the habit never gets started.', isCorrect: false, score: 0 },
    ] },
];

const u3l3: Exercise[] = [
  { id: 'u3-l3-e1', kind: 'recallPrompt', competencyId: 'savingSystems',
    rationale: 'An emergency fund is the most foundational financial safety net — it prevents debt spirals.',
    prompt: 'What is an emergency fund, and what kinds of events is it actually for?',
    conceptReveal: 'An emergency fund is 3–6 months of essential expenses kept in a liquid (easy-access) account. It\'s for unexpected, unavoidable costs: job loss, medical emergencies, car or home repairs, major appliance failures — not holidays, deals, or upgrades.',
    checkpoints: ['3–6 months of ESSENTIAL expenses (not total spending)','Liquid and accessible — not invested','Only for genuine unexpected essentials, not wants'] },
  { id: 'u3-l3-e2', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'Using an emergency fund for vacations defeats its purpose — you\'re left exposed when a real emergency hits.',
    statement: 'An emergency fund can be used for great sales, travel, and other exciting opportunities.',
    isTrue: false },
  { id: 'u3-l3-e3', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '3–6 months is the standard recommendation. 3 months suits stable dual-income households; 6 months is safer for single income or variable income.',
    prompt: 'Most financial advisors recommend an emergency fund covering:',
    options: [
      { id: 'a', text: '1 month of expenses', isCorrect: false },
      { id: 'b', text: '3–6 months of essential expenses', isCorrect: true },
      { id: 'c', text: 'Exactly $10,000', isCorrect: false },
      { id: 'd', text: '12 months of total income', isCorrect: false },
    ] },
  { id: 'u3-l3-e4', kind: 'calculator', competencyId: 'savingSystems',
    rationale: 'Knowing your exact emergency fund target makes it a concrete, achievable goal.',
    formulaKey: 'emergencyFund',
    prompt: 'Calculate your 6-month emergency fund target based on essential monthly costs.',
    targetLabel: '6-month target',
    explanation: 'Target = (rent + food + utilities + transport) × months. Only include true essentials.',
    inputs: [
      { id: 'rent', label: 'Rent / housing', value: 950, min: 0, max: 5000, step: 50, prefix: '$' },
      { id: 'food', label: 'Food / groceries', value: 400, min: 0, max: 2000, step: 25, prefix: '$' },
      { id: 'utilities', label: 'Utilities', value: 150, min: 0, max: 1000, step: 25, prefix: '$' },
      { id: 'transport', label: 'Transport', value: 200, min: 0, max: 2000, step: 25, prefix: '$' },
      { id: 'months', label: 'Months coverage', value: 6, min: 3, max: 12, step: 1 },
    ] },
  { id: 'u3-l3-e5', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Knowing which situations qualify as "emergencies" prevents misuse of the fund.',
    instruction: 'Sort each situation into Emergency Use or Not an Emergency.',
    buckets: [{ id: 'emerg', label: 'Emergency Use' }, { id: 'no', label: 'Not an Emergency' }],
    items: [
      { id: 'jobLoss', text: 'Unexpected job loss', bucketId: 'emerg' },
      { id: 'holiday', text: 'Holiday to Europe', bucketId: 'no' },
      { id: 'carBreak', text: 'Car breakdown, needed for work', bucketId: 'emerg' },
      { id: 'sale', text: 'Flash sale on a TV you wanted', bucketId: 'no' },
      { id: 'medBill', text: 'Unexpected medical bill', bucketId: 'emerg' },
      { id: 'phone', text: 'Upgrade to the latest phone', bucketId: 'no' },
    ] },
  { id: 'u3-l3-e6', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Emergency funds exist precisely for this situation. Using it is correct; rebuilding it immediately afterward is the priority.',
    story: 'You have $1,500 in your emergency fund. Your boiler breaks — repair cost: $900. You also have $1,200 in credit card debt at 22% APR. What do you do?',
    choices: [
      { id: 'a', text: 'Pay the repair from the emergency fund, then rebuild it', outcome: 'This is exactly what the fund is for. After the repair, pause extra debt payments temporarily and rebuild the fund first.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Put the repair on the credit card to protect the emergency fund', outcome: '22% APR means ~$16/month in new interest. You paid to protect a fund you aren\'t actually using.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Pay off all credit card debt first, then fix the boiler later', outcome: 'No heating isn\'t liveable. Critical repairs are exactly the use-case for the emergency fund.', isCorrect: false, score: 0 },
    ] },
  { id: 'u3-l3-e7', kind: 'fillBlank', competencyId: 'savingSystems',
    rationale: 'Two requirements make an account right for an emergency fund: liquid (quick access) and separate (out of sight, out of mind).',
    template: 'An emergency fund should be kept in a ___ account that is ___ from your everyday spending account.',
    blanks: ['liquid', 'separate'],
    wordBank: ['liquid', 'invested', 'separate', 'joint', 'locked', 'offshore'] },
];

const u3l4: Exercise[] = [
  { id: 'u3-l4-e1', kind: 'recallPrompt', competencyId: 'savingSystems',
    rationale: 'Goal-based saving is more motivating and achievable than vague "save more" intentions.',
    prompt: 'How would you calculate exactly how much to save each month to buy a $3,000 laptop in 18 months?',
    conceptReveal: 'Monthly saving = goal ÷ months = $3,000 ÷ 18 = $167/month. Making a goal specific (dollar amount + deadline) converts a wish into a plan.',
    checkpoints: ['Monthly amount = goal ÷ months','Specific goal + deadline = actionable plan','Track progress monthly — adjust if income or timeline changes'] },
  { id: 'u3-l4-e2', kind: 'calculator', competencyId: 'savingSystems',
    rationale: 'The savings goal formula is simple division — but running the numbers makes the habit concrete.',
    formulaKey: 'savingsGoal',
    prompt: 'Calculate the monthly savings needed to reach your goal within your timeline.',
    targetLabel: 'Monthly savings needed',
    explanation: 'Monthly savings = goal amount ÷ months. With interest, you need slightly less each month.',
    inputs: [
      { id: 'goal', label: 'Savings goal', value: 5000, min: 500, max: 50000, step: 500, prefix: '$' },
      { id: 'months', label: 'Months to save', value: 24, min: 3, max: 120, step: 3 },
      { id: 'rate', label: 'Interest rate (APY)', value: 4, min: 0, max: 10, step: 0.5, suffix: '%' },
    ] },
  { id: 'u3-l4-e3', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$12,000 ÷ 24 months = $500/month, ignoring interest.',
    prompt: 'You want to save $12,000 for a house deposit in 24 months. How much do you need to save per month (ignoring interest)?',
    options: [
      { id: 'a', text: '$400/month', isCorrect: false },
      { id: 'b', text: '$500/month', isCorrect: true },
      { id: 'c', text: '$600/month', isCorrect: false },
      { id: 'd', text: '$1,000/month', isCorrect: false },
    ] },
  { id: 'u3-l4-e4', kind: 'fillBlank', competencyId: 'savingSystems',
    rationale: 'Separating savings into named "pots" or sub-accounts per goal makes tracking clear and prevents raiding one goal to fund another.',
    template: 'A savings "___" or sub-account for each goal prevents accidentally spending goal money on something ___.',
    blanks: ['pot', 'else'],
    wordBank: ['pot', 'fund', 'else', 'important', 'unrelated', 'budgeted'] },
  { id: 'u3-l4-e5', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Goal-setting before calculating ensures you\'re solving the right problem.',
    instruction: 'Order these savings goal steps correctly.',
    items: [
      { id: 's1', text: 'Name your goal and set the target amount', rank: 1 },
      { id: 's2', text: 'Set a deadline', rank: 2 },
      { id: 's3', text: 'Calculate: goal ÷ months = monthly amount', rank: 3 },
      { id: 's4', text: 'Open a dedicated sub-account for the goal', rank: 4 },
      { id: 's5', text: 'Automate the monthly transfer on pay day', rank: 5 },
    ] },
  { id: 'u3-l4-e6', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Separating short-term and long-term savings prevents raiding retirement for immediate goals.',
    story: 'You have two goals: a $4,000 holiday in 12 months and a retirement fund. You can save $500/month total. How do you split it?',
    choices: [
      { id: 'a', text: '$333/month to holiday fund, $167/month to retirement', outcome: 'Holiday funded in 12 months ($4,000). Retirement gets $2,004/year — small but the habit started. Review after the holiday.', isCorrect: true, score: 3 },
      { id: 'b', text: 'All $500 to holiday fund, start retirement after', outcome: 'Fast to the holiday, but another year of retirement delay is compounding time lost forever.', isCorrect: false, score: 1 },
      { id: 'c', text: 'All $500 to retirement, no holiday this year', outcome: 'Retirement-optimal but ignores a real near-term goal. Balance is healthier than all-or-nothing.', isCorrect: false, score: 1 },
    ] },
  { id: 'u3-l4-e7', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'Interest earned in a savings account means you need to save slightly less per month than goal ÷ months.',
    statement: 'If your savings account earns interest, you need to save more than goal ÷ months to hit your target.',
    isTrue: false },
];

const u3Practice: Exercise[] = [
  u3l1[1]!, // MC: why save early (compound growth)
  u3l2[2]!, // T/F: wait until $500/month
  u3l3[2]!, // MC: 3-6 months recommendation
  u3l4[2]!, // MC: $12,000 deposit calculation
];

const u3l5: Exercise[] = [
  { id: 'u3-l5-e1', kind: 'miniStory', competencyId: 'savingSystems',
    rationale: 'Applying saving concepts to a realistic scenario with real stakes.',
    panels: [
      { text: 'Sam, 26, has $800 in savings — just started building an emergency fund. Monthly essentials: $1,600. Sam also has a $2,500 goal to visit family interstate, and just got a $300/month pay rise.', speaker: 'Narrator' },
      { text: 'Then it happens: Sam\'s landlord raises rent by $250/month. Sam has no buffer and starts to panic.', speaker: 'Narrator' },
    ],
    choicePrompt: "What should Sam do with the pay rise to handle this situation?",
    choices: [
      { id: 'a', text: 'Use the pay rise to cover the rent increase ($250) + put $50/month into emergency fund', outcome: 'Smart. The rent increase is absorbed without cutting lifestyle. $50/month to the emergency fund starts rebuilding the buffer.', isCorrect: true },
      { id: 'b', text: 'Use the pay rise entirely on the holiday goal', outcome: 'The rent increase now comes out of existing expenses — likely creating a deficit.', isCorrect: false },
    ] },
  { id: 'u3-l5-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Sam\'s 6-month emergency target = $1,600 × 6 = $9,600. With $800 already saved, the gap is $8,800.',
    prompt: "Sam's monthly essential expenses are $1,600. What is the 6-month emergency fund target?",
    options: [
      { id: 'a', text: '$4,800', isCorrect: false },
      { id: 'b', text: '$9,600', isCorrect: true },
      { id: 'c', text: '$6,400', isCorrect: false },
      { id: 'd', text: '$12,000', isCorrect: false },
    ] },
  { id: 'u3-l5-e3', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Emergency fund completion comes before investment or large discretionary goals — it\'s the financial foundation.',
    story: 'Sam has a $50/month surplus after the rent increase. Emergency fund gap = $8,800. Holiday goal = $2,500 in 12 months (needs $208/month). Sam can\'t afford both. What should Sam prioritise?',
    choices: [
      { id: 'a', text: 'Build emergency fund first — pause the holiday goal', outcome: 'Correct priority order. An unexpected cost of $500+ would wipe out Sam\'s current savings. The fund protects everything else.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Split $50 between both goals', outcome: '$25/month to each. Emergency fund takes 29 years at that rate. The holiday goal isn\'t funded either. Neither succeeds.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Focus on the holiday — life is short', outcome: 'Without an emergency buffer, the next unexpected cost creates debt. The holiday becomes a financial risk, not a reward.', isCorrect: false, score: 0 },
    ] },
  { id: 'u3-l5-e4', kind: 'calculator', competencyId: 'savingSystems',
    rationale: 'With $50/month, it takes 176 months (~14.7 years) to reach a $8,800 emergency fund without interest — illustrating why saving more is so important.',
    formulaKey: 'savingsGoal',
    prompt: 'Calculate how long it takes Sam to build a full $9,600 emergency fund at different monthly savings rates.',
    targetLabel: 'Months to goal',
    explanation: 'Months = goal ÷ monthly savings. Increasing the monthly amount dramatically shrinks the timeline.',
    inputs: [
      { id: 'goal', label: 'Emergency fund target', value: 9600, min: 1000, max: 30000, step: 500, prefix: '$' },
      { id: 'months', label: 'Months to save', value: 24, min: 6, max: 120, step: 6 },
      { id: 'rate', label: 'Savings account APY', value: 4, min: 0, max: 8, step: 0.5, suffix: '%' },
    ] },
  { id: 'u3-l5-e5', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Distinguishing short-term vs. long-term savings helps allocate correctly between goals.',
    instruction: "Sort Sam's financial goals by priority order.",
    buckets: [{ id: 'now', label: 'Priority: Now' }, { id: 'later', label: 'Priority: Later' }],
    items: [
      { id: 'emFund', text: 'Complete emergency fund ($9,600 target)', bucketId: 'now' },
      { id: 'holiday', text: 'Save for holiday ($2,500)', bucketId: 'later' },
      { id: 'retire', text: 'Start retirement investing', bucketId: 'later' },
      { id: 'buffer', text: 'Keep $800 already in savings liquid', bucketId: 'now' },
    ] },
  { id: 'u3-l5-e6', kind: 'recallPrompt', competencyId: 'savingSystems',
    rationale: 'Synthesising the saving principles reinforces the logical priority order.',
    prompt: "What's the right order for Sam's financial priorities, and why does emergency fund come before investment or holiday savings?",
    conceptReveal: 'Order: (1) Emergency fund to 3–6 months. (2) Pay off high-interest debt. (3) Short-term goals. (4) Long-term investing. Without the emergency fund, any unexpected cost creates debt — undoing all other progress.',
    checkpoints: ['Emergency fund is the financial foundation — everything else rests on it','Without it, an emergency wipes out other savings or creates debt','Completing it unlocks the ability to pursue other goals confidently'] },
];

// ─── Unit 4 — Banking Basics ──────────────────────────────────────────────────

const u4l1: Exercise[] = [
  { id: 'u4-l1-e1', kind: 'recallPrompt', competencyId: 'banking',
    rationale: 'Choosing the right account for the right purpose is foundational banking literacy.',
    prompt: 'What\'s the difference between a checking account and a savings account — when would you use each?',
    conceptReveal: 'Checking: day-to-day transactions — salary goes in, bills and purchases go out. Unlimited transactions. Savings: storing money you don\'t need immediately — earns interest, limited withdrawals per month. Use both: checking for flow, savings for accumulation.',
    checkpoints: ['Checking = daily transaction account (bills, spending)','Savings = accumulation account (earns interest, fewer withdrawals)','Most people need both — each serves a different purpose'] },
  { id: 'u4-l1-e2', kind: 'matchPairs', competencyId: 'banking',
    rationale: 'Understanding the distinct features of each account type prevents using the wrong one for the wrong job.',
    instruction: 'Match each account feature to its account type.',
    pairs: [
      { id: 'check1', term: 'Debit card for daily purchases', definition: 'Checking account' },
      { id: 'check2', term: 'Direct deposit of your salary', definition: 'Checking account' },
      { id: 'save1', term: 'Earns annual percentage yield (APY)', definition: 'Savings account' },
      { id: 'save2', term: 'Limited monthly withdrawals', definition: 'Savings account' },
    ] },
  { id: 'u4-l1-e3', kind: 'categorize', competencyId: 'banking',
    rationale: 'Matching transactions to the right account type builds practical banking habits.',
    instruction: 'Sort each transaction into the correct account type.',
    buckets: [{ id: 'check', label: 'Checking' }, { id: 'save', label: 'Savings' }],
    items: [
      { id: 'rent', text: 'Pay monthly rent via direct debit', bucketId: 'check' },
      { id: 'emfund', text: 'Store emergency fund', bucketId: 'save' },
      { id: 'grocery', text: 'Pay for groceries with debit card', bucketId: 'check' },
      { id: 'goal', text: 'Accumulate holiday savings', bucketId: 'save' },
      { id: 'salary', text: 'Receive your salary', bucketId: 'check' },
    ] },
  { id: 'u4-l1-e4', kind: 'multipleChoice', competencyId: 'banking',
    rationale: 'Savings accounts pay interest; checking accounts typically don\'t (or earn negligible amounts).',
    prompt: 'Which account typically earns you interest on the balance you keep in it?',
    options: [
      { id: 'a', text: 'Checking account', isCorrect: false },
      { id: 'b', text: 'Savings account', isCorrect: true },
      { id: 'c', text: 'Both equally', isCorrect: false },
      { id: 'd', text: 'Neither — banks don\'t pay interest anymore', isCorrect: false },
    ] },
  { id: 'u4-l1-e5', kind: 'trueFalse', competencyId: 'banking',
    rationale: 'Online-only banks often offer significantly higher APY than traditional bricks-and-mortar banks, due to lower operating costs.',
    statement: 'Online savings accounts always pay lower interest rates than traditional bank accounts.',
    isTrue: false },
  { id: 'u4-l1-e6', kind: 'fillBlank', competencyId: 'banking',
    rationale: 'APY (Annual Percentage Yield) is the standard measure of what a savings account actually earns per year including compounding.',
    template: 'The interest rate on a savings account is expressed as ___ (Annual Percentage Yield), which includes the effect of ___.',
    blanks: ['APY', 'compounding'],
    wordBank: ['APY', 'APR', 'compounding', 'inflation', 'taxation', 'dividends'] },
  { id: 'u4-l1-e7', kind: 'scenarioDecision', competencyId: 'banking',
    rationale: 'Having the right account setup prevents paying unnecessary fees and maximises returns on idle cash.',
    story: 'You have $4,000 you won\'t need for 12 months. It\'s sitting in your checking account earning 0%. You see a high-yield savings account offering 4.5% APY. What do you do?',
    choices: [
      { id: 'a', text: 'Move $3,500 to the high-yield savings account, keep $500 in checking', outcome: 'Smart. $3,500 at 4.5% = ~$158 in interest over 12 months. Keeping $500 in checking covers small unexpected costs.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Keep it all in checking for convenience', outcome: 'You left ~$180 on the table. Moving money between accounts takes 5 minutes and is entirely reversible.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Move all $4,000 to savings', outcome: 'Good for maximising interest, but leaves zero buffer in checking for daily transactions.', isCorrect: false, score: 1 },
    ] },
];

const u4l2: Exercise[] = [
  { id: 'u4-l2-e1', kind: 'recallPrompt', competencyId: 'banking',
    rationale: 'Understanding APY vs APR and how interest compounds is foundational financial literacy.',
    prompt: 'If your savings account pays 5% APY, and you have $1,000 — how much do you earn in a year, and how does compounding affect that?',
    conceptReveal: '5% APY on $1,000 = $50 in year 1. With monthly compounding, slightly more (~$51.16). APY already accounts for compounding, so $1,000 × APY gives you the correct annual figure. In year 2, interest accrues on $1,050 — you earn $52.50.',
    checkpoints: ['APY already includes compounding — use it to compare accounts','Compound interest means you earn interest on previous interest','The difference grows dramatically over many years'] },
  { id: 'u4-l2-e2', kind: 'fillBlank', competencyId: 'banking',
    rationale: 'APR is the rate before compounding; APY is what you actually earn/pay after compounding — always compare APY to APY.',
    template: '___ is the rate before compounding; ___ is what you actually earn or pay after compounding.',
    blanks: ['APR', 'APY'],
    wordBank: ['APR', 'APY', 'AER', 'gross rate', 'net rate', 'base rate'] },
  { id: 'u4-l2-e3', kind: 'trueFalse', competencyId: 'banking',
    rationale: 'Compound interest works both ways: it grows savings and also grows debt — this is why high-interest debt compounds against you.',
    statement: 'Compound interest only works in your favour on savings accounts — it doesn\'t apply to debt.',
    isTrue: false },
  { id: 'u4-l2-e4', kind: 'calculator', competencyId: 'banking',
    rationale: 'Seeing compound growth in action makes the concept concrete and motivates saving.',
    formulaKey: 'compoundGrowth',
    prompt: 'See how a $2,000 deposit grows at different APY rates over time.',
    targetLabel: 'Future value',
    explanation: 'Future value = principal × (1 + rate)^years. Each year, interest is added to the principal, so the next year\'s interest is larger.',
    inputs: [
      { id: 'principal', label: 'Initial deposit', value: 2000, min: 100, max: 50000, step: 100, prefix: '$' },
      { id: 'rate', label: 'Annual APY', value: 4, min: 0.5, max: 10, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years', value: 10, min: 1, max: 40, step: 1 },
    ] },
  { id: 'u4-l2-e5', kind: 'multipleChoice', competencyId: 'banking',
    rationale: '$1,000 × 1.05^2 = $1,102.50. Year 1: $50 interest. Year 2: interest on $1,050 = $52.50.',
    prompt: 'You deposit $1,000 at 5% APY compounding annually. After 2 years, your balance is:',
    options: [
      { id: 'a', text: '$1,100 (simple interest)', isCorrect: false },
      { id: 'b', text: '$1,102.50', isCorrect: true },
      { id: 'c', text: '$1,105', isCorrect: false },
      { id: 'd', text: '$1,050', isCorrect: false },
    ] },
  { id: 'u4-l2-e6', kind: 'matchPairs', competencyId: 'banking',
    rationale: 'Knowing these key banking terms enables confident account comparison and decision-making.',
    instruction: 'Match each banking term to its definition.',
    pairs: [
      { id: 'apy', term: 'APY', definition: 'Annual return including the effect of compounding' },
      { id: 'apr', term: 'APR', definition: 'Annual rate without compounding (often used for loans)' },
      { id: 'compound', term: 'Compound interest', definition: 'Earning interest on previously earned interest' },
      { id: 'simple', term: 'Simple interest', definition: 'Interest calculated only on the original principal' },
    ] },
  { id: 'u4-l2-e7', kind: 'scenarioDecision', competencyId: 'banking',
    rationale: 'Higher APY always wins for savings; lower APR always wins for borrowing — but the compounding frequency also matters.',
    story: 'You\'re choosing between two savings accounts: Account A pays 4.8% APY (online-only bank). Account B pays 4.5% APY (local branch bank). Both are FDIC-insured. You have $5,000 to deposit.',
    choices: [
      { id: 'a', text: 'Choose Account A (4.8% APY)', outcome: 'Correct. 4.8% vs 4.5% = $15 extra per year on $5,000. Over 10 years: ~$200 more with compounding. Always go higher APY if safety and liquidity are equal.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Choose Account B — local branch banks are safer', outcome: 'Both are FDIC-insured to $250,000. Safety is identical. The local branch costs you $15/year in foregone interest.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Keep money in checking instead', outcome: 'Checking earns 0%. Leaving $5,000 in checking costs you $240/year vs Account A.', isCorrect: false, score: 0 },
    ] },
];

const u4l3: Exercise[] = [
  { id: 'u4-l3-e1', kind: 'recallPrompt', competencyId: 'banking',
    rationale: 'Knowing common fees helps avoid paying unnecessary charges.',
    prompt: 'What are the most common bank fees — and how would you avoid each one?',
    conceptReveal: 'Common fees: (1) Monthly maintenance fee — waived by minimum balance or direct deposit. (2) Overdraft fee ($25–35) — set up low-balance alerts. (3) ATM fee — use in-network ATMs. (4) Wire transfer fee — use free alternatives (ACH, apps). Prevention beats recovery.',
    checkpoints: ['Monthly fees are often waivable — read the conditions','Overdraft fees are among the most expensive per-dollar costs','ATM fees add up fast — know your bank\'s network'] },
  { id: 'u4-l3-e2', kind: 'multipleChoice', competencyId: 'banking',
    rationale: 'An overdraft occurs when you spend more than your account balance, triggering a fee (or a declined transaction).',
    prompt: 'An overdraft happens when:',
    options: [
      { id: 'a', text: 'You withdraw money from a foreign ATM', isCorrect: false },
      { id: 'b', text: 'You spend more than your account balance', isCorrect: true },
      { id: 'c', text: 'Your bank charges a monthly maintenance fee', isCorrect: false },
      { id: 'd', text: 'You transfer money to savings', isCorrect: false },
    ] },
  { id: 'u4-l3-e3', kind: 'trueFalse', competencyId: 'banking',
    rationale: 'Overdraft protection can lead to $35 fees on small transactions — a $5 coffee triggering a $35 fee is a 700% cost. Declined transactions are often better.',
    statement: 'Opting in to overdraft protection always saves you money compared to a declined transaction.',
    isTrue: false },
  { id: 'u4-l3-e4', kind: 'fillBlank', competencyId: 'banking',
    rationale: 'Maintenance fees are typically waived when you meet the bank\'s balance or direct-deposit condition.',
    template: 'Most monthly maintenance fees can be ___ by maintaining a minimum balance or setting up direct ___.',
    blanks: ['waived', 'deposit'],
    wordBank: ['waived', 'paid', 'avoided', 'deposit', 'debit', 'transfer', 'reduced'] },
  { id: 'u4-l3-e5', kind: 'tapToOrder', competencyId: 'banking',
    rationale: 'Systematically checking each fee type ensures none are missed.',
    instruction: 'Order these steps for auditing your bank fees.',
    items: [
      { id: 's1', text: 'Download 3 months of bank statements', rank: 1 },
      { id: 's2', text: 'Highlight every fee charged', rank: 2 },
      { id: 's3', text: 'Identify which fees are avoidable (maintenance, ATM)', rank: 3 },
      { id: 's4', text: 'Take the required action to waive future fees', rank: 4 },
      { id: 's5', text: 'Set up low-balance alerts to prevent overdrafts', rank: 5 },
    ] },
  { id: 'u4-l3-e6', kind: 'scenarioDecision', competencyId: 'banking',
    rationale: 'Switching to a fee-free account or meeting waiver conditions is the best fix for ongoing maintenance fees.',
    story: 'You\'re being charged $12/month in maintenance fees. Your bank waives this if you: (A) maintain a $1,500 minimum daily balance, or (B) set up direct deposit. You have $800 in the account and no direct deposit set up yet.',
    choices: [
      { id: 'a', text: 'Set up direct deposit from your employer', outcome: 'Zero cost, immediate waiver. The easiest fix — takes 10 minutes to set up.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Transfer money to maintain $1,500 balance', outcome: 'Works if you have the funds, but ties up $1,500 earning nothing in checking. Direct deposit is a better solution.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Accept the fees — switching banks is too complicated', outcome: '$12/month = $144/year. Switching or qualifying for a waiver takes under an hour and pays for itself immediately.', isCorrect: false, score: 0 },
    ] },
  { id: 'u4-l3-e7', kind: 'categorize', competencyId: 'banking',
    rationale: 'Knowing which fees are genuinely avoidable (behavioural) vs. structural helps prioritise action.',
    instruction: 'Sort each bank fee into Avoidable or Hard to Avoid.',
    buckets: [{ id: 'avoid', label: 'Avoidable' }, { id: 'hard', label: 'Hard to Avoid' }],
    items: [
      { id: 'maint', text: 'Monthly maintenance fee', bucketId: 'avoid' },
      { id: 'wire', text: 'International wire transfer fee', bucketId: 'hard' },
      { id: 'overdraft', text: 'Overdraft fee from overspending', bucketId: 'avoid' },
      { id: 'atm', text: 'Out-of-network ATM fee', bucketId: 'avoid' },
      { id: 'foreignTx', text: 'Foreign transaction fee while abroad', bucketId: 'hard' },
    ] },
];

const u4l4: Exercise[] = [
  { id: 'u4-l4-e1', kind: 'recallPrompt', competencyId: 'banking',
    rationale: 'Knowing how to protect accounts prevents the most common forms of financial fraud.',
    prompt: 'What are the three most important things you can do to keep your bank account safe?',
    conceptReveal: '(1) Unique, strong password — use a password manager. (2) Enable 2FA (two-factor authentication) on banking apps. (3) Monitor statements monthly for unauthorised transactions — report them within 60 days.',
    checkpoints: ['Strong unique password + 2FA is the first line of defence','Monitor statements monthly — early detection limits loss','Report suspicious activity immediately — time limits apply to liability'] },
  { id: 'u4-l4-e2', kind: 'matchPairs', competencyId: 'banking',
    rationale: 'Each fraud type requires a different response — knowing the correct action limits damage.',
    instruction: 'Match each threat to the correct protective action.',
    pairs: [
      { id: 'phish', term: 'Phishing email asking for login details', definition: 'Delete it — banks never ask for passwords via email' },
      { id: 'unauth', term: 'Unauthorised charge on statement', definition: 'Call the bank immediately to dispute and request a chargeback' },
      { id: 'smish', term: 'SMS claiming your account is locked', definition: 'Call the bank directly using the number on their website' },
      { id: 'weak', term: 'Using the same password for all accounts', definition: 'Change to unique passwords — use a password manager' },
    ] },
  { id: 'u4-l4-e3', kind: 'trueFalse', competencyId: 'banking',
    rationale: 'Phishing is the most common attack vector. Legitimate banks will never ask for your password, full card number, or PIN via email, phone, or text.',
    statement: 'Your bank may email you asking for your password to verify your identity.',
    isTrue: false },
  { id: 'u4-l4-e4', kind: 'multipleChoice', competencyId: 'banking',
    rationale: 'Two-factor authentication adds a second verification step — even if your password is stolen, the attacker can\'t log in without the second factor.',
    prompt: 'What does two-factor authentication (2FA) add to account security?',
    options: [
      { id: 'a', text: 'A longer password requirement', isCorrect: false },
      { id: 'b', text: 'A second verification step (e.g. SMS code) beyond your password', isCorrect: true },
      { id: 'c', text: 'Automatic fraud insurance', isCorrect: false },
      { id: 'd', text: 'Encryption of your transactions', isCorrect: false },
    ] },
  { id: 'u4-l4-e5', kind: 'categorize', competencyId: 'banking',
    rationale: 'Distinguishing secure from insecure actions is practical account-safety knowledge.',
    instruction: 'Sort each action into Secure Practice or Security Risk.',
    buckets: [{ id: 'safe', label: 'Secure' }, { id: 'risk', label: 'Security Risk' }],
    items: [
      { id: '2fa', text: 'Enable 2FA on all banking apps', bucketId: 'safe' },
      { id: 'samePw', text: 'Use the same password for all accounts', bucketId: 'risk' },
      { id: 'monitor', text: 'Check statements monthly for unknown charges', bucketId: 'safe' },
      { id: 'wifi', text: 'Log in to banking on public Wi-Fi', bucketId: 'risk' },
      { id: 'unique', text: 'Use a unique email for banking login', bucketId: 'safe' },
    ] },
  { id: 'u4-l4-e6', kind: 'scenarioDecision', competencyId: 'banking',
    rationale: 'Acting immediately on unauthorised charges limits financial liability and maximises the chance of recovery.',
    story: 'Reviewing your statement, you see a $180 charge from a merchant you don\'t recognise. You have 60 days to dispute it. What do you do?',
    choices: [
      { id: 'a', text: 'Call the bank immediately, report it as unauthorised', outcome: 'Correct. Banks will investigate and issue a provisional credit while they do. Acting within days maximises your liability protection.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Wait to see if it reverses on its own', outcome: 'Unauthorised charges rarely reverse themselves. Waiting reduces your liability protection and the chance of recovery.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Google the merchant name first to check if it\'s legitimate', outcome: 'Good first step, but if you still don\'t recognise it, call the bank immediately — don\'t delay.', isCorrect: false, score: 1 },
    ] },
  { id: 'u4-l4-e7', kind: 'fillBlank', competencyId: 'banking',
    rationale: 'The 60-day rule for disputing charges is a key practical detail many people don\'t know.',
    template: 'You typically have ___ days to dispute an unauthorised transaction. After this window, ___ may be reduced.',
    blanks: ['60', 'protection'],
    wordBank: ['60', '30', '90', 'protection', 'reimbursement', 'liability', 'coverage'] },
];

const u4Practice: Exercise[] = [
  u4l1[3]!, // MC: which account earns interest
  u4l2[4]!, // MC: compound interest after 2 years
  u4l3[1]!, // MC: what is an overdraft
  u4l4[2]!, // T/F: banks email for passwords
];

const u4l5: Exercise[] = [
  { id: 'u4-l5-e1', kind: 'miniStory', competencyId: 'banking',
    rationale: 'Choosing the right banking setup for a specific life situation applies all unit concepts.',
    panels: [
      { text: 'Maya, 22, just got her first job. She has $1,200 saved. She needs to receive her salary, pay rent and bills, build an emergency fund, and avoid fees.', speaker: 'Narrator' },
      { text: 'Maya visits her local bank and sees three options: (A) Free checking with direct deposit. (B) Premium checking — $15/month, waived with $2,000 balance. (C) High-yield savings at 4.5% APY.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What account setup should Maya open?',
    choices: [
      { id: 'a', text: 'Free checking (option A) + high-yield savings (option C)', outcome: 'Perfect setup. Free checking for day-to-day flow. High-yield savings for the emergency fund at 4.5% APY. No fees with direct deposit.', isCorrect: true },
      { id: 'b', text: 'Premium checking (option B) only', outcome: 'Maya has $1,200 — below the $2,000 waiver threshold. She\'ll pay $180/year in fees. Option A is free and equally functional.', isCorrect: false },
    ] },
  { id: 'u4-l5-e2', kind: 'categorize', competencyId: 'banking',
    rationale: 'Allocating each financial purpose to the right account type prevents mixing spending and savings.',
    instruction: "Assign Maya's financial activities to the correct account.",
    buckets: [{ id: 'check', label: 'Checking account' }, { id: 'save', label: 'High-yield savings' }],
    items: [
      { id: 'salary', text: 'Receive monthly salary', bucketId: 'check' },
      { id: 'rent', text: 'Auto-pay rent and bills', bucketId: 'check' },
      { id: 'emerg', text: 'Build emergency fund', bucketId: 'save' },
      { id: 'grocDebit', text: 'Grocery debit card purchases', bucketId: 'check' },
      { id: 'goalSave', text: 'Save for a car deposit', bucketId: 'save' },
    ] },
  { id: 'u4-l5-e3', kind: 'scenarioDecision', competencyId: 'banking',
    rationale: 'Automating the savings transfer before discretionary spending removes temptation and builds the fund faster.',
    story: 'Maya wants to build a $6,000 emergency fund. She can save $200/month. She could: (A) Manually transfer $200 at month end, or (B) Set up auto-transfer of $200 on pay day to the savings account.',
    choices: [
      { id: 'a', text: 'Auto-transfer $200 on pay day (option B)', outcome: 'Correct. Pay-yourself-first automation ensures the $200 happens every month. Manual transfers fail when life gets busy.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Manual transfer at month end (option A)', outcome: '3-in-5 people who plan to manually transfer end up spending the money instead. Automate to remove the decision.', isCorrect: false, score: 0 },
    ] },
  { id: 'u4-l5-e4', kind: 'multipleChoice', competencyId: 'banking',
    rationale: '$6,000 ÷ $200/month = 30 months. But with 4.5% APY compounding, the timeline shortens to ~28 months.',
    prompt: "At $200/month, how long does it take Maya to reach a $6,000 emergency fund (ignoring interest)?",
    options: [
      { id: 'a', text: '24 months', isCorrect: false },
      { id: 'b', text: '30 months', isCorrect: true },
      { id: 'c', text: '36 months', isCorrect: false },
      { id: 'd', text: '18 months', isCorrect: false },
    ] },
  { id: 'u4-l5-e5', kind: 'fillBlank', competencyId: 'banking',
    rationale: 'FDIC insurance is the standard protection that makes bank deposits safe up to $250,000.',
    template: 'In the US, bank deposits are insured up to $___ per depositor per institution by the ___.',
    blanks: ['250,000', 'FDIC'],
    wordBank: ['250,000', '100,000', '500,000', 'FDIC', 'SEC', 'Fed', 'CFPB'] },
  { id: 'u4-l5-e6', kind: 'recallPrompt', competencyId: 'banking',
    rationale: 'Synthesising banking setup decisions makes the knowledge portable to real-life situations.',
    prompt: "What's the ideal bank account setup for someone who just started earning an income? Walk through your reasoning.",
    conceptReveal: 'Setup: (1) Free checking account with direct deposit for salary and bills. (2) High-yield savings account for emergency fund and goals. (3) Enable 2FA on both. (4) Set up auto-transfer to savings on pay day. (5) Review statements monthly.',
    checkpoints: ['Checking for flow, savings for accumulation — two separate accounts','High-yield savings maximises return on idle cash','Automation + monthly review closes the loop'] },
];

// ─── Unit 5 — Smart Spending ─────────────────────────────────────────────────

const u5l1: Exercise[] = [
  { id: 'u5-l1-e1', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Distinguishing price from value is the core insight that separates smart spenders from impulsive ones.',
    prompt: 'Can you think of a time you paid more for something and it was worth it — or paid less and regretted it?',
    conceptReveal: 'Value = quality ÷ price. A $200 pair of shoes lasting 5 years = $40/year. A $50 pair lasting 6 months = $100/year. Price is what you pay; value is what you get per dollar. Always calculate cost-per-use for high-frequency items.',
    checkpoints: ['Value = total benefit ÷ total cost (cost-per-use)','Higher price doesn\'t guarantee higher value','Calculate cost-per-use for purchases you\'ll use repeatedly'] },
  { id: 'u5-l1-e2', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Cost-per-use is the clearest way to compare value across different price points.',
    prompt: 'Blender A costs $80 and lasts 4 years. Blender B costs $40 and lasts 1 year. Which is better value?',
    options: [
      { id: 'a', text: 'Blender B — lower upfront cost', isCorrect: false },
      { id: 'b', text: 'Blender A — $20/year vs $40/year cost-per-year', isCorrect: true },
      { id: 'c', text: 'They\'re equal value', isCorrect: false },
      { id: 'd', text: 'Impossible to say without more information', isCorrect: false },
    ] },
  { id: 'u5-l1-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'Generic and store-brand products are often manufactured by the same factories as name brands. Studies show quality is frequently identical at 20–40% lower cost.',
    statement: 'Branded products are always higher quality than generic alternatives.',
    isTrue: false },
  { id: 'u5-l1-e4', kind: 'fillBlank', competencyId: 'behavior',
    rationale: 'Unit price comparison is essential for grocery shopping — it\'s the only fair way to compare different package sizes.',
    template: 'To find the best value at the grocery store, compare ___ price (price per gram or ounce) between brands and sizes.',
    blanks: ['unit'],
    wordBank: ['unit', 'total', 'sale', 'bulk', 'average', 'comparison'] },
  { id: 'u5-l1-e5', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Understanding these value concepts equips you to make smarter purchase decisions across categories.',
    instruction: 'Match each concept to its correct definition.',
    pairs: [
      { id: 'cpu', term: 'Cost-per-use', definition: 'Total price divided by number of times you use it' },
      { id: 'unit', term: 'Unit price', definition: 'Price per gram, ounce, or litre for product comparison' },
      { id: 'quality', term: 'Quality-price trade-off', definition: 'Higher price doesn\'t always mean proportionally higher quality' },
      { id: 'totalCost', term: 'Total cost of ownership', definition: 'Upfront cost plus ongoing maintenance and running costs' },
    ] },
  { id: 'u5-l1-e6', kind: 'calculator', competencyId: 'behavior',
    rationale: 'The annual cost of a daily habit is rarely visible until you calculate it explicitly.',
    formulaKey: 'annualCost',
    prompt: 'Calculate the annual cost of a daily habit — and see how it adds up.',
    targetLabel: 'Annual cost',
    explanation: 'Annual cost = daily cost × 365. Over multiple years, this reveals the true cost of small recurring habits.',
    inputs: [
      { id: 'daily', label: 'Daily cost', value: 5, min: 1, max: 100, step: 1, prefix: '$' },
      { id: 'days', label: 'Days per year', value: 365, min: 1, max: 365, step: 1 },
      { id: 'years', label: 'Years', value: 3, min: 1, max: 20, step: 1 },
    ] },
  { id: 'u5-l1-e7', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Comparison shopping before large purchases often yields 10–30% savings with minimal time investment.',
    story: 'You need a new laptop. Store A has it for $1,199. The same model is $999 online with 2-day shipping. Total saving: $200. What do you do?',
    choices: [
      { id: 'a', text: 'Buy online and save $200', outcome: 'Smart. Same product, same warranty, 2-day delivery. $200 saved = 2+ hours of work at most incomes. Always compare before purchasing.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Buy in-store for convenience', outcome: 'Convenience has a cost: $200 in this case. For a $200 saving, 5 minutes of comparison shopping is excellent ROI.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Ask the store to price-match', outcome: 'Excellent move if they\'ll do it — you get the saving and immediate availability. Always try this first.', isCorrect: true, score: 3 },
    ] },
];

const u5l2: Exercise[] = [
  { id: 'u5-l2-e1', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Recognising impulse triggers is the first step to overcoming them.',
    prompt: 'Think of a purchase you regretted. What triggered it — and what could you have done differently?',
    conceptReveal: 'Impulse purchases are triggered by: (1) Emotion (stress, excitement, FOMO). (2) Marketing — scarcity ("only 3 left!"), social proof, urgency. (3) Availability — one-click buying removes friction. The 24-hour rule: wait before any unplanned purchase over $30.',
    checkpoints: ['Impulse triggers: emotion, scarcity, urgency, easy checkout','The 24-hour rule eliminates ~80% of impulse regrets','Remove purchase friction: unsubscribe from marketing emails, delete saved cards'] },
  { id: 'u5-l2-e2', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'Seeing a character navigate an impulse scenario makes the principles concrete.',
    panels: [
      { text: 'Kai gets a "LAST CHANCE — 30% off" email from a clothing brand at 11pm. Kai doesn\'t need anything but clicks through and adds three items to the cart.', speaker: 'Narrator' },
      { text: 'The cart shows "Only 2 remaining!" on one item. Kai feels the urgency. Total: $180.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Kai do?',
    choices: [
      { id: 'a', text: 'Close the tab and revisit tomorrow morning', outcome: 'Smart. "Only 2 remaining" and "LAST CHANCE" are standard scarcity tactics. If Kai still wants it tomorrow, it\'s probably not truly in stock shortage.', isCorrect: true },
      { id: 'b', text: 'Buy now before the sale ends', outcome: 'The sale likely recurs. The "scarcity" claim is often artificial. Kai wakes up $180 poorer without a clear need.', isCorrect: false },
    ] },
  { id: 'u5-l2-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: '"Only X left" claims are frequently used even when inventory is not actually limited — it\'s a psychological trigger to create urgency.',
    statement: '"Only 3 left in stock!" on a website always means the item is genuinely running out.',
    isTrue: false },
  { id: 'u5-l2-e4', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'The 24-hour rule is the single most effective tactical defence against impulse spending.',
    prompt: 'The "24-hour rule" for smart spending means:',
    options: [
      { id: 'a', text: 'Only shop during business hours', isCorrect: false },
      { id: 'b', text: 'Wait 24 hours before buying any unplanned item', isCorrect: true },
      { id: 'c', text: 'Compare prices across 24 stores', isCorrect: false },
      { id: 'd', text: 'Return items within 24 hours if you regret them', isCorrect: false },
    ] },
  { id: 'u5-l2-e5', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'A decision framework for unplanned purchases reduces emotional decision-making.',
    instruction: 'Order these steps for evaluating an unplanned purchase.',
    items: [
      { id: 's1', text: 'Pause — don\'t buy immediately', rank: 1 },
      { id: 's2', text: 'Ask: do I need this, or just want it right now?', rank: 2 },
      { id: 's3', text: 'Wait 24 hours (or 48-72 for larger items)', rank: 3 },
      { id: 's4', text: 'Check if it fits your budget', rank: 4 },
      { id: 's5', text: 'If still yes after waiting — buy intentionally', rank: 5 },
    ] },
  { id: 'u5-l2-e6', kind: 'fillBlank', competencyId: 'behavior',
    rationale: 'Understanding the tactics marketers use makes you less susceptible to them.',
    template: 'Scarcity ("only 3 left") and ___ ("sale ends tonight") are marketing tactics designed to bypass your ___ decision-making.',
    blanks: ['urgency', 'rational'],
    wordBank: ['urgency', 'exclusivity', 'rational', 'emotional', 'budget', 'slow'] },
  { id: 'u5-l2-e7', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Removing purchase friction (saved cards, one-click) significantly reduces impulse spending without requiring willpower.',
    story: 'You notice you impulse-spend most on late-night online shopping. You\'ve spent $600 in the last 3 months on unplanned items. What\'s the most effective structural fix?',
    choices: [
      { id: 'a', text: 'Delete saved card details from online stores', outcome: 'Removing one-click friction dramatically reduces impulse buys. You can still buy — you just have to re-enter your card, which breaks the automatic behaviour.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Unsubscribe from all promotional emails', outcome: 'Good supplementary move — you can\'t buy what you don\'t see. But saved card details are the more powerful friction point.', isCorrect: false, score: 2 },
      { id: 'c', text: 'Rely on willpower to stop', outcome: 'Willpower is a finite resource — it depletes by evening. Structural changes beat willpower every time.', isCorrect: false, score: 0 },
    ] },
];

const u5l3: Exercise[] = [
  { id: 'u5-l3-e1', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Knowing the warning signs of scams is the primary defence — most scams succeed by creating urgency.',
    prompt: 'What are the warning signs that a deal, email, or phone call might be a scam?',
    conceptReveal: 'Red flags: (1) Unsolicited contact — you didn\'t initiate it. (2) Urgency — "act now or lose this." (3) Too good to be true — free money, prizes, inflated returns. (4) Request for unusual payment — gift cards, wire transfer, crypto. (5) Pressure to keep it secret.',
    checkpoints: ['Urgency + unsolicited contact = scam signal','Legitimate companies never demand gift card payment','If it sounds too good to be true, it is'] },
  { id: 'u5-l3-e2', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Requesting payment via gift card is one of the clearest scam signals — legitimate businesses never use this method.',
    prompt: 'A caller claims you owe taxes and demands payment via iTunes gift cards. This is:',
    options: [
      { id: 'a', text: 'A legitimate tax authority method of payment', isCorrect: false },
      { id: 'b', text: 'A scam — tax authorities never use gift cards', isCorrect: true },
      { id: 'c', text: 'Only valid if the caller has your tax ID', isCorrect: false },
      { id: 'd', text: 'Unusual but possibly real', isCorrect: false },
    ] },
  { id: 'u5-l3-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'Real companies with legitimate offers give you time. Urgency ("decide in 10 minutes") is a manufactured pressure tactic to prevent you thinking critically.',
    statement: 'If a deal is real, a company will always give you time to think before it expires.',
    isTrue: true },
  { id: 'u5-l3-e4', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Each scam type has a signature approach — recognising them by pattern builds protection.',
    instruction: 'Match each scam type to its key characteristic.',
    pairs: [
      { id: 'phish', term: 'Phishing', definition: 'Fake email or website designed to steal login credentials' },
      { id: 'pump', term: 'Pump and dump', definition: 'Coordinated inflation of an asset price before insiders sell' },
      { id: 'romance', term: 'Romance scam', definition: 'Building a fake relationship online to eventually request money' },
      { id: 'advance', term: 'Advance fee fraud', definition: 'Promising a large sum if you pay a small "fee" first' },
    ] },
  { id: 'u5-l3-e5', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Distinguishing legitimate from suspicious characteristics reduces the risk of falling for a scam.',
    instruction: 'Sort each characteristic into Legitimate or Likely Scam.',
    buckets: [{ id: 'legit', label: 'Likely Legitimate' }, { id: 'scam', label: 'Likely Scam' }],
    items: [
      { id: 'giftCard', text: 'Requests payment via gift card', bucketId: 'scam' },
      { id: 'invoice', text: 'Sends a formal invoice with business details', bucketId: 'legit' },
      { id: 'secret', text: 'Tells you to keep the offer secret', bucketId: 'scam' },
      { id: 'website', text: 'Has a verifiable website and registered address', bucketId: 'legit' },
      { id: 'urgent', text: '"You have 1 hour to claim your prize"', bucketId: 'scam' },
    ] },
  { id: 'u5-l3-e6', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'The correct action in a potential scam is always to pause, verify independently, and never pay under pressure.',
    story: 'You get an email saying your bank account has been "frozen" with a link to verify your identity. The email looks identical to your bank\'s emails. What do you do?',
    choices: [
      { id: 'a', text: 'Close the email, go to your bank\'s website directly, and log in', outcome: 'Correct. Never click links in suspicious emails. Always navigate directly to your bank\'s URL. If the account was really frozen, you\'d see it when you log in.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Click the link to fix the problem quickly', outcome: 'This is a phishing attack. Clicking the link takes you to a fake site that steals your credentials.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Reply to the email asking if it\'s legitimate', outcome: 'Replying confirms your email is active and may get you more phishing attempts. Navigate to the bank directly.', isCorrect: false, score: 0 },
    ] },
  { id: 'u5-l3-e7', kind: 'fillBlank', competencyId: 'behavior',
    rationale: 'Verifying the sender\'s domain is a basic but powerful check against phishing emails.',
    template: 'To verify an email is from your bank, check the ___ address carefully — scammers use domains like "bank-secure-login.com" instead of the real ___ domain.',
    blanks: ['sender\'s', 'bank\'s'],
    wordBank: ['sender\'s', 'recipient\'s', 'subject line\'s', 'bank\'s', 'government\'s', 'company\'s'] },
];

const u5l4: Exercise[] = [
  { id: 'u5-l4-e1', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Subscription creep is one of the most common budget problems — small charges that compound into significant annual costs.',
    prompt: 'If you checked every recurring charge leaving your account right now, how confident are you you\'d recognise all of them?',
    conceptReveal: 'Subscription creep: the gradual accumulation of recurring charges that individually feel small but collectively drain hundreds per year. Average person pays for 4–8 subscriptions; many forget 2–3. Annual cost: $800–$2,400 for the average household.',
    checkpoints: ['Most people have 2–3 forgotten subscriptions','Free trials that auto-convert are the main source of unintended subscriptions','Annual audit: cancel anything unused for 30+ days'] },
  { id: 'u5-l4-e2', kind: 'calculator', competencyId: 'behavior',
    rationale: 'Adding up small monthly charges reveals the true annual cost of the subscription stack.',
    formulaKey: 'annualCost',
    prompt: 'Calculate the annual cost of your subscriptions. Add up your monthly recurring charges.',
    targetLabel: 'Annual subscription cost',
    explanation: 'Annual cost = monthly total × 12. Most people underestimate this by 30–50% when guessing.',
    inputs: [
      { id: 'daily', label: 'Total monthly subscriptions', value: 85, min: 0, max: 500, step: 5, prefix: '$' },
      { id: 'days', label: 'Months per year', value: 12, min: 12, max: 12, step: 1 },
      { id: 'years', label: 'Years', value: 1, min: 1, max: 10, step: 1 },
    ] },
  { id: 'u5-l4-e3', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Free trials that require a card auto-convert to paid subscriptions unless explicitly cancelled — calendar reminders are the best prevention.',
    prompt: 'The best way to use a free trial without accidentally paying after it ends is:',
    options: [
      { id: 'a', text: 'Trust yourself to remember to cancel', isCorrect: false },
      { id: 'b', text: 'Set a calendar reminder for the day before the trial ends', isCorrect: true },
      { id: 'c', text: 'Use a real payment method and cancel after the first charge', isCorrect: false },
      { id: 'd', text: 'Ignore it — trials usually don\'t charge without reminders', isCorrect: false },
    ] },
  { id: 'u5-l4-e4', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'Subscription companies intentionally make cancellation multi-step and non-obvious — this is a dark pattern designed to reduce churn.',
    statement: 'If a company makes it difficult to cancel, that\'s a sign of a high-quality product.',
    isTrue: false },
  { id: 'u5-l4-e5', kind: 'fillBlank', competencyId: 'behavior',
    rationale: 'Understanding the audit process turns a vague intention into a concrete action.',
    template: 'To audit subscriptions: check your ___ for recurring charges, list them all, then cancel anything you haven\'t used in ___ days.',
    blanks: ['bank statements', '30'],
    wordBank: ['bank statements', 'email inbox', 'app store', '30', '7', '90', '14'] },
  { id: 'u5-l4-e6', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'A systematic subscription audit has a specific sequence that makes it efficient.',
    instruction: 'Order these steps for a subscription audit.',
    items: [
      { id: 's1', text: 'Pull 3 months of bank and card statements', rank: 1 },
      { id: 's2', text: 'Highlight every recurring charge', rank: 2 },
      { id: 's3', text: 'List each subscription and its monthly cost', rank: 3 },
      { id: 's4', text: 'Mark any not used in the past 30 days', rank: 4 },
      { id: 's5', text: 'Cancel marked subscriptions immediately', rank: 5 },
    ] },
  { id: 'u5-l4-e7', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Downgrading rather than cancelling is a valid middle path for services you use occasionally.',
    story: 'You find: Netflix ($18), Spotify ($11), gym ($55), meal kit ($70), cloud storage ($3), news ($12), meditation app ($10). You use Netflix and Spotify daily. Gym: twice a month. Others: rarely.',
    choices: [
      { id: 'a', text: 'Cancel gym, meal kit, news, meditation; keep Netflix, Spotify, cloud', outcome: 'Saves $147/month ($1,764/year) while keeping daily-use services. Cloud at $3 is worth keeping for the security.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Cancel everything and start fresh', outcome: 'Maximises savings but loses services you actually use. Incremental is smarter — keep what earns its keep.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Keep them all — you might use them more next month', outcome: '"Might use" cost: $179/month. Cancel now and re-subscribe if the behaviour actually changes.', isCorrect: false, score: 0 },
    ] },
];

const u5Practice: Exercise[] = [
  u5l1[1]!, // MC: blender value comparison
  u5l2[3]!, // MC: 24-hour rule
  u5l3[1]!, // MC: gift card payment = scam
  u5l4[2]!, // MC: free trial calendar reminder
];

const u5l5: Exercise[] = [
  { id: 'u5-l5-e1', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'A realistic shopping scenario with multiple decisions applies all unit concepts simultaneously.',
    panels: [
      { text: 'Morgan has $300 budgeted for new tech gear. Shopping list: a new phone case, wireless earbuds, and a surge protector.', speaker: 'Narrator' },
      { text: 'While browsing, Morgan sees a $200 "gaming chair" on flash sale — 50% off for "the next 2 hours only". Not on the list.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Morgan do about the gaming chair?',
    choices: [
      { id: 'a', text: 'Apply the 24-hour rule — don\'t buy it now', outcome: 'Correct. The 2-hour timer is an urgency tactic. If Morgan still wants it tomorrow and it fits the budget, buy it then. Spoiler: 50% sales often return.', isCorrect: true },
      { id: 'b', text: 'Buy it — 50% off is too good to pass up', outcome: 'Morgan is $200 over budget on an unplanned item. The "50% off" framing ignores whether it was needed at all.', isCorrect: false },
    ] },
  { id: 'u5-l5-e2', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Comparing unit prices reveals that the larger size is often (but not always) cheaper per unit.',
    prompt: 'Shampoo A: 500ml for $8. Shampoo B: 1,000ml for $13. Which is better value?',
    options: [
      { id: 'a', text: 'Shampoo A — lower upfront cost', isCorrect: false },
      { id: 'b', text: 'Shampoo B — $1.30/100ml vs $1.60/100ml', isCorrect: true },
      { id: 'c', text: 'They\'re the same value', isCorrect: false },
      { id: 'd', text: 'It depends on the brand', isCorrect: false },
    ] },
  { id: 'u5-l5-e3', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Separating smart-spending behaviours from poor ones reinforces the unit\'s lessons.',
    instruction: 'Sort each shopping behaviour into Smart Spending or Poor Spending.',
    buckets: [{ id: 'smart', label: 'Smart Spending' }, { id: 'poor', label: 'Poor Spending' }],
    items: [
      { id: 'compare', text: 'Compare unit prices before buying groceries', bucketId: 'smart' },
      { id: 'flash', text: 'Buy during a flash sale without checking your budget', bucketId: 'poor' },
      { id: 'wait24', text: 'Wait 24 hours on an unplanned $80 purchase', bucketId: 'smart' },
      { id: 'giftCard', text: 'Pay for a "prize" with a gift card to claim it', bucketId: 'poor' },
      { id: 'audit', text: 'Audit subscriptions every 3 months', bucketId: 'smart' },
      { id: 'saved', text: 'Use saved card details to impulse buy at 11pm', bucketId: 'poor' },
    ] },
  { id: 'u5-l5-e4', kind: 'calculator', competencyId: 'behavior',
    rationale: 'Seeing the annual cost of small daily habits converts abstract advice into concrete numbers.',
    formulaKey: 'annualCost',
    prompt: 'Calculate the annual cost of Morgan\'s daily coffee ($5) and weekly lunch out ($18).',
    targetLabel: 'Annual cost',
    explanation: 'Daily cost × 365 + weekly cost × 52. Use the calculator to model different frequencies.',
    inputs: [
      { id: 'daily', label: 'Daily spend (coffee)', value: 5, min: 0, max: 50, step: 1, prefix: '$' },
      { id: 'days', label: 'Days per year', value: 365, min: 1, max: 365, step: 1 },
      { id: 'years', label: 'Years to model', value: 1, min: 1, max: 10, step: 1 },
    ] },
  { id: 'u5-l5-e5', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Smart spending is about getting the most value per dollar — not just spending less.',
    story: 'Morgan has $80 left in the tech budget. Option A: $80 branded earbuds from the mall. Option B: Same specs, different brand, $45 online with free delivery. Option C: Wait 2 weeks — the model Morgan wanted is back in stock at $75.',
    choices: [
      { id: 'a', text: 'Buy Option B ($45) — same specs, lower price', outcome: 'Best immediate value. Saves $35. Same functionality, different brand. Check reviews first, but specs don\'t lie.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Wait for Option C (the original model at $75)', outcome: 'Valid if Morgan has strong brand preference and patience. Not wrong, but Option B is objectively better value.', isCorrect: false, score: 2 },
      { id: 'c', text: 'Buy Option A — brand reliability is worth the extra', outcome: 'Paying $35 more for brand preference with no spec difference is a want, not a value argument.', isCorrect: false, score: 1 },
    ] },
  { id: 'u5-l5-e6', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Synthesising the unit\'s concepts into actionable rules makes them portable.',
    prompt: 'Summarise the three most important rules for smart spending you\'d put on a pocket card.',
    conceptReveal: 'Three rules: (1) Compare value, not just price — calculate cost-per-use for high-frequency items. (2) Apply the 24-hour rule to all unplanned purchases over $30. (3) Audit subscriptions every 3 months — cancel anything unused for 30+ days.',
    checkpoints: ['Value = quality ÷ cost, not just the sticker price','24-hour rule eliminates ~80% of impulse regrets','Subscription audit = fastest budget win with least lifestyle impact'] },
];

// ─── Extend duoLessons with units 2–5 ────────────────────────────────────────
// (Declared here so all exercise arrays above are initialised first)

Object.assign(duoLessons, {
  'u2-l1': makeLesson('u2-l1', 'Needs vs. Wants', u2l1, 20, 'unit-budgeting-2', 'budgeting', 'Budgeting Foundations'),
  'u2-l2': makeLesson('u2-l2', 'Building a Budget', u2l2, 25, 'unit-budgeting-2', 'budgeting', 'Budgeting Foundations'),
  'u2-l3': makeLesson('u2-l3', 'The 50/30/20 Rule', u2l3, 25, 'unit-budgeting-2', 'budgeting', 'Budgeting Foundations'),
  'u2-l4': makeLesson('u2-l4', 'Tracking Your Spending', u2l4, 20, 'unit-budgeting-2', 'budgeting', 'Budgeting Foundations'),
  'u2-practice': makeLesson('u2-practice', 'Mixed Practice', u2Practice, 15, 'unit-budgeting-2', 'budgeting', 'Budgeting Foundations'),
  'u2-l5': makeLesson('u2-l5', 'Budget Boss', u2l5, 30, 'unit-budgeting-2', 'budgeting', 'Budgeting Foundations'),
  'u3-l1': makeLesson('u3-l1', 'Why Save?', u3l1, 20, 'unit-saving-3', 'saving', 'Saving & Emergency Funds'),
  'u3-l2': makeLesson('u3-l2', 'Pay Yourself First', u3l2, 25, 'unit-saving-3', 'saving', 'Saving & Emergency Funds'),
  'u3-l3': makeLesson('u3-l3', 'Emergency Funds', u3l3, 25, 'unit-saving-3', 'saving', 'Saving & Emergency Funds'),
  'u3-l4': makeLesson('u3-l4', 'Savings Goals', u3l4, 25, 'unit-saving-3', 'saving', 'Saving & Emergency Funds'),
  'u3-practice': makeLesson('u3-practice', 'Mixed Practice', u3Practice, 15, 'unit-saving-3', 'saving', 'Saving & Emergency Funds'),
  'u3-l5': makeLesson('u3-l5', 'Rainy Day', u3l5, 30, 'unit-saving-3', 'saving', 'Saving & Emergency Funds'),
  'u4-l1': makeLesson('u4-l1', 'Checking vs. Savings', u4l1, 20, 'unit-foundations-4', 'foundations', 'Banking Basics'),
  'u4-l2': makeLesson('u4-l2', 'How Interest Works', u4l2, 25, 'unit-foundations-4', 'foundations', 'Banking Basics'),
  'u4-l3': makeLesson('u4-l3', 'Fees & Overdrafts', u4l3, 20, 'unit-foundations-4', 'foundations', 'Banking Basics'),
  'u4-l4': makeLesson('u4-l4', 'Account Safety', u4l4, 25, 'unit-foundations-4', 'foundations', 'Banking Basics'),
  'u4-practice': makeLesson('u4-practice', 'Mixed Practice', u4Practice, 15, 'unit-foundations-4', 'foundations', 'Banking Basics'),
  'u4-l5': makeLesson('u4-l5', 'Open for Business', u4l5, 30, 'unit-foundations-4', 'foundations', 'Banking Basics'),
  'u5-l1': makeLesson('u5-l1', 'Value vs. Price', u5l1, 20, 'unit-foundations-5', 'foundations', 'Smart Spending'),
  'u5-l2': makeLesson('u5-l2', 'Impulse vs. Planned', u5l2, 25, 'unit-foundations-5', 'foundations', 'Smart Spending'),
  'u5-l3': makeLesson('u5-l3', 'Scams & Fraud', u5l3, 25, 'unit-foundations-5', 'foundations', 'Smart Spending'),
  'u5-l4': makeLesson('u5-l4', 'Subscription Creep', u5l4, 20, 'unit-foundations-5', 'foundations', 'Smart Spending'),
  'u5-practice': makeLesson('u5-practice', 'Mixed Practice', u5Practice, 15, 'unit-foundations-5', 'foundations', 'Smart Spending'),
  'u5-l5': makeLesson('u5-l5', 'Cart Check', u5l5, 30, 'unit-foundations-5', 'foundations', 'Smart Spending'),
});

// ─── Guidebooks — Units 2–5 ──────────────────────────────────────────────────

const unit2Guidebook: GuidebookEntry[] = [
  { id: 'g2-1', title: 'Needs vs. Wants', body: 'Needs are non-negotiable essentials: housing, food, utilities, health care, transport to work. Wants are everything above that baseline — dining out, streaming, hobbies, upgrades. When budgeting, protect needs first.' },
  { id: 'g2-2', title: 'Budget Equation', body: 'Net income − total expenses = surplus (or deficit). Budget from net (take-home) income, not gross. A surplus is savings potential; a deficit means cuts are required.' },
  { id: 'g2-3', title: '50/30/20 Rule', body: '50% of net income to needs, 30% to wants, 20% to savings and debt repayment. It\'s a starting framework — adjust to your situation. High-rent cities may need a 60/20/20 split.', formulaRef: 'budgetSurplus' },
  { id: 'g2-4', title: 'Spending Leaks', body: 'Small recurring costs that add up unnoticed. $5/day = $1,825/year. Monthly review: compare actual vs. budgeted in each category. The biggest leaks are usually dining out and forgotten subscriptions.' },
  { id: 'g2-5', title: 'Fixed vs. Variable Expenses', body: 'Fixed: same every month (rent, car payment, insurance). Variable: fluctuates (groceries, gas, dining). You can\'t easily change fixed costs; variable costs are your primary budget lever.' },
];

const unit3Guidebook: GuidebookEntry[] = [
  { id: 'g3-1', title: 'Why Save?', body: 'Saving buys security, options, and future capability. The earlier you start, the more compound growth does the heavy lifting. Waiting even 5 years to start can cost you 30–40% of your final retirement balance.' },
  { id: 'g3-2', title: 'Pay Yourself First', body: 'Transfer savings on pay day — before any discretionary spending. Automation removes the willpower requirement. Even $50/month automated beats $300 "when I get around to it."' },
  { id: 'g3-3', title: 'Emergency Fund', body: 'Keep 3–6 months of essential expenses in a liquid, separate savings account. Use only for genuine unexpected costs: job loss, medical emergencies, critical repairs. Not for deals, travel, or upgrades.', formulaRef: 'emergencyFund' },
  { id: 'g3-4', title: 'Savings Goals', body: 'Monthly amount = goal ÷ months. Give each goal a name, target, and deadline — vague goals fail. Open a separate sub-account per goal to prevent raiding one for another.', formulaRef: 'savingsGoal' },
];

const unit4Guidebook: GuidebookEntry[] = [
  { id: 'g4-1', title: 'Checking vs. Savings', body: 'Checking: daily transaction account — salary in, bills and purchases out, no interest. Savings: accumulation account — earns APY, fewer withdrawals. Use both: checking for flow, savings for building.' },
  { id: 'g4-2', title: 'APY vs. APR', body: 'APY (Annual Percentage Yield) includes compounding — use it to compare savings accounts. APR (Annual Percentage Rate) doesn\'t include compounding — used for loans. Always compare like-for-like.', formulaRef: 'compoundGrowth' },
  { id: 'g4-3', title: 'Bank Fees', body: 'Common fees: monthly maintenance (waive with direct deposit or min balance), overdraft ($25–35, avoid with low-balance alerts), out-of-network ATM ($2–5). Audit your statements quarterly.' },
  { id: 'g4-4', title: 'Account Safety', body: 'Strong unique password + 2FA on all banking apps. Monitor statements monthly — report unauthorised charges within 60 days. Never click links in banking emails; navigate directly to the bank\'s URL.' },
];

const unit5Guidebook: GuidebookEntry[] = [
  { id: 'g5-1', title: 'Value vs. Price', body: 'Value = total benefit ÷ total cost. Cost-per-use: divide price by expected uses. A $200 item used 200 times = $1/use. A $50 item used 5 times = $10/use. Always compare unit prices at the supermarket.' },
  { id: 'g5-2', title: 'Impulse Spending', body: '24-hour rule: wait before any unplanned purchase over $30. Impulse triggers: emotion, scarcity ("only 3 left"), urgency, easy checkout. Structural fix: delete saved card details; unsubscribe from marketing emails.', formulaRef: 'annualCost' },
  { id: 'g5-3', title: 'Scams & Fraud', body: 'Red flags: unsolicited contact, urgency, too-good-to-be-true offers, gift card/wire transfer payment requests, secrecy pressure. Tax authorities never use gift cards. Phishing: never click email links — navigate directly to the site.' },
  { id: 'g5-4', title: 'Subscription Creep', body: 'Average household spends $800–$2,400/year on subscriptions; 2–3 are typically forgotten. Audit every 3 months: pull statements, list all recurring charges, cancel anything unused for 30+ days.' },
];

// ─── Node layout helpers ──────────────────────────────────────────────────────

const ZIG_ZAG_POSITIONS: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center', 'center',
];

function buildUnit1(): PathUnit {
  const nodes: PathNode[] = [
    { id: 'duo-l1-node', type: 'lesson', position: ZIG_ZAG_POSITIONS[0]!, lessonId: 'duo-l1' },
    { id: 'duo-l2-node', type: 'lesson', position: ZIG_ZAG_POSITIONS[1]!, lessonId: 'duo-l2' },
    { id: 'duo-l3-node', type: 'lesson', position: ZIG_ZAG_POSITIONS[2]!, lessonId: 'duo-l3' },
    { id: 'duo-practice-1-node', type: 'practice', position: ZIG_ZAG_POSITIONS[3]!, lessonId: 'duo-practice-1' },
    { id: 'duo-chest-1', type: 'chest', position: ZIG_ZAG_POSITIONS[4]!, chestReward: { brainBucks: 50, xp: 25 } },
    { id: 'duo-l4-node', type: 'lesson', position: ZIG_ZAG_POSITIONS[5]!, lessonId: 'duo-l4' },
    { id: 'duo-l5-node', type: 'lesson', position: ZIG_ZAG_POSITIONS[6]!, lessonId: 'duo-l5' },
    { id: 'duo-trophy-1', type: 'trophy', position: ZIG_ZAG_POSITIONS[7]! },
  ];

  return {
    id: 'unit-foundations-1',
    title: 'Money Basics',
    subtitle: 'How money works, opportunity cost, budgeting fundamentals',
    color: UNIT_COLORS['foundations']!,
    icon: UNIT_ICONS['foundations']!,
    trackId: 'foundations',
    competencyIds: ['moneyMindset', 'cashFlow', 'budgetDesign', 'savingSystems'],
    nodes,
    guidebook: unit1Guidebook,
    masteryThreshold: 65,
  };
}

function buildUnit(
  id: string,
  title: string,
  subtitle: string,
  trackId: LessonDomain,
  competencyIds: import('../types/lesson').CompetencyId[],
  lessonIds: [string, string, string, string, string, string],
  guidebook: GuidebookEntry[],
): PathUnit {
  const [l1, l2, l3, practice, l4, l5] = lessonIds;
  const nodes: PathNode[] = [
    { id: `${id}-l1-node`,       type: 'lesson',   position: ZIG_ZAG_POSITIONS[0]!, lessonId: l1 },
    { id: `${id}-l2-node`,       type: 'lesson',   position: ZIG_ZAG_POSITIONS[1]!, lessonId: l2 },
    { id: `${id}-l3-node`,       type: 'lesson',   position: ZIG_ZAG_POSITIONS[2]!, lessonId: l3 },
    { id: `${id}-practice-node`, type: 'practice', position: ZIG_ZAG_POSITIONS[3]!, lessonId: practice },
    { id: `${id}-chest`,         type: 'chest',    position: ZIG_ZAG_POSITIONS[4]!, chestReward: { brainBucks: 50, xp: 25 } },
    { id: `${id}-l4-node`,       type: 'lesson',   position: ZIG_ZAG_POSITIONS[5]!, lessonId: l4 },
    { id: `${id}-l5-node`,       type: 'lesson',   position: ZIG_ZAG_POSITIONS[6]!, lessonId: l5 },
    { id: `${id}-trophy`,        type: 'trophy',   position: ZIG_ZAG_POSITIONS[7]! },
  ];
  return {
    id, title, subtitle,
    color: UNIT_COLORS[trackId] ?? '#4C9BE8',
    icon: '',
    trackId, competencyIds, nodes, guidebook, masteryThreshold: 65,
  };
}

function buildUnit2(): PathUnit {
  return buildUnit(
    'unit-budgeting-2', 'Budgeting Foundations',
    'Needs vs wants, building a budget, and tracking where your money goes.',
    'budgeting', ['budgetDesign', 'behavior', 'cashFlow'],
    ['u2-l1', 'u2-l2', 'u2-l3', 'u2-practice', 'u2-l4', 'u2-l5'],
    unit2Guidebook,
  );
}

function buildUnit3(): PathUnit {
  return buildUnit(
    'unit-saving-3', 'Saving & Emergency Funds',
    'Why and how to save — and how to build your financial safety net.',
    'saving', ['savingSystems', 'behavior', 'liquidity'],
    ['u3-l1', 'u3-l2', 'u3-l3', 'u3-practice', 'u3-l4', 'u3-l5'],
    unit3Guidebook,
  );
}

function buildUnit4(): PathUnit {
  return buildUnit(
    'unit-foundations-4', 'Banking Basics',
    'Accounts, interest, fees, and keeping your money safe.',
    'foundations', ['banking', 'liquidity', 'cashFlow'],
    ['u4-l1', 'u4-l2', 'u4-l3', 'u4-practice', 'u4-l4', 'u4-l5'],
    unit4Guidebook,
  );
}

function buildUnit5(): PathUnit {
  return buildUnit(
    'unit-foundations-5', 'Smart Spending',
    'Spend with intention, avoid impulse traps, and never get ripped off.',
    'foundations', ['behavior', 'budgetDesign'],
    ['u5-l1', 'u5-l2', 'u5-l3', 'u5-practice', 'u5-l4', 'u5-l5'],
    unit5Guidebook,
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

const PATH_UNITS: PathUnit[] = [
  buildUnit1(), buildUnit2(), buildUnit3(), buildUnit4(), buildUnit5(),
  introToInvestingUnit,
  stocksAndMarketUnit,
  fundsAndEtfsUnit,
  riskMarginShortingUnit,
  cryptoUnit,
];

const ALL_INVESTING_LESSONS: Record<string, Lesson> = {
  ...introToInvestingLessons,
  ...stocksAndMarketLessons,
  ...fundsAndEtfsLessons,
  ...riskMarginShortingLessons,
  ...cryptoUnitLessons,
};

export function getPathUnits(_profile?: OnboardingProfile): PathUnit[] {
  return PATH_UNITS;
}

export function getPathLessonById(id: string): Lesson | undefined {
  return duoLessons[id] ?? ALL_INVESTING_LESSONS[id];
}

export function computeNodeStates(
  unit: PathUnit,
  progress: LessonProgress,
): Record<string, PathNodeState> {
  const completed = new Set(progress.completedLessonIds);
  const openedChests = new Set(progress.completedChestIds ?? []);
  const result: Record<string, PathNodeState> = {};

  let prevUnlocked = true;

  for (const node of unit.nodes) {
    if (node.type === 'chest') {
      result[node.id] = openedChests.has(node.id)
        ? 'completed'
        : prevUnlocked
          ? 'available'
          : 'locked';
      // Chest doesn't gate subsequent nodes — always passes through
    } else if (node.type === 'trophy') {
      const lessonNodes = unit.nodes.filter((n) => n.type === 'lesson' || n.type === 'practice');
      const allDone = lessonNodes.every((n) => n.lessonId && completed.has(n.lessonId));
      result[node.id] = allDone ? 'available' : 'locked';
    } else if (node.lessonId) {
      const isDone = completed.has(node.lessonId);
      if (isDone) {
        result[node.id] = 'completed';
      } else if (prevUnlocked) {
        result[node.id] = 'active'; // next lesson to do
        prevUnlocked = false; // everything after is locked until this is done
      } else {
        result[node.id] = 'locked';
      }
    } else {
      result[node.id] = prevUnlocked ? 'available' : 'locked';
    }

    if (node.type !== 'chest' && node.type !== 'trophy') {
      if (!node.lessonId || completed.has(node.lessonId)) {
        // keep prevUnlocked true
      } else {
        prevUnlocked = false;
      }
    }
  }

  return result;
}

export type UnitState = 'locked' | 'available' | 'inProgress' | 'completed';

export function getUnitState(unit: PathUnit, progress: LessonProgress, allUnits?: PathUnit[]): UnitState {
  const units = allUnits ?? PATH_UNITS;
  const unitIndex = units.findIndex((u) => u.id === unit.id);

  // Units after the first are locked until the previous unit is completed
  if (unitIndex > 0) {
    const prev = units[unitIndex - 1]!;
    const prevLessonNodes = prev.nodes.filter((n) => n.type === 'lesson' || n.type === 'practice');
    const prevCompleted = new Set(progress.completedLessonIds);
    const allPrevDone = prevLessonNodes.every((n) => n.lessonId && prevCompleted.has(n.lessonId));
    if (!allPrevDone) return 'locked';
  }

  const completed = new Set(progress.completedLessonIds);
  const lessonNodes = unit.nodes.filter((n) => n.type === 'lesson' || n.type === 'practice');
  if (lessonNodes.length === 0) return 'available';

  const doneCount = lessonNodes.filter((n) => n.lessonId && completed.has(n.lessonId)).length;
  if (doneCount === 0) return 'available';
  if (doneCount === lessonNodes.length) return 'completed';
  return 'inProgress';
}

export function getNextPathLesson(progress: LessonProgress): Lesson | undefined {
  for (const unit of PATH_UNITS) {
    if (getUnitState(unit, progress) === 'locked') continue;
    const nodeStates = computeNodeStates(unit, progress);
    for (const node of unit.nodes) {
      const state = nodeStates[node.id];
      if ((state === 'active' || state === 'available') && node.lessonId) {
        return getPathLessonById(node.lessonId);
      }
    }
  }
  return undefined;
}

export function getPathProgress(progress: LessonProgress): { completed: number; total: number } {
  const completed = new Set(progress.completedLessonIds);
  let total = 0;
  let done = 0;
  for (const unit of PATH_UNITS) {
    for (const node of unit.nodes) {
      if ((node.type === 'lesson' || node.type === 'practice') && node.lessonId) {
        total++;
        if (completed.has(node.lessonId)) done++;
      }
    }
  }
  return { completed: done, total };
}

export function getUnitMasteryTier(
  unit: PathUnit,
  progress: LessonProgress,
): MasteryTier | null {
  const completed = new Set(progress.completedLessonIds);
  const lessonNodes = unit.nodes.filter((n) => n.type === 'lesson' || n.type === 'practice');
  if (lessonNodes.length === 0) return null;

  const doneCount = lessonNodes.filter((n) => n.lessonId && completed.has(n.lessonId)).length;
  const pct = doneCount / lessonNodes.length;

  if (pct >= 1) return 'gold';
  if (pct >= 0.8) return 'silver';
  if (pct >= 0.4) return 'bronze';
  return null;
}
