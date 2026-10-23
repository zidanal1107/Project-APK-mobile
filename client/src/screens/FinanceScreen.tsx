import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useApp, FinanceItem } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function FinanceScreen() {
  const { finances, addFinance, updateFinance, deleteFinance } = useApp();
  const [filter, setFilter] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FinanceItem | null>(null);
  const [transactionType, setTransactionType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const openAddModal = (type: 'pemasukan' | 'pengeluaran') => {
    setEditingItem(null);
    setTransactionType(type);
    setTitle('');
    setAmount('');
    setModalVisible(true);
  };

  const openEditModal = (item: FinanceItem) => {
    setEditingItem(item);
    setTransactionType(item.type);
    setTitle(item.title);
    setAmount(item.amount.toString());
    setModalVisible(true);
  };

  const handleSave = async () => {
    const numericAmount = parseInt(amount, 10);
    if (!title.trim() || isNaN(numericAmount) || numericAmount <= 0) return;

    if (editingItem) {
      await updateFinance(editingItem.id, {
        title,
        amount: numericAmount,
        type: transactionType,
        date: editingItem.date,
      });
    } else {
      await addFinance({
        title,
        amount: numericAmount,
        type: transactionType,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      });
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Transaksi', 'Apakah kamu yakin ingin menghapus catatan transaksi ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteFinance(id) },
    ]);
  };

  const totalPemasukan = finances
    .filter((f) => f.type === 'pemasukan')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPengeluaran = finances
    .filter((f) => f.type === 'pengeluaran')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaldo = totalPemasukan - totalPengeluaran;

  const filteredFinances = finances.filter((f) => {
    if (filter === 'pemasukan') return f.type === 'pemasukan';
    if (filter === 'pengeluaran') return f.type === 'pengeluaran';
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100">
        <Text className="text-2xl font-bold text-slate-900">Catatan Keuangan</Text>
        <Text className="text-xs text-blue-600 font-medium mt-0.5">
          Pantau arus kas mahasiswa kamu
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Card Saldo Utama */}
        <View className="bg-blue-600 p-5 rounded-2xl mb-5 shadow-lg shadow-blue-500/20">
          <Text className="text-xs font-semibold text-blue-100">TOTAL SALDO</Text>
          <Text className="text-3xl font-extrabold text-white mt-1">
            Rp {totalSaldo.toLocaleString('id-ID')}
          </Text>

          <View className="flex-row justify-between mt-5 pt-4 border-t border-blue-500/50">
            <View>
              <Text className="text-[10px] text-blue-200 uppercase font-bold">Pemasukan</Text>
              <Text className="text-sm font-bold text-white mt-0.5">
                +Rp {totalPemasukan.toLocaleString('id-ID')}
              </Text>
            </View>
            <View className="w-[1px] bg-blue-400 h-8" />
            <View>
              <Text className="text-[10px] text-blue-200 uppercase font-bold">Pengeluaran</Text>
              <Text className="text-sm font-bold text-white mt-0.5">
                -Rp {totalPengeluaran.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity
            onPress={() => openAddModal('pemasukan')}
            className="flex-1 bg-blue-600 py-3 rounded-xl items-center active:bg-blue-700 shadow-sm"
          >
            <Text className="text-white font-bold text-xs">+ Pemasukan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openAddModal('pengeluaran')}
            className="flex-1 bg-white border border-blue-600 py-3 rounded-xl items-center active:bg-blue-50 shadow-sm"
          >
            <Text className="text-blue-600 font-bold text-xs">- Pengeluaran</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View className="flex-row gap-2 mb-4">
          {(['semua', 'pemasukan', 'pengeluaran'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type)}
              className={`px-3.5 py-1.5 rounded-full border ${
                filter === type ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-100'
              }`}
            >
              <Text
                className={`text-xs capitalize font-semibold ${
                  filter === type ? 'text-white' : 'text-slate-600'
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Riwayat Transaksi */}
        <Text className="text-sm font-bold text-slate-800 mb-3">Riwayat Transaksi</Text>

        {filteredFinances.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Text className="text-slate-400 text-sm">Belum ada transaksi tersimpan.</Text>
          </View>
        ) : (
          filteredFinances.map((item) => (
            <View
              key={item.id}
              className="bg-white p-4 rounded-xl mb-2.5 border border-blue-100 flex-row justify-between items-center"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  className={`w-10 h-10 rounded-xl justify-center items-center mr-3 ${
                    item.type === 'pemasukan' ? 'bg-blue-100' : 'bg-slate-100'
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      item.type === 'pemasukan' ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    {item.type === 'pemasukan' ? '↓' : '↑'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900">{item.title}</Text>
                  <Text className="text-[11px] text-slate-400 mt-0.5">{item.date}</Text>
                </View>
              </View>

              <View className="items-end gap-1">
                <Text
                  className={`text-sm font-bold ${
                    item.type === 'pemasukan' ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  {item.type === 'pemasukan' ? '+' : '-'}Rp {item.amount.toLocaleString('id-ID')}
                </Text>
                <View className="flex-row gap-2 mt-0.5">
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons name="pencil-outline" size={16} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-6 rounded-t-3xl border-t border-blue-100">
            <Text className="text-lg font-bold text-slate-900 mb-4 capitalize">
              {editingItem ? 'Edit' : 'Tambah'} {transactionType}
            </Text>

            <TextInput
              placeholder="Keterangan (cth: Kiriman Ortu / Beli Buku)"
              value={title}
              onChangeText={setTitle}
              className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-3 text-sm"
            />
            <TextInput
              placeholder="Jumlah Nominal (cth: 500000)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 mb-5 text-sm"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-slate-100 py-3 rounded-xl items-center"
              >
                <Text className="font-bold text-slate-600 text-sm">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
              >
                <Text className="font-bold text-white text-sm">
                  {editingItem ? 'Update' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}