// src/components/settings/ProfileCard.tsx

import React from "react";
import { View, Text } from "react-native";
import type { UserProfile } from "../../services/settingsService";

interface ProfileCardProps {
  profile: UserProfile;
}

export default function ProfileCard({
  profile,
}: ProfileCardProps) {
  const initial = profile.name?.charAt(0).toUpperCase() || "M";

  return (
    <View className="bg-white p-4 rounded-2xl mb-5 border border-blue-100 flex-row items-center shadow-sm">
      <View className="w-14 h-14 rounded-full bg-blue-600 justify-center items-center mr-4">
        <Text className="text-white text-xl font-bold">
          {initial}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-base font-bold text-slate-900">
          {profile.name || "Mahasiswa"}
        </Text>

        <Text className="text-xs text-blue-600 font-medium mt-0.5">
          {profile.email || "Email belum tersedia"}
        </Text>

        <Text className="text-xs text-slate-400 mt-0.5">
          {profile.jurusan || "Jurusan belum diatur"}
        </Text>
      </View>
    </View>
  );
}