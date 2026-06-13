// Daily streak-reminder notifications (local only, no push backend).
// API verified against https://docs.expo.dev/versions/v56.0.0/sdk/notifications/
//
// Strategy: a one-shot "ladder" of up to 3 date triggers at the next 18:00
// local times, rebuilt on every progress change — a repeating DAILY trigger
// can't skip a day whose goal is already met, and reminding someone who
// already studied is how notification permission gets revoked.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDailyGoalStatus, getStreakStatus } from '../utils/progressDerived';
import type { LessonProgress } from '../types/lesson';

const PREFS_KEY = '@coinly_notification_prefs';
const CHANNEL_ID = 'daily-reminders';
const REMINDER_HOUR = 18; // 6pm local — evening, but before the day is lost

type NotificationPrefs = {
  askedAt?: string;
};

export async function configureNotifications(): Promise<void> {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      // Android 13+ won't even show the permission prompt until a channel exists.
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  } catch {
    // Notifications are a retention nicety — never let them break the app.
  }
}

async function hasPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted === true;
}

export async function requestReminderPermission(): Promise<boolean> {
  try {
    const result = await Notifications.requestPermissionsAsync();
    return result.granted === true;
  } catch {
    return false;
  }
}

// Ask for permission once, and only after the user has completed a lesson —
// the prompt lands right after their first win instead of on a cold first
// launch where "Allow notifications?" reads as spam.
export async function maybeAskAfterFirstLesson(progress: LessonProgress): Promise<void> {
  try {
    if (progress.completedLessonIds.length < 1) return;
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    const prefs: NotificationPrefs = raw ? (JSON.parse(raw) as NotificationPrefs) : {};
    if (prefs.askedAt) return;
    // Stamp before prompting so an interrupted prompt can't re-ask forever.
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ askedAt: new Date().toISOString() }));
    const granted = await requestReminderPermission();
    if (granted) await syncDailyReminder(progress);
  } catch {
    // non-fatal
  }
}

export async function syncDailyReminder(progress: LessonProgress): Promise<void> {
  try {
    if (!(await hasPermission())) return;

    // Safe while this app schedules nothing else; switch to identifier-based
    // cancellation if another feature ever schedules notifications.
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const { studiedToday } = getStreakStatus(progress, now);
    const goal = getDailyGoalStatus(progress, now);

    const slots: Array<{ date: Date; content: { title: string; body: string } }> = [];
    const todaySlot = new Date(now.getFullYear(), now.getMonth(), now.getDate(), REMINDER_HOUR, 0, 0);
    if (now < todaySlot && !goal.met) {
      slots.push({
        date: todaySlot,
        content: studiedToday
          ? {
              title: 'Finish your daily goal',
              body: `You're at ${goal.earned}/${goal.goal} XP — one quick lesson closes it out.`,
            }
          : streakContent(progress.streak),
      });
    }
    // Tomorrow and the day after cover the user who doesn't open the app at all.
    // Local calendar math, never now + 24h — DST days are 23/25 hours long.
    for (const offset of [1, 2]) {
      slots.push({
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, REMINDER_HOUR, 0, 0),
        content: streakContent(progress.streak),
      });
    }

    for (const slot of slots) {
      await Notifications.scheduleNotificationAsync({
        content: slot.content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: slot.date,
          ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
        },
      });
    }
  } catch {
    // non-fatal
  }
}

function streakContent(streak: number): { title: string; body: string } {
  if (streak > 0) {
    return {
      title: 'Your streak is on the line',
      body: `A 3-minute lesson keeps your ${streak}-day streak alive.`,
    };
  }
  return {
    title: 'Start your money streak',
    body: 'One short lesson today gets your Coinly streak going.',
  };
}
