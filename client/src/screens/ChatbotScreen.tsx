import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useApp } from "../context/AppContext";

export default function ChatbotScreen() {
  const { schedules, finances } = useApp();

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Halo Zidan! Saya Asisten AI My Daily Campus 🎓. Ada yang bisa saya bantu terkait jadwal bertabrakan atau ringkasan keuangan kamu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Perhitungan Keuangan Real-Time dari Storage
  const totalPemasukan = finances
    .filter((f) => f.type === "pemasukan")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPengeluaran = finances
    .filter((f) => f.type === "pengeluaran")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaldo = totalPemasukan - totalPengeluaran;

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulasi pembacaan data lokal oleh AI saat respon dihasilkan
    setTimeout(() => {
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (
        lower.includes("jadwal") ||
        lower.includes("bentrok") ||
        lower.includes("kuliah")
      ) {
        if (schedules.length === 0) {
          replyText =
            "📅 Belum ada jadwal yang tersimpan di memori lokal kamu.";
        } else {
          replyText =
            `📅 Kamu memiliki ${schedules.length} jadwal tersimpan:\n\n` +
            schedules
              .map(
                (s) =>
                  `• ${s.name} (${s.hari}, ${s.start}-${s.end})\n  📍 ${s.ruangan} | 👨‍🏫 ${s.dosen || "-"}`,
              )
              .join("\n\n");
        }
      } else if (
        lower.includes("saldo") ||
        lower.includes("keuangan") ||
        lower.includes("uang")
      ) {
        replyText =
          `💰 Ringkasan Keuangan Lokal Kamu:\n\n` +
          `• Total Saldo: Rp ${totalSaldo.toLocaleString("id-ID")}\n` +
          `• Pemasukan: Rp ${totalPemasukan.toLocaleString("id-ID")}\n` +
          `• Pengeluaran: Rp ${totalPengeluaran.toLocaleString("id-ID")}\n\n` +
          `Transaksi Terakhir:\n` +
          finances
            .slice(0, 3)
            .map(
              (f) =>
                `• ${f.title} (${f.kategori || "Lainnya"}): Rp ${f.amount.toLocaleString("id-ID")}`,
            )
            .join("\n");
      } else {
        replyText = `🤖 Saya siap membantu! Kamu dapat menanyakan status jadwal perkuliahan (${schedules.length} tersimpan) atau sisa saldo keuangan kamu saat ini (Rp ${totalSaldo.toLocaleString("id-ID")}).`;
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: replyText },
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-blue-50/40">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100 flex-row items-center">
          <View className="w-9 h-9 rounded-full bg-blue-600 justify-center items-center mr-3">
            <Text className="text-white text-base">🤖</Text>
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900">
              Campus AI Assistant
            </Text>
            <Text className="text-xs text-blue-600 font-semibold">
              Online • Data Sync Active
            </Text>
          </View>
        </View>

        {/* Preset Query Chips */}
        <View className="px-4 py-2.5 bg-white border-b border-blue-100 flex-row gap-2">
          <TouchableOpacity
            onPress={() => sendMessage("Cek jadwal kuliah")}
            className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full active:bg-blue-100"
          >
            <Text className="text-xs font-semibold text-blue-700">
              📅 Cek Jadwal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => sendMessage("Berapa sisa saldo?")}
            className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full active:bg-blue-100"
          >
            <Text className="text-xs font-semibold text-blue-700">
              💰 Cek Saldo
            </Text>
          </TouchableOpacity>
        </View>

        {/* List Message */}
        <ScrollView
          style={{ flex: 1 }}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 max-w-[85%] p-3.5 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-blue-600 self-end rounded-br-xs"
                  : "bg-white border border-blue-100 self-start rounded-bl-xs shadow-sm"
              }`}
            >
              <Text
                className={`text-sm ${
                  msg.sender === "user"
                    ? "text-white font-medium"
                    : "text-slate-800"
                }`}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Box */}
        <View className="p-3 bg-white border-t border-blue-100 flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tanyakan jadwal atau keuangan..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-blue-50/60 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={isLoading}
            className="bg-blue-600 px-4 py-2.5 rounded-xl justify-center items-center active:bg-blue-700"
          >
            <Text className="text-white font-bold text-sm">
              {isLoading ? "..." : "Kirim"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
