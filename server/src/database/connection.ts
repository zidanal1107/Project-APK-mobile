import mysql from "mysql2/promise";
import { env } from "../config/env.js";

export const db = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function testConnection() {
    let connection: mysql.PoolConnection | undefined;
    try {
        connection = await db.getConnection();
        console.log("Database connection successful!");
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        connection?.release();
    }
}