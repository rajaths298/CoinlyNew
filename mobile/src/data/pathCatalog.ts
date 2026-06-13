import type { OnboardingProfile } from '../types/onboarding';
import type { CompetencyId, Lesson, LessonDomain, LessonProgress } from '../types/lesson';
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
import { littleSaversLessons, littleSaversUnits } from './littleSavers';

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
    kind: 'miniStory',
    competencyId: 'moneyMindset',
    rationale: 'A named character facing a real decision activates curiosity before any concept is introduced — the learner wants to know if they would make the same choice.',
    panels: [
      { text: "Marcus just got his $2,000 tax refund. He has 48 hours to decide what to do with it." },
      { text: "Option A: A gaming setup he's been eyeing for two years — $2,000 exactly." },
      { text: "Option B: A Roth IRA contribution. His mom has been on his case about it for months." },
    ],
    choicePrompt: "Marcus picks the gaming setup. What has he actually paid?",
    choices: [
      { id: 'a', text: '$2,000 — the price tag', isCorrect: false, outcome: "That's the cash cost. But every purchase has a second price tag: what that money could have become. Marcus also paid the future value of $2,000 invested." },
      { id: 'b', text: '$2,000 now + ~$7,740 he gave up in 20 years', isCorrect: true, outcome: "Exactly. $2,000 at 7% for 20 years = $7,740. The setup cost $2,000 in cash and $5,740 in future wealth he'll never build. That second number is the opportunity cost." },
      { id: 'c', text: 'Nothing — it was his money to spend freely', isCorrect: false, outcome: "Legally, yes. Financially, every dollar has two prices: what it buys today and what it could have become. The choice is real either way." },
    ],
  },
  {
    id: 'l2-e2',
    kind: 'calculator',
    competencyId: 'moneyMindset',
    rationale: 'Using the compoundGrowth formula with a monthly contribution makes opportunity cost personally visceral — the learner sees their own habit\'s second price tag.',
    formulaKey: 'compoundGrowth',
    prompt: "Pick a monthly habit — coffee, takeout, a subscription. Enter what you spend per month. See what it becomes if invested over 10 years at 7% instead.",
    targetLabel: 'Future value if invested',
    explanation: "A $150/month habit is $1,800/year. Invested at 7% for 10 years: over $26,000. The opportunity cost of a habit isn't what you spend — it's what you give up growing. The math gets dramatic fast.",
    inputs: [
      { id: 'principal', label: 'Starting amount', value: 0, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'contribution', label: 'Monthly savings', value: 150, min: 10, max: 2000, step: 10, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 1, max: 15, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Years', value: 10, min: 5, max: 40, step: 5 },
    ],
  },
  {
    id: 'l2-e3',
    kind: 'multipleChoice',
    competencyId: 'moneyMindset',
    rationale: 'Pro-level insight: investors frame every capital decision as an opportunity cost comparison — the concept scales from personal finance to billion-dollar portfolio management.',
    prompt: "Investors use a concept called a 'hurdle rate' when evaluating an investment. What is it?",
    options: [
      { id: 'a', text: 'The minimum return an investment must beat to be worth choosing over the next-best alternative', isCorrect: true },
      { id: 'b', text: 'The highest possible return on any investment available', isCorrect: false },
      { id: 'c', text: 'The annual management fee charged by a fund', isCorrect: false },
      { id: 'd', text: 'The point at which an investment breaks even', isCorrect: false },
    ],
  },
  {
    id: 'l2-e4',
    kind: 'scenarioDecision',
    competencyId: 'moneyMindset',
    rationale: "Large, infrequent decisions carry far bigger opportunity costs than daily habits — the financed car vs. a paid-off car is one of the most impactful opportunity cost choices most people face in their 20s.",
    story: "Jordan is 28 and wants to trade up to a $38,000 car — $550/month payment for 72 months. She already owns a reliable $12,000 car, paid off. Her friend says: '$550/month won't break you.'",
    choices: [
      {
        id: 'a',
        text: 'Finance the $38K car — $550/month for 6 years',
        outcome: "Total paid with interest: ~$42,000. Opportunity cost: $550/month invested for 10 years after the loan at 7% = $95,000 she won't have at 44. The car decision is actually a retirement decision.",
        isCorrect: false,
        score: 0,
      },
      {
        id: 'b',
        text: 'Keep the $12K car and invest $550/month instead',
        outcome: "Over 10 years at 7%: $95,500. Over 30 years: $660,000. Jordan's $12K car runs fine. The upgrade costs her over half a million dollars in long-run wealth.",
        isCorrect: true,
        score: 3,
      },
      {
        id: 'c',
        text: 'Save up the full $38K before buying — no financing',
        outcome: "No interest paid — smart move over financing. But years of saving delay wealth-building while her current car runs fine. Keeping the old car is still the strongest financial choice.",
        isCorrect: false,
        score: 2,
      },
    ],
  },
  {
    id: 'l2-e5',
    kind: 'trueFalse',
    competencyId: 'moneyMindset',
    rationale: "The 'latte factor' debate is a proxy for a real insight: it's the large, infrequent decisions — housing, cars, student loans, investing delays — that create the biggest lifetime opportunity costs, not daily spending habits.",
    statement: "The biggest opportunity costs in most people's lives come from daily habits like coffee — not from major decisions like car purchases or housing.",
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
    kind: 'miniStory',
    competencyId: 'budgetDesign',
    rationale: 'A real paycheck with a named character makes budgeting immediately concrete — the learner is debugging someone else\'s money before they have to face their own.',
    panels: [
      { text: "Jordan earns $65,000/year — about $4,200 take-home each month. She pays her bills on time. No major vices." },
      { text: "On the 28th, she checks her bank account. Balance: $47." },
      { text: "She's been here before. Every single month." },
    ],
    choicePrompt: "Before seeing the data: what is the most likely reason Jordan runs out of money every month?",
    choices: [
      { id: 'a', text: 'Dining out and food delivery', isCorrect: false, outcome: "Dining is $340/month — real money, but not the biggest surprise. The real culprit is more invisible." },
      { id: 'b', text: 'A cluster of forgotten subscriptions quietly billing every month', isCorrect: true, outcome: "Jordan has 11 active subscriptions totaling $137/month. She regularly uses 4. The other 7 have been billing her for 8–24 months. That's $1,644/year on things she forgot she owned — and that's before the untracked cash and app purchases." },
      { id: 'c', text: 'Overspending on rent', isCorrect: false, outcome: "Rent is $1,200 — reasonable for her income. The leak is smaller, more distributed, and invisible: subscriptions, impulse app purchases, and small cash spending with no category." },
    ],
  },
  {
    id: 'l4-e2',
    kind: 'calculator',
    competencyId: 'budgetDesign',
    rationale: 'Computing Jordan\'s actual surplus with real numbers reveals the gap between her theoretical 20% savings target and her $0 reality — making the budget math tangible.',
    formulaKey: 'budgetSurplus',
    prompt: "Jordan's month: $4,200 take-home. Fixed costs $2,040 (rent $1,200, car $300, insurance $140, phone $100, credit minimums $300). Variable costs $1,540 (groceries $320, dining $340, subscriptions $137, shopping $450, entertainment $200, misc $93). What's her monthly surplus?",
    targetLabel: 'Monthly surplus',
    explanation: "Surplus = $4,200 − $2,040 − $1,540 = $620. But she has $47 at month end. Where did $573 go? Impulse buys, cash withdrawals, and app store charges that don't show up in named categories. The budget has leaks she can't see — which is exactly why she needs one.",
    inputs: [
      { id: 'income', label: 'Take-home pay', value: 4200, min: 1000, max: 15000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Fixed costs', value: 2040, min: 0, max: 12000, step: 100, prefix: '$' },
      { id: 'variable', label: 'Variable costs', value: 1540, min: 0, max: 10000, step: 100, prefix: '$' },
    ],
  },
  {
    id: 'l4-e3',
    kind: 'categorize',
    competencyId: 'budgetDesign',
    rationale: "People systematically mislabel 'wants' as 'needs.' Forcing honest categorization on tricky line items builds the habit that makes the 50/30/20 rule actually work.",
    instruction: "Sort Jordan's expenses: Need (50% bucket) or Want (30% bucket).",
    buckets: [{ id: 'need', label: 'Need (50%)' }, { id: 'want', label: 'Want (30%)' }],
    items: [
      { id: 'rent', text: 'Rent $1,200', bucketId: 'need' },
      { id: 'netflix', text: 'Netflix + Spotify + Hulu $45', bucketId: 'want' },
      { id: 'gym', text: 'Gym membership $45 (she goes 3×/week)', bucketId: 'want' },
      { id: 'groceries', text: 'Groceries $320', bucketId: 'need' },
      { id: 'doordash', text: 'DoorDash delivery $200', bucketId: 'want' },
      { id: 'phone', text: 'Phone plan $100', bucketId: 'need' },
    ],
  },
  {
    id: 'l4-e4',
    kind: 'scenarioDecision',
    competencyId: 'budgetDesign',
    rationale: "Pay-yourself-first is the highest-leverage single change in personal budgeting — it removes willpower from the equation entirely by making savings happen before spending is possible.",
    story: "Jordan wants to save $840/month — 20% of her take-home. She's tried tracking spending and transferring 'whatever is left.' Three months in a row: $0 saved. Her bank offers an auto-savings transfer on payday. What system is most likely to work?",
    choices: [
      {
        id: 'a',
        text: 'Track every purchase daily and transfer the leftover at month end',
        outcome: "This is what Jordan already tried. It fails because spending expands to fill available money. 'Whatever is left' trends toward zero every single month.",
        isCorrect: false,
        score: 0,
      },
      {
        id: 'b',
        text: "Auto-transfer $840 to savings the day she gets paid — before touching anything",
        outcome: "Pay yourself first. The money moves before she sees it, so she adjusts her spending to $3,360 instead of $4,200. This one system change is worth more than any budgeting app, spreadsheet, or tracking habit.",
        isCorrect: true,
        score: 3,
      },
      {
        id: 'c',
        text: 'Cut all spending to zero for one month to build the savings habit',
        outcome: "Willpower sprints don't build lasting systems — they create rebound overspending the next month. Systems beat willpower every time.",
        isCorrect: false,
        score: 1,
      },
    ],
  },
  {
    id: 'l4-e5',
    kind: 'multipleChoice',
    competencyId: 'budgetDesign',
    rationale: "Zero-based budgeting's power comes from treating savings as the first 'expense' — not the residual. This is the key mindset shift from 'save what's left' to 'spend what's left.'",
    prompt: "In a zero-based budget, how is savings treated?",
    options: [
      { id: 'a', text: "As an expense category that gets assigned money first — before spending categories", isCorrect: true },
      { id: 'b', text: 'As whatever is left over after all other categories are filled', isCorrect: false },
      { id: 'c', text: 'As a separate account that does not count toward the budget', isCorrect: false },
      { id: 'd', text: 'Only as relevant if you have more than $5,000/month income', isCorrect: false },
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
    learningObjectives: [`Understand and apply: ${title}.`],
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
  'duo-l2': {
    ...makeDuoLesson('duo-l2', 'Opportunity Cost', lesson2Exercises, 30),
    winStatement: 'You can now name the invisible second price tag on any purchase — and that skill is worth more than any budgeting app.',
    lessonTeaser: 'You price every decision. Next: Build the system that handles 80% of those decisions automatically — your personal budget.',
  },
  'duo-l3': makeDuoLesson('duo-l3', 'Income vs. Expenses', lesson3Exercises, 20),
  'duo-practice-1': makeDuoLesson('duo-practice-1', 'Mixed Practice', practiceExercises, 15),
  'duo-l4': {
    ...makeDuoLesson('duo-l4', 'Budgeting Basics', lesson4Exercises, 30),
    winStatement: 'You can now build a first-draft budget from any paycheck in 10 minutes — and find the money you didn\'t know you were losing.',
    lessonTeaser: 'You have a map. Next: Why budgets fail by week 2 — and the emergency fund that makes the whole system survive real life.',
  },
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
    title: 'Opportunity Cost Decision Card',
    body: "Every purchase has TWO price tags: (1) what it costs today, and (2) what that money could have become. $2,000 spent = $7,740 not earned in 20 years at 7%.\n\nThe 3-question framework before any major purchase:\n① What would this money become in 10 years if invested instead?\n② Is this the best possible use of this money right now?\n③ If I delay 6 months, would I still want this?\n\nPro rule: the biggest opportunity costs come from large, infrequent decisions (cars, housing, investing delays) — not daily habits.",
    formulaRef: 'compoundGrowth',
  },
  {
    id: 'g3',
    title: 'Gross vs. Net Income',
    body: "Gross income is what you earn before deductions. Net income (take-home pay) is what you actually have to budget with. Always build your budget from net income.",
  },
  {
    id: 'g4',
    title: '50/30/20 Budget Cheat Sheet',
    body: "Needs ≤ 50%: rent, utilities, basic groceries, insurance, minimum debt payments.\nWants ≤ 30%: dining, streaming, gym, shopping, entertainment.\nSavings/debt ≥ 20%: emergency fund first → high-interest debt → investing.\n\nWatch-outs: Cable, Netflix, gym, and dining are WANTS not needs. People routinely mislabel wants — which eats the savings slice.\n\nThe single most powerful move: auto-transfer your 20% savings on the day you get paid, before you see the money. Spending adjusts to $3,360 instead of $4,200. Systems beat willpower.\n\nWhy 20% matters: $840/month at 7% for 30 years = $1,020,000.",
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
  competencyIds: CompetencyId[] = ['moneyMindset'],
  learningObjectives: string[] = [],
): Lesson {
  return {
    id, title, domain, level: 'beginner', unitId, unitTitle,
    courseTrackId: domain, moduleId: `${domain}-${domain}`,
    durationMinutes: Math.max(3, Math.round(exercises.length * 1.2)),
    xp, prerequisites: [], difficulty: 1,
    learningObjectives: learningObjectives.length ? learningObjectives : [`Understand and apply: ${title}.`],
    competencyIds, competencyTags: [domain],
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

// ─── Unit 6 — Entrepreneurship Lab ───────────────────────────────────────────

const u6l1: Exercise[] = [
  { id: 'u6-l1-e1', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'Strong businesses start with a painful customer problem, not a founder preference.',
    prompt: 'Think of a business idea. What customer pain would make someone pay for it this week?',
    conceptReveal: 'A business is a repeatable way to solve a painful problem for a reachable customer at a price that leaves profit. The best early signal is not compliments; it is specific demand, payment, deposits, referrals, or repeated use.',
    checkpoints: ['Customer pain beats founder excitement','Payment is stronger evidence than praise','A narrow first customer is easier to reach than everyone'] },
  { id: 'u6-l1-e2', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'A specific buyer, problem, and urgent trigger makes a business idea testable.',
    prompt: 'Which business idea is easiest to test?',
    options: [
      { id: 'a', text: 'An app that helps everyone be better at life', isCorrect: false },
      { id: 'b', text: 'Weekend meal prep for nurses working 12-hour shifts', isCorrect: true },
      { id: 'c', text: 'A social network with positive vibes', isCorrect: false },
      { id: 'd', text: 'A premium brand for modern people', isCorrect: false },
    ] },
  { id: 'u6-l1-e3', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Founder-friendly signals often feel good but do not predict revenue. Customer commitment signals are harder to fake.',
    instruction: 'Sort each signal into Strong Demand or Weak Signal.',
    buckets: [{ id: 'strong', label: 'Strong Demand' }, { id: 'weak', label: 'Weak Signal' }],
    items: [
      { id: 'deposit', text: '10 people place a refundable deposit', bucketId: 'strong' },
      { id: 'likes', text: '200 likes on a launch post', bucketId: 'weak' },
      { id: 'repeat', text: 'Three customers reorder next week', bucketId: 'strong' },
      { id: 'nice', text: 'Friends say "cool idea"', bucketId: 'weak' },
      { id: 'intro', text: 'A buyer introduces you to their manager', bucketId: 'strong' },
      { id: 'survey', text: 'Anonymous survey says people might buy', bucketId: 'weak' },
    ] },
  { id: 'u6-l1-e4', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'The best first test reduces uncertainty around willingness to pay.',
    story: 'Avery wants to sell $29 study templates to college students. They have one weekend to test demand before building a full template library.',
    choices: [
      { id: 'a', text: 'Build 40 templates first so the product feels complete', outcome: 'That creates inventory before demand is proven. A weekend test should answer whether anyone pays.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Create one sample template and ask students to pre-order the full pack', outcome: 'Correct. A sample plus pre-order tests the pain, price, and customer channel before heavy production.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Ask friends which colors the template brand should use', outcome: 'Brand polish can wait. The risky assumption is willingness to pay.', isCorrect: false, score: 1 },
    ] },
  { id: 'u6-l1-e5', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Customer discovery has a useful sequence: define the segment, interview about behavior, test payment, then build.',
    instruction: 'Order the first validation steps for a new business idea.',
    items: [
      { id: 's1', text: 'Name the narrow first customer', rank: 1 },
      { id: 's2', text: 'Ask about their current workaround and cost of the problem', rank: 2 },
      { id: 's3', text: 'Offer a small paid test or pre-order', rank: 3 },
      { id: 's4', text: 'Deliver manually to learn what matters', rank: 4 },
      { id: 's5', text: 'Automate only after repeat demand appears', rank: 5 },
    ] },
  { id: 'u6-l1-e6', kind: 'fillBlank', competencyId: 'businessFinance',
    rationale: 'The customer-problem-price frame turns a vague idea into a testable business hypothesis.',
    template: 'A testable business idea names a specific ___, a painful ___, and a price that leaves ___.',
    blanks: ['customer', 'problem', 'profit'],
    wordBank: ['customer', 'logo', 'problem', 'trend', 'profit', 'followers'] },
];

const u6l2: Exercise[] = [
  { id: 'u6-l2-e1', kind: 'miniStory', competencyId: 'businessFinance',
    rationale: 'Unit economics become tangible when applied to one order before scaling.',
    panels: [
      { text: 'Mia sells custom lunch boxes for $18. Ingredients cost $7, packaging costs $1, delivery averages $3, and payment fees are $1 per order.', speaker: 'Narrator' },
      { text: 'She sold 100 orders last month and posted "$1,800 revenue!" online. Her friend asks: "How much did you actually keep before fixed costs and tax?"', speaker: 'Narrator' },
    ],
    choicePrompt: 'What is the right way to judge the business?',
    choices: [
      { id: 'a', text: 'Revenue is the score. $1,800 means the business is working.', outcome: 'Revenue alone hides the cost structure. If each order keeps only $6 before fixed costs and tax, growth can still be fragile.', isCorrect: false },
      { id: 'b', text: 'Calculate contribution profit per order before celebrating scale.', outcome: 'Correct. Price minus variable costs shows whether each sale helps cover fixed costs and profit.', isCorrect: true },
    ] },
  { id: 'u6-l2-e2', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Business model terms are the foundation for reading any company or startup.',
    instruction: 'Match each business term to its meaning.',
    pairs: [
      { id: 'revenue', term: 'Revenue', definition: 'Money collected from sales before subtracting costs' },
      { id: 'variable', term: 'Variable cost', definition: 'Cost that rises with each order sold' },
      { id: 'fixed', term: 'Fixed cost', definition: 'Cost owed even if you sell nothing' },
      { id: 'margin', term: 'Profit margin', definition: 'Percent of revenue left after costs' },
    ] },
  { id: 'u6-l2-e3', kind: 'calculator', competencyId: 'businessFinance',
    rationale: 'Profit margin reveals whether revenue is actually creating room to survive, reinvest, and pay tax.',
    formulaKey: 'profitMargin',
    prompt: 'Mia sells $1,800/month. Food, packaging, delivery, and fees cost $1,200. She reserves $180 for tax. Estimate her profit margin.',
    targetLabel: 'Profit margin',
    explanation: 'Profit margin = (revenue - costs - tax reserve) / revenue. Revenue is vanity if costs consume it.',
    inputs: [
      { id: 'revenue', label: 'Monthly revenue', value: 1800, min: 100, max: 10000, step: 100, prefix: '$' },
      { id: 'costs', label: 'Monthly costs', value: 1200, min: 0, max: 9000, step: 100, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 180, min: 0, max: 3000, step: 20, prefix: '$' },
    ] },
  { id: 'u6-l2-e4', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'A business with negative contribution margin loses more money as it grows.',
    prompt: 'If each unit sells for $20 but variable costs are $23, what happens when you sell more units?',
    options: [
      { id: 'a', text: 'You make it up with volume', isCorrect: false },
      { id: 'b', text: 'Losses grow unless price rises or costs fall', isCorrect: true },
      { id: 'c', text: 'Fixed costs disappear', isCorrect: false },
      { id: 'd', text: 'Revenue automatically turns into profit later', isCorrect: false },
    ] },
  { id: 'u6-l2-e5', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Separating fixed and variable costs helps founders know which costs scale with demand.',
    instruction: 'Sort each business cost.',
    buckets: [{ id: 'fixed', label: 'Fixed Cost' }, { id: 'variable', label: 'Variable Cost' }],
    items: [
      { id: 'rent', text: 'Monthly kitchen rental', bucketId: 'fixed' },
      { id: 'ingredients', text: 'Ingredients per lunch box', bucketId: 'variable' },
      { id: 'software', text: 'Booking software subscription', bucketId: 'fixed' },
      { id: 'shipping', text: 'Packaging and delivery per order', bucketId: 'variable' },
      { id: 'insurance', text: 'Monthly liability insurance', bucketId: 'fixed' },
      { id: 'fees', text: 'Payment processing fee per sale', bucketId: 'variable' },
    ] },
];

const u6l3: Exercise[] = [
  { id: 'u6-l3-e1', kind: 'miniStory', competencyId: 'businessFinance',
    rationale: 'A freelancer case study makes the gap between gross revenue and actual take-home visceral — the learner sees the exact same math mistake they might be making.',
    panels: [
      { text: "Alex charges $75/hour for graphic design. She works 35 billable hours a week — that's $136,500/year in gross revenue." },
      { text: "She has a nice studio, a new laptop, and name-brand clients. By all appearances, she's thriving." },
      { text: "Tax season. Her accountant reveals her actual take-home after taxes and all costs: $38,000." },
    ],
    choicePrompt: "Alex grossed $136K and kept $38K. Her real effective hourly rate is:",
    choices: [
      { id: 'a', text: '$75/hour — what she charges clients', isCorrect: false, outcome: "That's her billing rate, not her take-home rate. Revenue is not income." },
      { id: 'b', text: 'About $21/hour after real costs', isCorrect: true, outcome: "Correct. $38K / ~1,820 work hours = $21/hr. Her $75 bill rate hid: self-employment taxes (15.3%), income taxes (~22%), software $200/month, hardware depreciation, studio rent, health insurance, and 15–20 unbillable admin hours per week." },
      { id: 'c', text: '$50/hour — she must have undercharged some clients', isCorrect: false, outcome: "Her billing rate isn't the problem. The cost stack ate her margin. Even at $75, she never calculated what she'd actually keep — and it's a very different number." },
    ] },
  { id: 'u6-l3-e2', kind: 'calculator', competencyId: 'businessFinance',
    rationale: 'Running the full cost stack — revenue, variable costs, and tax reserve — reveals the real margin before setting a price, not after the bank account runs dry.',
    formulaKey: 'profitMargin',
    prompt: "Sam's candle business: sells each candle for $24. Variable costs: materials $6, packaging $2, marketplace fees $2 = $10. Monthly fixed costs: $60. She sells 30 candles/month ($720 revenue). Tax reserve: $72. What is her profit margin?",
    targetLabel: 'Profit margin',
    explanation: "Margin = ($720 revenue − $300 variable costs − $60 fixed costs − $72 tax reserve) / $720 = 40%. That's $288/month — before paying herself for ~15 hours of labor. Her real margin depends on how she values her time.",
    inputs: [
      { id: 'revenue', label: 'Monthly revenue', value: 720, min: 100, max: 20000, step: 100, prefix: '$' },
      { id: 'costs', label: 'Variable + fixed costs', value: 360, min: 0, max: 15000, step: 50, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 72, min: 0, max: 3000, step: 10, prefix: '$' },
    ] },
  { id: 'u6-l3-e3', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Value-based pricing is the most powerful and least used tool for small business owners — forcing a comparison between cost-plus and value-capture makes the concept concrete.',
    story: "A consultant charges $100/hour for HR strategy. It takes 10 hours to redesign a client's hiring process. One month later, the client avoids a bad hire that would have cost $35,000 in wasted salary and rehiring fees. How should the consultant price this engagement?",
    choices: [
      { id: 'a', text: '$1,000 — 10 hours × $100', outcome: "Cost-based pricing. She captured 3% of the value she created. Charging for time ignores the outcome she delivered — and trains clients to see her as an hourly worker, not a strategic partner.", isCorrect: false, score: 1 },
      { id: 'b', text: '$5,000–$8,000 based on a fraction of the value delivered', outcome: "Value-based pricing. She prevented $35,000 in costs — charging 15–23% of that value is standard consulting practice. Clients who see the ROI clearly become long-term clients.", isCorrect: true, score: 3 },
      { id: 'c', text: '$15,000 — nearly half the savings she created', outcome: "Possible with a strong track record and trust. Most new client relationships need proof first. Start at 20% value capture, show the ROI, and raise rates from there.", isCorrect: false, score: 2 },
    ] },
  { id: 'u6-l3-e4', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'A disciplined pricing workflow prevents random guessing and anchors every price in both economics and customer value — in that specific order.',
    instruction: 'Order the five-step pricing workflow for any new product or service.',
    items: [
      { id: 's1', text: 'Calculate your full cost floor: variable costs + fixed-cost contribution + tax reserve', rank: 1 },
      { id: 's2', text: 'Research what customers currently pay for alternatives and substitutes', rank: 2 },
      { id: 's3', text: 'Estimate the tangible value your product delivers to the customer', rank: 3 },
      { id: 's4', text: 'Set a price above your floor, within market range, capturing a fair share of value created', rank: 4 },
      { id: 's5', text: 'Test with real customers, track conversion rate and actual margin, and adjust', rank: 5 },
    ] },
  { id: 'u6-l3-e5', kind: 'trueFalse', competencyId: 'businessFinance',
    rationale: 'Discounting trains customers to wait for sales, signals low confidence in your value, and permanently compresses margin — the fastest path to a race to the bottom.',
    statement: 'Offering discounts is always a smart way to increase sales volume and overall profit.',
    isTrue: false },
];

const u6Practice: Exercise[] = [
  u6l1[1]!,
  u6l2[3]!,
  u6l3[4]!,
  u6l2[4]!,
];

const u6l4: Exercise[] = [
  { id: 'u6-l4-e1', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'An MVP is a learning tool that tests the riskiest assumption with the least work.',
    prompt: 'What is the smallest version of a business that could prove customers want it?',
    conceptReveal: 'An MVP is not a low-quality product. It is the smallest credible test of the riskiest assumption. For a service, that may be a manual concierge version. For a product, it may be a pre-order page, prototype, or one paid pilot.',
    checkpoints: ['MVP means minimum learning loop, not minimum quality','Manual delivery is fine before automation','The riskiest assumption decides the test'] },
  { id: 'u6-l4-e2', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Different MVP formats fit different types of business risk.',
    instruction: 'Match the MVP type to the best use case.',
    pairs: [
      { id: 'concierge', term: 'Concierge MVP', definition: 'Manually deliver the service before building software' },
      { id: 'preorder', term: 'Pre-order', definition: 'Test willingness to pay before producing inventory' },
      { id: 'prototype', term: 'Prototype', definition: 'Show how the product works before manufacturing at scale' },
      { id: 'pilot', term: 'Paid pilot', definition: 'Small paid test with one real customer or team' },
    ] },
  { id: 'u6-l4-e3', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'The best validation test directly targets the highest uncertainty.',
    story: 'Noor wants to build software that helps local gyms rebook members who miss classes. The riskiest assumption is whether gym owners will pay for rebooking help.',
    choices: [
      { id: 'a', text: 'Spend 3 months building the app', outcome: 'Too much build time before proving payment. The risk is demand, not code.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Offer to manually text missed-class members for 2 gyms for $100/month', outcome: 'Correct. This tests the buyer, value, workflow, and price before software.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Ask gym members whether they like motivational texts', outcome: 'Members are users, but gym owners are the buyers. Test the buyer first.', isCorrect: false, score: 1 },
    ] },
  { id: 'u6-l4-e4', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'A validation loop turns feedback into repeated learning instead of random opinions.',
    instruction: 'Order the build-measure-learn loop.',
    items: [
      { id: 's1', text: 'Write the riskiest assumption', rank: 1 },
      { id: 's2', text: 'Design the smallest paid test', rank: 2 },
      { id: 's3', text: 'Run it with real target customers', rank: 3 },
      { id: 's4', text: 'Measure behavior: payment, retention, referrals, usage', rank: 4 },
      { id: 's5', text: 'Decide whether to double down, adjust, or stop', rank: 5 },
    ] },
  { id: 'u6-l4-e5', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'Retention is a stronger signal than first-time curiosity because it shows ongoing value.',
    prompt: 'Which signal best proves an MVP is solving a real problem?',
    options: [
      { id: 'a', text: 'A customer pays again without a discount', isCorrect: true },
      { id: 'b', text: 'A launch video gets many views', isCorrect: false },
      { id: 'c', text: 'The logo looks professional', isCorrect: false },
      { id: 'd', text: 'People vote for it in a poll', isCorrect: false },
    ] },
];

const u6l5: Exercise[] = [
  { id: 'u6-l5-e1', kind: 'miniStory', competencyId: 'businessFinance',
    rationale: 'Cash runway is a survival metric for businesses with uneven revenue.',
    panels: [
      { text: 'Jay starts a mobile car-detailing side business with $1,200 saved. Monthly fixed costs are $260 for insurance, booking software, and storage. Supplies average $18 per job.', speaker: 'Narrator' },
      { text: 'Jay can do 20 jobs per month at $75 each, but bookings are not guaranteed. One slow month could wipe out the cash buffer.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Jay track every week?',
    choices: [
      { id: 'a', text: 'Revenue, variable cost per job, fixed costs, cash balance, and booked jobs', outcome: 'Correct. These numbers reveal margin and runway before the bank account gets scary.', isCorrect: true },
      { id: 'b', text: 'Follower count and how many people like the car photos', outcome: 'Marketing attention matters only if it turns into profitable bookings and cash.', isCorrect: false },
    ] },
  { id: 'u6-l5-e2', kind: 'calculator', competencyId: 'businessFinance',
    rationale: 'A simple monthly surplus calculation shows whether a small business is funding itself.',
    formulaKey: 'budgetSurplus',
    prompt: 'Jay books 20 jobs at $75 each. Fixed costs are $260. Variable costs are $18 per job, or $360 total. Calculate the monthly business surplus.',
    targetLabel: 'Monthly surplus',
    explanation: 'Business surplus = revenue - fixed costs - variable costs. Surplus funds owner pay, tax, replacement equipment, and runway.',
    inputs: [
      { id: 'income', label: 'Monthly revenue', value: 1500, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Fixed costs', value: 260, min: 0, max: 5000, step: 20, prefix: '$' },
      { id: 'variable', label: 'Variable costs', value: 360, min: 0, max: 7000, step: 20, prefix: '$' },
    ] },
  { id: 'u6-l5-e3', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Reinvesting before cash reserves are stable increases business fragility.',
    story: 'Jay has one strong month and ends with $900 surplus. A $900 premium pressure washer could speed up jobs, but the business has only one month of expenses saved.',
    choices: [
      { id: 'a', text: 'Buy the washer immediately because it improves efficiency', outcome: 'Efficiency matters, but spending the entire surplus leaves no buffer for a slow month or repair.', isCorrect: false, score: 1 },
      { id: 'b', text: 'Reserve tax and build a 2-3 month business buffer before upgrading', outcome: 'Correct. Runway protects the business. Upgrade after survival is funded.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Take the whole surplus as owner pay', outcome: 'Owner pay is important, but skipping tax, equipment replacement, and runway creates future stress.', isCorrect: false, score: 0 },
    ] },
  { id: 'u6-l5-e4', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Separating operating uses of cash prevents founders from confusing revenue with available personal money.',
    instruction: 'Sort each cash use.',
    buckets: [{ id: 'protect', label: 'Protect The Business' }, { id: 'optional', label: 'Optional Growth' }],
    items: [
      { id: 'tax', text: 'Reserve money for taxes', bucketId: 'protect' },
      { id: 'buffer', text: 'Build 2-3 months of operating runway', bucketId: 'protect' },
      { id: 'ads', text: 'Test a new ad campaign', bucketId: 'optional' },
      { id: 'upgrade', text: 'Buy faster equipment', bucketId: 'optional' },
      { id: 'insurance', text: 'Pay required insurance', bucketId: 'protect' },
      { id: 'merch', text: 'Order branded shirts before repeat demand', bucketId: 'optional' },
    ] },
  { id: 'u6-l5-e5', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'The capstone turns entrepreneurship concepts into a practical founder scorecard.',
    prompt: 'What four numbers would you put on a weekly founder dashboard?',
    conceptReveal: 'Use a small scorecard: (1) booked revenue, (2) gross margin or contribution profit, (3) cash balance/runway, and (4) repeat customers or retention. These show demand, economics, survival, and product quality.',
    checkpoints: ['Revenue shows demand','Margin shows whether sales help','Runway shows survival time','Retention shows whether customers value the offer'] },
];

// ─── Unit 7 — Startup Growth & Finance ───────────────────────────────────────

const u7l1: Exercise[] = [
  { id: 'u7-l1-e1', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'A founder needs to understand the funnel from attention to repeat purchase, not only total followers or visitors.',
    prompt: 'If 1,000 people see your offer but only 10 buy, where would you look first?',
    conceptReveal: 'A sales funnel has stages: attention, interest, offer, purchase, repeat. The weak stage determines growth. More traffic does not fix a confusing offer, weak trust, or poor follow-up.',
    checkpoints: ['Track conversion at each stage','Fix the bottleneck before buying more traffic','Repeat purchase is often cheaper than new acquisition'] },
  { id: 'u7-l1-e2', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Funnel vocabulary helps founders diagnose growth problems precisely.',
    instruction: 'Match each growth term to its meaning.',
    pairs: [
      { id: 'lead', term: 'Lead', definition: 'A potential customer who has shown interest' },
      { id: 'conversion', term: 'Conversion rate', definition: 'Percent of people who take the desired action' },
      { id: 'retention', term: 'Retention', definition: 'Customers continuing to buy or use over time' },
      { id: 'referral', term: 'Referral', definition: 'A customer bringing in another customer' },
    ] },
  { id: 'u7-l1-e3', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'A low checkout conversion after high product-page interest usually points to trust, price, friction, or shipping concerns.',
    prompt: 'Your product page gets 500 visits and 120 add-to-carts, but only 8 purchases. What is the most likely bottleneck?',
    options: [
      { id: 'a', text: 'Not enough people know the product exists', isCorrect: false },
      { id: 'b', text: 'Checkout friction, trust, shipping, or price objection', isCorrect: true },
      { id: 'c', text: 'The logo is the wrong color', isCorrect: false },
      { id: 'd', text: 'You should launch five more products immediately', isCorrect: false },
    ] },
  { id: 'u7-l1-e4', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Optimizing growth requires measuring the funnel in order.',
    instruction: 'Order these funnel diagnostics.',
    items: [
      { id: 's1', text: 'Count how many target customers see the offer', rank: 1 },
      { id: 's2', text: 'Measure how many click, ask, or add to cart', rank: 2 },
      { id: 's3', text: 'Measure how many pay', rank: 3 },
      { id: 's4', text: 'Measure how many return or refer', rank: 4 },
      { id: 's5', text: 'Improve the weakest stage first', rank: 5 },
    ] },
  { id: 'u7-l1-e5', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Choosing the highest-leverage funnel fix is more efficient than spreading effort everywhere.',
    story: 'A creator sells a $49 budgeting template. Their ads get cheap clicks, the product page gets long reads, but buyers abandon at checkout after seeing a $12 processing and setup fee.',
    choices: [
      { id: 'a', text: 'Buy more ads because clicks are cheap', outcome: 'More traffic sends more people into the same checkout problem. Fix the bottleneck first.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Fold the fee into the price or explain it before checkout', outcome: 'Correct. Surprise fees break trust late in the funnel. Make total cost clear earlier.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Redesign the template colors', outcome: 'The page already creates interest. The drop happens at price transparency and trust.', isCorrect: false, score: 1 },
    ] },
];

const u7l2: Exercise[] = [
  { id: 'u7-l2-e1', kind: 'recallPrompt', competencyId: 'financialAnalysis',
    rationale: 'CAC and LTV prevent founders from mistaking expensive growth for healthy growth.',
    prompt: 'When is paying for ads actually profitable?',
    conceptReveal: 'Paid growth works when customer lifetime value is meaningfully higher than customer acquisition cost. If you pay $40 to acquire a customer who contributes $20 of profit, growth destroys cash.',
    checkpoints: ['CAC = cost to acquire one customer','LTV = profit a customer contributes over time','Payback period matters because cash can run out before profit arrives'] },
  { id: 'u7-l2-e2', kind: 'fillBlank', competencyId: 'financialAnalysis',
    rationale: 'The key relationship is LTV exceeding CAC by enough to cover risk and delay.',
    template: 'Paid growth is healthy when customer ___ value is higher than customer ___ cost.',
    blanks: ['lifetime', 'acquisition'],
    wordBank: ['lifetime', 'daily', 'acquisition', 'inventory', 'viral', 'fixed'] },
  { id: 'u7-l2-e3', kind: 'multipleChoice', competencyId: 'financialAnalysis',
    rationale: 'The profitable campaign has the strongest contribution profit after ad cost, not the cheapest clicks.',
    prompt: 'Which campaign is healthiest?',
    options: [
      { id: 'a', text: '$5 CAC, $4 gross profit per customer', isCorrect: false },
      { id: 'b', text: '$30 CAC, $95 gross profit per customer', isCorrect: true },
      { id: 'c', text: '$2 CAC, $0 repeat purchases and $1 profit', isCorrect: false },
      { id: 'd', text: '$70 CAC, $70 gross profit per customer', isCorrect: false },
    ] },
  { id: 'u7-l2-e4', kind: 'categorize', competencyId: 'financialAnalysis',
    rationale: 'Distinguishing healthy and unhealthy acquisition prevents cash-burning growth.',
    instruction: 'Sort each growth signal.',
    buckets: [{ id: 'healthy', label: 'Healthy Growth' }, { id: 'danger', label: 'Cash Burn Risk' }],
    items: [
      { id: 'repeat', text: 'Customers reorder within 30 days', bucketId: 'healthy' },
      { id: 'badCac', text: 'CAC is higher than gross profit', bucketId: 'danger' },
      { id: 'referrals', text: '30% of new customers come from referrals', bucketId: 'healthy' },
      { id: 'longPayback', text: 'Ads pay back after 18 months but runway is 4 months', bucketId: 'danger' },
      { id: 'lowRefund', text: 'Refunds stay under 3%', bucketId: 'healthy' },
      { id: 'discountOnly', text: 'Buyers only purchase with 60% discounts', bucketId: 'danger' },
    ] },
  { id: 'u7-l2-e5', kind: 'scenarioDecision', competencyId: 'financialAnalysis',
    rationale: 'Cash payback period is as important as eventual profitability.',
    story: 'A subscription app pays $48 to acquire a customer. The customer contributes $8/month after app store fees and support. Average retention is 5 months.',
    choices: [
      { id: 'a', text: 'Scale ads because subscriptions are recurring', outcome: 'Average gross contribution is only $40. Paying $48 loses $8 before overhead.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Improve retention or reduce CAC before scaling ads', outcome: 'Correct. Either longer retention or lower CAC must improve the unit economics.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Ignore CAC because app users can refer friends later', outcome: 'Referrals help only when measured. Do not count unproven upside as current economics.', isCorrect: false, score: 1 },
    ] },
];

const u7l3: Exercise[] = [
  { id: 'u7-l3-e1', kind: 'miniStory', competencyId: 'cashFlow',
    rationale: 'A visceral payroll-crisis scenario makes the profit-vs-cash distinction impossible to forget.',
    panels: [
      { text: "Carlos just closed his biggest contract ever — $50,000 for a commercial renovation job." },
      { text: "His crew expects to be paid $8,000 on Friday. Standard payday." },
      { text: "He opens his business bank account. Balance: $200." },
    ],
    choicePrompt: "Carlos just landed $50K. Why is there only $200 in his account?",
    choices: [
      { id: 'a', text: 'He must have overspent somewhere', isCorrect: false, outcome: "He's been busy on the job site, not spending. The issue is timing, not overspending." },
      { id: 'b', text: "His $50K contract pays net-60 — the cash hasn't arrived yet", isCorrect: true, outcome: "Exactly. Profit is earned when the job is done. Cash arrives when the client pays. Those two dates are rarely the same." },
      { id: 'c', text: 'He invoiced the wrong amount', isCorrect: false, outcome: "The invoice is fine. The problem is a 60-day payment term on a job with immediate costs." },
    ] },
  { id: 'u7-l3-e2', kind: 'calculator', competencyId: 'cashFlow',
    rationale: 'A monthly operating surplus check shows whether cash is increasing or decreasing before owner draws.',
    formulaKey: 'budgetSurplus',
    prompt: 'A pop-up shop collects $8,000 this month. Rent, staff, software, and insurance are $3,200. Inventory and card fees are $2,900. Calculate monthly operating surplus.',
    targetLabel: 'Operating surplus',
    explanation: 'Operating surplus = collected revenue - fixed costs - variable costs. Positive cash still needs tax reserve and inventory replenishment.',
    inputs: [
      { id: 'income', label: 'Cash collected', value: 8000, min: 0, max: 50000, step: 500, prefix: '$' },
      { id: 'fixed', label: 'Fixed costs', value: 3200, min: 0, max: 25000, step: 100, prefix: '$' },
      { id: 'variable', label: 'Inventory + fees', value: 2900, min: 0, max: 30000, step: 100, prefix: '$' },
    ] },
  { id: 'u7-l3-e3', kind: 'trueFalse', competencyId: 'cashFlow',
    rationale: 'Cash conversion delays can make fast growth dangerous if every new sale requires upfront spend.',
    statement: 'If a business is profitable per sale, faster growth can never create a cash problem.',
    isTrue: false },
  { id: 'u7-l3-e4', kind: 'tapToOrder', competencyId: 'cashFlow',
    rationale: 'A cash-flow review follows a predictable sequence from money in to required reserves.',
    instruction: 'Order a founder cash-flow review.',
    items: [
      { id: 's1', text: 'Start with current cash balance', rank: 1 },
      { id: 's2', text: 'Add expected cash collections', rank: 2 },
      { id: 's3', text: 'Subtract payroll, rent, suppliers, debt, and taxes due', rank: 3 },
      { id: 's4', text: 'Identify the lowest cash week', rank: 4 },
      { id: 's5', text: 'Delay optional spend if runway gets thin', rank: 5 },
    ] },
  { id: 'u7-l3-e5', kind: 'scenarioDecision', competencyId: 'cashFlow',
    rationale: 'Managing payment terms is often more valuable than chasing vanity revenue.',
    story: 'A design studio lands a $12,000 project. The client wants to pay all of it 60 days after delivery. The studio must pay contractors $5,000 during the project.',
    choices: [
      { id: 'a', text: 'Accept because $12,000 revenue is great', outcome: 'Revenue is attractive, but the studio may front contractor costs for months.', isCorrect: false, score: 1 },
      { id: 'b', text: 'Ask for 40% upfront and milestone payments', outcome: 'Correct. Deposits and milestones align cash inflow with cash outflow.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Pay contractors after the client pays', outcome: 'That shifts risk unfairly and can damage supplier trust. Fix terms with the client.', isCorrect: false, score: 0 },
    ] },
];

const u7Practice: Exercise[] = [
  u7l1[2]!,
  u7l2[2]!,
  u7l3[2]!,
  u7l3[4]!,
];

const u7l4: Exercise[] = [
  { id: 'u7-l4-e1', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'Funding choices change control, risk, repayment pressure, and upside.',
    prompt: 'What tradeoffs do founders make when choosing between bootstrapping, debt, and investors?',
    conceptReveal: 'Bootstrapping preserves control but can limit speed. Debt preserves ownership but requires repayment. Equity funding brings cash and partners but sells ownership. The right choice depends on margin, risk, growth speed, and cash predictability.',
    checkpoints: ['Equity is expensive if the business becomes valuable','Debt is dangerous without predictable cash flow','Bootstrapping forces discipline but may slow growth'] },
  { id: 'u7-l4-e2', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Each funding source has a typical use case.',
    instruction: 'Sort the funding choice.',
    buckets: [{ id: 'bootstrap', label: 'Bootstrap' }, { id: 'debt', label: 'Debt' }, { id: 'equity', label: 'Equity' }],
    items: [
      { id: 'service', text: 'Profitable service business with low startup cost', bucketId: 'bootstrap' },
      { id: 'equipment', text: 'Predictable cash flow and a machine that pays for itself', bucketId: 'debt' },
      { id: 'venture', text: 'Winner-take-most software market needing fast scale', bucketId: 'equity' },
      { id: 'inventoryLoan', text: 'Short-term inventory purchase with confirmed orders', bucketId: 'debt' },
      { id: 'sideHustle', text: 'Weekend business funded from savings and early customers', bucketId: 'bootstrap' },
      { id: 'networkEffects', text: 'Marketplace needing both sides built quickly', bucketId: 'equity' },
    ] },
  { id: 'u7-l4-e3', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'Equity dilution trades ownership for cash and support.',
    prompt: 'If you sell 20% of your company to investors, what did you give up?',
    options: [
      { id: 'a', text: 'Only current profits, not future upside', isCorrect: false },
      { id: 'b', text: 'A share of ownership, control, and future upside', isCorrect: true },
      { id: 'c', text: 'Nothing if the investor is friendly', isCorrect: false },
      { id: 'd', text: 'Only voting rights, never economics', isCorrect: false },
    ] },
  { id: 'u7-l4-e4', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Debt should match predictable repayment capacity, not optimism.',
    story: 'A bakery can buy a $10,000 oven that increases production and has signed wholesale orders worth $2,500/month gross profit. Loan payment would be $430/month.',
    choices: [
      { id: 'a', text: 'Debt may make sense because signed orders cover the payment many times over', outcome: 'Correct. Predictable incremental cash flow can support equipment debt.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Never use debt for a business under any circumstances', outcome: 'Debt is risky, but matched to predictable cash flow it can be rational.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Sell 50% of the bakery for the oven money', outcome: 'Giving up half the upside for a financeable oven is likely too expensive.', isCorrect: false, score: 0 },
    ] },
  { id: 'u7-l4-e5', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Funding evaluation should start with need and repayment/return math before pitch materials.',
    instruction: 'Order funding decision steps.',
    items: [
      { id: 's1', text: 'Define exactly what the money buys', rank: 1 },
      { id: 's2', text: 'Estimate the cash or growth it creates', rank: 2 },
      { id: 's3', text: 'Compare bootstrapping, debt, and equity costs', rank: 3 },
      { id: 's4', text: 'Stress-test downside and repayment/control risk', rank: 4 },
      { id: 's5', text: 'Choose the least expensive capital that fits the risk', rank: 5 },
    ] },
];

const u7l5: Exercise[] = [
  { id: 'u7-l5-e1', kind: 'miniStory', competencyId: 'financialAnalysis',
    rationale: 'A capstone case forces the learner to integrate funnel, unit economics, cash flow, and funding decisions.',
    panels: [
      { text: 'Lena runs a study snack subscription for students. 400 people visit the page each week, 80 start checkout, and 18 subscribe at $19/month.', speaker: 'Narrator' },
      { text: 'Boxes cost $9 to assemble and deliver. Ads cost $220/week. Customers stay for about 4 months. Lena wants to double ad spend next week.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Lena examine before doubling ads?',
    choices: [
      { id: 'a', text: 'CAC, gross profit per subscriber, retention, and checkout drop-off', outcome: 'Correct. She needs to know whether ads create profitable subscribers and where the funnel leaks.', isCorrect: true },
      { id: 'b', text: 'Only page visits, because traffic is the top of the funnel', outcome: 'Traffic is only useful if it converts into profitable, retained customers.', isCorrect: false },
    ] },
  { id: 'u7-l5-e2', kind: 'calculator', competencyId: 'financialAnalysis',
    rationale: 'Profit margin after weekly ad spend shows whether growth is paying for itself.',
    formulaKey: 'profitMargin',
    prompt: 'Lena sells 72 subscriptions in a month at $19. Box and delivery costs are $648. Ads are $880. Estimate first-month margin before overhead.',
    targetLabel: 'First-month margin',
    explanation: 'Margin = (revenue - costs - tax reserve) / revenue. Use ad cost as part of costs for this growth test.',
    inputs: [
      { id: 'revenue', label: 'Subscription revenue', value: 1368, min: 0, max: 20000, step: 50, prefix: '$' },
      { id: 'costs', label: 'Boxes + ads', value: 1528, min: 0, max: 20000, step: 50, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 0, min: 0, max: 5000, step: 25, prefix: '$' },
    ] },
  { id: 'u7-l5-e3', kind: 'scenarioDecision', competencyId: 'financialAnalysis',
    rationale: 'A negative first-month margin can still work only if retention and cash runway support the payback period.',
    story: 'Lena loses money in month one because ads are expensive, but customers usually stay 4 months and contribute $10/month after box costs.',
    choices: [
      { id: 'a', text: 'Scale ads only if 4-month LTV reliably beats CAC and cash can cover payback delay', outcome: 'Correct. Growth can be rational if payback is real and runway can survive the delay.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Scale ads immediately because revenue is growing', outcome: 'Revenue growth with delayed payback can drain cash fast.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Stop all ads forever because month one is negative', outcome: 'Too extreme. The right answer is to verify retention and payback before scaling.', isCorrect: false, score: 1 },
    ] },
  { id: 'u7-l5-e4', kind: 'tapToOrder', competencyId: 'financialAnalysis',
    rationale: 'A founder dashboard should move from demand to economics to survival.',
    instruction: 'Order Lena\'s weekly growth dashboard.',
    items: [
      { id: 's1', text: 'Visitors, checkout starts, and purchases', rank: 1 },
      { id: 's2', text: 'CAC by channel', rank: 2 },
      { id: 's3', text: 'Gross profit per subscriber', rank: 3 },
      { id: 's4', text: 'Retention and refund rate', rank: 4 },
      { id: 's5', text: 'Cash runway and ad payback period', rank: 5 },
    ] },
  { id: 'u7-l5-e5', kind: 'recallPrompt', competencyId: 'financialAnalysis',
    rationale: 'The capstone should leave the learner with a portable decision framework.',
    prompt: 'What is the rule before scaling any business?',
    conceptReveal: 'Scale only after the loop works: the right customers see the offer, enough of them buy, each customer is profitable over a realistic payback period, cash runway survives the delay, and the product is good enough to retain or refer.',
    checkpoints: ['Funnel works','Unit economics work','Cash timing works','Retention proves value'] },
];

// ─── Unit 8 - Credit & Debt Strategy ──────────────────────────────────────────

const u8l1: Exercise[] = [
  { id: 'u8-l1-e1', kind: 'recallPrompt', competencyId: 'creditScore',
    rationale: 'Credit is a reputation system for borrowing behavior, not free money.',
    prompt: 'What do lenders want to know before letting someone borrow money?',
    conceptReveal: 'Lenders look for evidence that you repay on time, use credit responsibly, keep accounts stable, and do not take on more debt than you can handle.',
    checkpoints: ['Payment history matters most','Credit use should stay controlled','New debt applications can signal risk'] },
  { id: 'u8-l1-e2', kind: 'matchPairs', competencyId: 'creditScore',
    rationale: 'Knowing credit report terms helps learners read their own reports accurately.',
    instruction: 'Match each credit term.',
    pairs: [
      { id: 'report', term: 'Credit report', definition: 'A record of credit accounts, balances, payments, and inquiries' },
      { id: 'score', term: 'Credit score', definition: 'A numerical summary of credit risk' },
      { id: 'inquiry', term: 'Hard inquiry', definition: 'A lender check that can briefly affect a score' },
      { id: 'delinquent', term: 'Delinquent', definition: 'A payment that is late enough to be reported' },
    ] },
  { id: 'u8-l1-e3', kind: 'multipleChoice', competencyId: 'creditScore',
    rationale: 'Payment history is typically the largest score factor.',
    prompt: 'Which habit is most important for building credit?',
    options: [
      { id: 'a', text: 'Pay every bill on time', isCorrect: true },
      { id: 'b', text: 'Open a new card every month', isCorrect: false },
      { id: 'c', text: 'Carry a balance to prove you use credit', isCorrect: false },
      { id: 'd', text: 'Ignore small bills because only loans count', isCorrect: false },
    ] },
];

const u8l2: Exercise[] = [
  { id: 'u8-l2-e1', kind: 'calculator', competencyId: 'creditScore',
    rationale: 'Utilization is a major controllable credit-score lever.',
    formulaKey: 'utilization',
    prompt: 'Your statement balance is $750 and your card limit is $2,500. Calculate utilization.',
    targetLabel: 'Credit utilization',
    explanation: 'Utilization = statement balance / credit limit. Lower reported utilization usually gives more score flexibility.',
    inputs: [
      { id: 'balance', label: 'Statement balance', value: 750, min: 0, max: 10000, step: 50, prefix: '$' },
      { id: 'limit', label: 'Credit limit', value: 2500, min: 100, max: 30000, step: 100, prefix: '$' },
    ] },
  { id: 'u8-l2-e2', kind: 'categorize', competencyId: 'creditScore',
    rationale: 'Some actions help credit health while others create avoidable score pressure.',
    instruction: 'Sort each action.',
    buckets: [{ id: 'helps', label: 'Helps Credit' }, { id: 'hurts', label: 'Hurts Credit' }],
    items: [
      { id: 'autopay', text: 'Set autopay for at least the minimum', bucketId: 'helps' },
      { id: 'max', text: 'Use 95% of your limit every month', bucketId: 'hurts' },
      { id: 'review', text: 'Review your credit report for errors', bucketId: 'helps' },
      { id: 'late', text: 'Pay 45 days late', bucketId: 'hurts' },
      { id: 'old', text: 'Keep an old no-fee account open', bucketId: 'helps' },
      { id: 'apps', text: 'Apply for five cards in one week', bucketId: 'hurts' },
    ] },
  { id: 'u8-l2-e3', kind: 'scenarioDecision', competencyId: 'creditScore',
    rationale: 'Paying before the statement closes can reduce reported utilization.',
    story: 'Nia has a $1,000 credit limit and spent $650 this month. She has the cash to pay it off. Her statement closes tomorrow.',
    choices: [
      { id: 'a', text: 'Pay most of it before the statement closes', outcome: 'Correct. This can reduce the balance reported to the bureaus.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Wait three months to show she can carry debt', outcome: 'Carrying debt creates interest cost and does not prove responsibility.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Open two new cards immediately', outcome: 'That can add inquiries and does not fix the current utilization issue.', isCorrect: false, score: 1 },
    ] },
];

const u8l3: Exercise[] = [
  { id: 'u8-l3-e1', kind: 'miniStory', competencyId: 'debtMath',
    rationale: 'A car-dealer hook reveals the hidden cost of financing before any formula is introduced.',
    panels: [
      { text: "You walk into a car dealership. You've found the one — $25,000." },
      { text: "'Only $399 a month for 72 months!' the salesperson says with a smile." },
      { text: "Sounds reasonable. You pull out your phone to do the math." },
    ],
    choicePrompt: "How much are you actually paying for this $25,000 car?",
    choices: [
      { id: 'a', text: '$25,000 — the sticker price', isCorrect: false, outcome: "That's what you'd pay in cash. Financing adds interest on top of the purchase price." },
      { id: 'b', text: '$28,728 ($399 × 72 months)', isCorrect: true, outcome: "Correct. $399 × 72 = $28,728. You paid $3,728 extra just for the privilege of borrowing. That extra cost is interest." },
      { id: 'c', text: 'Somewhere between $25K and $27K', isCorrect: false, outcome: "Not quite. Multiply the monthly payment by the number of months to find the true total: $399 × 72 = $28,728." },
    ] },
  { id: 'u8-l3-e2', kind: 'calculator', competencyId: 'debtMath',
    rationale: 'Calculating monthly payment from APR and term makes the APR formula concrete.',
    formulaKey: 'loanPayment',
    prompt: "You're financing $20,000 at 7% APR for 60 months. What's the monthly payment?",
    targetLabel: 'Monthly payment',
    explanation: 'At 7% APR over 60 months, the monthly payment is about $396. Adjust the APR slider to see how a higher rate immediately raises your payment.',
    inputs: [
      { id: 'principal', label: 'Loan amount', value: 20000, min: 1000, max: 50000, step: 1000, prefix: '$' },
      { id: 'rate', label: 'APR', value: 7, min: 1, max: 30, step: 1, suffix: '%' },
      { id: 'months', label: 'Months', value: 60, min: 12, max: 84, step: 12 },
    ] },
  { id: 'u8-l3-e3', kind: 'calculator', competencyId: 'debtMath',
    rationale: 'Seeing total interest paid as a dollar amount is more motivating than knowing APR as a percentage.',
    formulaKey: 'loanTotalCost',
    prompt: 'Using that $396 monthly payment: how much total interest do you pay over the full 60 months?',
    targetLabel: 'Total interest paid',
    explanation: 'Total interest = (monthly payment × months) − original loan. On a $20K/7%/60-month loan you pay about $3,760 in interest. Every point of APR you cut is real money back in your pocket.',
    inputs: [
      { id: 'monthlyPayment', label: 'Monthly payment', value: 396, min: 100, max: 2000, step: 1, prefix: '$' },
      { id: 'months', label: 'Months', value: 60, min: 12, max: 84, step: 12 },
      { id: 'principal', label: 'Original loan', value: 20000, min: 1000, max: 50000, step: 1000, prefix: '$' },
    ] },
  { id: 'u8-l3-e4', kind: 'trueFalse', competencyId: 'debtMath',
    rationale: 'Lower monthly payments can mask a much higher total cost due to a longer term or higher APR.',
    statement: 'A lower monthly payment always means a cheaper loan.',
    isTrue: false },
  { id: 'u8-l3-e5', kind: 'scenarioDecision', competencyId: 'debtMath',
    rationale: 'Comparing three real-style loan offers forces learners to use total cost, not monthly payment, as the decision criterion.',
    story: "You need $10,000. Three lenders make offers: A) 6% APR, 36 months — $304/mo, $10,953 total. B) 12% APR, 60 months — $222/mo, $13,347 total. C) 0% APR, 12 months — $833/mo, $10,000 total.",
    choices: [
      { id: 'c', text: 'Option C: 0% APR, 12 months', outcome: 'Best deal — zero interest means you pay exactly what you borrowed. Only works if the $833/month fits your budget.', isCorrect: true, score: 3 },
      { id: 'a', text: 'Option A: 6% APR, 36 months', outcome: 'Good choice — affordable payment and only $953 in interest. If Option C is too tight, this is a solid alternative.', isCorrect: false, score: 2 },
      { id: 'b', text: 'Option B: 12% APR, 60 months', outcome: 'The low payment is tempting, but you pay $3,347 in interest — more than three times Option A. That low payment is expensive over time.', isCorrect: false, score: 0 },
    ] },
];

const u8Practice: Exercise[] = [u8l1[2]!, u8l2[0]!, u8l3[1]!, u8l2[2]!];

const u8l4: Exercise[] = [
  { id: 'u8-l4-e1', kind: 'tapToOrder', competencyId: 'debtMath',
    rationale: 'A debt-payoff plan follows a clear sequence.',
    instruction: 'Order a debt payoff setup.',
    items: [
      { id: 's1', text: 'List balances, APRs, minimums, and due dates', rank: 1 },
      { id: 's2', text: 'Set autopay for every minimum', rank: 2 },
      { id: 's3', text: 'Choose avalanche or snowball payoff strategy', rank: 3 },
      { id: 's4', text: 'Send extra money to one target debt', rank: 4 },
      { id: 's5', text: 'Roll freed-up payments into the next debt', rank: 5 },
    ] },
  { id: 'u8-l4-e2', kind: 'scenarioDecision', competencyId: 'debtMath',
    rationale: 'Debt avalanche minimizes interest by targeting the highest APR first.',
    story: 'Marco has three debts: $500 at 29% APR, $2,200 at 18% APR, and $4,000 at 7% APR. He has $150 extra this month.',
    choices: [
      { id: 'a', text: 'Put extra money toward the 29% APR debt', outcome: 'Correct. The highest APR is the most expensive debt.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Split the extra evenly across all debts', outcome: 'This feels balanced but saves less interest than targeting the highest APR.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Skip minimums to pay the 7% loan faster', outcome: 'Skipping minimums creates fees, credit damage, and more problems.', isCorrect: false, score: 0 },
    ] },
  { id: 'u8-l4-e3', kind: 'categorize', competencyId: 'debtMath',
    rationale: 'Not all debt has the same risk profile.',
    instruction: 'Sort each debt.',
    buckets: [{ id: 'urgent', label: 'High Priority' }, { id: 'managed', label: 'Manage Carefully' }],
    items: [
      { id: 'payday', text: 'Payday loan at 300% APR', bucketId: 'urgent' },
      { id: 'card', text: 'Credit card at 24% APR', bucketId: 'urgent' },
      { id: 'student', text: 'Student loan at 5% APR', bucketId: 'managed' },
      { id: 'auto', text: 'Auto loan with affordable payment', bucketId: 'managed' },
      { id: 'bnpl', text: 'Missed buy-now-pay-later payment with fees', bucketId: 'urgent' },
    ] },
];

const u8l5: Exercise[] = [
  { id: 'u8-l5-e1', kind: 'miniStory', competencyId: 'creditScore',
    rationale: 'A credit capstone integrates utilization, payment history, and debt payoff choices.',
    panels: [
      { text: 'Jules wants to rent an apartment in six months. Their credit card limit is $2,000, current balance is $1,200, and one old medical bill is in collections.', speaker: 'Narrator' },
      { text: 'They can put $400/month toward credit repair and debt payoff.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Jules do first?',
    choices: [
      { id: 'a', text: 'Verify the collection, negotiate if valid, and lower utilization', outcome: 'Correct. Fix possible report damage and reduce reported card balances before applications.', isCorrect: true },
      { id: 'b', text: 'Open three new cards to increase available credit', outcome: 'New inquiries and accounts can add risk right before an apartment application.', isCorrect: false },
    ] },
  { id: 'u8-l5-e2', kind: 'calculator', competencyId: 'creditScore',
    rationale: 'Utilization change shows how debt payoff can affect credit readiness.',
    formulaKey: 'utilization',
    prompt: 'Model Jules paying the balance from $1,200 down to $600 on a $2,000 limit.',
    targetLabel: 'New utilization',
    explanation: 'Lower utilization does not guarantee approval, but it improves the credit picture.',
    inputs: [
      { id: 'balance', label: 'Statement balance', value: 600, min: 0, max: 2000, step: 50, prefix: '$' },
      { id: 'limit', label: 'Credit limit', value: 2000, min: 100, max: 10000, step: 100, prefix: '$' },
    ] },
  { id: 'u8-l5-e3', kind: 'recallPrompt', competencyId: 'creditScore',
    rationale: 'The capstone should leave learners with a durable credit operating system.',
    prompt: 'What three rules would you follow before applying for a loan or apartment?',
    conceptReveal: 'Pay on time, lower reported utilization, and review your reports for errors or collections before applying. Do not make a cluster of new applications right before a major credit check.',
    checkpoints: ['On-time payments','Low utilization','Clean report review'] },
];

// ─── Unit 9 - Taxes & Paychecks ──────────────────────────────────────────────

const u9l1: Exercise[] = [
  { id: 'u9-l1-e1', kind: 'recallPrompt', competencyId: 'taxPlanning',
    rationale: 'Paycheck literacy starts with knowing gross pay, deductions, taxes, and net pay.',
    prompt: 'Why is your paycheck smaller than your salary or hourly gross pay?',
    conceptReveal: 'Gross pay is before deductions. Net pay is what reaches your bank after taxes, insurance, retirement contributions, and other payroll deductions.',
    checkpoints: ['Gross pay is not spendable pay','Taxes are withheld before net pay','Benefits can reduce take-home pay but add value'] },
  { id: 'u9-l1-e2', kind: 'fillBlank', competencyId: 'taxPlanning',
    rationale: 'Gross-to-net math is the foundation of budgeting from real take-home pay.',
    template: 'Net pay = gross pay minus taxes and other ___.',
    blanks: ['deductions'],
    wordBank: ['deductions', 'bonuses', 'subscriptions', 'refunds'] },
  { id: 'u9-l1-e3', kind: 'multipleChoice', competencyId: 'taxPlanning',
    rationale: 'A refund is the return of over-withheld money, not free money.',
    prompt: 'A large tax refund usually means:',
    options: [
      { id: 'a', text: 'You may have withheld more than needed during the year', isCorrect: true },
      { id: 'b', text: 'The government gave you free money', isCorrect: false },
      { id: 'c', text: 'Your budget should ignore taxes', isCorrect: false },
      { id: 'd', text: 'You never need to file again', isCorrect: false },
    ] },
];

const u9l2: Exercise[] = [
  { id: 'u9-l2-e1', kind: 'calculator', competencyId: 'taxPlanning',
    rationale: 'Withholding per check multiplied by checks per year estimates annual withholding.',
    formulaKey: 'taxWithholding',
    prompt: 'Your paycheck withholds $210 for federal tax every two weeks. Estimate annual withholding before credits.',
    targetLabel: 'Annual withholding',
    explanation: 'Annual withholding = withholding per check x checks per year - credits.',
    inputs: [
      { id: 'perCheck', label: 'Tax per check', value: 210, min: 0, max: 1200, step: 10, prefix: '$' },
      { id: 'checks', label: 'Checks per year', value: 26, min: 12, max: 52, step: 1 },
      { id: 'credits', label: 'Credits', value: 0, min: 0, max: 5000, step: 100, prefix: '$' },
    ] },
  { id: 'u9-l2-e2', kind: 'scenarioDecision', competencyId: 'taxPlanning',
    rationale: 'Life changes often require withholding updates.',
    story: 'Taylor started a second job and now has two employers withholding taxes. They want to avoid a surprise bill.',
    choices: [
      { id: 'a', text: 'Review withholding and update payroll forms if needed', outcome: 'Correct. Multiple jobs can under-withhold if forms are not coordinated.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Assume payroll always gets it perfect', outcome: 'Payroll follows the forms you submit; it does not know every household detail automatically.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Wait until filing season to think about taxes', outcome: 'Waiting can turn a preventable adjustment into a cash surprise.', isCorrect: false, score: 1 },
    ] },
  { id: 'u9-l2-e3', kind: 'trueFalse', competencyId: 'taxPlanning',
    rationale: 'Withholding is a prepayment toward tax, not a final calculation.',
    statement: 'Withholding is an estimate during the year; filing reconciles the actual tax.',
    isTrue: true },
];

const u9l3: Exercise[] = [
  { id: 'u9-l3-e1', kind: 'matchPairs', competencyId: 'taxPlanning',
    rationale: 'Deductions and credits reduce taxes differently.',
    instruction: 'Match each tax term.',
    pairs: [
      { id: 'deduction', term: 'Deduction', definition: 'Reduces taxable income' },
      { id: 'credit', term: 'Credit', definition: 'Reduces tax owed directly' },
      { id: 'standard', term: 'Standard deduction', definition: 'A default deduction amount if you do not itemize' },
      { id: 'refund', term: 'Refund', definition: 'Money returned when payments exceed tax owed' },
    ] },
  { id: 'u9-l3-e2', kind: 'categorize', competencyId: 'taxPlanning',
    rationale: 'Basic sorting helps learners understand what affects taxable income versus taxes owed.',
    instruction: 'Sort each item.',
    buckets: [{ id: 'deduction', label: 'Deduction' }, { id: 'credit', label: 'Credit' }],
    items: [
      { id: 'standardDed', text: 'Standard deduction', bucketId: 'deduction' },
      { id: 'studentCredit', text: 'Education tax credit', bucketId: 'credit' },
      { id: 'retirement', text: 'Traditional retirement contribution', bucketId: 'deduction' },
      { id: 'childCredit', text: 'Child tax credit', bucketId: 'credit' },
    ] },
  { id: 'u9-l3-e3', kind: 'multipleChoice', competencyId: 'taxPlanning',
    rationale: 'A tax credit is usually more powerful dollar-for-dollar than a deduction.',
    prompt: 'All else equal, which reduces tax owed dollar-for-dollar?',
    options: [
      { id: 'a', text: 'Tax credit', isCorrect: true },
      { id: 'b', text: 'Tax deduction', isCorrect: false },
      { id: 'c', text: 'Gross income', isCorrect: false },
      { id: 'd', text: 'Bank balance', isCorrect: false },
    ] },
];

const u9Practice: Exercise[] = [u9l1[2]!, u9l2[0]!, u9l3[0]!, u9l2[2]!];

const u9l4: Exercise[] = [
  { id: 'u9-l4-e1', kind: 'scenarioDecision', competencyId: 'taxPlanning',
    rationale: 'Gig workers often need to reserve tax because no employer is withholding for them.',
    story: 'Riley earns $900 this month from freelance design. No taxes were withheld. What should Riley do before spending it?',
    choices: [
      { id: 'a', text: 'Set aside a tax reserve and track expenses', outcome: 'Correct. Self-employment income needs tax planning and records.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Spend it all because clients already paid', outcome: 'Client payment is not after-tax income.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore expenses because only income matters', outcome: 'Business expenses can affect taxable profit and should be tracked.', isCorrect: false, score: 1 },
    ] },
  { id: 'u9-l4-e2', kind: 'calculator', competencyId: 'taxPlanning',
    rationale: 'A simple reserve calculation helps freelancers avoid tax shocks.',
    formulaKey: 'budgetSurplus',
    prompt: 'Riley earns $900, has $120 in software and supplies, and reserves $195 for tax. Calculate cash left before personal spending.',
    targetLabel: 'Cash after reserve',
    explanation: 'Cash after reserve = income - expenses - tax reserve.',
    inputs: [
      { id: 'income', label: 'Freelance income', value: 900, min: 0, max: 10000, step: 50, prefix: '$' },
      { id: 'fixed', label: 'Expenses', value: 120, min: 0, max: 5000, step: 20, prefix: '$' },
      { id: 'variable', label: 'Tax reserve', value: 195, min: 0, max: 5000, step: 20, prefix: '$' },
    ] },
  { id: 'u9-l4-e3', kind: 'tapToOrder', competencyId: 'taxPlanning',
    rationale: 'A gig tax workflow creates repeatable behavior.',
    instruction: 'Order a freelancer tax workflow.',
    items: [
      { id: 's1', text: 'Track every client payment', rank: 1 },
      { id: 's2', text: 'Track business expenses with receipts', rank: 2 },
      { id: 's3', text: 'Move a tax reserve to a separate account', rank: 3 },
      { id: 's4', text: 'Review quarterly estimate needs', rank: 4 },
      { id: 's5', text: 'File with clean records', rank: 5 },
    ] },
];

const u9l5: Exercise[] = [
  { id: 'u9-l5-e1', kind: 'miniStory', competencyId: 'taxPlanning',
    rationale: 'A filing-season story reinforces documents, timing, and cash planning.',
    panels: [
      { text: 'Ari has two W-2 jobs, one freelance client, student loan interest, and a small brokerage account.', speaker: 'Narrator' },
      { text: 'Tax season starts and Ari wants to file quickly without missing documents.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Ari gather first?',
    choices: [
      { id: 'a', text: 'W-2s, 1099s, interest forms, expense records, and prior-year return', outcome: 'Correct. Complete documents reduce filing errors and missed items.', isCorrect: true },
      { id: 'b', text: 'Only the biggest W-2', outcome: 'Missing income forms can create notices and amended returns.', isCorrect: false },
    ] },
  { id: 'u9-l5-e2', kind: 'tapToOrder', competencyId: 'taxPlanning',
    rationale: 'Filing has a practical sequence.',
    instruction: 'Order tax filing prep.',
    items: [
      { id: 's1', text: 'Collect income forms', rank: 1 },
      { id: 's2', text: 'Collect deduction and credit records', rank: 2 },
      { id: 's3', text: 'Compare withholding and estimated payments to tax owed', rank: 3 },
      { id: 's4', text: 'File or extend by the deadline', rank: 4 },
      { id: 's5', text: 'Adjust withholding or reserves for next year', rank: 5 },
    ] },
  { id: 'u9-l5-e3', kind: 'recallPrompt', competencyId: 'taxPlanning',
    rationale: 'A tax capstone should create a yearly operating system.',
    prompt: 'What tax habits would make next April less stressful?',
    conceptReveal: 'Budget from net pay, keep forms and receipts organized, reserve tax for untaxed income, review withholding after job or life changes, and use filing season to improve next year.',
    checkpoints: ['Organize records','Reserve for untaxed income','Adjust withholding after changes'] },
];

// ─── Unit 10 - Career & Income Growth ────────────────────────────────────────

const u10l1: Exercise[] = [
  { id: 'u10-l1-e1', kind: 'recallPrompt', competencyId: 'incomeGrowth',
    rationale: 'Human capital is one of the largest financial assets for young learners.',
    prompt: 'What makes someone more valuable in the job market over time?',
    conceptReveal: 'Human capital is your ability to earn through skills, proof, relationships, judgment, and reliability. Income grows when your value to employers or customers becomes clearer and scarcer.',
    checkpoints: ['Skills create value','Proof makes value believable','Relationships create opportunity flow'] },
  { id: 'u10-l1-e2', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Career assets include more than credentials.',
    instruction: 'Sort each item.',
    buckets: [{ id: 'asset', label: 'Career Asset' }, { id: 'noise', label: 'Less Useful Signal' }],
    items: [
      { id: 'portfolio', text: 'Portfolio of completed work', bucketId: 'asset' },
      { id: 'reliable', text: 'Reputation for meeting deadlines', bucketId: 'asset' },
      { id: 'buzzword', text: 'Buzzwords with no examples', bucketId: 'noise' },
      { id: 'mentor', text: 'Mentor who knows your work', bucketId: 'asset' },
      { id: 'randomCert', text: 'Random certificate unrelated to goals', bucketId: 'noise' },
    ] },
  { id: 'u10-l1-e3', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'Evidence of outcomes beats vague claims.',
    prompt: 'Which resume bullet is strongest?',
    options: [
      { id: 'a', text: 'Helped with social media sometimes', isCorrect: false },
      { id: 'b', text: 'Increased email signups 32% by testing new landing pages', isCorrect: true },
      { id: 'c', text: 'Hard worker and team player', isCorrect: false },
      { id: 'd', text: 'Responsible for stuff', isCorrect: false },
    ] },
];

const u10l2: Exercise[] = [
  { id: 'u10-l2-e1', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'Negotiation should be anchored in evidence, market data, and flexibility.',
    story: 'Leah gets a job offer at $52,000. Similar roles in her city pay $56,000-$62,000. She has a portfolio showing relevant results.',
    choices: [
      { id: 'a', text: 'Ask whether there is room to move closer to market based on her experience', outcome: 'Correct. Specific, evidence-based, and collaborative.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Accept instantly because negotiating is always rude', outcome: 'Respectful negotiation is normal in many roles.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Demand $80,000 with no explanation', outcome: 'Aggressive without evidence is less credible.', isCorrect: false, score: 0 },
    ] },
  { id: 'u10-l2-e2', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'Negotiation prep has a sensible sequence.',
    instruction: 'Order negotiation prep.',
    items: [
      { id: 's1', text: 'Research market compensation', rank: 1 },
      { id: 's2', text: 'List evidence of your value', rank: 2 },
      { id: 's3', text: 'Choose target, acceptable range, and alternatives', rank: 3 },
      { id: 's4', text: 'Ask respectfully and specifically', rank: 4 },
      { id: 's5', text: 'Evaluate salary, benefits, growth, and fit together', rank: 5 },
    ] },
  { id: 'u10-l2-e3', kind: 'fillBlank', competencyId: 'incomeGrowth',
    rationale: 'Strong negotiation uses evidence and market range.',
    template: 'A strong raise request combines market ___, proof of ___, and a clear ask.',
    blanks: ['data', 'impact'],
    wordBank: ['data', 'gossip', 'impact', 'luck', 'pressure'] },
];

const u10l3: Exercise[] = [
  { id: 'u10-l3-e1', kind: 'matchPairs', competencyId: 'incomeGrowth',
    rationale: 'Benefits can be worth thousands and should be part of compensation.',
    instruction: 'Match each benefit.',
    pairs: [
      { id: 'match', term: 'Retirement match', definition: 'Employer contributes when you contribute' },
      { id: 'premium', term: 'Health premium', definition: 'Amount paid for insurance coverage' },
      { id: 'pto', term: 'Paid time off', definition: 'Paid days away from work' },
      { id: 'hsa', term: 'HSA', definition: 'Tax-advantaged health savings account if eligible' },
    ] },
  { id: 'u10-l3-e2', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'A lower salary can sometimes be offset by stronger benefits, but the math must be explicit.',
    story: 'Offer A pays $58,000 with weak benefits. Offer B pays $55,000 with a $3,000 retirement match, cheaper insurance, and tuition support you will use.',
    choices: [
      { id: 'a', text: 'Compare total compensation, not salary alone', outcome: 'Correct. Benefits can change the real value of an offer.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Always choose the highest salary line', outcome: 'Salary matters, but total compensation and growth path can matter more.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Ignore benefits because they are not cash', outcome: 'Some benefits directly reduce costs or build wealth.', isCorrect: false, score: 0 },
    ] },
  { id: 'u10-l3-e3', kind: 'calculator', competencyId: 'incomeGrowth',
    rationale: 'Annualizing a benefit shows its economic value.',
    formulaKey: 'annualCost',
    prompt: 'A commute benefit saves $80/month. Calculate annual value.',
    targetLabel: 'Annual benefit value',
    explanation: 'Monthly value x 12 makes benefits easier to compare.',
    inputs: [
      { id: 'daily', label: 'Monthly value', value: 80, min: 0, max: 1000, step: 10, prefix: '$' },
      { id: 'days', label: 'Months per year', value: 12, min: 12, max: 12, step: 1 },
      { id: 'years', label: 'Years', value: 1, min: 1, max: 10, step: 1 },
    ] },
];

const u10Practice: Exercise[] = [u10l1[2]!, u10l2[0]!, u10l3[0]!, u10l3[2]!];

const u10l4: Exercise[] = [
  { id: 'u10-l4-e1', kind: 'calculator', competencyId: 'businessFinance',
    rationale: 'Side income should be evaluated after costs and taxes.',
    formulaKey: 'profitMargin',
    prompt: 'A weekend tutoring side hustle brings in $800/month, costs $120 for materials and software, and reserves $160 for tax.',
    targetLabel: 'Side income margin',
    explanation: 'Margin shows how much income survives costs and tax reserve.',
    inputs: [
      { id: 'revenue', label: 'Revenue', value: 800, min: 0, max: 10000, step: 50, prefix: '$' },
      { id: 'costs', label: 'Costs', value: 120, min: 0, max: 5000, step: 20, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 160, min: 0, max: 5000, step: 20, prefix: '$' },
    ] },
  { id: 'u10-l4-e2', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'A side hustle has both upside and constraints.',
    instruction: 'Sort each factor.',
    buckets: [{ id: 'upside', label: 'Upside' }, { id: 'risk', label: 'Risk/Cost' }],
    items: [
      { id: 'skills', text: 'Builds marketable skills', bucketId: 'upside' },
      { id: 'burnout', text: 'Reduces recovery time', bucketId: 'risk' },
      { id: 'clients', text: 'Creates client relationships', bucketId: 'upside' },
      { id: 'tax', text: 'Requires tax reserves', bucketId: 'risk' },
      { id: 'portfolio', text: 'Produces portfolio proof', bucketId: 'upside' },
    ] },
  { id: 'u10-l4-e3', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'The best side income fits skills, schedule, and margin.',
    story: 'Dev has 5 free hours per week. Option A: delivery work at $16/hour after gas. Option B: tutoring math at $35/hour with 30 minutes prep.',
    choices: [
      { id: 'a', text: 'Compare hourly profit, skill growth, and schedule fit', outcome: 'Correct. Money, skill compounding, and energy all matter.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Pick delivery because it starts fastest', outcome: 'Speed matters, but not if another option compounds skills and pays better.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Pick neither without testing demand', outcome: 'A small test is better than assuming demand or dismissing it.', isCorrect: false, score: 1 },
    ] },
];

const u10l5: Exercise[] = [
  { id: 'u10-l5-e1', kind: 'miniStory', competencyId: 'incomeGrowth',
    rationale: 'A career capstone integrates skill, proof, network, negotiation, and income streams.',
    panels: [
      { text: 'Maya wants to move from retail into operations. She has customer service experience, strong spreadsheets, and has helped schedule shifts.', speaker: 'Narrator' },
      { text: 'She needs a 90-day plan that creates proof for better roles.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Maya build?',
    choices: [
      { id: 'a', text: 'A small portfolio: scheduling dashboard, process improvement story, and referrals', outcome: 'Correct. Proof and relationships make the career move credible.', isCorrect: true },
      { id: 'b', text: 'A vague resume saying she is passionate', outcome: 'Passion helps, but evidence gets interviews.', isCorrect: false },
    ] },
  { id: 'u10-l5-e2', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'A career growth plan should move from target to proof to outreach.',
    instruction: 'Order a 90-day career plan.',
    items: [
      { id: 's1', text: 'Choose a target role and skill gaps', rank: 1 },
      { id: 's2', text: 'Build one portfolio project', rank: 2 },
      { id: 's3', text: 'Update resume with measured proof', rank: 3 },
      { id: 's4', text: 'Ask for feedback and referrals', rank: 4 },
      { id: 's5', text: 'Apply, interview, and negotiate with market data', rank: 5 },
    ] },
  { id: 'u10-l5-e3', kind: 'recallPrompt', competencyId: 'incomeGrowth',
    rationale: 'The capstone should become a repeatable career operating system.',
    prompt: 'What three assets should you keep building for income growth?',
    conceptReveal: 'Build skill, proof, and relationships. Skill creates value, proof makes value believable, and relationships create access to opportunities.',
    checkpoints: ['Skill','Proof','Relationships'] },
];

// ─── Unit 11 - Business Systems ──────────────────────────────────────────────

const u11l1: Exercise[] = [
  { id: 'u11-l1-e1', kind: 'miniStory', competencyId: 'financialAnalysis',
    rationale: 'A paradox hook (busy = broke) creates curiosity and motivates why P&L reading matters before any theory.',
    panels: [
      { text: "Mike's sandwich shop made $280,000 in sales last year." },
      { text: "The line was out the door every single lunch." },
      { text: "Then in December, the bank called. He was overdrawn by $14,000." },
    ],
    choicePrompt: "How does a packed, popular restaurant go broke?",
    choices: [
      { id: 'a', text: 'He was stealing from his own business', isCorrect: false, outcome: "No evidence of that — he was just busy running it. The real culprit is hiding in the numbers." },
      { id: 'b', text: 'His expenses quietly ate every dollar he made', isCorrect: true, outcome: "Exactly. Revenue alone is not profit. P&L = Revenue − Expenses. Mike had plenty of sales but never checked where the money was going." },
      { id: 'c', text: 'His sales numbers were inflated', isCorrect: false, outcome: "The sales were real. The problem is that expenses were higher than his prices could cover." },
    ] },
  { id: 'u11-l1-e2', kind: 'matchPairs', competencyId: 'financialAnalysis',
    rationale: 'Learners need precise P&L vocabulary before they can calculate or interpret one.',
    instruction: 'Match each P&L term to its definition.',
    pairs: [
      { id: 'rev', term: 'Revenue', definition: 'Total money coming IN from sales' },
      { id: 'cogs', term: 'Cost of Goods Sold (COGS)', definition: 'Direct cost to make or deliver the product' },
      { id: 'opex', term: 'Operating Expenses', definition: 'Rent, staff, utilities, and admin costs' },
      { id: 'net', term: 'Net Income (or Loss)', definition: "What's left after ALL expenses are subtracted" },
    ] },
  { id: 'u11-l1-e3', kind: 'calculator', competencyId: 'financialAnalysis',
    rationale: "Using real numbers from the hook story makes the formula concrete and memorable.",
    formulaKey: 'budgetSurplus',
    prompt: "Read Mike's P&L: Revenue $280,000 | Food costs $140,000 | Labor $72,000 | Rent $36,000 | Other $18,000. Calculate net income.",
    targetLabel: 'Net Income',
    explanation: "Net Income = $280K revenue − $140K food − $72K labor − $36K rent − $18K other = −$14,000 (a loss). Mike was busy but his prices didn't cover all his costs.",
    inputs: [
      { id: 'income', label: 'Revenue', value: 280000, min: 0, max: 500000, step: 5000, prefix: '$' },
      { id: 'fixed', label: 'Food costs + Rent', value: 176000, min: 0, max: 400000, step: 5000, prefix: '$' },
      { id: 'variable', label: 'Labor + Other', value: 90000, min: 0, max: 300000, step: 5000, prefix: '$' },
    ] },
  { id: 'u11-l1-e4', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Applying P&L insight to a fix-it decision shows learners the real value of reading financials.',
    story: "Mike's sandwiches cost $4 to make and sell for $9. Rent just increased $2,000/month — that's $24,000 more per year. His three options:",
    choices: [
      { id: 'a', text: 'Raise the sandwich price by $0.75', outcome: 'Best move. A $0.75 increase on roughly 1,700 sandwiches/week covers the full rent hike. Small price adjustments have large impact at volume.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Cut prep staff by 4 hours per day', outcome: 'Saves some money but risks food quality and slower service — which may hurt revenue more than it saves.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Open an extra hour per day to sell more volume', outcome: 'More volume helps, but also adds labor cost. Without improving margin per sandwich, more volume just means more of the same problem.', isCorrect: false, score: 2 },
    ] },
  { id: 'u11-l1-e5', kind: 'trueFalse', competencyId: 'businessFinance',
    rationale: "Revenue ≠ profit is the most common misconception in small business finance.",
    statement: 'A business generating $1 million in annual sales is always profitable.',
    isTrue: false },
];

const u11l2: Exercise[] = [
  { id: 'u11-l2-e1', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Inventory ties up cash and creates spoilage or obsolescence risk.',
    story: 'A candle business sells 80 units/month. A supplier offers a discount if the founder buys 800 jars at once.',
    choices: [
      { id: 'a', text: 'Check cash, storage, demand, and how long inventory will sit', outcome: 'Correct. Bulk discounts can be expensive if they trap cash or create waste.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Buy immediately because discounts are always profit', outcome: 'A discount can still hurt runway if inventory sits too long.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Never buy inventory ahead of sales', outcome: 'Too rigid. The right amount depends on demand, cash, and supplier terms.', isCorrect: false, score: 1 },
    ] },
  { id: 'u11-l2-e2', kind: 'calculator', competencyId: 'businessFinance',
    rationale: 'Inventory purchases should be judged against monthly cash surplus.',
    formulaKey: 'budgetSurplus',
    prompt: 'A shop collects $4,500, pays $1,200 fixed costs, and plans $1,700 of inventory. Estimate cash left.',
    targetLabel: 'Cash after inventory',
    explanation: 'Cash left = revenue - fixed costs - inventory/variable spend.',
    inputs: [
      { id: 'income', label: 'Cash collected', value: 4500, min: 0, max: 30000, step: 250, prefix: '$' },
      { id: 'fixed', label: 'Fixed costs', value: 1200, min: 0, max: 20000, step: 100, prefix: '$' },
      { id: 'variable', label: 'Inventory buy', value: 1700, min: 0, max: 25000, step: 100, prefix: '$' },
    ] },
  { id: 'u11-l2-e3', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'Inventory turnover describes how quickly stock becomes sales.',
    prompt: 'Why does inventory turnover matter?',
    options: [
      { id: 'a', text: 'Slow inventory traps cash and can become obsolete', isCorrect: true },
      { id: 'b', text: 'Inventory is always the same as profit', isCorrect: false },
      { id: 'c', text: 'It only matters for public companies', isCorrect: false },
      { id: 'd', text: 'It means avoiding all stock', isCorrect: false },
    ] },
];

const u11l3: Exercise[] = [
  { id: 'u11-l3-e1', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Retention and service metrics show whether the business creates repeat value.',
    instruction: 'Match each customer metric.',
    pairs: [
      { id: 'churn', term: 'Churn', definition: 'Customers who stop buying or cancel' },
      { id: 'repeat', term: 'Repeat rate', definition: 'Percent of customers who buy again' },
      { id: 'nps', term: 'Referral signal', definition: 'Customers willing to recommend you' },
      { id: 'ticket', term: 'Support ticket', definition: 'Customer issue needing resolution' },
    ] },
  { id: 'u11-l3-e2', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Retention is often improved by service reliability and proactive communication.',
    story: 'A meal-prep startup has good first orders but many second-week cancellations because deliveries arrive late.',
    choices: [
      { id: 'a', text: 'Fix delivery reliability before spending more on ads', outcome: 'Correct. Acquisition is wasted if operations break retention.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Offer bigger discounts to new customers only', outcome: 'That may worsen the leak by adding more customers to a broken process.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore cancellations because first orders are growing', outcome: 'Growth with churn is expensive and unstable.', isCorrect: false, score: 0 },
    ] },
  { id: 'u11-l3-e3', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Service recovery should be fast, specific, and preventative.',
    instruction: 'Order a service recovery process.',
    items: [
      { id: 's1', text: 'Acknowledge the issue quickly', rank: 1 },
      { id: 's2', text: 'Explain the fix or next step', rank: 2 },
      { id: 's3', text: 'Make the customer whole when appropriate', rank: 3 },
      { id: 's4', text: 'Log the root cause', rank: 4 },
      { id: 's5', text: 'Change the process to prevent repeats', rank: 5 },
    ] },
];

const u11Practice: Exercise[] = [u11l1[1]!, u11l2[2]!, u11l3[1]!, u11l1[2]!];

const u11l4: Exercise[] = [
  { id: 'u11-l4-e1', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Hiring should start with repetitive, documented work that frees founder time.',
    story: 'A founder spends 8 hours/week packing orders and 3 hours/week on high-value sales calls. They can afford 5 hours/week of help.',
    choices: [
      { id: 'a', text: 'Delegate part of packing with a checklist', outcome: 'Correct. Delegate repeatable work first so founder time moves to higher-value tasks.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Delegate sales calls before documenting the offer', outcome: 'Sales is high-leverage but risky to delegate before the process is clear.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Do everything forever to save money', outcome: 'Saving money can cap growth if founder time is the bottleneck.', isCorrect: false, score: 0 },
    ] },
  { id: 'u11-l4-e2', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Good delegation requires process clarity and risk controls.',
    instruction: 'Sort each task.',
    buckets: [{ id: 'delegate', label: 'Delegate First' }, { id: 'founder', label: 'Founder Keeps For Now' }],
    items: [
      { id: 'packing', text: 'Packing orders from a checklist', bucketId: 'delegate' },
      { id: 'strategy', text: 'Changing pricing strategy', bucketId: 'founder' },
      { id: 'inbox', text: 'Tagging support emails by issue type', bucketId: 'delegate' },
      { id: 'bank', text: 'Approving bank transfers', bucketId: 'founder' },
      { id: 'data', text: 'Entering receipts into bookkeeping software', bucketId: 'delegate' },
    ] },
  { id: 'u11-l4-e3', kind: 'fillBlank', competencyId: 'businessFinance',
    rationale: 'Process documentation turns founder knowledge into a repeatable system.',
    template: 'A good delegation task has a checklist, a clear ___ standard, and a way to catch ___.',
    blanks: ['quality', 'mistakes'],
    wordBank: ['quality', 'mystery', 'mistakes', 'followers', 'luck'] },
];

const u11l5: Exercise[] = [
  { id: 'u11-l5-e1', kind: 'miniStory', competencyId: 'financialAnalysis',
    rationale: 'A business systems capstone integrates books, inventory, service, and delegation.',
    panels: [
      { text: 'Omar runs a growing repair shop. Sales are up, but receipts are messy, parts inventory is missing, and customers complain about slow updates.', speaker: 'Narrator' },
      { text: 'Omar wants to hire, but the business still runs mostly from memory.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Omar build first?',
    choices: [
      { id: 'a', text: 'A weekly operating system for books, inventory, customer updates, and task checklists', outcome: 'Correct. Systems make growth manageable and delegation safer.', isCorrect: true },
      { id: 'b', text: 'A bigger ad campaign before fixing operations', outcome: 'More demand can make operational problems worse.', isCorrect: false },
    ] },
  { id: 'u11-l5-e2', kind: 'tapToOrder', competencyId: 'financialAnalysis',
    rationale: 'An operating review should move from money to inventory to customers to team.',
    instruction: 'Order a weekly operating review.',
    items: [
      { id: 's1', text: 'Review cash, revenue, expenses, and tax reserve', rank: 1 },
      { id: 's2', text: 'Check inventory and supplier needs', rank: 2 },
      { id: 's3', text: 'Review customer issues, retention, and refunds', rank: 3 },
      { id: 's4', text: 'Review delegated tasks and quality problems', rank: 4 },
      { id: 's5', text: 'Choose one process improvement for next week', rank: 5 },
    ] },
  { id: 'u11-l5-e3', kind: 'recallPrompt', competencyId: 'financialAnalysis',
    rationale: 'The unit should leave learners with a compact operator dashboard.',
    prompt: 'What should a small business operator review every week?',
    conceptReveal: 'Review cash, profit, inventory, customer issues, retention, delegated tasks, and one process improvement. Growth is easier when the business has a rhythm.',
    checkpoints: ['Money','Inventory','Customers','Team process'] },
];

// ─── Unit 12 - Insurance & Risk ──────────────────────────────────────────────

const u12l1: Exercise[] = [
  { id: 'u12-l1-e1', kind: 'recallPrompt', competencyId: 'insuranceRisk',
    rationale: 'Insurance is a risk-transfer tool, not a way to make expected profit.',
    prompt: 'Why would someone pay for insurance if they might never file a claim?',
    conceptReveal: 'Insurance trades a known premium for protection against a large uncertain loss. It is strongest for risks that would wreck your finances, not every small inconvenience.',
    checkpoints: ['Transfers large risk','Protects against rare expensive events','Does not remove the need for an emergency fund'] },
  { id: 'u12-l1-e2', kind: 'matchPairs', competencyId: 'insuranceRisk',
    rationale: 'Learners need basic policy vocabulary before comparing coverage.',
    instruction: 'Match each insurance term.',
    pairs: [
      { id: 'premium', term: 'Premium', definition: 'The price paid to keep coverage active' },
      { id: 'deductible', term: 'Deductible', definition: 'What you pay before insurance starts sharing costs' },
      { id: 'claim', term: 'Claim', definition: 'A request for the insurer to cover a loss' },
      { id: 'limit', term: 'Coverage limit', definition: 'The maximum a policy may pay for a covered loss' },
    ] },
  { id: 'u12-l1-e3', kind: 'multipleChoice', competencyId: 'insuranceRisk',
    rationale: 'Insurance is most useful for low-frequency, high-severity risks.',
    prompt: 'Which risk is the strongest reason to buy insurance?',
    options: [
      { id: 'a', text: 'A $15 phone charger breaks', isCorrect: false },
      { id: 'b', text: 'A medical emergency creates a huge bill', isCorrect: true },
      { id: 'c', text: 'A favorite snack gets more expensive', isCorrect: false },
      { id: 'd', text: 'A small coupon expires', isCorrect: false },
    ] },
];

const u12l2: Exercise[] = [
  { id: 'u12-l2-e1', kind: 'calculator', competencyId: 'insuranceRisk',
    rationale: 'Deductibles create real cash needs even when a household is insured.',
    formulaKey: 'deductibleReserve',
    prompt: 'A renter has a $1,000 deductible, expects $300 of uncovered costs, and has $450 ready. Calculate the extra reserve needed.',
    targetLabel: 'Reserve still needed',
    explanation: 'Reserve needed = deductible + uncovered costs - cash on hand.',
    inputs: [
      { id: 'deductible', label: 'Deductible', value: 1000, min: 0, max: 5000, step: 100, prefix: '$' },
      { id: 'uncovered', label: 'Uncovered costs', value: 300, min: 0, max: 5000, step: 50, prefix: '$' },
      { id: 'cashOnHand', label: 'Cash on hand', value: 450, min: 0, max: 5000, step: 50, prefix: '$' },
    ] },
  { id: 'u12-l2-e2', kind: 'scenarioDecision', competencyId: 'insuranceRisk',
    rationale: 'A higher deductible can lower premiums but increases cash risk.',
    story: 'Mina can choose a $250 deductible with a higher monthly premium or a $1,500 deductible with a lower premium. She has only $300 saved.',
    choices: [
      { id: 'a', text: 'Pick the $1,500 deductible only because the monthly bill is cheaper', outcome: 'A cheap premium can become expensive if the deductible is impossible to pay during a claim.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Compare total cost and choose a deductible she can actually cover', outcome: 'Correct. The best policy fits both monthly budget and emergency cash.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Skip insurance and hope nothing happens', outcome: 'Hope is not a risk plan when a loss could damage housing, health, or transportation.', isCorrect: false, score: 0 },
    ] },
  { id: 'u12-l2-e3', kind: 'trueFalse', competencyId: 'insuranceRisk',
    rationale: 'Premium and deductible tradeoffs are central to coverage decisions.',
    statement: 'A lower monthly premium can come with a higher deductible.',
    isTrue: true },
];

const u12l3: Exercise[] = [
  { id: 'u12-l3-e1', kind: 'categorize', competencyId: 'insuranceRisk',
    rationale: 'Different policies cover different parts of a household risk map.',
    instruction: 'Sort what each policy mainly protects.',
    buckets: [{ id: 'health', label: 'Health' }, { id: 'renters', label: 'Renters' }, { id: 'auto', label: 'Auto' }],
    items: [
      { id: 'doctor', text: 'Doctor visits and hospital bills', bucketId: 'health' },
      { id: 'belongings', text: 'Personal belongings after a covered apartment loss', bucketId: 'renters' },
      { id: 'liability', text: 'Damage you cause while driving', bucketId: 'auto' },
      { id: 'meds', text: 'Covered prescriptions', bucketId: 'health' },
      { id: 'theft', text: 'Laptop stolen from the apartment', bucketId: 'renters' },
    ] },
  { id: 'u12-l3-e2', kind: 'fillBlank', competencyId: 'insuranceRisk',
    rationale: 'Coverage gaps happen when learners assume every loss is covered.',
    template: 'A policy can protect against covered losses, but exclusions and coverage ___ still matter.',
    blanks: ['limits'],
    wordBank: ['limits', 'colors', 'opinions', 'hashtags'] },
  { id: 'u12-l3-e3', kind: 'scenarioDecision', competencyId: 'insuranceRisk',
    rationale: 'Renters insurance is often low cost and protects belongings plus liability.',
    story: 'A college renter owns a laptop, bike, clothes, and furniture. Their landlord has insurance on the building.',
    choices: [
      { id: 'a', text: 'Assume the landlord policy covers the renter belongings', outcome: 'The landlord policy usually protects the building, not the renter personal property.', isCorrect: false, score: 0 },
      { id: 'b', text: 'Consider renters insurance and keep a home inventory', outcome: 'Correct. Renters coverage can protect belongings and liability; inventory makes claims easier.', isCorrect: true, score: 3 },
      { id: 'c', text: 'Wait until after a theft to buy coverage', outcome: 'Insurance must be active before a covered loss happens.', isCorrect: false, score: 0 },
    ] },
];

const u12Practice: Exercise[] = [u12l1[1]!, u12l2[0]!, u12l2[2]!, u12l3[0]!];

const u12l4: Exercise[] = [
  { id: 'u12-l4-e1', kind: 'tapToOrder', competencyId: 'insuranceRisk',
    rationale: 'Claims go better when learners document, report, and track the process.',
    instruction: 'Order the steps after a covered loss.',
    items: [
      { id: 's1', text: 'Make sure people are safe and prevent more damage', rank: 1 },
      { id: 's2', text: 'Document photos, receipts, dates, and what happened', rank: 2 },
      { id: 's3', text: 'Contact the insurer and file the claim', rank: 3 },
      { id: 's4', text: 'Track claim number, adjuster notes, and deadlines', rank: 4 },
      { id: 's5', text: 'Review payout, deductible, and repair decisions', rank: 5 },
    ] },
  { id: 'u12-l4-e2', kind: 'multipleChoice', competencyId: 'insuranceRisk',
    rationale: 'A home inventory is practical preparation for theft, fire, or weather claims.',
    prompt: 'Why keep photos or a list of valuable belongings?',
    options: [
      { id: 'a', text: 'It helps prove what you owned during a claim', isCorrect: true },
      { id: 'b', text: 'It replaces the need for coverage', isCorrect: false },
      { id: 'c', text: 'It guarantees every claim is paid in full', isCorrect: false },
      { id: 'd', text: 'It makes deductibles disappear', isCorrect: false },
    ] },
  { id: 'u12-l4-e3', kind: 'matchPairs', competencyId: 'insuranceRisk',
    rationale: 'Reading declarations pages requires connecting numbers to policy meaning.',
    instruction: 'Match the policy line to the question it answers.',
    pairs: [
      { id: 'limit', term: 'Coverage limit', definition: 'How much could the policy pay?' },
      { id: 'deductible', term: 'Deductible', definition: 'How much cash must I cover first?' },
      { id: 'excluded', term: 'Exclusion', definition: 'What losses are not covered?' },
      { id: 'effective', term: 'Effective dates', definition: 'When is the policy active?' },
    ] },
];

const u12l5: Exercise[] = [
  { id: 'u12-l5-e1', kind: 'miniStory', competencyId: 'insuranceRisk',
    rationale: 'A capstone should combine coverage choices, deductible reserves, and claim readiness.',
    panels: [
      { text: 'Ari just moved into an apartment and bought a used car for commuting. They have $700 saved and cannot miss work if the car is damaged.', speaker: 'Narrator' },
      { text: 'They are comparing auto coverage, renters insurance, and how much cash to keep outside investments.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What is the strongest risk plan?',
    choices: [
      { id: 'a', text: 'Buy coverage for major risks, keep deductible cash, and document belongings', outcome: 'Correct. Insurance, cash reserves, and documentation work together.', isCorrect: true },
      { id: 'b', text: 'Invest all savings because insurance exists', outcome: 'Insurance does not pay instantly or cover every cost. Deductibles and gaps still need cash.', isCorrect: false },
    ] },
  { id: 'u12-l5-e2', kind: 'calculator', competencyId: 'liquidity',
    rationale: 'Risk planning connects insurance deductibles to liquid savings.',
    formulaKey: 'deductibleReserve',
    prompt: 'Ari wants $1,000 for auto deductible risk, $500 for renters deductible risk, and has $700 saved. Calculate the gap.',
    targetLabel: 'Risk reserve gap',
    explanation: 'Reserve gap = deductible target + uncovered costs - cash on hand.',
    inputs: [
      { id: 'deductible', label: 'Deductible target', value: 1000, min: 0, max: 5000, step: 100, prefix: '$' },
      { id: 'uncovered', label: 'Extra deductible risk', value: 500, min: 0, max: 5000, step: 100, prefix: '$' },
      { id: 'cashOnHand', label: 'Saved now', value: 700, min: 0, max: 5000, step: 50, prefix: '$' },
    ] },
  { id: 'u12-l5-e3', kind: 'recallPrompt', competencyId: 'insuranceRisk',
    rationale: 'The unit should end with a reusable insurance decision frame.',
    prompt: 'What should you check before choosing an insurance policy?',
    conceptReveal: 'Check the loss you are protecting against, premium, deductible, coverage limits, exclusions, emergency cash needed, and how claims are filed.',
    checkpoints: ['Risk protected','Premium and deductible','Limits and exclusions','Claim process'] },
];

// ─── Unit 13 - Sales & Marketing Lab ─────────────────────────────────────────

const u13l1: Exercise[] = [
  { id: 'u13-l1-e1', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'Marketing starts with a specific customer and urgent trigger.',
    prompt: 'Who is more useful to design for: "everyone" or a specific customer with a specific problem?',
    conceptReveal: 'A sharp customer segment names who has the pain, when it happens, how they solve it now, and what would make switching worth it.',
    checkpoints: ['Specific customer','Clear pain trigger','Current alternative','Reason to switch'] },
  { id: 'u13-l1-e2', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Segmentation separates useful buyer signals from vanity descriptions.',
    instruction: 'Sort each customer description.',
    buckets: [{ id: 'sharp', label: 'Sharp Segment' }, { id: 'vague', label: 'Too Vague' }],
    items: [
      { id: 'busyParents', text: 'Busy parents who need healthy school lunches by Sunday night', bucketId: 'sharp' },
      { id: 'everyone', text: 'Everyone who likes food', bucketId: 'vague' },
      { id: 'creators', text: 'Solo creators who spend 5+ hours/month editing short videos', bucketId: 'sharp' },
      { id: 'youngPeople', text: 'Young people online', bucketId: 'vague' },
      { id: 'salons', text: 'Local salons losing bookings to no-shows', bucketId: 'sharp' },
    ] },
  { id: 'u13-l1-e3', kind: 'multipleChoice', competencyId: 'businessFinance',
    rationale: 'A good beachhead market makes early selling and learning faster.',
    prompt: 'What makes a strong first customer segment?',
    options: [
      { id: 'a', text: 'They have an urgent problem and are reachable', isCorrect: true },
      { id: 'b', text: 'They are impossible to contact', isCorrect: false },
      { id: 'c', text: 'They only say nice things but never buy', isCorrect: false },
      { id: 'd', text: 'They are defined only by age', isCorrect: false },
    ] },
];

const u13l2: Exercise[] = [
  { id: 'u13-l2-e1', kind: 'fillBlank', competencyId: 'businessFinance',
    rationale: 'A positioning statement connects customer, problem, promise, and proof.',
    template: 'A strong offer says: for ___, we solve ___ with proof that makes switching feel worth it.',
    blanks: ['customer', 'problem'],
    wordBank: ['customer', 'problem', 'weather', 'logo', 'luck'] },
  { id: 'u13-l2-e2', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Learners should distinguish features from outcomes and proof.',
    instruction: 'Match each offer term.',
    pairs: [
      { id: 'feature', term: 'Feature', definition: 'What the product includes' },
      { id: 'benefit', term: 'Benefit', definition: 'Why the customer cares' },
      { id: 'proof', term: 'Proof', definition: 'Evidence the promise is credible' },
      { id: 'risk', term: 'Risk reversal', definition: 'A guarantee, trial, or other way to lower buyer fear' },
    ] },
  { id: 'u13-l2-e3', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Clear offers beat vague branding when customers are deciding.',
    story: 'A tutoring founder says, "We help students succeed." Parents keep asking what that means.',
    choices: [
      { id: 'a', text: 'Rewrite the offer around a clear outcome, target student, timeframe, and proof', outcome: 'Correct. Specific outcomes make the offer easier to trust and compare.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Make the logo bigger and leave the message vague', outcome: 'Design cannot replace a clear promise.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Lower price before learning why parents are confused', outcome: 'Discounting a vague offer can train customers to value it less without fixing the issue.', isCorrect: false, score: 1 },
    ] },
];

const u13l3: Exercise[] = [
  { id: 'u13-l3-e1', kind: 'calculator', competencyId: 'financialAnalysis',
    rationale: 'Marketing tests should be judged by contribution after variable costs and ad spend.',
    formulaKey: 'profitMargin',
    prompt: 'A launch sells $1,200 of product. Product costs and ad spend total $760, and tax reserve is $120. Calculate margin.',
    targetLabel: 'Launch margin',
    explanation: 'Margin = (revenue - costs - tax reserve) / revenue.',
    inputs: [
      { id: 'revenue', label: 'Revenue', value: 1200, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'costs', label: 'Costs and ads', value: 760, min: 0, max: 10000, step: 50, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 120, min: 0, max: 5000, step: 25, prefix: '$' },
    ] },
  { id: 'u13-l3-e2', kind: 'scenarioDecision', competencyId: 'financialAnalysis',
    rationale: 'Winners should be picked by profitable conversion, not surface engagement.',
    story: 'Two ads run for a meal-prep business. Ad A gets more likes. Ad B gets fewer likes but more profitable orders.',
    choices: [
      { id: 'a', text: 'Scale Ad B after checking capacity and delivery quality', outcome: 'Correct. Profitable buyer behavior matters more than likes.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Scale Ad A because it feels more popular', outcome: 'Popularity is weak if it does not produce profitable customers.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore both ads because marketing data is imperfect', outcome: 'Data is imperfect, but profitable orders are a useful signal.', isCorrect: false, score: 1 },
    ] },
  { id: 'u13-l3-e3', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'A good experiment isolates the question and defines success before spending.',
    instruction: 'Order a marketing experiment.',
    items: [
      { id: 's1', text: 'Choose one customer segment and one offer', rank: 1 },
      { id: 's2', text: 'Define the success metric before launch', rank: 2 },
      { id: 's3', text: 'Set a small budget and time window', rank: 3 },
      { id: 's4', text: 'Measure leads, purchases, cost, and margin', rank: 4 },
      { id: 's5', text: 'Keep, change, or stop based on the data', rank: 5 },
    ] },
];

const u13Practice: Exercise[] = [u13l1[1]!, u13l2[2]!, u13l3[0]!, u13l3[2]!];

const u13l4: Exercise[] = [
  { id: 'u13-l4-e1', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'A sales pipeline turns scattered conversations into measurable progress.',
    instruction: 'Match each pipeline stage.',
    pairs: [
      { id: 'lead', term: 'Lead', definition: 'A possible customer who fits the target' },
      { id: 'qualified', term: 'Qualified', definition: 'Has the problem, budget, authority, and timing' },
      { id: 'proposal', term: 'Proposal', definition: 'A specific offer, price, and next step' },
      { id: 'closed', term: 'Closed won', definition: 'The customer commits and pays or signs' },
    ] },
  { id: 'u13-l4-e2', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Follow-up should create clarity without pressure or desperation.',
    story: 'A business owner loved a demo but has not replied for a week. The founder wants to keep the deal alive.',
    choices: [
      { id: 'a', text: 'Send a clear follow-up with the problem discussed, next step, and deadline', outcome: 'Correct. Good follow-up makes the decision easier and keeps momentum.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Send ten messages in one day', outcome: 'Pressure can damage trust and does not create a better offer.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Never follow up because silence always means no', outcome: 'Some buyers are busy. One useful follow-up is part of a professional process.', isCorrect: false, score: 1 },
    ] },
  { id: 'u13-l4-e3', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Consultative selling moves from diagnosis to proposal to commitment.',
    instruction: 'Order a useful sales conversation.',
    items: [
      { id: 's1', text: 'Ask about the current problem and cost of delay', rank: 1 },
      { id: 's2', text: 'Confirm who decides and what success means', rank: 2 },
      { id: 's3', text: 'Connect the offer to the stated problem', rank: 3 },
      { id: 's4', text: 'Name price, timing, and next step clearly', rank: 4 },
      { id: 's5', text: 'Follow up with a written recap', rank: 5 },
    ] },
];

const u13l5: Exercise[] = [
  { id: 'u13-l5-e1', kind: 'miniStory', competencyId: 'financialAnalysis',
    rationale: 'The launch capstone integrates segment, offer, test budget, margin, and follow-up.',
    panels: [
      { text: 'Sam runs a weekend photography business. Leads come from friends, but Sam wants a repeatable way to book paid shoots.', speaker: 'Narrator' },
      { text: 'Sam can spend $250 testing two offers, has limited weekends, and needs each booking to stay profitable.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Sam build?',
    choices: [
      { id: 'a', text: 'A small campaign with one segment, one offer, clear booking metric, and follow-up process', outcome: 'Correct. A controlled launch teaches what sells without overwhelming capacity.', isCorrect: true },
      { id: 'b', text: 'Post random content every day and hope bookings appear', outcome: 'Content without a segment, offer, metric, or follow-up is hard to learn from.', isCorrect: false },
    ] },
  { id: 'u13-l5-e2', kind: 'calculator', competencyId: 'financialAnalysis',
    rationale: 'Campaign decisions should include cash left after ad spend and delivery costs.',
    formulaKey: 'budgetSurplus',
    prompt: 'Sam books $1,100 of shoots, spends $250 on ads, and pays $180 in delivery costs. Calculate launch cash before tax.',
    targetLabel: 'Launch cash',
    explanation: 'Launch cash = income - fixed costs - variable costs.',
    inputs: [
      { id: 'income', label: 'Booked revenue', value: 1100, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Ad spend', value: 250, min: 0, max: 5000, step: 50, prefix: '$' },
      { id: 'variable', label: 'Delivery costs', value: 180, min: 0, max: 5000, step: 20, prefix: '$' },
    ] },
  { id: 'u13-l5-e3', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'The unit should end with a portable go-to-market loop.',
    prompt: 'What is the simple loop for learning how to sell?',
    conceptReveal: 'Pick a specific customer, make a clear offer, run a small test, measure profitable buyer behavior, follow up professionally, then improve one part of the loop.',
    checkpoints: ['Customer segment','Clear offer','Small test','Profitable behavior','Follow-up'] },
];

// ─── Unit 14 - Housing & Renting Decisions ───────────────────────────────────

const u14l1: Exercise[] = [
  { id: 'u14-l1-e1', kind: 'miniStory', competencyId: 'budgetDesign',
    rationale: 'Housing is usually the largest fixed cost, so affordability must be tested against real take-home pay.',
    panels: [
      { text: 'Ava earns $3,200/month after tax and found an apartment for $1,350 rent plus $180 utilities.', speaker: 'Narrator' },
      { text: 'The apartment is close to school and work, but it would leave less room for savings and emergencies.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Ava check before applying?',
    choices: [
      { id: 'a', text: 'Whether rent, utilities, insurance, transport, and savings still fit her monthly cash flow', outcome: 'Correct. Rent is only one part of the housing decision.', isCorrect: true },
      { id: 'b', text: 'Only whether the apartment photos look good', outcome: 'Photos do not prove the monthly budget can survive the lease.', isCorrect: false },
    ] },
  { id: 'u14-l1-e2', kind: 'calculator', competencyId: 'cashFlow',
    rationale: 'Rent affordability should be checked against net cash after recurring housing costs.',
    formulaKey: 'budgetSurplus',
    prompt: 'Ava takes home $3,200. Rent is $1,350 and utilities plus renters insurance are $210. Calculate cash left before other expenses.',
    targetLabel: 'Cash after housing',
    explanation: 'Cash after housing = net income - rent - housing add-ons.',
    inputs: [
      { id: 'income', label: 'Monthly take-home', value: 3200, min: 1000, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Rent', value: 1350, min: 0, max: 5000, step: 50, prefix: '$' },
      { id: 'variable', label: 'Utilities and insurance', value: 210, min: 0, max: 2000, step: 25, prefix: '$' },
    ] },
  { id: 'u14-l1-e3', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'A housing choice should leave room for deposits, emergencies, and normal life costs.',
    story: 'A landlord approves Ava, but the lease starts in 10 days and requires first month rent plus a deposit. Ava has only $1,100 saved.',
    choices: [
      { id: 'a', text: 'Pause and build move-in cash before signing', outcome: 'Correct. Signing without move-in cash can force debt before the lease even starts.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Sign immediately because approval means affordability', outcome: 'Approval is not the same as cash readiness.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore utilities because they are smaller than rent', outcome: 'Small recurring housing add-ons can break a tight budget.', isCorrect: false, score: 1 },
    ] },
];

const u14l2: Exercise[] = [
  { id: 'u14-l2-e1', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'Lease literacy helps renters understand obligations before signing.',
    instruction: 'Match each lease term.',
    pairs: [
      { id: 'term', term: 'Lease term', definition: 'How long the rental agreement lasts' },
      { id: 'deposit', term: 'Security deposit', definition: 'Money held to cover damage or unpaid charges' },
      { id: 'lateFee', term: 'Late fee', definition: 'Extra charge if rent is not paid on time' },
      { id: 'sublet', term: 'Sublet rule', definition: 'Whether someone else can rent from you during the lease' },
    ] },
  { id: 'u14-l2-e2', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Lease red flags should trigger questions before a renter commits.',
    instruction: 'Sort each lease detail.',
    buckets: [{ id: 'normal', label: 'Review Normally' }, { id: 'redFlag', label: 'Ask Before Signing' }],
    items: [
      { id: 'dueDate', text: 'Rent due on the first of each month', bucketId: 'normal' },
      { id: 'blankFee', text: 'Large undefined administrative fee', bucketId: 'redFlag' },
      { id: 'repair', text: 'Unclear repair responsibility for appliances', bucketId: 'redFlag' },
      { id: 'quiet', text: 'Quiet hours listed in writing', bucketId: 'normal' },
      { id: 'autoRenew', text: 'Auto-renewal clause with short notice window', bucketId: 'redFlag' },
    ] },
  { id: 'u14-l2-e3', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'Verbal promises are weaker than written lease terms.',
    statement: 'If a landlord promises a repair before move-in, it is safest to get the promise in writing.',
    isTrue: true },
];

const u14l3: Exercise[] = [
  { id: 'u14-l3-e1', kind: 'calculator', competencyId: 'liquidity',
    rationale: 'Move-in costs often include rent, deposit, setup costs, and uncovered fees.',
    formulaKey: 'budgetSurplus',
    prompt: 'A renter has $2,400 saved. First month rent is $1,250, deposit is $1,250, and moving/setup costs are $350. Calculate the cash gap.',
    targetLabel: 'Cash after move-in',
    explanation: 'Cash after move-in = savings - required fixed costs - setup costs. A negative result is the gap.',
    inputs: [
      { id: 'income', label: 'Cash saved', value: 2400, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Rent and deposit', value: 2500, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'variable', label: 'Moving and setup', value: 350, min: 0, max: 3000, step: 50, prefix: '$' },
    ] },
  { id: 'u14-l3-e2', kind: 'scenarioDecision', competencyId: 'cashFlow',
    rationale: 'A cheaper rent can still be expensive if commuting and utilities are high.',
    story: 'One apartment is $150 cheaper, but it adds $210/month in commuting costs and has older utilities.',
    choices: [
      { id: 'a', text: 'Compare total monthly housing and transport cost', outcome: 'Correct. Rent is not the whole cost of living there.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Choose the lower rent automatically', outcome: 'The cheaper rent may lose once commute and utility costs are included.', isCorrect: false, score: 1 },
      { id: 'c', text: 'Ignore commute time because it is not a bill', outcome: 'Time has value, and longer commutes can create real money and stress costs.', isCorrect: false, score: 0 },
    ] },
  { id: 'u14-l3-e3', kind: 'fillBlank', competencyId: 'budgetDesign',
    rationale: 'Renters should budget from total housing cost, not just advertised rent.',
    template: 'Total housing cost includes rent, utilities, insurance, fees, move-in costs, and ___ costs.',
    blanks: ['commute'],
    wordBank: ['commute', 'celebrity', 'weather', 'logo'] },
];

const u14Practice: Exercise[] = [u14l1[1]!, u14l2[0]!, u14l2[1]!, u14l3[1]!];

const u14l4: Exercise[] = [
  { id: 'u14-l4-e1', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Roommate decisions mix money, responsibility, and conflict prevention.',
    story: 'Two friends want to share an apartment. One has steady income, the other has uneven freelance income and no emergency fund.',
    choices: [
      { id: 'a', text: 'Create written rules for rent shares, utilities, guests, chores, and exit plans', outcome: 'Correct. Clear agreements protect the friendship and the lease.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Assume friendship will solve every money issue', outcome: 'Friendship helps, but unclear money rules create avoidable conflict.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Put only one roommate on the lease without discussing risk', outcome: 'That can concentrate legal and payment risk on one person.', isCorrect: false, score: 1 },
    ] },
  { id: 'u14-l4-e2', kind: 'tapToOrder', competencyId: 'cashFlow',
    rationale: 'A move-in plan should secure cash, documents, inspection, and utilities before the lease starts.',
    instruction: 'Order a renter move-in checklist.',
    items: [
      { id: 's1', text: 'Confirm total move-in cash needed', rank: 1 },
      { id: 's2', text: 'Read lease and ask questions in writing', rank: 2 },
      { id: 's3', text: 'Inspect and photograph the unit before moving items in', rank: 3 },
      { id: 's4', text: 'Set up utilities, renters insurance, and autopay reminders', rank: 4 },
      { id: 's5', text: 'Keep copies of lease, photos, and payment receipts', rank: 5 },
    ] },
  { id: 'u14-l4-e3', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Some roommate costs should be split while personal choices should stay personal.',
    instruction: 'Sort each cost.',
    buckets: [{ id: 'shared', label: 'Shared Housing Cost' }, { id: 'personal', label: 'Personal Cost' }],
    items: [
      { id: 'internet', text: 'Internet used by everyone', bucketId: 'shared' },
      { id: 'rent', text: 'Monthly rent', bucketId: 'shared' },
      { id: 'snacks', text: 'One roommate personal snacks', bucketId: 'personal' },
      { id: 'decor', text: 'Bedroom decor', bucketId: 'personal' },
      { id: 'cleaning', text: 'Shared cleaning supplies', bucketId: 'shared' },
    ] },
];

const u14l5: Exercise[] = [
  { id: 'u14-l5-e1', kind: 'miniStory', competencyId: 'budgetDesign',
    rationale: 'The capstone integrates affordability, lease reading, move-in cash, and risk controls.',
    panels: [
      { text: 'Ava finds a better apartment with a written lease, lower commute, and a deposit she can cover after one more paycheck.', speaker: 'Narrator' },
      { text: 'She wants to avoid debt and protect her deposit.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What makes the move-in plan strong?',
    choices: [
      { id: 'a', text: 'She signs after confirming total monthly cost, written terms, move-in cash, inspection photos, and bill reminders', outcome: 'Correct. The best housing decision survives both signing day and month three.', isCorrect: true },
      { id: 'b', text: 'She signs quickly and figures out cash later', outcome: 'A lease turns uncertainty into legal obligation.', isCorrect: false },
    ] },
  { id: 'u14-l5-e2', kind: 'tapToOrder', competencyId: 'cashFlow',
    rationale: 'A good housing decision follows a sequence from affordability to documentation.',
    instruction: 'Order the housing decision flow.',
    items: [
      { id: 's1', text: 'Calculate total monthly cost', rank: 1 },
      { id: 's2', text: 'Confirm move-in cash and emergency buffer', rank: 2 },
      { id: 's3', text: 'Read lease terms and ask written questions', rank: 3 },
      { id: 's4', text: 'Inspect the unit and document condition', rank: 4 },
      { id: 's5', text: 'Set bill reminders and keep records', rank: 5 },
    ] },
  { id: 'u14-l5-e3', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'Learners should leave with a durable renter checklist.',
    prompt: 'What should you check before signing a lease?',
    conceptReveal: 'Check total monthly cost, move-in cash, lease term, fees, repair rules, roommate obligations, commute cost, inspection condition, and whether the lease still leaves room for savings.',
    checkpoints: ['Total cost','Move-in cash','Written terms','Inspection records'] },
];

// ─── Unit 15 - Transportation & Auto Money ───────────────────────────────────

const u15l1: Exercise[] = [
  { id: 'u15-l1-e1', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'Transportation decisions include ownership, financing, insurance, fuel, repairs, and time.',
    prompt: 'Why is the sticker price not the real cost of a car?',
    conceptReveal: 'A car creates monthly costs beyond price: loan payment, insurance, fuel, maintenance, parking, registration, repairs, depreciation, and commute time.',
    checkpoints: ['Payment is only one cost','Insurance and repairs matter','Commute time has value'] },
  { id: 'u15-l1-e2', kind: 'calculator', competencyId: 'cashFlow',
    rationale: 'Learners should test transportation against monthly take-home pay.',
    formulaKey: 'budgetSurplus',
    prompt: 'Jordan takes home $3,000. Car payment is $360, insurance is $150, and fuel/maintenance average $220. Calculate cash after transportation.',
    targetLabel: 'Cash after transportation',
    explanation: 'Cash after transportation = take-home pay - payment - insurance/fuel/maintenance.',
    inputs: [
      { id: 'income', label: 'Monthly take-home', value: 3000, min: 1000, max: 10000, step: 100, prefix: '$' },
      { id: 'fixed', label: 'Car payment', value: 360, min: 0, max: 1500, step: 25, prefix: '$' },
      { id: 'variable', label: 'Insurance and running costs', value: 370, min: 0, max: 2000, step: 25, prefix: '$' },
    ] },
  { id: 'u15-l1-e3', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Auto cost categories help learners budget recurring and surprise expenses.',
    instruction: 'Sort each transportation cost.',
    buckets: [{ id: 'fixed', label: 'Predictable' }, { id: 'variable', label: 'Variable Or Surprise' }],
    items: [
      { id: 'loan', text: 'Monthly auto loan payment', bucketId: 'fixed' },
      { id: 'premium', text: 'Monthly insurance premium', bucketId: 'fixed' },
      { id: 'tires', text: 'New tires', bucketId: 'variable' },
      { id: 'fuel', text: 'Fuel changes with driving', bucketId: 'variable' },
      { id: 'registration', text: 'Annual registration renewal', bucketId: 'variable' },
    ] },
];

const u15l2: Exercise[] = [
  { id: 'u15-l2-e1', kind: 'calculator', competencyId: 'debtMath',
    rationale: 'Auto loans should be compared by payment, APR, and term.',
    formulaKey: 'loanPayment',
    prompt: 'Estimate the payment on a $14,000 auto loan at 9% APR over 48 months.',
    targetLabel: 'Estimated monthly payment',
    explanation: 'Longer terms can lower payment but increase interest and time underwater.',
    inputs: [
      { id: 'principal', label: 'Loan amount', value: 14000, min: 1000, max: 60000, step: 500, prefix: '$' },
      { id: 'rate', label: 'APR', value: 9, min: 0, max: 30, step: 1, suffix: '%' },
      { id: 'months', label: 'Months', value: 48, min: 12, max: 84, step: 6 },
    ] },
  { id: 'u15-l2-e2', kind: 'multipleChoice', competencyId: 'debtMath',
    rationale: 'The lowest payment can hide a longer and more expensive loan.',
    prompt: 'Which auto loan question matters most besides the monthly payment?',
    options: [
      { id: 'a', text: 'APR, term length, fees, and total interest', isCorrect: true },
      { id: 'b', text: 'The color of the payment coupon', isCorrect: false },
      { id: 'c', text: 'Whether the dealer sounds confident', isCorrect: false },
      { id: 'd', text: 'Only the first month payment', isCorrect: false },
    ] },
  { id: 'u15-l2-e3', kind: 'scenarioDecision', competencyId: 'debtMath',
    rationale: 'Buyers should compare financing before entering a dealership pressure environment.',
    story: 'Jordan is offered a lower monthly payment by stretching the car loan from 48 to 72 months.',
    choices: [
      { id: 'a', text: 'Compare total interest, vehicle reliability, and resale risk before accepting', outcome: 'Correct. A smaller payment can cost more and keep the loan around longer.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Accept automatically because lower monthly payment is always better', outcome: 'Lower payment can be a trap if it extends the loan too far.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore APR if the car looks reliable', outcome: 'Reliability matters, but financing cost still matters.', isCorrect: false, score: 1 },
    ] },
];

const u15l3: Exercise[] = [
  { id: 'u15-l3-e1', kind: 'matchPairs', competencyId: 'debtMath',
    rationale: 'Lease, buy, and finance terms create different obligations.',
    instruction: 'Match each auto term.',
    pairs: [
      { id: 'lease', term: 'Lease', definition: 'Pay to use a car for a term with mileage and condition rules' },
      { id: 'finance', term: 'Finance', definition: 'Borrow to buy the car and repay over time' },
      { id: 'down', term: 'Down payment', definition: 'Cash paid upfront to reduce the amount financed' },
      { id: 'equity', term: 'Equity', definition: 'Vehicle value minus loan balance' },
    ] },
  { id: 'u15-l3-e2', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Lease versus buy depends on mileage, cash flow, flexibility, and long-term use.',
    story: 'Maya drives 22,000 miles/year for school and work. A low lease payment looks attractive, but the lease has mileage penalties.',
    choices: [
      { id: 'a', text: 'Check mileage limits and penalties before comparing the lease to buying', outcome: 'Correct. A low lease payment can become expensive for high-mileage drivers.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Choose the lease because the monthly payment is lower', outcome: 'The mileage penalty could erase the payment advantage.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore mileage because penalties happen later', outcome: 'Future penalties are still part of the decision.', isCorrect: false, score: 1 },
    ] },
  { id: 'u15-l3-e3', kind: 'trueFalse', competencyId: 'debtMath',
    rationale: 'A loan balance can exceed vehicle value early in a loan.',
    statement: 'A car can be worth less than the loan balance even when every payment is on time.',
    isTrue: true },
];

const u15Practice: Exercise[] = [u15l1[1]!, u15l2[0]!, u15l3[1]!, u15l1[2]!];

const u15l4: Exercise[] = [
  { id: 'u15-l4-e1', kind: 'calculator', competencyId: 'insuranceRisk',
    rationale: 'Drivers need cash for deductibles and uncovered repairs.',
    formulaKey: 'deductibleReserve',
    prompt: 'A driver has a $750 deductible, expects $300 in uncovered repair costs, and has $400 saved. Calculate the reserve gap.',
    targetLabel: 'Auto reserve gap',
    explanation: 'Reserve gap = deductible + uncovered costs - cash on hand.',
    inputs: [
      { id: 'deductible', label: 'Deductible', value: 750, min: 0, max: 3000, step: 50, prefix: '$' },
      { id: 'uncovered', label: 'Uncovered repairs', value: 300, min: 0, max: 3000, step: 50, prefix: '$' },
      { id: 'cashOnHand', label: 'Cash saved', value: 400, min: 0, max: 3000, step: 50, prefix: '$' },
    ] },
  { id: 'u15-l4-e2', kind: 'tapToOrder', competencyId: 'insuranceRisk',
    rationale: 'A maintenance plan lowers the chance of surprise costs becoming emergencies.',
    instruction: 'Order a basic car cost plan.',
    items: [
      { id: 's1', text: 'Price insurance before buying', rank: 1 },
      { id: 's2', text: 'Estimate fuel, parking, registration, and maintenance', rank: 2 },
      { id: 's3', text: 'Keep deductible and repair cash separate', rank: 3 },
      { id: 's4', text: 'Follow maintenance schedule', rank: 4 },
      { id: 's5', text: 'Review total monthly cost every quarter', rank: 5 },
    ] },
  { id: 'u15-l4-e3', kind: 'categorize', competencyId: 'insuranceRisk',
    rationale: 'Some auto protections reduce major risk while others are optional add-ons.',
    instruction: 'Sort each protection.',
    buckets: [{ id: 'core', label: 'Core Risk Protection' }, { id: 'optional', label: 'Optional Add-On' }],
    items: [
      { id: 'liability', text: 'Liability coverage required by law', bucketId: 'core' },
      { id: 'collision', text: 'Collision coverage on a car you cannot replace with cash', bucketId: 'core' },
      { id: 'decor', text: 'Cosmetic accessory plan', bucketId: 'optional' },
      { id: 'gap', text: 'Gap coverage when loan balance exceeds car value', bucketId: 'core' },
      { id: 'paint', text: 'Paint protection upsell', bucketId: 'optional' },
    ] },
];

const u15l5: Exercise[] = [
  { id: 'u15-l5-e1', kind: 'miniStory', competencyId: 'budgetDesign',
    rationale: 'The capstone integrates loan math, insurance, repairs, and commute tradeoffs.',
    panels: [
      { text: 'Jordan can buy a reliable used car, finance a newer car, or keep taking rideshare and the bus.', speaker: 'Narrator' },
      { text: 'The newer car looks best, but the total monthly cost would crowd out savings.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What is the strongest transportation decision?',
    choices: [
      { id: 'a', text: 'Choose the option with reliable transportation and total cost that still leaves savings room', outcome: 'Correct. Transportation should improve life without breaking the budget.', isCorrect: true },
      { id: 'b', text: 'Choose the newest car because a newer car always means better money outcome', outcome: 'Newer can still be unaffordable or depreciate faster than expected.', isCorrect: false },
    ] },
  { id: 'u15-l5-e2', kind: 'calculator', competencyId: 'budgetDesign',
    rationale: 'Commute costs add up when repeated many days per year.',
    formulaKey: 'annualCost',
    prompt: 'A commute costs $9/day for parking and extra fuel, 220 days/year. Calculate the annual commute cost.',
    targetLabel: 'Annual commute cost',
    explanation: 'Annual cost = daily cost x days x years.',
    inputs: [
      { id: 'daily', label: 'Daily commute cost', value: 9, min: 0, max: 100, step: 1, prefix: '$' },
      { id: 'days', label: 'Days per year', value: 220, min: 0, max: 365, step: 5 },
      { id: 'years', label: 'Years', value: 1, min: 1, max: 10, step: 1 },
    ] },
  { id: 'u15-l5-e3', kind: 'recallPrompt', competencyId: 'budgetDesign',
    rationale: 'Learners should leave with a total-cost transportation framework.',
    prompt: 'What should you include in total transportation cost?',
    conceptReveal: 'Include payment, APR, term, insurance, fuel, maintenance, parking, registration, repairs, depreciation, commute time, and emergency reserves.',
    checkpoints: ['Payment and APR','Insurance and fuel','Repairs and maintenance','Commute time'] },
];

// ─── Unit 16 - Retirement & Long-Term Wealth ─────────────────────────────────

const u16l1: Exercise[] = [
  { id: 'u16-l1-e1', kind: 'scenarioDecision', competencyId: 'retirementPlanning',
    rationale: 'Employer match is often the highest-priority retirement starting point.',
    story: 'Nora earns $48,000 and her employer matches 50% of contributions up to 6% of pay. She is deciding whether to contribute.',
    choices: [
      { id: 'a', text: 'Contribute enough to capture the full match if cash flow allows', outcome: 'Correct. The match is part of total compensation and can accelerate long-term wealth.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Skip the match because retirement is far away', outcome: 'Time is exactly why early contributions matter.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Contribute only after lifestyle upgrades are complete', outcome: 'Waiting can make the habit harder and lose years of compounding.', isCorrect: false, score: 1 },
    ] },
  { id: 'u16-l1-e2', kind: 'multipleChoice', competencyId: 'retirementPlanning',
    rationale: 'An employer match is additional compensation tied to retirement contributions.',
    prompt: 'What is an employer match?',
    options: [
      { id: 'a', text: 'Money an employer adds when you contribute under plan rules', isCorrect: true },
      { id: 'b', text: 'A fee charged for saving', isCorrect: false },
      { id: 'c', text: 'A loan you must always repay', isCorrect: false },
      { id: 'd', text: 'A guarantee that investments cannot fall', isCorrect: false },
    ] },
  { id: 'u16-l1-e3', kind: 'fillBlank', competencyId: 'retirementPlanning',
    rationale: 'The basic retirement loop starts with income, contribution, match, and invested growth.',
    template: 'A workplace retirement plan grows through your contributions, possible employer ___, and invested compounding.',
    blanks: ['match'],
    wordBank: ['match', 'rent', 'coupon', 'shortcut'] },
];

const u16l2: Exercise[] = [
  { id: 'u16-l2-e1', kind: 'matchPairs', competencyId: 'retirementPlanning',
    rationale: 'Learners should know common retirement account roles.',
    instruction: 'Match each retirement term.',
    pairs: [
      { id: 'traditional', term: 'Traditional 401k', definition: 'Often pre-tax contributions with taxes paid later on withdrawals' },
      { id: 'roth', term: 'Roth IRA', definition: 'After-tax contributions with qualified withdrawals tax-free' },
      { id: 'vesting', term: 'Vesting', definition: 'When employer contributions become fully yours' },
      { id: 'rollover', term: 'Rollover', definition: 'Moving retirement money between eligible accounts' },
    ] },
  { id: 'u16-l2-e2', kind: 'categorize', competencyId: 'taxPlanning',
    rationale: 'Tax treatment differs between account types.',
    instruction: 'Sort each account feature.',
    buckets: [{ id: 'preTax', label: 'Pre-Tax Style' }, { id: 'rothStyle', label: 'Roth Style' }],
    items: [
      { id: 'taxLater', text: 'Taxes generally paid when money is withdrawn', bucketId: 'preTax' },
      { id: 'afterTax', text: 'Contributions made with after-tax money', bucketId: 'rothStyle' },
      { id: 'lowersIncome', text: 'Can reduce taxable income today', bucketId: 'preTax' },
      { id: 'qualifiedFree', text: 'Qualified withdrawals can be tax-free', bucketId: 'rothStyle' },
    ] },
  { id: 'u16-l2-e3', kind: 'trueFalse', competencyId: 'retirementPlanning',
    rationale: 'Vesting affects employer match ownership.',
    statement: 'Vesting rules can affect how much employer match you keep if you leave a job early.',
    isTrue: true },
];

const u16l3: Exercise[] = [
  { id: 'u16-l3-e1', kind: 'calculator', competencyId: 'retirementPlanning',
    rationale: 'Compound growth makes small early retirement contributions tangible.',
    formulaKey: 'compoundGrowth',
    prompt: 'Start with $1,000, add $150/month, earn 7% for 30 years. Estimate the future value.',
    targetLabel: 'Future retirement value',
    explanation: 'This estimate compounds the starting amount and monthly contributions.',
    inputs: [
      { id: 'principal', label: 'Starting amount', value: 1000, min: 0, max: 50000, step: 500, prefix: '$' },
      { id: 'contribution', label: 'Monthly contribution', value: 150, min: 0, max: 2000, step: 25, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: 0, max: 12, step: 1, suffix: '%' },
      { id: 'years', label: 'Years', value: 30, min: 1, max: 45, step: 1 },
    ] },
  { id: 'u16-l3-e2', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Automation turns retirement saving into a default behavior.',
    story: 'Nora wants to invest for retirement but keeps spending whatever remains in checking.',
    choices: [
      { id: 'a', text: 'Automate payroll or monthly contributions before discretionary spending', outcome: 'Correct. Automation protects the habit from leftover-based budgeting.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Wait until she feels perfectly ready every month', outcome: 'Motivation is less reliable than an automated system.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Only invest during exciting market weeks', outcome: 'Excitement is not a retirement strategy.', isCorrect: false, score: 1 },
    ] },
  { id: 'u16-l3-e3', kind: 'multipleChoice', competencyId: 'retirementPlanning',
    rationale: 'Time is one of the strongest retirement advantages.',
    prompt: 'Why is starting early powerful?',
    options: [
      { id: 'a', text: 'More years for contributions and compounding to work', isCorrect: true },
      { id: 'b', text: 'Early investors never face market drops', isCorrect: false },
      { id: 'c', text: 'Retirement accounts have no rules', isCorrect: false },
      { id: 'd', text: 'Inflation stops after you open an account', isCorrect: false },
    ] },
];

const u16Practice: Exercise[] = [u16l1[0]!, u16l2[0]!, u16l3[0]!, u16l2[2]!];

const u16l4: Exercise[] = [
  { id: 'u16-l4-e1', kind: 'categorize', competencyId: 'portfolioConstruction',
    rationale: 'Long-term allocation should balance growth and stability.',
    instruction: 'Sort each investment role.',
    buckets: [{ id: 'growth', label: 'Growth Engine' }, { id: 'stability', label: 'Stability Tool' }],
    items: [
      { id: 'stocks', text: 'Broad stock index fund', bucketId: 'growth' },
      { id: 'bonds', text: 'High-quality bond fund', bucketId: 'stability' },
      { id: 'cash', text: 'Cash for near-term needs', bucketId: 'stability' },
      { id: 'global', text: 'Global stock diversification', bucketId: 'growth' },
    ] },
  { id: 'u16-l4-e2', kind: 'scenarioDecision', competencyId: 'riskReturn',
    rationale: 'Long horizons can usually absorb more volatility than short horizons.',
    story: 'A 24-year-old investor will not need retirement money for decades but panics during market drops.',
    choices: [
      { id: 'a', text: 'Choose a diversified allocation they can hold through volatility', outcome: 'Correct. The best allocation is not just mathematically strong; it must be behaviorally holdable.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Switch everything to cash after every market drop', outcome: 'Panic selling can lock in losses and miss recoveries.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Put everything into one hot stock', outcome: 'Concentration can overwhelm a retirement plan.', isCorrect: false, score: 0 },
    ] },
  { id: 'u16-l4-e3', kind: 'tapToOrder', competencyId: 'retirementPlanning',
    rationale: 'A retirement setup has a practical order.',
    instruction: 'Order a starter retirement setup.',
    items: [
      { id: 's1', text: 'Stabilize basic cash flow and emergency buffer', rank: 1 },
      { id: 's2', text: 'Capture available employer match', rank: 2 },
      { id: 's3', text: 'Choose diversified low-cost investments', rank: 3 },
      { id: 's4', text: 'Automate contributions and increases', rank: 4 },
      { id: 's5', text: 'Review allocation and beneficiaries yearly', rank: 5 },
    ] },
];

const u16l5: Exercise[] = [
  { id: 'u16-l5-e1', kind: 'miniStory', competencyId: 'retirementPlanning',
    rationale: 'The capstone combines match, account type, compounding, automation, and allocation.',
    panels: [
      { text: 'Nora has a small emergency fund, a workplace plan with match, and a goal to start investing without overcomplicating it.', speaker: 'Narrator' },
      { text: 'She wants a plan she can keep during busy months and market noise.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What plan fits best?',
    choices: [
      { id: 'a', text: 'Capture match, automate contributions, use diversified funds, and review yearly', outcome: 'Correct. Simple and repeatable beats complicated and abandoned.', isCorrect: true },
      { id: 'b', text: 'Wait until she can predict the perfect market entry day', outcome: 'Perfect timing is not a reliable retirement system.', isCorrect: false },
    ] },
  { id: 'u16-l5-e2', kind: 'tapToOrder', competencyId: 'retirementPlanning',
    rationale: 'Long-term wealth planning should prioritize habits and risk fit.',
    instruction: 'Order a long-term wealth plan.',
    items: [
      { id: 's1', text: 'Protect short-term cash needs', rank: 1 },
      { id: 's2', text: 'Use tax-advantaged accounts available to you', rank: 2 },
      { id: 's3', text: 'Invest in diversified low-cost funds', rank: 3 },
      { id: 's4', text: 'Increase contributions with income growth', rank: 4 },
      { id: 's5', text: 'Avoid panic moves during market cycles', rank: 5 },
    ] },
  { id: 'u16-l5-e3', kind: 'recallPrompt', competencyId: 'retirementPlanning',
    rationale: 'Learners should remember a compact retirement operating system.',
    prompt: 'What are the core moves of a starter retirement plan?',
    conceptReveal: 'Build basic stability, capture match, automate contributions, use diversified low-cost investments, understand tax treatment, and review allocation over time.',
    checkpoints: ['Cash stability','Employer match','Automation','Diversified allocation'] },
];

// ─── Unit 17 - Investor Psychology & Market Cycles ───────────────────────────

const u17l1: Exercise[] = [
  { id: 'u17-l1-e1', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'Volatility feels personal, but long-term investors need a plan before it happens.',
    panels: [
      { text: 'Rae invests every month in a diversified portfolio. After bad headlines, the account is down 14%.', speaker: 'Narrator' },
      { text: 'Rae wants to sell everything and wait until the news feels better.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Rae do first?',
    choices: [
      { id: 'a', text: 'Review the time horizon, allocation, and written plan before reacting', outcome: 'Correct. A plan made before panic is more reliable than fear during a drop.', isCorrect: true },
      { id: 'b', text: 'Sell everything because a drop means the plan failed', outcome: 'A diversified portfolio can drop without the long-term plan failing.', isCorrect: false },
    ] },
  { id: 'u17-l1-e2', kind: 'trueFalse', competencyId: 'riskReturn',
    rationale: 'Temporary losses are normal in risky assets.',
    statement: 'A long-term stock investor should expect occasional market drops.',
    isTrue: true },
  { id: 'u17-l1-e3', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Selling during fear can convert temporary volatility into permanent loss.',
    story: 'Rae needs none of the invested money for 20 years, owns broad funds, and has an emergency fund.',
    choices: [
      { id: 'a', text: 'Stay aligned with the written plan unless goals or risk tolerance truly changed', outcome: 'Correct. Long-term money should not be managed by headlines alone.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Sell because every downturn continues forever', outcome: 'Downturns can be severe, but they do not all continue forever.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Borrow money to double down emotionally', outcome: 'Leverage can turn stress into forced selling.', isCorrect: false, score: 0 },
    ] },
];

const u17l2: Exercise[] = [
  { id: 'u17-l2-e1', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'Dollar-cost averaging is a repeatable habit, not a market prediction tool.',
    instruction: 'Order a dollar-cost averaging setup.',
    items: [
      { id: 's1', text: 'Choose an amount that fits monthly cash flow', rank: 1 },
      { id: 's2', text: 'Choose diversified investments', rank: 2 },
      { id: 's3', text: 'Automate purchases on a schedule', rank: 3 },
      { id: 's4', text: 'Keep emergency money separate', rank: 4 },
      { id: 's5', text: 'Review plan periodically, not daily', rank: 5 },
    ] },
  { id: 'u17-l2-e2', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'DCA helps behavior by reducing timing pressure.',
    story: 'A new investor has $1,200 to invest but is nervous about buying right before a drop.',
    choices: [
      { id: 'a', text: 'Invest on a schedule that they can stick with', outcome: 'Correct. A schedule can reduce timing anxiety and build the habit.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Wait for a perfect signal from social media', outcome: 'Social media is not a reliable timing system.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Put the whole amount into the asset with the loudest hype', outcome: 'Hype is not diversification or a plan.', isCorrect: false, score: 0 },
    ] },
  { id: 'u17-l2-e3', kind: 'fillBlank', competencyId: 'behavior',
    rationale: 'DCA works by creating consistent behavior.',
    template: 'Dollar-cost averaging means investing a set amount on a set ___ instead of trying to time every move.',
    blanks: ['schedule'],
    wordBank: ['schedule', 'rumor', 'mood', 'headline'] },
];

const u17l3: Exercise[] = [
  { id: 'u17-l3-e1', kind: 'calculator', competencyId: 'portfolioConstruction',
    rationale: 'Portfolio return depends on asset weights and expected returns.',
    formulaKey: 'portfolioReturn',
    prompt: 'Estimate expected annual return for 70% stocks at 8% and 30% bonds at 3%.',
    targetLabel: 'Expected annual return',
    explanation: 'Expected return = stock weight x stock return + bond weight x bond return.',
    inputs: [
      { id: 'stocksWeight', label: 'Stock weight', value: 70, min: 0, max: 100, step: 5, suffix: '%' },
      { id: 'stockReturn', label: 'Stock return', value: 8, min: -20, max: 20, step: 1, suffix: '%' },
      { id: 'bondReturn', label: 'Bond return', value: 3, min: -10, max: 15, step: 1, suffix: '%' },
    ] },
  { id: 'u17-l3-e2', kind: 'tapToOrder', competencyId: 'portfolioConstruction',
    rationale: 'Rebalancing follows a disciplined sequence.',
    instruction: 'Order a rebalancing check.',
    items: [
      { id: 's1', text: 'Know the target allocation', rank: 1 },
      { id: 's2', text: 'Measure current allocation', rank: 2 },
      { id: 's3', text: 'Check if drift exceeds the chosen threshold', rank: 3 },
      { id: 's4', text: 'Use new contributions or trades to move back toward target', rank: 4 },
      { id: 's5', text: 'Record the reason and avoid emotional overtrading', rank: 5 },
    ] },
  { id: 'u17-l3-e3', kind: 'multipleChoice', competencyId: 'portfolioConstruction',
    rationale: 'Rebalancing is about risk control, not performance chasing.',
    prompt: 'What is the main goal of rebalancing?',
    options: [
      { id: 'a', text: 'Keep portfolio risk close to the target plan', isCorrect: true },
      { id: 'b', text: 'Guarantee a profit every month', isCorrect: false },
      { id: 'c', text: 'Buy whatever went up the most', isCorrect: false },
      { id: 'd', text: 'Avoid ever seeing a loss', isCorrect: false },
    ] },
];

const u17Practice: Exercise[] = [u17l1[2]!, u17l2[0]!, u17l3[0]!, u17l3[2]!];

const u17l4: Exercise[] = [
  { id: 'u17-l4-e1', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Investors should distinguish useful signals from bubble behavior.',
    instruction: 'Sort each market signal.',
    buckets: [{ id: 'discipline', label: 'Disciplined Signal' }, { id: 'fomo', label: 'FOMO Signal' }],
    items: [
      { id: 'valuation', text: 'Comparing price to fundamentals', bucketId: 'discipline' },
      { id: 'everyone', text: 'Everyone online says it cannot lose', bucketId: 'fomo' },
      { id: 'allocation', text: 'Checking position size before buying', bucketId: 'discipline' },
      { id: 'borrow', text: 'Borrowing to buy after a huge run-up', bucketId: 'fomo' },
      { id: 'plan', text: 'Writing why the investment fits your plan', bucketId: 'discipline' },
    ] },
  { id: 'u17-l4-e2', kind: 'scenarioDecision', competencyId: 'riskReturn',
    rationale: 'FOMO often appears after prices already moved.',
    story: 'A token is up 300% in a month. Friends say Rae is missing the next big thing.',
    choices: [
      { id: 'a', text: 'Check thesis, risk, position size, and whether it fits the plan', outcome: 'Correct. Excitement is a prompt to slow down, not skip analysis.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Put emergency savings into it immediately', outcome: 'Emergency savings should not be risk capital.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Buy only because friends are talking about it', outcome: 'Social proof can be strongest near dangerous prices.', isCorrect: false, score: 0 },
    ] },
  { id: 'u17-l4-e3', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Behavioral bias vocabulary helps learners notice their own mistakes.',
    instruction: 'Match each investor bias.',
    pairs: [
      { id: 'loss', term: 'Loss aversion', definition: 'Losses feel more painful than equivalent gains feel good' },
      { id: 'recency', term: 'Recency bias', definition: 'Expecting the recent past to continue' },
      { id: 'herd', term: 'Herding', definition: 'Following a crowd instead of a plan' },
      { id: 'overconfidence', term: 'Overconfidence', definition: 'Believing skill is higher than evidence supports' },
    ] },
];

const u17l5: Exercise[] = [
  { id: 'u17-l5-e1', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'The capstone turns market psychology into a written crisis plan.',
    panels: [
      { text: 'Rae writes rules before the next downturn: what money is long term, what allocation is acceptable, and when to rebalance.', speaker: 'Narrator' },
      { text: 'The goal is to make panic less powerful when prices move fast.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What belongs in Rae\'s crisis plan?',
    choices: [
      { id: 'a', text: 'Time horizon, emergency cash, target allocation, rebalancing rules, and no-panic triggers', outcome: 'Correct. Clear rules reduce decision pressure during volatility.', isCorrect: true },
      { id: 'b', text: 'A promise to sell everything after the first scary headline', outcome: 'That makes headlines the strategy.', isCorrect: false },
    ] },
  { id: 'u17-l5-e2', kind: 'tapToOrder', competencyId: 'portfolioConstruction',
    rationale: 'A market-stress review should separate needs, plan, allocation, and actions.',
    instruction: 'Order a market-stress review.',
    items: [
      { id: 's1', text: 'Confirm no near-term cash need is invested', rank: 1 },
      { id: 's2', text: 'Review original goal and time horizon', rank: 2 },
      { id: 's3', text: 'Check whether allocation still fits risk tolerance', rank: 3 },
      { id: 's4', text: 'Rebalance only if rules call for it', rank: 4 },
      { id: 's5', text: 'Document the decision and stop doom-scrolling', rank: 5 },
    ] },
  { id: 'u17-l5-e3', kind: 'recallPrompt', competencyId: 'behavior',
    rationale: 'Learners should leave with a written investor behavior rule.',
    prompt: 'What should you decide before the market drops?',
    conceptReveal: 'Decide your time horizon, emergency cash boundary, target allocation, contribution schedule, rebalancing rules, and what would actually justify changing the plan.',
    checkpoints: ['Time horizon','Cash boundary','Target allocation','Rebalancing rule'] },
];

// ─── Unit 18 - Product Strategy & MVP Iteration ──────────────────────────────

const u18l1: Exercise[] = [
  { id: 'u18-l1-e1', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'Good product strategy starts with customer evidence, not feature preference.',
    prompt: 'What should a founder learn before building more product features?',
    conceptReveal: 'The founder should learn who has the pain, how often it happens, what customers do now, what the current workaround costs, and what proof would make them switch.',
    checkpoints: ['Customer pain','Current workaround','Switching reason','Proof needed'] },
  { id: 'u18-l1-e2', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Interview terms help learners gather useful evidence.',
    instruction: 'Match each discovery term.',
    pairs: [
      { id: 'pain', term: 'Pain point', definition: 'A costly or frustrating customer problem' },
      { id: 'workaround', term: 'Workaround', definition: 'How the customer solves it today' },
      { id: 'trigger', term: 'Trigger', definition: 'When the problem becomes urgent' },
      { id: 'switch', term: 'Switching cost', definition: 'Effort or risk of changing to a new solution' },
    ] },
  { id: 'u18-l1-e3', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Interview questions should uncover behavior, not invite compliments.',
    story: 'A founder asks, "Would you use my app?" Everyone says maybe, but nobody signs up.',
    choices: [
      { id: 'a', text: 'Ask about recent behavior, current workaround, cost, and willingness to commit', outcome: 'Correct. Past behavior and commitment are stronger than polite opinions.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Count every compliment as a sale', outcome: 'Compliments are weak evidence without action.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Stop talking to customers forever', outcome: 'The problem is the question quality, not customer discovery itself.', isCorrect: false, score: 1 },
    ] },
];

const u18l2: Exercise[] = [
  { id: 'u18-l2-e1', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Prioritization separates must-have learning from nice-to-have polish.',
    instruction: 'Sort each product idea.',
    buckets: [{ id: 'must', label: 'Test Critical Risk' }, { id: 'later', label: 'Later Polish' }],
    items: [
      { id: 'payment', text: 'Can customers complete paid checkout?', bucketId: 'must' },
      { id: 'color', text: 'Add twelve theme colors', bucketId: 'later' },
      { id: 'core', text: 'Does the core workflow solve the painful problem?', bucketId: 'must' },
      { id: 'animation', text: 'Add celebratory animation', bucketId: 'later' },
      { id: 'retention', text: 'Do users come back after the first use?', bucketId: 'must' },
    ] },
  { id: 'u18-l2-e2', kind: 'tapToOrder', competencyId: 'financialAnalysis',
    rationale: 'A product roadmap should start from riskiest assumption and evidence.',
    instruction: 'Order a feature prioritization process.',
    items: [
      { id: 's1', text: 'Name the riskiest assumption', rank: 1 },
      { id: 's2', text: 'Choose the smallest test that can prove or disprove it', rank: 2 },
      { id: 's3', text: 'Define success before building', rank: 3 },
      { id: 's4', text: 'Ship the test to real users', rank: 4 },
      { id: 's5', text: 'Use evidence to keep, change, or stop', rank: 5 },
    ] },
  { id: 'u18-l2-e3', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'The highest-impact feature is the one that unlocks evidence or value.',
    story: 'A marketplace has traffic but few completed bookings. The founder wants to add a profile badge system.',
    choices: [
      { id: 'a', text: 'Investigate booking friction before adding badges', outcome: 'Correct. The bottleneck is completed bookings, so solve that first.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Build badges because they sound fun', outcome: 'Fun polish is weak if the core transaction is broken.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Buy more traffic immediately', outcome: 'More traffic can amplify the broken booking funnel.', isCorrect: false, score: 1 },
    ] },
];

const u18l3: Exercise[] = [
  { id: 'u18-l3-e1', kind: 'miniStory', competencyId: 'businessFinance',
    rationale: 'MVP iteration should test one risky assumption at a time.',
    panels: [
      { text: 'Lina built a simple scheduling MVP for local tutors. Tutors sign up, but parents abandon before booking.', speaker: 'Narrator' },
      { text: 'She can redesign everything or run a smaller experiment on the booking step.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should Lina test next?',
    choices: [
      { id: 'a', text: 'A small booking-flow experiment with a clear conversion metric', outcome: 'Correct. Focus the test on the visible bottleneck.', isCorrect: true },
      { id: 'b', text: 'A full rebuild without learning why parents abandon', outcome: 'A rebuild can waste time if the real blocker is unclear.', isCorrect: false },
    ] },
  { id: 'u18-l3-e2', kind: 'tapToOrder', competencyId: 'financialAnalysis',
    rationale: 'Experiment design should move from hypothesis to metric to result.',
    instruction: 'Order an MVP experiment.',
    items: [
      { id: 's1', text: 'Write the hypothesis', rank: 1 },
      { id: 's2', text: 'Choose one user segment and one change', rank: 2 },
      { id: 's3', text: 'Define the success metric', rank: 3 },
      { id: 's4', text: 'Run the test long enough for useful data', rank: 4 },
      { id: 's5', text: 'Decide keep, iterate, or stop', rank: 5 },
    ] },
  { id: 'u18-l3-e3', kind: 'trueFalse', competencyId: 'businessFinance',
    rationale: 'An MVP is not automatically low quality; it is focused learning.',
    statement: 'An MVP should be the smallest credible version that tests the riskiest assumption.',
    isTrue: true },
];

const u18Practice: Exercise[] = [u18l1[2]!, u18l2[0]!, u18l3[1]!, u18l3[2]!];

const u18l4: Exercise[] = [
  { id: 'u18-l4-e1', kind: 'matchPairs', competencyId: 'financialAnalysis',
    rationale: 'Product teams need retention vocabulary to diagnose repeat value.',
    instruction: 'Match each retention metric.',
    pairs: [
      { id: 'activation', term: 'Activation', definition: 'User reaches the first meaningful value moment' },
      { id: 'retention', term: 'Retention', definition: 'Users return after the first use' },
      { id: 'churn', term: 'Churn', definition: 'Users stop using or paying' },
      { id: 'cohort', term: 'Cohort', definition: 'Group of users tracked from the same start period' },
    ] },
  { id: 'u18-l4-e2', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Retention issues should be fixed before scaling acquisition.',
    story: 'Lina gets many first-time signups, but 80% never complete a second session.',
    choices: [
      { id: 'a', text: 'Study the drop-off and improve the repeat-use loop before scaling ads', outcome: 'Correct. Acquisition is expensive when users do not retain.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Ignore retention because signups are growing', outcome: 'Signup growth can hide a value problem.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Add unrelated features to look bigger', outcome: 'More features can distract from the core retention issue.', isCorrect: false, score: 1 },
    ] },
  { id: 'u18-l4-e3', kind: 'calculator', competencyId: 'financialAnalysis',
    rationale: 'Product experiments should still connect to unit economics.',
    formulaKey: 'profitMargin',
    prompt: 'A paid pilot earns $2,000, delivery costs $1,050, and tax reserve is $250. Calculate pilot margin.',
    targetLabel: 'Pilot margin',
    explanation: 'Margin = (revenue - costs - tax reserve) / revenue.',
    inputs: [
      { id: 'revenue', label: 'Pilot revenue', value: 2000, min: 0, max: 20000, step: 100, prefix: '$' },
      { id: 'costs', label: 'Delivery costs', value: 1050, min: 0, max: 10000, step: 50, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 250, min: 0, max: 5000, step: 25, prefix: '$' },
    ] },
];

const u18l5: Exercise[] = [
  { id: 'u18-l5-e1', kind: 'miniStory', competencyId: 'businessFinance',
    rationale: 'The capstone integrates discovery, prioritization, experiments, retention, and roadmap choices.',
    panels: [
      { text: 'Lina learns parents trust the tutors, but booking feels confusing and reminders are weak.', speaker: 'Narrator' },
      { text: 'She needs a roadmap for the next four weeks.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What roadmap is strongest?',
    choices: [
      { id: 'a', text: 'Fix booking clarity, add reminders, measure completion and repeat sessions, then decide next features', outcome: 'Correct. The roadmap follows evidence and the retention loop.', isCorrect: true },
      { id: 'b', text: 'Build unrelated features because competitors have them', outcome: 'Competitor copying can ignore the product actual bottleneck.', isCorrect: false },
    ] },
  { id: 'u18-l5-e2', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Roadmap decisions should separate evidence-backed work from distractions.',
    instruction: 'Sort each roadmap item.',
    buckets: [{ id: 'evidence', label: 'Evidence-Backed' }, { id: 'distraction', label: 'Distraction' }],
    items: [
      { id: 'booking', text: 'Simplify the booking step where parents drop off', bucketId: 'evidence' },
      { id: 'reminder', text: 'Add session reminders after users ask for them', bucketId: 'evidence' },
      { id: 'random', text: 'Build a social feed nobody requested', bucketId: 'distraction' },
      { id: 'logo', text: 'Spend the sprint debating logo colors', bucketId: 'distraction' },
      { id: 'cohort', text: 'Track repeat sessions by signup week', bucketId: 'evidence' },
    ] },
  { id: 'u18-l5-e3', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'Learners should leave with a product iteration loop.',
    prompt: 'What is the product iteration loop?',
    conceptReveal: 'Interview customers, find the riskiest assumption, build the smallest credible test, measure behavior, improve the bottleneck, and repeat until value and retention are real.',
    checkpoints: ['Customer evidence','Riskiest assumption','Small test','Behavior data','Retention loop'] },
];

// ─── Unit 19 - Business Legal, Tax & Ownership Basics ────────────────────────

const u19l1: Exercise[] = [
  { id: 'u19-l1-e1', kind: 'matchPairs', competencyId: 'businessFinance',
    rationale: 'Founders need basic entity vocabulary without turning the lesson into legal advice.',
    instruction: 'Match each business structure idea.',
    pairs: [
      { id: 'sole', term: 'Sole proprietorship', definition: 'Simple default for one owner, often with personal liability exposure' },
      { id: 'llc', term: 'LLC', definition: 'Entity that can separate business and personal liability when operated correctly' },
      { id: 'corp', term: 'Corporation', definition: 'Entity often used for raising equity and issuing shares' },
      { id: 'ein', term: 'EIN', definition: 'Business tax identifier from the IRS' },
    ] },
  { id: 'u19-l1-e2', kind: 'scenarioDecision', competencyId: 'businessFinance',
    rationale: 'Entity choice depends on liability, taxes, partners, and funding plans.',
    story: 'Two friends start selling products together. They want to split ownership, open a business bank account, and avoid mixing personal and business money.',
    choices: [
      { id: 'a', text: 'Research entity, tax, banking, and ownership setup before revenue gets messy', outcome: 'Correct. Structure is easier before money and expectations are tangled.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Use one friend personal bank account forever', outcome: 'Mixing money makes taxes, trust, and liability harder.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Avoid written decisions because they are friends', outcome: 'Friendship is not a substitute for clear ownership terms.', isCorrect: false, score: 0 },
    ] },
  { id: 'u19-l1-e3', kind: 'trueFalse', competencyId: 'businessFinance',
    rationale: 'Entity formation is not enough if founders mix accounts and ignore formalities.',
    statement: 'Creating an entity does not mean you can ignore separate business records and bank accounts.',
    isTrue: true },
];

const u19l2: Exercise[] = [
  { id: 'u19-l2-e1', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Contracts should make expectations clear before work starts.',
    instruction: 'Order a simple client contract setup.',
    items: [
      { id: 's1', text: 'Define scope and deliverables', rank: 1 },
      { id: 's2', text: 'Set price, deposit, milestones, and due dates', rank: 2 },
      { id: 's3', text: 'Clarify revision limits and acceptance criteria', rank: 3 },
      { id: 's4', text: 'Name cancellation, late payment, and ownership terms', rank: 4 },
      { id: 's5', text: 'Get written agreement before starting work', rank: 5 },
    ] },
  { id: 'u19-l2-e2', kind: 'categorize', competencyId: 'businessFinance',
    rationale: 'Contracts reduce ambiguity when they cover the high-friction terms.',
    instruction: 'Sort each clause.',
    buckets: [{ id: 'useful', label: 'Useful Contract Term' }, { id: 'unclear', label: 'Too Vague' }],
    items: [
      { id: 'scope', text: 'Three logo concepts and two revision rounds', bucketId: 'useful' },
      { id: 'soon', text: 'Finish sometime soon', bucketId: 'unclear' },
      { id: 'deposit', text: '50% deposit due before work begins', bucketId: 'useful' },
      { id: 'nice', text: 'Client will be nice', bucketId: 'unclear' },
      { id: 'late', text: 'Late invoices pause delivery after 10 days', bucketId: 'useful' },
    ] },
  { id: 'u19-l2-e3', kind: 'scenarioDecision', competencyId: 'cashFlow',
    rationale: 'Deposits protect cash flow and filter low-commitment buyers.',
    story: 'A client wants a $4,000 project delivered in three weeks but refuses any deposit or written scope.',
    choices: [
      { id: 'a', text: 'Require written scope and deposit before reserving capacity', outcome: 'Correct. Clear terms protect time, cash, and expectations.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Start immediately and hope payment arrives later', outcome: 'Hope is a weak accounts receivable policy.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Make the project bigger without changing price', outcome: 'Scope creep without price control damages margin.', isCorrect: false, score: 0 },
    ] },
];

const u19l3: Exercise[] = [
  { id: 'u19-l3-e1', kind: 'scenarioDecision', competencyId: 'taxPlanning',
    rationale: 'Compliance depends on industry, location, taxes, and records.',
    story: 'A food business wants to sell at weekend markets. The founder has a recipe and an Instagram page but has not checked permits.',
    choices: [
      { id: 'a', text: 'Check local permits, food rules, sales tax, insurance, and recordkeeping before selling', outcome: 'Correct. Regulated products need compliance before launch day.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Sell first and ask questions only if someone complains', outcome: 'Compliance failures can create fines, shutdowns, or liability.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Assume social media approval is a business license', outcome: 'Audience interest does not replace legal requirements.', isCorrect: false, score: 0 },
    ] },
  { id: 'u19-l3-e2', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'A compliance habit is a repeatable checklist, not a one-time panic.',
    instruction: 'Order a basic compliance review.',
    items: [
      { id: 's1', text: 'Identify what you sell and where you sell it', rank: 1 },
      { id: 's2', text: 'Check permits, licenses, and insurance needs', rank: 2 },
      { id: 's3', text: 'Set up tax collection or reserve rules', rank: 3 },
      { id: 's4', text: 'Keep contracts, receipts, and filings organized', rank: 4 },
      { id: 's5', text: 'Review requirements when products or locations change', rank: 5 },
    ] },
  { id: 'u19-l3-e3', kind: 'multipleChoice', competencyId: 'taxPlanning',
    rationale: 'Sales tax and permits can depend on location and product.',
    prompt: 'Why should a business check local rules before selling?',
    options: [
      { id: 'a', text: 'Requirements can change by product, city, state, and sales channel', isCorrect: true },
      { id: 'b', text: 'Rules are always identical everywhere', isCorrect: false },
      { id: 'c', text: 'Permits only matter after the business is famous', isCorrect: false },
      { id: 'd', text: 'Taxes disappear for small businesses', isCorrect: false },
    ] },
];

const u19Practice: Exercise[] = [u19l1[0]!, u19l2[0]!, u19l3[0]!, u19l2[2]!];

const u19l4: Exercise[] = [
  { id: 'u19-l4-e1', kind: 'calculator', competencyId: 'businessFinance',
    rationale: 'Owner pay should come after operating costs and tax reserves.',
    formulaKey: 'budgetSurplus',
    prompt: 'A business brings in $7,000. Operating costs are $3,800 and tax reserve is $900. Calculate cash available before owner pay and reinvestment.',
    targetLabel: 'Cash before owner pay',
    explanation: 'Available cash = income - operating costs - tax reserve.',
    inputs: [
      { id: 'income', label: 'Business income', value: 7000, min: 0, max: 50000, step: 500, prefix: '$' },
      { id: 'fixed', label: 'Operating costs', value: 3800, min: 0, max: 30000, step: 250, prefix: '$' },
      { id: 'variable', label: 'Tax reserve', value: 900, min: 0, max: 10000, step: 100, prefix: '$' },
    ] },
  { id: 'u19-l4-e2', kind: 'scenarioDecision', competencyId: 'taxPlanning',
    rationale: 'Owner draws are not the same as after-tax personal income.',
    story: 'A founder transfers all business cash to personal checking after a strong month, then quarterly taxes and supplier invoices arrive.',
    choices: [
      { id: 'a', text: 'Use rules for tax reserve, operating buffer, owner pay, and reinvestment', outcome: 'Correct. Owner pay should not starve taxes or operations.', isCorrect: true, score: 3 },
      { id: 'b', text: 'Treat every dollar in the business account as spendable personal income', outcome: 'That can create tax and cash-flow problems.', isCorrect: false, score: 0 },
      { id: 'c', text: 'Ignore supplier invoices until next month', outcome: 'Late suppliers can damage operations and reputation.', isCorrect: false, score: 0 },
    ] },
  { id: 'u19-l4-e3', kind: 'categorize', competencyId: 'cashFlow',
    rationale: 'Separating business cash jobs makes founder finance clearer.',
    instruction: 'Sort each cash use.',
    buckets: [{ id: 'business', label: 'Business Reserve' }, { id: 'owner', label: 'Owner Pay' }],
    items: [
      { id: 'tax', text: 'Estimated tax reserve', bucketId: 'business' },
      { id: 'paycheck', text: 'Planned founder draw', bucketId: 'owner' },
      { id: 'supplier', text: 'Supplier invoice reserve', bucketId: 'business' },
      { id: 'rent', text: 'Personal rent paid from planned owner pay', bucketId: 'owner' },
      { id: 'buffer', text: 'Operating cash buffer', bucketId: 'business' },
    ] },
];

const u19l5: Exercise[] = [
  { id: 'u19-l5-e1', kind: 'miniStory', competencyId: 'businessFinance',
    rationale: 'The capstone integrates ownership splits, contracts, tax reserves, and compliance habits.',
    panels: [
      { text: 'Two cofounders are launching a paid product. One brings code, the other brings sales, and both expect the company to grow.', speaker: 'Narrator' },
      { text: 'They have not written ownership, roles, vesting, decision rules, or what happens if someone leaves.', speaker: 'Narrator' },
    ],
    choicePrompt: 'What should they do before launch?',
    choices: [
      { id: 'a', text: 'Document ownership, roles, vesting, decision rights, contracts, tax reserves, and compliance responsibilities', outcome: 'Correct. Clear rules prevent future ambiguity from becoming a company crisis.', isCorrect: true },
      { id: 'b', text: 'Avoid the conversation because it feels awkward', outcome: 'Avoiding hard conversations early makes later conflict more expensive.', isCorrect: false },
    ] },
  { id: 'u19-l5-e2', kind: 'tapToOrder', competencyId: 'businessFinance',
    rationale: 'Ownership setup should clarify contribution, equity, control, and exits.',
    instruction: 'Order a cofounder agreement discussion.',
    items: [
      { id: 's1', text: 'Define roles, expected contributions, and time commitment', rank: 1 },
      { id: 's2', text: 'Agree on ownership split and vesting', rank: 2 },
      { id: 's3', text: 'Set decision rights and spending approval rules', rank: 3 },
      { id: 's4', text: 'Plan what happens if someone leaves', rank: 4 },
      { id: 's5', text: 'Put the agreement in writing with qualified help when needed', rank: 5 },
    ] },
  { id: 'u19-l5-e3', kind: 'recallPrompt', competencyId: 'businessFinance',
    rationale: 'Learners should leave with a founder legal-finance checklist.',
    prompt: 'What legal and finance basics should a founder organize early?',
    conceptReveal: 'Organize entity choice, separate bank account, ownership terms, contracts, permits, insurance, tax reserves, records, owner pay rules, and compliance review habits.',
    checkpoints: ['Entity and banking','Ownership terms','Contracts and permits','Tax and records'] },
];

// ─── Extend duoLessons with units 2–19 ───────────────────────────────────────
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
  'u6-l1': makeLesson('u6-l1', 'Find A Real Problem', u6l1, 25, 'unit-business-6', 'entrepreneurship', 'Entrepreneurship Lab', ['businessFinance', 'behavior'], [
    'Identify a specific customer, painful problem, and proof of demand.',
    'Separate weak idea feedback from real customer commitment.',
  ]),
  'u6-l2': makeLesson('u6-l2', 'Business Model Basics', u6l2, 30, 'unit-business-6', 'entrepreneurship', 'Entrepreneurship Lab', ['businessFinance', 'cashFlow'], [
    'Explain revenue, fixed costs, variable costs, contribution profit, and margin.',
    'Use unit economics to judge whether growth is healthy.',
  ]),
  'u6-l3': {
    ...makeLesson('u6-l3', 'Pricing & Margins', u6l3, 35, 'unit-business-6', 'entrepreneurship', 'Entrepreneurship Lab', ['businessFinance', 'financialAnalysis'], [
      'Calculate the full cost stack before setting a price.',
      'Distinguish gross margin from net margin and avoid the hidden-cost trap.',
      'Apply value-based pricing to capture a fair share of the value you create.',
    ]),
    winStatement: 'You can now calculate your real margin stack, set a price floor you\'ll never discount below, and charge for the value you deliver — not just the hours you work.',
    lessonTeaser: 'You know your number. Next: How to validate that customers will actually pay it — the MVP test that costs $0.',
  },
  'u6-practice': makeLesson('u6-practice', 'Founder Drill', u6Practice, 15, 'unit-business-6', 'entrepreneurship', 'Entrepreneurship Lab', ['businessFinance']),
  'u6-l4': makeLesson('u6-l4', 'Validate With An MVP', u6l4, 25, 'unit-business-6', 'entrepreneurship', 'Entrepreneurship Lab', ['businessFinance', 'behavior'], [
    'Choose the smallest credible test for the riskiest business assumption.',
    'Measure behavior rather than compliments.',
  ]),
  'u6-l5': makeLesson('u6-l5', 'Runway & Reinvestment', u6l5, 35, 'unit-business-6', 'entrepreneurship', 'Entrepreneurship Lab', ['businessFinance', 'cashFlow'], [
    'Track cash runway, operating surplus, and reinvestment timing.',
    'Build a founder scorecard for survival and growth.',
  ]),
  'u7-l1': makeLesson('u7-l1', 'Sales Funnels', u7l1, 25, 'unit-business-7', 'entrepreneurship', 'Startup Growth & Finance', ['businessFinance', 'financialAnalysis'], [
    'Diagnose a sales funnel from attention through repeat purchase.',
    'Identify the highest-leverage bottleneck before buying more traffic.',
  ]),
  'u7-l2': makeLesson('u7-l2', 'CAC & LTV', u7l2, 30, 'unit-business-7', 'entrepreneurship', 'Startup Growth & Finance', ['financialAnalysis', 'businessFinance'], [
    'Compare customer acquisition cost with lifetime value and payback period.',
    'Separate healthy growth from cash-burning growth.',
  ]),
  'u7-l3': {
    ...makeLesson('u7-l3', 'Cash Flow Timing', u7l3, 30, 'unit-business-7', 'entrepreneurship', 'Startup Growth & Finance', ['cashFlow', 'businessFinance'], [
      'Explain how profitable businesses can still run out of cash.',
      'Identify a cash timing gap before it becomes a payroll crisis.',
      'Use deposits and payment terms to close a cash gap.',
    ]),
    winStatement: 'You can now tell the difference between profit and cash flow, and spot a cash gap before it empties your bank account.',
    lessonTeaser: 'You can see the gap. Next: How to plug it — funding tradeoffs and when to use debt vs. equity vs. bootstrapping.',
  },
  'u7-practice': makeLesson('u7-practice', 'Growth Drill', u7Practice, 15, 'unit-business-7', 'entrepreneurship', 'Startup Growth & Finance', ['financialAnalysis', 'businessFinance']),
  'u7-l4': makeLesson('u7-l4', 'Funding Tradeoffs', u7l4, 30, 'unit-business-7', 'entrepreneurship', 'Startup Growth & Finance', ['businessFinance', 'financialAnalysis'], [
    'Compare bootstrapping, debt, and equity based on risk, control, and cash flow.',
    'Choose capital that fits the business model instead of chasing prestige.',
  ]),
  'u7-l5': makeLesson('u7-l5', 'Scale The Loop', u7l5, 35, 'unit-business-7', 'entrepreneurship', 'Startup Growth & Finance', ['financialAnalysis', 'businessFinance'], [
    'Integrate funnel, CAC, LTV, margin, and runway before scaling.',
    'Build a founder dashboard for responsible growth.',
  ]),
  'u8-l1': makeLesson('u8-l1', 'Credit Reports', u8l1, 25, 'unit-credit-8', 'credit', 'Credit & Debt Strategy', ['creditScore'], [
    'Explain what lenders look for in a credit report.',
    'Identify the habits that build or damage credit.',
  ]),
  'u8-l2': makeLesson('u8-l2', 'Credit Score Levers', u8l2, 30, 'unit-credit-8', 'credit', 'Credit & Debt Strategy', ['creditScore'], [
    'Calculate utilization and choose actions that improve credit readiness.',
  ]),
  'u8-l3': {
    ...makeLesson('u8-l3', 'APR & Loan Payments', u8l3, 35, 'unit-credit-8', 'credit', 'Credit & Debt Strategy', ['debtMath'], [
      'Calculate total cost of a loan from monthly payment × term.',
      'Compare two loan offers by total cost, not monthly payment.',
      'Explain what APR means in plain language.',
    ]),
    winStatement: 'You can now calculate the true cost of any loan in 60 seconds and never get tricked by a low monthly payment.',
    lessonTeaser: 'You know what borrowing costs. Next: How your credit score sets that price — a 100-point improvement can save $3,000+ on the same loan.',
  },
  'u8-practice': makeLesson('u8-practice', 'Credit Drill', u8Practice, 15, 'unit-credit-8', 'credit', 'Credit & Debt Strategy', ['creditScore', 'debtMath']),
  'u8-l4': makeLesson('u8-l4', 'Debt Payoff Strategy', u8l4, 30, 'unit-credit-8', 'credit', 'Credit & Debt Strategy', ['debtMath'], [
    'Compare debt avalanche, snowball, and minimum payment protection.',
  ]),
  'u8-l5': makeLesson('u8-l5', 'Credit Ready', u8l5, 35, 'unit-credit-8', 'credit', 'Credit & Debt Strategy', ['creditScore', 'debtMath'], [
    'Prepare credit before an apartment, auto loan, or major application.',
  ]),
  'u9-l1': makeLesson('u9-l1', 'Paycheck Anatomy', u9l1, 25, 'unit-taxes-9', 'taxes', 'Taxes & Paychecks', ['taxPlanning', 'cashFlow']),
  'u9-l2': makeLesson('u9-l2', 'Withholding', u9l2, 30, 'unit-taxes-9', 'taxes', 'Taxes & Paychecks', ['taxPlanning']),
  'u9-l3': makeLesson('u9-l3', 'Deductions & Credits', u9l3, 25, 'unit-taxes-9', 'taxes', 'Taxes & Paychecks', ['taxPlanning']),
  'u9-practice': makeLesson('u9-practice', 'Tax Drill', u9Practice, 15, 'unit-taxes-9', 'taxes', 'Taxes & Paychecks', ['taxPlanning']),
  'u9-l4': makeLesson('u9-l4', 'Gig Taxes', u9l4, 30, 'unit-taxes-9', 'taxes', 'Taxes & Paychecks', ['taxPlanning', 'businessFinance']),
  'u9-l5': makeLesson('u9-l5', 'Filing Plan', u9l5, 35, 'unit-taxes-9', 'taxes', 'Taxes & Paychecks', ['taxPlanning']),
  'u10-l1': makeLesson('u10-l1', 'Human Capital', u10l1, 25, 'unit-career-10', 'career', 'Career & Income Growth', ['incomeGrowth']),
  'u10-l2': makeLesson('u10-l2', 'Negotiate Pay', u10l2, 30, 'unit-career-10', 'career', 'Career & Income Growth', ['incomeGrowth']),
  'u10-l3': makeLesson('u10-l3', 'Benefits Math', u10l3, 30, 'unit-career-10', 'career', 'Career & Income Growth', ['incomeGrowth']),
  'u10-practice': makeLesson('u10-practice', 'Career Drill', u10Practice, 15, 'unit-career-10', 'career', 'Career & Income Growth', ['incomeGrowth']),
  'u10-l4': makeLesson('u10-l4', 'Side Income', u10l4, 30, 'unit-career-10', 'career', 'Career & Income Growth', ['incomeGrowth', 'businessFinance']),
  'u10-l5': makeLesson('u10-l5', 'Career Portfolio', u10l5, 35, 'unit-career-10', 'career', 'Career & Income Growth', ['incomeGrowth']),
  'u11-l1': {
    ...makeLesson('u11-l1', 'Reading Your First P&L', u11l1, 30, 'unit-business-11', 'entrepreneurship', 'Business Systems', ['businessFinance', 'financialAnalysis'], [
      'Identify the three main sections of a P&L statement.',
      'Calculate net income from revenue and expense line items.',
      'Explain why high revenue does not guarantee profit.',
    ]),
    winStatement: 'You can now read a P&L statement and tell whether a business made or lost money — and explain exactly why.',
    lessonTeaser: 'You read the score. Next: Bookkeeping habits that keep those numbers clean and decision-ready.',
  },
  'u11-l2': makeLesson('u11-l2', 'Inventory & Cash', u11l2, 30, 'unit-business-11', 'entrepreneurship', 'Business Systems', ['businessFinance', 'cashFlow']),
  'u11-l3': makeLesson('u11-l3', 'Retention Systems', u11l3, 30, 'unit-business-11', 'entrepreneurship', 'Business Systems', ['businessFinance']),
  'u11-practice': makeLesson('u11-practice', 'Operator Drill', u11Practice, 15, 'unit-business-11', 'entrepreneurship', 'Business Systems', ['businessFinance', 'financialAnalysis']),
  'u11-l4': makeLesson('u11-l4', 'Hiring & Delegation', u11l4, 30, 'unit-business-11', 'entrepreneurship', 'Business Systems', ['businessFinance']),
  'u11-l5': makeLesson('u11-l5', 'Operating Dashboard', u11l5, 35, 'unit-business-11', 'entrepreneurship', 'Business Systems', ['financialAnalysis', 'businessFinance']),
  'u12-l1': makeLesson('u12-l1', 'Why Insurance Exists', u12l1, 25, 'unit-insurance-12', 'insurance', 'Insurance & Risk', ['insuranceRisk', 'liquidity']),
  'u12-l2': makeLesson('u12-l2', 'Deductibles & Premiums', u12l2, 30, 'unit-insurance-12', 'insurance', 'Insurance & Risk', ['insuranceRisk', 'liquidity']),
  'u12-l3': makeLesson('u12-l3', 'Coverage Map', u12l3, 25, 'unit-insurance-12', 'insurance', 'Insurance & Risk', ['insuranceRisk']),
  'u12-practice': makeLesson('u12-practice', 'Risk Drill', u12Practice, 15, 'unit-insurance-12', 'insurance', 'Insurance & Risk', ['insuranceRisk']),
  'u12-l4': makeLesson('u12-l4', 'Claims & Coverage', u12l4, 30, 'unit-insurance-12', 'insurance', 'Insurance & Risk', ['insuranceRisk']),
  'u12-l5': makeLesson('u12-l5', 'Risk Plan', u12l5, 35, 'unit-insurance-12', 'insurance', 'Insurance & Risk', ['insuranceRisk', 'liquidity']),
  'u13-l1': makeLesson('u13-l1', 'Customer Segments', u13l1, 25, 'unit-business-13', 'entrepreneurship', 'Sales & Marketing Lab', ['businessFinance', 'behavior']),
  'u13-l2': makeLesson('u13-l2', 'Offers That Convert', u13l2, 30, 'unit-business-13', 'entrepreneurship', 'Sales & Marketing Lab', ['businessFinance']),
  'u13-l3': makeLesson('u13-l3', 'Marketing Experiments', u13l3, 30, 'unit-business-13', 'entrepreneurship', 'Sales & Marketing Lab', ['financialAnalysis', 'businessFinance']),
  'u13-practice': makeLesson('u13-practice', 'Sales Drill', u13Practice, 15, 'unit-business-13', 'entrepreneurship', 'Sales & Marketing Lab', ['businessFinance', 'financialAnalysis']),
  'u13-l4': makeLesson('u13-l4', 'Sales Pipeline', u13l4, 30, 'unit-business-13', 'entrepreneurship', 'Sales & Marketing Lab', ['businessFinance']),
  'u13-l5': makeLesson('u13-l5', 'Launch Campaign', u13l5, 35, 'unit-business-13', 'entrepreneurship', 'Sales & Marketing Lab', ['financialAnalysis', 'businessFinance']),
  'u14-l1': makeLesson('u14-l1', 'Rent Affordability', u14l1, 25, 'unit-housing-14', 'budgeting', 'Housing & Renting Decisions', ['budgetDesign', 'cashFlow']),
  'u14-l2': makeLesson('u14-l2', 'Read The Lease', u14l2, 30, 'unit-housing-14', 'budgeting', 'Housing & Renting Decisions', ['budgetDesign', 'behavior']),
  'u14-l3': makeLesson('u14-l3', 'Move-In Costs', u14l3, 30, 'unit-housing-14', 'budgeting', 'Housing & Renting Decisions', ['liquidity', 'cashFlow']),
  'u14-practice': makeLesson('u14-practice', 'Renter Drill', u14Practice, 15, 'unit-housing-14', 'budgeting', 'Housing & Renting Decisions', ['budgetDesign', 'cashFlow']),
  'u14-l4': makeLesson('u14-l4', 'Roommates & Rules', u14l4, 30, 'unit-housing-14', 'budgeting', 'Housing & Renting Decisions', ['behavior', 'cashFlow']),
  'u14-l5': makeLesson('u14-l5', 'Move-In Plan', u14l5, 35, 'unit-housing-14', 'budgeting', 'Housing & Renting Decisions', ['budgetDesign', 'cashFlow']),
  'u15-l1': makeLesson('u15-l1', 'Total Car Cost', u15l1, 25, 'unit-auto-15', 'debt', 'Transportation & Auto Money', ['budgetDesign', 'cashFlow']),
  'u15-l2': makeLesson('u15-l2', 'Auto Loan Math', u15l2, 30, 'unit-auto-15', 'debt', 'Transportation & Auto Money', ['debtMath']),
  'u15-l3': makeLesson('u15-l3', 'Lease Vs Buy', u15l3, 30, 'unit-auto-15', 'debt', 'Transportation & Auto Money', ['debtMath', 'behavior']),
  'u15-practice': makeLesson('u15-practice', 'Auto Drill', u15Practice, 15, 'unit-auto-15', 'debt', 'Transportation & Auto Money', ['debtMath', 'budgetDesign']),
  'u15-l4': makeLesson('u15-l4', 'Insurance & Repairs', u15l4, 30, 'unit-auto-15', 'debt', 'Transportation & Auto Money', ['insuranceRisk', 'cashFlow']),
  'u15-l5': makeLesson('u15-l5', 'Commute Tradeoffs', u15l5, 35, 'unit-auto-15', 'debt', 'Transportation & Auto Money', ['budgetDesign', 'cashFlow']),
  'u16-l1': makeLesson('u16-l1', 'Employer Match', u16l1, 25, 'unit-retirement-16', 'investing', 'Retirement & Long-Term Wealth', ['retirementPlanning']),
  'u16-l2': makeLesson('u16-l2', 'Retirement Accounts', u16l2, 30, 'unit-retirement-16', 'investing', 'Retirement & Long-Term Wealth', ['retirementPlanning', 'taxPlanning']),
  'u16-l3': makeLesson('u16-l3', 'Compounding Decades', u16l3, 30, 'unit-retirement-16', 'investing', 'Retirement & Long-Term Wealth', ['retirementPlanning', 'behavior']),
  'u16-practice': makeLesson('u16-practice', 'Retirement Drill', u16Practice, 15, 'unit-retirement-16', 'investing', 'Retirement & Long-Term Wealth', ['retirementPlanning']),
  'u16-l4': makeLesson('u16-l4', 'Long-Term Allocation', u16l4, 30, 'unit-retirement-16', 'investing', 'Retirement & Long-Term Wealth', ['portfolioConstruction', 'riskReturn']),
  'u16-l5': makeLesson('u16-l5', 'Wealth Plan', u16l5, 35, 'unit-retirement-16', 'investing', 'Retirement & Long-Term Wealth', ['retirementPlanning', 'portfolioConstruction']),
  'u17-l1': makeLesson('u17-l1', 'Volatility Mindset', u17l1, 25, 'unit-psychology-17', 'investing', 'Investor Psychology & Market Cycles', ['behavior', 'riskReturn']),
  'u17-l2': makeLesson('u17-l2', 'Dollar-Cost Averaging', u17l2, 30, 'unit-psychology-17', 'investing', 'Investor Psychology & Market Cycles', ['behavior']),
  'u17-l3': makeLesson('u17-l3', 'Rebalancing Rules', u17l3, 30, 'unit-psychology-17', 'investing', 'Investor Psychology & Market Cycles', ['portfolioConstruction']),
  'u17-practice': makeLesson('u17-practice', 'Investor Behavior Drill', u17Practice, 15, 'unit-psychology-17', 'investing', 'Investor Psychology & Market Cycles', ['behavior', 'portfolioConstruction']),
  'u17-l4': makeLesson('u17-l4', 'Bubbles & FOMO', u17l4, 30, 'unit-psychology-17', 'investing', 'Investor Psychology & Market Cycles', ['behavior', 'riskReturn']),
  'u17-l5': makeLesson('u17-l5', 'Crisis Plan', u17l5, 35, 'unit-psychology-17', 'investing', 'Investor Psychology & Market Cycles', ['behavior', 'portfolioConstruction']),
  'u18-l1': makeLesson('u18-l1', 'Customer Interviews', u18l1, 25, 'unit-product-18', 'entrepreneurship', 'Product Strategy & MVP Iteration', ['businessFinance', 'behavior']),
  'u18-l2': makeLesson('u18-l2', 'Prioritize The Risk', u18l2, 30, 'unit-product-18', 'entrepreneurship', 'Product Strategy & MVP Iteration', ['businessFinance', 'financialAnalysis']),
  'u18-l3': makeLesson('u18-l3', 'MVP Experiments', u18l3, 30, 'unit-product-18', 'entrepreneurship', 'Product Strategy & MVP Iteration', ['businessFinance', 'financialAnalysis']),
  'u18-practice': makeLesson('u18-practice', 'Product Drill', u18Practice, 15, 'unit-product-18', 'entrepreneurship', 'Product Strategy & MVP Iteration', ['businessFinance', 'financialAnalysis']),
  'u18-l4': makeLesson('u18-l4', 'Retention Loops', u18l4, 30, 'unit-product-18', 'entrepreneurship', 'Product Strategy & MVP Iteration', ['financialAnalysis', 'businessFinance']),
  'u18-l5': makeLesson('u18-l5', 'Roadmap Decisions', u18l5, 35, 'unit-product-18', 'entrepreneurship', 'Product Strategy & MVP Iteration', ['businessFinance', 'financialAnalysis']),
  'u19-l1': makeLesson('u19-l1', 'Entity Basics', u19l1, 25, 'unit-legal-19', 'entrepreneurship', 'Business Legal, Tax & Ownership Basics', ['businessFinance']),
  'u19-l2': makeLesson('u19-l2', 'Contracts & Scope', u19l2, 30, 'unit-legal-19', 'entrepreneurship', 'Business Legal, Tax & Ownership Basics', ['businessFinance', 'cashFlow']),
  'u19-l3': makeLesson('u19-l3', 'Permits & Compliance', u19l3, 30, 'unit-legal-19', 'entrepreneurship', 'Business Legal, Tax & Ownership Basics', ['taxPlanning', 'businessFinance']),
  'u19-practice': makeLesson('u19-practice', 'Founder Legal Drill', u19Practice, 15, 'unit-legal-19', 'entrepreneurship', 'Business Legal, Tax & Ownership Basics', ['businessFinance', 'taxPlanning']),
  'u19-l4': makeLesson('u19-l4', 'Owner Pay & Taxes', u19l4, 30, 'unit-legal-19', 'entrepreneurship', 'Business Legal, Tax & Ownership Basics', ['businessFinance', 'taxPlanning']),
  'u19-l5': makeLesson('u19-l5', 'Cofounder Ownership', u19l5, 35, 'unit-legal-19', 'entrepreneurship', 'Business Legal, Tax & Ownership Basics', ['businessFinance', 'financialAnalysis']),
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

const unit6Guidebook: GuidebookEntry[] = [
  { id: 'g6-1', title: 'Problem First', body: 'Start with a specific customer and a painful problem. "Everyone" is not a target market. Strong early signals include deposits, repeat use, referrals, and buyers asking for availability.' },
  { id: 'g6-2', title: 'Unit Economics', body: 'Revenue is sales before costs. Contribution profit is price minus variable costs. Fixed costs happen even with zero sales. A business with negative contribution profit loses more money as it grows.' },
  { id: 'g6-3', title: 'Pricing Formula Stack', body: "Cost floor = Variable costs + Fixed-cost contribution per unit + Tax reserve per unit.\nContribution margin = Price − Variable costs per unit.\nBreak-even units = Monthly fixed costs ÷ Contribution margin per unit.\nGross margin % = (Revenue − COGS) ÷ Revenue × 100.\nNet margin % = Net income ÷ Revenue × 100.\n\nValue-based pricing: charge 15–25% of the value you deliver to the customer — not just cost + markup.\n\nRed flag: gross margin ≠ net margin. The gap is usually 15–25 points of costs people forget (taxes, admin, depreciation). Run the full stack before setting your price.", formulaRef: 'profitMargin' },
  { id: 'g6-4', title: 'MVP Validation', body: 'An MVP is the smallest credible test of the riskiest assumption. Concierge service, pre-orders, prototypes, and paid pilots are all valid when they create real behavior data.' },
  { id: 'g6-5', title: 'Runway', body: 'Runway is how long the business can survive at current cash and burn rate. Keep a business buffer before upgrades. Track booked revenue, margin, cash balance, and repeat customers weekly.', formulaRef: 'budgetSurplus' },
];

const unit7Guidebook: GuidebookEntry[] = [
  { id: 'g7-1', title: 'Funnel Bottlenecks', body: 'Measure each stage: traffic, interest, checkout, purchase, repeat. The weakest stage sets the growth ceiling. Fix the bottleneck before spending more on awareness.' },
  { id: 'g7-2', title: 'CAC And LTV', body: 'CAC is the cost to acquire a customer. LTV is the profit a customer contributes over time. Growth is healthy only when LTV beats CAC by enough to cover overhead, risk, and payback delay.' },
  { id: 'g7-3', title: 'Cash Timing', body: 'Profit is not cash. Inventory, payroll, deposits, late invoices, taxes, and ad spend can create a cash gap even when the business is profitable on paper.', formulaRef: 'budgetSurplus' },
  { id: 'g7-4', title: 'Funding Tradeoffs', body: 'Bootstrapping protects ownership, debt protects ownership but creates repayment pressure, and equity provides cash but sells future upside and control. Choose capital based on cash predictability and growth needs.' },
  { id: 'g7-5', title: 'Scale Readiness', body: 'Scale when the loop works: target customers convert, unit economics are positive over a realistic payback period, cash runway survives the delay, and retention proves the offer has value.', formulaRef: 'profitMargin' },
];

const unit8Guidebook: GuidebookEntry[] = [
  { id: 'g8-1', title: 'Credit Reports', body: 'A credit report records borrowing behavior: accounts, balances, payment history, collections, and inquiries. Check reports before major applications so errors or old collections do not surprise you.' },
  { id: 'g8-2', title: 'Score Levers', body: 'The most controllable levers are on-time payment and utilization. Pay on time, keep reported balances low relative to limits, and avoid clusters of new applications before major credit checks.', formulaRef: 'utilization' },
  { id: 'g8-3', title: 'APR And Payment Pressure', body: 'APR is the annualized cost of borrowing. The payment depends on amount, APR, and term. Longer terms can lower payments while raising total interest.', formulaRef: 'loanPayment' },
  { id: 'g8-4', title: 'Debt Payoff', body: 'Protect every minimum payment first. Avalanche targets highest APR to minimize interest. Snowball targets smallest balance for momentum. Both work best when extra payments focus on one debt at a time.' },
];

const unit9Guidebook: GuidebookEntry[] = [
  { id: 'g9-1', title: 'Gross Vs Net Pay', body: 'Gross pay is before taxes and deductions. Net pay is what reaches your bank. Budget from net pay and understand each deduction before judging an offer.' },
  { id: 'g9-2', title: 'Withholding', body: 'Withholding is a prepayment toward expected tax. Filing reconciles actual tax owed with payments made. Review withholding after job, income, household, or side-income changes.', formulaRef: 'taxWithholding' },
  { id: 'g9-3', title: 'Deductions And Credits', body: 'Deductions reduce taxable income. Credits reduce tax owed directly. Good records help you claim what applies without guessing.' },
  { id: 'g9-4', title: 'Gig Income', body: 'Untaxed freelance income is not all spendable. Track payments, track expenses, reserve for taxes, and review whether quarterly estimates are needed.' },
];

const unit10Guidebook: GuidebookEntry[] = [
  { id: 'g10-1', title: 'Human Capital', body: 'Human capital is your earning power: skills, proof, reliability, judgment, and relationships. It can be one of the largest assets in a young person\'s financial life.' },
  { id: 'g10-2', title: 'Negotiation', body: 'Strong negotiation uses market data, evidence of impact, a clear ask, and a respectful tone. Compare salary, benefits, growth path, commute, and learning together.' },
  { id: 'g10-3', title: 'Benefits Math', body: 'Benefits can be worth thousands. Retirement match, insurance premiums, paid time off, tuition help, and commute support all change total compensation.', formulaRef: 'annualCost' },
  { id: 'g10-4', title: 'Side Income', body: 'Side income should be judged after costs, taxes, time, burnout risk, and skill growth. The best side hustles can produce cash and career proof.', formulaRef: 'profitMargin' },
];

const unit11Guidebook: GuidebookEntry[] = [
  { id: 'g11-1', title: 'Clean Books', body: 'Bookkeeping separates revenue, expenses, tax reserves, owner pay, and cash. Separate business and personal money early to keep decisions clear.' },
  { id: 'g11-2', title: 'Inventory And Cash', body: 'Inventory can turn cash into stock before sales happen. Bulk discounts are useful only when demand, storage, spoilage, and runway still make sense.', formulaRef: 'budgetSurplus' },
  { id: 'g11-3', title: 'Retention Systems', body: 'Retention depends on reliable operations, fast service recovery, and product quality. Fix repeat customer leaks before pouring more money into acquisition.' },
  { id: 'g11-4', title: 'Delegation', body: 'Delegate repeatable, documented tasks first. Keep high-risk strategy, pricing, cash approvals, and unclear work with the founder until the process is stable.' },
];

const unit12Guidebook: GuidebookEntry[] = [
  { id: 'g12-1', title: 'Risk Transfer', body: 'Insurance trades a known premium for protection against a large uncertain loss. Use it for risks that could disrupt housing, health, transportation, income, or legal liability.' },
  { id: 'g12-2', title: 'Premiums And Deductibles', body: 'The premium is the ongoing price of coverage. The deductible is cash you may need during a claim. A policy is not affordable if the deductible would force debt.', formulaRef: 'deductibleReserve' },
  { id: 'g12-3', title: 'Coverage Gaps', body: 'Policies have limits, exclusions, effective dates, and claim rules. Read the declarations page before assuming a loss is covered.' },
  { id: 'g12-4', title: 'Claim Readiness', body: 'Document belongings, keep receipts for major items, save policy details, and know the claim process before an emergency happens.' },
];

const unit13Guidebook: GuidebookEntry[] = [
  { id: 'g13-1', title: 'Specific Customers', body: 'A good first market is narrow enough to reach and urgent enough to buy. Name the customer, trigger, current alternative, and switching reason.' },
  { id: 'g13-2', title: 'Clear Offers', body: 'A strong offer connects a customer problem to a specific outcome with proof. Features explain what it is; benefits explain why buyers care.' },
  { id: 'g13-3', title: 'Marketing Experiments', body: 'Define one segment, one offer, one success metric, a budget, and a time window. Judge tests by profitable buyer behavior, not likes alone.', formulaRef: 'profitMargin' },
  { id: 'g13-4', title: 'Sales Pipeline', body: 'Track leads, qualified prospects, proposals, closed deals, and follow-ups. A pipeline turns scattered conversations into a repeatable operating system.' },
];

const unit14Guidebook: GuidebookEntry[] = [
  { id: 'g14-1', title: 'Total Housing Cost', body: 'Rent is only the headline. Add utilities, renters insurance, fees, commute cost, deposits, moving costs, and savings room before calling a place affordable.', formulaRef: 'budgetSurplus' },
  { id: 'g14-2', title: 'Lease Terms', body: 'Read the lease before signing. Check term length, late fees, renewal rules, repair responsibility, sublet rules, deposits, and every promise that should be in writing.' },
  { id: 'g14-3', title: 'Move-In Cash', body: 'First rent, deposits, application fees, movers, furniture basics, utility setup, and emergency buffer can arrive before the first normal month begins.', formulaRef: 'budgetSurplus' },
  { id: 'g14-4', title: 'Roommate Rules', body: 'Roommates need written rules for rent shares, utilities, guests, chores, damages, and exit plans. Clarity protects both money and relationships.' },
];

const unit15Guidebook: GuidebookEntry[] = [
  { id: 'g15-1', title: 'Total Transportation Cost', body: 'A car costs more than the payment: insurance, fuel, maintenance, registration, repairs, parking, depreciation, and commute time all matter.', formulaRef: 'budgetSurplus' },
  { id: 'g15-2', title: 'Auto Loans', body: 'Compare loan amount, APR, term, fees, and total interest. A lower monthly payment can still be more expensive if the term stretches too long.', formulaRef: 'loanPayment' },
  { id: 'g15-3', title: 'Lease Vs Buy', body: 'Leases can lower monthly payment but add mileage, condition, and flexibility rules. Buying can build equity but adds repair and resale risk.' },
  { id: 'g15-4', title: 'Repair Reserves', body: 'Keep cash for deductibles, tires, repairs, and maintenance. Transportation emergencies can quickly become income emergencies.', formulaRef: 'deductibleReserve' },
];

const unit16Guidebook: GuidebookEntry[] = [
  { id: 'g16-1', title: 'Employer Match', body: 'A workplace match is part of compensation. If cash flow allows, capturing the full match is often the first retirement milestone.' },
  { id: 'g16-2', title: 'Account Tax Treatment', body: 'Traditional accounts can reduce taxable income now and tax withdrawals later. Roth-style accounts use after-tax dollars and can allow qualified tax-free withdrawals.' },
  { id: 'g16-3', title: 'Compounding Time', body: 'Time lets contributions and returns build on themselves. Small automated contributions can become meaningful over decades.', formulaRef: 'compoundGrowth' },
  { id: 'g16-4', title: 'Long-Term Allocation', body: 'A retirement allocation should fit time horizon and behavior. Diversification, low costs, and a plan you can hold matter more than constant tinkering.' },
];

const unit17Guidebook: GuidebookEntry[] = [
  { id: 'g17-1', title: 'Volatility Is Normal', body: 'Risk assets can drop sharply. Long-term investors need emergency cash and a written plan before volatility arrives.' },
  { id: 'g17-2', title: 'DCA And Habits', body: 'Dollar-cost averaging invests on a schedule. It reduces timing pressure and turns investing into a repeatable habit.' },
  { id: 'g17-3', title: 'Rebalancing', body: 'Rebalancing moves a portfolio back toward target risk. It is a rule-based risk control, not a guarantee of profit.', formulaRef: 'portfolioReturn' },
  { id: 'g17-4', title: 'FOMO Defense', body: 'Hype, recency bias, and crowd behavior can push investors into oversized risks. Position size and written reasons slow bad decisions.' },
];

const unit18Guidebook: GuidebookEntry[] = [
  { id: 'g18-1', title: 'Customer Interviews', body: 'Useful interviews focus on recent behavior, current workarounds, urgency, cost, and willingness to commit. Compliments are weaker than action.' },
  { id: 'g18-2', title: 'Prioritize Risk', body: 'Build the smallest test for the riskiest assumption. A roadmap should create evidence, not just more features.' },
  { id: 'g18-3', title: 'MVP Experiments', body: 'A strong experiment names the hypothesis, segment, change, metric, time window, and decision rule before building.' },
  { id: 'g18-4', title: 'Retention Loop', body: 'Acquisition is expensive when users do not return. Track activation, retention, churn, and cohorts before scaling.', formulaRef: 'profitMargin' },
];

const unit19Guidebook: GuidebookEntry[] = [
  { id: 'g19-1', title: 'Business Structure', body: 'Entity choice affects liability, taxes, banking, investors, and partners. Keep business and personal records separate from the start.' },
  { id: 'g19-2', title: 'Contracts', body: 'Contracts should define scope, price, deposits, milestones, revisions, acceptance, cancellation, late payment, and ownership before work starts.' },
  { id: 'g19-3', title: 'Permits And Taxes', body: 'Rules can vary by product, location, and sales channel. Check permits, sales tax, insurance, records, and filing obligations before launch.' },
  { id: 'g19-4', title: 'Owner Pay', body: 'Business cash has jobs: tax reserve, operating buffer, supplier bills, reinvestment, and owner pay. Do not treat all revenue as personal income.', formulaRef: 'budgetSurplus' },
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
    icon: UNIT_ICONS[trackId] ?? '◆',
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

function buildUnit6(): PathUnit {
  return buildUnit(
    'unit-business-6', 'Entrepreneurship Lab',
    'Find customer pain, price profitably, validate fast, and protect runway.',
    'entrepreneurship', ['businessFinance', 'cashFlow', 'financialAnalysis', 'behavior'],
    ['u6-l1', 'u6-l2', 'u6-l3', 'u6-practice', 'u6-l4', 'u6-l5'],
    unit6Guidebook,
  );
}

function buildUnit7(): PathUnit {
  return buildUnit(
    'unit-business-7', 'Startup Growth & Finance',
    'Diagnose funnels, acquisition cost, cash timing, funding, and scale readiness.',
    'entrepreneurship', ['businessFinance', 'cashFlow', 'financialAnalysis'],
    ['u7-l1', 'u7-l2', 'u7-l3', 'u7-practice', 'u7-l4', 'u7-l5'],
    unit7Guidebook,
  );
}

function buildUnit8(): PathUnit {
  return buildUnit(
    'unit-credit-8', 'Credit & Debt Strategy',
    'Read credit reports, manage utilization, compare APRs, and escape expensive debt.',
    'credit', ['creditScore', 'debtMath'],
    ['u8-l1', 'u8-l2', 'u8-l3', 'u8-practice', 'u8-l4', 'u8-l5'],
    unit8Guidebook,
  );
}

function buildUnit9(): PathUnit {
  return buildUnit(
    'unit-taxes-9', 'Taxes & Paychecks',
    'Understand net pay, withholding, deductions, credits, gig taxes, and filing prep.',
    'taxes', ['taxPlanning', 'cashFlow'],
    ['u9-l1', 'u9-l2', 'u9-l3', 'u9-practice', 'u9-l4', 'u9-l5'],
    unit9Guidebook,
  );
}

function buildUnit10(): PathUnit {
  return buildUnit(
    'unit-career-10', 'Career & Income Growth',
    'Grow human capital, negotiate pay, compare benefits, and build side-income proof.',
    'career', ['incomeGrowth', 'businessFinance'],
    ['u10-l1', 'u10-l2', 'u10-l3', 'u10-practice', 'u10-l4', 'u10-l5'],
    unit10Guidebook,
  );
}

function buildUnit11(): PathUnit {
  return buildUnit(
    'unit-business-11', 'Business Systems',
    'Keep clean books, manage inventory, improve retention, delegate, and run a dashboard.',
    'entrepreneurship', ['businessFinance', 'financialAnalysis', 'cashFlow'],
    ['u11-l1', 'u11-l2', 'u11-l3', 'u11-practice', 'u11-l4', 'u11-l5'],
    unit11Guidebook,
  );
}

function buildUnit12(): PathUnit {
  return buildUnit(
    'unit-insurance-12', 'Insurance & Risk',
    'Transfer major risk, compare deductibles, spot coverage gaps, and prepare for claims.',
    'insurance', ['insuranceRisk', 'liquidity', 'behavior'],
    ['u12-l1', 'u12-l2', 'u12-l3', 'u12-practice', 'u12-l4', 'u12-l5'],
    unit12Guidebook,
  );
}

function buildUnit13(): PathUnit {
  return buildUnit(
    'unit-business-13', 'Sales & Marketing Lab',
    'Pick customers, craft offers, test campaigns, manage pipeline, and launch profitably.',
    'entrepreneurship', ['businessFinance', 'financialAnalysis', 'behavior'],
    ['u13-l1', 'u13-l2', 'u13-l3', 'u13-practice', 'u13-l4', 'u13-l5'],
    unit13Guidebook,
  );
}

function buildUnit14(): PathUnit {
  return buildUnit(
    'unit-housing-14', 'Housing & Renting Decisions',
    'Afford rent, read leases, plan move-in cash, handle roommates, and protect your deposit.',
    'budgeting', ['budgetDesign', 'cashFlow', 'liquidity', 'behavior'],
    ['u14-l1', 'u14-l2', 'u14-l3', 'u14-practice', 'u14-l4', 'u14-l5'],
    unit14Guidebook,
  );
}

function buildUnit15(): PathUnit {
  return buildUnit(
    'unit-auto-15', 'Transportation & Auto Money',
    'Compare total car cost, loan terms, lease rules, insurance, repairs, and commute tradeoffs.',
    'debt', ['debtMath', 'budgetDesign', 'cashFlow', 'insuranceRisk'],
    ['u15-l1', 'u15-l2', 'u15-l3', 'u15-practice', 'u15-l4', 'u15-l5'],
    unit15Guidebook,
  );
}

function buildUnit16(): PathUnit {
  return buildUnit(
    'unit-retirement-16', 'Retirement & Long-Term Wealth',
    'Capture match, understand accounts, compound for decades, and choose a holdable allocation.',
    'investing', ['retirementPlanning', 'portfolioConstruction', 'riskReturn', 'taxPlanning'],
    ['u16-l1', 'u16-l2', 'u16-l3', 'u16-practice', 'u16-l4', 'u16-l5'],
    unit16Guidebook,
  );
}

function buildUnit17(): PathUnit {
  return buildUnit(
    'unit-psychology-17', 'Investor Psychology & Market Cycles',
    'Handle volatility, automate investing, rebalance, avoid FOMO, and write a crisis plan.',
    'investing', ['behavior', 'riskReturn', 'portfolioConstruction'],
    ['u17-l1', 'u17-l2', 'u17-l3', 'u17-practice', 'u17-l4', 'u17-l5'],
    unit17Guidebook,
  );
}

function buildUnit18(): PathUnit {
  return buildUnit(
    'unit-product-18', 'Product Strategy & MVP Iteration',
    'Interview customers, prioritize risk, run MVP experiments, improve retention, and choose roadmap work.',
    'entrepreneurship', ['businessFinance', 'financialAnalysis', 'behavior'],
    ['u18-l1', 'u18-l2', 'u18-l3', 'u18-practice', 'u18-l4', 'u18-l5'],
    unit18Guidebook,
  );
}

function buildUnit19(): PathUnit {
  return buildUnit(
    'unit-legal-19', 'Business Legal, Tax & Ownership Basics',
    'Set up entities, contracts, permits, owner pay, tax reserves, and cofounder terms.',
    'entrepreneurship', ['businessFinance', 'taxPlanning', 'cashFlow', 'financialAnalysis'],
    ['u19-l1', 'u19-l2', 'u19-l3', 'u19-practice', 'u19-l4', 'u19-l5'],
    unit19Guidebook,
  );
}

// ─── Learning paths (age-based) ───────────────────────────────────────────────

export type LearningPathId = 'littleSavers' | 'budgetMasters' | 'financialFreedom';

export type LearningPath = {
  id: LearningPathId;
  title: string;
  ageRange: string;
  eyebrow: string;
  tagline: string;
  description: string;
  accent: string;
  icon: string;
  /** Units in this path, in learning order. Every id must resolve to a built unit. */
  unitIds: string[];
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'littleSavers',
    title: 'Little Savers',
    ageRange: 'Ages 5–10',
    eyebrow: 'LITTLE SAVERS',
    tagline: 'First money skills',
    description: 'Playful first lessons: what money is, saving, spending, needs vs wants, earning money, and goal setting.',
    accent: '#F4B400',
    icon: '🐷',
    unitIds: ['unit-ks-1', 'unit-ks-2', 'unit-ks-3', 'unit-ks-4', 'unit-ks-5', 'unit-ks-6'],
  },
  {
    id: 'budgetMasters',
    title: 'Budget Masters',
    ageRange: 'Ages 11–18',
    eyebrow: 'BUDGET MASTERS',
    tagline: 'Real-world money skills',
    description: 'Budgeting, banking, credit basics, investing, taxes, financial responsibility, and entrepreneurship.',
    accent: '#3E9B6B',
    icon: '📊',
    unitIds: [
      'unit-foundations-1',
      'unit-budgeting-2',
      'unit-saving-3',
      'unit-foundations-4',
      'unit-foundations-5',
      'unit-credit-8',
      'unit-investing-6',
      'unit-taxes-9',
      'unit-career-10',
      'unit-business-6',
      'unit-business-13',
    ],
  },
  {
    id: 'financialFreedom',
    title: 'Financial Freedom',
    ageRange: 'Ages 19+',
    eyebrow: 'FINANCIAL FREEDOM',
    tagline: 'Build & protect wealth',
    description: 'Advanced budgeting, investing, retirement, debt management, credit, real estate, insurance, taxes, and wealth building.',
    accent: '#2F6690',
    icon: '🚀',
    unitIds: [
      'unit-housing-14',
      'unit-auto-15',
      'unit-insurance-12',
      'unit-stocks-7',
      'unit-etfs-8',
      'unit-psychology-17',
      'unit-risk-9',
      'unit-crypto-10',
      'unit-retirement-16',
      'unit-business-7',
      'unit-business-11',
      'unit-product-18',
      'unit-legal-19',
    ],
  },
];

// ─── Public API ───────────────────────────────────────────────────────────────

// Build every unit once, keyed by id.
const UNIT_REGISTRY: Record<string, PathUnit> = {};
[
  buildUnit1(), buildUnit2(), buildUnit3(), buildUnit4(), buildUnit5(),
  buildUnit6(), buildUnit7(), buildUnit8(), buildUnit9(), buildUnit10(),
  buildUnit11(), buildUnit12(), buildUnit13(), buildUnit14(), buildUnit15(),
  buildUnit16(), buildUnit17(), buildUnit18(), buildUnit19(),
  introToInvestingUnit, stocksAndMarketUnit, fundsAndEtfsUnit,
  riskMarginShortingUnit, cryptoUnit,
  ...littleSaversUnits,
].forEach((unit) => { UNIT_REGISTRY[unit.id] = unit; });

// Ordered by learning path, then by each path's unit order. This order drives
// sequential unlocking within a path (see getUnitState).
const PATH_UNITS: PathUnit[] = LEARNING_PATHS.flatMap((path) =>
  path.unitIds
    .map((id) => UNIT_REGISTRY[id])
    .filter((unit): unit is PathUnit => Boolean(unit)),
);

// Reverse index: unit id -> learning path id.
const UNIT_TO_PATH: Record<string, LearningPathId> = {};
LEARNING_PATHS.forEach((path) => {
  path.unitIds.forEach((id) => { UNIT_TO_PATH[id] = path.id; });
});

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

export function getLearningPaths(): LearningPath[] {
  return LEARNING_PATHS;
}

export function getLearningPathIdForUnit(unit: PathUnit): LearningPathId {
  return UNIT_TO_PATH[unit.id] ?? 'budgetMasters';
}

/** Maps the onboarding age answer to the path it should start the learner on. */
export function getStartingPathId(profile?: OnboardingProfile): LearningPathId {
  const answer = profile?.answers?.['ageGroup']?.[0];
  if (answer === 'Ages 5–10') return 'littleSavers';
  if (answer === 'Ages 19+') return 'financialFreedom';
  return 'budgetMasters';
}

export function getPathLessonById(id: string): Lesson | undefined {
  return duoLessons[id] ?? ALL_INVESTING_LESSONS[id] ?? littleSaversLessons[id];
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

// Units unlock sequentially within their age-based learning path.
type PathProgressionGroup = LearningPathId;

function getPathProgressionGroup(unit: PathUnit): PathProgressionGroup {
  return getLearningPathIdForUnit(unit);
}

export function getUnitState(unit: PathUnit, progress: LessonProgress, allUnits?: PathUnit[]): UnitState {
  const units = allUnits ?? PATH_UNITS;
  const progressionGroup = getPathProgressionGroup(unit);
  const progressionUnits = units.filter((candidate) => getPathProgressionGroup(candidate) === progressionGroup);
  const unitIndex = progressionUnits.findIndex((u) => u.id === unit.id);

  // Units after the first are locked until the previous unit in the same curriculum is completed.
  if (unitIndex > 0) {
    const prev = progressionUnits[unitIndex - 1]!;
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

export function getNextPathLesson(progress: LessonProgress, profile?: OnboardingProfile): Lesson | undefined {
  // Prefer the learner's own age path so the "next lesson" never points an adult
  // at a Little Savers lesson (or vice-versa) just because of catalog order.
  const startPath = getStartingPathId(profile);
  const orderedUnits = [
    ...PATH_UNITS.filter((unit) => getLearningPathIdForUnit(unit) === startPath),
    ...PATH_UNITS.filter((unit) => getLearningPathIdForUnit(unit) !== startPath),
  ];
  for (const unit of orderedUnits) {
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

export function getUnitLessonNodes(unit: PathUnit) {
  return unit.nodes.filter((node) => node.type === 'lesson' || node.type === 'practice');
}

export function getUnitCompletion(unit: PathUnit, progress: LessonProgress) {
  const completedIds = new Set(progress.completedLessonIds);
  const lessonNodes = getUnitLessonNodes(unit);
  const completed = lessonNodes.filter((node) => node.lessonId && completedIds.has(node.lessonId)).length;
  const total = lessonNodes.length;
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
