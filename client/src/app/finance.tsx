// src/app/finance.tsx

import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    title: "Uang Saku",
    category: "Pemasukan",
    amount: 500000,
    type: "income",
    date: "Hari ini",
  },
  {
    id: 2,
    title: "Makan Siang",
    category: "Makanan",
    amount: 15000,
    type: "expense",
    date: "Hari ini",
  },
  {
    id: 3,
    title: "Transportasi",
    category: "Transportasi",
    amount: 10000,
    type: "expense",
    date: "Kemarin",
  },
  {
    id: 4,
    title: "Buku Kuliah",
    category: "Pendidikan",
    amount: 45000,
    type: "expense",
    date: "Kemarin",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FinanceScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    INITIAL_TRANSACTIONS,
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [type, setType] = useState<TransactionType>("expense");

  // Menghitung total pemasukan
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  // Menghitung total pengeluaran
  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  // Menghitung saldo
  const balance = totalIncome - totalExpense;

  // Menambahkan transaksi
  const handleAddTransaction = () => {
    const parsedAmount = Number(amount);

    if (!title.trim()) {
      Alert.alert("Validasi", "Nama transaksi wajib diisi.");
      return;
    }

    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Validasi", "Masukkan nominal yang valid.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      title: title.trim(),
      category: type === "income" ? "Pemasukan" : category,
      amount: parsedAmount,
      type,
      date: "Hari ini",
    };

    setTransactions((previous) => [newTransaction, ...previous]);

    setTitle("");
    setAmount("");
    setCategory("Makanan");
    setType("expense");
    setModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Personal Finance</Text>
          <Text style={styles.pageTitle}>Manajemen Keuangan</Text>
          <Text style={styles.subtitle}>
            Pantau pemasukan dan pengeluaranmu.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>💰</Text>
        </View>
      </View>

      {/* Saldo */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Saldo</Text>

        <Text style={styles.balanceAmount}>
          {formatCurrency(balance)}
        </Text>

        <Text style={styles.balanceDescription}>
          Saldo berdasarkan transaksi yang tercatat
        </Text>
      </View>

      {/* Pemasukan dan pengeluaran */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconIncome}>
            <Text style={styles.summaryEmoji}>↙</Text>
          </View>

          <Text style={styles.summaryLabel}>Pemasukan</Text>

          <Text style={styles.incomeAmount}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconExpense}>
            <Text style={styles.summaryEmoji}>↗</Text>
          </View>

          <Text style={styles.summaryLabel}>Pengeluaran</Text>

          <Text style={styles.expenseAmount}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>

      {/* Tombol tambah transaksi */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>＋ Tambah Transaksi</Text>
      </Pressable>

      {/* Daftar transaksi */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>

        <Text style={styles.transactionCount}>
          {transactions.length} transaksi
        </Text>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🧾</Text>
          <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
          <Text style={styles.emptyDescription}>
            Tambahkan transaksi pertamamu untuk mulai mencatat keuangan.
          </Text>
        </View>
      ) : (
        transactions.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            <View
              style={[
                styles.transactionIcon,
                item.type === "income"
                  ? styles.transactionIconIncome
                  : styles.transactionIconExpense,
              ]}
            >
              <Text style={styles.transactionEmoji}>
                {item.type === "income" ? "💵" : "🛍️"}
              </Text>
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionCategory}>
                {item.category} · {item.date}
              </Text>
            </View>

            <Text
              style={[
                styles.transactionAmount,
                item.type === "income"
                  ? styles.incomeAmount
                  : styles.expenseAmount,
              ]}
            >
              {item.type === "income" ? "+" : "-"}
              {formatCurrency(item.amount)}
            </Text>
          </View>
        ))
      )}

      {/* Modal tambah transaksi */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Transaksi</Text>

              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Jenis Transaksi</Text>

            <View style={styles.typeContainer}>
              <Pressable
                style={[
                  styles.typeButton,
                  type === "expense" && styles.typeButtonActive,
                ]}
                onPress={() => setType("expense")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "expense" && styles.typeButtonTextActive,
                  ]}
                >
                  Pengeluaran
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.typeButton,
                  type === "income" && styles.typeButtonActive,
                ]}
                onPress={() => setType("income")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "income" && styles.typeButtonTextActive,
                  ]}
                >
                  Pemasukan
                </Text>
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Nama Transaksi</Text>

            <TextInput
              style={styles.input}
              placeholder="Contoh: Makan siang"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Nominal (Rupiah)</Text>

            <TextInput
              style={styles.input}
              placeholder="Contoh: 15000"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
            />

            {type === "expense" && (
              <>
                <Text style={styles.inputLabel}>Kategori</Text>

                <View style={styles.categoryContainer}>
                  {[
                    "Makanan",
                    "Transportasi",
                    "Pendidikan",
                    "Hiburan",
                    "Lainnya",
                  ].map((item) => (
                    <Pressable
                      key={item}
                      style={[
                        styles.categoryButton,
                        category === item && styles.categoryButtonActive,
                      ]}
                      onPress={() => setCategory(item)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          category === item &&
                            styles.categoryButtonTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleAddTransaction}
            >
              <Text style={styles.saveButtonText}>Simpan Transaksi</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 5,
  },
  pageTitle: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 6,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  headerEmoji: {
    fontSize: 24,
  },
  balanceCard: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#DBEAFE",
    fontSize: 14,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "bold",
    marginTop: 10,
  },
  balanceDescription: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 10,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryIconIncome: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryIconExpense: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryEmoji: {
    fontSize: 20,
    color: "#0F172A",
    fontWeight: "bold",
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 8,
  },
  incomeAmount: {
    color: "#16A34A",
    fontWeight: "bold",
  },
  expenseAmount: {
    color: "#DC2626",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 28,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionCount: {
    color: "#64748B",
    fontSize: 12,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionIconIncome: {
    backgroundColor: "#DCFCE7",
  },
  transactionIconExpense: {
    backgroundColor: "#F1F5F9",
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  transactionTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionCategory: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyDescription: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    color: "#64748B",
    fontSize: 20,
    padding: 4,
  },
  inputLabel: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },
  typeButtonText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#1D4ED8",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  categoryButtonActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },
  categoryButtonText: {
    color: "#64748B",
    fontSize: 12,
  },
  categoryButtonTextActive: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});