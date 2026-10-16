import { getDatabase } from "@/database/database";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string | null;
  transactionDate: string;
  createdAt: string;
}

export const initFinanceTable = async () => {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL CHECK (amount > 0),
      type TEXT NOT NULL
        CHECK (type IN ('income', 'expense')),
      category TEXT NOT NULL,
      description TEXT,
      transactionDate TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const addTransaction = async (
  title: string,
  amount: number,
  type: TransactionType,
  category: string,
  description: string | null,
  transactionDate: string
) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO transactions
      (title, amount, type, category, description, transactionDate)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, amount, type, category, description, transactionDate]
  );

  return result.lastInsertRowId;
};

export const updateTransaction = async (
  id: number,
  title: string,
  amount: number,
  type: "income" | "expense",
  category: string,
  description: string | null,
  transactionDate: string
) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `UPDATE transactions
     SET title = ?,
         amount = ?,
         type = ?,
         category = ?,
         description = ?,
         transactionDate = ?
     WHERE id = ?`,
    [
      title,
      amount,
      type,
      category,
      description,
      transactionDate,
      id,
    ]
  );

  return result.changes;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const db = await getDatabase();

  return await db.getAllAsync<Transaction>(
    `SELECT * FROM transactions ORDER BY transactionDate DESC, id DESC`
  );
};

export const deleteTransaction = async (id: number) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `DELETE FROM transactions WHERE id = ?`,
    [id]
  );

  return result.changes;
};