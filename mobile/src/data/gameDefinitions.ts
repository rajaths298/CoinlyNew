import type { GameDefinition, GameId } from '../types/game';

export const gameDefinitions: GameDefinition[] = [
  {
    id: 'lemonade-empire',
    title: 'Lemonade Empire',
    fantasy: 'Grow a wobbly lemonade stand into a city-wide franchise.',
    competency: 'Spending & budgeting + Earning & income',
    domain: 'Business',
    estimatedTime: '2 min',
    mastery: 2,
    status: 'in progress',
    isPlayable: true,
    coachReason: 'Great first game because pricing, supply, and margin are visible in one quick day.',
    quickPlayLabel: 'Run one sales day',
    decisions: [
      { id: 'cups', label: 'Cups to stock', min: 20, max: 160, step: 10, defaultValue: 80, unit: 'cups' },
      { id: 'price', label: 'Price per cup', min: 1, max: 6, step: 0.5, defaultValue: 3, unit: '$' },
    ],
    events: [
      { id: 'heatwave', title: 'Heatwave', description: 'Demand jumps, but only stocked cups can sell.', demandMultiplier: 1.45 },
      { id: 'rain', title: 'Rainy afternoon', description: 'Foot traffic drops and unsold supplies sting.', demandMultiplier: 0.62 },
      { id: 'competitor', title: 'New stand nearby', description: 'A competitor makes high prices harder.', demandMultiplier: 0.82 },
      { id: 'supplier-hike', title: 'Supplier price hike', description: 'Lemons cost more before the day starts.', costMultiplier: 1.28 },
      { id: 'viral-day', title: 'Viral post', description: 'Your stand gets a surprise crowd.', demandMultiplier: 1.7 },
    ],
    upgrades: [
      { id: 'sign', title: 'Bright sign', description: 'More customers notice your stand.', cost: 35, effect: '+12% demand' },
      { id: 'cooler', title: 'Ice cooler', description: 'Less waste on slow days.', cost: 45, effect: '-20% waste cost' },
    ],
  },
  {
    id: 'property-ladder',
    title: 'Property Ladder',
    fantasy: 'Climb from first property to a small rental portfolio.',
    competency: 'Borrowing & debt + Saving',
    domain: 'Real Estate',
    estimatedTime: '3 min',
    mastery: 2,
    status: 'new',
    isPlayable: true,
    coachReason: 'Recommended when the user is ready to practice cash flow and risk buffers.',
    quickPlayLabel: 'Run one rental month',
    decisions: [
      { id: 'buffer', label: 'Cash buffer kept', min: 500, max: 5000, step: 250, defaultValue: 2000, unit: '$' },
      { id: 'rent', label: 'Monthly rent target', min: 900, max: 2200, step: 100, defaultValue: 1400, unit: '$' },
    ],
    events: [
      { id: 'vacancy', title: 'Tenant moves out', description: 'Rent drops this month; a buffer matters.', cashImpact: -900, riskImpact: 18 },
      { id: 'repair', title: 'Roof repair', description: 'Emergency maintenance hits cash flow.', cashImpact: -1200, riskImpact: 22 },
      { id: 'value-rise', title: 'Neighborhood improves', description: 'Equity grows and the deal looks stronger.', cashImpact: 450 },
      { id: 'rate-change', title: 'Rate change', description: 'New borrowing gets more expensive.', cashImpact: -350, riskImpact: 12 },
    ],
    upgrades: [
      { id: 'inspection', title: 'Better inspection', description: 'Reduce surprise repair risk.', cost: 400, effect: '-15% event damage' },
      { id: 'manager', title: 'Property manager', description: 'Vacancies hurt less.', cost: 300, effect: '+10% rent stability' },
    ],
  },
  {
    id: 'startup-story',
    title: 'Startup Story',
    fantasy: 'Create a company, manage runway, test demand, and reach real profitability.',
    competency: 'Entrepreneurship + Earning & income + Spending',
    domain: 'Startup',
    estimatedTime: '8-12 min',
    mastery: 4,
    status: 'new',
    isPlayable: true,
    coachReason: 'Best for learning runway, margin, product-market fit, CAC, retention, pricing, debt, and dilution in one serious founder sim.',
    quickPlayLabel: 'Build a profitable company',
    decisions: [
      { id: 'runway', label: 'Runway focus', min: 1, max: 10, step: 1, defaultValue: 6, unit: 'months' },
      { id: 'growth', label: 'Growth pressure', min: 1, max: 10, step: 1, defaultValue: 5, unit: 'level' },
    ],
    events: [
      { id: 'platform-shift', title: 'Platform Shift', description: 'A key channel gets more expensive.', riskImpact: 7 },
      { id: 'competitor-launch', title: 'Competitor Launch', description: 'Positioning and retention are tested.', riskImpact: 6 },
      { id: 'payment-delay', title: 'Payment Delay', description: 'Sales look fine, but cash arrives late.', cashImpact: -1400, riskImpact: 5 },
      { id: 'viral-thread', title: 'Viral Moment', description: 'Attention spikes and tests conversion quality.', demandMultiplier: 1.16 },
    ],
    upgrades: [
      { id: 'customer-discovery', title: 'Customer Discovery', description: 'Improve retention by learning why people buy.', cost: 1600, effect: 'Lower churn' },
      { id: 'operations', title: 'Operations System', description: 'Serve customers more reliably at lower burn.', cost: 3200, effect: 'Lower costs' },
    ],
  },
<<<<<<< Updated upstream
  {
    id: 'first-place',
    title: 'Stock Market Game',
    fantasy: 'Start with $100,000, trade real stock prices, and climb the leaderboard.',
    competency: 'Investing & growth + Risk management',
    domain: 'Investing',
    estimatedTime: '4 min',
    mastery: 3,
    status: 'new',
    isPlayable: true,
    coachReason: 'Practice position sizing, diversification, and buying or selling with live market quotes before real money is involved.',
    quickPlayLabel: 'Trade one market round',
    decisions: [],
    events: [
      { id: 'earnings-watch', title: 'Earnings Watch', description: 'Company news can move individual stocks faster than broad ETFs.', riskImpact: 8 },
      { id: 'rate-pulse', title: 'Rate Pulse', description: 'Index funds and tech shares react differently when rate expectations shift.', riskImpact: 6 },
      { id: 'momentum-shift', title: 'Momentum Shift', description: 'Recent winners can keep running or reverse quickly.', riskImpact: 7 },
    ],
    upgrades: [],
  },
=======
  shell('first-place', 'First Place', 'Run your first apartment and adult-life budget.', 'Spending & budgeting + Saving', 'Life Sim'),
>>>>>>> Stashed changes
  shell('market-mogul', 'Market Mogul', 'Grow a portfolio and watch compounding over time.', 'Investing & growth', 'Investing'),
  shell('food-truck-frenzy', 'Food Truck Frenzy', 'Serve the lunch rush and upgrade your truck.', 'Spending & budgeting + Earning', 'Business'),
  shell('dream-quest', 'Dream Quest', 'Fund big life goals through smart trade-offs.', 'Saving + integrated decisions', 'Life Goals'),
];

export function getGameDefinition(gameId?: GameId) {
  return gameDefinitions.find((game) => game.id === gameId);
}

function shell(
  id: GameId,
  title: string,
  fantasy: string,
  competency: string,
  domain: string,
): GameDefinition {
  return {
    id,
    title,
    fantasy,
    competency,
    domain,
    estimatedTime: '2-3 min',
    mastery: 1,
    status: 'coming next',
    isPlayable: false,
    coachReason: 'This game is mapped and ready for the shared engine after the flagship pair.',
    quickPlayLabel: 'Coming next',
    decisions: [],
    events: [],
    upgrades: [],
  };
}
