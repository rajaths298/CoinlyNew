/**
 * Little Savers — Ages 5–10
 * The youngest learning path. Six units of short, playful, concrete lessons:
 *   1. Money Basics      (unit-ks-1)
 *   2. Saving            (unit-ks-2)
 *   3. Spending          (unit-ks-3)
 *   4. Needs vs Wants    (unit-ks-4)
 *   5. Earning Money     (unit-ks-5)
 *   6. Goal Setting      (unit-ks-6)
 *
 * Language is kept short and simple, examples are concrete (coins, piggy banks,
 * chores, toys), and only tap-based exercise types are used — no typing, no
 * calculators. Lesson IDs: ks{unit}-l{n} and ks{unit}-practice.
 */
import type { CompetencyId, Lesson } from '../types/lesson';
import type { Exercise, GuidebookEntry, PathNode, PathUnit } from '../types/learn';

// ─── Helpers ───────────────────────────────────────────────────────────────

function ksLesson(
  id: string,
  title: string,
  exercises: Exercise[],
  xp: number,
  unitId: string,
  unitTitle: string,
  competencyIds: CompetencyId[],
  learningObjectives: string[],
): Lesson {
  return {
    id,
    title,
    domain: 'foundations',
    level: 'beginner',
    unitId,
    unitTitle,
    courseTrackId: 'foundations',
    moduleId: `${unitId}-mod`,
    durationMinutes: Math.max(2, Math.round(exercises.length)),
    xp,
    prerequisites: [],
    difficulty: 1,
    learningObjectives,
    competencyIds,
    competencyTags: ['Little Savers', unitTitle],
    masteryWeight: 1,
    formulaRefs: [],
    misconceptions: [],
    steps: [],
    exercises,
  };
}

const ZIG: Array<'left' | 'center' | 'right'> = [
  'center', 'right', 'left', 'center', 'center', 'right', 'left', 'center',
];

// A standard 8-node unit: l1, l2, l3, practice, chest, l4, l5, trophy.
function ksUnit(
  unitNumber: number,
  title: string,
  subtitle: string,
  color: string,
  icon: string,
  competencyIds: CompetencyId[],
  guidebook: GuidebookEntry[],
): PathUnit {
  const u = `ks${unitNumber}`;
  const id = `unit-ks-${unitNumber}`;
  const nodes: PathNode[] = [
    { id: `${u}-l1-node`,       type: 'lesson',   position: ZIG[0]!, lessonId: `${u}-l1` },
    { id: `${u}-l2-node`,       type: 'lesson',   position: ZIG[1]!, lessonId: `${u}-l2` },
    { id: `${u}-l3-node`,       type: 'lesson',   position: ZIG[2]!, lessonId: `${u}-l3` },
    { id: `${u}-practice-node`, type: 'practice', position: ZIG[3]!, lessonId: `${u}-practice` },
    { id: `${u}-chest`,         type: 'chest',    position: ZIG[4]!, chestReward: { brainBucks: 30, xp: 15 } },
    { id: `${u}-l4-node`,       type: 'lesson',   position: ZIG[5]!, lessonId: `${u}-l4` },
    { id: `${u}-l5-node`,       type: 'lesson',   position: ZIG[6]!, lessonId: `${u}-l5` },
    { id: `${u}-trophy`,        type: 'trophy',   position: ZIG[7]! },
  ];
  return {
    id,
    title,
    subtitle,
    color,
    icon,
    trackId: 'foundations',
    competencyIds,
    nodes,
    guidebook,
    masteryThreshold: 60,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// UNIT 1 — MONEY BASICS
// ════════════════════════════════════════════════════════════════════════════

const ks1l1: Exercise[] = [
  {
    id: 'ks1-l1-e1', kind: 'miniStory', competencyId: 'moneyMindset',
    rationale: 'Money lets us trade for things we want. Long ago people swapped toys and food. Money makes trading easy!',
    panels: [
      { text: 'Maya wants an apple. The shop owner wants money for it.', speaker: 'Story' },
      { text: 'Maya gives the shop owner a coin. The owner gives Maya the apple!', speaker: 'Story' },
    ],
    choicePrompt: 'What did money help Maya do?',
    choices: [
      { id: 'a', text: 'Trade a coin for an apple', isCorrect: true, outcome: 'Yes! Money helps us trade for things we want.' },
      { id: 'b', text: 'Eat the coin', isCorrect: false, outcome: 'We do not eat coins! We trade them for food.' },
      { id: 'c', text: 'Throw the apple away', isCorrect: false, outcome: 'No — Maya wanted the apple, so she traded for it.' },
    ],
  },
  {
    id: 'ks1-l1-e2', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'Money is what we use to buy things. It can be coins or bills (paper money).',
    prompt: 'What is money used for?',
    options: [
      { id: 'a', text: 'Buying things we need and want', isCorrect: true },
      { id: 'b', text: 'Coloring pictures', isCorrect: false },
      { id: 'c', text: 'Brushing your teeth', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l1-e3', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True! Coins and bills (paper money) are both money. A $5 bill and a quarter are both money.',
    statement: 'Coins and paper bills are both kinds of money.',
    isTrue: true,
  },
  {
    id: 'ks1-l1-e4', kind: 'categorize', competencyId: 'moneyMindset',
    rationale: 'We use money to buy toys, food, and clothes. We do NOT buy sunshine, friends, or hugs — those are free!',
    instruction: 'Tap each one: do you buy it with money, or is it free?',
    buckets: [{ id: 'buy', label: 'Buy with money' }, { id: 'free', label: 'Free' }],
    items: [
      { id: 'toy', text: 'A toy car', bucketId: 'buy' },
      { id: 'icecream', text: 'Ice cream', bucketId: 'buy' },
      { id: 'sun', text: 'Sunshine', bucketId: 'free' },
      { id: 'hug', text: 'A hug', bucketId: 'free' },
    ],
  },
  {
    id: 'ks1-l1-e5', kind: 'matchPairs', competencyId: 'moneyMindset',
    rationale: 'Coins are metal money and bills are paper money. Both let us buy things!',
    instruction: 'Match each one to what it is.',
    pairs: [
      { id: 'p1', term: 'Coin', definition: 'Metal money like a quarter' },
      { id: 'p2', term: 'Bill', definition: 'Paper money like a $5' },
      { id: 'p3', term: 'Buy', definition: 'Trade money for something' },
    ],
  },
  {
    id: 'ks1-l1-e6', kind: 'tapToOrder', competencyId: 'moneyMindset',
    rationale: 'A penny is the smallest, then a nickel, then a dime, then a quarter.',
    instruction: 'Put the coins in order from LEAST to MOST money.',
    items: [
      { id: 's1', text: 'Penny (1 cent)', rank: 1 },
      { id: 's2', text: 'Nickel (5 cents)', rank: 2 },
      { id: 's3', text: 'Dime (10 cents)', rank: 3 },
      { id: 's4', text: 'Quarter (25 cents)', rank: 4 },
    ],
  },
  {
    id: 'ks1-l1-e7', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A dollar bill is money. A leaf and a rock are not money.',
    prompt: 'Which one is money?',
    options: [
      { id: 'a', text: 'A dollar bill', isCorrect: true },
      { id: 'b', text: 'A leaf', isCorrect: false },
      { id: 'c', text: 'A rock', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l1-e8', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'A sticker costs $2 and you have $2 — that is exactly enough!',
    story: 'You want a sticker that costs $2. You have two $1 bills.',
    choices: [
      { id: 'a', text: 'I have enough to buy it', isCorrect: true, score: 3, outcome: 'Yes! Two $1 bills make $2 — just enough.' },
      { id: 'b', text: 'I do not have enough', isCorrect: false, score: 0, outcome: 'You do! $1 + $1 = $2, the price of the sticker.' },
    ],
  },
];

const ks1l2: Exercise[] = [
  {
    id: 'ks1-l2-e1', kind: 'matchPairs', competencyId: 'moneyMindset',
    rationale: 'A penny = 1 cent, a nickel = 5 cents, a dime = 10 cents, a quarter = 25 cents.',
    instruction: 'Match each coin to how much it is worth.',
    pairs: [
      { id: 'p1', term: 'Penny', definition: '1 cent' },
      { id: 'p2', term: 'Nickel', definition: '5 cents' },
      { id: 'p3', term: 'Dime', definition: '10 cents' },
      { id: 'p4', term: 'Quarter', definition: '25 cents' },
    ],
  },
  {
    id: 'ks1-l2-e2', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'Two dimes make 20 cents (10 + 10 = 20).',
    prompt: 'You have 2 dimes. How many cents is that?',
    options: [
      { id: 'a', text: '20 cents', isCorrect: true },
      { id: 'b', text: '2 cents', isCorrect: false },
      { id: 'c', text: '10 cents', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l2-e3', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A quarter is worth 25 cents — more than a penny, nickel, or dime.',
    prompt: 'Which coin is worth the MOST?',
    options: [
      { id: 'a', text: 'A quarter', isCorrect: true },
      { id: 'b', text: 'A penny', isCorrect: false },
      { id: 'c', text: 'A nickel', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l2-e4', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True! A dime is 10 cents and a penny is 1 cent, so a dime is worth more.',
    statement: 'A dime is worth more than a penny.',
    isTrue: true,
  },
  {
    id: 'ks1-l2-e5', kind: 'categorize', competencyId: 'moneyMindset',
    rationale: 'Pennies and quarters are coins. A $1 and $5 are paper bills.',
    instruction: 'Is it a coin or a bill?',
    buckets: [{ id: 'coin', label: 'Coin' }, { id: 'bill', label: 'Bill' }],
    items: [
      { id: 'penny', text: 'A penny', bucketId: 'coin' },
      { id: 'quarter', text: 'A quarter', bucketId: 'coin' },
      { id: 'one', text: 'A $1 note', bucketId: 'bill' },
      { id: 'five', text: 'A $5 note', bucketId: 'bill' },
    ],
  },
  {
    id: 'ks1-l2-e6', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A nickel is worth 5 cents.',
    prompt: 'How many cents is a nickel worth?',
    options: [
      { id: 'a', text: '5 cents', isCorrect: true },
      { id: 'b', text: '1 cent', isCorrect: false },
      { id: 'c', text: '10 cents', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l2-e7', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A dime (10) plus a nickel (5) is 15 cents.',
    prompt: 'You have a dime and a nickel. How many cents is that?',
    options: [
      { id: 'a', text: '15 cents', isCorrect: true },
      { id: 'b', text: '5 cents', isCorrect: false },
      { id: 'c', text: '20 cents', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l2-e8', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'Candy costs 10 cents and a dime is 10 cents — exactly enough!',
    story: 'A piece of candy costs 10 cents. You have one dime.',
    choices: [
      { id: 'a', text: 'I can buy the candy', isCorrect: true, score: 3, outcome: 'Yes! A dime is 10 cents.' },
      { id: 'b', text: 'I do not have enough', isCorrect: false, score: 0, outcome: 'A dime is exactly 10 cents — just enough!' },
    ],
  },
];

const ks1l3: Exercise[] = [
  {
    id: 'ks1-l3-e1', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'The toy costs $5. If you have $5, you have enough to buy it!',
    story: 'A toy costs $5. You have one $5 bill in your pocket.',
    choices: [
      { id: 'a', text: 'I have enough to buy the toy', isCorrect: true, score: 3, outcome: 'Right! $5 is exactly enough for a $5 toy.' },
      { id: 'b', text: 'I do not have enough', isCorrect: false, score: 0, outcome: 'You DO have enough — $5 buys a $5 toy.' },
    ],
  },
  {
    id: 'ks1-l3-e2', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'When you buy something, you give money and get the thing. The store keeps the money.',
    prompt: 'When you buy a snack at the store, what happens?',
    options: [
      { id: 'a', text: 'You give money and get the snack', isCorrect: true },
      { id: 'b', text: 'You keep your money AND get the snack for free', isCorrect: false },
      { id: 'c', text: 'The store gives you money', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l3-e3', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'False — if a toy costs more money than you have, you cannot buy it yet. You can save up for it!',
    statement: 'If a toy costs $10 and you only have $3, you can buy it right now.',
    isTrue: false,
  },
  {
    id: 'ks1-l3-e4', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'When you buy a toy, you give the store your money.',
    prompt: 'When you buy a toy, what do you give the store?',
    options: [
      { id: 'a', text: 'Your money', isCorrect: true },
      { id: 'b', text: 'Your shoes', isCorrect: false },
      { id: 'c', text: 'Nothing at all', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l3-e5', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True — once you pay, the store keeps your money and you keep the thing you bought.',
    statement: 'After you buy something, the store keeps the money you paid.',
    isTrue: true,
  },
  {
    id: 'ks1-l3-e6', kind: 'categorize', competencyId: 'moneyMindset',
    rationale: 'If you have enough money, you can buy it now. If not, you have to save more.',
    instruction: 'Can you buy it right now?',
    buckets: [{ id: 'yes', label: 'Yes, enough money' }, { id: 'no', label: 'No, not enough' }],
    items: [
      { id: 'i1', text: '$3 toy, you have $5', bucketId: 'yes' },
      { id: 'i2', text: '$10 toy, you have $4', bucketId: 'no' },
      { id: 'i3', text: '$1 gum, you have $2', bucketId: 'yes' },
      { id: 'i4', text: '$8 ball, you have $5', bucketId: 'no' },
    ],
  },
  {
    id: 'ks1-l3-e7', kind: 'miniStory', competencyId: 'moneyMindset',
    rationale: 'Theo had enough money, so he traded it for the book he wanted.',
    panels: [
      { text: 'Theo wants a book that costs $4. He has a $5 bill.', speaker: 'Story' },
      { text: 'Theo gives the $5. The store gives him the book and $1 back.', speaker: 'Story' },
    ],
    choicePrompt: 'What happened?',
    choices: [
      { id: 'a', text: 'Theo paid $4 and got $1 back as change', isCorrect: true, outcome: 'Yes! $5 minus the $4 book is $1 change.' },
      { id: 'b', text: 'Theo got the book for free', isCorrect: false, outcome: 'He paid $4 for it and got $1 back.' },
    ],
  },
  {
    id: 'ks1-l3-e8', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'A $10 toy costs more than your $6, so the smart move is to save up.',
    story: 'You want a $10 toy. You only have $6.',
    choices: [
      { id: 'a', text: 'Save more money until I have $10', isCorrect: true, score: 3, outcome: 'Great plan! Save $4 more and it is yours.' },
      { id: 'b', text: 'Take the toy without paying', isCorrect: false, score: 0, outcome: 'No — we always pay for things. Save up instead!' },
    ],
  },
];

const ks1l4: Exercise[] = [
  {
    id: 'ks1-l4-e1', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A piggy bank or a bank keeps your money safe so it is not lost.',
    prompt: 'Where is a SAFE place to keep your money?',
    options: [
      { id: 'a', text: 'A piggy bank or a bank', isCorrect: true },
      { id: 'b', text: 'On the sidewalk', isCorrect: false },
      { id: 'c', text: 'In a puddle', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l4-e2', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True! A bank keeps lots of money safe, and you can take yours out when you need it.',
    statement: 'A bank is a safe place that holds your money for you.',
    isTrue: true,
  },
  {
    id: 'ks1-l4-e3', kind: 'categorize', competencyId: 'moneyMindset',
    rationale: 'Safe spots keep money from getting lost. Leaving money outside or in the wash is not safe!',
    instruction: 'Is it a safe place for money, or NOT safe?',
    buckets: [{ id: 'safe', label: 'Safe' }, { id: 'notsafe', label: 'Not safe' }],
    items: [
      { id: 'piggy', text: 'Piggy bank', bucketId: 'safe' },
      { id: 'wallet', text: 'A wallet', bucketId: 'safe' },
      { id: 'street', text: 'The street', bucketId: 'notsafe' },
      { id: 'pocketwash', text: 'Pocket going in the washing machine', bucketId: 'notsafe' },
    ],
  },
  {
    id: 'ks1-l4-e4', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A piggy bank keeps your money safe at home.',
    prompt: 'What is the best place to keep your coins safe?',
    options: [
      { id: 'a', text: 'A piggy bank', isCorrect: true },
      { id: 'b', text: 'On the floor', isCorrect: false },
      { id: 'c', text: 'In a puddle', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l4-e5', kind: 'matchPairs', competencyId: 'moneyMindset',
    rationale: 'A piggy bank and a real bank are safe. The sidewalk is not safe.',
    instruction: 'Match each place to safe or not safe.',
    pairs: [
      { id: 'p1', term: 'Piggy bank', definition: 'Safe' },
      { id: 'p2', term: 'A real bank', definition: 'Safe at a building' },
      { id: 'p3', term: 'The sidewalk', definition: 'Not safe' },
    ],
  },
  {
    id: 'ks1-l4-e6', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'False — money left on the bus could get lost. Keep it in a safe place.',
    statement: 'Leaving your money on the bus is a safe idea.',
    isTrue: false,
  },
  {
    id: 'ks1-l4-e7', kind: 'tapToOrder', competencyId: 'moneyMindset',
    rationale: 'First you get money, then you put it in a safe place, then it stays safe.',
    instruction: 'Put the steps in order.',
    items: [
      { id: 's1', text: 'Get some money', rank: 1 },
      { id: 's2', text: 'Put it in your piggy bank', rank: 2 },
      { id: 's3', text: 'Your money stays safe', rank: 3 },
    ],
  },
  {
    id: 'ks1-l4-e8', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'Putting birthday money in a safe place keeps it from getting lost.',
    story: 'Grandpa gives you $5 for your birthday.',
    choices: [
      { id: 'a', text: 'Put it in my piggy bank', isCorrect: true, score: 3, outcome: 'Smart! Now it is safe.' },
      { id: 'b', text: 'Leave it on the park bench', isCorrect: false, score: 0, outcome: 'Oh no — it might get lost! Keep it safe.' },
    ],
  },
];

const ks1Practice: Exercise[] = [
  {
    id: 'ks1-pr-e1', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'Money is for trading to buy the things we want and need.',
    prompt: 'Money helps us...',
    options: [
      { id: 'a', text: 'buy the things we want and need', isCorrect: true },
      { id: 'b', text: 'fly like a bird', isCorrect: false },
      { id: 'c', text: 'make it rain', isCorrect: false },
    ],
  },
  {
    id: 'ks1-pr-e2', kind: 'matchPairs', competencyId: 'moneyMindset',
    rationale: 'A nickel is 5 cents and a dime is 10 cents.',
    instruction: 'Match the coin to its value.',
    pairs: [
      { id: 'p1', term: 'Nickel', definition: '5 cents' },
      { id: 'p2', term: 'Dime', definition: '10 cents' },
      { id: 'p3', term: 'Quarter', definition: '25 cents' },
    ],
  },
  {
    id: 'ks1-pr-e3', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True! A piggy bank keeps your coins safe.',
    statement: 'A piggy bank is a safe place to keep coins.',
    isTrue: true,
  },
  {
    id: 'ks1-pr-e4', kind: 'categorize', competencyId: 'moneyMindset',
    rationale: 'We buy food and toys with money. Sunshine and friendship are free.',
    instruction: 'Buy with money, or free?',
    buckets: [{ id: 'buy', label: 'Buy with money' }, { id: 'free', label: 'Free' }],
    items: [
      { id: 'pizza', text: 'A slice of pizza', bucketId: 'buy' },
      { id: 'book', text: 'A new book', bucketId: 'buy' },
      { id: 'rainbow', text: 'A rainbow', bucketId: 'free' },
    ],
  },
  {
    id: 'ks1-pr-e5', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A dime is worth 10 cents.',
    prompt: 'How many cents is a dime?',
    options: [
      { id: 'a', text: '10 cents', isCorrect: true },
      { id: 'b', text: '1 cent', isCorrect: false },
      { id: 'c', text: '25 cents', isCorrect: false },
    ],
  },
  {
    id: 'ks1-pr-e6', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True — a bank is a safe place that holds your money.',
    statement: 'A bank is a safe place to keep money.',
    isTrue: true,
  },
  {
    id: 'ks1-pr-e7', kind: 'tapToOrder', competencyId: 'moneyMindset',
    rationale: 'Penny, nickel, dime, quarter — smallest to biggest value.',
    instruction: 'Order the coins from LEAST to MOST money.',
    items: [
      { id: 's1', text: 'Penny', rank: 1 },
      { id: 's2', text: 'Nickel', rank: 2 },
      { id: 's3', text: 'Dime', rank: 3 },
      { id: 's4', text: 'Quarter', rank: 4 },
    ],
  },
  {
    id: 'ks1-pr-e8', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'A $4 toy and you have $4 — exactly enough to buy it.',
    story: 'A toy costs $4. You have four $1 bills.',
    choices: [
      { id: 'a', text: 'I can buy it', isCorrect: true, score: 3, outcome: 'Yes! Four $1 bills make $4.' },
      { id: 'b', text: 'I do not have enough', isCorrect: false, score: 0, outcome: 'You do — $1 + $1 + $1 + $1 = $4.' },
    ],
  },
];

const ks1l5: Exercise[] = [
  {
    id: 'ks1-l5-e1', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'Great job! Money is what we trade to buy things.',
    prompt: 'What is money?',
    options: [
      { id: 'a', text: 'What we trade to buy things', isCorrect: true },
      { id: 'b', text: 'A kind of candy', isCorrect: false },
      { id: 'c', text: 'A pet', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l5-e2', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'Two quarters make 50 cents (25 + 25 = 50).',
    prompt: 'You have 2 quarters. How many cents?',
    options: [
      { id: 'a', text: '50 cents', isCorrect: true },
      { id: 'b', text: '25 cents', isCorrect: false },
      { id: 'c', text: '2 cents', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l5-e3', kind: 'scenarioDecision', competencyId: 'moneyMindset',
    rationale: 'Keeping your money in your piggy bank keeps it safe at home.',
    story: 'You got $3 from grandma. You want to keep it safe.',
    choices: [
      { id: 'a', text: 'Put it in my piggy bank', isCorrect: true, score: 3, outcome: 'Smart! Now your money is safe.' },
      { id: 'b', text: 'Leave it on the playground', isCorrect: false, score: 0, outcome: 'Oh no — it could get lost! Keep money in a safe place.' },
    ],
  },
  {
    id: 'ks1-l5-e4', kind: 'trueFalse', competencyId: 'moneyMindset',
    rationale: 'True! Coins and paper bills are both kinds of money.',
    statement: 'Both coins and paper bills are money.',
    isTrue: true,
  },
  {
    id: 'ks1-l5-e5', kind: 'categorize', competencyId: 'moneyMindset',
    rationale: 'We buy toys and food with money. Sunshine and a hug are free.',
    instruction: 'Buy with money, or free?',
    buckets: [{ id: 'buy', label: 'Buy with money' }, { id: 'free', label: 'Free' }],
    items: [
      { id: 'toy', text: 'A toy', bucketId: 'buy' },
      { id: 'apple', text: 'An apple at the store', bucketId: 'buy' },
      { id: 'sun', text: 'Sunshine', bucketId: 'free' },
      { id: 'hug', text: 'A hug from a friend', bucketId: 'free' },
    ],
  },
  {
    id: 'ks1-l5-e6', kind: 'matchPairs', competencyId: 'moneyMindset',
    rationale: 'A penny is 1 cent, a nickel is 5 cents, a quarter is 25 cents.',
    instruction: 'Match each coin to its value.',
    pairs: [
      { id: 'p1', term: 'Penny', definition: '1 cent' },
      { id: 'p2', term: 'Nickel', definition: '5 cents' },
      { id: 'p3', term: 'Quarter', definition: '25 cents' },
    ],
  },
  {
    id: 'ks1-l5-e7', kind: 'multipleChoice', competencyId: 'moneyMindset',
    rationale: 'A piggy bank keeps your money safe.',
    prompt: 'Where should you keep your money to keep it safe?',
    options: [
      { id: 'a', text: 'In a piggy bank', isCorrect: true },
      { id: 'b', text: 'In the trash', isCorrect: false },
      { id: 'c', text: 'In a puddle', isCorrect: false },
    ],
  },
  {
    id: 'ks1-l5-e8', kind: 'tapToOrder', competencyId: 'moneyMindset',
    rationale: 'Get money, buy or save, and keep the rest safe.',
    instruction: 'Put the money steps in order.',
    items: [
      { id: 's1', text: 'Get some money', rank: 1 },
      { id: 's2', text: 'Buy what you need', rank: 2 },
      { id: 's3', text: 'Keep the rest safe', rank: 3 },
    ],
  },
];

const ks1Guidebook: GuidebookEntry[] = [
  { id: 'ks1-g1', title: 'What Is Money?', body: 'Money is what we trade to get the things we need and want. Money can be coins (like pennies and quarters) or paper bills (like a $1 or $5).' },
  { id: 'ks1-g2', title: 'Coin Values', body: 'Penny = 1 cent. Nickel = 5 cents. Dime = 10 cents. Quarter = 25 cents. The bigger the value, the more it can buy!' },
  { id: 'ks1-g3', title: 'Buying Things', body: 'When you buy something, you give the store money and the store gives you the thing. If something costs more money than you have, you can save up for it.' },
  { id: 'ks1-g4', title: 'Keeping Money Safe', body: 'Keep your money in a safe place like a piggy bank, a wallet, or a real bank. That way it will not get lost.' },
];

// ════════════════════════════════════════════════════════════════════════════
// UNIT 2 — SAVING
// ════════════════════════════════════════════════════════════════════════════

const ks2l1: Exercise[] = [
  {
    id: 'ks2-l1-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Saving means keeping some money instead of spending it all right now.',
    prompt: 'What does it mean to SAVE money?',
    options: [
      { id: 'a', text: 'Keep some money for later', isCorrect: true },
      { id: 'b', text: 'Spend all of it today', isCorrect: false },
      { id: 'c', text: 'Give it all away', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l1-e2', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! When you save, your money waits in your piggy bank until you need it.',
    statement: 'Money you save waits for you to use it later.',
    isTrue: true,
  },
  {
    id: 'ks2-l1-e3', kind: 'miniStory', competencyId: 'savingSystems',
    rationale: 'Leo saved his coins each week. Soon he had enough for the kite he wanted!',
    panels: [
      { text: 'Leo wants a kite that costs $8. He has $2.', speaker: 'Story' },
      { text: 'Each week, Leo puts $2 in his piggy bank instead of buying candy.', speaker: 'Story' },
      { text: 'After a few weeks, Leo has $8. He buys the kite!', speaker: 'Story' },
    ],
    choicePrompt: 'How did Leo get the kite?',
    choices: [
      { id: 'a', text: 'He saved a little money each week', isCorrect: true, outcome: 'Yes! Saving a little at a time adds up.' },
      { id: 'b', text: 'He spent all his money on candy', isCorrect: false, outcome: 'If he spent it on candy, he could not save for the kite.' },
    ],
  },
  {
    id: 'ks2-l1-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Saving means keeping some money to use later.',
    prompt: 'Saving money means...',
    options: [
      { id: 'a', text: 'keeping some for later', isCorrect: true },
      { id: 'b', text: 'spending it all today', isCorrect: false },
      { id: 'c', text: 'throwing it away', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l1-e5', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Putting money away is saving. Using it to buy something is spending.',
    instruction: 'Is it saving or spending?',
    buckets: [{ id: 'save', label: 'Saving' }, { id: 'spend', label: 'Spending' }],
    items: [
      { id: 'i1', text: 'Putting a coin in your piggy bank', bucketId: 'save' },
      { id: 'i2', text: 'Buying candy', bucketId: 'spend' },
      { id: 'i3', text: 'Keeping your allowance', bucketId: 'save' },
      { id: 'i4', text: 'Paying for a toy', bucketId: 'spend' },
    ],
  },
  {
    id: 'ks2-l1-e6', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'Saving keeps money for later; a piggy bank holds your savings.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Save', definition: 'Keep money for later' },
      { id: 'p2', term: 'Spend', definition: 'Use money now' },
      { id: 'p3', term: 'Piggy bank', definition: 'Holds your savings' },
    ],
  },
  {
    id: 'ks2-l1-e7', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Money you save is waiting for you to use later.',
    statement: 'If you save your money, you can use it later.',
    isTrue: true,
  },
  {
    id: 'ks2-l1-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Saving the $5 helps you get closer to the $20 thing you want.',
    story: 'You get $5. You really want a $20 toy later.',
    choices: [
      { id: 'a', text: 'Save the $5 toward the toy', isCorrect: true, score: 3, outcome: 'Great! Now you are $5 closer to your goal.' },
      { id: 'b', text: 'Spend it all on gum today', isCorrect: false, score: 0, outcome: 'Then you saved nothing for the toy you want.' },
    ],
  },
];

const ks2l2: Exercise[] = [
  {
    id: 'ks2-l2-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'We save so we can buy bigger things later, like a bike or a game.',
    prompt: 'Why do people save money?',
    options: [
      { id: 'a', text: 'To buy bigger things later', isCorrect: true },
      { id: 'b', text: 'Because money is heavy', isCorrect: false },
      { id: 'c', text: 'To lose it', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l2-e2', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'A bike costs a lot. Saving over time helps you reach a big goal.',
    story: 'You really want a bike that costs $50. You get $5 each week.',
    choices: [
      { id: 'a', text: 'Save $5 each week until I have $50', isCorrect: true, score: 3, outcome: 'Perfect! In 10 weeks you will have enough.' },
      { id: 'b', text: 'Spend the $5 on gum every week', isCorrect: false, score: 0, outcome: 'Then you will never save up for the bike.' },
    ],
  },
  {
    id: 'ks2-l2-e3', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Saving means waiting a little so you can get something bigger later.',
    statement: 'Saving sometimes means waiting before you buy something.',
    isTrue: true,
  },
  {
    id: 'ks2-l2-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'We save so we can buy bigger things later.',
    prompt: 'Why do we save money?',
    options: [
      { id: 'a', text: 'To buy bigger things later', isCorrect: true },
      { id: 'b', text: 'Because saving is boring', isCorrect: false },
      { id: 'c', text: 'To make it disappear', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l2-e5', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'First pick a goal, then save each week, then buy it.',
    instruction: 'Put the steps in order to reach a goal.',
    items: [
      { id: 's1', text: 'Pick something to save for', rank: 1 },
      { id: 's2', text: 'Save a little each week', rank: 2 },
      { id: 's3', text: 'Buy it when you have enough', rank: 3 },
    ],
  },
  {
    id: 'ks2-l2-e6', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Saving helps you afford bigger things over time.',
    statement: 'Saving helps you buy bigger things later.',
    isTrue: true,
  },
  {
    id: 'ks2-l2-e7', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Big things are worth saving for. Small cheap things you can often buy now.',
    instruction: 'Save up for it, or buy it now?',
    buckets: [{ id: 'save', label: 'Save up (big)' }, { id: 'now', label: 'Buy now (small)' }],
    items: [
      { id: 'bike', text: 'A $50 bike', bucketId: 'save' },
      { id: 'gum', text: 'A 50-cent gum', bucketId: 'now' },
      { id: 'console', text: 'A $200 game console', bucketId: 'save' },
      { id: 'sticker', text: 'A $1 sticker', bucketId: 'now' },
    ],
  },
  {
    id: 'ks2-l2-e8', kind: 'miniStory', competencyId: 'savingSystems',
    rationale: 'Nina saved $5 each week and reached her $25 goal in 5 weeks!',
    panels: [
      { text: 'Nina wants a $25 scooter. She saves $5 each week.', speaker: 'Story' },
      { text: 'Week by week: $5, $10, $15, $20, then $25. She buys the scooter!', speaker: 'Story' },
    ],
    choicePrompt: 'How did Nina reach her goal?',
    choices: [
      { id: 'a', text: 'She saved a little each week until she had enough', isCorrect: true, outcome: 'Yes! Saving each week adds up to the goal.' },
      { id: 'b', text: 'She bought it the first day with no money', isCorrect: false, outcome: 'She needed to save $25 first — a little each week.' },
    ],
  },
];

const ks2l3: Exercise[] = [
  {
    id: 'ks2-l3-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'A good habit is to save a little bit every time you get money.',
    prompt: 'What is a good saving habit?',
    options: [
      { id: 'a', text: 'Save a little each time you get money', isCorrect: true },
      { id: 'b', text: 'Wait until you are 100 years old', isCorrect: false },
      { id: 'c', text: 'Only save once, then stop', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l3-e2', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'First you get money, then you put some in your piggy bank, then it grows!',
    instruction: 'Put the saving steps in order.',
    items: [
      { id: 's1', text: 'Get some money', rank: 1 },
      { id: 's2', text: 'Put some in your piggy bank', rank: 2 },
      { id: 's3', text: 'Watch your savings grow', rank: 3 },
    ],
  },
  {
    id: 'ks2-l3-e3', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — saving a small amount many times turns into a big amount!',
    statement: 'Saving a little bit many times adds up to a lot.',
    isTrue: true,
  },
  {
    id: 'ks2-l3-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'A good habit is to save a little each time you get money.',
    prompt: 'What is a GOOD saving habit?',
    options: [
      { id: 'a', text: 'Save a little each time you get money', isCorrect: true },
      { id: 'b', text: 'Spend it all the second you get it', isCorrect: false },
      { id: 'c', text: 'Never save anything', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l3-e5', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'A habit is something you do often; saving makes your money grow.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Habit', definition: 'Something you do often' },
      { id: 'p2', term: 'Save', definition: 'Keep some money' },
      { id: 'p3', term: 'Grow', definition: 'Get bigger over time' },
    ],
  },
  {
    id: 'ks2-l3-e6', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Saving a little bit many times adds up to a lot.',
    statement: 'Saving a little bit many times adds up to a lot.',
    isTrue: true,
  },
  {
    id: 'ks2-l3-e7', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Adding money helps you save. Spending it all does not.',
    instruction: 'Does it help you save?',
    buckets: [{ id: 'helps', label: 'Helps you save' }, { id: 'nothelp', label: 'Does not help' }],
    items: [
      { id: 'i1', text: 'Putting a coin in a jar', bucketId: 'helps' },
      { id: 'i2', text: 'Saving your allowance', bucketId: 'helps' },
      { id: 'i3', text: 'Spending all of it on candy', bucketId: 'nothelp' },
      { id: 'i4', text: 'Buying a toy every single day', bucketId: 'nothelp' },
    ],
  },
  {
    id: 'ks2-l3-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Saving a little each week is a great habit that grows your money.',
    story: 'You get $4 every week. What is a good habit?',
    choices: [
      { id: 'a', text: 'Save $1 each week, every week', isCorrect: true, score: 3, outcome: 'Great habit! A little each week grows fast.' },
      { id: 'b', text: 'Spend all $4 every time, every week', isCorrect: false, score: 0, outcome: 'Then your savings never grow. Save a little!' },
    ],
  },
];

const ks2l4: Exercise[] = [
  {
    id: 'ks2-l4-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'If you save $3 this week and $3 next week, you have $6 (3 + 3 = 6).',
    prompt: 'You save $3 this week and $3 next week. How much do you have?',
    options: [
      { id: 'a', text: '$6', isCorrect: true },
      { id: 'b', text: '$3', isCorrect: false },
      { id: 'c', text: '$1', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l4-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'The more weeks you save, the more money grows in your piggy bank.',
    prompt: 'What happens to your savings the longer you save?',
    options: [
      { id: 'a', text: 'It grows bigger', isCorrect: true },
      { id: 'b', text: 'It disappears', isCorrect: false },
      { id: 'c', text: 'It turns into candy', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l4-e3', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Putting money IN your piggy bank makes savings grow. Taking it out to spend makes it smaller.',
    instruction: 'Does it make your savings bigger or smaller?',
    buckets: [{ id: 'bigger', label: 'Bigger' }, { id: 'smaller', label: 'Smaller' }],
    items: [
      { id: 'add', text: 'Adding a coin to your piggy bank', bucketId: 'bigger' },
      { id: 'allowance', text: 'Saving your allowance', bucketId: 'bigger' },
      { id: 'spend', text: 'Taking money out to buy candy', bucketId: 'smaller' },
    ],
  },
  {
    id: 'ks2-l4-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$2 + $2 + $2 = $6.',
    prompt: 'You save $2 three weeks in a row. How much do you have?',
    options: [
      { id: 'a', text: '$6', isCorrect: true },
      { id: 'b', text: '$2', isCorrect: false },
      { id: 'c', text: '$3', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l4-e5', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! The more weeks you save, the bigger your savings get.',
    statement: 'The longer you keep saving, the more money you have.',
    isTrue: true,
  },
  {
    id: 'ks2-l4-e6', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'As you save $2 each week, your total grows: $2, $4, $6, $8.',
    instruction: 'Put your growing savings in order from smallest to biggest.',
    items: [
      { id: 's1', text: 'Week 1: $2', rank: 1 },
      { id: 's2', text: 'Week 2: $4', rank: 2 },
      { id: 's3', text: 'Week 3: $6', rank: 3 },
      { id: 's4', text: 'Week 4: $8', rank: 4 },
    ],
  },
  {
    id: 'ks2-l4-e7', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'Adding the same amount twice doubles it.',
    instruction: 'Match the saving to the total.',
    pairs: [
      { id: 'p1', term: '$5 + $5', definition: '$10' },
      { id: 'p2', term: '$2 + $2', definition: '$4' },
      { id: 'p3', term: '$3 + $3', definition: '$6' },
    ],
  },
  {
    id: 'ks2-l4-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Keep saving and your money keeps growing toward your goal.',
    story: 'You have saved $6 so far. You want a $10 toy.',
    choices: [
      { id: 'a', text: 'Keep saving until I reach $10', isCorrect: true, score: 3, outcome: 'Yes! Just $4 more to go.' },
      { id: 'b', text: 'Spend the $6 now on something else', isCorrect: false, score: 0, outcome: 'Then you start over. Keep saving for your toy!' },
    ],
  },
];

const ks2Practice: Exercise[] = [
  {
    id: 'ks2-pr-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Saving means keeping some money for later instead of spending it all.',
    prompt: 'To save money means to...',
    options: [
      { id: 'a', text: 'keep some for later', isCorrect: true },
      { id: 'b', text: 'spend it all now', isCorrect: false },
      { id: 'c', text: 'hide it forever', isCorrect: false },
    ],
  },
  {
    id: 'ks2-pr-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$4 + $4 = $8.',
    prompt: 'You save $4 two weeks in a row. How much?',
    options: [
      { id: 'a', text: '$8', isCorrect: true },
      { id: 'b', text: '$4', isCorrect: false },
      { id: 'c', text: '$2', isCorrect: false },
    ],
  },
  {
    id: 'ks2-pr-e3', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Get money, save some, then your savings grow.',
    instruction: 'Order the steps to save.',
    items: [
      { id: 's1', text: 'Get money', rank: 1 },
      { id: 's2', text: 'Save some of it', rank: 2 },
      { id: 's3', text: 'Savings grow', rank: 3 },
    ],
  },
  {
    id: 'ks2-pr-e4', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Saving a little at a time is a great habit.',
    statement: 'Saving a little every week is a good habit.',
    isTrue: true,
  },
  {
    id: 'ks2-pr-e5', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$3 + $3 + $3 = $9.',
    prompt: 'You save $3 three weeks in a row. How much is that?',
    options: [
      { id: 'a', text: '$9', isCorrect: true },
      { id: 'b', text: '$3', isCorrect: false },
      { id: 'c', text: '$6', isCorrect: false },
    ],
  },
  {
    id: 'ks2-pr-e6', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — saving helps you reach a goal you care about.',
    statement: 'Saving money helps you reach a goal.',
    isTrue: true,
  },
  {
    id: 'ks2-pr-e7', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Keeping money is saving; using it to buy is spending.',
    instruction: 'Saving or spending?',
    buckets: [{ id: 'save', label: 'Saving' }, { id: 'spend', label: 'Spending' }],
    items: [
      { id: 'i1', text: 'Putting $2 in your piggy bank', bucketId: 'save' },
      { id: 'i2', text: 'Buying ice cream', bucketId: 'spend' },
      { id: 'i3', text: 'Keeping your birthday money', bucketId: 'save' },
    ],
  },
  {
    id: 'ks2-pr-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Saving most of your birthday money helps you reach a bigger goal.',
    story: 'You get $10 for your birthday and want a $20 game later.',
    choices: [
      { id: 'a', text: 'Save most of it toward the game', isCorrect: true, score: 3, outcome: 'Smart! You are halfway to the game.' },
      { id: 'b', text: 'Spend it all on stickers today', isCorrect: false, score: 0, outcome: 'Then you saved nothing for the game.' },
    ],
  },
];

const ks2l5: Exercise[] = [
  {
    id: 'ks2-l5-e1', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Saving part of your money lets you enjoy a little now AND reach your goal.',
    story: 'You get $10 for your birthday. You want a $20 game later.',
    choices: [
      { id: 'a', text: 'Save most of it toward the game', isCorrect: true, score: 3, outcome: 'Great! You are getting closer to your goal.' },
      { id: 'b', text: 'Spend all $10 on stickers today', isCorrect: false, score: 0, outcome: 'Then you have nothing saved for the game.' },
    ],
  },
  {
    id: 'ks2-l5-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'You need $20 and have $10, so you still need $10 more (20 − 10 = 10).',
    prompt: 'The game costs $20. You saved $10. How much more do you need?',
    options: [
      { id: 'a', text: '$10 more', isCorrect: true },
      { id: 'b', text: '$20 more', isCorrect: false },
      { id: 'c', text: 'None, you have enough', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l5-e3', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! You are a Super Saver when you keep money for your goals.',
    statement: 'Saving money helps you reach a goal you care about.',
    isTrue: true,
  },
  {
    id: 'ks2-l5-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'You need $20 and have $15, so you need $5 more.',
    prompt: 'A goal costs $20. You saved $15. How much more do you need?',
    options: [
      { id: 'a', text: '$5 more', isCorrect: true },
      { id: 'b', text: '$15 more', isCorrect: false },
      { id: 'c', text: '$20 more', isCorrect: false },
    ],
  },
  {
    id: 'ks2-l5-e5', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Adding money grows savings; taking money out shrinks them.',
    instruction: 'Bigger savings or smaller savings?',
    buckets: [{ id: 'bigger', label: 'Bigger' }, { id: 'smaller', label: 'Smaller' }],
    items: [
      { id: 'i1', text: 'Add $2 to your piggy bank', bucketId: 'bigger' },
      { id: 'i2', text: 'Save your allowance', bucketId: 'bigger' },
      { id: 'i3', text: 'Take $5 out to spend', bucketId: 'smaller' },
    ],
  },
  {
    id: 'ks2-l5-e6', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'Saving means keeping money; a goal is what you save for.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Save', definition: 'Keep money for later' },
      { id: 'p2', term: 'Goal', definition: 'What you are saving for' },
      { id: 'p3', term: 'Grow', definition: 'Savings getting bigger' },
    ],
  },
  {
    id: 'ks2-l5-e7', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! A Super Saver keeps money for the things they care about.',
    statement: 'A Super Saver keeps money for their goals.',
    isTrue: true,
  },
  {
    id: 'ks2-l5-e8', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Pick a goal, save a little at a time, then reach it!',
    instruction: 'Put the Super Saver steps in order.',
    items: [
      { id: 's1', text: 'Pick a goal', rank: 1 },
      { id: 's2', text: 'Save a little each week', rank: 2 },
      { id: 's3', text: 'Reach your goal!', rank: 3 },
    ],
  },
];

const ks2Guidebook: GuidebookEntry[] = [
  { id: 'ks2-g1', title: 'What Is Saving?', body: 'Saving means keeping some of your money for later instead of spending it all right now.' },
  { id: 'ks2-g2', title: 'Why Save?', body: 'We save so we can buy bigger things later — like a bike, a game, or a special toy. Big things take time to save for.' },
  { id: 'ks2-g3', title: 'The Saving Habit', body: 'Put a little money in your piggy bank every time you get some. Small amounts add up to big amounts!' },
  { id: 'ks2-g4', title: 'Watching It Grow', body: 'The more you save and the longer you wait, the bigger your savings get. $3 + $3 + $3 = $9!' },
];

// ════════════════════════════════════════════════════════════════════════════
// UNIT 3 — SPENDING
// ════════════════════════════════════════════════════════════════════════════

const ks3l1: Exercise[] = [
  {
    id: 'ks3-l1-e1', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Spending means using your money to buy something.',
    prompt: 'What does it mean to SPEND money?',
    options: [
      { id: 'a', text: 'Use money to buy something', isCorrect: true },
      { id: 'b', text: 'Keep money in a piggy bank', isCorrect: false },
      { id: 'c', text: 'Draw a picture of money', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l1-e2', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True — once you spend money on something, that money is gone and belongs to the store.',
    statement: 'When you spend money, you trade it away and it is gone.',
    isTrue: true,
  },
  {
    id: 'ks3-l1-e3', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Spending is paying for things. Saving is keeping money for later.',
    instruction: 'Is it SPENDING or SAVING?',
    buckets: [{ id: 'spend', label: 'Spending' }, { id: 'save', label: 'Saving' }],
    items: [
      { id: 'buytoy', text: 'Buying a toy at the store', bucketId: 'spend' },
      { id: 'icecreambuy', text: 'Paying for ice cream', bucketId: 'spend' },
      { id: 'piggy', text: 'Putting coins in a piggy bank', bucketId: 'save' },
    ],
  },
  {
    id: 'ks3-l1-e4', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Spending means using your money to buy something.',
    prompt: 'Spending money means...',
    options: [
      { id: 'a', text: 'using it to buy something', isCorrect: true },
      { id: 'b', text: 'keeping it forever', isCorrect: false },
      { id: 'c', text: 'drawing on it', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l1-e5', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Spending uses money now; saving keeps it for later; a price is the cost.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Spend', definition: 'Buy something with money' },
      { id: 'p2', term: 'Save', definition: 'Keep money for later' },
      { id: 'p3', term: 'Price', definition: 'How much it costs' },
    ],
  },
  {
    id: 'ks3-l1-e6', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True — when you spend, the money goes to the store and the thing is yours.',
    statement: 'When you spend money, it goes to the store.',
    isTrue: true,
  },
  {
    id: 'ks3-l1-e7', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'Pick what you want, pay for it, then take it home.',
    instruction: 'Put the steps of buying in order.',
    items: [
      { id: 's1', text: 'Pick what you want', rank: 1 },
      { id: 's2', text: 'Pay the money', rank: 2 },
      { id: 's3', text: 'Take your item home', rank: 3 },
    ],
  },
  {
    id: 'ks3-l1-e8', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Buying the thing you really need is a smart way to spend.',
    story: 'You have $3. You need a pencil for school that costs $1.',
    choices: [
      { id: 'a', text: 'Buy the pencil and keep the rest', isCorrect: true, score: 3, outcome: 'Smart! You got what you needed and saved $2.' },
      { id: 'b', text: 'Spend all $3 on candy and skip the pencil', isCorrect: false, score: 0, outcome: 'You still need a pencil for school. Needs first!' },
    ],
  },
];

const ks3l2: Exercise[] = [
  {
    id: 'ks3-l2-e1', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'A smart shopper checks the price and picks what is a good deal.',
    story: 'Two juice boxes are the same. One costs $1 and one costs $3.',
    choices: [
      { id: 'a', text: 'Buy the $1 juice box', isCorrect: true, score: 3, outcome: 'Smart! Same juice, less money. You saved $2!' },
      { id: 'b', text: 'Buy the $3 one for no reason', isCorrect: false, score: 0, outcome: 'Why pay more for the same thing? The $1 one is smarter.' },
    ],
  },
  {
    id: 'ks3-l2-e2', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A smart choice is to think before you buy and pick what is worth it.',
    prompt: 'What should you do before you spend money?',
    options: [
      { id: 'a', text: 'Think about if it is worth it', isCorrect: true },
      { id: 'b', text: 'Buy the very first thing you see', isCorrect: false },
      { id: 'c', text: 'Close your eyes and grab anything', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l2-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True! Comparing prices helps you spend less and keep more money.',
    statement: 'Comparing prices can help you save money.',
    isTrue: true,
  },
  {
    id: 'ks3-l2-e4', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'If two things are the same, the cheaper one is the better deal.',
    prompt: 'Two of the same toy cost $2 and $4. Which is the better deal?',
    options: [
      { id: 'a', text: 'The $2 one', isCorrect: true },
      { id: 'b', text: 'The $4 one', isCorrect: false },
      { id: 'c', text: 'They are the same deal', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l2-e5', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Comparing prices and picking the cheaper same item is smart. Grabbing without looking is not.',
    instruction: 'Smart shopping, or not smart?',
    buckets: [{ id: 'smart', label: 'Smart' }, { id: 'notsmart', label: 'Not smart' }],
    items: [
      { id: 'i1', text: 'Picking the cheaper of two same toys', bucketId: 'smart' },
      { id: 'i2', text: 'Comparing prices first', bucketId: 'smart' },
      { id: 'i3', text: 'Paying more for the same thing for no reason', bucketId: 'notsmart' },
      { id: 'i4', text: 'Grabbing the first thing without looking', bucketId: 'notsmart' },
    ],
  },
  {
    id: 'ks3-l2-e6', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True! Comparing prices helps you spend less and keep more.',
    statement: 'Comparing prices can help you save money.',
    isTrue: true,
  },
  {
    id: 'ks3-l2-e7', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Smart shoppers compare, look for deals, and think before buying.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Compare', definition: 'Look at both prices' },
      { id: 'p2', term: 'Deal', definition: 'A good, low price' },
      { id: 'p3', term: 'Think', definition: 'Decide before you buy' },
    ],
  },
  {
    id: 'ks3-l2-e8', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'Same crayons, lower price — Max picked the smart deal and kept $2.',
    panels: [
      { text: 'Max sees the same crayons for $3 at one shop and $5 at another.', speaker: 'Story' },
      { text: 'Max buys the $3 box and keeps the extra $2.', speaker: 'Story' },
    ],
    choicePrompt: 'Was Max smart?',
    choices: [
      { id: 'a', text: 'Yes — same crayons, lower price', isCorrect: true, outcome: 'Yes! Max saved $2 by comparing prices.' },
      { id: 'b', text: 'No — he should have paid more', isCorrect: false, outcome: 'Why pay more for the same thing? The $3 box was smarter.' },
    ],
  },
];

const ks3l3: Exercise[] = [
  {
    id: 'ks3-l3-e1', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A smart plan is to spend some and save some — not spend it all.',
    prompt: 'You get $10. What is a smart plan?',
    options: [
      { id: 'a', text: 'Spend a little and save a little', isCorrect: true },
      { id: 'b', text: 'Spend every penny right away', isCorrect: false },
      { id: 'c', text: 'Throw it in the trash', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l3-e2', kind: 'miniStory', competencyId: 'behavior',
    rationale: 'Ava spent some on a snack and saved the rest. Now she has a snack AND savings!',
    panels: [
      { text: 'Ava has $6. She is a little hungry and also saving for a book.', speaker: 'Story' },
      { text: 'She spends $2 on a snack and puts $4 in her piggy bank.', speaker: 'Story' },
    ],
    choicePrompt: 'Was Ava’s choice smart?',
    choices: [
      { id: 'a', text: 'Yes — she spent some and saved some', isCorrect: true, outcome: 'Yes! That is a great money plan.' },
      { id: 'b', text: 'No — she should have spent it all', isCorrect: false, outcome: 'Saving some is smart so she can reach her book goal.' },
    ],
  },
  {
    id: 'ks3-l3-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'False — if you spend it all, you have nothing left to save or for later.',
    statement: 'It is always best to spend all your money at once.',
    isTrue: false,
  },
  {
    id: 'ks3-l3-e4', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A smart plan is to spend some and save some.',
    prompt: 'You get $10. What is a smart plan?',
    options: [
      { id: 'a', text: 'Spend some and save some', isCorrect: true },
      { id: 'b', text: 'Spend it all in one minute', isCorrect: false },
      { id: 'c', text: 'Lose it on purpose', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l3-e5', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Spending some and saving some is a smart plan. Spending it all is not.',
    instruction: 'Smart money plan, or not?',
    buckets: [{ id: 'smart', label: 'Smart plan' }, { id: 'notsmart', label: 'Not smart' }],
    items: [
      { id: 'i1', text: 'Spend $5, save $5', bucketId: 'smart' },
      { id: 'i2', text: 'Save $4, spend $6', bucketId: 'smart' },
      { id: 'i3', text: 'Spend all $10 at once', bucketId: 'notsmart' },
      { id: 'i4', text: 'Throw the money away', bucketId: 'notsmart' },
    ],
  },
  {
    id: 'ks3-l3-e6', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True — saving some instead of spending it all is a smart habit.',
    statement: 'It is smart to save some money instead of spending it all.',
    isTrue: true,
  },
  {
    id: 'ks3-l3-e7', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'Get money, spend a little, then save the rest.',
    instruction: 'Put the smart money plan in order.',
    items: [
      { id: 's1', text: 'Get some money', rank: 1 },
      { id: 's2', text: 'Spend a little', rank: 2 },
      { id: 's3', text: 'Save the rest', rank: 3 },
    ],
  },
  {
    id: 'ks3-l3-e8', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Spending a little now and saving the rest is a balanced plan.',
    story: 'You have $6. You want a $2 snack and are saving for a book.',
    choices: [
      { id: 'a', text: 'Buy the snack and save the other $4', isCorrect: true, score: 3, outcome: 'Nice balance! Snack now and $4 toward the book.' },
      { id: 'b', text: 'Spend all $6 on snacks', isCorrect: false, score: 0, outcome: 'Then nothing is left for the book.' },
    ],
  },
];

const ks3l4: Exercise[] = [
  {
    id: 'ks3-l4-e1', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A price tag tells you how much money something costs.',
    prompt: 'What does a price tag tell you?',
    options: [
      { id: 'a', text: 'How much money it costs', isCorrect: true },
      { id: 'b', text: 'What color it is', isCorrect: false },
      { id: 'c', text: 'How tall you are', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l4-e2', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: '$2 is less than $5, so the $2 toy costs less.',
    prompt: 'A ball costs $2 and a doll costs $5. Which costs LESS?',
    options: [
      { id: 'a', text: 'The ball ($2)', isCorrect: true },
      { id: 'b', text: 'The doll ($5)', isCorrect: false },
      { id: 'c', text: 'They cost the same', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l4-e3', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'Order from cheapest to most expensive: $1, $3, $7.',
    instruction: 'Put the prices in order from LEAST to MOST money.',
    items: [
      { id: 'p1', text: '$1 eraser', rank: 1 },
      { id: 'p2', text: '$3 marker set', rank: 2 },
      { id: 'p3', text: '$7 backpack', rank: 3 },
    ],
  },
  {
    id: 'ks3-l4-e4', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A price tag tells you how much money something costs.',
    prompt: 'What does a price tag tell you?',
    options: [
      { id: 'a', text: 'How much it costs', isCorrect: true },
      { id: 'b', text: 'What it tastes like', isCorrect: false },
      { id: 'c', text: 'How old it is', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l4-e5', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True — $2 is a smaller number than $5, so it costs less.',
    statement: 'A $2 toy costs less than a $5 toy.',
    isTrue: true,
  },
  {
    id: 'ks3-l4-e6', kind: 'categorize', competencyId: 'behavior',
    rationale: 'The smaller price costs less; the bigger price costs more.',
    instruction: 'Which costs LESS in each pair? Sort them.',
    buckets: [{ id: 'less', label: 'Costs less' }, { id: 'more', label: 'Costs more' }],
    items: [
      { id: 'i1', text: 'A $1 sticker', bucketId: 'less' },
      { id: 'i2', text: 'A $9 toy', bucketId: 'more' },
      { id: 'i3', text: 'A $2 pen', bucketId: 'less' },
      { id: 'i4', text: 'A $8 book', bucketId: 'more' },
    ],
  },
  {
    id: 'ks3-l4-e7', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Reading price tags helps you know what each item costs.',
    instruction: 'Match each item to its price.',
    pairs: [
      { id: 'p1', term: 'Eraser', definition: '$1' },
      { id: 'p2', term: 'Marker set', definition: '$3' },
      { id: 'p3', term: 'Backpack', definition: '$7' },
    ],
  },
  {
    id: 'ks3-l4-e8', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'The same ball is cheaper at one store — pick the lower price.',
    story: 'The same ball is $3 at one store and $5 at another.',
    choices: [
      { id: 'a', text: 'Buy the $3 ball', isCorrect: true, score: 3, outcome: 'Smart shopper! You kept $2.' },
      { id: 'b', text: 'Buy the $5 ball', isCorrect: false, score: 0, outcome: 'Same ball, higher price — the $3 one is better.' },
    ],
  },
];

const ks3Practice: Exercise[] = [
  {
    id: 'ks3-pr-e1', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'Spending is using money to buy things.',
    prompt: 'Spending money means...',
    options: [
      { id: 'a', text: 'using it to buy something', isCorrect: true },
      { id: 'b', text: 'saving it forever', isCorrect: false },
      { id: 'c', text: 'painting with it', isCorrect: false },
    ],
  },
  {
    id: 'ks3-pr-e2', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Same toy, lower price — pick the cheaper one and keep the extra money.',
    story: 'The same teddy bear is $4 at one store and $6 at another.',
    choices: [
      { id: 'a', text: 'Buy the $4 one', isCorrect: true, score: 3, outcome: 'Smart shopper! You kept $2.' },
      { id: 'b', text: 'Buy the $6 one', isCorrect: false, score: 0, outcome: 'Same bear costs more — the $4 one is the better deal.' },
    ],
  },
  {
    id: 'ks3-pr-e3', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Buying is spending. Putting money away is saving.',
    instruction: 'Spending or saving?',
    buckets: [{ id: 'spend', label: 'Spending' }, { id: 'save', label: 'Saving' }],
    items: [
      { id: 'candy', text: 'Buying candy', bucketId: 'spend' },
      { id: 'jar', text: 'Putting $1 in a jar', bucketId: 'save' },
      { id: 'game', text: 'Paying for a game', bucketId: 'spend' },
    ],
  },
  {
    id: 'ks3-pr-e4', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: '$1 is less than $4, so the sticker costs less.',
    prompt: 'A sticker is $1 and a toy is $4. Which costs less?',
    options: [
      { id: 'a', text: 'The sticker', isCorrect: true },
      { id: 'b', text: 'The toy', isCorrect: false },
      { id: 'c', text: 'Same price', isCorrect: false },
    ],
  },
  {
    id: 'ks3-pr-e5', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A smart plan is to spend some and save some.',
    prompt: 'A smart money plan is to...',
    options: [
      { id: 'a', text: 'spend some and save some', isCorrect: true },
      { id: 'b', text: 'spend it all right now', isCorrect: false },
      { id: 'c', text: 'never use money', isCorrect: false },
    ],
  },
  {
    id: 'ks3-pr-e6', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True — thinking before you buy is a smart habit.',
    statement: 'A smart spender thinks before they buy.',
    isTrue: true,
  },
  {
    id: 'ks3-pr-e7', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Same teddy bear, lower price — pick the cheaper one.',
    story: 'The same teddy bear is $4 at one store and $7 at another.',
    choices: [
      { id: 'a', text: 'Buy the $4 bear', isCorrect: true, score: 3, outcome: 'Smart! You saved $3.' },
      { id: 'b', text: 'Buy the $7 bear', isCorrect: false, score: 0, outcome: 'Same bear, more money — the $4 one is better.' },
    ],
  },
  {
    id: 'ks3-pr-e8', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Buying is spending; putting money away is saving.',
    instruction: 'Spending or saving?',
    buckets: [{ id: 'spend', label: 'Spending' }, { id: 'save', label: 'Saving' }],
    items: [
      { id: 'i1', text: 'Buying a snack', bucketId: 'spend' },
      { id: 'i2', text: 'Putting $2 in a jar', bucketId: 'save' },
      { id: 'i3', text: 'Paying for a toy', bucketId: 'spend' },
    ],
  },
];

const ks3l5: Exercise[] = [
  {
    id: 'ks3-l5-e1', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A smart spender thinks first and compares prices.',
    prompt: 'A smart spender always...',
    options: [
      { id: 'a', text: 'thinks before buying', isCorrect: true },
      { id: 'b', text: 'buys everything they see', isCorrect: false },
      { id: 'c', text: 'never has money', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l5-e2', kind: 'scenarioDecision', competencyId: 'behavior',
    rationale: 'Spending a little and saving the rest is a balanced, smart plan.',
    story: 'You have $5. You want a $2 snack now and are saving for a $10 toy.',
    choices: [
      { id: 'a', text: 'Buy the snack and save $3', isCorrect: true, score: 3, outcome: 'Nice balance! Snack now, and $3 closer to the toy.' },
      { id: 'b', text: 'Spend all $5 on snacks', isCorrect: false, score: 0, outcome: 'Then you saved nothing for the toy you want.' },
    ],
  },
  {
    id: 'ks3-l5-e3', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True! Spending some and saving some is a smart money plan.',
    statement: 'A smart plan is to spend some money and save some money.',
    isTrue: true,
  },
  {
    id: 'ks3-l5-e4', kind: 'categorize', competencyId: 'behavior',
    rationale: 'Smart spenders compare prices and plan. Buying everything you see is not smart.',
    instruction: 'Smart spender, or not?',
    buckets: [{ id: 'smart', label: 'Smart spender' }, { id: 'notsmart', label: 'Not smart' }],
    items: [
      { id: 'i1', text: 'Comparing prices first', bucketId: 'smart' },
      { id: 'i2', text: 'Saving some money', bucketId: 'smart' },
      { id: 'i3', text: 'Buying everything you see', bucketId: 'notsmart' },
      { id: 'i4', text: 'Spending without thinking', bucketId: 'notsmart' },
    ],
  },
  {
    id: 'ks3-l5-e5', kind: 'matchPairs', competencyId: 'behavior',
    rationale: 'Spending, saving, and comparing are all parts of being a smart spender.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Spend', definition: 'Use money to buy' },
      { id: 'p2', term: 'Save', definition: 'Keep money for later' },
      { id: 'p3', term: 'Compare', definition: 'Check which costs less' },
    ],
  },
  {
    id: 'ks3-l5-e6', kind: 'multipleChoice', competencyId: 'behavior',
    rationale: 'A $1 sticker costs less than a $4 toy.',
    prompt: 'A sticker is $1 and a toy is $4. Which costs less?',
    options: [
      { id: 'a', text: 'The sticker', isCorrect: true },
      { id: 'b', text: 'The toy', isCorrect: false },
      { id: 'c', text: 'They cost the same', isCorrect: false },
    ],
  },
  {
    id: 'ks3-l5-e7', kind: 'trueFalse', competencyId: 'behavior',
    rationale: 'True! Knowing prices helps you make smart spending choices.',
    statement: 'Knowing prices helps you spend money wisely.',
    isTrue: true,
  },
  {
    id: 'ks3-l5-e8', kind: 'tapToOrder', competencyId: 'behavior',
    rationale: 'Check the price, compare, then decide to buy.',
    instruction: 'Put the smart spender steps in order.',
    items: [
      { id: 's1', text: 'Check the price', rank: 1 },
      { id: 's2', text: 'Compare which costs less', rank: 2 },
      { id: 's3', text: 'Buy the better deal', rank: 3 },
    ],
  },
];

const ks3Guidebook: GuidebookEntry[] = [
  { id: 'ks3-g1', title: 'What Is Spending?', body: 'Spending means using your money to buy something. Once you spend it, that money is gone.' },
  { id: 'ks3-g2', title: 'Smart Choices', body: 'Before you buy, think: do I really want this, and is it a good price? If the same thing is cheaper somewhere, that is a better deal.' },
  { id: 'ks3-g3', title: 'Don’t Spend It All', body: 'A smart money plan is to spend SOME and save SOME. That way you enjoy a little now and still reach your goals later.' },
  { id: 'ks3-g4', title: 'Reading Price Tags', body: 'A price tag shows how much money something costs. A smaller number means it costs less money.' },
];

// ════════════════════════════════════════════════════════════════════════════
// UNIT 4 — NEEDS VS WANTS
// ════════════════════════════════════════════════════════════════════════════

const ks4l1: Exercise[] = [
  {
    id: 'ks4-l1-e1', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'A NEED is something you must have to live and be healthy, like food, water, and a home.',
    prompt: 'What is a NEED?',
    options: [
      { id: 'a', text: 'Something you must have, like food and water', isCorrect: true },
      { id: 'b', text: 'A fun toy', isCorrect: false },
      { id: 'c', text: 'Candy', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l1-e2', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Food, water, a home, and clothes are needs — we must have them.',
    instruction: 'Tap the things that are NEEDS.',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'notneed', label: 'Not a need' }],
    items: [
      { id: 'food', text: 'Food to eat', bucketId: 'need' },
      { id: 'water', text: 'Clean water', bucketId: 'need' },
      { id: 'home', text: 'A home to live in', bucketId: 'need' },
      { id: 'balloon', text: 'A shiny balloon', bucketId: 'notneed' },
    ],
  },
  {
    id: 'ks4-l1-e3', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! We need food, water, clothes, and a home to be safe and healthy.',
    statement: 'Food and a place to live are needs.',
    isTrue: true,
  },
  {
    id: 'ks4-l1-e4', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'Food is something you must have to live, so it is a need.',
    prompt: 'Which one is a NEED?',
    options: [
      { id: 'a', text: 'Food to eat', isCorrect: true },
      { id: 'b', text: 'A toy robot', isCorrect: false },
      { id: 'c', text: 'A bag of candy', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l1-e5', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'Food and water are needs. A toy is a want.',
    instruction: 'Match each thing to Need or Want.',
    pairs: [
      { id: 'p1', term: 'Food', definition: 'Need' },
      { id: 'p2', term: 'Water', definition: 'Need' },
      { id: 'p3', term: 'Toy', definition: 'Want' },
    ],
  },
  {
    id: 'ks4-l1-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! Clean water is something we must have to live.',
    statement: 'Clean water is a need.',
    isTrue: true,
  },
  {
    id: 'ks4-l1-e7', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'When money is small, take care of a need (food) before a want (toy).',
    story: 'You have $5. You are hungry. Lunch is $5 and a toy is $5.',
    choices: [
      { id: 'a', text: 'Buy lunch — it is a need', isCorrect: true, score: 3, outcome: 'Right! Needs come first.' },
      { id: 'b', text: 'Buy the toy and stay hungry', isCorrect: false, score: 0, outcome: 'A toy is fun, but you need to eat first.' },
    ],
  },
  {
    id: 'ks4-l1-e8', kind: 'miniStory', competencyId: 'budgetDesign',
    rationale: 'On a cold day, a warm coat is a need that keeps you safe and healthy.',
    panels: [
      { text: 'It is freezing outside. Sam has money for ONE thing: a warm coat or a fun balloon.', speaker: 'Story' },
      { text: 'Sam picks the coat to stay warm.', speaker: 'Story' },
    ],
    choicePrompt: 'Was the coat a need or a want?',
    choices: [
      { id: 'a', text: 'A need — it keeps Sam warm and safe', isCorrect: true, outcome: 'Yes! In the cold, a coat is a need.' },
      { id: 'b', text: 'A want — coats are just for fun', isCorrect: false, outcome: 'On a freezing day, a coat is a need, not a want.' },
    ],
  },
];

const ks4l2: Exercise[] = [
  {
    id: 'ks4-l2-e1', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'A WANT is something nice to have but you can live without it, like toys or candy.',
    prompt: 'What is a WANT?',
    options: [
      { id: 'a', text: 'Something nice but not needed, like a toy', isCorrect: true },
      { id: 'b', text: 'Water to drink', isCorrect: false },
      { id: 'c', text: 'A safe home', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l2-e2', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Toys, video games, and candy are wants — they are fun but not needed to live.',
    instruction: 'Tap the things that are WANTS.',
    buckets: [{ id: 'want', label: 'Want' }, { id: 'need', label: 'Need' }],
    items: [
      { id: 'toy', text: 'A new toy', bucketId: 'want' },
      { id: 'game', text: 'A video game', bucketId: 'want' },
      { id: 'candy', text: 'Candy', bucketId: 'want' },
      { id: 'dinner', text: 'A healthy dinner', bucketId: 'need' },
    ],
  },
  {
    id: 'ks4-l2-e3', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! A toy is fun to have, but you can live without it — that makes it a want.',
    statement: 'A toy is a want, not a need.',
    isTrue: true,
  },
  {
    id: 'ks4-l2-e4', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'A toy is nice to have but not needed to live, so it is a want.',
    prompt: 'Which one is a WANT?',
    options: [
      { id: 'a', text: 'A new toy', isCorrect: true },
      { id: 'b', text: 'Water to drink', isCorrect: false },
      { id: 'c', text: 'A safe home', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l2-e5', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'Toys and candy are wants. Water is a need.',
    instruction: 'Match each thing to Want or Need.',
    pairs: [
      { id: 'p1', term: 'Toy', definition: 'Want' },
      { id: 'p2', term: 'Candy', definition: 'Want' },
      { id: 'p3', term: 'Water', definition: 'Need' },
    ],
  },
  {
    id: 'ks4-l2-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! A video game is fun but you can live without it, so it is a want.',
    statement: 'A video game is a want.',
    isTrue: true,
  },
  {
    id: 'ks4-l2-e7', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Wants are nice extras; needs keep you healthy and safe.',
    instruction: 'Sort each into Want or Need.',
    buckets: [{ id: 'want', label: 'Want' }, { id: 'need', label: 'Need' }],
    items: [
      { id: 'i1', text: 'A toy drum', bucketId: 'want' },
      { id: 'i2', text: 'A candy bar', bucketId: 'want' },
      { id: 'i3', text: 'A healthy dinner', bucketId: 'need' },
      { id: 'i4', text: 'A warm bed', bucketId: 'need' },
    ],
  },
  {
    id: 'ks4-l2-e8', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'When money is tight, a want like a game can wait.',
    story: 'You have only a little money. You want a game, but you also need new socks.',
    choices: [
      { id: 'a', text: 'Buy the socks first', isCorrect: true, score: 3, outcome: 'Right — socks are the need. The game can wait.' },
      { id: 'b', text: 'Buy the game first', isCorrect: false, score: 0, outcome: 'The game is a want. Take care of the need first.' },
    ],
  },
];

const ks4l3: Exercise[] = [
  {
    id: 'ks4-l3-e1', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'When money is small, pay for needs first. Wants can wait.',
    prompt: 'If you only have a little money, what should you pay for first?',
    options: [
      { id: 'a', text: 'Needs, like food', isCorrect: true },
      { id: 'b', text: 'A big pile of toys', isCorrect: false },
      { id: 'c', text: 'Candy for everyone', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l3-e2', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'Lunch is a need. A toy is a want. Take care of the need first.',
    story: 'You have $5. You are hungry and lunch costs $5. A toy also costs $5.',
    choices: [
      { id: 'a', text: 'Buy lunch — that is a need', isCorrect: true, score: 3, outcome: 'Right! Needs come before wants.' },
      { id: 'b', text: 'Buy the toy and stay hungry', isCorrect: false, score: 0, outcome: 'A toy is fun, but you need to eat first.' },
    ],
  },
  {
    id: 'ks4-l3-e3', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! Needs come first. After your needs are covered, you can spend on wants.',
    statement: 'We take care of needs before we spend on wants.',
    isTrue: true,
  },
  {
    id: 'ks4-l3-e4', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'When money is small, pay for needs first. Wants can wait.',
    prompt: 'If you have only a little money, what do you pay for first?',
    options: [
      { id: 'a', text: 'Needs, like food', isCorrect: true },
      { id: 'b', text: 'A pile of toys', isCorrect: false },
      { id: 'c', text: 'Candy for everyone', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l3-e5', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Needs keep you healthy and safe. Wants are extra fun.',
    instruction: 'Need or Want?',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'want', label: 'Want' }],
    items: [
      { id: 'i1', text: 'Medicine when you are sick', bucketId: 'need' },
      { id: 'i2', text: 'Shoes for your feet', bucketId: 'need' },
      { id: 'i3', text: 'A sticker pack', bucketId: 'want' },
      { id: 'i4', text: 'A toy car', bucketId: 'want' },
    ],
  },
  {
    id: 'ks4-l3-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! We take care of needs before we spend on wants.',
    statement: 'Needs come before wants.',
    isTrue: true,
  },
  {
    id: 'ks4-l3-e7', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'A need is something you must have; a want is something nice to have.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Need', definition: 'Something you must have' },
      { id: 'p2', term: 'Want', definition: 'Something nice to have' },
      { id: 'p3', term: 'First', definition: 'Needs come before wants' },
    ],
  },
  {
    id: 'ks4-l3-e8', kind: 'miniStory', competencyId: 'budgetDesign',
    rationale: 'Lia paid for her bus ride (a need) before a treat (a want).',
    panels: [
      { text: 'Lia has $2. She needs $2 for the bus home, but a cookie also costs $2.', speaker: 'Story' },
      { text: 'Lia pays for the bus so she can get home.', speaker: 'Story' },
    ],
    choicePrompt: 'Did Lia choose well?',
    choices: [
      { id: 'a', text: 'Yes — the bus ride home is a need', isCorrect: true, outcome: 'Yes! Getting home is a need; the cookie can wait.' },
      { id: 'b', text: 'No — she should have bought the cookie', isCorrect: false, outcome: 'Then she could not get home. Needs come first.' },
    ],
  },
];

const ks4l4: Exercise[] = [
  {
    id: 'ks4-l4-e1', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Needs: food, a coat in winter, a bed. Wants: a game, a fancy toy, extra candy.',
    instruction: 'Sort each one into Need or Want.',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'want', label: 'Want' }],
    items: [
      { id: 'coat', text: 'A warm coat in winter', bucketId: 'need' },
      { id: 'bed', text: 'A bed to sleep in', bucketId: 'need' },
      { id: 'game2', text: 'A new video game', bucketId: 'want' },
      { id: 'toy2', text: 'A fancy robot toy', bucketId: 'want' },
    ],
  },
  {
    id: 'ks4-l4-e2', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'Match each thing to whether it is a need or a want.',
    instruction: 'Match each item to Need or Want.',
    pairs: [
      { id: 'p1', term: 'Water', definition: 'Need' },
      { id: 'p2', term: 'Toy car', definition: 'Want' },
      { id: 'p3', term: 'Healthy food', definition: 'Need' },
    ],
  },
  {
    id: 'ks4-l4-e3', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'False — a warm coat in cold weather is a need, not a want!',
    statement: 'A warm coat in freezing weather is just a want.',
    isTrue: false,
  },
  {
    id: 'ks4-l4-e4', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'A home to live in is something you must have, so it is a need.',
    prompt: 'Which one is a NEED?',
    options: [
      { id: 'a', text: 'A home to live in', isCorrect: true },
      { id: 'b', text: 'A video game', isCorrect: false },
      { id: 'c', text: 'A balloon', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l4-e5', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True — a warm coat in winter keeps you safe, so it is a need.',
    statement: 'A warm coat in winter is a need.',
    isTrue: true,
  },
  {
    id: 'ks4-l4-e6', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Breakfast and a doctor visit are needs. A comic and a theme park are wants.',
    instruction: 'Need or Want?',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'want', label: 'Want' }],
    items: [
      { id: 'i1', text: 'Breakfast', bucketId: 'need' },
      { id: 'i2', text: 'A doctor visit when sick', bucketId: 'need' },
      { id: 'i3', text: 'A comic book', bucketId: 'want' },
      { id: 'i4', text: 'A theme park ticket', bucketId: 'want' },
    ],
  },
  {
    id: 'ks4-l4-e7', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'A raincoat on a rainy school day is a need; a toy is a want.',
    story: 'It is raining and you have a little money. You need a raincoat and want a toy.',
    choices: [
      { id: 'a', text: 'Get the raincoat', isCorrect: true, score: 3, outcome: 'Right — staying dry is a need.' },
      { id: 'b', text: 'Get the toy and get soaked', isCorrect: false, score: 0, outcome: 'The raincoat is the need today.' },
    ],
  },
  {
    id: 'ks4-l4-e8', kind: 'tapToOrder', competencyId: 'budgetDesign',
    rationale: 'With a little money, buy the need first, then a want, then extras.',
    instruction: 'Order what to buy FIRST to LAST with a little money.',
    items: [
      { id: 's1', text: 'Food (a need)', rank: 1 },
      { id: 's2', text: 'A small toy (a want)', rank: 2 },
      { id: 's3', text: 'Extra candy (a treat)', rank: 3 },
    ],
  },
];

const ks4Practice: Exercise[] = [
  {
    id: 'ks4-pr-e1', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'Water is something you must have, so it is a need.',
    prompt: 'Which one is a NEED?',
    options: [
      { id: 'a', text: 'Clean water', isCorrect: true },
      { id: 'b', text: 'A toy drum', isCorrect: false },
      { id: 'c', text: 'A lollipop', isCorrect: false },
    ],
  },
  {
    id: 'ks4-pr-e2', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'A video game is fun but not needed to live, so it is a want.',
    prompt: 'Which one is a WANT?',
    options: [
      { id: 'a', text: 'A video game', isCorrect: true },
      { id: 'b', text: 'Food', isCorrect: false },
      { id: 'c', text: 'A home', isCorrect: false },
    ],
  },
  {
    id: 'ks4-pr-e3', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Needs keep you safe and healthy. Wants are extra fun.',
    instruction: 'Need or Want?',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'want', label: 'Want' }],
    items: [
      { id: 'meds', text: 'Medicine when sick', bucketId: 'need' },
      { id: 'sticker', text: 'A sticker pack', bucketId: 'want' },
      { id: 'shoes', text: 'Shoes for your feet', bucketId: 'need' },
    ],
  },
  {
    id: 'ks4-pr-e4', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'Needs first! Pay for the things you must have before extras.',
    story: 'You have a little money. You need socks and you want a balloon.',
    choices: [
      { id: 'a', text: 'Buy the socks first', isCorrect: true, score: 3, outcome: 'Yes — needs come first.' },
      { id: 'b', text: 'Buy the balloon first', isCorrect: false, score: 0, outcome: 'The balloon is a want — socks are the need.' },
    ],
  },
  {
    id: 'ks4-pr-e5', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'Healthy food is something you must have, so it is a need.',
    prompt: 'Which one is a NEED?',
    options: [
      { id: 'a', text: 'Healthy food', isCorrect: true },
      { id: 'b', text: 'A toy drum', isCorrect: false },
      { id: 'c', text: 'A lollipop', isCorrect: false },
    ],
  },
  {
    id: 'ks4-pr-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True — a candy bar is fun but not needed, so it is a want.',
    statement: 'A candy bar is a want, not a need.',
    isTrue: true,
  },
  {
    id: 'ks4-pr-e7', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Needs keep you safe and healthy; wants are nice extras.',
    instruction: 'Need or Want?',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'want', label: 'Want' }],
    items: [
      { id: 'i1', text: 'A warm coat in winter', bucketId: 'need' },
      { id: 'i2', text: 'Clean water', bucketId: 'need' },
      { id: 'i3', text: 'A video game', bucketId: 'want' },
    ],
  },
  {
    id: 'ks4-pr-e8', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'Needs first — buy the socks before the balloon.',
    story: 'You have a little money. You need socks and want a balloon.',
    choices: [
      { id: 'a', text: 'Buy the socks first', isCorrect: true, score: 3, outcome: 'Yes — needs come first.' },
      { id: 'b', text: 'Buy the balloon first', isCorrect: false, score: 0, outcome: 'The balloon is a want — socks are the need.' },
    ],
  },
];

const ks4l5: Exercise[] = [
  {
    id: 'ks4-l5-e1', kind: 'categorize', competencyId: 'budgetDesign',
    rationale: 'Great sorting! Needs keep us safe and healthy; wants are nice extras.',
    instruction: 'Last sort — Need or Want?',
    buckets: [{ id: 'need', label: 'Need' }, { id: 'want', label: 'Want' }],
    items: [
      { id: 'breakfast', text: 'Breakfast', bucketId: 'need' },
      { id: 'theme', text: 'A theme park ticket', bucketId: 'want' },
      { id: 'doctor', text: 'A doctor visit when sick', bucketId: 'need' },
      { id: 'comic', text: 'A comic book', bucketId: 'want' },
    ],
  },
  {
    id: 'ks4-l5-e2', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'When money is tight, needs come before wants.',
    prompt: 'What do we pay for first when money is small?',
    options: [
      { id: 'a', text: 'Needs', isCorrect: true },
      { id: 'b', text: 'Wants', isCorrect: false },
      { id: 'c', text: 'Nothing ever', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l5-e3', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! Knowing needs from wants helps you spend money wisely.',
    statement: 'Knowing the difference between needs and wants helps you make smart choices.',
    isTrue: true,
  },
  {
    id: 'ks4-l5-e4', kind: 'matchPairs', competencyId: 'budgetDesign',
    rationale: 'Food and a home are needs. A game is a want.',
    instruction: 'Match each thing to Need or Want.',
    pairs: [
      { id: 'p1', term: 'Food', definition: 'Need' },
      { id: 'p2', term: 'A home', definition: 'Need' },
      { id: 'p3', term: 'A game', definition: 'Want' },
    ],
  },
  {
    id: 'ks4-l5-e5', kind: 'multipleChoice', competencyId: 'budgetDesign',
    rationale: 'When money is small, needs come before wants.',
    prompt: 'What do we pay for first when money is small?',
    options: [
      { id: 'a', text: 'Needs', isCorrect: true },
      { id: 'b', text: 'Wants', isCorrect: false },
      { id: 'c', text: 'Nothing ever', isCorrect: false },
    ],
  },
  {
    id: 'ks4-l5-e6', kind: 'trueFalse', competencyId: 'budgetDesign',
    rationale: 'True! Knowing needs from wants helps you make smart choices.',
    statement: 'Knowing needs from wants helps you spend wisely.',
    isTrue: true,
  },
  {
    id: 'ks4-l5-e7', kind: 'scenarioDecision', competencyId: 'budgetDesign',
    rationale: 'A doctor visit when sick is a need; a new toy is a want.',
    story: 'You are sick and have a little money. You need medicine and want a toy.',
    choices: [
      { id: 'a', text: 'Buy the medicine', isCorrect: true, score: 3, outcome: 'Right — getting better is a need.' },
      { id: 'b', text: 'Buy the toy and stay sick', isCorrect: false, score: 0, outcome: 'Medicine is the need when you are sick.' },
    ],
  },
  {
    id: 'ks4-l5-e8', kind: 'tapToOrder', competencyId: 'budgetDesign',
    rationale: 'Decide if it is a need, take care of needs first, then enjoy wants.',
    instruction: 'Put the steps in order.',
    items: [
      { id: 's1', text: 'Ask: is it a need or a want?', rank: 1 },
      { id: 's2', text: 'Pay for needs first', rank: 2 },
      { id: 's3', text: 'Enjoy wants if money is left', rank: 3 },
    ],
  },
];

const ks4Guidebook: GuidebookEntry[] = [
  { id: 'ks4-g1', title: 'What Is a Need?', body: 'A need is something you must have to live and stay healthy — like food, clean water, clothes, and a home.' },
  { id: 'ks4-g2', title: 'What Is a Want?', body: 'A want is something nice to have but you can live without — like toys, candy, and video games. Wants are fun, but they are not needed.' },
  { id: 'ks4-g3', title: 'Needs Come First', body: 'When you only have a little money, pay for needs first. Wants can wait until your needs are taken care of.' },
  { id: 'ks4-g4', title: 'Sorting Needs and Wants', body: 'Ask: "Can I live and stay healthy without it?" If yes, it is a want. If no, it is a need.' },
];

// ════════════════════════════════════════════════════════════════════════════
// UNIT 5 — EARNING MONEY
// ════════════════════════════════════════════════════════════════════════════

const ks5l1: Exercise[] = [
  {
    id: 'ks5-l1-e1', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'People earn money by working — doing a job and getting paid for it.',
    prompt: 'How do people EARN money?',
    options: [
      { id: 'a', text: 'By working at a job', isCorrect: true },
      { id: 'b', text: 'By sleeping all day', isCorrect: false },
      { id: 'c', text: 'Money grows on trees', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l1-e2', kind: 'matchPairs', competencyId: 'incomeGrowth',
    rationale: 'Different workers do different jobs to earn money.',
    instruction: 'Match the worker to what they do.',
    pairs: [
      { id: 'p1', term: 'Baker', definition: 'Makes bread' },
      { id: 'p2', term: 'Doctor', definition: 'Helps sick people' },
      { id: 'p3', term: 'Bus driver', definition: 'Drives people around' },
    ],
  },
  {
    id: 'ks5-l1-e3', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True! When grown-ups go to work and do a job, they earn money.',
    statement: 'People earn money by doing a job.',
    isTrue: true,
  },
  {
    id: 'ks5-l1-e4', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'People earn money by working at a job.',
    prompt: 'How do grown-ups usually earn money?',
    options: [
      { id: 'a', text: 'By working at a job', isCorrect: true },
      { id: 'b', text: 'By sleeping all day', isCorrect: false },
      { id: 'c', text: 'It falls from the sky', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l1-e5', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Doing a job or chore can earn money. Playing and napping are just for fun.',
    instruction: 'Earns money, or just fun?',
    buckets: [{ id: 'earn', label: 'Earns money' }, { id: 'fun', label: 'Just fun' }],
    items: [
      { id: 'i1', text: 'Working at a job', bucketId: 'earn' },
      { id: 'i2', text: 'Doing chores for pay', bucketId: 'earn' },
      { id: 'i3', text: 'Playing tag', bucketId: 'fun' },
      { id: 'i4', text: 'Taking a nap', bucketId: 'fun' },
    ],
  },
  {
    id: 'ks5-l1-e6', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True! People earn money by doing a job.',
    statement: 'People earn money by doing a job.',
    isTrue: true,
  },
  {
    id: 'ks5-l1-e7', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'First you do the work, then you get paid, then you can use the money.',
    instruction: 'Put the steps in order.',
    items: [
      { id: 's1', text: 'Do the work', rank: 1 },
      { id: 's2', text: 'Get paid', rank: 2 },
      { id: 's3', text: 'Use the money', rank: 3 },
    ],
  },
  {
    id: 'ks5-l1-e8', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'To earn money, you do work that people will pay for.',
    story: 'You want to earn $5. A neighbor will pay $5 to rake their leaves.',
    choices: [
      { id: 'a', text: 'Rake the leaves to earn the $5', isCorrect: true, score: 3, outcome: 'Yes! Doing the job earns you money.' },
      { id: 'b', text: 'Wait and hope $5 appears', isCorrect: false, score: 0, outcome: 'Money does not just appear — you earn it by working.' },
    ],
  },
];

const ks5l2: Exercise[] = [
  {
    id: 'ks5-l2-e1', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'Kids can earn money too — by doing chores or helping out!',
    prompt: 'How can a KID earn money?',
    options: [
      { id: 'a', text: 'By doing chores like cleaning up', isCorrect: true },
      { id: 'b', text: 'By watching TV all day', isCorrect: false },
      { id: 'c', text: 'Kids can never earn money', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l2-e2', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Chores like washing dishes and walking the dog can earn money. Playing games is just for fun.',
    instruction: 'Which could earn you money (a chore), and which is just fun?',
    buckets: [{ id: 'chore', label: 'Chore (earn money)' }, { id: 'fun', label: 'Just for fun' }],
    items: [
      { id: 'dishes', text: 'Washing the dishes', bucketId: 'chore' },
      { id: 'dog', text: 'Walking the dog', bucketId: 'chore' },
      { id: 'cartoons', text: 'Watching cartoons', bucketId: 'fun' },
    ],
  },
  {
    id: 'ks5-l2-e3', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True — an allowance is money you can earn for helping at home.',
    statement: 'Doing chores can help a kid earn an allowance.',
    isTrue: true,
  },
  {
    id: 'ks5-l2-e4', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'Kids can earn money by doing chores like cleaning up.',
    prompt: 'How can a KID earn money?',
    options: [
      { id: 'a', text: 'By doing chores', isCorrect: true },
      { id: 'b', text: 'By watching TV all day', isCorrect: false },
      { id: 'c', text: 'Kids can never earn money', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l2-e5', kind: 'matchPairs', competencyId: 'incomeGrowth',
    rationale: 'A chore is a job at home; an allowance is money for chores.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Chore', definition: 'A job at home' },
      { id: 'p2', term: 'Allowance', definition: 'Money you earn for chores' },
      { id: 'p3', term: 'Earn', definition: 'Get paid for work' },
    ],
  },
  {
    id: 'ks5-l2-e6', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True — doing chores can help a kid earn an allowance.',
    statement: 'Doing chores can help a kid earn an allowance.',
    isTrue: true,
  },
  {
    id: 'ks5-l2-e7', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'Do the chore, a grown-up checks it, then you get your allowance.',
    instruction: 'Put the chore steps in order.',
    items: [
      { id: 's1', text: 'Do the chore', rank: 1 },
      { id: 's2', text: 'A grown-up checks it', rank: 2 },
      { id: 's3', text: 'Get your allowance', rank: 3 },
    ],
  },
  {
    id: 'ks5-l2-e8', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'Doing the chore is how you earn the allowance.',
    story: 'Mom will pay $2 to clean your room. You want to earn money.',
    choices: [
      { id: 'a', text: 'Clean my room to earn $2', isCorrect: true, score: 3, outcome: 'Great! You earned $2 by helping.' },
      { id: 'b', text: 'Leave it messy and ask for $2 anyway', isCorrect: false, score: 0, outcome: 'You earn the money by doing the chore.' },
    ],
  },
];

const ks5l3: Exercise[] = [
  {
    id: 'ks5-l3-e1', kind: 'miniStory', competencyId: 'incomeGrowth',
    rationale: 'Sam made lemonade, sold cups for money, and earned $6! That is how a little job works.',
    panels: [
      { text: 'Sam sets up a lemonade stand. Each cup costs 1 dollar.', speaker: 'Story' },
      { text: 'Sam sells 6 cups to neighbors.', speaker: 'Story' },
    ],
    choicePrompt: 'How much money did Sam earn?',
    choices: [
      { id: 'a', text: '$6', isCorrect: true, outcome: 'Yes! 6 cups × $1 = $6 earned.' },
      { id: 'b', text: '$1', isCorrect: false, outcome: 'Each cup is $1, and Sam sold 6 cups — that is $6.' },
      { id: 'c', text: '$0', isCorrect: false, outcome: 'Sam sold cups, so Sam earned money!' },
    ],
  },
  {
    id: 'ks5-l3-e2', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'To earn money from a little job, you make something or do something people will pay for.',
    prompt: 'To earn money from a lemonade stand, you need to...',
    options: [
      { id: 'a', text: 'sell cups of lemonade to people', isCorrect: true },
      { id: 'b', text: 'drink all the lemonade yourself', isCorrect: false },
      { id: 'c', text: 'give it away for free', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l3-e3', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'First make the lemonade, then sell it, then count your money.',
    instruction: 'Put the lemonade stand steps in order.',
    items: [
      { id: 's1', text: 'Make the lemonade', rank: 1 },
      { id: 's2', text: 'Sell cups to people', rank: 2 },
      { id: 's3', text: 'Count the money you earned', rank: 3 },
    ],
  },
  {
    id: 'ks5-l3-e4', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'You earn money at a lemonade stand by selling cups people pay for.',
    prompt: 'How does a lemonade stand earn money?',
    options: [
      { id: 'a', text: 'By selling cups people pay for', isCorrect: true },
      { id: 'b', text: 'By giving lemonade away', isCorrect: false },
      { id: 'c', text: 'By drinking it all', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l3-e5', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True — you earn money when people pay you for the cups.',
    statement: 'You earn money by selling cups people pay for.',
    isTrue: true,
  },
  {
    id: 'ks5-l3-e6', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Selling things people pay for earns money. Giving away or using it up does not.',
    instruction: 'Earns money, or not?',
    buckets: [{ id: 'earn', label: 'Earns money' }, { id: 'noearn', label: 'Does not earn' }],
    items: [
      { id: 'i1', text: 'Selling lemonade', bucketId: 'earn' },
      { id: 'i2', text: 'Selling cookies', bucketId: 'earn' },
      { id: 'i3', text: 'Giving it away for free', bucketId: 'noearn' },
      { id: 'i4', text: 'Drinking it all yourself', bucketId: 'noearn' },
    ],
  },
  {
    id: 'ks5-l3-e7', kind: 'matchPairs', competencyId: 'incomeGrowth',
    rationale: 'You make the lemonade, sell it, and earn the money.',
    instruction: 'Match each step to what it means.',
    pairs: [
      { id: 'p1', term: 'Make', definition: 'Create the lemonade' },
      { id: 'p2', term: 'Sell', definition: 'Trade it for money' },
      { id: 'p3', term: 'Earn', definition: 'Get the money' },
    ],
  },
  {
    id: 'ks5-l3-e8', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'Selling cups for money is how the stand earns. Free cups earn nothing.',
    story: 'At your lemonade stand, a neighbor wants a cup.',
    choices: [
      { id: 'a', text: 'Sell it for $1', isCorrect: true, score: 3, outcome: 'Yes! Selling cups is how you earn.' },
      { id: 'b', text: 'Give every cup away for free', isCorrect: false, score: 0, outcome: 'Free cups are kind, but they earn no money.' },
    ],
  },
];

const ks5l4: Exercise[] = [
  {
    id: 'ks5-l4-e1', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'You usually earn money first, then use it to buy what you want.',
    prompt: 'What usually comes first?',
    options: [
      { id: 'a', text: 'Earn the money, then buy', isCorrect: true },
      { id: 'b', text: 'Buy first, money never needed', isCorrect: false },
      { id: 'c', text: 'Toys appear by magic', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l4-e2', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'Doing chores to earn the money is how you can buy the toy you want.',
    story: 'You want a $10 toy but have $0. Mom pays $2 for each chore.',
    choices: [
      { id: 'a', text: 'Do chores to earn the $10', isCorrect: true, score: 3, outcome: 'Great plan! 5 chores × $2 = $10 for your toy.' },
      { id: 'b', text: 'Just wish really hard for the toy', isCorrect: false, score: 0, outcome: 'Wishing does not earn money — doing chores does!' },
    ],
  },
  {
    id: 'ks5-l4-e3', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: '5 chores at $2 each is $10 (2 + 2 + 2 + 2 + 2 = 10).',
    prompt: 'You earn $2 per chore. How many chores to earn $10?',
    options: [
      { id: 'a', text: '5 chores', isCorrect: true },
      { id: 'b', text: '2 chores', isCorrect: false },
      { id: 'c', text: '10 chores', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l4-e4', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True — usually you earn money first, then you spend it.',
    statement: 'Usually you earn money before you spend it.',
    isTrue: true,
  },
  {
    id: 'ks5-l4-e5', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Doing work earns money; buying things spends money.',
    instruction: 'Does it earn money or spend money?',
    buckets: [{ id: 'earn', label: 'Earns money' }, { id: 'spend', label: 'Spends money' }],
    items: [
      { id: 'i1', text: 'Doing a chore for pay', bucketId: 'earn' },
      { id: 'i2', text: 'Selling lemonade', bucketId: 'earn' },
      { id: 'i3', text: 'Buying a toy', bucketId: 'spend' },
      { id: 'i4', text: 'Paying for candy', bucketId: 'spend' },
    ],
  },
  {
    id: 'ks5-l4-e6', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: '4 chores at $2 each is $8 (2 + 2 + 2 + 2 = 8).',
    prompt: 'You earn $2 per chore. How much for 4 chores?',
    options: [
      { id: 'a', text: '$8', isCorrect: true },
      { id: 'b', text: '$4', isCorrect: false },
      { id: 'c', text: '$2', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l4-e7', kind: 'matchPairs', competencyId: 'incomeGrowth',
    rationale: 'You earn money, then buy with it; a chore is work that earns.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Earn', definition: 'Get money for work' },
      { id: 'p2', term: 'Buy', definition: 'Use money to get something' },
      { id: 'p3', term: 'Chore', definition: 'Work that earns money' },
    ],
  },
  {
    id: 'ks5-l4-e8', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'Do chores, earn the money, then buy the toy.',
    instruction: 'Put the steps in order.',
    items: [
      { id: 's1', text: 'Do chores', rank: 1 },
      { id: 's2', text: 'Earn the money', rank: 2 },
      { id: 's3', text: 'Buy the toy', rank: 3 },
    ],
  },
];

const ks5Practice: Exercise[] = [
  {
    id: 'ks5-pr-e1', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'People earn money by working.',
    prompt: 'Earning money means...',
    options: [
      { id: 'a', text: 'getting paid for doing work', isCorrect: true },
      { id: 'b', text: 'finding it under your pillow always', isCorrect: false },
      { id: 'c', text: 'losing your money', isCorrect: false },
    ],
  },
  {
    id: 'ks5-pr-e2', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Helping with chores can earn money; playing is for fun.',
    instruction: 'Earns money, or just fun?',
    buckets: [{ id: 'earn', label: 'Can earn money' }, { id: 'fun', label: 'Just fun' }],
    items: [
      { id: 'rake', text: 'Raking leaves for a neighbor', bucketId: 'earn' },
      { id: 'lemonade', text: 'Running a lemonade stand', bucketId: 'earn' },
      { id: 'swing', text: 'Playing on the swings', bucketId: 'fun' },
    ],
  },
  {
    id: 'ks5-pr-e3', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: '3 cups at $1 each = $3.',
    prompt: 'You sell 3 cups of lemonade for $1 each. How much did you earn?',
    options: [
      { id: 'a', text: '$3', isCorrect: true },
      { id: 'b', text: '$1', isCorrect: false },
      { id: 'c', text: '$10', isCorrect: false },
    ],
  },
  {
    id: 'ks5-pr-e4', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True — you earn money first, then you can spend it.',
    statement: 'Usually you earn money before you can spend it.',
    isTrue: true,
  },
  {
    id: 'ks5-pr-e5', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: '2 cups at $1 each is $2.',
    prompt: 'You sell 2 cups of lemonade for $1 each. How much did you earn?',
    options: [
      { id: 'a', text: '$2', isCorrect: true },
      { id: 'b', text: '$1', isCorrect: false },
      { id: 'c', text: '$5', isCorrect: false },
    ],
  },
  {
    id: 'ks5-pr-e6', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True — kids can earn money by doing chores.',
    statement: 'Kids can earn money by doing chores.',
    isTrue: true,
  },
  {
    id: 'ks5-pr-e7', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Working earns money; playing is just for fun.',
    instruction: 'Earns money, or just fun?',
    buckets: [{ id: 'earn', label: 'Earns money' }, { id: 'fun', label: 'Just fun' }],
    items: [
      { id: 'i1', text: 'Walking a neighbor\'s dog for pay', bucketId: 'earn' },
      { id: 'i2', text: 'Running a lemonade stand', bucketId: 'earn' },
      { id: 'i3', text: 'Playing on the swings', bucketId: 'fun' },
    ],
  },
  {
    id: 'ks5-pr-e8', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'Doing the job is how you earn money to reach your goal.',
    story: 'You want a $6 toy and have $0. A neighbor pays $3 to water plants.',
    choices: [
      { id: 'a', text: 'Water plants twice to earn $6', isCorrect: true, score: 3, outcome: 'Yes! 2 × $3 = $6 for your toy.' },
      { id: 'b', text: 'Give up because $6 is too much', isCorrect: false, score: 0, outcome: 'Do not give up — two jobs earn $6!' },
    ],
  },
];

const ks5l5: Exercise[] = [
  {
    id: 'ks5-l5-e1', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: 'You earn money by working — like chores, a job, or a lemonade stand.',
    prompt: 'Which one earns money?',
    options: [
      { id: 'a', text: 'Doing a job or chore', isCorrect: true },
      { id: 'b', text: 'Taking a nap', isCorrect: false },
      { id: 'c', text: 'Wishing on a star', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l5-e2', kind: 'scenarioDecision', competencyId: 'incomeGrowth',
    rationale: 'Working a little each day adds up to the money you need for your goal.',
    story: 'You want a $12 art set. You earn $3 each day you help in the garden.',
    choices: [
      { id: 'a', text: 'Help in the garden for 4 days', isCorrect: true, score: 3, outcome: 'Yes! 4 days × $3 = $12. You earned it!' },
      { id: 'b', text: 'Give up because $12 is too much', isCorrect: false, score: 0, outcome: 'Do not give up — a little each day adds up to $12!' },
    ],
  },
  {
    id: 'ks5-l5-e3', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True! Working to earn money is how you get the things you want to buy.',
    statement: 'Earning money by working helps you buy the things you want.',
    isTrue: true,
  },
  {
    id: 'ks5-l5-e4', kind: 'multipleChoice', competencyId: 'incomeGrowth',
    rationale: '3 days at $4 each is $12 (4 + 4 + 4 = 12).',
    prompt: 'You earn $4 each day in the garden. How much after 3 days?',
    options: [
      { id: 'a', text: '$12', isCorrect: true },
      { id: 'b', text: '$7', isCorrect: false },
      { id: 'c', text: '$4', isCorrect: false },
    ],
  },
  {
    id: 'ks5-l5-e5', kind: 'categorize', competencyId: 'incomeGrowth',
    rationale: 'Jobs and chores earn money; resting and playing do not.',
    instruction: 'Earns money, or not?',
    buckets: [{ id: 'earn', label: 'Earns money' }, { id: 'noearn', label: 'Does not earn' }],
    items: [
      { id: 'i1', text: 'Doing a job', bucketId: 'earn' },
      { id: 'i2', text: 'A lemonade stand', bucketId: 'earn' },
      { id: 'i3', text: 'Taking a nap', bucketId: 'noearn' },
    ],
  },
  {
    id: 'ks5-l5-e6', kind: 'matchPairs', competencyId: 'incomeGrowth',
    rationale: 'You earn by working, then use the money to buy.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Earn', definition: 'Get money for work' },
      { id: 'p2', term: 'Job', definition: 'Work people pay for' },
      { id: 'p3', term: 'Buy', definition: 'Use money to get a thing' },
    ],
  },
  {
    id: 'ks5-l5-e7', kind: 'trueFalse', competencyId: 'incomeGrowth',
    rationale: 'True! Working to earn money helps you buy what you want.',
    statement: 'Earning money by working helps you buy what you want.',
    isTrue: true,
  },
  {
    id: 'ks5-l5-e8', kind: 'tapToOrder', competencyId: 'incomeGrowth',
    rationale: 'Do the work, earn money, then buy your goal.',
    instruction: 'Put the money-earner steps in order.',
    items: [
      { id: 's1', text: 'Do the work', rank: 1 },
      { id: 's2', text: 'Earn the money', rank: 2 },
      { id: 's3', text: 'Buy your goal', rank: 3 },
    ],
  },
];

const ks5Guidebook: GuidebookEntry[] = [
  { id: 'ks5-g1', title: 'How People Earn', body: 'Grown-ups earn money by working at a job. They do work — like baking, building, or helping people — and get paid for it.' },
  { id: 'ks5-g2', title: 'Kids Can Earn Too', body: 'Kids can earn money by doing chores like cleaning up, walking the dog, or helping out. Money you earn for chores is sometimes called an allowance.' },
  { id: 'ks5-g3', title: 'A Little Job', body: 'A lemonade stand is a little job! You make lemonade, sell cups for money, and earn money from the people who buy them.' },
  { id: 'ks5-g4', title: 'Earn, Then Buy', body: 'First you earn money, then you can spend it. If a toy costs more than you have, you can do more chores to earn the rest.' },
];

// ════════════════════════════════════════════════════════════════════════════
// UNIT 6 — GOAL SETTING
// ════════════════════════════════════════════════════════════════════════════

const ks6l1: Exercise[] = [
  {
    id: 'ks6-l1-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'A goal is something you want and make a plan to reach — like saving for a special toy.',
    prompt: 'What is a money GOAL?',
    options: [
      { id: 'a', text: 'Something you want and plan to save for', isCorrect: true },
      { id: 'b', text: 'A kind of sandwich', isCorrect: false },
      { id: 'c', text: 'A way to lose money', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l1-e2', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Saving for a bike you want is a money goal.',
    statement: 'Saving up for a bike is an example of a money goal.',
    isTrue: true,
  },
  {
    id: 'ks6-l1-e3', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'A goal is something you save toward. Spending it all right away is not a goal.',
    instruction: 'Is it a saving GOAL, or not?',
    buckets: [{ id: 'goal', label: 'A saving goal' }, { id: 'notgoal', label: 'Not a goal' }],
    items: [
      { id: 'bike', text: 'Saving for a $40 bike', bucketId: 'goal' },
      { id: 'skates', text: 'Saving for new skates', bucketId: 'goal' },
      { id: 'spendall', text: 'Spending all your money now', bucketId: 'notgoal' },
    ],
  },
  {
    id: 'ks6-l1-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'A goal is something you want and plan to save for.',
    prompt: 'A money goal is...',
    options: [
      { id: 'a', text: 'something you save up for', isCorrect: true },
      { id: 'b', text: 'a kind of fruit', isCorrect: false },
      { id: 'c', text: 'a way to lose money', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l1-e5', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'A goal is what you save for; a plan is how you reach it.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Goal', definition: 'What you save for' },
      { id: 'p2', term: 'Save', definition: 'Keep money for it' },
      { id: 'p3', term: 'Plan', definition: 'How you reach the goal' },
    ],
  },
  {
    id: 'ks6-l1-e6', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — saving for a bike is a money goal.',
    statement: 'Saving up for a bike is a money goal.',
    isTrue: true,
  },
  {
    id: 'ks6-l1-e7', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Pick a goal, save for it, then reach it.',
    instruction: 'Put the goal steps in order.',
    items: [
      { id: 's1', text: 'Pick a goal', rank: 1 },
      { id: 's2', text: 'Save for it', rank: 2 },
      { id: 's3', text: 'Reach the goal', rank: 3 },
    ],
  },
  {
    id: 'ks6-l1-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Picking a goal and saving for it helps you get what you really want.',
    story: 'You really want a $15 kite. You just got $5.',
    choices: [
      { id: 'a', text: 'Make the kite my goal and start saving', isCorrect: true, score: 3, outcome: 'Great! Now you have a goal to save toward.' },
      { id: 'b', text: 'Spend the $5 and forget the kite', isCorrect: false, score: 0, outcome: 'Then you never save up for the kite you want.' },
    ],
  },
];

const ks6l2: Exercise[] = [
  {
    id: 'ks6-l2-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'To reach a goal, you save your money toward it instead of spending it on other things.',
    prompt: 'How do you reach a saving goal?',
    options: [
      { id: 'a', text: 'Save money toward it', isCorrect: true },
      { id: 'b', text: 'Spend money on other stuff', isCorrect: false },
      { id: 'c', text: 'Forget about it', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l2-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'A toy costs $10 and you have $4, so you need $6 more (10 − 4 = 6).',
    prompt: 'Your goal toy costs $10. You have $4. How much more do you need?',
    options: [
      { id: 'a', text: '$6 more', isCorrect: true },
      { id: 'b', text: '$10 more', isCorrect: false },
      { id: 'c', text: '$4 more', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l2-e3', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! A goal helps you know what you are saving for.',
    statement: 'Having a goal helps you know what you are saving for.',
    isTrue: true,
  },
  {
    id: 'ks6-l2-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'To reach a goal, you save your money toward it.',
    prompt: 'How do you reach a saving goal?',
    options: [
      { id: 'a', text: 'Save money toward it', isCorrect: true },
      { id: 'b', text: 'Spend money on other things', isCorrect: false },
      { id: 'c', text: 'Forget about it', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l2-e5', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Saving toward your goal helps. Spending on other things does not.',
    instruction: 'Does it help you reach your goal?',
    buckets: [{ id: 'helps', label: 'Helps reach it' }, { id: 'nothelp', label: 'Does not help' }],
    items: [
      { id: 'i1', text: 'Saving $2 every week', bucketId: 'helps' },
      { id: 'i2', text: 'Keeping your goal money safe', bucketId: 'helps' },
      { id: 'i3', text: 'Spending it on other toys', bucketId: 'nothelp' },
      { id: 'i4', text: 'Buying candy every day', bucketId: 'nothelp' },
    ],
  },
  {
    id: 'ks6-l2-e6', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — a goal helps you know what you are saving for.',
    statement: 'Having a goal helps you know what to save for.',
    isTrue: true,
  },
  {
    id: 'ks6-l2-e7', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'A goal is what you want; saving and reaching get you there.',
    instruction: 'Match each word to what it means.',
    pairs: [
      { id: 'p1', term: 'Goal', definition: 'What you want to buy' },
      { id: 'p2', term: 'Save', definition: 'Put money aside for it' },
      { id: 'p3', term: 'Reach', definition: 'Get to your goal' },
    ],
  },
  {
    id: 'ks6-l2-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Saving toward the goal instead of spending gets you there.',
    story: 'Your goal is a $12 toy. You have $4 and just got $3 more.',
    choices: [
      { id: 'a', text: 'Add the $3 to my goal savings', isCorrect: true, score: 3, outcome: 'Yes! Now you have $7 toward $12.' },
      { id: 'b', text: 'Spend the $3 on something else', isCorrect: false, score: 0, outcome: 'Then you stay stuck at $4. Save toward the goal!' },
    ],
  },
];

const ks6l3: Exercise[] = [
  {
    id: 'ks6-l3-e1', kind: 'miniStory', competencyId: 'savingSystems',
    rationale: 'Mia saved $2 each week. After 5 weeks she had $10 for her goal!',
    panels: [
      { text: 'Mia wants a $10 puzzle. She saves $2 every week.', speaker: 'Story' },
      { text: 'Week by week her piggy bank grows: $2, $4, $6, $8...', speaker: 'Story' },
      { text: 'After week 5 she has $10. Goal reached!', speaker: 'Story' },
    ],
    choicePrompt: 'How did Mia reach her $10 goal?',
    choices: [
      { id: 'a', text: 'She saved a little ($2) each week', isCorrect: true, outcome: 'Yes! A little each week adds up to the goal.' },
      { id: 'b', text: 'She got it all in one day by magic', isCorrect: false, outcome: 'No magic — Mia saved $2 a week for 5 weeks.' },
    ],
  },
  {
    id: 'ks6-l3-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Saving $2 a week for 5 weeks is $10 (2 × 5 = 10).',
    prompt: 'You save $2 each week. How much after 5 weeks?',
    options: [
      { id: 'a', text: '$10', isCorrect: true },
      { id: 'b', text: '$5', isCorrect: false },
      { id: 'c', text: '$2', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l3-e3', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Pick a goal, save a little at a time, then reach the goal.',
    instruction: 'Put the goal steps in order.',
    items: [
      { id: 's1', text: 'Pick a goal (a $10 puzzle)', rank: 1 },
      { id: 's2', text: 'Save a little each week', rank: 2 },
      { id: 's3', text: 'Reach your goal!', rank: 3 },
    ],
  },
  {
    id: 'ks6-l3-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$2 a week for 5 weeks is $10 (2 × 5 = 10).',
    prompt: 'You save $2 each week. How much after 5 weeks?',
    options: [
      { id: 'a', text: '$10', isCorrect: true },
      { id: 'b', text: '$5', isCorrect: false },
      { id: 'c', text: '$2', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l3-e5', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — saving a little each week adds up to reach a goal.',
    statement: 'Saving a little each week can reach a goal.',
    isTrue: true,
  },
  {
    id: 'ks6-l3-e6', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Saving regularly helps; spending it all does not.',
    instruction: 'Helps reach a goal, or not?',
    buckets: [{ id: 'helps', label: 'Helps' }, { id: 'nothelp', label: 'Does not help' }],
    items: [
      { id: 'i1', text: 'Saving the same amount each week', bucketId: 'helps' },
      { id: 'i2', text: 'Keeping the money in your piggy bank', bucketId: 'helps' },
      { id: 'i3', text: 'Spending all of it right away', bucketId: 'nothelp' },
    ],
  },
  {
    id: 'ks6-l3-e7', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'Saving the same amount over weeks adds up.',
    instruction: 'Match the weekly saving to the total after 3 weeks.',
    pairs: [
      { id: 'p1', term: '$2 a week', definition: '$6 in 3 weeks' },
      { id: 'p2', term: '$3 a week', definition: '$9 in 3 weeks' },
      { id: 'p3', term: '$5 a week', definition: '$15 in 3 weeks' },
    ],
  },
  {
    id: 'ks6-l3-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'Saving each week, even a little, gets you to the goal.',
    story: 'Your goal is $10. You can save $2 each week.',
    choices: [
      { id: 'a', text: 'Save $2 a week for 5 weeks', isCorrect: true, score: 3, outcome: 'Yes! 5 × $2 = $10. Goal reached!' },
      { id: 'b', text: 'Give up — $10 is too much', isCorrect: false, score: 0, outcome: 'A little each week adds up to $10. Keep going!' },
    ],
  },
];

const ks6l4: Exercise[] = [
  {
    id: 'ks6-l4-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'To track a goal, compare how much you have saved to how much you need.',
    prompt: 'How do you know if you are close to your goal?',
    options: [
      { id: 'a', text: 'Check how much you have vs. how much you need', isCorrect: true },
      { id: 'b', text: 'Guess with your eyes closed', isCorrect: false },
      { id: 'c', text: 'You can never tell', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l4-e2', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'You have $8 of $10 — almost there! Saving $2 more reaches the goal.',
    story: 'Your goal is $10. You have saved $8 so far.',
    choices: [
      { id: 'a', text: 'Save $2 more to reach the goal', isCorrect: true, score: 3, outcome: 'Yes! $8 + $2 = $10. Goal complete!' },
      { id: 'b', text: 'Spend the $8 now and start over', isCorrect: false, score: 0, outcome: 'So close! Just $2 more would finish your goal.' },
    ],
  },
  {
    id: 'ks6-l4-e3', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'You have $8 and need $10, so you are $2 away (10 − 8 = 2).',
    prompt: 'Goal is $10, you have $8. How far away are you?',
    options: [
      { id: 'a', text: '$2 away', isCorrect: true },
      { id: 'b', text: '$8 away', isCorrect: false },
      { id: 'c', text: '$10 away', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l4-e4', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — to track a goal, compare what you have to what you need.',
    statement: 'To track a goal, you compare how much you have to how much you need.',
    isTrue: true,
  },
  {
    id: 'ks6-l4-e5', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Goal is $10 and you have $7, so you need $3 more.',
    prompt: 'Your goal is $10. You have $7. How much more do you need?',
    options: [
      { id: 'a', text: '$3 more', isCorrect: true },
      { id: 'b', text: '$7 more', isCorrect: false },
      { id: 'c', text: '$10 more', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l4-e6', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Adding money moves you closer; spending savings moves you further.',
    instruction: 'Closer to your goal, or further away?',
    buckets: [{ id: 'closer', label: 'Closer' }, { id: 'further', label: 'Further away' }],
    items: [
      { id: 'i1', text: 'Adding $2 to your savings', bucketId: 'closer' },
      { id: 'i2', text: 'Saving your allowance', bucketId: 'closer' },
      { id: 'i3', text: 'Spending your goal money', bucketId: 'further' },
    ],
  },
  {
    id: 'ks6-l4-e7', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'Compare what you have to a $10 goal to see how far you have to go.',
    instruction: 'Goal is $10. Match what you have to how much is left.',
    pairs: [
      { id: 'p1', term: 'You have $8', definition: '$2 to go' },
      { id: 'p2', term: 'You have $6', definition: '$4 to go' },
      { id: 'p3', term: 'You have $9', definition: '$1 to go' },
    ],
  },
  {
    id: 'ks6-l4-e8', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'As you save, your total grows closer to the goal: $4, $6, $8, $10.',
    instruction: 'Order your savings from smallest to your $10 goal.',
    items: [
      { id: 's1', text: '$4 saved', rank: 1 },
      { id: 's2', text: '$6 saved', rank: 2 },
      { id: 's3', text: '$8 saved', rank: 3 },
      { id: 's4', text: '$10 — goal!', rank: 4 },
    ],
  },
];

const ks6Practice: Exercise[] = [
  {
    id: 'ks6-pr-e1', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'A goal is something you want and plan to save for.',
    prompt: 'A saving goal is...',
    options: [
      { id: 'a', text: 'something you save up for', isCorrect: true },
      { id: 'b', text: 'a type of shoe', isCorrect: false },
      { id: 'c', text: 'a way to spend fast', isCorrect: false },
    ],
  },
  {
    id: 'ks6-pr-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$3 a week for 4 weeks is $12 (3 × 4 = 12).',
    prompt: 'You save $3 each week for 4 weeks. How much?',
    options: [
      { id: 'a', text: '$12', isCorrect: true },
      { id: 'b', text: '$7', isCorrect: false },
      { id: 'c', text: '$3', isCorrect: false },
    ],
  },
  {
    id: 'ks6-pr-e3', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Pick a goal, save over time, reach it.',
    instruction: 'Order the goal steps.',
    items: [
      { id: 's1', text: 'Choose your goal', rank: 1 },
      { id: 's2', text: 'Save bit by bit', rank: 2 },
      { id: 's3', text: 'Reach the goal', rank: 3 },
    ],
  },
  {
    id: 'ks6-pr-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Goal is $15, you have $9, so you need $6 more (15 − 9 = 6).',
    prompt: 'Goal is $15, you saved $9. How much more?',
    options: [
      { id: 'a', text: '$6 more', isCorrect: true },
      { id: 'b', text: '$9 more', isCorrect: false },
      { id: 'c', text: '$15 more', isCorrect: false },
    ],
  },
  {
    id: 'ks6-pr-e5', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: '$2 a week for 6 weeks is $12 (2 × 6 = 12).',
    prompt: 'You save $2 each week for 6 weeks. How much?',
    options: [
      { id: 'a', text: '$12', isCorrect: true },
      { id: 'b', text: '$8', isCorrect: false },
      { id: 'c', text: '$6', isCorrect: false },
    ],
  },
  {
    id: 'ks6-pr-e6', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True — a little saved at a time can reach a big goal.',
    statement: 'Saving a little at a time can reach a big goal.',
    isTrue: true,
  },
  {
    id: 'ks6-pr-e7', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'Choose a goal, save bit by bit, then reach it.',
    instruction: 'Order the goal steps.',
    items: [
      { id: 's1', text: 'Choose your goal', rank: 1 },
      { id: 's2', text: 'Save bit by bit', rank: 2 },
      { id: 's3', text: 'Reach the goal', rank: 3 },
    ],
  },
  {
    id: 'ks6-pr-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'You are almost there — saving the last bit reaches the goal.',
    story: 'Your goal is $10 and you have saved $9.',
    choices: [
      { id: 'a', text: 'Save $1 more to reach $10', isCorrect: true, score: 3, outcome: 'Yes! $9 + $1 = $10. Goal complete!' },
      { id: 'b', text: 'Spend the $9 now', isCorrect: false, score: 0, outcome: 'So close! Just $1 more would finish it.' },
    ],
  },
];

const ks6l5: Exercise[] = [
  {
    id: 'ks6-l5-e1', kind: 'tapToOrder', competencyId: 'savingSystems',
    rationale: 'The 3 goal steps: pick a goal, save little by little, reach it!',
    instruction: 'Put the goal-getter steps in order.',
    items: [
      { id: 's1', text: 'Pick something to save for', rank: 1 },
      { id: 's2', text: 'Save a little each week', rank: 2 },
      { id: 's3', text: 'Reach your goal and celebrate!', rank: 3 },
    ],
  },
  {
    id: 'ks6-l5-e2', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Saving $5 a week for 3 weeks is $15 (5 × 3 = 15) — enough for a $15 goal!',
    prompt: 'Your goal is $15. You save $5 a week. How many weeks to reach it?',
    options: [
      { id: 'a', text: '3 weeks', isCorrect: true },
      { id: 'b', text: '5 weeks', isCorrect: false },
      { id: 'c', text: '15 weeks', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l5-e3', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Set a goal, save a little at a time, and you will reach it. You are a Goal Getter!',
    statement: 'If you set a goal and save a little at a time, you can reach it.',
    isTrue: true,
  },
  {
    id: 'ks6-l5-e4', kind: 'multipleChoice', competencyId: 'savingSystems',
    rationale: 'Saving $4 a week for 3 weeks is $12 (4 × 3 = 12).',
    prompt: 'Your goal is $12. You save $4 a week. How many weeks to reach it?',
    options: [
      { id: 'a', text: '3 weeks', isCorrect: true },
      { id: 'b', text: '4 weeks', isCorrect: false },
      { id: 'c', text: '12 weeks', isCorrect: false },
    ],
  },
  {
    id: 'ks6-l5-e5', kind: 'categorize', competencyId: 'savingSystems',
    rationale: 'Saving toward a goal is good; spending it all is not.',
    instruction: 'Good for your goal, or not?',
    buckets: [{ id: 'good', label: 'Good for the goal' }, { id: 'notgood', label: 'Not good' }],
    items: [
      { id: 'i1', text: 'Saving a little each week', bucketId: 'good' },
      { id: 'i2', text: 'Keeping your goal money safe', bucketId: 'good' },
      { id: 'i3', text: 'Spending it all on other things', bucketId: 'notgood' },
    ],
  },
  {
    id: 'ks6-l5-e6', kind: 'matchPairs', competencyId: 'savingSystems',
    rationale: 'You pick a goal, save for it, and reach it.',
    instruction: 'Match each step to what it means.',
    pairs: [
      { id: 'p1', term: 'Pick', definition: 'Choose your goal' },
      { id: 'p2', term: 'Save', definition: 'Put money aside each week' },
      { id: 'p3', term: 'Reach', definition: 'Get to your goal' },
    ],
  },
  {
    id: 'ks6-l5-e7', kind: 'trueFalse', competencyId: 'savingSystems',
    rationale: 'True! Set a goal, save a little at a time, and you can reach it.',
    statement: 'If you set a goal and save a little at a time, you can reach it.',
    isTrue: true,
  },
  {
    id: 'ks6-l5-e8', kind: 'scenarioDecision', competencyId: 'savingSystems',
    rationale: 'A Goal Getter keeps saving each week until the goal is reached.',
    story: 'Your goal is a $15 art set. You save $5 each week.',
    choices: [
      { id: 'a', text: 'Save $5 a week for 3 weeks', isCorrect: true, score: 3, outcome: 'Yes! 3 × $5 = $15. You are a Goal Getter!' },
      { id: 'b', text: 'Spend each $5 as soon as you get it', isCorrect: false, score: 0, outcome: 'Then you never save up for the art set.' },
    ],
  },
];

const ks6Guidebook: GuidebookEntry[] = [
  { id: 'ks6-g1', title: 'What Is a Goal?', body: 'A money goal is something you want and make a plan to save for — like a bike, a game, or a special toy.' },
  { id: 'ks6-g2', title: 'Saving for a Goal', body: 'To reach a goal, save your money toward it instead of spending it on other things. Know how much your goal costs.' },
  { id: 'ks6-g3', title: 'A Little at a Time', body: 'You do not need all the money at once. Save a little each week. $2 a week for 5 weeks = $10!' },
  { id: 'ks6-g4', title: 'Track Your Goal', body: 'Check how much you have saved compared to how much you need. When they match, you reached your goal!' },
];

// ════════════════════════════════════════════════════════════════════════════
// ASSEMBLY
// ════════════════════════════════════════════════════════════════════════════

export const littleSaversLessons: Record<string, Lesson> = {
  // Unit 1 — Money Basics
  'ks1-l1':       ksLesson('ks1-l1', 'What Is Money?', ks1l1, 10, 'unit-ks-1', 'Money Basics', ['moneyMindset'], ['Understand that money is used to trade for things', 'Know that coins and bills are both money']),
  'ks1-l2':       ksLesson('ks1-l2', 'Coins & Bills', ks1l2, 10, 'unit-ks-1', 'Money Basics', ['moneyMindset'], ['Name the value of a penny, nickel, dime, and quarter', 'Add simple coin amounts']),
  'ks1-l3':       ksLesson('ks1-l3', 'Buying Things', ks1l3, 10, 'unit-ks-1', 'Money Basics', ['moneyMindset'], ['Understand that buying trades money for an item', 'Know you can only buy what you can pay for']),
  'ks1-practice': ksLesson('ks1-practice', 'Money Practice', ks1Practice, 8, 'unit-ks-1', 'Money Basics', ['moneyMindset'], ['Review what money is, coin values, and keeping money safe']),
  'ks1-l4':       ksLesson('ks1-l4', 'Keeping Money Safe', ks1l4, 10, 'unit-ks-1', 'Money Basics', ['moneyMindset'], ['Identify safe places to keep money', 'Know a bank keeps money safe']),
  'ks1-l5':       ksLesson('ks1-l5', 'Money Boss', ks1l5, 12, 'unit-ks-1', 'Money Basics', ['moneyMindset'], ['Show you know what money is and how to keep it safe']),
  // Unit 2 — Saving
  'ks2-l1':       ksLesson('ks2-l1', 'What Is Saving?', ks2l1, 10, 'unit-ks-2', 'Saving', ['savingSystems'], ['Understand that saving means keeping money for later']),
  'ks2-l2':       ksLesson('ks2-l2', 'Why We Save', ks2l2, 10, 'unit-ks-2', 'Saving', ['savingSystems'], ['Explain why people save for bigger things later']),
  'ks2-l3':       ksLesson('ks2-l3', 'The Saving Habit', ks2l3, 10, 'unit-ks-2', 'Saving', ['savingSystems'], ['Build the habit of saving a little each time']),
  'ks2-practice': ksLesson('ks2-practice', 'Saving Practice', ks2Practice, 8, 'unit-ks-2', 'Saving', ['savingSystems'], ['Review what saving is and how savings add up']),
  'ks2-l4':       ksLesson('ks2-l4', 'Watching It Grow', ks2l4, 10, 'unit-ks-2', 'Saving', ['savingSystems'], ['See that saving over time makes money grow']),
  'ks2-l5':       ksLesson('ks2-l5', 'Super Saver', ks2l5, 12, 'unit-ks-2', 'Saving', ['savingSystems'], ['Show you can save toward a goal']),
  // Unit 3 — Spending
  'ks3-l1':       ksLesson('ks3-l1', 'What Is Spending?', ks3l1, 10, 'unit-ks-3', 'Spending', ['behavior'], ['Understand that spending uses money to buy things']),
  'ks3-l2':       ksLesson('ks3-l2', 'Smart Choices', ks3l2, 10, 'unit-ks-3', 'Spending', ['behavior'], ['Compare prices and choose the better deal']),
  'ks3-l3':       ksLesson('ks3-l3', 'Don’t Spend It All', ks3l3, 10, 'unit-ks-3', 'Spending', ['behavior'], ['Plan to spend some and save some']),
  'ks3-practice': ksLesson('ks3-practice', 'Spending Practice', ks3Practice, 8, 'unit-ks-3', 'Spending', ['behavior'], ['Review smart spending and comparing prices']),
  'ks3-l4':       ksLesson('ks3-l4', 'Price Tags', ks3l4, 10, 'unit-ks-3', 'Spending', ['behavior'], ['Read price tags and compare which costs less']),
  'ks3-l5':       ksLesson('ks3-l5', 'Smart Spender', ks3l5, 12, 'unit-ks-3', 'Spending', ['behavior'], ['Show you can make smart spending choices']),
  // Unit 4 — Needs vs Wants
  'ks4-l1':       ksLesson('ks4-l1', 'What Is a Need?', ks4l1, 10, 'unit-ks-4', 'Needs vs Wants', ['budgetDesign'], ['Identify needs like food, water, and a home']),
  'ks4-l2':       ksLesson('ks4-l2', 'What Is a Want?', ks4l2, 10, 'unit-ks-4', 'Needs vs Wants', ['budgetDesign'], ['Identify wants like toys and candy']),
  'ks4-l3':       ksLesson('ks4-l3', 'Needs First', ks4l3, 10, 'unit-ks-4', 'Needs vs Wants', ['budgetDesign'], ['Understand that needs come before wants']),
  'ks4-practice': ksLesson('ks4-practice', 'Needs & Wants Practice', ks4Practice, 8, 'unit-ks-4', 'Needs vs Wants', ['budgetDesign'], ['Review sorting needs from wants']),
  'ks4-l4':       ksLesson('ks4-l4', 'Sorting Game', ks4l4, 10, 'unit-ks-4', 'Needs vs Wants', ['budgetDesign'], ['Sort items into needs and wants']),
  'ks4-l5':       ksLesson('ks4-l5', 'Needs vs Wants Boss', ks4l5, 12, 'unit-ks-4', 'Needs vs Wants', ['budgetDesign'], ['Show you can tell needs from wants']),
  // Unit 5 — Earning Money
  'ks5-l1':       ksLesson('ks5-l1', 'How People Earn', ks5l1, 10, 'unit-ks-5', 'Earning Money', ['incomeGrowth'], ['Understand that people earn money by working']),
  'ks5-l2':       ksLesson('ks5-l2', 'Chores & Allowance', ks5l2, 10, 'unit-ks-5', 'Earning Money', ['incomeGrowth'], ['Know that kids can earn money with chores']),
  'ks5-l3':       ksLesson('ks5-l3', 'A Little Job', ks5l3, 10, 'unit-ks-5', 'Earning Money', ['incomeGrowth'], ['See how a lemonade stand earns money']),
  'ks5-practice': ksLesson('ks5-practice', 'Earning Practice', ks5Practice, 8, 'unit-ks-5', 'Earning Money', ['incomeGrowth'], ['Review ways to earn money']),
  'ks5-l4':       ksLesson('ks5-l4', 'Earn, Then Buy', ks5l4, 10, 'unit-ks-5', 'Earning Money', ['incomeGrowth'], ['Understand that you earn money before you buy']),
  'ks5-l5':       ksLesson('ks5-l5', 'Money Earner', ks5l5, 12, 'unit-ks-5', 'Earning Money', ['incomeGrowth'], ['Show you know how to earn money for a goal']),
  // Unit 6 — Goal Setting
  'ks6-l1':       ksLesson('ks6-l1', 'What Is a Goal?', ks6l1, 10, 'unit-ks-6', 'Goal Setting', ['savingSystems'], ['Understand what a money goal is']),
  'ks6-l2':       ksLesson('ks6-l2', 'Saving for a Goal', ks6l2, 10, 'unit-ks-6', 'Goal Setting', ['savingSystems'], ['Plan how to save toward a goal']),
  'ks6-l3':       ksLesson('ks6-l3', 'A Little at a Time', ks6l3, 10, 'unit-ks-6', 'Goal Setting', ['savingSystems'], ['See how saving weekly reaches a goal']),
  'ks6-practice': ksLesson('ks6-practice', 'Goal Practice', ks6Practice, 8, 'unit-ks-6', 'Goal Setting', ['savingSystems'], ['Review setting and reaching goals']),
  'ks6-l4':       ksLesson('ks6-l4', 'Track Your Goal', ks6l4, 10, 'unit-ks-6', 'Goal Setting', ['savingSystems'], ['Track progress toward a goal']),
  'ks6-l5':       ksLesson('ks6-l5', 'Goal Getter', ks6l5, 12, 'unit-ks-6', 'Goal Setting', ['savingSystems'], ['Show you can set a goal and reach it']),
};

export const littleSaversUnits: PathUnit[] = [
  ksUnit(1, 'Money Basics',   'What money is, coins and bills, buying, and keeping money safe.', '#F4B400', '💰', ['moneyMindset', 'cashFlow'], ks1Guidebook),
  ksUnit(2, 'Saving',         'What saving is, why we save, and watching savings grow.',        '#4CBE8A', '🐷', ['savingSystems', 'moneyMindset'], ks2Guidebook),
  ksUnit(3, 'Spending',       'Spending money, smart choices, and reading price tags.',         '#E87C4C', '🛒', ['behavior', 'budgetDesign'], ks3Guidebook),
  ksUnit(4, 'Needs vs Wants', 'Telling needs from wants and paying for needs first.',           '#4C9BE8', '🤔', ['budgetDesign', 'behavior'], ks4Guidebook),
  ksUnit(5, 'Earning Money',  'How people earn, chores, little jobs, and earning to buy.',      '#7A4E9F', '💪', ['incomeGrowth', 'moneyMindset'], ks5Guidebook),
  ksUnit(6, 'Goal Setting',   'Setting a money goal and saving a little at a time to reach it.', '#BE4C7A', '🎯', ['savingSystems', 'moneyMindset'], ks6Guidebook),
];
