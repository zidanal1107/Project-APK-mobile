import React from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useApp } from "../context/AppContext";

export default function HomeScreen({ navigation }: any) {
  const { schedules, finances } = useApp();

  const totalPemasukan = finances
    .filter((f) => f.type === "pemasukan")
    .reduce((a, b) => a + b.amount, 0);

  const totalPengeluaran = finances
    .filter((f) => f.type === "pengeluaran")
    .reduce((a, b) => a + b.amount, 0);

  const totalSaldo = totalPemasukan - totalPengeluaran;
  const nextSchedule = schedules[0];

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-2 mb-6">
          <View>
            <Text className="text-2xl font-bold text-slate-900">
              Halo, Zidan 👋
            </Text>
            <Text className="text-xs font-medium text-blue-600 mt-1">
              Selasa, 6 Oktober 2026
            </Text>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-blue-600 justify-center items-center shadow-md">
            <Text className="text-white font-bold text-base">Z</Text>
          </TouchableOpacity>
        </View>

        {/* Card Jadwal Terdekat */}
        <View className="bg-blue-600 p-5 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-blue-100 tracking-wider">
              JADWAL TERDEKAT
            </Text>
            {nextSchedule && (
              <View className="bg-white/20 px-2.5 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-white uppercase">
                  {nextSchedule.type}
                </Text>
              </View>
            )}
          </View>

          {nextSchedule ? (
            <>
              <Text className="text-2xl font-bold text-white mt-1">
                {nextSchedule.name}
              </Text>
              <Text className="text-sm font-medium text-blue-100 mt-1">
                🗓 {nextSchedule.hari}, {nextSchedule.start} -{" "}
                {nextSchedule.end}
              </Text>
              <Text className="text-xs text-white/90 mt-2">
                📍 {nextSchedule.ruangan}
              </Text>
            </>
          ) : (
            <Text className="text-sm text-blue-100 mt-1">
              Belum ada jadwal tersimpan.
            </Text>
          )}
        </View>

        {/* Quick Assistant AI Widget */}
        <TouchableOpacity
          onPress={() => navigation?.navigate("Chatbot")}
          className="bg-white border border-blue-200 rounded-2xl p-4 mb-6 flex-row items-center shadow-sm active:bg-blue-50"
        >
          <View className="w-10 h-10 rounded-xl bg-blue-600 justify-center items-center mr-3">
            <Text className="text-xl">🤖</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-blue-900">
              Tanya Asisten AI
            </Text>
            <Text className="text-xs text-blue-600 mt-0.5">
              Tanyakan jadwal atau saldo otomatis
            </Text>
          </View>
          <Text className="text-xl font-bold text-blue-600">›</Text>
        </TouchableOpacity>

        {/* Ringkasan Keuangan */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-blue-100 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-800">
              Saldo Keuangan
            </Text>
            <TouchableOpacity onPress={() => navigation?.navigate("Finance")}>
              <Text className="text-xs font-semibold text-blue-600">
                Detail ›
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-extrabold text-blue-600">
            Rp {totalSaldo.toLocaleString("id-ID")}
          </Text>
          <View className="flex-row justify-between mt-3 pt-3 border-t border-slate-100">
            <Text className="text-xs text-slate-500">
              Pemasukan:{" "}
              <Text className="font-bold text-blue-600">
                +Rp {totalPemasukan.toLocaleString("id-ID")}
              </Text>
            </Text>
            <Text className="text-xs text-slate-500">
              Pengeluaran:{" "}
              <Text className="font-bold text-slate-700">
                -Rp {totalPengeluaran.toLocaleString("id-ID")}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
