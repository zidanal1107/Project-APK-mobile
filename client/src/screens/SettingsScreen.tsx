import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ProfileCard from "../components/settings/ProfileCard";
import SettingsMenu from "../components/settings/SettingsMenu";
import SettingsModals from "../components/settings/SettingsModals";

import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

import {
  type AppSettings,
  type UserProfile,
  type NotificationSettings,
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
  resetSettings as resetLocalSettings,
} from "../services/settingsService";

import { syncAllScheduleNotifications } from "../services/notificationService";

type EditableProfileField =
  | "name"
  | "email"
  | "jurusan"
  | "namaUniversitas";

export default function SettingsScreen() {
  const { schedules } = useApp();
  const { user, logout } = useAuth();

  // =====================================
  // STATE
  // =====================================

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id?.toString(),
    name: user?.name || "Mahasiswa",
    email: user?.email || "",
    fakultas: "",
    jurusan: "",
    namaUniversitas: "",
  });

  const [editProfileModal, setEditProfileModal] = useState(false);

  const [editProfile, setEditProfile] = useState<UserProfile>({
    ...profile,
  });

  const profileFields: {
    label: string;
    key: EditableProfileField;
  }[] = [
    { label: "Nama", key: "name" },
    { label: "Email", key: "email" },
    { label: "Jurusan", key: "jurusan" },
    { label: "Nama Universitas", key: "namaUniversitas" },
  ];

  const [loading, setLoading] = useState(true);

  const [semesterModal, setSemesterModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);

  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSettings = await getSettings();

        setSettings(savedSettings);

        setProfile((previousProfile) => ({
          ...previousProfile,
          id: user?.id?.toString(),
          name: user?.name || "Mahasiswa",
          email: user?.email || "",
        }));
      } catch (error) {
        console.error("Gagal mengambil data:", error);

        Alert.alert("Error", "Gagal memuat pengaturan aplikasi.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, user?.name, user?.email]);

  // =====================================
  // EDIT PROFILE
  // =====================================

  const handleOpenEditProfile = () => {
    setEditProfile({ ...profile });
    setEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    if (!editProfile.name?.trim()) {
      Alert.alert("Validasi", "Nama tidak boleh kosong.");
      return;
    }

    if (!editProfile.email?.trim()) {
      Alert.alert("Validasi", "Email tidak boleh kosong.");
      return;
    }

    setProfile({
      ...editProfile,
      name: editProfile.name.trim(),
      email: editProfile.email.trim(),
    });

    setEditProfileModal(false);

    Alert.alert("Berhasil", "Profil berhasil diperbarui.");
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah kamu yakin ingin keluar dari akun?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout gagal:", error);

            Alert.alert("Error", "Gagal logout. Silakan coba lagi.");
          }
        },
      },
    ]);
  };

  // =====================================
  // UPDATE SETTINGS
  // =====================================

  const updateSettings = async (updatedSettings: AppSettings) => {
    try {
      await saveSettings(updatedSettings);

      setSettings(updatedSettings);

      await syncAllScheduleNotifications(
        schedules,
        updatedSettings.notifications,
      );
    } catch (error) {
      console.error("Gagal memperbarui pengaturan:", error);

      Alert.alert(
        "Error",
        "Gagal memperbarui pengaturan atau sinkronisasi notifikasi.",
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
    notification: NotificationSettings,
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
                DEFAULT_SETTINGS.notifications,
              );

              Alert.alert("Berhasil", "Pengaturan berhasil direset.");
            } catch (error) {
              console.error("Gagal reset:", error);

              Alert.alert("Error", "Gagal mereset pengaturan.");
            }
          },
        },
      ],
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-blue-50/40 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />

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
      {/* Header */}
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
        {/* Profil akun */}
        <ProfileCard profile={profile} />

        {/* Edit Profil */}
        <TouchableOpacity
          onPress={handleOpenEditProfile}
          activeOpacity={0.7}
          className="bg-blue-600 rounded-xl py-3 mt-3 mb-4"
        >
          <Text className="text-white text-center font-semibold">
            Edit Profil
          </Text>
        </TouchableOpacity>

        {/* Menu pengaturan */}
        <SettingsMenu
          settings={settings}
          onToggleNotifications={handleNotifications}
          onToggleAI={handleAI}
          onOpenNotifications={() => setNotificationModal(true)}
          onOpenSemester={() => setSemesterModal(true)}
          onOpenPrivacy={() => setPrivacyModal(true)}
          onOpenAbout={() => setAboutModal(true)}
        />

        {/* Reset Settings */}
        <TouchableOpacity
          onPress={handleReset}
          activeOpacity={0.7}
          className="bg-white border border-red-200 py-3.5 rounded-xl items-center mb-3"
        >
          <Text className="text-red-500 font-bold text-xs">
            Reset Pengaturan
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          className="bg-red-50 border border-red-200 py-3.5 rounded-xl items-center mb-8"
        >
          <Text className="text-red-600 font-bold text-xs">
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Edit Profil */}
      <Modal
        visible={editProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditProfileModal(false)}
      >
        <View className="flex-1 justify-center bg-black/40 px-5">
          <View className="bg-white rounded-2xl p-5">
            <Text className="text-xl font-bold text-slate-900 mb-4">
              Edit Profil
            </Text>

            {profileFields.map((field) => (
              <View key={field.key} className="mb-3">
                <Text className="text-sm font-semibold text-slate-700 mb-1">
                  {field.label}
                </Text>

                <TextInput
                  value={editProfile[field.key] ?? ""}
                  onChangeText={(value) =>
                    setEditProfile((previousProfile) => ({
                      ...previousProfile,
                      [field.key]: value,
                    }))
                  }
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                  autoCapitalize={
                    field.key === "email" ? "none" : "words"
                  }
                  keyboardType={
                    field.key === "email" ? "email-address" : "default"
                  }
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900"
                />
              </View>
            ))}

            {/* Tombol */}
            <View className="flex-row justify-end gap-3 mt-3">
              <TouchableOpacity
                onPress={() => setEditProfileModal(false)}
                className="px-4 py-3 rounded-lg bg-slate-100"
              >
                <Text className="font-semibold text-slate-600">
                  Batal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                className="px-4 py-3 rounded-lg bg-blue-600"
              >
                <Text className="font-semibold text-white">
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modals pengaturan yang sudah ada */}
      <SettingsModals
        settings={settings}
        semesterVisible={semesterModal}
        privacyVisible={privacyModal}
        aboutVisible={aboutModal}
        notificationVisible={notificationModal}
        onCloseSemester={() => setSemesterModal(false)}
        onClosePrivacy={() => setPrivacyModal(false)}
        onCloseAbout={() => setAboutModal(false)}
        onCloseNotification={() => setNotificationModal(false)}
        onSelectSemester={handleSemester}
        onUpdateNotification={handleNotificationSettings}
      />
    </SafeAreaView>
  );
}