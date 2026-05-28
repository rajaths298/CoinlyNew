export type GameId =
  | 'lemonade-empire'
  | 'property-ladder'
  | 'startup-story'
  | 'first-place'
  | 'market-mogul'
  | 'food-truck-frenzy'
  | 'dream-quest';

export type GameMode = 'quick' | 'deep';

export type GameStatus = 'new' | 'in progress' | 'mastered' | 'coming next';

export type GameDefinition = {
  id: GameId;
  title: string;
  fantasy: string;
  competency: string;
  domain: string;
  estimatedTime: string;
  mastery: number;
  status: GameStatus;
  isPlayable: boolean;
  coachReason: string;
  quickPlayLabel: string;
  decisions: GameDecision[];
  events: GameEvent[];
  upgrades: GameUpgrade[];
};

export type GameDecision = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  demandMultiplier?: number;
  costMultiplier?: number;
  cashImpact?: number;
  riskImpact?: number;
};

export type GameUpgrade = {
  id: string;
  title: string;
  description: string;
  cost: number;
  effect: string;
};

export type GameState = {
  gameId: GameId;
  mode: GameMode;
  cash: number;
  round: number;
  selectedUpgradeId?: string;
  decisions: Record<string, number>;
};

export type GameResult = {
  gameId: GameId;
  competency: string;
  performance: number;
  timeSpentSeconds: number;
  timestamp: string;
  revenue: number;
  costs: number;
  profit: number;
  feedback: string;
  eventTitle: string;
};

export type GameProgress = {
  results: GameResult[];
  inProgress: Partial<Record<GameId, GameState>>;
};

export type PropertyPhase = 'board' | 'deal' | 'choice' | 'upgrade' | 'ledger' | 'result';

export type PropertySessionStatus = 'playing' | 'won' | 'lost';

export type PropertyTileKind = 'rent' | 'deal' | 'event' | 'upgrade';

export type PropertyDealTier = 'starter' | 'duplex' | 'auction' | 'fourplex';

export type PropertyDealId =
  | 'starter-condo'
  | 'townhouse-rental'
  | 'small-duplex'
  | 'fixer-duplex'
  | 'corner-fourplex';

export type PropertyChoiceId =
  | 'rent-day'
  | 'repair-call'
  | 'market-pulse'
  | 'tenant-lead'
  | 'bank-review'
  | 'insurance-check'
  | 'vacancy-notice'
  | 'rate-shift'
  | 'neighborhood-boost'
  | 'tax-bill';

export type PropertyChoiceOption = 'primary' | 'secondary';

export type PropertyUpgradeId = 'manager' | 'inspection' | 'insurance' | 'renovation';

export type PropertyTile = {
  id: string;
  title: string;
  kind: PropertyTileKind;
  description: string;
  accent: string;
  dealTier?: PropertyDealTier;
  choiceId?: PropertyChoiceId;
};

export type PropertyDeal = {
  id: PropertyDealId;
  title: string;
  category: string;
  dealTier: PropertyDealTier;
  price: number;
  downPayment: number;
  rent: number;
  mortgage: number;
  expenses: number;
  condition: number;
  risk: number;
  appreciation: number;
  units: number;
  color: string;
};

export type PropertyHolding = PropertyDeal & {
  purchaseMonth: number;
  currentValue: number;
  loanBalance: number;
  vacancyMonths: number;
};

export type PropertyChoice = {
  id: PropertyChoiceId;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export type PropertyTurnLedger = {
  id: string;
  month: number;
  title: string;
  description: string;
  rentCollected: number;
  costs: number;
  upgradeSpend: number;
  cashDelta: number;
  equityDelta: number;
  riskDelta: number;
  netWorthAfter: number;
};

export type PropertySession = {
  cash: number;
  month: number;
  position: number;
  dice: number;
  risk: number;
  targetNetWorth: number;
  maxMonths: number;
  holdings: PropertyHolding[];
  ownedUpgrades: Partial<Record<PropertyUpgradeId, number>>;
  phase: PropertyPhase;
  status: PropertySessionStatus;
  totalRentCollected: number;
  totalCosts: number;
  startingNetWorth: number;
  completedTurns: PropertyTurnLedger[];
  activeDealId?: PropertyDealId;
  activeChoice?: PropertyChoice;
  lastLedger?: PropertyTurnLedger;
  message?: string;
};

export type LemonadeUpgradeId =
  | 'pitcher'
  | 'speed'
  | 'sign'
  | 'cooler'
  | 'premium'
  | 'umbrella'
  | 'helper';

export type LemonadeEventId = 'sunny' | 'heatwave' | 'rain' | 'rush' | 'competition';

export type LemonadePhase =
  | 'forecast'
  | 'market'
  | 'mix'
  | 'stand'
  | 'reviews'
  | 'ledger'
  | 'shop'
  | 'prep'
  | 'playing'
  | 'result';

export type LemonadeRecipe = {
  price: number;
  sweetness: number;
  ice: number;
  batchSize: number;
};

export type LemonadeIngredientId = 'lemons' | 'sugar' | 'ice' | 'cups' | 'premium';

export type IngredientInventory = Record<LemonadeIngredientId, number>;

export type LemonadeBatch = {
  cups: number;
  lemonsPerPitcher: number;
  sugarScoops: number;
  iceLevel: number;
  waterLevel: number;
  sweetness: number;
  tartness: number;
  coldness: number;
  consistency: number;
  freshness: number;
  quality: number;
  costPerCup: number;
};

export type CustomerPersonality =
  | 'bargain'
  | 'impatient'
  | 'foodie'
  | 'parent'
  | 'tourist'
  | 'regular'
  | 'influencer';

export type CustomerDialogueScenario =
  | 'too-expensive'
  | 'too-sweet'
  | 'not-cold'
  | 'long-wait'
  | 'best-lemonade'
  | 'discount'
  | 'posting-review';

export type CustomerDialogue = {
  scenario: CustomerDialogueScenario;
  prompt: string;
  playerReply?: string;
  customerResponse?: string;
  moodDelta: number;
  reviewModifier: number;
  tipDelta: number;
  refund: number;
};

export type CustomerReview = {
  id: string;
  customerName: string;
  personality: CustomerPersonality;
  stars: number;
  comment: string;
  tip: number;
  refund: number;
  repeatChance: number;
};

export type BusinessLedger = {
  revenue: number;
  cogs: number;
  spoilageLoss: number;
  refunds: number;
  tips: number;
  upgradeSpend: number;
  netProfit: number;
};

export type LemonadeLocationId = 'corner' | 'park' | 'school' | 'beach' | 'downtown';

export type LemonadeLocation = {
  id: LemonadeLocationId;
  title: string;
  demand: number;
  rent: number;
  unlockReputation: number;
};

export type LemonadeMilestoneId =
  | 'first-50-cups'
  | 'first-5-star'
  | 'hundred-profit'
  | 'no-waste'
  | 'ten-regulars';

export type LemonadeMilestone = {
  id: LemonadeMilestoneId;
  title: string;
  achieved: boolean;
};

export type WorkerRole = 'cashier' | 'mixer' | 'server' | 'stocker' | 'cleaner';

export type StationId = 'register' | 'pitcher' | 'shelf' | 'counter' | 'cleaning';

export type LemonadeWorker = {
  id: string;
  name: string;
  role: WorkerRole;
  speed: number;
  wage: number;
  stamina: number;
  skill: number;
  assignedStation?: StationId;
  level: number;
};

export type StationState = {
  id: StationId;
  title: string;
  cooldown: number;
  maxCooldown: number;
  level: number;
  isActive: boolean;
};

export type LiveObjective = {
  id: string;
  title: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
};

export type ShopExpansionId = 'cart' | 'kiosk' | 'booth' | 'beach-shop' | 'storefront';

export type ShopExpansion = {
  id: ShopExpansionId;
  title: string;
  unlockReputation: number;
  customerCapacity: number;
  workerSlots: number;
};

export type ShopSceneState = {
  selectedStation?: StationId;
  cleanliness: number;
  queuePressure: number;
  rushMeter: number;
  expansionId: ShopExpansionId;
};

export type LemonadeCustomer = {
  id: string;
  name: string;
  patience: number;
  maxPatience: number;
  orderSize: number;
  mood: 'waiting' | 'happy' | 'angry';
  x: number;
  color: string;
  personality?: CustomerPersonality;
  dialogue?: CustomerDialogue;
};

export type LemonadeFloatingText = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type LemonadeRoundStats = {
  served: number;
  missed: number;
  revenue: number;
  ingredientCost: number;
  wasteCost: number;
  profit: number;
  satisfaction: number;
  xpEarned: number;
  reputationDelta: number;
  eventTitle: string;
  insight: string;
  reviews?: CustomerReview[];
  ledger?: BusinessLedger;
};

export type LemonadeSession = {
  cash: number;
  xp: number;
  reputation: number;
  day: number;
  round: number;
  inventory: number;
  combo: number;
  bestCombo: number;
  recipe: LemonadeRecipe;
  ingredients: IngredientInventory;
  batch?: LemonadeBatch;
  locationId: LemonadeLocationId;
  reviews: CustomerReview[];
  ledger?: BusinessLedger;
  regulars: number;
  totalCupsSold: number;
  milestones: LemonadeMilestone[];
  workers: LemonadeWorker[];
  stations: Record<StationId, StationState>;
  objectives: LiveObjective[];
  scene: ShopSceneState;
  ownedUpgrades: Partial<Record<LemonadeUpgradeId, number>>;
  completedRounds: LemonadeRoundStats[];
  lastResult?: LemonadeRoundStats;
};
