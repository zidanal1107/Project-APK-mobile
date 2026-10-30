import React from "react";
import { View, Text } from "react-native";

export default function FinanceHeader() {
  return (
    <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100">
      <Text className="text-2xl font-bold text-slate-900">
        Catatan Keuangan
      </Text>

      <Text className="text-xs text-blue-600 font-medium mt-0.5">
        Pantau arus kas & kategori transaksi
      </Text>
    </View>
  );
}