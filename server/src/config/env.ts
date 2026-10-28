import "dotenv/config";

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function getNumberEnv(name: string): number {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    const numberValue = Number(value);

    if (isNaN(numberValue) || !Number.isInteger(numberValue) || numberValue <= 0) {
        throw new Error(`Environment variable is not a valid integer: ${name}`);
    }

    return numberValue;
}

export const env = {
    port: getNumberEnv("PORT"),
    db: {
        host: getRequiredEnv("DB_HOST"),
        port: getNumberEnv("DB_PORT"),
        user: getRequiredEnv("DB_USER"),
        password: process.env.DB_PASSWORD ?? "",
        name: getRequiredEnv("DB_NAME"),
    },
    geminiApiKey: getRequiredEnv("GEMINI_API_KEY"),
    corsOrigin: (process.env.CORS_ORIGIN ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
}