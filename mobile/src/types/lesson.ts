export type LessonDomain =
  | 'foundations'
  | 'budgeting'
  | 'saving'
  | 'credit'
  | 'debt'
  | 'investing'
  | 'etfs'
  | 'stocks'
  | 'crypto'
  | 'taxes'
  | 'insurance'
  | 'career'
  | 'entrepreneurship'
  | 'advanced';

export type LessonLevel =
  | 'beginner'
  | 'builder'
  | 'confident'
  | 'advanced'
  | 'foundations'
  | 'applied'
  | 'analytical'
  | 'mastery';

export type LessonActivityType =
  | 'concept'
  | 'reveal'
  | 'action'
  | 'reading'
  | 'scenario'
  | 'calculator'
  | 'sort'
  | 'matching'
  | 'decision'
  | 'simulation'
  | 'reflection'
  | 'quiz'
  | 'caseStudy'
  | 'project'
  | 'exam'
  | 'freeRecall';

export type LessonStepType = LessonActivityType;

export type CompetencyId =
  | 'moneyMindset'
  | 'cashFlow'
  | 'banking'
  | 'inflation'
  | 'budgetDesign'
  | 'behavior'
  | 'savingSystems'
  | 'liquidity'
  | 'creditScore'
  | 'debtMath'
  | 'riskReturn'
  | 'portfolioConstruction'
  | 'taxPlanning'
  | 'insuranceRisk'
  | 'incomeGrowth'
  | 'businessFinance'
  | 'financialAnalysis'
  | 'retirementPlanning';

export type Competency = {
  id: CompetencyId;
  title: string;
  trackId: LessonDomain;
  description: string;
};

export type CalculatorFormulaKey =
  | 'opportunityCost'
  | 'budgetSurplus'
  | 'annualCost'
  | 'compoundGrowth'
  | 'deductibleReserve'
  | 'emergencyFund'
  | 'loanPayment'
  | 'netWorth'
  | 'profitMargin'
  | 'taxWithholding'
  | 'utilization'
  | 'portfolioReturn'
  | 'savingsGoal';

export type CalculatorInput = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

export type LessonCalculator = {
  formulaKey: CalculatorFormulaKey;
  formula: string;
  resultLabel: string;
  explanation: string;
  inputs: CalculatorInput[];
};

export type LessonChoice = {
  id: string;
  text: string;
  correct?: boolean;
  outcome?: string;
  score?: number;
  rationale?: string;
};

export type SortItem = {
  id: string;
  text: string;
  rank: number;
};

export type MatchingPair = {
  id: string;
  term: string;
  match: string;
};

export type LessonActivity = {
  id: string;
  type: LessonActivityType;
  title: string;
  body: string;
  prompt?: string;
  reveal?: string;
  question?: string;
  explanation?: string;
  choices?: LessonChoice[];
  actionChoices?: LessonChoice[];
  calculator?: LessonCalculator;
  sortItems?: SortItem[];
  matchingPairs?: MatchingPair[];
  scenarioContext?: string;
  simulationGoal?: string;
  projectDeliverable?: string;
  masteryWeight?: number;
  recallPrompt?: string;
  recallChecklist?: string[];
};

export type LessonStep = LessonActivity;

export type CourseTrack = {
  id: LessonDomain;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  competencyIds: CompetencyId[];
  moduleIds: string[];
};

export type CourseModule = {
  id: string;
  title: string;
  trackId: LessonDomain;
  level: LessonLevel;
  description: string;
  lessonIds: string[];
  competencyIds: CompetencyId[];
  masteryThreshold: number;
  examLessonId?: string;
  projectLessonId?: string;
};

export type LessonDifficulty = 1 | 2 | 3 | 4 | 5;

export type PersonalFinanceStandard =
  | 'earning'
  | 'spending'
  | 'saving'
  | 'investing'
  | 'credit'
  | 'risk';

export type Lesson = {
  id: string;
  title: string;
  domain: LessonDomain;
  level: LessonLevel;
  unitId: string;
  unitTitle: string;
  courseTrackId: LessonDomain;
  moduleId: string;
  durationMinutes: number;
  xp: number;
  prerequisites: string[];
  difficulty: LessonDifficulty;
  learningObjectives: string[];
  competencyIds: CompetencyId[];
  competencyTags: string[];
  masteryWeight: number;
  formulaRefs: string[];
  misconceptions: string[];
  steps: LessonStep[];
  standardsDomains?: PersonalFinanceStandard[];
  quickRecall?: LessonActivity[];
  realWorldQuest?: RealWorldQuest;
  // new: rich exercise format for the Duolingo-style player
  exercises?: import('./learn').Exercise[];
};

export type LessonUnit = {
  id: string;
  title: string;
  domain: LessonDomain;
  level: LessonLevel;
  lessonIds: string[];
  description?: string;
  trackId?: LessonDomain;
  competencyIds?: CompetencyId[];
  masteryThreshold?: number;
};

export type ActivityResponse = {
  lessonId: string;
  activityId: string;
  value: string | number | string[];
  isCorrect?: boolean;
  score?: number;
};

export type RealWorldQuest = {
  id: string;
  title: string;
  description: string;
  actions: string[];
  xpReward: number;
  badgeId: string;
};

export type MixedPracticeSession = {
  id: string;
  title: string;
  steps: LessonActivity[];
  sourceLessonIds: string[];
  competencyIds: CompetencyId[];
  xp: number;
};

export type LessonPerformance = {
  firstTryCorrectCount: number;
  totalScoredSteps: number;
  hasRushedSteps: boolean;
};

export type ReviewQueueItem = {
  lessonId: string;
  interval: number;
  ease: number;
  dueDate: string;
  lapses: number;
};

export type AssessmentResult = {
  lessonId: string;
  moduleId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  missedCompetencyIds: CompetencyId[];
  completedAt: string;
};

export type MasteryState = {
  competencyId: CompetencyId;
  conceptScore: number;
  applicationScore: number;
  quizScore: number;
  projectScore: number;
  confidence: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
};

export type LessonProgress = {
  completedLessonIds: string[];
  xp: number;
  streak: number;
  activeLessonId?: string;
  mastery?: Partial<Record<CompetencyId, MasteryState>>;
  assessmentResults?: AssessmentResult[];
  reviewQueue?: string[];
  reviewQueueV2?: ReviewQueueItem[];
  certificates?: string[];
  badges?: string[];
  streakFreezes?: number;
  completedQuestIds?: string[];
  // new gamification fields (all optional, safe defaults)
  brainBucks?: number;
  dailyXpGoal?: number;
  dailyXpEarned?: number;
  lastStreakDate?: string;
  unitMastery?: Partial<Record<string, import('./learn').MasteryTier>>;
  completedChestIds?: string[];
  dailyQuestProgress?: import('./learn').DailyQuestProgress;
  schemaVersion?: number;
};
