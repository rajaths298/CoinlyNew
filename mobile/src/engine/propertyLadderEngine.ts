import type {
  GameResult,
  PropertyChoice,
  PropertyChoiceId,
  PropertyChoiceOption,
  PropertyDeal,
  PropertyDealId,
  PropertyDealTier,
  PropertyHolding,
  PropertySession,
  PropertyTile,
  PropertyTurnLedger,
  PropertyUpgradeId,
} from '../types/game';

const STARTING_CASH = 30000;
const STARTING_RISK = 20;
const TARGET_NET_WORTH = 75000;
const MAX_MONTHS = 18;

type FinishTurnOptions = {
  title: string;
  description: string;
  oneTimeRevenue?: number;
  oneTimeCost?: number;
  upgradeSpend?: number;
  riskDelta?: number;
  equityDelta?: number;
  holdings?: PropertyHolding[];
};

export const propertyBoardTiles: PropertyTile[] = [
  { id: 'start-rent', title: 'Start / Rent Day', kind: 'rent', choiceId: 'rent-day', description: 'Collect rent and close the month.', accent: '#DFAF3F' },
  { id: 'starter-deal', title: 'Starter Deal', kind: 'deal', dealTier: 'starter', description: 'A first property hits the market.', accent: '#77B7B2' },
  { id: 'repair-call', title: 'Repair Call', kind: 'event', choiceId: 'repair-call', description: 'A maintenance problem needs a decision.', accent: '#D96C4F' },
  { id: 'market-pulse', title: 'Market Pulse', kind: 'event', choiceId: 'market-pulse', description: 'Comparable sales moved this month.', accent: '#8DAA5B' },
  { id: 'tenant-lead', title: 'Tenant Lead', kind: 'event', choiceId: 'tenant-lead', description: 'A renter wants in quickly.', accent: '#C7A34A' },
  { id: 'duplex-deal', title: 'Duplex Deal', kind: 'deal', dealTier: 'duplex', description: 'A two-door property can lift cash flow.', accent: '#6E9BC8' },
  { id: 'bank-review', title: 'Bank Review', kind: 'event', choiceId: 'bank-review', description: 'The lender offers a portfolio option.', accent: '#A78BC7' },
  { id: 'insurance-check', title: 'Insurance Check', kind: 'event', choiceId: 'insurance-check', description: 'Coverage choices affect future shocks.', accent: '#82A867' },
  { id: 'rent-day', title: 'Rent Day', kind: 'rent', choiceId: 'rent-day', description: 'Cash flow settles across the portfolio.', accent: '#DFAF3F' },
  { id: 'auction', title: 'Auction', kind: 'deal', dealTier: 'auction', description: 'Discounted deals trade speed for risk.', accent: '#B87552' },
  { id: 'vacancy-notice', title: 'Vacancy Notice', kind: 'event', choiceId: 'vacancy-notice', description: 'A tenant may leave unless handled.', accent: '#BD6D72' },
  { id: 'upgrade-depot', title: 'Upgrade Depot', kind: 'upgrade', description: 'Buy systems that make the portfolio steadier.', accent: '#C8B64F' },
  { id: 'rate-shift', title: 'Rate Shift', kind: 'event', choiceId: 'rate-shift', description: 'Borrowing costs move against the deal stack.', accent: '#7A94B8' },
  { id: 'fourplex-deal', title: 'Fourplex Deal', kind: 'deal', dealTier: 'fourplex', description: 'A bigger building can win the run faster.', accent: '#5F8C6A' },
  { id: 'neighborhood-boost', title: 'Neighborhood Boost', kind: 'event', choiceId: 'neighborhood-boost', description: 'Local improvements lift property demand.', accent: '#E0A05B' },
  { id: 'tax-bill', title: 'Tax Bill', kind: 'event', choiceId: 'tax-bill', description: 'The city wants its cut.', accent: '#A6635F' },
];

export const propertyDealCatalog: PropertyDeal[] = [
  {
    id: 'starter-condo',
    title: 'Starter Condo',
    category: '1 bed condo',
    dealTier: 'starter',
    price: 105000,
    downPayment: 13000,
    rent: 1380,
    mortgage: 740,
    expenses: 210,
    condition: 78,
    risk: 9,
    appreciation: 0.006,
    units: 1,
    color: '#77B7B2',
  },
  {
    id: 'townhouse-rental',
    title: 'Townhouse Rental',
    category: '2 bed townhome',
    dealTier: 'starter',
    price: 142000,
    downPayment: 18000,
    rent: 1760,
    mortgage: 880,
    expenses: 230,
    condition: 82,
    risk: 11,
    appreciation: 0.0065,
    units: 1,
    color: '#DFAF3F',
  },
  {
    id: 'small-duplex',
    title: 'Small Duplex',
    category: '2 units',
    dealTier: 'duplex',
    price: 184000,
    downPayment: 22000,
    rent: 2550,
    mortgage: 1220,
    expenses: 380,
    condition: 74,
    risk: 15,
    appreciation: 0.0075,
    units: 2,
    color: '#6E9BC8',
  },
  {
    id: 'fixer-duplex',
    title: 'Fixer Duplex',
    category: 'value-add duplex',
    dealTier: 'auction',
    price: 158000,
    downPayment: 15000,
    rent: 2250,
    mortgage: 1070,
    expenses: 470,
    condition: 54,
    risk: 22,
    appreciation: 0.009,
    units: 2,
    color: '#B87552',
  },
  {
    id: 'corner-fourplex',
    title: 'Corner Fourplex',
    category: '4 units',
    dealTier: 'fourplex',
    price: 265000,
    downPayment: 30000,
    rent: 4180,
    mortgage: 1910,
    expenses: 720,
    condition: 70,
    risk: 24,
    appreciation: 0.0085,
    units: 4,
    color: '#5F8C6A',
  },
];

export const propertyUpgradeCatalog: Array<{
  id: PropertyUpgradeId;
  title: string;
  description: string;
  baseCost: number;
  maxLevel: number;
  effect: string;
}> = [
  { id: 'manager', title: 'Property Manager', description: 'Vacancies recover faster and still collect partial rent.', baseCost: 2200, maxLevel: 3, effect: 'Vacancy stability' },
  { id: 'inspection', title: 'Better Inspection', description: 'Repair events cost less and add less risk.', baseCost: 1800, maxLevel: 3, effect: 'Repair protection' },
  { id: 'insurance', title: 'Insurance Policy', description: 'Large shocks hit cash and risk less severely.', baseCost: 2400, maxLevel: 2, effect: 'Event shield' },
  { id: 'renovation', title: 'Renovation Crew', description: 'Improves condition and raises property values.', baseCost: 2600, maxLevel: 3, effect: 'Value lift' },
];

const propertyChoices: Record<PropertyChoiceId, PropertyChoice> = {
  'rent-day': {
    id: 'rent-day',
    title: 'Rent Day',
    description: 'Occupied units pay rent. You can either bank the cash flow or spend a little to prevent future trouble.',
    primaryLabel: 'Collect Rent',
    secondaryLabel: 'Preventive Maintenance',
  },
  'repair-call': {
    id: 'repair-call',
    title: 'Repair Call',
    description: 'A property needs work. Fixing it now costs more cash but protects value and risk.',
    primaryLabel: 'Repair Properly',
    secondaryLabel: 'Patch Cheaply',
  },
  'market-pulse': {
    id: 'market-pulse',
    title: 'Market Pulse',
    description: 'Recent comparable sales are favorable. Appraisals can convert that signal into equity.',
    primaryLabel: 'Order Appraisals',
    secondaryLabel: 'Hold Cash',
  },
  'tenant-lead': {
    id: 'tenant-lead',
    title: 'Tenant Lead',
    description: 'A renter wants a fast answer. Careful screening lowers risk; speed helps cash now.',
    primaryLabel: 'Screen Carefully',
    secondaryLabel: 'Fill Fast',
  },
  'bank-review': {
    id: 'bank-review',
    title: 'Bank Review',
    description: 'The bank will refinance stable loans or let you pay principal down.',
    primaryLabel: 'Refinance Loans',
    secondaryLabel: 'Pay Down Debt',
  },
  'insurance-check': {
    id: 'insurance-check',
    title: 'Insurance Check',
    description: 'Coverage decisions are quiet until the month a surprise arrives.',
    primaryLabel: 'Review Coverage',
    secondaryLabel: 'Keep Deductible High',
  },
  'vacancy-notice': {
    id: 'vacancy-notice',
    title: 'Vacancy Notice',
    description: 'A tenant may leave. You can spend to retain or risk an empty unit.',
    primaryLabel: 'Retain Tenant',
    secondaryLabel: 'Save Cash',
  },
  'rate-shift': {
    id: 'rate-shift',
    title: 'Rate Shift',
    description: 'Rates moved. Fixed financing is safer; variable debt keeps cash flexible.',
    primaryLabel: 'Lock Rate',
    secondaryLabel: 'Stay Variable',
  },
  'neighborhood-boost': {
    id: 'neighborhood-boost',
    title: 'Neighborhood Boost',
    description: 'New transit and retail make renters more interested in the area.',
    primaryLabel: 'Upgrade Exterior',
    secondaryLabel: 'Wait It Out',
  },
  'tax-bill': {
    id: 'tax-bill',
    title: 'Tax Bill',
    description: 'Property taxes arrive. Paying cleanly protects your lender profile.',
    primaryLabel: 'Pay Now',
    secondaryLabel: 'Defer Half',
  },
};

export function createInitialPropertySession(): PropertySession {
  return {
    cash: STARTING_CASH,
    month: 1,
    position: 0,
    dice: 1,
    risk: STARTING_RISK,
    targetNetWorth: TARGET_NET_WORTH,
    maxMonths: MAX_MONTHS,
    holdings: [],
    ownedUpgrades: {},
    phase: 'board',
    status: 'playing',
    totalRentCollected: 0,
    totalCosts: 0,
    startingNetWorth: STARTING_CASH,
    completedTurns: [],
    message: 'Roll to start climbing the property ladder.',
  };
}

export function normalizePropertySession(session: PropertySession): PropertySession {
  const fresh = createInitialPropertySession();
  return {
    ...fresh,
    ...session,
    targetNetWorth: session.targetNetWorth ?? fresh.targetNetWorth,
    maxMonths: session.maxMonths ?? fresh.maxMonths,
    holdings: session.holdings ?? fresh.holdings,
    ownedUpgrades: session.ownedUpgrades ?? fresh.ownedUpgrades,
    completedTurns: session.completedTurns ?? fresh.completedTurns,
    activeChoice: session.activeChoice,
    lastLedger: session.lastLedger,
  };
}

export function rollPropertyDice(session: PropertySession) {
  const diceSequence = [1, 4, 6, 4, 5, 3, 2, 5, 1, 4, 2, 6];
  return diceSequence[session.completedTurns.length % diceSequence.length];
}

export function movePropertyToken(session: PropertySession, dice: number): PropertySession {
  if (session.status !== 'playing' || session.phase !== 'board') return session;
  const position = (session.position + dice) % propertyBoardTiles.length;
  const tile = propertyBoardTiles[position];
  const next: PropertySession = {
    ...session,
    dice,
    position,
    activeDealId: undefined,
    activeChoice: undefined,
    lastLedger: undefined,
    message: `Rolled ${dice}. Landed on ${tile.title}.`,
  };

  if (tile.kind === 'deal') {
    const deal = pickDealForTile(tile.dealTier ?? 'starter', next);
    return { ...next, activeDealId: deal.id, phase: 'deal' };
  }

  if (tile.kind === 'upgrade') {
    return { ...next, phase: 'upgrade' };
  }

  if (tile.choiceId) {
    return { ...next, activeChoice: propertyChoices[tile.choiceId], phase: 'choice' };
  }

  return finishPropertyTurn(next, {
    title: tile.title,
    description: tile.description,
  });
}

export function buyPropertyDeal(session: PropertySession, dealId: PropertyDealId): PropertySession {
  if (session.status !== 'playing') return session;
  const deal = propertyDealCatalog.find((item) => item.id === dealId);
  if (!deal) return session;
  if (session.cash < deal.downPayment) {
    return {
      ...session,
      message: `You need $${formatWhole(deal.downPayment)} cash to buy ${deal.title}.`,
    };
  }

  const renovationLevel = getPropertyUpgradeLevel(session, 'renovation');
  const holding: PropertyHolding = {
    ...deal,
    condition: clamp(deal.condition + renovationLevel * 3, 0, 100),
    currentValue: roundMoney(deal.price + renovationLevel * 900),
    loanBalance: deal.price - deal.downPayment,
    purchaseMonth: session.month,
    vacancyMonths: 0,
  };
  const next = {
    ...session,
    cash: roundMoney(session.cash - deal.downPayment),
    holdings: [...session.holdings, holding],
  };

  return finishPropertyTurn(next, {
    title: `Bought ${deal.title}`,
    description: `$${formatWhole(deal.downPayment)} moved from cash into property equity.`,
    riskDelta: Math.max(3, deal.risk - getPropertyUpgradeLevel(session, 'inspection') * 2),
  });
}

export function skipPropertyDeal(session: PropertySession): PropertySession {
  const deal = getActivePropertyDeal(session);
  return finishPropertyTurn(session, {
    title: deal ? `Skipped ${deal.title}` : 'Skipped Deal',
    description: 'Cash stayed liquid for the next opportunity.',
    riskDelta: -1,
  });
}

export function resolvePropertyChoice(session: PropertySession, option: PropertyChoiceOption): PropertySession {
  if (session.status !== 'playing' || !session.activeChoice) return session;
  const choiceId = session.activeChoice.id;

  if (choiceId === 'rent-day') return resolveRentDay(session, option);
  if (choiceId === 'repair-call') return resolveRepairCall(session, option);
  if (choiceId === 'market-pulse') return resolveMarketPulse(session, option);
  if (choiceId === 'tenant-lead') return resolveTenantLead(session, option);
  if (choiceId === 'bank-review') return resolveBankReview(session, option);
  if (choiceId === 'insurance-check') return resolveInsuranceCheck(session, option);
  if (choiceId === 'vacancy-notice') return resolveVacancyNotice(session, option);
  if (choiceId === 'rate-shift') return resolveRateShift(session, option);
  if (choiceId === 'neighborhood-boost') return resolveNeighborhoodBoost(session, option);
  return resolveTaxBill(session, option);
}

export function buyPropertyUpgrade(session: PropertySession, upgradeId: PropertyUpgradeId): PropertySession {
  if (session.status !== 'playing') return session;
  const upgrade = propertyUpgradeCatalog.find((item) => item.id === upgradeId);
  if (!upgrade) return session;
  const level = getPropertyUpgradeLevel(session, upgradeId);
  const cost = getPropertyUpgradeCost(session, upgradeId);
  if (level >= upgrade.maxLevel) return { ...session, message: `${upgrade.title} is already maxed.` };
  if (session.cash < cost) return { ...session, message: `You need $${formatWhole(cost)} for ${upgrade.title}.` };

  const ownedUpgrades = {
    ...session.ownedUpgrades,
    [upgradeId]: level + 1,
  };
  const holdings = upgradeId === 'renovation'
    ? session.holdings.map((holding) => ({
      ...holding,
      condition: clamp(holding.condition + 7, 0, 100),
    }))
    : session.holdings;
  const riskDelta = upgradeId === 'insurance' ? -5 : upgradeId === 'inspection' ? -3 : upgradeId === 'manager' ? -2 : -1;

  return finishPropertyTurn({ ...session, ownedUpgrades, holdings }, {
    title: `Upgraded ${upgrade.title}`,
    description: upgrade.effect,
    upgradeSpend: cost,
    riskDelta,
    equityDelta: upgradeId === 'renovation' ? session.holdings.length * 1400 : 0,
  });
}

export function finishPropertyTurn(session: PropertySession, options?: FinishTurnOptions): PropertySession {
  if (session.status !== 'playing') return { ...session, phase: 'result' };

  const title = options?.title ?? 'Month Closed';
  const description = options?.description ?? 'Portfolio cash flow settled for the month.';
  const baseHoldings = options?.holdings ?? session.holdings;
  const appreciatedHoldings = applyMonthlyAppreciation(baseHoldings, options?.equityDelta ?? 0);
  const rentCollected = calculateMonthlyRent(session, appreciatedHoldings) + (options?.oneTimeRevenue ?? 0);
  const operatingCosts = calculateMonthlyCosts(appreciatedHoldings);
  const oneTimeCost = options?.oneTimeCost ?? 0;
  const upgradeSpend = options?.upgradeSpend ?? 0;
  const costs = operatingCosts + oneTimeCost + upgradeSpend;
  const cashDelta = rentCollected - costs;
  const cash = roundMoney(session.cash + cashDelta);
  const portfolioRiskDrift = calculateRiskDrift(session, appreciatedHoldings);
  const riskDelta = (options?.riskDelta ?? 0) + portfolioRiskDrift;
  const risk = clamp(Math.round(session.risk + riskDelta), 0, 120);
  const ledgerBase = {
    ...session,
    cash,
    risk,
    holdings: appreciatedHoldings,
  };
  const netWorthAfter = getPortfolioNetWorth(ledgerBase);
  const ledger: PropertyTurnLedger = {
    id: `month-${session.month}-${session.completedTurns.length}`,
    month: session.month,
    title,
    description,
    rentCollected: roundMoney(rentCollected),
    costs: roundMoney(costs),
    upgradeSpend: roundMoney(upgradeSpend),
    cashDelta: roundMoney(cashDelta),
    equityDelta: roundMoney(netWorthAfter - getPortfolioNetWorth(session) - cashDelta),
    riskDelta: Math.round(riskDelta),
    netWorthAfter: roundMoney(netWorthAfter),
  };
  const month = session.month + 1;
  const status = getNextStatus({
    ...ledgerBase,
    month,
    targetNetWorth: session.targetNetWorth,
    maxMonths: session.maxMonths,
  });

  return {
    ...session,
    cash,
    risk,
    month,
    holdings: tickVacancies(appreciatedHoldings),
    phase: status === 'playing' ? 'ledger' : 'result',
    status,
    totalRentCollected: roundMoney(session.totalRentCollected + rentCollected),
    totalCosts: roundMoney(session.totalCosts + costs),
    completedTurns: [...session.completedTurns, ledger],
    activeDealId: undefined,
    activeChoice: undefined,
    lastLedger: ledger,
    message: buildStatusMessage(status, ledger, session.targetNetWorth),
  };
}

export function continuePropertyTurn(session: PropertySession): PropertySession {
  if (session.status !== 'playing') return { ...session, phase: 'result' };
  return {
    ...session,
    phase: 'board',
    activeDealId: undefined,
    activeChoice: undefined,
    lastLedger: undefined,
    message: 'Roll for the next month.',
  };
}

export function toPropertyGameResult(session: PropertySession, competency: string): GameResult {
  const netWorth = getPortfolioNetWorth(session);
  const gain = roundMoney(netWorth - session.startingNetWorth);
  const progress = netWorth / session.targetNetWorth;
  const cashHealth = session.cash >= 5000 ? 12 : session.cash >= 0 ? 4 : -25;
  const riskPenalty = Math.max(0, session.risk - 55) * 0.45;
  const performance = clamp(Math.round(progress * 78 + cashHealth - riskPenalty + (session.status === 'won' ? 18 : 0)), 0, 100);

  return {
    gameId: 'property-ladder',
    competency,
    performance,
    timeSpentSeconds: Math.max(180, session.completedTurns.length * 18),
    timestamp: new Date().toISOString(),
    revenue: roundMoney(session.totalRentCollected),
    costs: roundMoney(session.totalCosts),
    profit: gain,
    eventTitle: session.status === 'won' ? 'Portfolio Target Hit' : session.cash < 0 ? 'Cash Crunch' : session.risk >= 100 ? 'Risk Limit Breached' : 'Time Expired',
    feedback: session.status === 'won'
      ? 'You built enough equity while keeping the portfolio solvent.'
      : session.cash < 0
        ? 'The portfolio ran out of cash. Bigger buffers matter when leverage is involved.'
        : session.risk >= 100
          ? 'Risk overwhelmed the plan. Repairs, insurance, and tenant quality needed more attention.'
          : 'The portfolio survived, but equity growth was too slow for the target.',
  };
}

export function getCurrentPropertyTile(session: PropertySession) {
  return propertyBoardTiles[session.position] ?? propertyBoardTiles[0];
}

export function getActivePropertyDeal(session: PropertySession) {
  return propertyDealCatalog.find((deal) => deal.id === session.activeDealId);
}

export function getPropertyUpgradeLevel(session: Pick<PropertySession, 'ownedUpgrades'>, upgradeId: PropertyUpgradeId) {
  return session.ownedUpgrades[upgradeId] ?? 0;
}

export function getPropertyUpgradeCost(session: PropertySession, upgradeId: PropertyUpgradeId) {
  const upgrade = propertyUpgradeCatalog.find((item) => item.id === upgradeId);
  const level = getPropertyUpgradeLevel(session, upgradeId);
  return Math.round((upgrade?.baseCost ?? 2000) * Math.pow(1.55, level));
}

export function getPortfolioEquity(session: Pick<PropertySession, 'holdings'>) {
  return roundMoney(session.holdings.reduce((sum, holding) => sum + holding.currentValue - holding.loanBalance, 0));
}

export function getPortfolioNetWorth(session: Pick<PropertySession, 'cash' | 'holdings'>) {
  return roundMoney(session.cash + getPortfolioEquity(session));
}

export function getMonthlyCashFlow(session: Pick<PropertySession, 'holdings' | 'ownedUpgrades'>) {
  return roundMoney(calculateMonthlyRent(session, session.holdings) - calculateMonthlyCosts(session.holdings));
}

function resolveRentDay(session: PropertySession, option: PropertyChoiceOption) {
  if (option === 'secondary' && session.holdings.length > 0) {
    const maintenanceCost = session.holdings.length * 450;
    const holdings = session.holdings.map((holding) => ({
      ...holding,
      condition: clamp(holding.condition + 3, 0, 100),
    }));
    return finishPropertyTurn({ ...session, holdings }, {
      title: 'Preventive Maintenance',
      description: 'Small repairs kept tenants happier and protected value.',
      oneTimeCost: maintenanceCost,
      riskDelta: -4,
      equityDelta: session.holdings.length * 300,
    });
  }
  return finishPropertyTurn(session, {
    title: 'Collected Rent',
    description: 'Rental income and debt service settled across your properties.',
  });
}

function resolveRepairCall(session: PropertySession, option: PropertyChoiceOption) {
  const target = getWeakestHolding(session.holdings);
  if (!target) {
    return finishPropertyTurn(session, {
      title: 'No Repairs Needed',
      description: 'No properties meant no surprise maintenance this month.',
      riskDelta: -1,
    });
  }

  const inspectionDiscount = 1 - getPropertyUpgradeLevel(session, 'inspection') * 0.12;
  const insuranceDiscount = 1 - getPropertyUpgradeLevel(session, 'insurance') * 0.1;
  if (option === 'primary') {
    const cost = Math.round(1850 * inspectionDiscount * insuranceDiscount);
    const holdings = updateHolding(session.holdings, target.id, (holding) => ({
      ...holding,
      condition: clamp(holding.condition + 16, 0, 100),
    }));
    return finishPropertyTurn({ ...session, holdings }, {
      title: 'Repair Completed',
      description: `${target.title} condition recovered.`,
      oneTimeCost: cost,
      riskDelta: -8,
      equityDelta: 1600,
    });
  }

  const holdings = updateHolding(session.holdings, target.id, (holding) => ({
    ...holding,
    condition: clamp(holding.condition - 7, 0, 100),
  }));
  return finishPropertyTurn({ ...session, holdings }, {
    title: 'Cheap Patch',
    description: `${target.title} stayed rentable, but deferred work raised risk.`,
    oneTimeCost: 450,
    riskDelta: 10,
  });
}

function resolveMarketPulse(session: PropertySession, option: PropertyChoiceOption) {
  const portfolioValue = session.holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  if (portfolioValue <= 0) {
    return finishPropertyTurn(session, {
      title: 'Market Watch',
      description: 'With no property owned, the market move stayed theoretical.',
      oneTimeRevenue: option === 'secondary' ? 250 : 0,
      riskDelta: -1,
    });
  }

  if (option === 'primary') {
    return finishPropertyTurn(session, {
      title: 'New Appraisals',
      description: 'Comparable sales supported higher portfolio values.',
      oneTimeCost: 500,
      equityDelta: Math.round(portfolioValue * 0.018),
      riskDelta: -1,
    });
  }

  return finishPropertyTurn(session, {
    title: 'Held Cash',
    description: 'You skipped appraisal fees and kept the reserve flexible.',
    oneTimeRevenue: 250,
    riskDelta: -2,
  });
}

function resolveTenantLead(session: PropertySession, option: PropertyChoiceOption) {
  if (session.holdings.length === 0) {
    return finishPropertyTurn(session, {
      title: 'Built Tenant Pipeline',
      description: 'The lead became a contact for your first purchase.',
      oneTimeRevenue: option === 'secondary' ? 250 : 0,
      riskDelta: option === 'primary' ? -2 : 2,
    });
  }

  if (option === 'primary') {
    const holdings = session.holdings.map((holding) => ({ ...holding, vacancyMonths: 0 }));
    return finishPropertyTurn({ ...session, holdings }, {
      title: 'Tenant Screened',
      description: 'Better screening lowered the chance of future vacancy trouble.',
      oneTimeCost: 450,
      riskDelta: -6,
    });
  }

  const holdings = updateHolding(session.holdings, session.holdings[0].id, (holding) => ({
    ...holding,
    condition: clamp(holding.condition - 2, 0, 100),
    vacancyMonths: 0,
  }));
  return finishPropertyTurn({ ...session, holdings }, {
    title: 'Filled Fast',
    description: 'Speed protected rent this month but raised tenant-quality risk.',
    oneTimeRevenue: 700,
    riskDelta: 8,
  });
}

function resolveBankReview(session: PropertySession, option: PropertyChoiceOption) {
  if (session.holdings.length === 0) {
    return finishPropertyTurn(session, {
      title: 'Bank Relationship Built',
      description: 'The banker is ready once you own a deal.',
      riskDelta: -1,
    });
  }

  if (option === 'primary') {
    const holdings = session.holdings.map((holding) => ({
      ...holding,
      mortgage: Math.round(holding.mortgage * 0.94),
      loanBalance: roundMoney(holding.loanBalance * 0.99),
    }));
    return finishPropertyTurn({ ...session, holdings }, {
      title: 'Loans Refinanced',
      description: 'Monthly debt service dropped, but the refinance added paperwork risk.',
      oneTimeCost: 700,
      riskDelta: 4,
    });
  }

  const holdings = session.holdings.map((holding) => ({
    ...holding,
    loanBalance: Math.max(0, roundMoney(holding.loanBalance - 1800 / session.holdings.length)),
  }));
  return finishPropertyTurn({ ...session, holdings }, {
    title: 'Principal Paid Down',
    description: 'Lower leverage made the portfolio sturdier.',
    oneTimeCost: 1200,
    riskDelta: -5,
  });
}

function resolveInsuranceCheck(session: PropertySession, option: PropertyChoiceOption) {
  if (option === 'primary') {
    return finishPropertyTurn(session, {
      title: 'Coverage Reviewed',
      description: 'Deductibles and limits were tuned before a major claim.',
      oneTimeCost: 350,
      riskDelta: -5 - getPropertyUpgradeLevel(session, 'insurance'),
    });
  }

  return finishPropertyTurn(session, {
    title: 'Deductible Kept High',
    description: 'Cash stayed available, but the next shock may hit harder.',
    oneTimeRevenue: 250,
    riskDelta: 6,
  });
}

function resolveVacancyNotice(session: PropertySession, option: PropertyChoiceOption) {
  const target = session.holdings[0];
  if (!target) {
    return finishPropertyTurn(session, {
      title: 'No Vacancy Exposure',
      description: 'No units owned, no vacancy loss.',
      riskDelta: -1,
    });
  }

  if (option === 'primary') {
    const managerDiscount = 1 - getPropertyUpgradeLevel(session, 'manager') * 0.15;
    const holdings = updateHolding(session.holdings, target.id, (holding) => ({
      ...holding,
      vacancyMonths: 0,
    }));
    return finishPropertyTurn({ ...session, holdings }, {
      title: 'Tenant Retained',
      description: 'Retention spending kept the unit occupied.',
      oneTimeCost: Math.round(650 * managerDiscount),
      riskDelta: -5,
    });
  }

  const holdings = updateHolding(session.holdings, target.id, (holding) => ({
    ...holding,
    vacancyMonths: Math.max(holding.vacancyMonths, 1),
  }));
  return finishPropertyTurn({ ...session, holdings }, {
    title: 'Vacancy Accepted',
    description: `${target.title} may miss rent next month.`,
    riskDelta: 9,
  });
}

function resolveRateShift(session: PropertySession, option: PropertyChoiceOption) {
  if (session.holdings.length === 0) {
    return finishPropertyTurn(session, {
      title: 'Rate Watch',
      description: 'You waited for the first mortgage before locking terms.',
      riskDelta: -1,
    });
  }

  if (option === 'primary') {
    return finishPropertyTurn(session, {
      title: 'Rates Locked',
      description: 'The portfolio is less exposed to future borrowing shocks.',
      oneTimeCost: 600,
      riskDelta: -6,
    });
  }

  const holdings = session.holdings.map((holding) => ({
    ...holding,
    mortgage: Math.round(holding.mortgage * 1.02),
  }));
  return finishPropertyTurn({ ...session, holdings }, {
    title: 'Stayed Variable',
    description: 'Short-term cash improved, but debt service nudged higher.',
    oneTimeRevenue: 900,
    riskDelta: 10,
  });
}

function resolveNeighborhoodBoost(session: PropertySession, option: PropertyChoiceOption) {
  if (session.holdings.length === 0) {
    return finishPropertyTurn(session, {
      title: 'Neighborhood Scouted',
      description: 'You learned where demand is improving before buying.',
      riskDelta: -1,
    });
  }

  if (option === 'primary') {
    const renovationDiscount = 1 - getPropertyUpgradeLevel(session, 'renovation') * 0.1;
    const holdings = session.holdings.map((holding) => ({
      ...holding,
      condition: clamp(holding.condition + 7, 0, 100),
    }));
    return finishPropertyTurn({ ...session, holdings }, {
      title: 'Exterior Upgraded',
      description: 'Curb appeal converted local demand into equity.',
      oneTimeCost: Math.round(900 * renovationDiscount),
      equityDelta: 2500,
      riskDelta: -2,
    });
  }

  return finishPropertyTurn(session, {
    title: 'Area Improved',
    description: 'The portfolio benefited from neighborhood momentum.',
    equityDelta: 900,
    riskDelta: -1,
  });
}

function resolveTaxBill(session: PropertySession, option: PropertyChoiceOption) {
  const taxBill = session.holdings.length ? session.holdings.length * 850 : 300;
  if (option === 'primary') {
    return finishPropertyTurn(session, {
      title: 'Taxes Paid',
      description: 'Clean tax handling protected lender confidence.',
      oneTimeCost: taxBill,
      riskDelta: -2,
    });
  }

  return finishPropertyTurn(session, {
    title: 'Taxes Deferred',
    description: 'Half the cash stayed in reserve, but the obligation became risk.',
    oneTimeCost: Math.round(taxBill * 0.5),
    riskDelta: 10,
  });
}

function pickDealForTile(tier: PropertyDealTier, session: PropertySession) {
  const candidates = propertyDealCatalog.filter((deal) => {
    if (tier === 'auction') return deal.dealTier === 'auction' || deal.dealTier === 'starter';
    if (tier === 'fourplex') return deal.dealTier === 'fourplex' || deal.dealTier === 'duplex';
    return deal.dealTier === tier;
  });
  const index = (session.month + session.holdings.length + session.position) % candidates.length;
  return candidates[index] ?? propertyDealCatalog[0];
}

function applyMonthlyAppreciation(holdings: PropertyHolding[], equityDelta: number) {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  return holdings.map((holding) => {
    const conditionDrag = holding.condition < 58 ? 0.58 : holding.condition < 70 ? 0.82 : 1;
    const appreciation = holding.currentValue * holding.appreciation * conditionDrag;
    const equityShare = totalValue > 0 ? equityDelta * (holding.currentValue / totalValue) : 0;
    return {
      ...holding,
      currentValue: roundMoney(holding.currentValue + appreciation + equityShare),
    };
  });
}

function tickVacancies(holdings: PropertyHolding[]) {
  return holdings.map((holding) => ({
    ...holding,
    vacancyMonths: Math.max(0, holding.vacancyMonths - 1),
  }));
}

function calculateMonthlyRent(
  session: Pick<PropertySession, 'ownedUpgrades'>,
  holdings: PropertyHolding[],
) {
  const managerLevel = getPropertyUpgradeLevel(session, 'manager');
  return roundMoney(holdings.reduce((sum, holding) => {
    if (holding.vacancyMonths <= 0) return sum + holding.rent;
    return sum + holding.rent * Math.min(0.55, managerLevel * 0.2);
  }, 0));
}

function calculateMonthlyCosts(holdings: PropertyHolding[]) {
  return roundMoney(holdings.reduce((sum, holding) => sum + holding.mortgage + holding.expenses, 0));
}

function calculateRiskDrift(
  session: Pick<PropertySession, 'ownedUpgrades'>,
  holdings: PropertyHolding[],
) {
  const weakCondition = holdings.filter((holding) => holding.condition < 60).length * 3;
  const portfolioSize = Math.max(0, holdings.length - 1);
  const vacancy = holdings.filter((holding) => holding.vacancyMonths > 0).length * 4;
  const upgradeProtection = getPropertyUpgradeLevel(session, 'manager') + getPropertyUpgradeLevel(session, 'insurance');
  return Math.max(-3, weakCondition + portfolioSize + vacancy - upgradeProtection);
}

function getNextStatus(session: Pick<PropertySession, 'cash' | 'risk' | 'month' | 'maxMonths' | 'targetNetWorth' | 'holdings'>) {
  if (session.cash < 0) return 'lost';
  if (session.risk >= 100) return 'lost';
  if (getPortfolioNetWorth(session) >= session.targetNetWorth) return 'won';
  if (session.month > session.maxMonths) return 'lost';
  return 'playing';
}

function buildStatusMessage(status: PropertySession['status'], ledger: PropertyTurnLedger, targetNetWorth: number) {
  if (status === 'won') return `Target hit: $${formatWhole(ledger.netWorthAfter)} net worth against $${formatWhole(targetNetWorth)}.`;
  if (status === 'lost') return `Run ended at $${formatWhole(ledger.netWorthAfter)} net worth.`;
  return `${ledger.title}: $${formatWhole(ledger.cashDelta)} cash flow, ${ledger.riskDelta >= 0 ? '+' : ''}${ledger.riskDelta} risk.`;
}

function getWeakestHolding(holdings: PropertyHolding[]) {
  return holdings.reduce<PropertyHolding | undefined>((weakest, holding) => {
    if (!weakest || holding.condition < weakest.condition) return holding;
    return weakest;
  }, undefined);
}

function updateHolding(
  holdings: PropertyHolding[],
  holdingId: PropertyDealId,
  updater: (holding: PropertyHolding) => PropertyHolding,
) {
  return holdings.map((holding) => (holding.id === holdingId ? updater(holding) : holding));
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
