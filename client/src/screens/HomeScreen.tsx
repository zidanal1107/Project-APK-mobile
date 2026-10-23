import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-2 mb-6">
          <View>
            <Text className="text-2xl font-bold text-slate-900">Halo, Zidan 👋</Text>
            <Text className="text-xs font-medium text-blue-600 mt-1">
              Selasa, 6 Oktober 2026
            </Text>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-blue-600 justify-center items-center shadow-md active:bg-blue-700 hover:bg-blue-700">
            <Text className="text-white font-bold text-base">Z</Text>
          </TouchableOpacity>
        </View>

        {/* Card Kelas Berikutnya */}
        <View className="bg-blue-600 p-5 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-blue-100 tracking-wider">
              JADWAL SELANJUTNYA
            </Text>
            <View className="bg-white/20 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-white">AKADEMIK</Text>
            </View>
          </View>
          <Text className="text-2xl font-bold text-white mt-1">Struktur Data</Text>
          <Text className="text-sm font-medium text-blue-100 mt-1">⏰ 08:00 - 09:40 WIB</Text>
          <Text className="text-xs text-white/90 mt-2">📍 Lab Informatika (Gedung B)</Text>
        </View>

        {/* Quick Assistant AI Widget */}
        <TouchableOpacity
          onPress={() => navigation?.navigate('Chatbot')}
          className="bg-white border border-blue-200 rounded-2xl p-4 mb-6 flex-row items-center shadow-sm active:bg-blue-50 hover:bg-blue-50"
        >
          <View className="w-10 h-10 rounded-xl bg-blue-600 justify-center items-center mr-3">
            <Text className="text-xl">🤖</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-blue-900">Tanya Asisten AI</Text>
            <Text className="text-xs text-blue-600 mt-0.5">
              "Cek jadwal bentrok hari ini" atau "Cek saldo"
            </Text>
          </View>
          <Text className="text-xl font-bold text-blue-600">›</Text>
        </TouchableOpacity>

        {/* Ringkasan Keuangan Singkat */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-blue-100 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-800">Saldo Keuangan</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Finance')} className="active:opacity-70">
              <Text className="text-xs font-semibold text-blue-600">Detail ›</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-extrabold text-blue-600">Rp 1.450.000</Text>
          <View className="flex-row justify-between mt-3 pt-3 border-t border-slate-100">
            <Text className="text-xs text-slate-500">Pemasukan: <Text className="font-bold text-blue-600">+Rp 2.000.000</Text></Text>
            <Text className="text-xs text-slate-500">Pengeluaran: <Text className="font-bold text-slate-700">-Rp 550.000</Text></Text>
          </View>
        </View>

        {/* Agenda Hari Ini */}
        <Text className="text-lg font-bold text-slate-900 mb-3">Agenda Hari Ini</Text>

        <TouchableOpacity className="bg-white p-4 rounded-xl mb-3 border border-blue-100 flex-row items-center shadow-sm active:bg-blue-50 hover:bg-blue-50">
          <View className="w-1.5 h-10 bg-blue-600 rounded-full mr-3.5" />
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900">Pemrograman Mobile</Text>
            <Text className="text-xs text-blue-600 font-medium mt-0.5">13:00 - 15:30 WIB • Lab Komputer</Text>
          </View>
          <Text className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg">Akademik</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-xl mb-8 border border-blue-100 flex-row items-center shadow-sm active:bg-blue-50 hover:bg-blue-50">
          <View className="w-1.5 h-10 bg-slate-300 rounded-full mr-3.5" />
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900">Rapat Panitia MABA</Text>
            <Text className="text-xs text-slate-500 font-medium mt-0.5">16:00 - 17:30 WIB • Gazebo Kampus</Text>
          </View>
          <Text className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">Non-Akademik</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}