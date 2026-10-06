import * as SQLite from "expo-sqlite";

export interface Schedule {
    id: number;
    title: string;
    day: string;
    startTime: string;
    endTime: string;
    location: string;
}

export const initDatabase = async () => {
    const db = SQLite.openDatabaseAsync("schedule.db");
    (await db).execAsync(
        `CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            day TEXT NOT NULL,
            startTime TEXT NOT NULL,
            endTime TEXT NOT NULL,
            location TEXT NOT NULL
        );`
    );
};

// CREATE
export const addSchedule = async (title: string, day: string, startTime: string, endTime: string, location: string) => {
    const db = await SQLite.openDatabaseAsync("schedule.db");
    (await db).runAsync(
        `INSERT INTO schedules (title, day, startTime, endTime, location) VALUES (?, ?, ?, ?, ?)`,
        [title, day, startTime, endTime, location]
    );
};

// READ
export const getSchedules = async (): Promise<Schedule[]> => {
    const db = await SQLite.openDatabaseAsync("schedule.db");
    const result = await (await db).getAllAsync<Schedule>(`SELECT * FROM schedules`);
    return result;
};

// UPDATE
export const updateSchedule = async (id: number, title: string, day: string, startTime: string, endTime: string, location: string) => {
    const db = await SQLite.openDatabaseAsync("schedule.db");
    (await db).runAsync(
        `UPDATE schedules SET title = ?, day = ?, startTime = ?, endTime = ?, location = ? WHERE id = ?`,
        [title, day, startTime, endTime, location, id]
    );
};

// DELETE
export const deleteSchedule = async (id: number) => {
    const db = await SQLite.openDatabaseAsync("schedule.db");
    (await db).runAsync(`DELETE FROM schedules WHERE id = ?`, [id]);
};