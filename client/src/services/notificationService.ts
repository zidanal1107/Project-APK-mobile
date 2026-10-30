import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { ScheduleItem } from "../types/schedule";
import type { NotificationSettings } from "./settingsService";

const CHANNEL_ID = "schedule-reminders";

const DAY_MAP: Record<string, number> = {
  minggu: 1,
  sunday: 1,
  senin: 2,
  monday: 2,
  selasa: 3,
  tuesday: 3,
  rabu: 4,
  wednesday: 4,
  kamis: 5,
  thursday: 5,
  jumat: 6,
  friday: 6,
  sabtu: 7,
  saturday: 7,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let initialized = false;

export async function initializeNotifications(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Pengingat Jadwal",
      description: "Pengingat jadwal kuliah dan kegiatan",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }

  const current = await Notifications.getPermissionsAsync();

  let granted = current.status === "granted";

  if (!granted) {
    const requested =
      await Notifications.requestPermissionsAsync();

    granted = requested.status === "granted";
  }

  initialized = granted;

  return granted;
}

function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time);
}

function isQuietHour(
  hour: number,
  minute: number,
  settings: NotificationSettings
): boolean {
  if (!settings.quietHours.enabled) {
    return false;
  }

  const [startHour, startMinute] =
    settings.quietHours.start.split(":").map(Number);

  const [endHour, endMinute] =
    settings.quietHours.end.split(":").map(Number);

  const current = hour * 60 + minute;
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  if (start === end) return true;

  if (start < end) {
    return current >= start && current < end;
  }

  return current >= start || current < end;
}

export async function cancelScheduleNotifications(
  scheduleId: string
): Promise<void> {
  const notifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const related = notifications.filter(
    (item) =>
      item.content.data?.type === "schedule_reminder" &&
      item.content.data?.scheduleId === scheduleId
  );

  await Promise.all(
    related.map((item) =>
      Notifications.cancelScheduledNotificationAsync(
        item.identifier
      )
    )
  );
}

function calculateReminderTime(
  start: string,
  minutesBefore: number
) {
  const [hour, minute] = start.split(":").map(Number);

  let totalMinutes =
    hour * 60 + minute - minutesBefore;

  let dayOffset = 0;

  while (totalMinutes < 0) {
    totalMinutes += 1440;
    dayOffset--;
  }

  return {
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
    dayOffset,
  };
}

export async function syncScheduleNotification(
  schedule: ScheduleItem,
  settings: NotificationSettings
): Promise<void> {
  await cancelScheduleNotifications(schedule.id);

  if (!settings.enabled) return;

  if (schedule.type === "akademik" && !settings.academic) {
    return;
  }

  if (
    schedule.type === "non-akademik" &&
    !settings.nonAcademic
  ) {
    return;
  }

  if (!isValidTime(schedule.start)) {
    console.warn("Format jam jadwal tidak valid:", schedule.start);
    return;
  }

  const weekday = DAY_MAP[schedule.hari.toLowerCase()];

  if (!weekday) {
    console.warn("Hari tidak dikenali:", schedule.hari);
    return;
  }

  const permission = initialized
    ? true
    : await initializeNotifications();

  if (!permission) return;

  for (const minutesBefore of settings.reminderTimes) {
    if (
      !Number.isInteger(minutesBefore) ||
      minutesBefore <= 0
    ) {
      continue;
    }

    const reminder = calculateReminderTime(
      schedule.start,
      minutesBefore
    );

    let reminderWeekday =
      weekday + reminder.dayOffset;

    while (reminderWeekday < 1) reminderWeekday += 7;
    while (reminderWeekday > 7) reminderWeekday -= 7;

    if (
      isQuietHour(
        reminder.hour,
        reminder.minute,
        settings
      )
    ) {
      continue;
    }

    const duration =
      minutesBefore >= 60
        ? `${minutesBefore / 60} jam`
        : `${minutesBefore} menit`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Pengingat: ${schedule.name}`,
        body: `Jadwal dimulai dalam ${duration}. Pukul ${schedule.start}.`,
        data: {
          type: "schedule_reminder",
          scheduleId: schedule.id,
        },
      },

      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: reminderWeekday,
        hour: reminder.hour,
        minute: reminder.minute,
        channelId:
          Platform.OS === "android"
            ? CHANNEL_ID
            : undefined,
      },
    });
  }
}

export async function syncAllScheduleNotifications(
  schedules: ScheduleItem[],
  settings: NotificationSettings
): Promise<void> {
  const notifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const oldNotifications = notifications.filter(
    (item) =>
      item.content.data?.type === "schedule_reminder"
  );

  await Promise.all(
    oldNotifications.map((item) =>
      Notifications.cancelScheduledNotificationAsync(
        item.identifier
      )
    )
  );

  if (!settings.enabled) return;

  if (!(await initializeNotifications())) return;

  for (const schedule of schedules) {
    await syncScheduleNotification(schedule, settings);
  }
}