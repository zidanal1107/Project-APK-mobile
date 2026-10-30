import React from "react";
import { View, Text } from "react-native";

interface BalanceCardProps {
  totalSaldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
}

export default function BalanceCard({
  totalSaldo,
  totalPemasukan,
  totalPengeluaran,
}: BalanceCardProps) {
  return (
    <View className="bg-blue-600 p-5 rounded-2xl mb-5 shadow-lg shadow-blue-500/20">
      <Text className="text-xs font-semibold text-blue-100">
        TOTAL SALDO
      </Text>

      <Text className="text-3xl font-extrabold text-white mt-1">
        Rp {totalSaldo.toLocaleString("id-ID")}
      </Text>

      <View className="flex-row justify-between mt-5 pt-4 border-t border-blue-500/50">
        <View>
          <Text className="text-[10px] text-blue-200 uppercase font-bold">
            Pemasukan
          </Text>

          <Text className="text-sm font-bold text-white mt-0.5">
            +Rp {totalPemasukan.toLocaleString("id-ID")}
          </Text>
        </View>

        <View className="w-[1px] bg-blue-400 h-8" />

        <View>
          <Text className="text-[10px] text-blue-200 uppercase font-bold">
            Pengeluaran
          </Text>

          <Text className="text-sm font-bold text-white mt-0.5">
            -Rp {totalPengeluaran.toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    </View>
  );
}