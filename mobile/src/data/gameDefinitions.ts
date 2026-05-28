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
  shell('startup-story', 'Startup Story', 'Build a company without running out of runway.', 'Earning & income + Spending', 'Startup'),
  shell('first-place', 'First Place', 'Run your first apartment and adult-life budget.', 'Spending & budgeting + Saving', 'Life Sim'),
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
