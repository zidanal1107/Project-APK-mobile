import type { Request, Response } from "express";
import {
  generateChatResponse,
  type ChatHistoryItem,
} from "./gemini.service.js";

export async function sendChatMessage(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { message, history } = req.body as {
      message?: unknown;
      history?: unknown;
    };

    // Validasi pesan
    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
      return;
    }

    if (message.length > 5000) {
      res.status(400).json({
        success: false,
        message: "Message cannot exceed 5000 characters.",
      });
      return;
    }

    // Validasi riwayat percakapan
    if (history !== undefined && !Array.isArray(history)) {
      res.status(400).json({
        success: false,
        message: "History must be an array.",
      });
      return;
    }

    const chatHistory: ChatHistoryItem[] = [];

    if (Array.isArray(history)) {
      if (history.length > 20) {
        res.status(400).json({
          success: false,
          message: "History cannot exceed 20 messages.",
        });
        return;
      }

      for (const item of history) {
        if (
          typeof item !== "object" ||
          item === null ||
          !("role" in item) ||
          !("text" in item) ||
          (item.role !== "user" && item.role !== "model") ||
          typeof item.text !== "string" ||
          !item.text.trim() ||
          item.text.length > 5000
        ) {
          res.status(400).json({
            success: false,
            message: "Invalid message format in history.",
          });
          return;
        }

        chatHistory.push({
          role: item.role,
          text: item.text,
        });
      }
    }

    // Meminta jawaban dari Gemini
    const answer = await generateChatResponse(
      message.trim(),
      chatHistory,
    );

    res.status(200).json({
      success: true,
      data: {
        message: answer,
      },
    });
  } catch (error) {
    console.error("Error processing chat message:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while processing the chat message.",
    });
  }
}