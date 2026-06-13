import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDailyTriviaQuestion, getTodayDateStr, isTriviaAnsweredToday } from '../../data/dailyTrivia';
import { getReviewQueueDueToday } from '../../data/lessonCatalog';
import { appColors as colors } from '../../theme';
import { FadeSlideIn } from '../ui/animations';
import { ICON } from '../ui/icons';
import DailyQuestsCard from './DailyQuestsCard';
import HomeHeader from './HomeHeader';
import MarketTicker from './MarketTicker';
import SectionGrid, { type SectionCard, type SectionTab } from './SectionGrid';
import TodaySessionPanel from './TodaySessionPanel';
import {
  getDailyGoalStatus,
  getDailyQuests,
  getLearnCardLine,
  getMarketMood,
  getStreakStatus,
  getSuggestedGame,
  type MarketStatus,
} from './homeInsights';
import type { MarketAsset } from '../../services/marketData';
import type { GameProgress } from '../../types/game';
import type { Lesson, LessonProgress } from '../../types/lesson';
import type { OnboardingProfile } from '../../types/onboarding';

type Props = {
  firstName: string;
  profile: OnboardingProfile;
  lessonProgress: LessonProgress;
  gameProgress: GameProgress;
  nextPathLesson: Lesson | undefined;
  marketAssets: MarketAsset[];
  marketStatus: MarketStatus;
  lastUpdated: string | null;
  onStartLesson?: () => void;
  onOpenDailyTrivia?: () => void;
  onNavigate: (tab: SectionTab) => void;
};

export default function HomeTab({
  firstName,
  profile,
  lessonProgress,
  gameProgress,
  nextPathLesson,
  marketAssets,
  marketStatus,
  lastUpdated,
  onStartLesson,
  onOpenDailyTrivia,
  onNavigate,
}: Props) {
  const streakStatus = getStreakStatus(lessonProgress);
  const dailyGoal = getDailyGoalStatus(lessonProgress);
  const quests = getDailyQuests(lessonProgress, gameProgress);
  const reviewDueCount = getReviewQueueDueToday(lessonProgress).length;
  const mood = getMarketMood(marketAssets, marketStatus);
  const suggestedGame = getSuggestedGame(gameProgress);
  const budgetFocus = profile.answers.budgetFocus?.[0];
  const triviaAnswered = isTriviaAnsweredToday(lessonProgress.dailyTrivia);
  const triviaWasCorrect = lessonProgress.dailyTrivia?.wasCorrect ?? false;
  const triviaStreak = lessonProgress.dailyTrivia?.triviaStreak ?? 0;

  const moodArrow = mood.direction === 'up' ? ` ${ICON.up}` : mood.direction === 'down' ? ` ${ICON.down}` : '';
  const cards: SectionCard[] = [
    {
      tab: 'learn',
      title: 'LEARN',
      line: getLearnCardLine(profile, lessonProgress, nextPathLesson),
      action: 'PICK A LESSON →',
    },
    {
      tab: 'games',
      title: 'GAMES',
      line: `Up next: ${suggestedGame.title}`,
      action: 'PICK A GAME →',
    },
    {
      tab: 'budget',
      title: 'BUDGET',
      line: budgetFocus ? `Focus: ${budgetFocus}` : "Plan this month's spending",
      action: 'OPEN →',
    },
    {
      tab: 'explore',
      title: 'EXPLORE',
      line: `${mood.line}${moodArrow}`,
      action: 'SEE MARKETS →',
      lineTone: mood.direction === 'up' ? 'positive' : mood.direction === 'down' ? 'negative' : undefined,
    },
  ];

  return (
    <View>
      <FadeSlideIn delay={0}>
        <MarketTicker
          assets={marketAssets}
          status={marketStatus}
          lastUpdated={lastUpdated}
          onPress={() => onNavigate('explore')}
        />
      </FadeSlideIn>
      <FadeSlideIn delay={60}>
        <HomeHeader
          firstName={firstName}
          streak={lessonProgress.streak}
          streakAtRisk={streakStatus.atRisk}
          studiedToday={streakStatus.studiedToday}
          brainBucks={lessonProgress.brainBucks ?? 0}
          dailyXpEarned={dailyGoal.earned}
          dailyXpGoal={dailyGoal.goal}
        />
      </FadeSlideIn>
      <FadeSlideIn delay={130}>
        <TodaySessionPanel
          nextLesson={nextPathLesson}
          reviewDueCount={reviewDueCount}
          streakAtRisk={streakStatus.atRisk}
          onStart={onStartLesson}
        />
      </FadeSlideIn>
      <FadeSlideIn delay={165}>
        <DailyTriviaCard
          answered={triviaAnswered}
          wasCorrect={triviaWasCorrect}
          triviaStreak={triviaStreak}
          onPress={onOpenDailyTrivia}
        />
      </FadeSlideIn>
      <FadeSlideIn delay={200}>
        <SectionGrid cards={cards} onNavigate={onNavigate} />
      </FadeSlideIn>
      <FadeSlideIn delay={270}>
        <DailyQuestsCard quests={quests} />
      </FadeSlideIn>
    </View>
  );
}

function DailyTriviaCard({
  answered,
  wasCorrect,
  triviaStreak,
  onPress,
}: {
  answered: boolean;
  wasCorrect: boolean;
  triviaStreak: number;
  onPress?: () => void;
}) {
  const today = getTodayDateStr();
  const available = !!getDailyTriviaQuestion(today);
  if (!available) return null;

  return (
    <View style={styles.triviaCard}>
      <View style={styles.triviaCardInner}>
        <View style={styles.triviaCopy}>
          <Text style={styles.triviaEyebrow}>DAILY CHALLENGE</Text>
          {answered ? (
            <>
              <Text style={styles.triviaTitle}>
                {wasCorrect ? 'Challenge complete!' : 'Good effort today'}
              </Text>
              <Text style={styles.triviaBody}>
                {wasCorrect ? 'Correct answer - +5 Brain Bucks earned.' : 'Come back tomorrow for another.'}
                {triviaStreak > 1 ? `  ${triviaStreak}-day streak.` : ''}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.triviaTitle}>Test your knowledge</Text>
              <Text style={styles.triviaBody}>One question, one chance. Resets tomorrow.</Text>
            </>
          )}
        </View>
        {!answered && onPress ? (
          <TouchableOpacity style={styles.triviaButton} onPress={onPress} activeOpacity={0.85}>
            <Text style={styles.triviaButtonText}>START</Text>
          </TouchableOpacity>
        ) : answered ? (
          <View style={[styles.triviaDoneBadge, wasCorrect ? styles.triviaDoneBadgeCorrect : styles.triviaDoneBadgeMissed]}>
            <Text style={styles.triviaDoneBadgeText}>{wasCorrect ? 'DONE' : 'TRIED'}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  triviaCard: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.yellow,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  triviaCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
  },
  triviaCopy: {
    flex: 1,
  },
  triviaEyebrow: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
    color: colors.black,
  },
  triviaTitle: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '800',
    color: colors.black,
  },
  triviaBody: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  triviaButton: {
    minWidth: 72,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 19,
    paddingHorizontal: 14,
  },
  triviaButtonText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
    color: colors.buttonText,
  },
  triviaDoneBadge: {
    minWidth: 62,
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  triviaDoneBadgeCorrect: {
    backgroundColor: 'rgba(31, 122, 61, 0.14)',
  },
  triviaDoneBadgeMissed: {
    backgroundColor: 'rgba(107, 116, 95, 0.16)',
  },
  triviaDoneBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 0.5,
  },
});
