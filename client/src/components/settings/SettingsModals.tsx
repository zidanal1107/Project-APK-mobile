import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from "react-native";

import type {
  AppSettings,
  NotificationSettings,
} from "../../services/settingsService";

interface SettingsModalsProps {
  settings: AppSettings;

  semesterVisible: boolean;
  privacyVisible: boolean;
  aboutVisible: boolean;
  notificationVisible: boolean;

  onCloseSemester: () => void;
  onClosePrivacy: () => void;
  onCloseAbout: () => void;
  onCloseNotification: () => void;

  onSelectSemester: (semester: string) => void;

  onUpdateNotification: (
    notification: NotificationSettings
  ) => void;
}

const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const REMINDER_OPTIONS = [
  { label: "5 menit", value: 5 },
  { label: "10 menit", value: 10 },
  { label: "15 menit", value: 15 },
  { label: "30 menit", value: 30 },
  { label: "1 jam", value: 60 },
  { label: "2 jam", value: 120 },
];

const SNOOZE_OPTIONS = [5, 10, 15] as const;

export default function SettingsModals({
  settings,
  semesterVisible,
  privacyVisible,
  aboutVisible,
  notificationVisible,
  onCloseSemester,
  onClosePrivacy,
  onCloseAbout,
  onCloseNotification,
  onSelectSemester,
  onUpdateNotification,
}: SettingsModalsProps) {
  const notification = settings.notifications;

  const updateNotification = (
    changes: Partial<NotificationSettings>
  ) => {
    onUpdateNotification({
      ...notification,
      ...changes,
    });
  };

  const toggleReminder = (value: number) => {
    const exists = notification.reminderTimes.includes(value);

    const reminderTimes = exists
      ? notification.reminderTimes.filter(
          (item) => item !== value
        )
      : [...notification.reminderTimes, value];

    updateNotification({
      reminderTimes: reminderTimes.sort((a, b) => b - a),
    });
  };

  return (
    <>
      {/* MODAL SEMESTER */}
      <Modal
        visible={semesterVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseSemester}
      >
        <View className="flex-1 bg-black/40 justify-center px-6">
          <View className="bg-white rounded-2xl p-5">
            <Text className="text-lg font-bold text-slate-900 mb-1">
              Pilih Semester
            </Text>

            <Text className="text-xs text-slate-400 mb-4">
              Pilih semester perkuliahan saat ini.
            </Text>

            {SEMESTERS.map((semester) => (
              <TouchableOpacity
                key={semester}
                onPress={() => onSelectSemester(semester)}
                className="flex-row justify-between items-center py-3 border-b border-slate-100"
              >
                <Text
                  className={`text-sm ${
                    settings.activeSemester === semester
                      ? "text-blue-600 font-bold"
                      : "text-slate-700"
                  }`}
                >
                  {semester}
                </Text>

                {settings.activeSemester === semester && (
                  <Text className="text-blue-600 font-bold">
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={onCloseSemester}
              className="bg-slate-100 rounded-xl py-3 items-center mt-4"
            >
              <Text className="text-slate-600 font-semibold text-sm">
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PENGATURAN NOTIFIKASI */}
      <Modal
        visible={notificationVisible}
        transparent
        animationType="slide"
        onRequestClose={onCloseNotification}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%] px-5 pt-5 pb-8">
            <View className="flex-row justify-between items-center mb-5">
              <View>
                <Text className="text-xl font-bold text-slate-900">
                  Notifikasi Jadwal
                </Text>

                <Text className="text-xs text-slate-400 mt-1">
                  Atur pengingat aktivitasmu.
                </Text>
              </View>

              <TouchableOpacity
                onPress={onCloseNotification}
                className="bg-slate-100 w-9 h-9 rounded-full items-center justify-center"
              >
                <Text className="text-slate-600 font-bold">
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* AKTIFKAN NOTIFIKASI */}
              <View className="flex-row justify-between items-center py-4 border-b border-slate-100">
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-semibold text-slate-800">
                    Aktifkan notifikasi
                  </Text>

                  <Text className="text-xs text-slate-400 mt-1">
                    Terima pengingat sebelum jadwal dimulai.
                  </Text>
                </View>

                <Switch
                  value={notification.enabled}
                  onValueChange={(value) =>
                    updateNotification({ enabled: value })
                  }
                />
              </View>

              {/* WAKTU PENGINGAT */}
              <View className="mt-5">
                <Text className="text-sm font-bold text-slate-800">
                  Waktu Pengingat
                </Text>

                <Text className="text-xs text-slate-400 mt-1 mb-3">
                  Kamu bisa memilih lebih dari satu waktu.
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {REMINDER_OPTIONS.map((option) => {
                    const selected =
                      notification.reminderTimes.includes(
                        option.value
                      );

                    return (
                      <TouchableOpacity
                        key={option.value}
                        disabled={!notification.enabled}
                        onPress={() =>
                          toggleReminder(option.value)
                        }
                        className={`px-4 py-3 rounded-xl border ${
                          selected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-slate-200"
                        } ${
                          !notification.enabled
                            ? "opacity-40"
                            : ""
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            selected
                              ? "text-white"
                              : "text-slate-600"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {notification.reminderTimes.length === 0 && (
                  <Text className="text-xs text-red-500 mt-2">
                    Pilih minimal satu waktu pengingat.
                  </Text>
                )}
              </View>

              {/* JENIS JADWAL */}
              <View className="mt-6">
                <Text className="text-sm font-bold text-slate-800 mb-2">
                  Jenis Jadwal
                </Text>

                <View className="bg-slate-50 rounded-xl px-4">
                  <View className="flex-row justify-between items-center py-3 border-b border-slate-200">
                    <Text className="text-sm text-slate-700">
                      Jadwal Akademik
                    </Text>

                    <Switch
                      value={notification.academic}
                      disabled={!notification.enabled}
                      onValueChange={(value) =>
                        updateNotification({
                          academic: value,
                        })
                      }
                    />
                  </View>

                  <View className="flex-row justify-between items-center py-3">
                    <Text className="text-sm text-slate-700">
                      Jadwal Non-Akademik
                    </Text>

                    <Switch
                      value={notification.nonAcademic}
                      disabled={!notification.enabled}
                      onValueChange={(value) =>
                        updateNotification({
                          nonAcademic: value,
                        })
                      }
                    />
                  </View>
                </View>
              </View>

              {/* JAM TENANG */}
              <View className="mt-6">
                <Text className="text-sm font-bold text-slate-800">
                  Jam Tenang
                </Text>

                <Text className="text-xs text-slate-400 mt-1">
                  Pengingat yang jatuh pada jam ini tidak dijadwalkan.
                </Text>

                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-sm text-slate-700">
                    Aktifkan jam tenang
                  </Text>

                  <Switch
                    value={notification.quietHours.enabled}
                    disabled={!notification.enabled}
                    onValueChange={(value) =>
                      updateNotification({
                        quietHours: {
                          ...notification.quietHours,
                          enabled: value,
                        },
                      })
                    }
                  />
                </View>

                {notification.quietHours.enabled && (
                  <View className="flex-row gap-3">
                    <View className="flex-1 bg-slate-50 rounded-xl p-3">
                      <Text className="text-xs text-slate-400">
                        Mulai
                      </Text>

                      <Text className="text-base font-bold text-slate-800 mt-1">
                        {notification.quietHours.start}
                      </Text>
                    </View>

                    <View className="flex-1 bg-slate-50 rounded-xl p-3">
                      <Text className="text-xs text-slate-400">
                        Selesai
                      </Text>

                      <Text className="text-base font-bold text-slate-800 mt-1">
                        {notification.quietHours.end}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* SNOOZE */}
              <View className="mt-6">
                <Text className="text-sm font-bold text-slate-800">
                  Durasi Snooze
                </Text>

                <Text className="text-xs text-slate-400 mt-1 mb-3">
                  Lama penundaan pengingat.
                </Text>

                <View className="flex-row gap-2">
                  {SNOOZE_OPTIONS.map((value) => {
                    const selected =
                      notification.snoozeDuration === value;

                    return (
                      <TouchableOpacity
                        key={value}
                        disabled={!notification.enabled}
                        onPress={() =>
                          updateNotification({
                            snoozeDuration: value,
                          })
                        }
                        className={`flex-1 py-3 rounded-xl border items-center ${
                          selected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            selected
                              ? "text-white"
                              : "text-slate-600"
                          }`}
                        >
                          {value} menit
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* SUARA */}
              <View className="mt-6 mb-5">
                <Text className="text-sm font-bold text-slate-800">
                  Suara Notifikasi
                </Text>

                <Text className="text-xs text-slate-400 mt-1">
                  Saat ini menggunakan suara default perangkat.
                  Pilihan suara lainnya belum diaktifkan.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={onCloseNotification}
              className="bg-blue-600 rounded-xl py-4 items-center mt-3"
            >
              <Text className="text-white font-bold text-sm">
                Selesai
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PRIVASI */}
      <Modal
        visible={privacyVisible}
        transparent
        animationType="slide"
        onRequestClose={onClosePrivacy}
      >
        <View className="flex-1 bg-black/40 justify-center px-5">
          <View className="bg-white rounded-2xl p-5">
            <Text className="text-xl font-bold text-slate-900 mb-3">
              Kebijakan Privasi
            </Text>

            <ScrollView className="max-h-80">
              <Text className="text-sm text-slate-600 leading-6">
                A Day In Campus merupakan aplikasi untuk membantu
                mahasiswa mengelola jadwal perkuliahan dan keuangan
                personal.

                {"\n\n"}

                Informasi akun dan data pengguna digunakan untuk
                menyediakan fitur aplikasi.

                {"\n\n"}

                Data pengguna harus dilindungi dan tidak dibagikan
                kepada pihak lain tanpa dasar dan izin yang sesuai.

                {"\n\n"}

                Pengguna bertanggung jawab menjaga keamanan akun
                masing-masing.
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={onClosePrivacy}
              className="bg-blue-600 rounded-xl py-3 items-center mt-5"
            >
              <Text className="text-white font-bold text-sm">
                Mengerti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL TENTANG APLIKASI */}
      <Modal
        visible={aboutVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseAbout}
      >
        <View className="flex-1 bg-black/40 justify-center px-6">
          <View className="bg-white rounded-2xl p-6 items-center">
            <View className="w-16 h-16 bg-blue-600 rounded-2xl justify-center items-center mb-4">
              <Text className="text-white text-2xl font-bold">
                A
              </Text>
            </View>

            <Text className="text-xl font-bold text-slate-900">
              My Daily Campus
            </Text>

            <Text className="text-sm text-blue-600 mt-1">
              Version 1.0.0
            </Text>

            <Text className="text-xs text-slate-400 text-center mt-3">
              Aplikasi manajemen aktivitas dan keuangan mahasiswa.
            </Text>

            <TouchableOpacity
              onPress={onCloseAbout}
              className="bg-blue-600 rounded-xl py-3 items-center w-full mt-5"
            >
              <Text className="text-white font-bold text-sm">
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}