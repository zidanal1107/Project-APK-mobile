import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FinanceItem } from "../../context/AppContext";

interface TransactionItemProps {
  item: FinanceItem;
  onEdit: (item: FinanceItem) => void;
  onDelete: (id: string) => void;
}

export default function TransactionItem({
  item,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = item.type === "pemasukan";

  return (
    <View className="bg-white p-4 rounded-xl mb-2.5 border border-blue-100 flex-row justify-between items-center">
      {/* Informasi Transaksi */}
      <View className="flex-row items-center flex-1 mr-2">
        <View
          className={`w-10 h-10 rounded-xl justify-center items-center mr-3 ${
            isIncome ? "bg-blue-100" : "bg-slate-100"
          }`}
        >
          <Text
            className={`font-bold ${
              isIncome ? "text-blue-600" : "text-slate-600"
            }`}
          >
            {isIncome ? "↓" : "↑"}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-sm font-bold text-slate-900">
            {item.title}
          </Text>

          <View className="flex-row items-center gap-2 mt-0.5">
            <Text className="text-[11px] text-slate-400">
              {item.date}
            </Text>

            {item.kategori ? (
              <Text className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.2 rounded-md">
                {item.kategori}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Nominal dan Aksi */}
      <View className="items-end gap-1">
        <Text
          className={`text-sm font-bold ${
            isIncome ? "text-blue-600" : "text-slate-700"
          }`}
        >
          {isIncome ? "+" : "-"}Rp{" "}
          {item.amount.toLocaleString("id-ID")}
        </Text>

        <View className="flex-row gap-2 mt-0.5">
          <TouchableOpacity onPress={() => onEdit(item)}>
            <Ionicons
              name="pencil-outline"
              size={16}
              color="#2563EB"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons
              name="trash-outline"
              size={16}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}