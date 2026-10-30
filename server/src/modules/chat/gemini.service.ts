import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";

const ai = new GoogleGenAI({
    apiKey: env.geminiApiKey,
});

const MAX_RETRIES = 2;

async function generateWithRetry(
  request: Parameters<typeof ai.models.generateContent>[0],
) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error: unknown) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? error.status
          : undefined;

      if (status !== 503 || attempt >= MAX_RETRIES) {
        throw error;
      }

      const delay = 1000 * 2 ** attempt;

      console.warn(
        `Gemini sedang sibuk. Percobaan ulang dalam ${delay} ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const SYSTEM_INSTRUCTION = `
Kamu adalah asisten AI untuk aplikasi My Daily Campus.

Tugasmu:
- Membantu mahasiswa mengatur jadwal dan aktivitas kampus.
- Menjawab pertanyaan seputar kuliah, produktivitas, dan manajemen waktu.
- Memberikan penjelasan yang jelas, ramah, dan mudah dipahami.
- Menggunakan bahasa yang digunakan oleh pengguna.
- Tidak mengarang informasi tentang jadwal atau data pengguna.
- Jika tidak memiliki informasi yang diperlukan, jelaskan bahwa informasi tersebut belum tersedia.
`;

export type ChatHistoryItem = {
    role: "user" | "model";
    text: string;
};

export async function generateChatResponse(
    message: string,
    history: ChatHistoryItem[] = [],
): Promise<string> {
    const contents = [
        ...history.map((item) => ({
            role: item.role,
            parts: [{ text: item.text }],
        })),
        {
            role: "user" as const,
            parts: [{ text: message }],
        },
    ];

    const response = await generateWithRetry({
        model: "gemini-3.5-flash-lite",
        contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });

    const answer = response.text?.trim();

    if (!answer) {
        throw new Error("Gemini is not generating a response.");
    }

    return answer;
}