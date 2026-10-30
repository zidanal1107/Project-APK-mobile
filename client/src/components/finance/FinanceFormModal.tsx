import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { FinanceItem } from "../../context/AppContext";

import {
  KATEGORI_PEMASUKAN,
  KATEGORI_PENGELUARAN,
} from "../../constants/finance";

type TransactionType = "pemasukan" | "pengeluaran";

interface FinanceFormData {
  title: string;
  amount: number;
  type: TransactionType;
  kategori: string;
}

interface FinanceFormModalProps {
  visible: boolean;
  editingItem: FinanceItem | null;
  transactionType: TransactionType;
  onClose: () => void;
  onSave: (data: FinanceFormData) => Promise<void>;
}

export default function FinanceFormModal({
  visible,
  editingItem,
  transactionType,
  onClose,
  onSave,
}: FinanceFormModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [kategori, setKategori] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Mengatur nilai form ketika modal dibuka atau data edit berubah
  useEffect(() => {
    if (!visible) return;

    if (editingItem) {
      setTitle(editingItem.title);
      setAmount(editingItem.amount.toString());
      setKategori(
        editingItem.kategori ||
          (editingItem.type === "pemasukan"
            ? KATEGORI_PEMASUKAN[0]
            : KATEGORI_PENGELUARAN[0])
      );
    } else {
      setTitle("");
      setAmount("");
      setKategori(
        transactionType === "pemasukan"
          ? KATEGORI_PEMASUKAN[0]
          : KATEGORI_PENGELUARAN[0]
      );
    }
  }, [visible, editingItem, transactionType]);

  const activeKategoriList =
    transactionType === "pemasukan"
      ? KATEGORI_PEMASUKAN
      : KATEGORI_PENGELUARAN;

  const handleSave = async () => {
    const numericAmount = Number(amount);

    if (
      !title.trim() ||
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert(
        "Perhatian",
        "Keterangan dan nominal jumlah wajib diisi dengan benar!"
      );
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        title: title.trim(),
        amount: numericAmount,
        type: transactionType,
        kategori: kategori || "Lainnya",
      });

      onClose();
    } catch (error) {
      Alert.alert("Gagal", "Transaksi tidak berhasil disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-6 rounded-t-3xl border-t border-blue-100 max-h-[85%]">
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Judul */}
              <Text className="text-lg font-bold text-slate-900 mb-4 capitalize">
                {editingItem ? "Edit" : "Tambah"} {transactionType}
              </Text>

              {/* Keterangan */}
              <Text className="text-xs font-semibold text-slate-600 mb-1">
                Keterangan Transaksi
              </Text>

              <TextInput
                placeholder="cth: Kiriman Ortu / Beli Buku"
                value={title}
                onChangeText={setTitle}
                className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
              />

              {/* Nominal */}
              <Text className="text-xs font-semibold text-slate-600 mb-1">
                Nominal (Rp)
              </Text>

              <TextInput
                placeholder="cth: 50000"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
              />

              {/* Kategori */}
              <Text className="text-xs font-semibold text-slate-600 mb-1.5">
                Jenis / Kategori
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2 mb-5"
              >
                {activeKategoriList.map((kat) => (
                  <TouchableOpacity
                    key={kat}
                    onPress={() => setKategori(kat)}
                    className={`px-3 py-1.5 rounded-xl border ${
                      kategori === kat
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-blue-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        kategori === kat
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                    >
                      {kat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Tombol */}
              <View className="flex-row gap-3 mb-6">
                <TouchableOpacity
                  onPress={onClose}
                  disabled={isSaving}
                  className="flex-1 bg-slate-100 py-3 rounded-xl items-center"
                >
                  <Text className="font-bold text-slate-600 text-sm">
                    Batal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
                >
                  <Text className="font-bold text-white text-sm">
                    {isSaving
                      ? "Menyimpan..."
                      : editingItem
                        ? "Update"
                        : "Simpan"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}