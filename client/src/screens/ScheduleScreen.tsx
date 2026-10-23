import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ScheduleScreen() {
  const [tab, setTab] = useState<'akademik' | 'non-akademik'>('akademik');

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-slate-900">Jadwal Kampus</Text>
          <Text className="text-xs text-blue-600 font-medium mt-0.5">Kelola agenda kuliah & kegiatanmu</Text>
        </View>
        <TouchableOpacity className="bg-blue-600 px-3.5 py-2 rounded-xl active:bg-blue-700 hover:bg-blue-700">
          <Text className="text-white font-bold text-xs">+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View className="p-4 bg-white border-b border-blue-100">
        <View className="flex-row bg-blue-50 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setTab('akademik')}
            className={`flex-1 py-2.5 rounded-lg items-center active:bg-white hover:bg-white ${
              tab === 'akademik' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text className={`text-xs font-bold ${tab === 'akademik' ? 'text-blue-600' : 'text-slate-500'}`}>
              📚 Akademik (2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('non-akademik')}
            className={`flex-1 py-2.5 rounded-lg items-center active:bg-white hover:bg-white ${
              tab === 'non-akademik' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text className={`text-xs font-bold ${tab === 'non-akademik' ? 'text-blue-600' : 'text-slate-500'}`}>
              🎨 Non-Akademik (1)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {tab === 'akademik' ? (
          <>
            <TouchableOpacity className="bg-white p-4 rounded-2xl mb-3 border border-blue-100 shadow-sm active:bg-blue-50 hover:bg-blue-50">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-bold text-slate-900">Struktur Data</Text>
                <Text className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  SENIN & SELASA
                </Text>
              </View>
              <Text className="text-xs text-blue-600 font-medium">⏰ 08:00 - 09:40 WIB</Text>
              <Text className="text-xs text-slate-500 mt-1">📍 Lab Informatika (Gedung B)</Text>
              <Text className="text-xs text-slate-400 mt-2 italic">Catatan: Bawa laptop & modul praktikum Bab 4</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl mb-3 border border-blue-100 shadow-sm active:bg-blue-50 hover:bg-blue-50">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-bold text-slate-900">Pemrograman Mobile</Text>
                <Text className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  SELASA
                </Text>
              </View>
              <Text className="text-xs text-blue-600 font-medium">⏰ 13:00 - 15:30 WIB</Text>
              <Text className="text-xs text-slate-500 mt-1">📍 Lab Komputer 2</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity className="bg-white p-4 rounded-2xl mb-3 border border-blue-100 shadow-sm active:bg-blue-50 hover:bg-blue-50">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-base font-bold text-slate-900">Rapat Panitia MABA</Text>
              <Text className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                ORGANISASI
              </Text>
            </View>
            <Text className="text-xs text-blue-600 font-medium">⏰ 16:00 - 17:30 WIB</Text>
            <Text className="text-xs text-slate-500 mt-1">📍 Gazebo Kampus</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}