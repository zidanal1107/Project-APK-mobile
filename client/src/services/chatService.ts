import { API_URL } from "./api";

export async function sendMessage(message: string) {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    });

    if (!response.ok) {
        throw new Error("Gagal menghubungi server");
    }

    return response.json();
}