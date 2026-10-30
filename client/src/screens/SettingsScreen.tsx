import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ProfileCard from "../components/settings/ProfileCard";
import SettingsMenu from "../components/settings/SettingsMenu";
import SettingsModals from "../components/settings/SettingsModals";

import { useApp } from "../context/AppContext";

import {
  type AppSettings,
  type UserProfile,
  type NotificationSettings,
  DEFAULT_SETTINGS,
  getSettings,
  getUserProfile,
  saveSettings,
  resetSettings as resetLocalSettings,
} from "../services/settingsService";

import {
  syncAllScheduleNotifications,
} from "../services/notificationService";

export default function SettingsScreen() {
  const { schedules } = useApp();

  const [settings, setSettings] =
    useState<AppSettings>(DEFAULT_SETTINGS);

  const [profile, setProfile] = useState<UserProfile>({
    name: "Mahasiswa",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const [semesterModal, setSemesterModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [notificationModal, setNotificationModal] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // =====================================
  // LOAD DATA
  // =====================================

  const loadData = async () => {
    try {
      const [
        savedSettings,
        savedProfile,
      ] = await Promise.all([
        getSettings(),
        getUserProfile(),
      ]);

      setSettings(savedSettings);
      setProfile(savedProfile);
    } catch (error) {
      console.error(
        "Gagal mengambil data:",
        error
      );

      Alert.alert(
        "Error",
        "Gagal memuat pengaturan aplikasi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UPDATE SETTINGS
  // =====================================

  const updateSettings = async (
    updatedSettings: AppSettings
  ) => {
    try {
      await saveSettings(updatedSettings);

      setSettings(updatedSettings);

      // Gunakan jadwal asli dari AppContext.
      await syncAllScheduleNotifications(
        schedules,
        updatedSettings.notifications
      );
    } catch (error) {
      console.error(
        "Gagal memperbarui pengaturan:",
        error
      );

      Alert.alert(
        "Error",
        "Gagal memperbarui pengaturan atau sinkronisasi notifikasi."
      );
    }
  };

  const handleNotifications = (value: boolean) => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        enabled: value,
      },
    });
  };

  const handleNotificationSettings = (
    notification: NotificationSettings
  ) => {
    updateSettings({
      ...settings,
      notifications: notification,
    });
  };

  const handleAI = (value: boolean) => {
    updateSettings({
      ...settings,
      aiDetection: value,
    });
  };

  const handleSemester = (semester: string) => {
    updateSettings({
      ...settings,
      activeSemester: semester,
    });

    setSemesterModal(false);
  };

  // =====================================
  // RESET SETTINGS
  // =====================================

  const handleReset = () => {
    Alert.alert(
      "Reset Pengaturan",
      "Apakah kamu yakin ingin mengembalikan semua pengaturan ke kondisi awal?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",

          onPress: async () => {
            try {
              await resetLocalSettings();

              setSettings(DEFAULT_SETTINGS);

              await syncAllScheduleNotifications(
                schedules,
                DEFAULT_SETTINGS.notifications
              );

              Alert.alert(
                "Berhasil",
                "Pengaturan berhasil direset."
              );
            } catch (error) {
              console.error(
                "Gagal reset:",
                error
              );

              Alert.alert(
                "Error",
                "Gagal mereset pengaturan."
              );
            }
          },
        },
      ]
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50/40 justify-center items-center">
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text className="text-slate-500 mt-3">
          Memuat pengaturan...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================
  // RENDER
  // =====================================

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100">
        <Text className="text-2xl font-bold text-slate-900">
          Pengaturan
        </Text>

        <Text className="text-xs text-blue-600 font-medium mt-0.5">
          Aplikasi & Profil Mahasiswa
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard profile={profile} />

        <SettingsMenu
          settings={settings}
          onToggleNotifications={handleNotifications}
          onToggleAI={handleAI}
          onOpenNotifications={() =>
            setNotificationModal(true)
          }
          onOpenSemester={() =>
            setSemesterModal(true)
          }
          onOpenPrivacy={() =>
            setPrivacyModal(true)
          }
          onOpenAbout={() =>
            setAboutModal(true)
          }
        />

        <TouchableOpacity
          onPress={handleReset}
          activeOpacity={0.7}
          className="bg-white border border-red-200 py-3.5 rounded-xl items-center mb-8"
        >
          <Text className="text-red-500 font-bold text-xs">
            Reset Pengaturan
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SettingsModals
        settings={settings}
        semesterVisible={semesterModal}
        privacyVisible={privacyModal}
        aboutVisible={aboutModal}
        notificationVisible={notificationModal}
        onCloseSemester={() =>
          setSemesterModal(false)
        }
        onClosePrivacy={() =>
          setPrivacyModal(false)
        }
        onCloseAbout={() =>
          setAboutModal(false)
        }
        onCloseNotification={() =>
          setNotificationModal(false)
        }
        onSelectSemester={handleSemester}
        onUpdateNotification={handleNotificationSettings}
      />
    </SafeAreaView>
  );
}