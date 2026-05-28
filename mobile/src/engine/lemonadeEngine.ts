import type {
  BusinessLedger,
  CustomerDialogue,
  CustomerDialogueScenario,
  CustomerPersonality,
  CustomerReview,
  IngredientInventory,
  LemonadeBatch,
  LemonadeCustomer,
  LemonadeEventId,
  LemonadeIngredientId,
  LemonadeLocation,
  LemonadeLocationId,
  LemonadeMilestone,
  LemonadeRecipe,
  LemonadeRoundStats,
  LemonadeSession,
  LemonadeUpgradeId,
  LemonadeWorker,
  LiveObjective,
  ShopExpansion,
  ShopExpansionId,
  ShopSceneState,
  StationId,
  StationState,
  WorkerRole,
} from '../types/game';

export const LEMONADE_ROUND_SECONDS = process.env.EXPO_PUBLIC_COINLY_FAST_GAME === '1' ? 45 : 300;

export type LemonadeEvent = {
  id: LemonadeEventId;
  title: string;
  description: string;
  demand: number;
  patience: number;
  cost: number;
  competitor?: string;
};

export type IngredientOffer = {
  id: LemonadeIngredientId;
  title: string;
  unit: string;
  packSize: number;
  packCost: number;
  description: string;
};

export const ingredientMarket: IngredientOffer[] = [
  { id: 'lemons', title: 'Lemons', unit: 'lemons', packSize: 24, packCost: 12, description: 'Controls tartness and fresh flavor.' },
  { id: 'sugar', title: 'Sugar', unit: 'scoops', packSize: 30, packCost: 7, description: 'Controls sweetness and kid appeal.' },
  { id: 'ice', title: 'Ice', unit: 'cups', packSize: 40, packCost: 6, description: 'Keeps drinks cold and boosts hot-day reviews.' },
  { id: 'cups', title: 'Cups', unit: 'cups', packSize: 50, packCost: 8, description: 'Every sale needs a cup.' },
  { id: 'premium', title: 'Premium Lemons', unit: 'lemons', packSize: 12, packCost: 14, description: 'Raises quality and foodie reviews.' },
];

export const lemonadeLocations: LemonadeLocation[] = [
  { id: 'corner', title: 'Neighborhood Corner', demand: 1, rent: 0, unlockReputation: 0 },
  { id: 'park', title: 'Park Path', demand: 1.18, rent: 12, unlockReputation: 55 },
  { id: 'school', title: 'School Event', demand: 1.34, rent: 22, unlockReputation: 64 },
  { id: 'beach', title: 'Beach Boardwalk', demand: 1.48, rent: 36, unlockReputation: 72 },
  { id: 'downtown', title: 'Downtown Lunch Rush', demand: 1.68, rent: 55, unlockReputation: 84 },
];

export const lemonadeEvents: LemonadeEvent[] = [
  {
    id: 'sunny',
    title: 'Sunny Saturday',
    description: 'Perfect weather. Families are out and reviews lean generous.',
    demand: 1,
    patience: 1,
    cost: 1,
    competitor: 'No major competitor nearby.',
  },
  {
    id: 'heatwave',
    title: 'Heatwave',
    description: 'Demand spikes, but customers punish warm drinks quickly.',
    demand: 1.36,
    patience: 0.82,
    cost: 1.05,
    competitor: 'An ice cream cart is pulling attention.',
  },
  {
    id: 'rain',
    title: 'Rain Clouds',
    description: 'Foot traffic slows down. Waste control matters more than volume.',
    demand: 0.72,
    patience: 1.08,
    cost: 0.96,
    competitor: 'The coffee shop has a rainy-day discount.',
  },
  {
    id: 'rush',
    title: 'Park Rush',
    description: 'A game just ended nearby. Fast service can print money.',
    demand: 1.28,
    patience: 0.92,
    cost: 1,
    competitor: 'A snack stand is taking quick orders.',
  },
  {
    id: 'competition',
    title: 'New Stand Nearby',
    description: 'A competitor makes high prices harder to defend.',
    demand: 0.88,
    patience: 0.95,
    cost: 1,
    competitor: 'They advertise $2 lemonade.',
  },
];

export const lemonadeUpgradeCatalog: Array<{
  id: LemonadeUpgradeId;
  title: string;
  description: string;
  baseCost: number;
  maxLevel: number;
}> = [
  { id: 'pitcher', title: 'Bigger Pitcher', description: 'Hold more cups each batch.', baseCost: 38, maxLevel: 4 },
  { id: 'speed', title: 'Fast Pour Spout', description: 'Shortens the serving cooldown.', baseCost: 46, maxLevel: 4 },
  { id: 'sign', title: 'Bright Sign', description: 'Raises foot traffic and location visibility.', baseCost: 55, maxLevel: 4 },
  { id: 'cooler', title: 'Ice Cooler', description: 'Cuts spoilage and protects freshness.', baseCost: 42, maxLevel: 3 },
  { id: 'premium', title: 'Premium Lemons', description: 'Raises batch quality and review ceiling.', baseCost: 64, maxLevel: 3 },
  { id: 'umbrella', title: 'Shade Umbrella', description: 'Customers wait longer on hot days.', baseCost: 58, maxLevel: 3 },
  { id: 'helper', title: 'Second Helper', description: 'Improves service and reduces missed customers.', baseCost: 92, maxLevel: 2 },
];

const names = ['Ari', 'Maya', 'Leo', 'Sam', 'Nia', 'Kai', 'Zoe', 'Ivy', 'Noah', 'Lina', 'Owen', 'Gia'];
const customerColors = ['#F7B267', '#F79D84', '#84DCC6', '#A7C7E7', '#CDB4DB', '#F6D365'];
const personalities: CustomerPersonality[] = ['bargain', 'impatient', 'foodie', 'parent', 'tourist', 'regular', 'influencer'];

export const shopExpansions: ShopExpansion[] = [
  { id: 'cart', title: 'Cart Stand', unlockReputation: 0, customerCapacity: 5, workerSlots: 1 },
  { id: 'kiosk', title: 'Neighborhood Kiosk', unlockReputation: 58, customerCapacity: 6, workerSlots: 2 },
  { id: 'booth', title: 'Park Booth', unlockReputation: 66, customerCapacity: 7, workerSlots: 3 },
  { id: 'beach-shop', title: 'Beach Shop', unlockReputation: 76, customerCapacity: 8, workerSlots: 4 },
  { id: 'storefront', title: 'Downtown Storefront', unlockReputation: 88, customerCapacity: 10, workerSlots: 5 },
];

export function createInitialLemonadeSession(): LemonadeSession {
  return {
    cash: 120,
    xp: 0,
    reputation: 50,
    day: 1,
    round: 1,
    inventory: 0,
    combo: 0,
    bestCombo: 0,
    recipe: {
      price: 3,
      sweetness: 3,
      ice: 3,
      batchSize: 80,
    },
    ingredients: {
      lemons: 40,
      sugar: 40,
      ice: 50,
      cups: 80,
      premium: 0,
    },
    locationId: 'corner',
    reviews: [],
    regulars: 0,
    totalCupsSold: 0,
    milestones: createInitialMilestones(),
    workers: [],
    stations: createInitialStations(),
    objectives: createLiveObjectives(),
    scene: createInitialScene(),
    ownedUpgrades: {},
    completedRounds: [],
  };
}

export function normalizeLemonadeSession(session: LemonadeSession): LemonadeSession {
  const fresh = createInitialLemonadeSession();
  return {
    ...fresh,
    ...session,
    ingredients: {
      ...fresh.ingredients,
      ...(session.ingredients ?? {}),
    },
    workers: session.workers ?? fresh.workers,
    stations: {
      ...fresh.stations,
      ...(session.stations ?? {}),
    },
    objectives: session.objectives ?? fresh.objectives,
    scene: {
      ...fresh.scene,
      ...(session.scene ?? {}),
    },
    milestones: session.milestones ?? fresh.milestones,
    reviews: session.reviews ?? fresh.reviews,
    ownedUpgrades: session.ownedUpgrades ?? fresh.ownedUpgrades,
    completedRounds: session.completedRounds ?? fresh.completedRounds,
  };
}

export function createInitialStations(): Record<StationId, StationState> {
  return {
    register: { id: 'register', title: 'Cash Register', cooldown: 0, maxCooldown: 3, level: 1, isActive: false },
    pitcher: { id: 'pitcher', title: 'Pitcher Station', cooldown: 0, maxCooldown: 4, level: 1, isActive: false },
    shelf: { id: 'shelf', title: 'Ingredient Shelf', cooldown: 0, maxCooldown: 5, level: 1, isActive: false },
    counter: { id: 'counter', title: 'Serving Counter', cooldown: 0, maxCooldown: 2, level: 1, isActive: false },
    cleaning: { id: 'cleaning', title: 'Cleanup Station', cooldown: 0, maxCooldown: 6, level: 1, isActive: false },
  };
}

export function createLiveObjectives(): LiveObjective[] {
  return [
    { id: 'serve-10', title: 'Serve 10 customers', target: 10, progress: 0, reward: 18, completed: false },
    { id: 'four-star', title: 'Keep 4-star average', target: 4, progress: 0, reward: 22, completed: false },
    { id: 'no-stockout', title: 'Avoid stockouts', target: 1, progress: 1, reward: 16, completed: false },
  ];
}

export function createInitialScene(): ShopSceneState {
  return {
    cleanliness: 82,
    queuePressure: 0,
    rushMeter: 0,
    expansionId: 'cart',
  };
}

export function createInitialMilestones(): LemonadeMilestone[] {
  return [
    { id: 'first-50-cups', title: 'First 50 cups sold', achieved: false },
    { id: 'first-5-star', title: 'First 5-star review', achieved: false },
    { id: 'hundred-profit', title: '$100 profit round', achieved: false },
    { id: 'no-waste', title: 'No-waste round', achieved: false },
    { id: 'ten-regulars', title: '10 regular customers', achieved: false },
  ];
}

export function getLemonadeEvent(round: number) {
  return lemonadeEvents[(round - 1) % lemonadeEvents.length];
}

export function getLocation(session: LemonadeSession) {
  return lemonadeLocations.find((location) => location.id === session.locationId) ?? lemonadeLocations[0];
}

export function setLemonadeLocation(session: LemonadeSession, locationId: LemonadeLocationId): LemonadeSession {
  const location = lemonadeLocations.find((item) => item.id === locationId);
  if (!location || session.reputation < location.unlockReputation) return session;
  return { ...session, locationId };
}

export function getExpansion(session: LemonadeSession) {
  return shopExpansions.find((expansion) => expansion.id === session.scene.expansionId) ?? shopExpansions[0];
}

export function setShopExpansion(session: LemonadeSession, expansionId: ShopExpansionId): LemonadeSession {
  const expansion = shopExpansions.find((item) => item.id === expansionId);
  if (!expansion || session.reputation < expansion.unlockReputation) return session;
  return {
    ...session,
    scene: {
      ...session.scene,
      expansionId,
    },
  };
}

export function buyIngredient(session: LemonadeSession, ingredientId: LemonadeIngredientId, packs = 1): LemonadeSession {
  const offer = ingredientMarket.find((item) => item.id === ingredientId);
  if (!offer) return session;
  const cost = offer.packCost * packs;
  if (session.cash < cost) return session;
  return {
    ...session,
    cash: roundMoney(session.cash - cost),
    ingredients: {
      ...session.ingredients,
      [ingredientId]: session.ingredients[ingredientId] + offer.packSize * packs,
    },
  };
}

export function updateLemonadeRecipe(
  session: LemonadeSession,
  key: keyof LemonadeRecipe,
  delta: number,
): LemonadeSession {
  const bounds: Record<keyof LemonadeRecipe, { min: number; max: number }> = {
    price: { min: 1, max: 8 },
    sweetness: { min: 1, max: 5 },
    ice: { min: 1, max: 5 },
    batchSize: { min: 20, max: getBatchCapacity(session) },
  };
  const nextValue = clamp(session.recipe[key] + delta, bounds[key].min, bounds[key].max);
  return {
    ...session,
    recipe: {
      ...session.recipe,
      [key]: key === 'price' ? roundMoney(nextValue) : Math.round(nextValue),
    },
  };
}

export function mixLemonadeBatch(session: LemonadeSession): LemonadeSession {
  const batch = createBatchFromRecipe(session);
  const used = getIngredientUse(session.recipe);
  return {
    ...session,
    batch,
    inventory: batch.cups,
    ingredients: {
      lemons: Math.max(0, session.ingredients.lemons - used.lemons),
      sugar: Math.max(0, session.ingredients.sugar - used.sugar),
      ice: Math.max(0, session.ingredients.ice - used.ice),
      cups: Math.max(0, session.ingredients.cups - used.cups),
      premium: Math.max(0, session.ingredients.premium - used.premium),
    },
    combo: 0,
  };
}

export function performStationTask(session: LemonadeSession, stationId: StationId): LemonadeSession {
  const station = session.stations[stationId];
  if (!station || station.cooldown > 0) return session;
  const nextStations = {
    ...session.stations,
    [stationId]: { ...station, cooldown: station.maxCooldown, isActive: true },
  };
  const nextSession = { ...session, stations: nextStations, scene: { ...session.scene, selectedStation: stationId } };

  if (stationId === 'pitcher') {
    if (!canMixBatch(nextSession)) return nextSession;
    return mixLemonadeBatch(nextSession);
  }

  if (stationId === 'shelf') {
    const priority = nextSession.ingredients.cups < 30 ? 'cups' : nextSession.ingredients.lemons < 18 ? 'lemons' : nextSession.ingredients.ice < 24 ? 'ice' : 'sugar';
    return buyIngredient(nextSession, priority);
  }

  if (stationId === 'cleaning') {
    return {
      ...nextSession,
      scene: {
        ...nextSession.scene,
        cleanliness: clamp(nextSession.scene.cleanliness + 16, 0, 100),
      },
    };
  }

  if (stationId === 'register' || stationId === 'counter') {
    return {
      ...nextSession,
      scene: {
        ...nextSession.scene,
        queuePressure: Math.max(0, nextSession.scene.queuePressure - 8),
        rushMeter: clamp(nextSession.scene.rushMeter + 4, 0, 100),
      },
    };
  }

  return nextSession;
}

export function tickShopSystems(session: LemonadeSession): LemonadeSession {
  const stationEntries = Object.entries(session.stations) as Array<[StationId, StationState]>;
  const stations = stationEntries.reduce<Record<StationId, StationState>>((next, [id, station]) => {
    next[id] = {
      ...station,
      cooldown: Math.max(0, station.cooldown - 1),
      isActive: station.cooldown > 1,
    };
    return next;
  }, {} as Record<StationId, StationState>);
  const workers = session.workers.map((worker) => ({
    ...worker,
    stamina: Math.max(0, worker.stamina - (worker.assignedStation ? 0.5 : 0.15)),
  }));
  return {
    ...session,
    stations,
    workers,
    scene: {
      ...session.scene,
      cleanliness: Math.max(0, session.scene.cleanliness - 0.3 - session.workers.length * 0.05),
      queuePressure: clamp(session.scene.queuePressure + 0.6, 0, 100),
    },
  };
}

export function runWorkerActions(session: LemonadeSession): LemonadeSession {
  return session.workers.reduce((current, worker) => {
    if (!worker.assignedStation || worker.stamina <= 8) return current;
    const chance = (worker.speed + worker.skill) / 220;
    const deterministicRoll = ((current.round * 17 + worker.id.length * 11 + Math.round(current.scene.rushMeter)) % 100) / 100;
    if (deterministicRoll > chance) return current;
    return performStationTask(current, worker.assignedStation);
  }, session);
}

export function hireWorker(session: LemonadeSession, role: WorkerRole): LemonadeSession {
  const expansion = getExpansion(session);
  if (session.workers.length >= expansion.workerSlots) return session;
  const cost = role === 'server' ? 36 : role === 'mixer' ? 42 : 32;
  if (session.cash < cost) return session;
  const worker: LemonadeWorker = {
    id: `${role}-${session.workers.length + 1}`,
    name: ['Maya', 'Theo', 'Jules', 'Nia', 'Marco'][session.workers.length % 5],
    role,
    speed: role === 'server' ? 68 : role === 'mixer' ? 62 : 58,
    wage: Math.round(cost * 0.2),
    stamina: 100,
    skill: 52,
    assignedStation: defaultStationForRole(role),
    level: 1,
  };
  return {
    ...session,
    cash: roundMoney(session.cash - cost),
    workers: [...session.workers, worker],
  };
}

export function assignWorker(session: LemonadeSession, workerId: string, stationId: StationId): LemonadeSession {
  return {
    ...session,
    workers: session.workers.map((worker) => (
      worker.id === workerId ? { ...worker, assignedStation: stationId } : worker
    )),
  };
}

export function upgradeWorker(session: LemonadeSession, workerId: string): LemonadeSession {
  const worker = session.workers.find((item) => item.id === workerId);
  if (!worker) return session;
  const cost = 26 + worker.level * 18;
  if (session.cash < cost) return session;
  return {
    ...session,
    cash: roundMoney(session.cash - cost),
    workers: session.workers.map((item) => (
      item.id === workerId
        ? { ...item, level: item.level + 1, skill: clamp(item.skill + 9, 0, 100), speed: clamp(item.speed + 6, 0, 100), stamina: 100 }
        : item
    )),
  };
}

export function canMixBatch(session: LemonadeSession) {
  const used = getIngredientUse(session.recipe);
  return (Object.keys(used) as LemonadeIngredientId[]).every((key) => session.ingredients[key] >= used[key]);
}

export function getIngredientUse(recipe: LemonadeRecipe): IngredientInventory {
  const pitcherCount = Math.max(1, Math.ceil(recipe.batchSize / 20));
  return {
    lemons: pitcherCount * Math.max(2, recipe.sweetness + 2),
    sugar: pitcherCount * recipe.sweetness * 2,
    ice: pitcherCount * recipe.ice * 3,
    cups: recipe.batchSize,
    premium: 0,
  };
}

export function createBatchFromRecipe(session: LemonadeSession): LemonadeBatch {
  const recipe = session.recipe;
  const used = getIngredientUse(recipe);
  const premiumBoost = Math.min(12, session.ingredients.premium > 0 ? getUpgradeLevel(session, 'premium') * 4 : 0);
  const sweetness = clamp(Math.round(45 + recipe.sweetness * 10 - recipe.ice * 2), 0, 100);
  const tartness = clamp(Math.round(72 - recipe.sweetness * 7 + premiumBoost), 0, 100);
  const coldness = clamp(Math.round(28 + recipe.ice * 14 + getUpgradeLevel(session, 'cooler') * 7), 0, 100);
  const consistency = clamp(Math.round(100 - Math.abs(recipe.sweetness - 3) * 9 - Math.abs(recipe.ice - 3) * 7), 0, 100);
  const freshness = clamp(88 + getUpgradeLevel(session, 'cooler') * 4, 0, 100);
  const quality = clamp(Math.round((sweetness + tartness + coldness + consistency + freshness) / 5), 0, 100);
  const ingredientCost = used.lemons * 0.5 + used.sugar * 0.22 + used.ice * 0.15 + used.cups * 0.16 + used.premium * 0.7;
  return {
    cups: recipe.batchSize,
    lemonsPerPitcher: Math.max(2, recipe.sweetness + 2),
    sugarScoops: recipe.sweetness * 2,
    iceLevel: recipe.ice,
    waterLevel: clamp(6 - Math.round((recipe.sweetness + recipe.ice) / 3), 1, 5),
    sweetness,
    tartness,
    coldness,
    consistency,
    freshness,
    quality,
    costPerCup: roundMoney(ingredientCost / recipe.batchSize),
  };
}

export function createLemonadeCustomer(
  session: LemonadeSession,
  remainingSeconds: number,
  index: number,
): LemonadeCustomer {
  const event = getLemonadeEvent(session.round);
  const location = getLocation(session);
  const umbrellaBoost = 1 + getUpgradeLevel(session, 'umbrella') * 0.11;
  const patience = Math.round((16 + session.reputation * 0.08 + Math.min(remainingSeconds, 60) * 0.02) * event.patience * umbrellaBoost);
  const personality = personalities[(index + session.round) % personalities.length];
  const scenario = pickScenario(session, personality, index);
  return {
    id: `${Date.now()}-${index}`,
    name: names[index % names.length],
    patience,
    maxPatience: patience,
    orderSize: clamp(1 + (index % 3) + Math.floor(location.demand - 1), 1, 5),
    mood: 'waiting',
    x: 8 + ((index * 29) % 76),
    color: customerColors[index % customerColors.length],
    personality,
    dialogue: createDialoguePrompt(scenario, personality),
  };
}

export function getSpawnIntervalMs(session: LemonadeSession) {
  const event = getLemonadeEvent(session.round);
  const location = getLocation(session);
  const signLevel = getUpgradeLevel(session, 'sign');
  const priceDrag = Math.max(0.68, 1 - Math.max(0, session.recipe.price - 3) * 0.055);
  return Math.max(920, Math.round(3900 / (event.demand * location.demand * priceDrag) - signLevel * 260));
}

export function serveLemonadeCustomer(
  session: LemonadeSession,
  customer: LemonadeCustomer,
  dialogue?: CustomerDialogue,
): { session: LemonadeSession; earned: number; satisfaction: number; review: CustomerReview } {
  if (session.inventory < customer.orderSize || !session.batch) {
    const review = makeReview(session, customer, 20, dialogue, 0, 0);
    return { session: { ...session, combo: 0 }, earned: 0, satisfaction: 20, review };
  }

  const satisfaction = scoreCustomerSatisfaction(session, customer, dialogue);
  const tip = satisfaction > 86 ? 0.8 : satisfaction > 72 ? 0.35 : 0;
  const refund = dialogue?.refund ?? 0;
  const combo = session.combo + 1;
  const comboBonus = combo >= 5 ? 0.25 : combo >= 3 ? 0.12 : 0;
  const earned = roundMoney(Math.max(0, customer.orderSize * (session.recipe.price + tip + comboBonus) - refund));
  const review = makeReview(session, customer, satisfaction, dialogue, tip * customer.orderSize, refund);

  return {
    earned,
    satisfaction,
    review,
    session: {
      ...session,
      cash: roundMoney(session.cash + earned),
      inventory: session.inventory - customer.orderSize,
      combo,
      bestCombo: Math.max(session.bestCombo, combo),
      totalCupsSold: session.totalCupsSold + customer.orderSize,
    },
  };
}

export function evaluateCustomerReply(
  session: LemonadeSession,
  customer: LemonadeCustomer,
  reply: string,
): CustomerDialogue {
  const base = customer.dialogue ?? createDialoguePrompt('posting-review', customer.personality ?? 'tourist');
  const text = reply.toLowerCase();
  const empathetic = scoreWords(text, ['sorry', 'understand', 'thanks', 'thank', 'appreciate', 'fix', 'right']);
  const generous = scoreWords(text, ['refund', 'free', 'discount', 'replace', 'new cup', 'remake']);
  const defensive = scoreWords(text, ['whatever', 'no', 'not my', 'deal with', 'wrong', 'leave']);
  const business = scoreWords(text, ['fresh', 'recipe', 'price', 'cost', 'quality', 'wait', 'cold']);
  const score = empathetic * 2 + generous + business - defensive * 3;
  const moodDelta = clamp(score * 4, -18, 18);
  const reviewModifier = clamp(Math.round(score / 2), -2, 2);
  const refund = generous > 0 && base.scenario !== 'best-lemonade' ? Math.min(session.recipe.price, 2.5) : 0;
  const tipDelta = base.scenario === 'best-lemonade' && empathetic > 0 ? 0.5 : 0;
  const response = buildDialogueResponse(base.scenario, customer.personality ?? 'tourist', score);

  return {
    ...base,
    playerReply: reply,
    customerResponse: response,
    moodDelta,
    reviewModifier,
    tipDelta,
    refund,
  };
}

export function finishLemonadeRound(
  session: LemonadeSession,
  roundMetrics: {
    served: number;
    missed: number;
    revenue: number;
    satisfactionTotal: number;
    satisfactionCount: number;
    reviews: CustomerReview[];
  },
): LemonadeSession {
  const event = getLemonadeEvent(session.round);
  const location = getLocation(session);
  const cogs = roundMoney((session.batch?.costPerCup ?? 0.55) * (session.recipe.batchSize - session.inventory));
  const spoilageLoss = roundMoney(session.inventory * (session.batch?.costPerCup ?? 0.45) * Math.max(0.25, 1 - getUpgradeLevel(session, 'cooler') * 0.2));
  const refunds = roundMoney(roundMetrics.reviews.reduce((sum, review) => sum + review.refund, 0));
  const tips = roundMoney(roundMetrics.reviews.reduce((sum, review) => sum + review.tip, 0));
  const wages = roundMoney(session.workers.reduce((sum, worker) => sum + worker.wage, 0));
  const revenue = roundMoney(roundMetrics.revenue);
  const ledger: BusinessLedger = {
    revenue,
    cogs,
    spoilageLoss,
    refunds,
    tips,
    upgradeSpend: wages,
    netProfit: roundMoney(revenue - cogs - spoilageLoss - refunds - location.rent - wages),
  };
  const satisfaction = roundMetrics.satisfactionCount
    ? Math.round(roundMetrics.satisfactionTotal / roundMetrics.satisfactionCount)
    : 35;
  const avgStars = averageStars(roundMetrics.reviews);
  const reputationDelta = clamp(Math.round((satisfaction - 62) / 8 + (avgStars - 3) * 2 + roundMetrics.served / 14 - roundMetrics.missed / 2), -10, 12);
  const xpEarned = Math.max(18, Math.round(roundMetrics.served * 2 + Math.max(0, ledger.netProfit) * 0.2 + session.bestCombo + avgStars * 4));
  const result: LemonadeRoundStats = {
    served: roundMetrics.served,
    missed: roundMetrics.missed,
    revenue,
    ingredientCost: cogs,
    wasteCost: spoilageLoss,
    profit: ledger.netProfit,
    satisfaction,
    xpEarned,
    reputationDelta,
    eventTitle: event.title,
    insight: buildInsight(ledger, satisfaction, roundMetrics.missed, session.inventory, avgStars),
    reviews: roundMetrics.reviews,
    ledger,
  };
  const regularGain = roundMetrics.reviews.filter((review) => review.repeatChance >= 65).length;
  const nextSession = {
    ...session,
    cash: roundMoney(session.cash - spoilageLoss - location.rent),
    xp: session.xp + xpEarned,
    reputation: clamp(session.reputation + reputationDelta, 0, 100),
    day: session.round % 4 === 0 ? session.day + 1 : session.day,
    round: session.round + 1,
    inventory: 0,
    combo: 0,
    batch: session.batch ? { ...session.batch, freshness: Math.max(0, session.batch.freshness - 20) } : undefined,
    reviews: [...roundMetrics.reviews, ...session.reviews].slice(0, 20),
    ledger,
    regulars: session.regulars + regularGain,
    objectives: updateLiveObjectives(session.objectives, result, roundMetrics.reviews),
    workers: session.workers.map((worker) => ({ ...worker, stamina: Math.min(100, worker.stamina + 18) })),
    completedRounds: [...session.completedRounds, result],
    lastResult: result,
  };
  return { ...nextSession, milestones: updateMilestones(nextSession, result) };
}

export function buyLemonadeUpgrade(session: LemonadeSession, upgradeId: LemonadeUpgradeId): LemonadeSession {
  const upgrade = lemonadeUpgradeCatalog.find((item) => item.id === upgradeId);
  if (!upgrade) return session;
  const level = getUpgradeLevel(session, upgradeId);
  const cost = getUpgradeCost(session, upgradeId);
  if (level >= upgrade.maxLevel || session.cash < cost) return session;
  const ledger = session.ledger ? { ...session.ledger, upgradeSpend: roundMoney(session.ledger.upgradeSpend + cost) } : undefined;
  return {
    ...session,
    cash: roundMoney(session.cash - cost),
    ledger,
    ownedUpgrades: {
      ...session.ownedUpgrades,
      [upgradeId]: level + 1,
    },
  };
}

export function getUpgradeLevel(session: LemonadeSession, upgradeId: LemonadeUpgradeId) {
  return session.ownedUpgrades[upgradeId] ?? 0;
}

export function getUpgradeCost(session: LemonadeSession, upgradeId: LemonadeUpgradeId) {
  const upgrade = lemonadeUpgradeCatalog.find((item) => item.id === upgradeId);
  const level = getUpgradeLevel(session, upgradeId);
  return Math.round((upgrade?.baseCost ?? 50) * Math.pow(1.55, level));
}

export function startLemonadeRound(session: LemonadeSession): LemonadeSession {
  if (session.batch) return { ...session, inventory: session.batch.cups, combo: 0 };
  return mixLemonadeBatch(session);
}

export function getServiceCooldownMs(session: LemonadeSession) {
  return Math.max(150, 620 - getUpgradeLevel(session, 'speed') * 95 - getUpgradeLevel(session, 'helper') * 75);
}

export function getBatchCapacity(session: LemonadeSession) {
  return 90 + getUpgradeLevel(session, 'pitcher') * 35;
}

export function calculateBatchCost(recipe: LemonadeRecipe, event: LemonadeEvent, session: LemonadeSession) {
  const used = getIngredientUse(recipe);
  return roundMoney((used.lemons * 0.5 + used.sugar * 0.22 + used.ice * 0.15 + used.cups * 0.16 + used.premium * 0.7) * event.cost);
}

export function getCupUnitCost(recipe: LemonadeRecipe, event: LemonadeEvent, session: LemonadeSession) {
  return roundMoney(calculateBatchCost(recipe, event, session) / recipe.batchSize);
}

function scoreCustomerSatisfaction(session: LemonadeSession, customer: LemonadeCustomer, dialogue?: CustomerDialogue) {
  const batch = session.batch ?? createBatchFromRecipe(session);
  const priceScore = Math.max(-26, 18 - Math.max(0, session.recipe.price - getFairPrice(session)) * 12);
  const waitScore = Math.max(-22, (customer.patience / customer.maxPatience - 0.35) * 28);
  const personalityScore = getPersonalityFit(customer.personality ?? 'tourist', batch, session.recipe.price);
  return clamp(Math.round(46 + batch.quality * 0.35 + priceScore + waitScore + personalityScore + (dialogue?.moodDelta ?? 0)), 0, 100);
}

function getPersonalityFit(personality: CustomerPersonality, batch: LemonadeBatch, price: number) {
  if (personality === 'bargain') return price <= 3 ? 12 : -16;
  if (personality === 'impatient') return batch.coldness > 55 ? 5 : -6;
  if (personality === 'foodie') return batch.quality > 76 ? 15 : -10;
  if (personality === 'parent') return batch.sweetness > 58 && price <= 4 ? 10 : -6;
  if (personality === 'influencer') return batch.consistency > 72 ? 12 : -12;
  if (personality === 'regular') return 6;
  return batch.freshness > 60 ? 6 : -8;
}

function pickScenario(session: LemonadeSession, personality: CustomerPersonality, index: number): CustomerDialogueScenario {
  const batch = session.batch ?? createBatchFromRecipe(session);
  if (session.recipe.price > getFairPrice(session) + 1 && (personality === 'bargain' || index % 5 === 0)) return 'too-expensive';
  if (batch.sweetness > 76) return 'too-sweet';
  if (batch.coldness < 50) return 'not-cold';
  if (personality === 'impatient' && index % 2 === 0) return 'long-wait';
  if (personality === 'bargain' && index % 3 === 0) return 'discount';
  if (personality === 'influencer') return 'posting-review';
  return 'best-lemonade';
}

function createDialoguePrompt(scenario: CustomerDialogueScenario, personality: CustomerPersonality): CustomerDialogue {
  const prompts: Record<CustomerDialogueScenario, string> = {
    'too-expensive': 'This feels pricey for a lemonade. Why should I pay that?',
    'too-sweet': 'Whoa, this is really sweet. Did you change the recipe?',
    'not-cold': 'It is hot out here. Is this supposed to be colder?',
    'long-wait': 'I have been waiting. Can you make this quick?',
    'best-lemonade': 'This might be the best lemonade on the block.',
    discount: 'Can I get a discount if I bring friends next time?',
    'posting-review': 'I am posting a review. What should I tell people?',
  };
  return {
    scenario,
    prompt: `${personality.toUpperCase()}: ${prompts[scenario]}`,
    moodDelta: 0,
    reviewModifier: 0,
    tipDelta: 0,
    refund: 0,
  };
}

function buildDialogueResponse(scenario: CustomerDialogueScenario, personality: CustomerPersonality, score: number) {
  if (score >= 5) {
    if (scenario === 'discount') return 'That is fair. I like the loyalty idea, and I will probably come back.';
    if (scenario === 'posting-review') return 'Great answer. I am mentioning the service and the lemonade.';
    return 'Thanks for taking it seriously. That makes the stand feel worth supporting.';
  }
  if (score <= -2) return `That did not really help. As a ${personality}, I expected a better answer.`;
  return 'Okay, I get it. The lemonade is fine, but the service could be sharper.';
}

function makeReview(
  session: LemonadeSession,
  customer: LemonadeCustomer,
  satisfaction: number,
  dialogue: CustomerDialogue | undefined,
  tip: number,
  refund: number,
): CustomerReview {
  const stars = clamp(Math.round(satisfaction / 22 + (dialogue?.reviewModifier ?? 0)), 1, 5);
  return {
    id: `${customer.id}-review`,
    customerName: customer.name,
    personality: customer.personality ?? 'tourist',
    stars,
    comment: reviewComment(stars, customer.personality ?? 'tourist', session.batch),
    tip: roundMoney(tip + (dialogue?.tipDelta ?? 0)),
    refund,
    repeatChance: clamp(stars * 18 + session.reputation * 0.16, 5, 96),
  };
}

function reviewComment(stars: number, personality: CustomerPersonality, batch?: LemonadeBatch) {
  if (stars >= 5) return `${personality} approved: fresh, fast, and worth telling friends about.`;
  if (stars === 4) return `Good stand. ${batch && batch.coldness < 55 ? 'Could be colder, but' : 'Nice balance and'} solid service.`;
  if (stars === 3) return 'Decent lemonade, but the price, recipe, or wait needs tuning.';
  if (stars === 2) return 'Not terrible, but I would not go out of my way for it yet.';
  return 'Bad value today. The stand needs a reset before I recommend it.';
}

function getFairPrice(session: LemonadeSession) {
  return 2.75 + (session.batch?.quality ?? 60) / 100 + getLocation(session).demand * 0.35;
}

function defaultStationForRole(role: WorkerRole): StationId {
  if (role === 'cashier') return 'register';
  if (role === 'mixer') return 'pitcher';
  if (role === 'server') return 'counter';
  if (role === 'stocker') return 'shelf';
  return 'cleaning';
}

function updateLiveObjectives(objectives: LiveObjective[], result: LemonadeRoundStats, reviews: CustomerReview[]) {
  const avgStars = averageStars(reviews);
  return objectives.map((objective) => {
    if (objective.id === 'serve-10') {
      const progress = Math.min(objective.target, result.served);
      return { ...objective, progress, completed: progress >= objective.target };
    }
    if (objective.id === 'four-star') {
      const progress = Math.min(objective.target, avgStars);
      return { ...objective, progress, completed: avgStars >= 4 };
    }
    if (objective.id === 'no-stockout') {
      const completed = result.missed === 0;
      return { ...objective, progress: completed ? 1 : 0, completed };
    }
    return objective;
  });
}

function averageStars(reviews: CustomerReview[]) {
  if (!reviews.length) return 2.5;
  return reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
}

function buildInsight(ledger: BusinessLedger, satisfaction: number, missed: number, inventory: number, avgStars: number) {
  if (missed > 8) return 'Demand was there. Staffing, speed, and batch size are now your bottlenecks.';
  if (inventory > 18) return 'You overproduced. In a real stand, waste quietly eats profit.';
  if (avgStars < 3) return 'Reviews are hurting demand. Fix taste, price, or customer replies before scaling.';
  if (ledger.netProfit > 100) return 'You ran a real business round: strong margin, controlled costs, and happy customers.';
  if (satisfaction < 55) return 'Revenue came in, but low satisfaction will weaken future demand.';
  return 'Solid operation. Improve one constraint next: sourcing, recipe, service, or location.';
}

function updateMilestones(session: LemonadeSession, result: LemonadeRoundStats) {
  return session.milestones.map((milestone) => {
    if (milestone.achieved) return milestone;
    if (milestone.id === 'first-50-cups') return { ...milestone, achieved: session.totalCupsSold >= 50 };
    if (milestone.id === 'first-5-star') return { ...milestone, achieved: session.reviews.some((review) => review.stars === 5) };
    if (milestone.id === 'hundred-profit') return { ...milestone, achieved: result.profit >= 100 };
    if (milestone.id === 'no-waste') return { ...milestone, achieved: result.wasteCost === 0 };
    if (milestone.id === 'ten-regulars') return { ...milestone, achieved: session.regulars >= 10 };
    return milestone;
  });
}

function scoreWords(text: string, words: string[]) {
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
