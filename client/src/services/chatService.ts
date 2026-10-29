// client/src/services/chatService.ts

import { Platform } from "react-native";

// Untuk Expo Web atau browser pada komputer yang sama, gunakan localhost.
// Untuk Android Emulator, gunakan 10.0.2.2.
// Untuk HP fisik, gunakan IP lokal komputer yang menjalankan backend.
const COMPUTER_IP = "192.168.0.XXX"; // Ganti dengan IP komputermu

const BASE_URL = "http://localhost:3000"; // Default untuk Expo Web atau browser

const API_URL = `${BASE_URL}/api/chat`;

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

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[] = [],
): Promise<string> {
  const response = await fetch(API_URL, {
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

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message ?? `Permintaan gagal dengan status ${response.status}.`,
    );
  }

  return result.data.message;
}