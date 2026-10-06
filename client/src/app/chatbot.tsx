import { useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { sendMessage } from "../services/chatService";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
}

export default function Chatbot() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi Zidan! 👋\nAda yang bisa saya bantu hari ini?",
      sender: "bot",
    },
  ]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userQuery = inputText.trim();

    // 1. Tampilkan pesan pengguna di UI
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userQuery,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // 2. Kirim pesan ke Express AI Gateway
      const response = await sendMessage(userQuery);

      // 3. Tampilkan balasan AI
      const botReplyText = response.reply || response.message || "Tidak ada respon dari AI.";
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReplyText,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      // 4. Tangani error (koneksi terputus / rate limit / offline)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `⚠️ ${error.message || "Gagal menghubungkan ke server AI. Pastikan internet Anda aktif."}`,
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Area Chat */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item) => (
          <View
            key={item.id}
            style={
              item.sender === "user"
                ? styles.userMessageContainer
                : styles.botMessageContainer
            }
          >
            {item.sender === "bot" && (
              <View style={styles.botAvatar}>
                <Text style={styles.avatarText}>AI</Text>
              </View>
            )}

            <View
              style={
                item.sender === "user" ? styles.userMessage : styles.botMessage
              }
            >
              <Text
                style={
                  item.sender === "user"
                    ? styles.userMessageText
                    : styles.botMessageText
                }
              >
                {item.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Indikator AI Sedang Mengetik */}
        {isLoading && (
          <View style={styles.botMessageContainer}>
            <View style={styles.botAvatar}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
            <View style={[styles.botMessage, styles.loadingBubble]}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>AI sedang berpikir...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tanyakan sesuatu..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          multiline
          editable={!isLoading}
        />

        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (pressed || isLoading || !inputText.trim()) && styles.buttonDisabled,
          ]}
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 20,
  },

  /* Bot Message */
  botMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  botMessage: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  botMessageText: {
    color: "#111827",
    fontSize: 15,
    lineHeight: 22,
  },

  /* User Message */
  userMessageContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  userMessage: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: "80%",
  },
  userMessageText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },

  /* Loading State */
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6,
  },

  /* Input Container */
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 20, // Mengangkat area input dari batas bawah
    marginBottom: 8, // Memberi jarak ekstra agar posisi input sedikit lebih naik
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 15,
    color: "#111827",
    marginRight: 10,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});