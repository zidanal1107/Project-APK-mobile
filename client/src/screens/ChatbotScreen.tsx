import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { sendChatMessage } from "../services/chatService";

type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotScreen() {
  const { schedules, finances } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo Zidan! Saya Asisten AI My Daily Campus 🎓. Ada yang bisa saya bantu terkait jadwal kuliah atau ringkasan keuangan kamu?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Perhitungan keuangan dari AppContext
  const totalPemasukan = finances
    .filter((f) => f.type === "pemasukan")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPengeluaran = finances
    .filter((f) => f.type === "pengeluaran")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaldo = totalPemasukan - totalPengeluaran;

  const sendMessage = async (customText?: string) => {
    const textToSend = (customText ?? input).trim();

    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: textToSend,
    };

    // FIX 1: Filter history agar tidak diawali pesan bot/greeting & mengabaikan pesan error
    const history = messages
      .filter((msg) => !msg.id.includes("error")) // Abaikan pesan error
      .map((msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("model" as const),
        text: msg.text,
      }))
      .filter((msg, index) => {
        // Hapus elemen pertama jika berupa 'model' (salam pembuka bot)
        if (index === 0 && msg.role === "model") return false;
        return true;
      });

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Buat konteks dari data aplikasi yang tersedia.
    const scheduleContext =
      schedules.length === 0
        ? "Belum ada jadwal kuliah yang tersimpan."
        : schedules
            .map(
              (s) =>
                `- ${s.name}, hari ${s.hari}, pukul ${s.start}-${s.end}, ruangan ${s.ruangan}, dosen ${s.dosen || "-"}`,
            )
            .join("\n");

    const financeContext =
      `Total pemasukan: Rp ${totalPemasukan.toLocaleString("id-ID")}\n` +
      `Total pengeluaran: Rp ${totalPengeluaran.toLocaleString("id-ID")}\n` +
      `Total saldo: Rp ${totalSaldo.toLocaleString("id-ID")}\n` +
      (finances.length === 0
        ? "Belum ada transaksi yang tersimpan."
        : "Transaksi terbaru:\n" +
          finances
            .slice(0, 3)
            .map(
              (f) =>
                `- ${f.title}, kategori ${f.kategori || "Lainnya"}, jenis ${f.type}, nominal Rp ${f.amount.toLocaleString("id-ID")}`,
            )
            .join("\n"));

    const contextualMessage = `
DATA JADWAL KULIAH:
${scheduleContext}

DATA KEUANGAN:
${financeContext}

PERTANYAAN PENGGUNA:
${textToSend}
    `.trim();

    try {
      const answer = await sendChatMessage(contextualMessage, history);

      const botMsg: ChatMessage = {
        id: `${Date.now()}-bot`,
        sender: "bot",
        text: answer,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot request error:", error);

      const errorText =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui.";

      const errorMsg: ChatMessage = {
        id: `${Date.now()}-error`,
        sender: "bot",
        text:
          "Maaf, saya belum dapat terhubung ke AI.\n\n" +
          `Detail: ${errorText}\n\n` +
          "Pastikan backend aktif dan alamat API sudah benar.",
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
              {isLoading ? "AI sedang berpikir..." : "Gemini AI Assistant"}
            </Text>
          </View>
        </View>

        {/* Preset Query Chips */}
        <View className="px-4 py-2.5 bg-white border-b border-blue-100 flex-row gap-2">
          <TouchableOpacity
            onPress={() => sendMessage("Cek jadwal kuliah saya")}
            disabled={isLoading}
            className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full active:bg-blue-100"
          >
            <Text className="text-xs font-semibold text-blue-700">
              📅 Cek Jadwal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => sendMessage("Berapa sisa saldo saya?")}
            disabled={isLoading}
            className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full active:bg-blue-100"
          >
            <Text className="text-xs font-semibold text-blue-700">
              💰 Cek Saldo
            </Text>
          </TouchableOpacity>
        </View>

        {/* List Message */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={{ flex: 1 }}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
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

          {isLoading && (
            <View className="mb-3 self-start bg-white border border-blue-100 rounded-2xl p-3.5 flex-row items-center">
              <ActivityIndicator size="small" color="#2563EB" />
              <Text className="ml-2 text-xs text-slate-500">
                Asisten sedang berpikir...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Box */}
        <View className="p-3 bg-white border-t border-blue-100 flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tanyakan jadwal atau keuangan..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-blue-50/60 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
            editable={!isLoading}
            multiline
            maxLength={5000}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
            blurOnSubmit={false}
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2.5 rounded-xl justify-center items-center ${
              isLoading || !input.trim() ? "bg-blue-300" : "bg-blue-600"
            }`}
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
