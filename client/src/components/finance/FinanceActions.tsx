import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface FinanceActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export default function FinanceActions({
  onAddIncome,
  onAddExpense,
}: FinanceActionsProps) {
  return (
    <View className="flex-row gap-3 mb-5">
      {/* Tombol Pemasukan */}
      <TouchableOpacity
        onPress={onAddIncome}
        className="flex-1 bg-blue-600 py-3 rounded-xl items-center active:bg-blue-700 shadow-sm"
      >
        <Text className="text-white font-bold text-xs">
          + Pemasukan
        </Text>
      </TouchableOpacity>

      {/* Tombol Pengeluaran */}
      <TouchableOpacity
        onPress={onAddExpense}
        className="flex-1 bg-white border border-blue-600 py-3 rounded-xl items-center active:bg-blue-50 shadow-sm"
      >
        <Text className="text-blue-600 font-bold text-xs">
          - Pengeluaran
        </Text>
      </TouchableOpacity>
    </View>
  );
}