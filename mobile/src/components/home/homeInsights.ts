// Pure derivation helpers for the Home tab. No React imports — every function
// takes progress/market state and returns display-ready values, so the home
// components stay presentational and these stay unit-testable.

import { gameDefinitions } from '../../data/gameDefinitions';
import { getPathUnits, getUnitCompletion } from '../../data/pathCatalog';
import { getLocalDayKey } from '../../utils/dateKey';
import { getDailyGoalStatus, getStreakStatus } from '../../utils/progressDerived';
import type { MarketAsset } from '../../services/marketData';
import type { GameDefinition, GameProgress } from '../../types/game';
import type { Lesson, LessonProgress } from '../../types/lesson';
import type { OnboardingProfile } from '../../types/onboarding';

export { getDailyGoalStatus, getStreakStatus } from '../../utils/progressDerived';
export type { DailyGoalStatus, StreakStatus } from '../../utils/progressDerived';

export type MarketStatus = 'loading' | 'ready' | 'fallback';

export type MarketMood = {
  direction: 'up' | 'down' | 'mixed' | 'unknown';
  line: string;
};

const MIXED_THRESHOLD_PERCENT = 0.05;

export function getMarketMood(assets: MarketAsset[], status: MarketStatus): MarketMood {
  if (status === 'loading') return { direction: 'unknown', line: 'Checking markets…' };
  if (status === 'fallback') return { direction: 'unknown', line: 'Market snapshot (demo)' };

  // Crypto trades 24/7 and swings hard — it would dominate "are markets up today".
  const moves = assets
    .filter((asset) => asset.kind !== 'crypto' && asset.changePercent !== undefined)
    .map((asset) => asset.changePercent as number);
  if (moves.length === 0) return { direction: 'unknown', line: 'Markets open in Explore' };

  const ups = moves.filter((value) => value > 0).length;
  const downs = moves.filter((value) => value < 0).length;
  const mean = moves.reduce((sum, value) => sum + value, 0) / moves.length;

  if (ups > downs) return { direction: 'up', line: 'Markets up today' };
  if (downs > ups) return { direction: 'down', line: 'Markets down today' };
  if (mean > MIXED_THRESHOLD_PERCENT) return { direction: 'up', line: 'Markets up today' };
  if (mean < -MIXED_THRESHOLD_PERCENT) return { direction: 'down', line: 'Markets down today' };
  return { direction: 'mixed', line: 'Markets mixed today' };
}

export function getLearnCardLine(
  profile: OnboardingProfile,
  progress: LessonProgress,
  nextLesson: Lesson | undefined,
): string {
  if (nextLesson) {
    const unit = getPathUnits(profile).find((candidate) => candidate.id === nextLesson.unitId);
    if (unit) {
      const completion = getUnitCompletion(unit, progress);
      const left = completion.total - completion.completed;
      return `${unit.title} · ${left} ${left === 1 ? 'lesson' : 'lessons'} left`;
    }
    return nextLesson.title;
  }
  return 'All lessons complete · review anytime';
}

export function getSuggestedGame(gameProgress: GameProgress): GameDefinition {
  const playedIds = new Set(gameProgress.results.map((result) => result.gameId));
  const unplayed = gameDefinitions.find((game) => game.isPlayable && !playedIds.has(game.id));
  return unplayed
    ?? gameDefinitions.find((game) => game.id === 'lemonade-empire')
    ?? gameDefinitions[0]!;
}

export type DailyQuest = {
  id: string;
  label: string;
  done: boolean;
  rewardLabel: string;
};

export function playedGameToday(
  lessonProgress: LessonProgress,
  gameProgress: GameProgress,
  now: Date = new Date(),
): boolean {
  const todayKey = getLocalDayKey(now);
  if (lessonProgress.lastGamePlayedDate === todayKey) return true;
  return gameProgress.results.some(
    (result) => getLocalDayKey(new Date(result.timestamp)) === todayKey,
  );
}

export function getDailyQuests(
  lessonProgress: LessonProgress,
  gameProgress: GameProgress,
  now: Date = new Date(),
): DailyQuest[] {
  const { studiedToday } = getStreakStatus(lessonProgress, now);
  const dailyGoal = getDailyGoalStatus(lessonProgress, now);
  return [
    {
      id: 'lesson',
      label: 'Complete a lesson',
      done: studiedToday,
      rewardLabel: '+XP',
    },
    {
      id: 'xp-goal',
      label: `Hit your daily goal (${dailyGoal.goal} XP)`,
      done: dailyGoal.met,
      rewardLabel: `${dailyGoal.earned}/${dailyGoal.goal}`,
    },
    {
      id: 'game',
      label: 'Play a game round',
      done: playedGameToday(lessonProgress, gameProgress, now),
      rewardLabel: '+BB',
    },
  ];
}
