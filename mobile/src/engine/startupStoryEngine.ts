import type {
  GameResult,
  StartupActionId,
  StartupArchetypeId,
  StartupEventId,
  StartupFundingId,
  StartupHireId,
  StartupLogo,
  StartupLogoPalette,
  StartupLogoShape,
  StartupMilestone,
  StartupMilestoneId,
  StartupReview,
  StartupReviewIssue,
  StartupSession,
  StartupSessionStatus,
  StartupStage,
  StartupTeam,
} from '../types/game';

type StartupArchetypeDefinition = {
  id: StartupArchetypeId;
  title: string;
  subtitle: string;
  description: string;
  startingCash: number;
  startingCustomers: number;
  price: number;
  monthlyCosts: number;
  grossMargin: number;
  cac: number;
  churn: number;
  productQuality: number;
  brand: number;
  morale: number;
  valuation: number;
  risk: number;
  color: string;
  strengths: string[];
  warnings: string[];
  seedOffset: number;
};

type StartupActionDefinition = {
  id: StartupActionId;
  title: string;
  description: string;
  lesson: string;
  whyItMatters: string;
  accent: string;
};

type StartupFundingDefinition = {
  id: StartupFundingId;
  title: string;
  description: string;
  tradeoff: string;
  accent: string;
};

type StartupEventDefinition = {
  id: StartupEventId;
  title: string;
  description: string;
  lesson: string;
  whyItMatters: string;
  revenueMultiplier?: number;
  costMultiplier?: number;
  cogsDelta?: number;
  cacMultiplier?: number;
  churnDelta?: number;
  customerDelta?: number;
  moraleDelta?: number;
  riskDelta?: number;
  brandDelta?: number;
  productQualityDelta?: number;
  cashImpact?: number;
};

const MAX_RISK = 120;
const STARTING_OWNERSHIP = 100;
const PROFITABLE_MONTHS_TO_WIN = 3;

const emptyTeam: StartupTeam = {
  engineer: 0,
  operator: 0,
  sales: 0,
};

const milestoneCatalog: Array<{ id: StartupMilestoneId; title: string }> = [
  { id: 'mvp-shipped', title: 'MVP shipped' },
  { id: 'first-paying-customers', title: 'First paying customers' },
  { id: 'unit-economics-positive', title: 'Unit economics positive' },
  { id: 'profit-streak', title: '3-month profit streak' },
  { id: 'runway-secured', title: 'Runway secured' },
];

const defaultLogo: StartupLogo = {
  shape: 'badge',
  palette: 'sunrise',
  wordmark: 'NV',
};

const customerNames = [
  'Maya',
  'Jordan',
  'Sam',
  'Priya',
  'Nico',
  'Avery',
  'Riley',
  'Devon',
  'Lena',
  'Marcus',
];

export const startupArchetypeCatalog: StartupArchetypeDefinition[] = [
  {
    id: 'saas',
    title: 'SaaS App',
    subtitle: 'Subscription software',
    description: 'High gross margin, compounding retention, and pressure to prove product-market fit.',
    startingCash: 32000,
    startingCustomers: 24,
    price: 29,
    monthlyCosts: 11800,
    grossMargin: 0.86,
    cac: 58,
    churn: 14,
    productQuality: 34,
    brand: 24,
    morale: 82,
    valuation: 135000,
    risk: 34,
    color: '#6E9BC8',
    strengths: ['High margin', 'VC-compatible', 'Retention compounds'],
    warnings: ['Slow trust', 'Churn-sensitive', 'Engineering cost'],
    seedOffset: 1,
  },
  {
    id: 'local-service',
    title: 'Local Service',
    subtitle: 'Neighborhood operator',
    description: 'Fast revenue, debt-friendly cash flow, and heavy pressure on staffing and quality.',
    startingCash: 21000,
    startingCustomers: 9,
    price: 320,
    monthlyCosts: 8400,
    grossMargin: 0.52,
    cac: 135,
    churn: 19,
    productQuality: 42,
    brand: 30,
    morale: 86,
    valuation: 72000,
    risk: 28,
    color: '#77B7B2',
    strengths: ['Immediate revenue', 'Clear customer needs', 'Debt-friendly'],
    warnings: ['Labor bottlenecks', 'Lower margin', 'Quality depends on process'],
    seedOffset: 4,
  },
  {
    id: 'product-brand',
    title: 'Product Brand',
    subtitle: 'Inventory business',
    description: 'Marketing can scale quickly, but cash gets trapped in inventory and cost of goods.',
    startingCash: 28000,
    startingCustomers: 95,
    price: 46,
    monthlyCosts: 12800,
    grossMargin: 0.44,
    cac: 24,
    churn: 24,
    productQuality: 38,
    brand: 34,
    morale: 80,
    valuation: 96000,
    risk: 39,
    color: '#DFAF3F',
    strengths: ['Brand leverage', 'Fast campaign feedback', 'Retail upside'],
    warnings: ['Inventory risk', 'COGS pressure', 'Cash conversion delays'],
    seedOffset: 6,
  },
];

export const startupActionCatalog: StartupActionDefinition[] = [
  {
    id: 'build-product',
    title: 'Build Product',
    description: 'Invest in the offer before pushing harder on growth.',
    lesson: 'A better product lowers support pain and makes retention easier.',
    whyItMatters: 'Growth before product quality often creates churn instead of a real business.',
    accent: '#6E9BC8',
  },
  {
    id: 'customer-discovery',
    title: 'Talk To Customers',
    description: 'Interview, observe, and sharpen the problem you solve.',
    lesson: 'Customer discovery turns guesses into evidence.',
    whyItMatters: 'Founders waste less cash when they learn why people buy, stay, or leave.',
    accent: '#77B7B2',
  },
  {
    id: 'adjust-pricing',
    title: 'Adjust Pricing',
    description: 'Raise prices and test whether the value proposition holds.',
    lesson: 'Pricing is strategy, not decoration.',
    whyItMatters: 'A small price change can move runway faster than a much larger growth push.',
    accent: '#C7A34A',
  },
  {
    id: 'launch-marketing',
    title: 'Launch Marketing',
    description: 'Spend to acquire customers and build awareness.',
    lesson: 'Marketing only works when CAC is lower than the customer value you keep.',
    whyItMatters: 'Buying unprofitable growth can make revenue rise while the company gets weaker.',
    accent: '#A78BC7',
  },
  {
    id: 'hire-teammate',
    title: 'Hire Teammate',
    description: 'Add a focused operator, builder, or seller to unlock capacity.',
    lesson: 'Hiring trades fixed cost for speed and capability.',
    whyItMatters: 'The right hire removes a bottleneck; the wrong timing shortens runway.',
    accent: '#8DAA5B',
  },
  {
    id: 'cut-costs',
    title: 'Cut Costs',
    description: 'Reduce burn and extend runway, with morale and quality tradeoffs.',
    lesson: 'Cost cuts buy time, but repeated cuts can damage execution.',
    whyItMatters: 'Survival matters, but starving the business can slow the path to profit.',
    accent: '#BD6D72',
  },
  {
    id: 'improve-operations',
    title: 'Improve Operations',
    description: 'Fix process, fulfillment, support, and delivery quality.',
    lesson: 'Operations convert demand into repeatable profit.',
    whyItMatters: 'A company wins when customers can be served reliably at a healthy margin.',
    accent: '#5F8C6A',
  },
];

export const startupFundingCatalog: StartupFundingDefinition[] = [
  {
    id: 'bootstrap',
    title: 'Bootstrap',
    description: 'Use current cash and keep full control this month.',
    tradeoff: 'No dilution, but no extra runway.',
    accent: '#5F8C6A',
  },
  {
    id: 'vc-round',
    title: 'Raise VC',
    description: 'Trade ownership for a larger runway extension and growth pressure.',
    tradeoff: 'More cash, less control, higher expectations.',
    accent: '#6E9BC8',
  },
  {
    id: 'debt',
    title: 'Take Debt',
    description: 'Borrow capital without dilution, then handle repayment risk.',
    tradeoff: 'Keeps ownership, adds fixed obligations.',
    accent: '#DFAF3F',
  },
];

export const startupLogoShapes: StartupLogoShape[] = ['badge', 'spark', 'orbit', 'stack'];

export const startupLogoPalettes: StartupLogoPalette[] = ['sunrise', 'mint', 'ocean', 'ink'];

export const startupEventCatalog: StartupEventDefinition[] = [
  {
    id: 'platform-shift',
    title: 'Platform Shift',
    description: 'A channel algorithm changes and paid acquisition gets harder.',
    lesson: 'Channel risk is real when one platform controls your demand.',
    whyItMatters: 'Durable companies build more than one way to reach customers.',
    cacMultiplier: 1.18,
    riskDelta: 7,
    brandDelta: -2,
  },
  {
    id: 'enterprise-lead',
    title: 'Demand Spike',
    description: 'A larger customer segment notices the company.',
    lesson: 'Big opportunities are useful only when delivery can keep up.',
    whyItMatters: 'Saying yes too early can damage reputation; saying yes well can change the business.',
    revenueMultiplier: 1.12,
    customerDelta: 8,
    moraleDelta: 4,
    riskDelta: 3,
  },
  {
    id: 'supplier-spike',
    title: 'Cost Spike',
    description: 'Input costs rise and margins tighten.',
    lesson: 'Gross margin determines how much room a company has to survive surprises.',
    whyItMatters: 'Low-margin businesses need stronger pricing power and cash buffers.',
    cogsDelta: 0.06,
    cashImpact: -900,
    riskDelta: 6,
  },
  {
    id: 'competitor-launch',
    title: 'Competitor Launch',
    description: 'A similar business launches with a loud offer.',
    lesson: 'Competition exposes weak positioning.',
    whyItMatters: 'Strong retention and brand make customers less likely to switch.',
    churnDelta: 3.2,
    cacMultiplier: 1.1,
    riskDelta: 6,
  },
  {
    id: 'viral-thread',
    title: 'Viral Moment',
    description: 'A customer story travels farther than expected.',
    lesson: 'Earned attention can lower CAC, but only if the offer is ready.',
    whyItMatters: 'A viral spike creates value when the company can convert and retain the traffic.',
    revenueMultiplier: 1.16,
    cacMultiplier: 0.86,
    customerDelta: 14,
    brandDelta: 8,
    moraleDelta: 5,
  },
  {
    id: 'founder-fatigue',
    title: 'Founder Fatigue',
    description: 'Long hours catch up with the team.',
    lesson: 'Founder energy is an operating asset.',
    whyItMatters: 'A business can have demand and still fail if execution capacity breaks.',
    moraleDelta: -11,
    productQualityDelta: -2,
    riskDelta: 7,
  },
  {
    id: 'payment-delay',
    title: 'Payment Delay',
    description: 'Customers buy, but some cash arrives late.',
    lesson: 'Profit and cash flow are not the same thing.',
    whyItMatters: 'Companies fail when cash timing breaks, even if sales look healthy.',
    revenueMultiplier: 0.92,
    cashImpact: -1400,
    riskDelta: 5,
  },
  {
    id: 'retention-signal',
    title: 'Retention Signal',
    description: 'Customer behavior reveals what keeps people coming back.',
    lesson: 'Retention is evidence that the company creates repeated value.',
    whyItMatters: 'A retained customer is usually cheaper and more valuable than a newly acquired one.',
    churnDelta: -2.8,
    customerDelta: 3,
    brandDelta: 3,
    moraleDelta: 3,
  },
];

export function createInitialStartupSession(): StartupSession {
  return {
    companyName: 'New Venture',
    archetypeId: undefined,
    stage: 'idea',
    phase: 'setup',
    status: 'playing',
    month: 1,
    maxMonths: 18,
    cash: 0,
    revenue: 0,
    monthlyCosts: 0,
    runwayMonths: 0,
    productQuality: 0,
    customerCount: 0,
    price: 0,
    cac: 0,
    churn: 0,
    retention: 0,
    brand: 0,
    customerSatisfaction: 0,
    team: { ...emptyTeam },
    morale: 80,
    ownership: STARTING_OWNERSHIP,
    debt: 0,
    valuation: 0,
    risk: 20,
    profitableStreak: 0,
    fundingRounds: 0,
    pendingSpend: 0,
    pendingFunding: 0,
    actionTakenThisMonth: false,
    fundingTakenThisMonth: false,
    totalRevenue: 0,
    totalCosts: 0,
    startingOwnership: STARTING_OWNERSHIP,
    logo: defaultLogo,
    reviews: [],
    milestones: createMilestones(),
    ledger: [],
    message: 'Choose a business model and start building.',
  };
}

export function normalizeStartupSession(session: StartupSession): StartupSession {
  const fresh = createInitialStartupSession();
  return {
    ...fresh,
    ...session,
    maxMonths: session.maxMonths ?? fresh.maxMonths,
    team: { ...fresh.team, ...(session.team ?? {}) },
    logo: { ...fresh.logo, ...(session.logo ?? {}) },
    reviews: session.reviews ?? fresh.reviews,
    milestones: session.milestones ?? fresh.milestones,
    ledger: session.ledger ?? fresh.ledger,
    pendingSpend: session.pendingSpend ?? 0,
    pendingFunding: session.pendingFunding ?? 0,
    actionTakenThisMonth: session.actionTakenThisMonth ?? false,
    fundingTakenThisMonth: session.fundingTakenThisMonth ?? false,
  };
}

export function chooseStartupArchetype(
  session: StartupSession,
  archetypeId: StartupArchetypeId,
  companyName: string,
): StartupSession {
  const archetype = getStartupArchetype(archetypeId);
  const name = companyName.trim() || archetype.title;
  const cash = archetype.startingCash;
  const revenue = roundMoney(archetype.startingCustomers * archetype.price);
  const monthlyCosts = archetype.monthlyCosts;

  return {
    ...createInitialStartupSession(),
    companyName: name,
    archetypeId,
    stage: 'mvp',
    phase: 'dashboard',
    cash,
    revenue,
    monthlyCosts,
    runwayMonths: calculateRunway(cash, revenue, monthlyCosts, 0),
    productQuality: archetype.productQuality,
    customerCount: archetype.startingCustomers,
    price: archetype.price,
    cac: archetype.cac,
    churn: archetype.churn,
    retention: roundMoney(100 - archetype.churn),
    brand: archetype.brand,
    customerSatisfaction: calculateCustomerSatisfaction({
      ...session,
      productQuality: archetype.productQuality,
      churn: archetype.churn,
      retention: roundMoney(100 - archetype.churn),
      brand: archetype.brand,
      morale: archetype.morale,
    }),
    morale: archetype.morale,
    valuation: archetype.valuation,
    risk: archetype.risk,
    activeEventId: pickStartupEventId(1, archetype),
    logo: {
      shape: archetype.id === 'saas' ? 'orbit' : archetype.id === 'local-service' ? 'badge' : 'stack',
      palette: archetype.id === 'saas' ? 'ocean' : archetype.id === 'local-service' ? 'mint' : 'sunrise',
      wordmark: getWordmark(name),
    },
    reviews: createOpeningReviews(archetype, name),
    milestones: updateMilestones({
      customerCount: archetype.startingCustomers,
      revenue,
      monthlyCosts,
      productQuality: archetype.productQuality,
      runwayMonths: calculateRunway(cash, revenue, monthlyCosts, 0),
      profitableStreak: 0,
      milestones: createMilestones(),
    }),
    message: `${name} starts as a ${archetype.subtitle.toLowerCase()}. Choose one focused move for month 1.`,
  };
}

export function updateStartupLogo(
  session: StartupSession,
  updates: Partial<Pick<StartupLogo, 'shape' | 'palette' | 'wordmark'>>,
): StartupSession {
  const wordmark = updates.wordmark === undefined
    ? session.logo.wordmark
    : updates.wordmark.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || session.logo.wordmark;
  return {
    ...session,
    logo: {
      ...session.logo,
      ...updates,
      wordmark,
    },
    brand: clamp(session.brand + (updates.palette || updates.shape ? 1 : 0), 0, 100),
    message: 'Brand updated. A sharper identity can make customer trust easier to earn.',
  };
}

export function applyStartupAction(session: StartupSession, actionId: StartupActionId): StartupSession {
  if (session.status !== 'playing' || !session.archetypeId) return session;
  if (session.actionTakenThisMonth) {
    return { ...session, message: 'One major strategy choice is already committed for this month.' };
  }

  const spend = getStartupActionCost(session, actionId);
  if (getCommittedCash(session) < spend) {
    return { ...session, message: `Not enough committed cash for ${getStartupAction(actionId).title}. Fund first or cut costs.` };
  }

  const base: StartupSession = {
    ...session,
    activeDecisionId: actionId,
    actionTakenThisMonth: true,
    pendingSpend: roundMoney(session.pendingSpend + spend),
    phase: 'funding',
  };

  if (actionId === 'build-product') {
    return withMessage({
      ...base,
      productQuality: clamp(session.productQuality + 12, 0, 100),
      morale: clamp(session.morale - 2, 0, 100),
      risk: clamp(session.risk - 2, 0, MAX_RISK),
      valuation: roundMoney(session.valuation + 9500),
    }, actionId);
  }

  if (actionId === 'customer-discovery') {
    return withMessage({
      ...base,
      productQuality: clamp(session.productQuality + 5, 0, 100),
      brand: clamp(session.brand + 3, 0, 100),
      churn: clamp(session.churn - 2.4, 2, 50),
      retention: clamp(session.retention + 2.4, 0, 100),
      cac: roundMoney(Math.max(4, session.cac * 0.92)),
      customerCount: Math.round(session.customerCount + Math.max(2, session.customerCount * 0.03)),
      morale: clamp(session.morale + 3, 0, 100),
      risk: clamp(session.risk - 4, 0, MAX_RISK),
    }, actionId);
  }

  if (actionId === 'adjust-pricing') {
    const qualityBuffer = session.productQuality >= 62 ? -0.4 : 1.2;
    return withMessage({
      ...base,
      price: roundMoney(session.price * 1.1),
      churn: clamp(session.churn + qualityBuffer, 2, 50),
      retention: clamp(100 - (session.churn + qualityBuffer), 0, 100),
      morale: clamp(session.morale + 1, 0, 100),
      risk: clamp(session.risk + 2, 0, MAX_RISK),
    }, actionId);
  }

  if (actionId === 'launch-marketing') {
    const qualityMultiplier = session.productQuality >= 58 ? 1.2 : 0.74;
    const acquired = Math.max(1, Math.round((spend / Math.max(1, session.cac)) * qualityMultiplier));
    return withMessage({
      ...base,
      customerCount: session.customerCount + acquired,
      brand: clamp(session.brand + 8, 0, 100),
      cac: roundMoney(session.cac * (session.productQuality >= 58 ? 0.97 : 1.08)),
      morale: clamp(session.morale + 1, 0, 100),
      risk: clamp(session.risk + 5, 0, MAX_RISK),
    }, actionId);
  }

  if (actionId === 'hire-teammate') {
    const hireId = pickHireRole(session);
    const team = {
      ...session.team,
      [hireId]: session.team[hireId] + 1,
    };
    return withMessage({
      ...base,
      team,
      monthlyCosts: roundMoney(session.monthlyCosts + getMonthlyHireCost(hireId)),
      productQuality: clamp(session.productQuality + (hireId === 'engineer' ? 6 : 2), 0, 100),
      brand: clamp(session.brand + (hireId === 'sales' ? 6 : 1), 0, 100),
      morale: clamp(session.morale + (hireId === 'operator' ? 5 : 3), 0, 100),
      risk: clamp(session.risk + 4, 0, MAX_RISK),
    }, actionId);
  }

  if (actionId === 'cut-costs') {
    return withMessage({
      ...base,
      monthlyCosts: Math.max(2200, roundMoney(session.monthlyCosts - getCostCutAmount(session))),
      productQuality: clamp(session.productQuality - 2, 0, 100),
      morale: clamp(session.morale - 9, 0, 100),
      risk: clamp(session.risk + 4, 0, MAX_RISK),
    }, actionId);
  }

  return withMessage({
    ...base,
    monthlyCosts: Math.max(2200, roundMoney(session.monthlyCosts - 900)),
    productQuality: clamp(session.productQuality + 3, 0, 100),
    churn: clamp(session.churn - 1.6, 2, 50),
    retention: clamp(session.retention + 1.6, 0, 100),
    morale: clamp(session.morale + 2, 0, 100),
    risk: clamp(session.risk - 3, 0, MAX_RISK),
  }, actionId);
}

export function resolveStartupFunding(session: StartupSession, fundingId: StartupFundingId): StartupSession {
  if (session.status !== 'playing' || !session.archetypeId) return session;
  if (session.fundingTakenThisMonth) {
    return { ...session, message: 'Funding is already decided for this month.' };
  }

  if (fundingId === 'bootstrap') {
    return {
      ...session,
      activeFundingId: fundingId,
      fundingTakenThisMonth: true,
      phase: session.actionTakenThisMonth ? 'decision' : 'dashboard',
      morale: clamp(session.morale + 1, 0, 100),
      risk: clamp(session.risk - 1, 0, MAX_RISK),
      message: 'You kept control and accepted the current runway.',
    };
  }

  if (fundingId === 'vc-round') {
    if (session.fundingRounds >= 2) {
      return { ...session, message: 'Investors want proof of profitability before another VC round.' };
    }
    if (session.ownership <= 54) {
      return { ...session, message: 'Too much ownership is already sold. Focus on profit now.' };
    }
    const valuation = Math.max(session.valuation, calculateStartupValuation(session));
    const roundSize = roundMoney(60000 + session.fundingRounds * 32000 + Math.max(0, session.revenue * 2));
    const dilution = clamp((roundSize / (valuation + roundSize)) * 100, 10, 24);
    return {
      ...session,
      activeFundingId: fundingId,
      fundingTakenThisMonth: true,
      pendingFunding: roundMoney(session.pendingFunding + roundSize),
      ownership: roundMoney(Math.max(35, session.ownership - dilution)),
      fundingRounds: session.fundingRounds + 1,
      valuation: roundMoney(valuation + roundSize * 1.7),
      morale: clamp(session.morale + 4, 0, 100),
      risk: clamp(session.risk + 8 + session.fundingRounds * 3, 0, MAX_RISK),
      phase: session.actionTakenThisMonth ? 'decision' : 'dashboard',
      message: `VC adds $${formatWhole(roundSize)} but ownership falls to ${Math.round(Math.max(35, session.ownership - dilution))}%.`,
    };
  }

  if (session.debt >= 90000) {
    return { ...session, message: 'Debt capacity is tapped. Lenders need stronger cash flow first.' };
  }

  const archetype = getStartupArchetype(session.archetypeId);
  const principal = roundMoney((archetype.id === 'local-service' ? 40000 : 32000) + Math.max(0, session.revenue * 0.6));
  return {
    ...session,
    activeFundingId: fundingId,
    fundingTakenThisMonth: true,
    pendingFunding: roundMoney(session.pendingFunding + principal),
    debt: roundMoney(session.debt + principal),
    morale: clamp(session.morale - 2, 0, 100),
    risk: clamp(session.risk + 9, 0, MAX_RISK),
    phase: session.actionTakenThisMonth ? 'decision' : 'dashboard',
    message: `Debt adds $${formatWhole(principal)} without dilution, but repayment pressure rises.`,
  };
}

export function resolveStartupReview(session: StartupSession, reviewId: string): StartupSession {
  const review = session.reviews.find((item) => item.id === reviewId);
  if (!review || review.resolved) return session;

  const cashCost = review.issue === 'support' || review.issue === 'delivery' ? 550 : review.issue === 'quality' ? 850 : 350;
  if (session.cash < cashCost) {
    return {
      ...session,
      message: `You need ${formatWhole(cashCost)} cash to properly fix ${review.customerName}'s review.`,
    };
  }

  const reviews = session.reviews.map((item) => (
    item.id === reviewId ? { ...item, resolved: true, stars: Math.min(5, item.stars + 1) } : item
  ));
  const churnRelief = review.issue === 'retention' ? 1.8 : review.issue === 'support' ? 1.1 : 0.7;

  return {
    ...session,
    cash: roundMoney(session.cash - cashCost),
    reviews,
    brand: clamp(session.brand + 3, 0, 100),
    morale: clamp(session.morale + 2, 0, 100),
    churn: roundMoney(clamp(session.churn - churnRelief, 2, 50)),
    retention: roundMoney(clamp(session.retention + churnRelief, 0, 100)),
    customerSatisfaction: clamp(session.customerSatisfaction + 5, 0, 100),
    message: `You fixed ${review.customerName}'s issue. Reviews are a feedback loop, not just a score.`,
  };
}

export function closeStartupMonth(session: StartupSession): StartupSession {
  if (session.status !== 'playing') return { ...session, phase: 'result' };
  if (!session.archetypeId) return session;
  if (!session.actionTakenThisMonth) {
    return { ...session, message: 'Choose one strategy move before closing the month.' };
  }

  const archetype = getStartupArchetype(session.archetypeId);
  const event = getStartupEvent(session);
  const eventCustomerDelta = getScaledEventCustomerDelta(event, archetype);
  const eventCash = event.cashImpact ?? 0;
  const grossMargin = clamp(archetype.grossMargin - (event.cogsDelta ?? 0), 0.18, 0.9);
  const effectiveCustomerCount = Math.max(0, session.customerCount + eventCustomerDelta);
  const revenue = roundMoney(effectiveCustomerCount * session.price * (event.revenueMultiplier ?? 1));
  const cogs = roundMoney(revenue * (1 - grossMargin));
  const fixedCosts = roundMoney(session.monthlyCosts * (event.costMultiplier ?? 1));
  const debtService = getStartupDebtService(session);
  const eventCost = Math.max(0, -eventCash);
  const positiveEventCash = Math.max(0, eventCash);
  const costs = roundMoney(cogs + fixedCosts + debtService + eventCost + session.pendingSpend);
  const netProfit = roundMoney(revenue - costs);
  const debtAfter = Math.max(0, roundMoney(session.debt - debtService * 0.42));
  const cashAfter = roundMoney(session.cash + revenue + session.pendingFunding + positiveEventCash - costs);
  const productQuality = clamp(session.productQuality + (event.productQualityDelta ?? 0), 0, 100);
  const brand = clamp(session.brand + (event.brandDelta ?? 0), 0, 100);
  const churn = clamp(
    session.churn + (event.churnDelta ?? 0) - (productQuality >= 70 ? 1.1 : 0) + (session.morale < 34 ? 2.2 : 0),
    2,
    50,
  );
  const churnedCustomers = Math.round(effectiveCustomerCount * (churn / 100));
  const organicAdds = calculateOrganicCustomerAdds({
    ...session,
    productQuality,
    brand,
    churn,
  }, archetype);
  const customerCount = Math.max(0, effectiveCustomerCount - churnedCustomers + organicAdds);
  const cac = roundMoney(clamp(session.cac * (event.cacMultiplier ?? 1) - (brand >= 62 ? 1.5 : 0), 3, 1000));
  const monthlyBurn = Math.max(0, fixedCosts + debtService + cogs - revenue);
  const runwayMonths = calculateRunway(cashAfter, revenue, fixedCosts, debtService + cogs);
  const profitableStreak = netProfit > 0 ? session.profitableStreak + 1 : 0;
  const morale = clamp(
    session.morale + (event.moraleDelta ?? 0) + (netProfit > 0 ? 3 : -2) - (runwayMonths < 2.5 ? 6 : 0),
    0,
    100,
  );
  const customerSatisfaction = calculateCustomerSatisfaction({
    ...session,
    productQuality,
    churn,
    retention: 100 - churn,
    brand,
    morale,
  });
  const risk = clamp(
    session.risk
      + (event.riskDelta ?? 0)
      + (runwayMonths < 2 ? 10 : runwayMonths < 4 ? 5 : -2)
      + (debtAfter > cashAfter * 2 && debtAfter > 0 ? 7 : 0)
      + (netProfit < 0 ? 2 : -3),
    0,
    MAX_RISK,
  );
  const valuation = calculateStartupValuation({
    ...session,
    revenue,
    customerCount,
    cash: cashAfter,
    productQuality,
    brand,
    debt: debtAfter,
    risk,
  });
  const stage = determineStartupStage(productQuality, customerCount, revenue, profitableStreak);
  const status = getNextStartupStatus({
    cash: cashAfter,
    morale,
    churn,
    risk,
    month: session.month,
    maxMonths: session.maxMonths,
    runwayMonths,
    profitableStreak,
  });
  const action = session.activeDecisionId ? getStartupAction(session.activeDecisionId) : startupActionCatalog[0];
  const funding = session.activeFundingId ? getStartupFunding(session.activeFundingId) : getStartupFunding('bootstrap');
  const lesson = status === 'won'
    ? 'Profitability gives founders choices: grow, stay independent, or raise on stronger terms.'
    : status === 'lost'
      ? 'A startup dies when the constraint is ignored too long: cash, retention, morale, or risk.'
      : action.lesson;
  const whyItMatters = status === 'won'
    ? 'Sustainable profit means customers pay enough, stay long enough, and can be served at a margin.'
    : status === 'lost'
      ? 'Startup finance is a system. One weak metric can pull the entire company under.'
      : `${action.whyItMatters} ${event.whyItMatters}`;
  const ledger = {
    id: `startup-${session.month}-${session.ledger.length}`,
    month: session.month,
    title: netProfit >= 0 ? 'Profitable Month' : monthlyBurn > 0 ? 'Burn Month' : 'Flat Month',
    eventTitle: event.title,
    actionTitle: action.title,
    fundingTitle: session.activeFundingId ? funding.title : 'No new capital',
    revenue,
    costs,
    netProfit,
    cashAfter,
    runwayMonths,
    customersAfter: customerCount,
    churnAfter: roundMoney(churn),
    cacAfter: cac,
    moraleAfter: Math.round(morale),
    ownershipAfter: roundMoney(session.ownership),
    debtAfter: roundMoney(debtAfter),
    valuationAfter: roundMoney(valuation),
    riskAfter: Math.round(risk),
    lesson,
    whyItMatters,
    statusAfter: status,
  };
  const newReviews = createMonthlyReviews({
    session,
    actionId: action.id,
    eventId: event.id,
    customerSatisfaction,
    netProfit,
    churn,
  });
  const nextMilestones = updateMilestones({
    milestones: session.milestones,
    revenue,
    monthlyCosts: fixedCosts,
    runwayMonths,
    productQuality,
    customerCount,
    profitableStreak,
  });

  return {
    ...session,
    stage,
    phase: status === 'playing' ? 'ledger' : 'result',
    status,
    month: session.month + 1,
    cash: cashAfter,
    revenue,
    monthlyCosts: fixedCosts,
    runwayMonths,
    productQuality,
    customerCount,
    cac,
    churn: roundMoney(churn),
    retention: roundMoney(100 - churn),
    brand,
    customerSatisfaction,
    morale: Math.round(morale),
    debt: roundMoney(debtAfter),
    valuation: roundMoney(valuation),
    risk: Math.round(risk),
    profitableStreak,
    pendingSpend: 0,
    pendingFunding: 0,
    actionTakenThisMonth: false,
    fundingTakenThisMonth: false,
    totalRevenue: roundMoney(session.totalRevenue + revenue),
    totalCosts: roundMoney(session.totalCosts + costs),
    reviews: [...newReviews, ...session.reviews].slice(0, 16),
    milestones: nextMilestones,
    ledger: [...session.ledger, ledger],
    activeEventId: undefined,
    activeDecisionId: undefined,
    activeFundingId: undefined,
    lastLedger: ledger,
    message: buildStartupStatusMessage(status, ledger),
  };
}

export function continueStartupTurn(session: StartupSession): StartupSession {
  if (session.status !== 'playing') return { ...session, phase: 'result' };
  if (!session.archetypeId) return { ...session, phase: 'setup' };
  return {
    ...session,
    phase: 'dashboard',
    activeEventId: pickStartupEventId(session.month, getStartupArchetype(session.archetypeId)),
    message: `Month ${session.month}: pick the highest-leverage move before cash gets tighter.`,
  };
}

export function toStartupGameResult(session: StartupSession, competency: string): GameResult {
  const profit = roundMoney(session.totalRevenue - session.totalCosts);
  const progressScore = Math.min(40, session.profitableStreak * 12);
  const runwayScore = Math.min(18, session.runwayMonths * 3);
  const cashScore = session.cash > 0 ? 10 : -20;
  const riskPenalty = Math.max(0, session.risk - 62) * 0.38;
  const ownershipScore = Math.max(0, session.ownership - 50) * 0.18;
  const performance = clamp(Math.round(36 + progressScore + runwayScore + cashScore + ownershipScore - riskPenalty), 0, 100);

  return {
    gameId: 'startup-story',
    competency,
    performance,
    timeSpentSeconds: Math.max(260, session.ledger.length * 38 + 90),
    timestamp: new Date().toISOString(),
    revenue: roundMoney(session.totalRevenue),
    costs: roundMoney(session.totalCosts),
    profit,
    eventTitle: session.status === 'won'
      ? 'Durable Profitability'
      : session.cash < 0
        ? 'Runway Ended'
        : session.morale <= 0
          ? 'Team Burnout'
          : session.churn >= 45
            ? 'Retention Collapse'
            : session.risk >= 115
              ? 'Risk Overload'
              : 'Profit Target Missed',
    feedback: session.status === 'won'
      ? 'You built a company with enough margin, retention, and runway to survive without depending on hype.'
      : session.cash < 0
        ? 'The company ran out of runway. Revenue growth did not convert into cash fast enough.'
        : session.churn >= 45
          ? 'Customer retention collapsed. Product quality and customer learning needed attention sooner.'
          : session.morale <= 0
            ? 'The team burned out. Execution capacity is part of the business model.'
            : 'The company survived for a while, but did not reach reliable profitability before time ran out.',
  };
}

export function getStartupArchetype(archetypeId: StartupArchetypeId) {
  return startupArchetypeCatalog.find((item) => item.id === archetypeId) ?? startupArchetypeCatalog[0];
}

export function getStartupAction(actionId: StartupActionId) {
  return startupActionCatalog.find((item) => item.id === actionId) ?? startupActionCatalog[0];
}

export function getStartupFunding(fundingId: StartupFundingId) {
  return startupFundingCatalog.find((item) => item.id === fundingId) ?? startupFundingCatalog[0];
}

export function getStartupEvent(session: StartupSession) {
  if (session.activeEventId) {
    return startupEventCatalog.find((item) => item.id === session.activeEventId) ?? startupEventCatalog[0];
  }
  if (!session.archetypeId) return startupEventCatalog[0];
  const archetype = getStartupArchetype(session.archetypeId);
  return startupEventCatalog.find((item) => item.id === pickStartupEventId(session.month, archetype)) ?? startupEventCatalog[0];
}

export function getStartupGrossMargin(session: StartupSession) {
  if (!session.archetypeId) return 0;
  return getStartupArchetype(session.archetypeId).grossMargin;
}

export function getStartupDebtService(session: Pick<StartupSession, 'debt'>) {
  if (session.debt <= 0) return 0;
  return roundMoney(Math.max(450, session.debt * 0.028));
}

export function getStartupMonthlyBurn(session: StartupSession) {
  const debtService = getStartupDebtService(session);
  const estimatedCogs = session.archetypeId
    ? Math.max(0, session.revenue * (1 - getStartupArchetype(session.archetypeId).grossMargin))
    : 0;
  return roundMoney(Math.max(0, session.monthlyCosts + debtService + estimatedCogs - session.revenue));
}

export function getStartupActionCost(session: StartupSession, actionId: StartupActionId) {
  const archetype = session.archetypeId ? getStartupArchetype(session.archetypeId) : startupArchetypeCatalog[0];
  if (actionId === 'build-product') return archetype.id === 'saas' ? 6200 : archetype.id === 'product-brand' ? 5100 : 3900;
  if (actionId === 'customer-discovery') return archetype.id === 'local-service' ? 900 : 1600;
  if (actionId === 'adjust-pricing') return 0;
  if (actionId === 'launch-marketing') return Math.max(3200, Math.round(session.cac * Math.max(18, session.customerCount * 0.28)));
  if (actionId === 'hire-teammate') return 2800;
  if (actionId === 'cut-costs') return 0;
  return archetype.id === 'product-brand' ? 4200 : 3200;
}

function withMessage(session: StartupSession, actionId: StartupActionId): StartupSession {
  const action = getStartupAction(actionId);
  return {
    ...session,
    message: `${action.title} committed. Decide whether to fund this month, then close the ledger.`,
  };
}

function createOpeningReviews(archetype: StartupArchetypeDefinition, companyName: string): StartupReview[] {
  return [
    {
      id: `opening-${archetype.id}-1`,
      month: 0,
      customerName: customerNames[archetype.seedOffset],
      segment: getCustomerSegment(archetype.id),
      stars: 4,
      mood: 'satisfied',
      issue: 'quality',
      comment: `${companyName} solves a real problem, but I want the experience to feel more polished.`,
      resolved: false,
    },
    {
      id: `opening-${archetype.id}-2`,
      month: 0,
      customerName: customerNames[(archetype.seedOffset + 3) % customerNames.length],
      segment: getCustomerSegment(archetype.id),
      stars: archetype.churn > 20 ? 3 : 4,
      mood: archetype.churn > 20 ? 'frustrated' : 'satisfied',
      issue: archetype.id === 'product-brand' ? 'delivery' : 'support',
      comment: archetype.id === 'product-brand'
        ? 'The product is interesting, but delivery timing needs to be clearer.'
        : 'I like the value, but support needs to respond faster.',
      resolved: false,
    },
  ];
}

function createMonthlyReviews({
  session,
  actionId,
  eventId,
  customerSatisfaction,
  netProfit,
  churn,
}: {
  session: StartupSession;
  actionId: StartupActionId;
  eventId: StartupEventId;
  customerSatisfaction: number;
  netProfit: number;
  churn: number;
}): StartupReview[] {
  if (!session.archetypeId) return [];
  const archetype = getStartupArchetype(session.archetypeId);
  const reviewCount = customerSatisfaction >= 74 ? 3 : customerSatisfaction >= 48 ? 2 : 1;
  return Array.from({ length: reviewCount }, (_, index) => {
    const stars = getReviewStars(customerSatisfaction, netProfit, churn, index);
    const issue = getReviewIssue(actionId, eventId, stars, archetype.id);
    const mood = stars >= 5 ? 'delighted' : stars >= 4 ? 'satisfied' : stars >= 3 ? 'frustrated' : 'at-risk';
    const customerName = customerNames[(session.month + index + archetype.seedOffset) % customerNames.length];
    return {
      id: `review-${session.month}-${index}-${eventId}`,
      month: session.month,
      customerName,
      segment: getCustomerSegment(archetype.id),
      stars,
      mood,
      issue,
      comment: buildReviewComment({
        companyName: session.companyName,
        actionId,
        eventId,
        issue,
        stars,
        archetypeId: archetype.id,
      }),
      resolved: false,
    };
  });
}

function calculateCustomerSatisfaction(session: Pick<StartupSession, 'productQuality' | 'churn' | 'retention' | 'brand' | 'morale'>) {
  return Math.round(clamp(
    session.productQuality * 0.34
      + session.retention * 0.26
      + session.brand * 0.2
      + session.morale * 0.14
      - session.churn * 0.35,
    0,
    100,
  ));
}

function getReviewStars(customerSatisfaction: number, netProfit: number, churn: number, index: number) {
  const score = customerSatisfaction + (netProfit > 0 ? 6 : -4) - Math.max(0, churn - 18) * 0.8 - index * 5;
  if (score >= 82) return 5;
  if (score >= 62) return 4;
  if (score >= 42) return 3;
  if (score >= 25) return 2;
  return 1;
}

function getReviewIssue(
  actionId: StartupActionId,
  eventId: StartupEventId,
  stars: number,
  archetypeId: StartupArchetypeId,
): StartupReviewIssue {
  if (stars >= 5) return 'retention';
  if (eventId === 'payment-delay' || eventId === 'supplier-spike') return archetypeId === 'product-brand' ? 'delivery' : 'pricing';
  if (eventId === 'founder-fatigue') return 'support';
  if (actionId === 'adjust-pricing') return 'pricing';
  if (actionId === 'build-product' || archetypeId === 'product-brand') return 'quality';
  if (actionId === 'improve-operations') return 'delivery';
  return 'retention';
}

function buildReviewComment({
  companyName,
  actionId,
  eventId,
  issue,
  stars,
  archetypeId,
}: {
  companyName: string;
  actionId: StartupActionId;
  eventId: StartupEventId;
  issue: StartupReviewIssue;
  stars: number;
  archetypeId: StartupArchetypeId;
}) {
  if (stars >= 5) return `${companyName} finally feels like something I would recommend. The value is clear.`;
  if (issue === 'pricing') return `I see the value, but the price needs clearer proof before I commit long term.`;
  if (issue === 'support') return `The offer is useful, but I need faster answers when something goes wrong.`;
  if (issue === 'delivery') return archetypeId === 'product-brand'
    ? 'I like the product, but delivery and updates need to be more predictable.'
    : 'The service is useful, but the handoff and scheduling process still feel rough.';
  if (issue === 'quality') return actionId === 'build-product'
    ? 'The new version is better, but a few rough edges still make me hesitate.'
    : 'The idea is strong, but the product experience needs more polish.';
  if (eventId === 'competitor-launch') return 'A competitor made me compare options. I need a stronger reason to stay.';
  return `I understand what ${companyName} does now. Keep improving the reason to come back.`;
}

function getCustomerSegment(archetypeId: StartupArchetypeId) {
  if (archetypeId === 'saas') return 'Power user';
  if (archetypeId === 'local-service') return 'Local client';
  return 'Repeat buyer';
}

function getWordmark(companyName: string) {
  const words = companyName.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return (words[0] ?? 'NV').slice(0, 2).toUpperCase();
}

function createMilestones(): StartupMilestone[] {
  return milestoneCatalog.map((item) => ({ ...item, achieved: false }));
}

function updateMilestones(session: Pick<StartupSession, 'milestones' | 'productQuality' | 'customerCount' | 'revenue' | 'monthlyCosts' | 'runwayMonths' | 'profitableStreak'>): StartupMilestone[] {
  return session.milestones.map((milestone) => ({
    ...milestone,
    achieved: milestone.achieved || isMilestoneAchieved(milestone.id, session),
  }));
}

function isMilestoneAchieved(
  milestoneId: StartupMilestoneId,
  session: Pick<StartupSession, 'productQuality' | 'customerCount' | 'revenue' | 'monthlyCosts' | 'runwayMonths' | 'profitableStreak'>,
) {
  if (milestoneId === 'mvp-shipped') return session.productQuality >= 50;
  if (milestoneId === 'first-paying-customers') return session.customerCount >= 20 || session.revenue > 2500;
  if (milestoneId === 'unit-economics-positive') return session.revenue > session.monthlyCosts * 0.7;
  if (milestoneId === 'profit-streak') return session.profitableStreak >= PROFITABLE_MONTHS_TO_WIN;
  return session.runwayMonths >= 6;
}

function pickStartupEventId(month: number, archetype: StartupArchetypeDefinition): StartupEventId {
  return startupEventCatalog[(month - 1 + archetype.seedOffset) % startupEventCatalog.length].id;
}

function getScaledEventCustomerDelta(event: StartupEventDefinition, archetype: StartupArchetypeDefinition) {
  const base = event.customerDelta ?? 0;
  if (base === 0) return 0;
  if (archetype.id === 'local-service') return Math.round(base * 0.38);
  if (archetype.id === 'product-brand') return Math.round(base * 1.8);
  return base;
}

function calculateOrganicCustomerAdds(session: StartupSession, archetype: StartupArchetypeDefinition) {
  const qualityPull = session.productQuality / 100;
  const brandPull = session.brand / 100;
  const moraleDrag = session.morale < 30 ? 0.55 : 1;
  const archetypeMultiplier = archetype.id === 'product-brand' ? 0.1 : archetype.id === 'local-service' ? 0.055 : 0.08;
  return Math.max(0, Math.round(session.customerCount * (qualityPull * 0.35 + brandPull * 0.28) * archetypeMultiplier * moraleDrag));
}

function calculateRunway(cash: number, revenue: number, monthlyCosts: number, extraCosts: number) {
  const burn = monthlyCosts + extraCosts - revenue;
  if (burn <= 0) return 24;
  return roundMoney(Math.max(0, cash / burn));
}

function calculateStartupValuation(session: Pick<StartupSession, 'archetypeId' | 'revenue' | 'customerCount' | 'cash' | 'productQuality' | 'brand' | 'debt' | 'risk'>) {
  const archetype = session.archetypeId ? getStartupArchetype(session.archetypeId) : startupArchetypeCatalog[0];
  const revenueMultiple = archetype.id === 'saas' ? 30 : archetype.id === 'local-service' ? 12 : 16;
  const qualityPremium = session.productQuality * (archetype.id === 'saas' ? 950 : 620);
  const brandPremium = session.brand * (archetype.id === 'product-brand' ? 980 : 520);
  const customerValue = session.customerCount * session.revenue * 0.03;
  const riskDiscount = 1 - Math.min(0.42, session.risk / 260);
  const raw = (session.revenue * revenueMultiple + qualityPremium + brandPremium + customerValue + session.cash - session.debt) * riskDiscount;
  return roundMoney(Math.max(15000, raw));
}

function determineStartupStage(
  productQuality: number,
  customerCount: number,
  revenue: number,
  profitableStreak: number,
): StartupStage {
  if (profitableStreak >= PROFITABLE_MONTHS_TO_WIN) return 'profitability';
  if (customerCount >= 80 || revenue >= 18000) return 'traction';
  if (productQuality >= 45 || customerCount >= 15) return 'mvp';
  return 'idea';
}

function getNextStartupStatus({
  cash,
  morale,
  churn,
  risk,
  month,
  maxMonths,
  runwayMonths,
  profitableStreak,
}: {
  cash: number;
  morale: number;
  churn: number;
  risk: number;
  month: number;
  maxMonths: number;
  runwayMonths: number;
  profitableStreak: number;
}): StartupSessionStatus {
  if (
    profitableStreak >= PROFITABLE_MONTHS_TO_WIN
    && cash > 0
    && runwayMonths >= 3
    && churn <= 22
    && risk < 85
  ) {
    return 'won';
  }

  if (cash < 0 || morale <= 0 || churn >= 45 || risk >= 115 || month >= maxMonths) return 'lost';
  return 'playing';
}

function buildStartupStatusMessage(status: StartupSessionStatus, ledger: StartupSession['lastLedger']) {
  if (!ledger) return 'Month closed.';
  if (status === 'won') return `Profitability reached with ${ledger.runwayMonths} months of runway.`;
  if (status === 'lost') return `Run ended after ${ledger.eventTitle}. Study the constraint that broke first.`;
  return `${ledger.title}: ${ledger.netProfit >= 0 ? '+' : ''}$${formatWhole(ledger.netProfit)} net profit.`;
}

function pickHireRole(session: StartupSession): StartupHireId {
  if (session.archetypeId === 'saas') {
    return session.team.engineer <= session.team.sales ? 'engineer' : 'sales';
  }
  if (session.archetypeId === 'local-service') {
    return session.team.operator <= session.team.sales ? 'operator' : 'sales';
  }
  return session.team.sales <= session.team.operator ? 'sales' : 'operator';
}

function getMonthlyHireCost(hireId: StartupHireId) {
  if (hireId === 'engineer') return 7600;
  if (hireId === 'sales') return 5200;
  return 4700;
}

function getCostCutAmount(session: StartupSession) {
  if (session.monthlyCosts > 18000) return 3600;
  if (session.monthlyCosts > 10000) return 2400;
  return 1450;
}

function getCommittedCash(session: StartupSession) {
  return session.cash + session.pendingFunding - session.pendingSpend;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function formatWhole(value: number) {
  return Math.round(value).toLocaleString('en-US');
}
