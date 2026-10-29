import express from "express";
import coers, { type CorsOptions } from "cors";

import { env } from "./config/env.js";
import { db, testConnection } from "./database/connection.js";

import chatRoutes from "./routes/chat.routes.js";

const app = express();

const corsOptions: CorsOptions = {
    origin: env.corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(coers(corsOptions));
app.use(express.json());

app.get("/", async (req, res) => {
    res.json({ success: true, message: "Server is running!" });
});

app.use("/api/chat", chatRoutes);

app.get("/api/health/db", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.json({ success: true, message: "Database connection is healthy!" });
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ success: false, message: "Database connection failed!", error });
    }
});

async function startServer(): Promise<void> {
    try {
        await testConnection();

        app.listen(env.port, () => {
            console.log(`Server running at http://localhost:${env.port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);

        await db.end();

        process.exitCode = 1;
    }
}

startServer();