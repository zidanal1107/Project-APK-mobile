import { getDatabase } from "@/database/database";

// Tipe jadwal
export type ScheduleType = "academic" | "non-academic";

// Interface jadwal
export interface Schedule {
  id: number;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  lecturer: string | null;
  type: ScheduleType;
}

// ========================================
// INITIALIZE DATABASE TABLE
// ========================================
export const initDatabase = async () => {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      day TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      location TEXT NOT NULL,
      lecturer TEXT,
      type TEXT NOT NULL
        CHECK (type IN ('academic', 'non-academic'))
    );
  `);
};

// ========================================
// CREATE: ADD SCHEDULE
// ========================================
export const addSchedule = async (
  title: string,
  day: string,
  startTime: string,
  endTime: string,
  location: string,
  lecturer: string | null,
  type: ScheduleType
) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO schedules (
      title,
      day,
      startTime,
      endTime,
      location,
      lecturer,
      type
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, day, startTime, endTime, location, lecturer, type]
  );

  return result.lastInsertRowId;
};

// ========================================
// READ: GET ALL SCHEDULES
// ========================================
export const getSchedules = async (): Promise<Schedule[]> => {
  const db = await getDatabase();

  const result = await db.getAllAsync<Schedule>(
    `SELECT * FROM schedules ORDER BY id DESC`
  );

  return result;
};

// ========================================
// READ: GET SCHEDULE BY ID
// ========================================
export const getScheduleById = async (
  id: number
): Promise<Schedule | null> => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<Schedule>(
    `SELECT * FROM schedules WHERE id = ?`,
    [id]
  );

  return result ?? null;
};

// ========================================
// UPDATE: UPDATE SCHEDULE
// ========================================
export const updateSchedule = async (
  id: number,
  title: string,
  day: string,
  startTime: string,
  endTime: string,
  location: string,
  lecturer: string | null,
  type: ScheduleType
) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `UPDATE schedules
     SET title = ?,
         day = ?,
         startTime = ?,
         endTime = ?,
         location = ?,
         lecturer = ?,
         type = ?
     WHERE id = ?`,
    [
      title,
      day,
      startTime,
      endTime,
      location,
      lecturer,
      type,
      id,
    ]
  );

  return result.changes;
};

// ========================================
// DELETE: DELETE SCHEDULE
// ========================================
export const deleteSchedule = async (id: number) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `DELETE FROM schedules WHERE id = ?`,
    [id]
  );

  return result.changes;
};