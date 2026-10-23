import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Halo Zidan! Saya Asisten AI My Daily Campus 🎓. Ada yang bisa saya bantu terkait jadwal bertabrakan atau ringkasan keuangan kamu?',
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: textToSend };
    let replyText = '🤖 Saya siap membantu! Silakan tanyakan seputar jadwal bentrok atau sisa saldo keuangan kamu.';

    const lower = textToSend.toLowerCase();
    if (lower.includes('bentrok') || lower.includes('jadwal')) {
      replyText = '✅ Setelah dicek, tidak ada jadwal yang bertabrakan untuk minggu ini!';
    } else if (lower.includes('saldo') || lower.includes('keuangan')) {
      replyText = '💰 Sisa saldo kamu saat ini adalah Rp 1.450.000 (Pemasukan: Rp 2.000.000, Pengeluaran: Rp 550.000).';
    }

    const botMsg = { id: (Date.now() + 1).toString(), sender: 'bot', text: replyText };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50/40">
      {/* Top Bar */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-blue-100 flex-row items-center">
        <View className="w-9 h-9 rounded-full bg-blue-600 justify-center items-center mr-3">
          <Text className="text-white text-base">🤖</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-slate-900">Campus AI Assistant</Text>
          <Text className="text-xs text-blue-600 font-semibold">Online • Siap membantu</Text>
        </View>
      </View>

      {/* Preset Query Chips */}
      <View className="px-4 py-2.5 bg-white border-b border-blue-100 flex-row gap-2">
        <TouchableOpacity
          onPress={() => sendMessage('Cek jadwal bentrok')}
          className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full active:bg-blue-100 hover:bg-blue-100"
        >
          <Text className="text-xs font-semibold text-blue-700">⚠️ Cek Bentrok</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sendMessage('Berapa sisa saldo?')}
          className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full active:bg-blue-100 hover:bg-blue-100"
        >
          <Text className="text-xs font-semibold text-blue-700">💰 Cek Saldo</Text>
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-3 max-w-[82%] p-3.5 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-blue-600 self-end rounded-br-xs'
                : 'bg-white border border-blue-100 self-start rounded-bl-xs shadow-sm'
            }`}
          >
            <Text className={`text-sm ${msg.sender === 'user' ? 'text-white font-medium' : 'text-slate-800'}`}>
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
          placeholder="Tanyakan jadwal bentrok atau keuangan..."
          className="flex-1 bg-blue-50/60 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
        />
        <TouchableOpacity
          onPress={() => sendMessage()}
          className="bg-blue-600 px-4 py-2.5 rounded-xl justify-center items-center active:bg-blue-700 hover:bg-blue-700"
        >
          <Text className="text-white font-bold text-sm">Kirim</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}