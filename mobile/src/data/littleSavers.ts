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
