import AsyncStorage from "@react-native-async-storage/async-storage";

export type NotificationSound =
  | "default"
  | "gentle"
  | "digital"
  | "bell"
  | "alert";

export interface NotificationSettings {
  enabled: boolean;
  reminderTimes: number[];
  sound: NotificationSound;
  academic: boolean;
  nonAcademic: boolean;
  scheduleChanges: boolean;
  scheduleConflicts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  snoozeDuration: 5 | 10 | 15;
}

export interface AppSettings {
  notifications: NotificationSettings;
  activeSemester: string;
  aiDetection: boolean;
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  fakultas?: string;
  jurusan?: string;
  namaUniversitas?: string;
}

export const SETTINGS_KEY = "app_settings";
export const PROFILE_KEY = "user_profile";

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: true,
    reminderTimes: [60, 15, 5],
    sound: "default",
    academic: true,
    nonAcademic: true,
    scheduleChanges: true,
    scheduleConflicts: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "06:00",
    },
    snoozeDuration: 10,
  },

  activeSemester: "Semester 5",
  aiDetection: true,
};

export async function getSettings(): Promise<AppSettings> {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);

  if (!data) {
    return DEFAULT_SETTINGS;
  }

  const saved = JSON.parse(data);

  // Mendukung data pengaturan versi lama.
  const oldNotificationValue = saved.notifications;

  const notificationSettings =
    typeof oldNotificationValue === "boolean"
      ? {
          ...DEFAULT_SETTINGS.notifications,
          enabled: oldNotificationValue,
        }
      : {
          ...DEFAULT_SETTINGS.notifications,
          ...(oldNotificationValue ?? {}),
          quietHours: {
            ...DEFAULT_SETTINGS.notifications.quietHours,
            ...(oldNotificationValue?.quietHours ?? {}),
          },
        };

  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    notifications: notificationSettings,
  };
}

export async function saveSettings(
  settings: AppSettings
): Promise<void> {
  await AsyncStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings)
  );
}

export async function getUserProfile(): Promise<UserProfile> {
  const data = await AsyncStorage.getItem(PROFILE_KEY);

  if (!data) {
    return {
      name: "Mahasiswa",
      email: "",
      fakultas: "",
      jurusan: "",
      namaUniversitas: "",
    };
  }

  return JSON.parse(data);
}

export async function saveUserProfile(
  profile: UserProfile
): Promise<void> {
  await AsyncStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile)
  );
}

export async function resetSettings(): Promise<void> {
  await saveSettings(DEFAULT_SETTINGS);
}