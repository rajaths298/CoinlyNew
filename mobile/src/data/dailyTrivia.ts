import type {
  MultipleChoiceExercise,
  TrueFalseExercise,
  ScenarioExercise,
} from '../types/learn';
import type { Lesson } from '../types/lesson';
import {
  introToInvestingLessons,
} from './investing/introToInvesting';
import {
  stocksAndMarketLessons,
} from './investing/stocksAndMarket';
import {
  fundsAndEtfsLessons,
} from './investing/fundsAndEtfs';
import {
  riskMarginShortingLessons,
} from './investing/riskMarginShorting';
import {
  cryptoUnitLessons,
} from './investing/cryptoUnit';

export type TriviaExercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | ScenarioExercise;

export type TriviaQuestion = {
  lessonId: string;
  exerciseIdx: number;
  exercise: TriviaExercise;
  lessonTitle: string;
};

const TRIVIA_KINDS = new Set(['multipleChoice', 'trueFalse', 'scenarioDecision']);

let _pool: TriviaQuestion[] | null = null;

function buildPool(): TriviaQuestion[] {
  if (_pool) return _pool;

  const allLessons: Lesson[] = [
    ...Object.values(introToInvestingLessons),
    ...Object.values(stocksAndMarketLessons),
    ...Object.values(fundsAndEtfsLessons),
    ...Object.values(riskMarginShortingLessons),
    ...Object.values(cryptoUnitLessons),
  ];

  const pool: TriviaQuestion[] = [];
  for (const lesson of allLessons) {
    if (!lesson.exercises) continue;
    lesson.exercises.forEach((ex, idx) => {
      if (TRIVIA_KINDS.has(ex.kind)) {
        pool.push({
          lessonId: lesson.id,
          exerciseIdx: idx,
          exercise: ex as TriviaExercise,
          lessonTitle: lesson.title,
        });
      }
    });
  }

  _pool = pool;
  return pool;
}

export function getDailyTriviaQuestion(dateStr: string): TriviaQuestion | null {
  const pool = buildPool();
  if (pool.length === 0) return null;
  const seed = parseInt(dateStr.replace(/-/g, ''), 10);
  return pool[seed % pool.length];
}

export function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isTriviaAnsweredToday(
  dailyTrivia: { date: string; answered: boolean } | undefined,
): boolean {
  if (!dailyTrivia) return false;
  return dailyTrivia.date === getTodayDateStr() && dailyTrivia.answered;
}

export function getTriviaCorrectAnswer(exercise: TriviaExercise): string {
  if (exercise.kind === 'trueFalse') {
    return exercise.isTrue ? 'True' : 'False';
  }
  if (exercise.kind === 'multipleChoice') {
    return exercise.options.find((o) => o.isCorrect)?.text ?? '';
  }
  // scenarioDecision
  return exercise.choices.find((c) => c.isCorrect)?.text ?? '';
}
