import type {
  CalculatorFormulaKey,
  Competency,
  CompetencyId,
  CourseModule,
  CourseTrack,
  Lesson,
  LessonActivity,
  LessonDifficulty,
  LessonDomain,
  LessonLevel,
  LessonProgress,
  LessonUnit,
  MasteryState,
} from '../types/lesson';
import type { OnboardingProfile } from '../types/onboarding';

type LevelBlueprint = {
  id: LessonLevel;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  masteryThreshold: number;
};

type TopicBlueprint = {
  title: string;
  focus: string;
  formulaRef?: string;
  misconception: string;
};

type TrackBlueprint = {
  id: LessonDomain;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  competencyIds: CompetencyId[];
  topics: TopicBlueprint[];
};

type MasterySnapshot = {
  competency: Competency;
  state: MasteryState;
  percent: number;
};

export const competencies: Competency[] = [
  {
    id: 'moneyMindset',
    title: 'Money Mindset',
    trackId: 'foundations',
    description: 'Use goals, tradeoffs, and opportunity cost to make intentional money choices.',
  },
  {
    id: 'cashFlow',
    title: 'Cash Flow',
    trackId: 'foundations',
    description: 'Track money in, money out, timing, buffers, and recurring commitments.',
  },
  {
    id: 'banking',
    title: 'Banking',
    trackId: 'foundations',
    description: 'Use accounts, payment rails, statements, and account protections well.',
  },
  {
    id: 'inflation',
    title: 'Inflation',
    trackId: 'foundations',
    description: 'Understand purchasing power, real returns, and price changes over time.',
  },
  {
    id: 'budgetDesign',
    title: 'Budget Design',
    trackId: 'budgeting',
    description: 'Build realistic budgets, categories, limits, and feedback loops.',
  },
  {
    id: 'behavior',
    title: 'Money Behavior',
    trackId: 'budgeting',
    description: 'Design habits, friction, and systems that survive real life.',
  },
  {
    id: 'savingSystems',
    title: 'Saving Systems',
    trackId: 'saving',
    description: 'Create emergency funds, goal buckets, automation, and savings rates.',
  },
  {
    id: 'liquidity',
    title: 'Liquidity',
    trackId: 'saving',
    description: 'Match accounts and access speed to the purpose of the money.',
  },
  {
    id: 'creditScore',
    title: 'Credit Score',
    trackId: 'credit',
    description: 'Manage credit reports, utilization, payment history, and score factors.',
  },
  {
    id: 'debtMath',
    title: 'Debt Math',
    trackId: 'credit',
    description: 'Calculate APR, amortization, payoff strategies, and total borrowing cost.',
  },
  {
    id: 'riskReturn',
    title: 'Risk And Return',
    trackId: 'investing',
    description: 'Connect volatility, time horizon, expected return, and behavior risk.',
  },
  {
    id: 'portfolioConstruction',
    title: 'Portfolio Construction',
    trackId: 'investing',
    description: 'Choose diversified holdings, allocations, fees, rebalancing, and tax location.',
  },
  {
    id: 'taxPlanning',
    title: 'Tax Planning',
    trackId: 'taxes',
    description: 'Understand forms, brackets, withholding, credits, deductions, and gains.',
  },
  {
    id: 'insuranceRisk',
    title: 'Insurance Risk',
    trackId: 'insurance',
    description: 'Use deductibles, coverage, risk transfer, and emergency planning well.',
  },
  {
    id: 'incomeGrowth',
    title: 'Income Growth',
    trackId: 'career',
    description: 'Compare pay, benefits, negotiation, side income, and income resilience.',
  },
  {
    id: 'businessFinance',
    title: 'Business Finance',
    trackId: 'entrepreneurship',
    description: 'Manage pricing, margins, cash runway, reinvestment, and business records.',
  },
  {
    id: 'financialAnalysis',
    title: 'Financial Analysis',
    trackId: 'advanced',
    description: 'Read statements, estimate value, analyze scenarios, and compare decisions.',
  },
  {
    id: 'retirementPlanning',
    title: 'Retirement Planning',
    trackId: 'advanced',
    description: 'Model long-term goals, withdrawal risk, tax mix, and retirement accounts.',
  },
];

const levelBlueprints: LevelBlueprint[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'Build vocabulary, mental models, and the first useful calculation.',
    difficulty: 1,
    masteryThreshold: 65,
  },
  {
    id: 'applied',
    title: 'Applied',
    description: 'Use the idea in realistic household, school, work, and business decisions.',
    difficulty: 2,
    masteryThreshold: 72,
  },
  {
    id: 'analytical',
    title: 'Analytical',
    description: 'Model tradeoffs, compare alternatives, and interpret financial evidence.',
    difficulty: 4,
    masteryThreshold: 80,
  },
  {
    id: 'mastery',
    title: 'Mastery',
    description: 'Handle ambiguous cases, defend a plan, and connect multiple domains.',
    difficulty: 5,
    masteryThreshold: 88,
  },
];

const trackBlueprints: TrackBlueprint[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    shortTitle: 'Foundations',
    icon: 'F',
    description: 'Money mindset, cash flow, banking, inflation, and opportunity cost.',
    competencyIds: ['moneyMindset', 'cashFlow', 'banking', 'inflation'],
    topics: [
      topic('Opportunity Cost', 'choose the best use of one scarce dollar', 'benefit of next best alternative', 'The cheapest option is always the best option.'),
      topic('Cash Flow Timing', 'match bill dates with income dates', 'income - expenses by period', 'A positive annual income always means monthly cash flow is safe.'),
      topic('Bank Accounts', 'separate spending, bills, savings, and reserves', undefined, 'All bank accounts work the same way.'),
      topic('Inflation And Purchasing Power', 'compare nominal dollars with real buying power', 'real return = nominal return - inflation', 'More dollars always means more wealth.'),
      topic('Needs, Wants, And Values', 'rank spending by survival, stability, and meaning', undefined, 'A budget is only about restriction.'),
      topic('Money Statements', 'read a simple personal balance sheet and income statement', 'assets - liabilities = net worth', 'Net worth and income measure the same thing.'),
      topic('Payment Systems', 'choose debit, credit, ACH, cash, and apps safely', undefined, 'Fast payment tools remove fraud risk.'),
      topic('Emergency Buffers', 'decide what must stay liquid', 'months covered = emergency fund / monthly essentials', 'Emergency money should chase the highest return.'),
      topic('Decision Journals', 'record assumptions before a financial choice', undefined, 'Good decisions are obvious after the outcome is known.'),
    ],
  },
  {
    id: 'budgeting',
    title: 'Budgeting',
    shortTitle: 'Budget',
    icon: 'B',
    description: 'Cash-flow planning, zero-based budgets, behavior, subscriptions, and tradeoffs.',
    competencyIds: ['budgetDesign', 'behavior', 'cashFlow'],
    topics: [
      topic('Zero-Based Budgeting', 'give every dollar a job before it disappears', 'income - assigned dollars = zero', 'Zero-based means spending every dollar.'),
      topic('Category Limits', 'set flexible limits without breaking the whole plan', undefined, 'A failed category means the whole budget failed.'),
      topic('Subscription Audits', 'spot quiet recurring spending and renewal traps', 'annual cost = monthly fee x 12', 'Small monthly charges are harmless.'),
      topic('Variable Expenses', 'plan food, gas, fun, and gifts with ranges', undefined, 'Only fixed bills matter.'),
      topic('Tradeoff Planning', 'compare two priorities with a real constraint', undefined, 'A budget should remove tradeoffs.'),
      topic('Sinking Funds', 'save monthly for irregular future costs', 'monthly set-aside = future cost / months left', 'Irregular costs are surprises.'),
      topic('Behavior Design', 'make the right money move easier than the wrong one', undefined, 'Knowledge alone changes spending.'),
      topic('Household Budget Meetings', 'run a short review without blame', undefined, 'Budget reviews are only for problems.'),
      topic('Budget Stress Tests', 'test the plan against lower income or higher bills', 'surplus margin = surplus / income', 'A budget is complete once it balances once.'),
    ],
  },
  {
    id: 'saving',
    title: 'Saving',
    shortTitle: 'Saving',
    icon: 'S',
    description: 'Emergency funds, goals, accounts, yields, liquidity, and automation.',
    competencyIds: ['savingSystems', 'liquidity', 'cashFlow'],
    topics: [
      topic('Emergency Fund Tiers', 'build starter, stable, and resilient reserves', 'months covered = savings / essentials', 'Everyone needs the exact same emergency fund.'),
      topic('Automatic Transfers', 'use timing and defaults to save before spending', undefined, 'Automation only helps people with high incomes.'),
      topic('Goal Buckets', 'separate short, medium, and long-term goals', undefined, 'All savings can sit in one unlabeled pile.'),
      topic('High-Yield Accounts', 'compare yield, access, fees, and insurance', 'interest = principal x rate x time', 'The highest APY is always the best account.'),
      topic('Liquidity Tradeoffs', 'choose access speed versus return', undefined, 'Money is safe if it cannot be spent quickly.'),
      topic('Windfall Rules', 'split unexpected money into today, stability, and future', undefined, 'Windfalls do not need a plan.'),
      topic('Savings Rate', 'measure the percent of income kept for future use', 'savings rate = saved / income', 'Saving dollars matters more than saving rate.'),
      topic('Goal Timelines', 'calculate monthly contributions for a target date', 'monthly contribution = target / months', 'A goal is realistic because it feels important.'),
      topic('Cash Reserve Policy', 'write rules for when savings can be used', undefined, 'Emergency funds are there for any purchase.'),
    ],
  },
  {
    id: 'credit',
    title: 'Credit And Debt',
    shortTitle: 'Credit',
    icon: 'C',
    description: 'Scores, cards, loans, amortization, APR, payoff strategy, and reports.',
    competencyIds: ['creditScore', 'debtMath', 'cashFlow'],
    topics: [
      topic('Credit Score Factors', 'connect payment history, utilization, age, mix, and inquiries', undefined, 'A credit score is a permanent grade.'),
      topic('Credit Reports', 'read accounts, balances, inquiries, and disputes', undefined, 'Scores are the same as reports.'),
      topic('Card Utilization', 'manage statement balances and limits', 'utilization = balance / limit', 'Paying interest improves a score.'),
      topic('APR And Interest', 'estimate the cost of carrying balances', 'monthly interest = balance x APR / 12', 'APR only matters for large loans.'),
      topic('Loan Amortization', 'separate principal from interest over time', 'payment = P*r/(1-(1+r)^-n)', 'Every payment reduces principal equally.'),
      topic('Debt Snowball And Avalanche', 'compare motivation with interest savings', undefined, 'There is one best payoff method for everyone.'),
      topic('Buy Now Pay Later', 'evaluate short-term installment promises', undefined, 'No-interest payments cannot create risk.'),
      topic('Refinancing Choices', 'compare fees, rate changes, and time horizon', 'break-even months = fees / monthly savings', 'A lower payment always means a better loan.'),
      topic('Credit Recovery Plan', 'rebuild after missed payments or high balances', undefined, 'One mistake makes recovery impossible.'),
    ],
  },
  {
    id: 'investing',
    title: 'Investing',
    shortTitle: 'Invest',
    icon: 'I',
    description: 'Compounding, risk, diversification, allocation, ETFs, stocks, bonds, and fees.',
    competencyIds: ['riskReturn', 'portfolioConstruction', 'inflation'],
    topics: [
      topic('Compound Growth', 'connect time, rate, and contribution behavior', 'FV = PV(1+r)^n + PMT[((1+r)^n-1)/r]', 'Compounding only matters for rich people.'),
      topic('Risk And Return', 'match expected return with volatility and time horizon', undefined, 'Risk means guaranteed loss.'),
      topic('Diversification', 'reduce single-company and single-sector risk', undefined, 'Owning many similar assets is diversified.'),
      topic('Asset Allocation', 'choose stock, bond, cash, and alternative mix', undefined, 'Allocation is only for retirement accounts.'),
      topic('ETFs And Index Funds', 'compare holdings, expense ratios, and tracking', 'net return = gross return - fee', 'A low share price means an ETF is cheaper.'),
      topic('Stocks And Valuation', 'connect earnings, growth, cash flows, and expectations', 'P/E = price / earnings per share', 'A great company is always a great investment.'),
      topic('Bonds And Rates', 'understand income, duration, default, and price movement', undefined, 'Bonds never lose value.'),
      topic('Rebalancing', 'return the portfolio to target risk', undefined, 'Rebalancing means predicting the market.'),
      topic('Investor Behavior', 'avoid panic, overconfidence, chasing, and concentration', undefined, 'The hardest part of investing is picking products.'),
    ],
  },
  {
    id: 'taxes',
    title: 'Taxes',
    shortTitle: 'Taxes',
    icon: 'T',
    description: 'Withholding, forms, deductions, credits, capital gains, and self-employment basics.',
    competencyIds: ['taxPlanning', 'cashFlow'],
    topics: [
      topic('Paycheck Withholding', 'connect W-4 choices to paycheck and refund size', 'tax withheld per check x checks = annual withholding', 'A large refund is free money.'),
      topic('Tax Forms', 'read W-2, 1099, 1098, and brokerage forms', undefined, 'Forms are optional if income was small.'),
      topic('Deductions And Credits', 'separate taxable income reductions from tax bill reductions', undefined, 'Deductions and credits are the same.'),
      topic('Filing Status', 'see how household status changes brackets and benefits', undefined, 'Filing status is just a label.'),
      topic('Capital Gains', 'compare short-term, long-term, basis, and losses', 'gain = sale proceeds - cost basis', 'Selling an investment is never taxable if money stays invested.'),
      topic('Self-Employment Tax', 'plan income tax, payroll tax, and estimated payments', 'estimated tax = profit x expected tax rate', 'Side income is tax-free until it feels like a business.'),
      topic('Tax-Advantaged Accounts', 'compare Roth, traditional, HSA, and education accounts', undefined, 'Tax-advantaged means tax-free forever.'),
      topic('Audit Records', 'keep receipts, mileage, statements, and proof', undefined, 'Recordkeeping starts after a tax notice.'),
      topic('Tax Planning Calendar', 'make tax choices before year end', undefined, 'Taxes are only handled when filing.'),
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance And Risk',
    shortTitle: 'Risk',
    icon: 'R',
    description: 'Health, auto, renters, life, disability, deductibles, and risk transfer.',
    competencyIds: ['insuranceRisk', 'cashFlow'],
    topics: [
      topic('Risk Transfer', 'decide when to retain, reduce, avoid, or insure risk', undefined, 'Insurance is wasted money if nothing bad happens.'),
      topic('Deductibles', 'compare premium savings with cash reserve needs', 'expected cash need = deductible + uncovered costs', 'The lowest premium is always best.'),
      topic('Health Insurance', 'read premium, deductible, copay, coinsurance, and max out-of-pocket', undefined, 'Covered means free.'),
      topic('Auto Insurance', 'choose liability, collision, comprehensive, and limits', undefined, 'State minimum coverage protects your full finances.'),
      topic('Renters And Property', 'protect belongings, liability, and living expenses', undefined, 'Landlord insurance covers renter property.'),
      topic('Life Insurance', 'estimate income replacement and term length', 'coverage need = annual support x years - existing assets', 'Everyone needs permanent life insurance.'),
      topic('Disability Insurance', 'protect earning power against work interruptions', undefined, 'Emergency funds replace disability coverage.'),
      topic('Claims Decisions', 'decide when filing a claim is worth it', 'net claim value = payout - deductible - future premium impact', 'Every covered loss should become a claim.'),
      topic('Risk Map', 'rank risks by probability and severity', undefined, 'Rare risks can be ignored.'),
    ],
  },
  {
    id: 'career',
    title: 'Career And Income',
    shortTitle: 'Income',
    icon: 'Y',
    description: 'Paychecks, benefits, negotiation, side income, entrepreneurship, and resilience.',
    competencyIds: ['incomeGrowth', 'businessFinance', 'taxPlanning'],
    topics: [
      topic('Paycheck Anatomy', 'read gross pay, deductions, taxes, and net pay', 'net pay = gross pay - taxes - deductions', 'Salary and take-home pay are the same.'),
      topic('Benefits Valuation', 'compare health, retirement match, PTO, and stipends', 'total compensation = pay + benefits value', 'Only salary matters.'),
      topic('Negotiation Prep', 'build evidence, range, alternatives, and timing', undefined, 'Negotiation is just asking for more.'),
      topic('Raises And Promotions', 'connect skill growth to measurable business value', undefined, 'Hard work automatically becomes higher pay.'),
      topic('Side Income', 'price time, materials, taxes, and demand', 'profit = revenue - variable costs - tax reserve', 'Side income is pure extra money.'),
      topic('Entrepreneurial Pricing', 'set price from value, cost, market, and capacity', 'margin = profit / revenue', 'Lower prices always attract better customers.'),
      topic('Income Volatility', 'plan reserves for irregular or seasonal earnings', 'reserve target = monthly essentials x volatile months', 'A high average income solves volatility.'),
      topic('Career Risk', 'build skills, network, savings, and optionality', undefined, 'Job risk only matters after layoffs happen.'),
      topic('Human Capital', 'treat learning, credentials, and relationships as assets', undefined, 'Education value is only the degree name.'),
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Finance',
    shortTitle: 'Advanced',
    icon: 'A',
    description: 'Statements, valuation basics, portfolio construction, retirement, and decision analysis.',
    competencyIds: ['financialAnalysis', 'portfolioConstruction', 'retirementPlanning'],
    topics: [
      topic('Personal Financial Statements', 'build income statement, balance sheet, and cash-flow view', 'net worth = assets - liabilities', 'A high income guarantees financial strength.'),
      topic('Ratio Analysis', 'use savings rate, debt-to-income, liquidity, and runway', 'DTI = monthly debt payments / gross monthly income', 'One ratio can judge everything.'),
      topic('Scenario Analysis', 'compare base, upside, and downside cases', undefined, 'A forecast is a promise.'),
      topic('Portfolio Construction', 'combine goals, risk capacity, asset classes, and taxes', undefined, 'A portfolio is just a list of investments.'),
      topic('Retirement Planning', 'model contributions, returns, inflation, and withdrawal risk', 'real return = nominal return - inflation', 'A retirement number is fixed forever.'),
      topic('Valuation Basics', 'connect cash flow, growth, risk, and price', 'value = cash flow / discount rate', 'Cheap-looking prices mean undervalued assets.'),
      topic('Behavioral Finance', 'spot loss aversion, anchoring, herd behavior, and recency bias', undefined, 'Smart people are immune to bias.'),
      topic('Estate And Beneficiaries', 'organize beneficiaries, documents, and account access', undefined, 'Estate planning is only for wealthy families.'),
      topic('Integrated Money Plan', 'combine taxes, insurance, investing, credit, and goals', undefined, 'Financial topics can be solved in isolation.'),
    ],
  },
];

export const courseTracks: CourseTrack[] = trackBlueprints.map((track) => ({
  id: track.id,
  title: track.title,
  shortTitle: track.shortTitle,
  description: track.description,
  icon: track.icon,
  competencyIds: track.competencyIds,
  moduleIds: levelBlueprints.map((level) => `${track.id}-${level.id}`),
}));

export const lessonCatalog = generateLessonCatalog();
export const courseModules = generateCourseModules(lessonCatalog);
export const lessonUnits = courseModules.map(moduleToUnit);

export function getLessonById(lessonId?: string) {
  if (!lessonId) return undefined;
  return lessonCatalog.find((lesson) => lesson.id === lessonId);
}

export function getNextLesson(completedLessonIds: string[], profile?: OnboardingProfile) {
  const ordered = prioritizeLessons(lessonCatalog, profile);
  return (
    ordered.find((lesson) => !completedLessonIds.includes(lesson.id) && !isLessonSoftLocked(lesson, completedLessonIds))
    ?? ordered.find((lesson) => !completedLessonIds.includes(lesson.id))
    ?? ordered[0]
  );
}

export function getNextLessonAfter(lessonId: string, completedLessonIds: string[], profile?: OnboardingProfile) {
  const ordered = prioritizeLessons(lessonCatalog, profile);
  const currentIndex = ordered.findIndex((lesson) => lesson.id === lessonId);
  const search = currentIndex >= 0 ? ordered.slice(currentIndex + 1) : ordered;
  return (
    search.find((lesson) => !completedLessonIds.includes(lesson.id) && !isLessonSoftLocked(lesson, completedLessonIds))
    ?? search.find((lesson) => !completedLessonIds.includes(lesson.id))
    ?? getNextLesson(completedLessonIds, profile)
  );
}

export function isLessonSoftLocked(lesson: Lesson, completedLessonIds: string[]) {
  return lesson.prerequisites.some((id) => !completedLessonIds.includes(id));
}

export function getUnitsForTree(profile?: OnboardingProfile) {
  const preferredDomains = getPreferredDomains(profile);
  return [...lessonUnits].sort((a, b) => {
    const domainDelta = preferredDomains.indexOf(a.domain) - preferredDomains.indexOf(b.domain);
    if (domainDelta !== 0) return domainDelta;
    return getLevelRank(a.level) - getLevelRank(b.level);
  });
}

export function getCourseModules(profile?: OnboardingProfile) {
  const preferredDomains = getPreferredDomains(profile);
  return [...courseModules].sort((a, b) => {
    const domainDelta = preferredDomains.indexOf(a.trackId) - preferredDomains.indexOf(b.trackId);
    if (domainDelta !== 0) return domainDelta;
    return getLevelRank(a.level) - getLevelRank(b.level);
  });
}

export function getReviewLessons(progress: LessonProgress, profile?: OnboardingProfile) {
  const queued = (progress.reviewQueue ?? [])
    .map((lessonId) => getLessonById(lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson));
  const missedCompetencies = new Set(
    (progress.assessmentResults ?? [])
      .flatMap((result) => (result.passed ? [] : result.missedCompetencyIds)),
  );
  const adaptive = prioritizeLessons(lessonCatalog, profile).filter((lesson) => (
    !progress.completedLessonIds.includes(lesson.id)
    && lesson.competencyIds.some((competencyId) => missedCompetencies.has(competencyId))
  ));

  return [...queued, ...adaptive].filter((lesson, index, list) => (
    list.findIndex((candidate) => candidate.id === lesson.id) === index
  ));
}

export function getUpcomingAssessment(progress: LessonProgress, profile?: OnboardingProfile) {
  const modules = getCourseModules(profile);
  return modules
    .flatMap((module) => [module.examLessonId, module.projectLessonId])
    .map((lessonId) => getLessonById(lessonId))
    .find((lesson): lesson is Lesson => lesson !== undefined && !progress.completedLessonIds.includes(lesson.id));
}

export function getMasterySnapshot(progress: LessonProgress): MasterySnapshot[] {
  const computedMastery = { ...(progress.mastery ?? {}) };

  progress.completedLessonIds.forEach((lessonId) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;
    lesson.competencyIds.forEach((competencyId) => {
      if (computedMastery[competencyId]) return;
      computedMastery[competencyId] = buildInitialMastery(competencyId);
    });
  });

  return competencies.map((competency) => {
    const state = computedMastery[competency.id] ?? buildInitialMastery(competency.id);
    return {
      competency,
      state,
      percent: Math.round(
        state.conceptScore * 0.28
        + state.applicationScore * 0.32
        + state.quizScore * 0.24
        + state.projectScore * 0.16,
      ),
    };
  });
}

export function getModuleCompletion(module: LessonUnit | CourseModule, progress: LessonProgress) {
  const completed = module.lessonIds.filter((lessonId) => progress.completedLessonIds.includes(lessonId)).length;
  return {
    completed,
    total: module.lessonIds.length,
    percent: Math.round((completed / module.lessonIds.length) * 100),
  };
}

export function applyLessonCompletionToProgress(current: LessonProgress, lesson: Lesson): LessonProgress {
  if (current.completedLessonIds.includes(lesson.id)) return current;

  const completedLessonIds = [...current.completedLessonIds, lesson.id];
  const mastery = { ...(current.mastery ?? {}) };

  lesson.competencyIds.forEach((competencyId) => {
    const previous = mastery[competencyId] ?? buildInitialMastery(competencyId);
    mastery[competencyId] = {
      ...previous,
      conceptScore: clampScore(previous.conceptScore + getActivityGain(lesson, ['reading', 'concept', 'caseStudy'])),
      applicationScore: clampScore(previous.applicationScore + getActivityGain(lesson, ['scenario', 'calculator', 'sort', 'matching', 'decision', 'simulation'])),
      quizScore: clampScore(previous.quizScore + getActivityGain(lesson, ['quiz', 'exam'])),
      projectScore: clampScore(previous.projectScore + getActivityGain(lesson, ['project', 'reflection'])),
      confidence: clampScore(previous.confidence + lesson.masteryWeight * 4),
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });

  const assessmentResults = [...(current.assessmentResults ?? [])];
  if (lesson.steps.some((step) => step.type === 'exam' || step.type === 'project')) {
    const missedCompetencyIds = lesson.competencyIds.filter((competencyId) => (
      (mastery[competencyId]?.quizScore ?? 0) < 70
    ));
    const score = Math.max(
      70,
      Math.round(lesson.competencyIds.reduce((sum, competencyId) => sum + (mastery[competencyId]?.quizScore ?? 0), 0) / lesson.competencyIds.length),
    );
    assessmentResults.push({
      lessonId: lesson.id,
      moduleId: lesson.moduleId,
      score,
      maxScore: 100,
      passed: score >= 70,
      missedCompetencyIds,
      completedAt: new Date().toISOString(),
    });
  }

  const reviewQueue = [
    ...new Set([
      ...(current.reviewQueue ?? []).filter((lessonId) => lessonId !== lesson.id),
      ...(lesson.steps.some((step) => step.type === 'quiz' || step.type === 'calculator') ? [lesson.id] : []),
    ]),
  ].slice(-12);

  const certificates = [...(current.certificates ?? [])];
  const module = courseModules.find((candidate) => candidate.id === lesson.moduleId);
  if (module && module.lessonIds.every((lessonId) => completedLessonIds.includes(lessonId))) {
    certificates.push(module.id);
  }

  return {
    ...current,
    completedLessonIds,
    xp: current.xp + lesson.xp,
    streak: Math.max(1, current.streak + 1),
    activeLessonId: lesson.id,
    mastery,
    assessmentResults,
    reviewQueue,
    certificates: [...new Set(certificates)],
  };
}

function generateLessonCatalog() {
  const lessons: Lesson[] = [];

  trackBlueprints.forEach((track) => {
    levelBlueprints.forEach((level, levelIndex) => {
      let sequence = 1;
      track.topics.forEach((topic, topicIndex) => {
        const competencyId = track.competencyIds[topicIndex % track.competencyIds.length];
        const variants: Array<'seminar' | 'lab' | 'case'> = ['seminar', 'lab', 'case'];
        variants.forEach((variant) => {
          const id = buildLessonId(track.id, level.id, sequence);
          const previousId = getPreviousLessonId(track, level, sequence, levelIndex);
          lessons.push(buildLesson({
            id,
            track,
            level,
            sequence,
            topic,
            topicIndex,
            competencyId,
            variant,
            prerequisites: previousId ? [previousId] : [],
          }));
          sequence += 1;
        });
      });

      const examId = buildLessonId(track.id, level.id, sequence);
      lessons.push(buildAssessmentLesson({
        id: examId,
        track,
        level,
        sequence,
        type: 'exam',
        prerequisites: [buildLessonId(track.id, level.id, sequence - 1)],
      }));
      sequence += 1;

      const projectId = buildLessonId(track.id, level.id, sequence);
      lessons.push(buildAssessmentLesson({
        id: projectId,
        track,
        level,
        sequence,
        type: 'project',
        prerequisites: [examId],
      }));
    });
  });

  return lessons;
}

function generateCourseModules(lessons: Lesson[]) {
  return trackBlueprints.flatMap((track) => (
    levelBlueprints.map((level) => {
      const moduleId = `${track.id}-${level.id}`;
      const moduleLessons = lessons.filter((lesson) => lesson.moduleId === moduleId);
      return {
        id: moduleId,
        title: `${track.title}: ${level.title}`,
        trackId: track.id,
        level: level.id,
        description: level.description,
        lessonIds: moduleLessons.map((lesson) => lesson.id),
        competencyIds: track.competencyIds,
        masteryThreshold: level.masteryThreshold,
        examLessonId: moduleLessons.find((lesson) => lesson.steps.some((step) => step.type === 'exam'))?.id,
        projectLessonId: moduleLessons.find((lesson) => lesson.steps.some((step) => step.type === 'project'))?.id,
      };
    })
  ));
}

function buildLesson(input: {
  id: string;
  track: TrackBlueprint;
  level: LevelBlueprint;
  sequence: number;
  topic: TopicBlueprint;
  topicIndex: number;
  competencyId: CompetencyId;
  variant: 'seminar' | 'lab' | 'case';
  prerequisites: string[];
}): Lesson {
  const { id, track, level, sequence, topic, topicIndex, competencyId, variant, prerequisites } = input;
  const unitTitle = `${track.title}: ${level.title}`;
  const title = getVariantTitle(topic.title, variant, level.id);
  const duration = variant === 'seminar' ? 6 : variant === 'lab' ? 9 : 12;
  const xp = 20 + getLevelRank(level.id) * 8 + (variant === 'case' ? 8 : variant === 'lab' ? 4 : 0);

  return {
    id,
    title,
    domain: track.id,
    level: level.id,
    unitId: `${track.id}-${level.id}`,
    unitTitle,
    courseTrackId: track.id,
    moduleId: `${track.id}-${level.id}`,
    durationMinutes: duration,
    xp,
    prerequisites,
    difficulty: level.difficulty,
    learningObjectives: buildLearningObjectives(track, level, topic, variant),
    competencyIds: [competencyId, ...track.competencyIds.filter((idValue) => idValue !== competencyId).slice(0, 1)],
    competencyTags: [track.title, level.title, topic.title, getCompetencyTitle(competencyId)],
    masteryWeight: 1 + getLevelRank(level.id) * 0.25,
    formulaRefs: topic.formulaRef ? [topic.formulaRef] : [],
    misconceptions: [topic.misconception],
    steps: buildLessonActivities(track, level, topic, topicIndex, variant, competencyId, id),
  };
}

function buildAssessmentLesson(input: {
  id: string;
  track: TrackBlueprint;
  level: LevelBlueprint;
  sequence: number;
  type: 'exam' | 'project';
  prerequisites: string[];
}): Lesson {
  const { id, track, level, sequence, type, prerequisites } = input;
  const moduleTitle = `${track.title}: ${level.title}`;
  const isExam = type === 'exam';
  return {
    id,
    title: isExam ? `${moduleTitle} Mastery Exam` : `${moduleTitle} Capstone Project`,
    domain: track.id,
    level: level.id,
    unitId: `${track.id}-${level.id}`,
    unitTitle: moduleTitle,
    courseTrackId: track.id,
    moduleId: `${track.id}-${level.id}`,
    durationMinutes: isExam ? 18 : 25,
    xp: isExam ? 80 + getLevelRank(level.id) * 10 : 120 + getLevelRank(level.id) * 14,
    prerequisites,
    difficulty: level.difficulty,
    learningObjectives: isExam
      ? [`Prove readiness across ${track.shortTitle.toLowerCase()} concepts, calculations, and decisions.`]
      : [`Build a defensible ${track.shortTitle.toLowerCase()} plan using evidence and tradeoff analysis.`],
    competencyIds: track.competencyIds,
    competencyTags: [track.title, level.title, isExam ? 'Exam' : 'Capstone'],
    masteryWeight: isExam ? 2 : 3,
    formulaRefs: track.topics.flatMap((topic) => topic.formulaRef ? [topic.formulaRef] : []).slice(0, 4),
    misconceptions: track.topics.slice(0, 4).map((topic) => topic.misconception),
    steps: isExam
      ? buildExamActivities(track, level, id)
      : buildProjectActivities(track, level, id),
  };
}

function buildLessonActivities(
  track: TrackBlueprint,
  level: LevelBlueprint,
  topic: TopicBlueprint,
  topicIndex: number,
  variant: 'seminar' | 'lab' | 'case',
  competencyId: CompetencyId,
  lessonId: string,
): LessonActivity[] {
  const intro: LessonActivity = {
    id: `${lessonId}-reading`,
    type: 'reading',
    title: variant === 'seminar' ? 'Core concept' : variant === 'lab' ? 'Lab briefing' : 'Case brief',
    body: buildReadingBody(track, level, topic, variant),
    prompt: buildKeyIdea(topic, level),
    reveal: buildWorkedExample(track, topic),
    masteryWeight: 1,
  };

  if (variant === 'seminar') {
    return [
      intro,
      {
        id: `${lessonId}-scenario`,
        type: 'scenario',
        title: 'Choose the financial move',
        body: buildScenarioBody(track, topic),
        prompt: 'What should you do first?',
        choices: buildDecisionChoices(topic, level, competencyId),
        scenarioContext: buildScenarioContext(topic),
      },
      buildInteractiveActivity(track, level, topic, topicIndex, lessonId),
      buildQuizActivity(topic, level, lessonId),
    ];
  }

  if (variant === 'lab') {
    return [
      intro,
      buildCalculatorActivity(track, level, topic, lessonId),
      buildSortOrMatchActivity(topic, topicIndex, lessonId),
      {
        id: `${lessonId}-simulation`,
        type: 'simulation',
        title: 'Mini simulation',
        body: `Run a small what-if for ${topic.title.toLowerCase()}. One option protects the plan, one option is average, and one option moves fast while hiding risk.`,
        prompt: 'Choose the move you would test first.',
        simulationGoal: `Use ${topic.title.toLowerCase()} to make the risk visible before money moves.`,
        choices: buildSimulationChoices(topic),
      },
      buildQuizActivity(topic, level, lessonId),
    ];
  }

  return [
    {
      id: `${lessonId}-case`,
      type: 'caseStudy',
      title: 'Case file',
      body: buildCaseBody(topic),
      prompt: 'Find the key assumption before deciding.',
      scenarioContext: `${track.title} case at the ${level.title.toLowerCase()} level.`,
    },
    {
      id: `${lessonId}-decision`,
      type: 'decision',
      title: 'Boardroom decision',
      body: `Pick the decision that best balances the number, the behavior risk, and the downside for ${topic.title.toLowerCase()}.`,
      prompt: 'Which option would you defend?',
      choices: buildCaseChoices(topic),
    },
    {
      id: `${lessonId}-reflection`,
      type: 'reflection',
      title: 'Write the rule',
      body: `Turn this case into a personal rule. The best rule is specific enough to guide a future decision and flexible enough to survive a changed situation.`,
      prompt: `When I face ${topic.title.toLowerCase()}, I will...`,
    },
    buildQuizActivity(topic, level, lessonId),
  ];
}

function buildExamActivities(track: TrackBlueprint, level: LevelBlueprint, lessonId: string): LessonActivity[] {
  const topics = track.topics.slice(0, 4);
  return [
    {
      id: `${lessonId}-reading`,
      type: 'reading',
      title: 'Exam setup',
      body: `This exam checks whether you can explain, calculate, and apply ${track.title.toLowerCase()} at the ${level.title.toLowerCase()} level. Treat it like a practical: read the situation, name the constraint, use the right number, then choose a next action.`,
      prompt: 'A strong exam answer explains the decision rule, not just the definition.',
      reveal: `Example: if two options both sound good, compare their main tradeoff, then choose the option with the better risk-adjusted next step.`,
    },
    ...topics.slice(0, 2).map((topic, index) => ({
      id: `${lessonId}-quiz-${index}`,
      type: 'quiz' as const,
      title: `${topic.title} check`,
      body: `Answer this applied question about ${topic.title.toLowerCase()}.`,
      question: `Which answer best avoids the misconception: "${topic.misconception}"?`,
      choices: buildQuizChoices(topic),
      explanation: `The strongest answer connects the calculation or rule to the actual decision, not just the label.`,
      masteryWeight: 1.2,
    })),
    buildCalculatorActivity(track, level, topics[2], `${lessonId}-exam-calc`),
    {
      id: `${lessonId}-exam`,
      type: 'exam',
      title: 'Mastery gate',
      body: `You have to choose a plan and explain why it beats the alternatives. Mastery means you can defend the tradeoff, not just remember the term.`,
      prompt: 'Choose the answer you would submit.',
      choices: buildCaseChoices(topics[3]),
      explanation: 'A passing answer names the constraint, protects against the major risk, and uses the relevant number correctly.',
      masteryWeight: 2,
    },
  ];
}

function buildProjectActivities(track: TrackBlueprint, level: LevelBlueprint, lessonId: string): LessonActivity[] {
  return [
    {
      id: `${lessonId}-reading`,
      type: 'reading',
      title: 'Capstone brief',
      body: `Build a compact plan that connects ${track.title.toLowerCase()} to a real goal. The project should include assumptions, numbers, risks, and the next review date.`,
      prompt: 'A capstone plan should be small enough to maintain and specific enough to audit.',
      reveal: 'Example: write the goal, the deadline, the calculation, the biggest risk, and the next review date on one page.',
    },
    {
      id: `${lessonId}-simulation`,
      type: 'simulation',
      title: 'Stress test',
      body: 'Test your plan against a downside case, a normal case, and an upside case. A strong plan does not collapse when one assumption changes.',
      prompt: 'Which stress test should come first?',
      simulationGoal: 'Find the weakest part of the plan before real money moves.',
      choices: [
        { id: 'income-drop', text: 'Income drops or costs rise for one month', outcome: 'Good. This reveals cash-flow fragility before it becomes urgent.', score: 3 },
        { id: 'best-case', text: 'Everything goes better than expected', outcome: 'Useful later, but upside does not test resilience first.', score: 1 },
        { id: 'ignore', text: 'Skip stress testing and start now', outcome: 'Fast, but fragile. The capstone needs a risk check.', score: 0 },
      ],
    },
    {
      id: `${lessonId}-project`,
      type: 'project',
      title: 'Submit the plan',
      body: 'Pick the project deliverable you can actually maintain. In this version, selecting a deliverable records completion locally.',
      prompt: 'What will you build?',
      projectDeliverable: `${track.shortTitle} plan with assumptions, one calculation, one risk, and one action date.`,
      choices: [
        { id: 'worksheet', text: 'One-page money worksheet', outcome: 'Clear and repeatable.', score: 3 },
        { id: 'dashboard', text: 'Personal finance dashboard', outcome: 'Strong if you will update it weekly.', score: 3 },
        { id: 'notes', text: 'Loose notes with no numbers', outcome: 'A start, but the plan needs evidence.', score: 1 },
      ],
      masteryWeight: 3,
    },
    {
      id: `${lessonId}-reflection`,
      type: 'reflection',
      title: 'Confidence check',
      body: 'Rate the part you can explain without notes. If you cannot explain it, it belongs in your review queue.',
      prompt: 'The part I can defend is...',
    },
  ];
}

function buildInteractiveActivity(
  track: TrackBlueprint,
  level: LevelBlueprint,
  topic: TopicBlueprint,
  topicIndex: number,
  lessonId: string,
): LessonActivity {
  const activityTypes: LessonActivity['type'][] = ['calculator', 'sort', 'matching', 'decision', 'simulation'];
  const type = activityTypes[(topicIndex + getLevelRank(level.id)) % activityTypes.length];
  if (type === 'calculator') return buildCalculatorActivity(track, level, topic, lessonId);
  if (type === 'sort') return buildSortOrMatchActivity(topic, topicIndex, lessonId);
  if (type === 'matching') return buildMatchingActivity(topic, lessonId);
  if (type === 'simulation') {
    return {
      id: `${lessonId}-simulation`,
      type: 'simulation',
      title: 'What-if engine',
      body: `Test ${topic.title.toLowerCase()} by changing one assumption at a time. The goal is to see what breaks first.`,
      prompt: 'Pick the best first simulation.',
      simulationGoal: `Use ${topic.title.toLowerCase()} to compare a safe case, average case, and downside case.`,
      choices: buildSimulationChoices(topic),
    };
  }
  return {
    id: `${lessonId}-decision`,
    type: 'decision',
    title: 'Decision drill',
    body: `You need a decision rule for ${topic.title.toLowerCase()}, not a one-time answer.`,
    prompt: 'Choose the rule.',
    choices: buildDecisionChoices(topic, level, track.competencyIds[0]),
  };
}

function buildCalculatorActivity(track: TrackBlueprint, level: LevelBlueprint, topic: TopicBlueprint, lessonId: string): LessonActivity {
  const formulaKey = getFormulaKey(track.id, topic);
  return {
    id: `${lessonId}-calculator`,
    type: 'calculator',
    title: 'Guided calculator',
    body: `Use a quick model for ${topic.title.toLowerCase()}. Change the numbers and watch how the decision changes.`,
    calculator: {
      formulaKey,
      formula: getDefaultFormula(formulaKey),
      resultLabel: getResultLabel(formulaKey),
      explanation: getCalculatorExplanation(formulaKey, level),
      inputs: getCalculatorInputsByKey(formulaKey),
    },
  };
}

function buildSortOrMatchActivity(topic: TopicBlueprint, topicIndex: number, lessonId: string): LessonActivity {
  if (topicIndex % 2 === 0) {
    return {
      id: `${lessonId}-sort`,
      type: 'sort',
      title: 'Priority sort',
      body: `Sort the moves for ${topic.title.toLowerCase()} from most urgent to least urgent. In this version, tap the first move you would handle.`,
      prompt: 'Which belongs first?',
      sortItems: [
        { id: 'protect', text: 'Protect essentials and deadlines', rank: 1 },
        { id: 'measure', text: 'Measure the real monthly impact', rank: 2 },
        { id: 'optimize', text: 'Optimize rewards, yield, or upside', rank: 3 },
      ],
    };
  }
  return buildMatchingActivity(topic, lessonId);
}

function buildMatchingActivity(topic: TopicBlueprint, lessonId: string): LessonActivity {
  return {
    id: `${lessonId}-matching`,
    type: 'matching',
    title: 'Match the term',
    body: `Match the useful term to the decision it supports. Tap one pair to lock in the connection for ${topic.title.toLowerCase()}.`,
    prompt: 'Which pair is most useful here?',
    matchingPairs: [
      { id: 'constraint', term: 'Constraint', match: 'The limit that makes the tradeoff real' },
      { id: 'assumption', term: 'Assumption', match: 'A number or belief the plan depends on' },
      { id: 'buffer', term: 'Buffer', match: 'Room for error before the plan breaks' },
    ],
  };
}

function buildQuizActivity(topic: TopicBlueprint, level: LevelBlueprint, lessonId: string): LessonActivity {
  return {
    id: `${lessonId}-quiz`,
    type: 'quiz',
    title: 'Mastery check',
    body: `Check your understanding of ${topic.title.toLowerCase()}.`,
    question: `Which statement best fits ${level.title.toLowerCase()} mastery?`,
    choices: buildQuizChoices(topic),
    explanation: `The correct answer avoids this trap: ${topic.misconception}`,
    masteryWeight: 1,
  };
}

function buildDecisionChoices(topic: TopicBlueprint, level: LevelBlueprint, competencyId: CompetencyId) {
  return [
    {
      id: 'measure',
      text: 'Check one number, name the tradeoff, then choose the next action',
      outcome: `Strong ${level.title.toLowerCase()} move. You used ${topic.title.toLowerCase()} to turn ${getCompetencyTitle(competencyId).toLowerCase()} into a decision, not a guess.`,
      score: 3,
      correct: true,
    },
    {
      id: 'wait',
      text: 'Wait until the choice feels obvious',
      outcome: 'Waiting can help, but unmanaged uncertainty can become a hidden cost.',
      score: 1,
    },
    {
      id: 'follow',
      text: 'Copy what most people around you do',
      outcome: 'Social proof can be noisy. Your cash flow, risk, and goals are specific.',
      score: 0,
    },
  ];
}

function buildSimulationChoices(topic: TopicBlueprint) {
  return [
    {
      id: 'downside',
      text: 'Run the downside case first',
      outcome: `Good. ${topic.title} decisions improve when you find the weak point before money is committed.`,
      score: 3,
      correct: true,
    },
    {
      id: 'average',
      text: 'Use only the average case',
      outcome: 'Average cases hide stress. Add at least one bad month or lower-return case.',
      score: 1,
    },
    {
      id: 'ignore-risk',
      text: 'Ignore edge cases to move faster',
      outcome: 'Fast choices can be useful, but this skips the risk that usually causes regret.',
      score: 0,
    },
  ];
}

function buildCaseChoices(topic: TopicBlueprint) {
  return [
    {
      id: 'balanced',
      text: 'Use the relevant number, name the risk, and choose the reversible next step',
      outcome: `Strong case answer. It uses ${topic.title.toLowerCase()} without pretending the future is certain.`,
      score: 3,
      correct: true,
    },
    {
      id: 'maximum',
      text: 'Choose the option with the largest upside number',
      outcome: 'Upside matters, but mastery also checks downside, timing, and behavior.',
      score: 1,
    },
    {
      id: 'comfort',
      text: 'Choose the option that feels least stressful today',
      outcome: 'Stress is information, but it should not replace analysis.',
      score: 1,
    },
  ];
}

function buildQuizChoices(topic: TopicBlueprint) {
  return [
    {
      id: 'evidence',
      text: `Use ${topic.title.toLowerCase()} to compare options, check the main number, and choose the next action`,
      correct: true,
      outcome: 'Correct. Financial literacy is applied judgment, not trivia.',
      score: 3,
    },
    {
      id: 'label',
      text: `Memorize the definition of ${topic.title.toLowerCase()} and stop there`,
      outcome: 'Definitions help, but mastery requires applying the idea.',
      score: 1,
    },
    {
      id: 'shortcut',
      text: topic.misconception,
      outcome: 'That is the common trap this lesson is trying to remove.',
      score: 0,
    },
  ];
}

function getFormulaKey(domain: LessonDomain, topic?: TopicBlueprint): CalculatorFormulaKey {
  const title = topic?.title ?? '';
  if (title.includes('Opportunity Cost') || title.includes('Tradeoff')) return 'opportunityCost';
  if (title.includes('Subscription')) return 'annualCost';
  if (title.includes('Emergency') || title.includes('Buffer') || title.includes('Reserve')) return 'emergencyFund';
  if (title.includes('Utilization')) return 'utilization';
  if (topic?.title.includes('Compound') || topic?.formulaRef?.includes('FV =')) return 'compoundGrowth';
  if (title.includes('Deductible') || title.includes('Health Insurance') || title.includes('Auto Insurance') || title.includes('Claims')) return 'deductibleReserve';
  if (title.includes('Net Worth') || title.includes('Financial Statements') || title.includes('Money Statements')) return 'netWorth';
  if (title.includes('Pricing') || title.includes('Side Income') || title.includes('Margin')) return 'profitMargin';
  if (domain === 'budgeting' || domain === 'foundations' || domain === 'career') return 'budgetSurplus';
  if (domain === 'saving') return 'savingsGoal';
  if (domain === 'credit') return 'loanPayment';
  if (domain === 'taxes') return 'taxWithholding';
  if (domain === 'insurance') return 'deductibleReserve';
  if (domain === 'investing' || domain === 'advanced') return 'portfolioReturn';
  return 'budgetSurplus';
}

function getDefaultFormula(formulaKey: ReturnType<typeof getFormulaKey>) {
  if (formulaKey === 'opportunityCost') return 'Opportunity cost = value of next best option - value of chosen option';
  if (formulaKey === 'annualCost') return 'Annual cost = monthly cost x 12 + extra fees';
  if (formulaKey === 'compoundGrowth') return 'FV = PV x (1 + r)^n';
  if (formulaKey === 'deductibleReserve') return 'Cash gap = deductible + uncovered costs - cash on hand';
  if (formulaKey === 'emergencyFund') return 'Emergency gap = monthly essentials x months needed - current savings';
  if (formulaKey === 'loanPayment') return 'Payment = P x r / (1 - (1 + r)^-n)';
  if (formulaKey === 'netWorth') return 'Net worth = assets - liabilities';
  if (formulaKey === 'profitMargin') return 'Profit margin = (revenue - costs - tax reserve) / revenue';
  if (formulaKey === 'taxWithholding') return 'Annual withholding = withholding per check x checks';
  if (formulaKey === 'utilization') return 'Credit utilization = statement balance / credit limit';
  if (formulaKey === 'portfolioReturn') return 'Weighted return = sum(weight x return)';
  if (formulaKey === 'savingsGoal') return 'Monthly saving = target / months';
  return 'Surplus = income - fixed costs - variable costs - saving';
}

function getResultLabel(formulaKey: ReturnType<typeof getFormulaKey>) {
  if (formulaKey === 'opportunityCost') return 'Opportunity cost';
  if (formulaKey === 'annualCost') return 'Annual cost';
  if (formulaKey === 'compoundGrowth') return 'Estimated future value';
  if (formulaKey === 'deductibleReserve') return 'Cash gap to cover';
  if (formulaKey === 'emergencyFund') return 'Emergency fund gap';
  if (formulaKey === 'loanPayment') return 'Estimated monthly payment';
  if (formulaKey === 'netWorth') return 'Estimated net worth';
  if (formulaKey === 'profitMargin') return 'Profit margin';
  if (formulaKey === 'taxWithholding') return 'Estimated annual withholding';
  if (formulaKey === 'utilization') return 'Credit utilization';
  if (formulaKey === 'portfolioReturn') return 'Expected annual return';
  if (formulaKey === 'savingsGoal') return 'Monthly saving needed';
  return 'Monthly surplus';
}

function getCalculatorInputsByKey(formulaKey: ReturnType<typeof getFormulaKey>) {
  if (formulaKey === 'opportunityCost') {
    return [
      { id: 'chosenValue', label: 'Chosen option value', value: 120, min: 0, max: 10000, step: 25, prefix: '$' },
      { id: 'nextBestValue', label: 'Next best option value', value: 200, min: 0, max: 10000, step: 25, prefix: '$' },
    ];
  }
  if (formulaKey === 'annualCost') {
    return [
      { id: 'monthlyCost', label: 'Monthly cost', value: 18, min: 0, max: 500, step: 5, prefix: '$' },
      { id: 'extraFees', label: 'Annual fees', value: 0, min: 0, max: 1000, step: 25, prefix: '$' },
    ];
  }
  if (formulaKey === 'compoundGrowth') {
    return [
      { id: 'principal', label: 'Starting amount', value: 1000, min: 0, max: 100000, step: 500, prefix: '$' },
      { id: 'contribution', label: 'Monthly add', value: 150, min: 0, max: 5000, step: 50, prefix: '$' },
      { id: 'rate', label: 'Annual return', value: 7, min: -10, max: 20, step: 1, suffix: '%' },
      { id: 'years', label: 'Years', value: 10, min: 1, max: 50, step: 1 },
    ];
  }
  if (formulaKey === 'deductibleReserve') {
    return [
      { id: 'deductible', label: 'Deductible', value: 1000, min: 0, max: 10000, step: 250, prefix: '$' },
      { id: 'uncovered', label: 'Uncovered costs', value: 300, min: 0, max: 10000, step: 100, prefix: '$' },
      { id: 'cashOnHand', label: 'Cash on hand', value: 500, min: 0, max: 20000, step: 250, prefix: '$' },
    ];
  }
  if (formulaKey === 'emergencyFund') {
    return [
      { id: 'monthlyEssentials', label: 'Monthly essentials', value: 1800, min: 300, max: 12000, step: 100, prefix: '$' },
      { id: 'months', label: 'Months needed', value: 3, min: 1, max: 12, step: 1 },
      { id: 'currentSavings', label: 'Current savings', value: 700, min: 0, max: 50000, step: 100, prefix: '$' },
    ];
  }
  if (formulaKey === 'loanPayment') {
    return [
      { id: 'principal', label: 'Loan amount', value: 8000, min: 500, max: 50000, step: 500, prefix: '$' },
      { id: 'rate', label: 'APR', value: 12, min: 1, max: 35, step: 1, suffix: '%' },
      { id: 'months', label: 'Months', value: 36, min: 6, max: 84, step: 6 },
    ];
  }
  if (formulaKey === 'netWorth') {
    return [
      { id: 'assets', label: 'Assets', value: 12000, min: 0, max: 500000, step: 1000, prefix: '$' },
      { id: 'liabilities', label: 'Liabilities', value: 4500, min: 0, max: 500000, step: 500, prefix: '$' },
    ];
  }
  if (formulaKey === 'profitMargin') {
    return [
      { id: 'revenue', label: 'Revenue', value: 1200, min: 100, max: 50000, step: 100, prefix: '$' },
      { id: 'costs', label: 'Costs', value: 650, min: 0, max: 40000, step: 50, prefix: '$' },
      { id: 'taxReserve', label: 'Tax reserve', value: 150, min: 0, max: 15000, step: 50, prefix: '$' },
    ];
  }
  if (formulaKey === 'taxWithholding') {
    return [
      { id: 'perCheck', label: 'Tax per check', value: 220, min: 0, max: 1200, step: 20, prefix: '$' },
      { id: 'checks', label: 'Checks per year', value: 26, min: 12, max: 52, step: 1 },
      { id: 'credits', label: 'Credits', value: 0, min: 0, max: 5000, step: 250, prefix: '$' },
    ];
  }
  if (formulaKey === 'utilization') {
    return [
      { id: 'balance', label: 'Statement balance', value: 450, min: 0, max: 20000, step: 50, prefix: '$' },
      { id: 'limit', label: 'Credit limit', value: 2000, min: 100, max: 50000, step: 100, prefix: '$' },
    ];
  }
  if (formulaKey === 'portfolioReturn') {
    return [
      { id: 'stocksWeight', label: 'Stock weight', value: 70, min: 0, max: 100, step: 5, suffix: '%' },
      { id: 'stockReturn', label: 'Stock return', value: 8, min: -20, max: 20, step: 1, suffix: '%' },
      { id: 'bondReturn', label: 'Other return', value: 4, min: -10, max: 15, step: 1, suffix: '%' },
    ];
  }
  if (formulaKey === 'savingsGoal') {
    return [
      { id: 'target', label: 'Goal amount', value: 1200, min: 100, max: 20000, step: 100, prefix: '$' },
      { id: 'months', label: 'Months', value: 12, min: 1, max: 60, step: 1 },
      { id: 'current', label: 'Already saved', value: 100, min: 0, max: 10000, step: 50, prefix: '$' },
    ];
  }
  return [
    { id: 'income', label: 'Monthly income', value: 2800, min: 500, max: 15000, step: 100, prefix: '$' },
    { id: 'fixed', label: 'Fixed costs', value: 1400, min: 0, max: 10000, step: 100, prefix: '$' },
    { id: 'variable', label: 'Variable costs', value: 700, min: 0, max: 8000, step: 50, prefix: '$' },
    { id: 'saving', label: 'Planned saving', value: 250, min: 0, max: 5000, step: 50, prefix: '$' },
  ];
}

function buildLearningObjectives(track: TrackBlueprint, level: LevelBlueprint, topic: TopicBlueprint, variant: string) {
  return [
    `Explain ${topic.title.toLowerCase()} in plain language and connect it to a real ${track.shortTitle.toLowerCase()} decision.`,
    `Use one ${level.title.toLowerCase()}-level tool to compare options before acting.`,
    variant === 'case'
      ? `Defend a choice when ${topic.misconception.toLowerCase()} appears in a case.`
      : `Avoid the misconception: ${topic.misconception}`,
  ];
}

function buildReadingBody(track: TrackBlueprint, level: LevelBlueprint, topic: TopicBlueprint, variant: string) {
  const mode = variant === 'seminar'
    ? 'Start with the mental model.'
    : variant === 'lab'
      ? 'Turn the idea into a number you can inspect.'
      : 'Use the idea inside a messy real-life case.';
  return `${mode} ${topic.title} teaches you to ${topic.focus}. In ${track.title.toLowerCase()}, this matters because money choices usually have constraints: time, cash, risk, or behavior. Learn the rule, test it with a number, then decide the next action. ${level.description}`;
}

function buildKeyIdea(topic: TopicBlueprint, level: LevelBlueprint) {
  const levelMove = level.id === 'foundations'
    ? 'name the tradeoff'
    : level.id === 'applied'
      ? 'use it in a realistic choice'
      : level.id === 'analytical'
        ? 'compare the options with evidence'
        : 'defend the decision under uncertainty';
  return `${topic.title} is not a vocabulary word to memorize. It is a decision tool: ${levelMove}, check the main number, and avoid the trap that "${topic.misconception}"`;
}

function buildWorkedExample(track: TrackBlueprint, topic: TopicBlueprint) {
  return `Example: before making a ${track.shortTitle.toLowerCase()} choice, write down the option you like, the option you would give up, the number that matters most, and the risk that could make the plan fail. For ${topic.title.toLowerCase()}, that number should help you ${topic.focus}.`;
}

function buildScenarioBody(track: TrackBlueprint, topic: TopicBlueprint) {
  return `You have a real ${track.shortTitle.toLowerCase()} decision to make and not enough information to feel certain. Use ${topic.title.toLowerCase()} to slow the choice down: compare the options, name the risk, and choose the next small action.`;
}

function buildScenarioContext(topic: TopicBlueprint) {
  return `Skill focus: ${topic.focus}. Common trap: ${topic.misconception}`;
}

function buildCaseBody(topic: TopicBlueprint) {
  return `A learner is trying to use ${topic.title.toLowerCase()} but starts with a shaky assumption: "${topic.misconception}" Your job is to find the assumption, test it with one number, and choose a plan that still works if conditions change.`;
}

function getCalculatorExplanation(formulaKey: CalculatorFormulaKey, level: LevelBlueprint) {
  const prefix = `At the ${level.title.toLowerCase()} level, do not chase perfect precision. `;
  if (formulaKey === 'opportunityCost') return `${prefix}Use the result to see what the chosen option gives up. A high opportunity cost means the tradeoff needs a better reason.`;
  if (formulaKey === 'annualCost') return `${prefix}Monthly numbers can feel small. Annualizing makes quiet recurring costs visible.`;
  if (formulaKey === 'compoundGrowth') return `${prefix}The result shows how time, return, and contributions interact. Small changes compound when repeated.`;
  if (formulaKey === 'deductibleReserve') return `${prefix}Insurance only works well if you can cover the cash gap when a claim happens.`;
  if (formulaKey === 'emergencyFund') return `${prefix}The gap tells you how much more cash buffer is needed before the plan is resilient.`;
  if (formulaKey === 'loanPayment') return `${prefix}The payment is only part of the loan story. Use it with APR and term length to see the full cost.`;
  if (formulaKey === 'netWorth') return `${prefix}Net worth is a snapshot of financial position, not a judgment of income or effort.`;
  if (formulaKey === 'profitMargin') return `${prefix}Margin shows how much room the business has after costs and tax reserve. Revenue alone can mislead.`;
  if (formulaKey === 'taxWithholding') return `${prefix}Withholding is timing. The goal is avoiding surprises, not winning the biggest refund.`;
  if (formulaKey === 'utilization') return `${prefix}Utilization shows how much of a credit line is being reported as used. Lower usually gives more score flexibility.`;
  if (formulaKey === 'portfolioReturn') return `${prefix}Expected return is not guaranteed. It helps compare the role each asset plays in the whole portfolio.`;
  return `${prefix}The result shows whether the plan has breathing room after essentials, variable costs, and planned saving.`;
}

function getVariantTitle(topicTitle: string, variant: 'seminar' | 'lab' | 'case', level: LessonLevel) {
  const prefix = level === 'foundations' ? 'Build' : level === 'applied' ? 'Use' : level === 'analytical' ? 'Analyze' : 'Master';
  if (variant === 'seminar') return `${prefix}: ${topicTitle}`;
  if (variant === 'lab') return `${topicTitle} Lab`;
  return `${topicTitle} Case`;
}

function prioritizeLessons(lessons: Lesson[], profile?: OnboardingProfile) {
  const preferredDomains = getPreferredDomains(profile);
  return [...lessons].sort((a, b) => {
    const domainDelta = preferredDomains.indexOf(a.domain) - preferredDomains.indexOf(b.domain);
    if (domainDelta !== 0) return domainDelta;
    const levelDelta = getLevelRank(a.level) - getLevelRank(b.level);
    if (levelDelta !== 0) return levelDelta;
    return a.id.localeCompare(b.id);
  });
}

function getPreferredDomains(profile?: OnboardingProfile): LessonDomain[] {
  const answers = profile?.answers ?? {};
  const interests = answers.interests ?? [];
  const focus = answers.budgetFocus?.[0] ?? '';
  const goal = answers.primaryGoal?.[0] ?? '';
  const experience = answers.experience?.[0] ?? '';
  const preferred: LessonDomain[] = [];

  if (goal.includes('Budget') || focus) preferred.push('foundations', 'budgeting', 'saving');
  if (interests.includes('Credit')) preferred.push('credit');
  if (interests.includes('Stocks') || interests.includes('ETFs')) preferred.push('investing');
  if (interests.includes('Crypto')) preferred.push('investing', 'advanced');
  if (interests.includes('Entrepreneurship')) preferred.push('career', 'entrepreneurship');
  if (goal.includes('Learn') || goal.includes('Grow') || goal.includes('All')) preferred.push('foundations', 'investing', 'advanced');
  if (experience.includes('New')) preferred.unshift('foundations');

  const fallback: LessonDomain[] = ['foundations', 'budgeting', 'saving', 'credit', 'investing', 'taxes', 'insurance', 'career', 'advanced'];
  return [...new Set([...preferred, ...fallback])];
}

function getPreviousLessonId(track: TrackBlueprint, level: LevelBlueprint, sequence: number, levelIndex: number) {
  if (sequence > 1) return buildLessonId(track.id, level.id, sequence - 1);
  if (levelIndex === 0) return undefined;
  const previousLevel = levelBlueprints[levelIndex - 1];
  return buildLessonId(track.id, previousLevel.id, 29);
}

function buildLessonId(trackId: LessonDomain, levelId: LessonLevel, sequence: number) {
  return `${trackId}-${levelId}-${String(sequence).padStart(3, '0')}`;
}

function moduleToUnit(module: CourseModule): LessonUnit {
  return {
    id: module.id,
    title: module.title,
    domain: module.trackId,
    level: module.level,
    lessonIds: module.lessonIds,
    description: module.description,
    trackId: module.trackId,
    competencyIds: module.competencyIds,
    masteryThreshold: module.masteryThreshold,
  };
}

function buildInitialMastery(competencyId: CompetencyId): MasteryState {
  return {
    competencyId,
    conceptScore: 0,
    applicationScore: 0,
    quizScore: 0,
    projectScore: 0,
    confidence: 0,
  };
}

function getActivityGain(lesson: Lesson, activityTypes: LessonActivity['type'][]) {
  const count = lesson.steps.filter((step) => activityTypes.includes(step.type)).length;
  return count * lesson.masteryWeight * 9;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getLevelRank(level: LessonLevel) {
  if (level === 'foundations' || level === 'beginner') return 0;
  if (level === 'applied' || level === 'builder') return 1;
  if (level === 'analytical' || level === 'confident') return 2;
  return 3;
}

function getCompetencyTitle(competencyId: CompetencyId) {
  return competencies.find((competency) => competency.id === competencyId)?.title ?? competencyId;
}

function topic(titleValue: string, focus: string, formulaRef: string | undefined, misconception: string): TopicBlueprint {
  return {
    title: titleValue,
    focus,
    formulaRef,
    misconception,
  };
}
