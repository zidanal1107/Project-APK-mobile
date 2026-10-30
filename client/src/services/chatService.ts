import { Platform } from "react-native";

// =====================================
// API CONFIGURATION
// =====================================

// Ganti dengan IP lokal komputer yang menjalankan backend.
// Contoh: 192.168.0.124
const COMPUTER_IP = "192.168.0.XXX";

// Pilih konfigurasi sesuai perangkat yang digunakan.

// Expo Web
const WEB_URL = "http://localhost:3000";

// Android Emulator
const ANDROID_EMULATOR_URL = "http://10.0.2.2:3000";

// iOS Simulator
const IOS_SIMULATOR_URL = "http://192.168.43.102:3000";

// HP Android / iPhone fisik
const PHYSICAL_DEVICE_URL = `http://${COMPUTER_IP}:3000`;

// Pilih alamat API secara manual.
const API_URL =
  Platform.OS === "web"
    ? WEB_URL
    : Platform.OS === "ios"
      ? IOS_SIMULATOR_URL
      : ANDROID_EMULATOR_URL;

// Jika menggunakan HP fisik, ganti API_URL menjadi:
// const API_URL = PHYSICAL_DEVICE_URL;

const CHAT_ENDPOINT = `${API_URL}/api/chat`;

// =====================================
// TYPES
// =====================================

export type ChatHistoryItem = {
  role: "user" | "model";
  text: string;
};

type ChatResponse = {
  success: boolean;
  data?: {
    message: string;
  };
  message?: string;
};

// =====================================
// SEND CHAT MESSAGE
// =====================================

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[] = [],
): Promise<string> {
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
        history,
      }),
    });

    const result: ChatResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          `HTTP Error: ${response.status}`,
      );
    }

    if (!result.success || !result.data?.message) {
      throw new Error(
        result.message || "Respons AI tidak valid.",
      );
    }

    return result.data.message;
  } catch (error) {
    console.error("Chat Service Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Tidak dapat terhubung ke server.",
    );
  }
}