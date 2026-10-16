import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "schedule.db";

export const getDatabase = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};