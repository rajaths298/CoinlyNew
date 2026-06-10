import type { CalculatorFormulaKey, CalculatorInput, CompetencyId, LessonDomain } from './lesson';

// ─── Exercise kinds ──────────────────────────────────────────────────────────

export type ExerciseKind =
  | 'multipleChoice'
  | 'matchPairs'
  | 'fillBlank'
  | 'tapToOrder'
  | 'categorize'
  | 'scenarioDecision'
  | 'miniStory'
  | 'calculator'
  | 'trueFalse'
  | 'recallPrompt'
  | 'sliderPlayground';

type ExerciseBase = {
  id: string;
  kind: ExerciseKind;
  competencyId: CompetencyId;
  rationale: string;
};

export type MCOption = { id: string; text: string; isCorrect: boolean };

export type MultipleChoiceExercise = ExerciseBase & {
  kind: 'multipleChoice';
  prompt: string;
  context?: string;
  options: MCOption[];
};

export type MatchPair = { id: string; term: string; definition: string };

export type MatchPairsExercise = ExerciseBase & {
  kind: 'matchPairs';
  instruction: string;
  pairs: MatchPair[];
};

export type FillBlankExercise = ExerciseBase & {
  kind: 'fillBlank';
  template: string;
  wordBank: string[];
  blanks: string[];
};

export type OrderItem = { id: string; text: string; rank: number };

export type TapToOrderExercise = ExerciseBase & {
  kind: 'tapToOrder';
  instruction: string;
  items: OrderItem[];
};

export type Bucket = { id: string; label: string };
export type BucketItem = { id: string; text: string; bucketId: string };

export type CategorizeExercise = ExerciseBase & {
  kind: 'categorize';
  instruction: string;
  buckets: Bucket[];
  items: BucketItem[];
};

export type ScenarioChoice = {
  id: string;
  text: string;
  outcome: string;
  isCorrect: boolean;
  score: 0 | 1 | 2 | 3;
};

export type ScenarioExercise = ExerciseBase & {
  kind: 'scenarioDecision';
  story: string;
  choices: ScenarioChoice[];
};

export type StoryPanel = { text: string; speaker?: string };
export type StoryChoice = { id: string; text: string; isCorrect: boolean; outcome: string };

export type MiniStoryExercise = ExerciseBase & {
  kind: 'miniStory';
  panels: StoryPanel[];
  choicePrompt: string;
  choices: StoryChoice[];
};

export type CalculatorExercise = ExerciseBase & {
  kind: 'calculator';
  formulaKey: CalculatorFormulaKey;
  prompt: string;
  targetLabel: string;
  explanation: string;
  inputs: CalculatorInput[];
};

export type TrueFalseExercise = ExerciseBase & {
  kind: 'trueFalse';
  statement: string;
  isTrue: boolean;
};

export type RecallPromptExercise = ExerciseBase & {
  kind: 'recallPrompt';
  prompt: string;
  conceptReveal: string;
  checkpoints: string[];
};

export type SliderPlaygroundExercise = ExerciseBase & {
  kind: 'sliderPlayground';
  prompt: string;
  explanation: string;
  targetLabel: string;
  formulaKey: CalculatorFormulaKey;
  inputs: CalculatorInput[];
  graph: {
    xInputId: string;
    xLabel: string;
    yLabel: string;
  };
};

export type Exercise =
  | MultipleChoiceExercise
  | MatchPairsExercise
  | FillBlankExercise
  | TapToOrderExercise
  | CategorizeExercise
  | ScenarioExercise
  | MiniStoryExercise
  | CalculatorExercise
  | TrueFalseExercise
  | RecallPromptExercise
  | SliderPlaygroundExercise;

// ─── Path / progression ──────────────────────────────────────────────────────

export type PathNodeType = 'lesson' | 'practice' | 'chest' | 'guidebook' | 'trophy';
export type PathNodeState = 'locked' | 'available' | 'active' | 'completed';

export type PathNode = {
  id: string;
  type: PathNodeType;
  position: 'left' | 'center' | 'right';
  lessonId?: string;
  chestReward?: { brainBucks: number; xp: number };
};

export type GuidebookEntry = {
  id: string;
  title: string;
  body: string;
  formulaRef?: CalculatorFormulaKey;
};

export type PathUnit = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  trackId: LessonDomain;
  competencyIds: CompetencyId[];
  nodes: PathNode[];
  guidebook: GuidebookEntry[];
  masteryThreshold: number;
};

export type MasteryTier = 'bronze' | 'silver' | 'gold' | 'legendary';

export type DailyQuestProgress = {
  questId: string;
  current: number;
  target: number;
  completedAt?: string;
};
