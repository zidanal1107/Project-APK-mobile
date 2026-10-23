import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function FinanceScreen() {
  const [filter, setFilter] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100">
        <Text className="text-2xl font-bold text-slate-900">Catatan Keuangan</Text>
        <Text className="text-xs text-blue-600 font-medium mt-0.5">Pantau arus kas mahasiswa kamu</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Card Saldo Utama */}
        <View className="bg-blue-600 p-5 rounded-2xl mb-5 shadow-lg shadow-blue-500/20">
          <Text className="text-xs font-semibold text-blue-100">TOTAL SALDO</Text>
          <Text className="text-3xl font-extrabold text-white mt-1">Rp 1.450.000</Text>

          <View className="flex-row justify-between mt-5 pt-4 border-t border-blue-500/50">
            <View>
              <Text className="text-[10px] text-blue-200 uppercase font-bold">Pemasukan</Text>
              <Text className="text-sm font-bold text-white mt-0.5">+Rp 2.000.000</Text>
            </View>
            <View className="w-[1px] bg-blue-400 h-8" />
            <View>
              <Text className="text-[10px] text-blue-200 uppercase font-bold">Pengeluaran</Text>
              <Text className="text-sm font-bold text-white mt-0.5">-Rp 550.000</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-5">
          <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-xl items-center active:bg-blue-700 hover:bg-blue-700 shadow-sm">
            <Text className="text-white font-bold text-xs">+ Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white border border-blue-600 py-3 rounded-xl items-center active:bg-blue-50 hover:bg-blue-50 shadow-sm">
            <Text className="text-blue-600 font-bold text-xs">- Pengeluaran</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View className="flex-row gap-2 mb-4">
          {(['semua', 'pemasukan', 'pengeluaran'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type)}
              className={`px-3.5 py-1.5 rounded-full border active:bg-blue-600 hover:bg-blue-600 ${
                filter === type
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-blue-100'
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

        <TouchableOpacity className="bg-white p-4 rounded-xl mb-2.5 border border-blue-100 flex-row justify-between items-center active:bg-blue-50 hover:bg-blue-50">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-blue-100 justify-center items-center mr-3">
              <Text className="text-blue-600 font-bold">↓</Text>
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-900">Kiriman Bulanan Orang Tua</Text>
              <Text className="text-[11px] text-slate-400 mt-0.5">1 Okt 2026 • Transfer</Text>
            </View>
          </View>
          <Text className="text-sm font-bold text-blue-600">+Rp 2.000.000</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl mb-2.5 border border-blue-100 flex-row justify-between items-center active:bg-blue-50 hover:bg-blue-50">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-slate-100 justify-center items-center mr-3">
              <Text className="text-slate-600 font-bold">↑</Text>
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-900">Beli Buku Praktikum</Text>
              <Text className="text-[11px] text-slate-400 mt-0.5">3 Okt 2026 • Edukasi</Text>
            </View>
          </View>
          <Text className="text-sm font-bold text-slate-700">-Rp 150.000</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl mb-8 border border-blue-100 flex-row justify-between items-center active:bg-blue-50 hover:bg-blue-50">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-slate-100 justify-center items-center mr-3">
              <Text className="text-slate-600 font-bold">↑</Text>
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-900">Bayar UKT Semester 5</Text>
              <Text className="text-[11px] text-slate-400 mt-0.5">5 Okt 2026 • Kuliah</Text>
            </View>
          </View>
          <Text className="text-sm font-bold text-slate-700">-Rp 400.000</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}