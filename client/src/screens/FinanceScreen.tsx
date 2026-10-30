import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useApp, type FinanceItem } from "../context/AppContext";

import BalanceCard from "../components/finance/BalanceCard";
import FinanceActions from "../components/finance/FinanceActions";
import FinanceFilter from "../components/finance/FinanceFilter";
import TransactionList from "../components/finance/TransactionList";
import FinanceFormModal from "../components/finance/FinanceFormModal";
import FinanceHeader from "../components/finance/FinanceHeader";

type TransactionType = "semua" | "pemasukan" | "pengeluaran";

export default function FinanceScreen() {
  const {
    finances,
    addFinance,
    updateFinance,
    deleteFinance,
  } = useApp();

  // Filter State
  const [filter, setFilter] = useState<TransactionType>("semua");

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FinanceItem | null>(null);

  const [transactionType, setTransactionType] = useState<
    "pemasukan" | "pengeluaran"
  >("pemasukan");

  // Membuka modal tambah transaksi
  const openAddModal = (type: "pemasukan" | "pengeluaran") => {
    setEditingItem(null);
    setTransactionType(type);
    setModalVisible(true);
  };

  // Membuka modal edit transaksi
  const openEditModal = (item: FinanceItem) => {
    setEditingItem(item);
    setTransactionType(item.type);
    setModalVisible(true);
  };

  // Menyimpan transaksi baru atau memperbarui transaksi lama
  const handleSaveFinance = async (data: {
    title: string;
    amount: number;
    type: "pemasukan" | "pengeluaran";
    kategori: string;
  }) => {
    if (editingItem) {
      await updateFinance(editingItem.id, {
        ...data,
        date: editingItem.date,
      });
    } else {
      await addFinance({
        ...data,
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
      });
    }
  };

  // Menghapus transaksi
  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Apakah kamu yakin ingin menghapus catatan transaksi ini?"
        )
      ) {
        deleteFinance(id);
      }
    } else {
      Alert.alert(
        "Hapus Transaksi",
        "Apakah kamu yakin ingin menghapus catatan transaksi ini?",
        [
          {
            text: "Batal",
            style: "cancel",
          },
          {
            text: "Hapus",
            style: "destructive",
            onPress: () => deleteFinance(id),
          },
        ]
      );
    }
  };

  // Menghitung total pemasukan
  const totalPemasukan = finances
    .filter((item) => item.type === "pemasukan")
    .reduce((total, item) => total + item.amount, 0);

  // Menghitung total pengeluaran
  const totalPengeluaran = finances
    .filter((item) => item.type === "pengeluaran")
    .reduce((total, item) => total + item.amount, 0);

  // Menghitung saldo
  const totalSaldo = totalPemasukan - totalPengeluaran;

  // Memfilter transaksi
  const filteredFinances = finances.filter((item) => {
    if (filter === "pemasukan") {
      return item.type === "pemasukan";
    }

    if (filter === "pengeluaran") {
      return item.type === "pengeluaran";
    }

    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      {/* Header */}
      <FinanceHeader />

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Saldo */}
        <BalanceCard
          totalSaldo={totalSaldo}
          totalPemasukan={totalPemasukan}
          totalPengeluaran={totalPengeluaran}
        />

        {/* Tombol Tambah Transaksi */}
        <FinanceActions
          onAddIncome={() => openAddModal("pemasukan")}
          onAddExpense={() => openAddModal("pengeluaran")}
        />

        {/* Filter Transaksi */}
        <FinanceFilter
          filter={filter}
          onChangeFilter={setFilter}
        />

        {/* Daftar Transaksi */}
        <TransactionList
          transactions={filteredFinances}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </ScrollView>

      {/* Modal Tambah dan Edit Transaksi */}
      <FinanceFormModal
        visible={modalVisible}
        editingItem={editingItem}
        transactionType={transactionType}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveFinance}
      />
    </SafeAreaView>
  );
}