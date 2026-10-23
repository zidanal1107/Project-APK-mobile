import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100">
        <Text className="text-2xl font-bold text-slate-900">Pengaturan</Text>
        <Text className="text-xs text-blue-600 font-medium mt-0.5">Aplikasi & Profil Mahasiswa</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-white p-4 rounded-2xl mb-5 border border-blue-100 flex-row items-center shadow-sm">
          <View className="w-14 h-14 rounded-full bg-blue-600 justify-center items-center mr-4">
            <Text className="text-white text-xl font-bold">Z</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900">Zidan Mahasiswa</Text>
            <Text className="text-xs text-blue-600 font-medium mt-0.5">NIM: 2201010099</Text>
            <Text className="text-xs text-slate-400 mt-0.5">Teknik Informatika • Semester 5</Text>
          </View>
        </View>

        {/* Menu Section */}
        <Text className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">PREFERENSI APLIKASI</Text>
        <View className="bg-white rounded-2xl border border-blue-100 overflow-hidden mb-5 shadow-sm">
          <TouchableOpacity className="p-4 flex-row justify-between items-center border-b border-blue-50 active:bg-blue-50 hover:bg-blue-50">
            <Text className="text-sm font-semibold text-slate-800">🔔 Notifikasi Jadwal & Bentrok</Text>
            <Text className="text-xs font-bold text-blue-600">Aktif ›</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 flex-row justify-between items-center border-b border-blue-50 active:bg-blue-50 hover:bg-blue-50">
            <Text className="text-sm font-semibold text-slate-800">🎓 Semester Aktif</Text>
            <Text className="text-xs font-bold text-blue-600">Semester 5 ›</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 flex-row justify-between items-center active:bg-blue-50 hover:bg-blue-50">
            <Text className="text-sm font-semibold text-slate-800">🤖 Deteksi Otomatis AI</Text>
            <Text className="text-xs font-bold text-blue-600">Aktif ›</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">TENTANG</Text>
        <View className="bg-white rounded-2xl border border-blue-100 overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity className="p-4 flex-row justify-between items-center border-b border-blue-50 active:bg-blue-50 hover:bg-blue-50">
            <Text className="text-sm font-semibold text-slate-800">📱 Versi Aplikasi</Text>
            <Text className="text-xs text-slate-400">1.0.0 (My Daily Campus)</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 flex-row justify-between items-center active:bg-blue-50 hover:bg-blue-50">
            <Text className="text-sm font-semibold text-slate-800">ℹ️ Kebijakan Privasi</Text>
            <Text className="text-xs font-bold text-blue-600">Lihat ›</Text>
          </TouchableOpacity>
        </View>

        {/* Reset Data Button */}
        <TouchableOpacity className="bg-white border border-blue-200 py-3.5 rounded-xl items-center mb-8 active:bg-blue-50 hover:bg-blue-50">
          <Text className="text-blue-600 font-bold text-xs">Hapus / Reset Data Lokal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}