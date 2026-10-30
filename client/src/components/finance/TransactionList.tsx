import React from "react";
import { View, Text } from "react-native";
import { FinanceItem } from "../../context/AppContext";
import TransactionItem from "./TransactionItem";

interface TransactionListProps {
  transactions: FinanceItem[];
  onEdit: (item: FinanceItem) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <View>
      <Text className="text-sm font-bold text-slate-800 mb-3">
        Riwayat Transaksi
      </Text>

      {transactions.length === 0 ? (
        <View className="p-8 items-center justify-center">
          <Text className="text-slate-400 text-sm">
            Belum ada transaksi tersimpan.
          </Text>
        </View>
      ) : (
        transactions.map((item) => (
          <TransactionItem
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </View>
  );
}