import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type FinanceFilterType = "semua" | "pemasukan" | "pengeluaran";

interface FinanceFilterProps {
  filter: FinanceFilterType;
  onChangeFilter: (filter: FinanceFilterType) => void;
}

const FILTER_OPTIONS: FinanceFilterType[] = [
  "semua",
  "pemasukan",
  "pengeluaran",
];

export default function FinanceFilter({
  filter,
  onChangeFilter,
}: FinanceFilterProps) {
  return (
    <View className="flex-row gap-2 mb-4">
      {FILTER_OPTIONS.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => onChangeFilter(type)}
          className={`px-3.5 py-1.5 rounded-full border ${
            filter === type
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-blue-100"
          }`}
        >
          <Text
            className={`text-xs capitalize font-semibold ${
              filter === type ? "text-white" : "text-slate-600"
            }`}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}