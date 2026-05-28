import { getGameDefinition } from '../data/gameDefinitions';
import type { GameId, GameResult, GameState } from '../types/game';

export function createInitialGameState(gameId: GameId): GameState {
  const definition = getGameDefinition(gameId);
  return {
    gameId,
    mode: 'quick',
    cash: gameId === 'property-ladder' ? 8500 : 120,
    round: 1,
    selectedUpgradeId: undefined,
    decisions: Object.fromEntries(
      definition?.decisions.map((decision) => [decision.id, decision.defaultValue]) ?? [],
    ),
  };
}

export function updateDecision(state: GameState, decisionId: string, value: number): GameState {
  return {
    ...state,
    decisions: {
      ...state.decisions,
      [decisionId]: value,
    },
  };
}

export function selectUpgrade(state: GameState, upgradeId?: string): GameState {
  return {
    ...state,
    selectedUpgradeId: state.selectedUpgradeId === upgradeId ? undefined : upgradeId,
  };
}

export function runQuickPlay(state: GameState): GameResult {
  if (state.gameId === 'property-ladder') return runPropertyMonth(state);
  return runLemonadeDay(state);
}

function runLemonadeDay(state: GameState): GameResult {
  const definition = getGameDefinition(state.gameId);
  const event = pickEvent(state.gameId, state.round);
  const cups = state.decisions.cups ?? 80;
  const price = state.decisions.price ?? 3;
  const upgrade = definition?.upgrades.find((item) => item.id === state.selectedUpgradeId);
  const baseDemand = 95;
  const pricePenalty = Math.max(0.35, 1 - Math.max(0, price - 3) * 0.16);
  const upgradeDemand = upgrade?.id === 'sign' ? 1.12 : 1;
  const demand = Math.round(baseDemand * (event.demandMultiplier ?? 1) * pricePenalty * upgradeDemand);
  const sold = Math.min(cups, demand);
  const waste = Math.max(0, cups - sold);
  const wasteCostMultiplier = upgrade?.id === 'cooler' ? 0.8 : 1;
  const supplyCost = cups * 0.72 * (event.costMultiplier ?? 1);
  const upgradeCost = upgrade?.cost ?? 0;
  const revenue = sold * price;
  const costs = supplyCost + upgradeCost + waste * 0.12 * wasteCostMultiplier;
  const profit = revenue - costs;
  const performance = clamp(Math.round(55 + profit / 4 - waste * 0.25 + (sold === cups ? 8 : 0)), 0, 100);

  return {
    gameId: state.gameId,
    competency: definition?.competency ?? 'Earning',
    performance,
    timeSpentSeconds: 120,
    timestamp: new Date().toISOString(),
    revenue: roundMoney(revenue),
    costs: roundMoney(costs),
    profit: roundMoney(profit),
    eventTitle: event.title,
    feedback: profit >= 80
      ? 'Strong margin and demand read. Reinvestment paid off.'
      : sold === cups
        ? 'You sold out. Next time, consider stocking more before demand spikes.'
        : 'You protected cash, but waste/pricing left money on the table.',
  };
}

function runPropertyMonth(state: GameState): GameResult {
  const definition = getGameDefinition(state.gameId);
  const event = pickEvent(state.gameId, state.round);
  const buffer = state.decisions.buffer ?? 2000;
  const rent = state.decisions.rent ?? 1400;
  const upgrade = definition?.upgrades.find((item) => item.id === state.selectedUpgradeId);
  const mortgage = 950;
  const upkeep = 260;
  const riskReduction = upgrade ? 0.85 : 1;
  const eventImpact = (event.cashImpact ?? 0) * riskReduction;
  const revenue = event.id === 'vacancy' && upgrade?.id !== 'manager' ? rent * 0.35 : rent;
  const costs = mortgage + upkeep + (upgrade?.cost ?? 0) + Math.abs(Math.min(0, eventImpact));
  const profit = revenue - costs + Math.max(0, eventImpact);
  const bufferScore = buffer > 2500 ? 18 : buffer > 1250 ? 8 : -12;
  const performance = clamp(Math.round(62 + profit / 70 + bufferScore - (event.riskImpact ?? 0) * 0.35), 0, 100);

  return {
    gameId: state.gameId,
    competency: definition?.competency ?? 'Borrowing',
    performance,
    timeSpentSeconds: 160,
    timestamp: new Date().toISOString(),
    revenue: roundMoney(revenue),
    costs: roundMoney(costs),
    profit: roundMoney(profit),
    eventTitle: event.title,
    feedback: performance >= 75
      ? 'Healthy buffer and deal quality kept the month stable.'
      : buffer < 1250
        ? 'The property survived, but the low buffer made the month risky.'
        : 'Cash flow was tight. Watch how leverage magnifies surprise costs.',
  };
}

function pickEvent(gameId: GameId, round: number) {
  const definition = getGameDefinition(gameId);
  const events = definition?.events ?? [];
  return events[(round - 1) % events.length] ?? {
    id: 'normal',
    title: 'Normal round',
    description: 'No major surprise this round.',
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
