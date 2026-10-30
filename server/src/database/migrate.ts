import { db as pool } from "./connection.js";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function migrate(): Promise<void> {
  const connection = await pool.getConnection();

  try {
    console.log("Starting database migration...\n");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const [rows] = await connection.query(
        `SELECT id FROM schema_migrations WHERE migration_name = ?`,
        [file],
      );

      const executed = rows as { id: number }[];

      if (executed.length > 0) {
        console.log(`SKIPPED: ${file}`);
        continue;
      }

      console.log(`RUNNING: ${file}`);

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = await readFile(filePath, "utf-8");

      try {
        await connection.query(sql);

        await connection.query(
          `INSERT INTO schema_migrations (migration_name) VALUES (?)`,
          [file],
        );

        console.log(`SUCCESS: ${file}\n`);
      } catch (error) {
        console.error(`FAILED: ${file}`);
        throw error;
      }
    }

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    connection.release();
  }
}

migrate()
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });