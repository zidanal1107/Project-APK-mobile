import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";

import type {
  AppSettings,
} from "../../services/settingsService";

interface SettingsMenuProps {
  settings: AppSettings;
  onToggleNotifications: (value: boolean) => void;
  onToggleAI: (value: boolean) => void;
  onOpenNotifications: () => void;
  onOpenSemester: () => void;
  onOpenPrivacy: () => void;
  onOpenAbout: () => void;
}

export default function SettingsMenu({
  settings,
  onToggleNotifications,
  onToggleAI,
  onOpenNotifications,
  onOpenSemester,
  onOpenPrivacy,
  onOpenAbout,
}: SettingsMenuProps) {
  return (
    <>
      <Text className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">
        PREFERENSI APLIKASI
      </Text>

      <View className="bg-white rounded-2xl border border-blue-100 overflow-hidden mb-5 shadow-sm">

        <View className="p-4 flex-row justify-between items-center border-b border-blue-50">
          <View className="flex-1 mr-3">
            <Text className="text-sm font-semibold text-slate-800">
              🔔 Notifikasi Jadwal
            </Text>

            <Text className="text-xs text-slate-400 mt-1">
              {settings.notifications.enabled
                ? "Pengingat jadwal sedang aktif."
                : "Pengingat jadwal dinonaktifkan."}
            </Text>
          </View>

          <Switch
            value={settings.notifications.enabled}
            onValueChange={onToggleNotifications}
            trackColor={{
              false: "#CBD5E1",
              true: "#93C5FD",
            }}
            thumbColor={
              settings.notifications.enabled
                ? "#2563EB"
                : "#F8FAFC"
            }
          />
        </View>

        <TouchableOpacity
          onPress={onOpenNotifications}
          activeOpacity={0.7}
          className="p-4 flex-row justify-between items-center border-b border-blue-50"
        >
          <View>
            <Text className="text-sm font-semibold text-slate-800">
              ⚙️ Pengaturan Pengingat
            </Text>

            <Text className="text-xs text-slate-400 mt-1">
              Atur waktu dan jenis pengingat.
            </Text>
          </View>

          <Text className="text-xs font-bold text-blue-600">
            Atur ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSemester}
          activeOpacity={0.7}
          className="p-4 flex-row justify-between items-center border-b border-blue-50"
        >
          <View>
            <Text className="text-sm font-semibold text-slate-800">
              🎓 Semester Aktif
            </Text>

            <Text className="text-xs text-slate-400 mt-1">
              Atur semester perkuliahan.
            </Text>
          </View>

          <Text className="text-xs font-bold text-blue-600">
            {settings.activeSemester} ›
          </Text>
        </TouchableOpacity>

        <View className="p-4 flex-row justify-between items-center">
          <View className="flex-1 mr-3">
            <Text className="text-sm font-semibold text-slate-800">
              🤖 Deteksi Otomatis AI
            </Text>

            <Text className="text-xs text-slate-400 mt-1">
              Preferensi fitur AI aplikasi.
            </Text>
          </View>

          <Switch
            value={settings.aiDetection}
            onValueChange={onToggleAI}
            trackColor={{
              false: "#CBD5E1",
              true: "#93C5FD",
            }}
            thumbColor={
              settings.aiDetection
                ? "#2563EB"
                : "#F8FAFC"
            }
          />
        </View>
      </View>

      <Text className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">
        TENTANG
      </Text>

      <View className="bg-white rounded-2xl border border-blue-100 overflow-hidden mb-5 shadow-sm">
        <TouchableOpacity
          onPress={onOpenAbout}
          activeOpacity={0.7}
          className="p-4 flex-row justify-between items-center border-b border-blue-50"
        >
          <Text className="text-sm font-semibold text-slate-800">
            📱 Versi Aplikasi
          </Text>

          <Text className="text-xs text-slate-400">
            1.0.0 ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenPrivacy}
          activeOpacity={0.7}
          className="p-4 flex-row justify-between items-center"
        >
          <Text className="text-sm font-semibold text-slate-800">
            ℹ️ Kebijakan Privasi
          </Text>

          <Text className="text-xs font-bold text-blue-600">
            Lihat ›
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}