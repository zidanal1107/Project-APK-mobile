import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ScheduleItem } from "../types/schedule";

import {
  getSettings,
} from "../services/settingsService";

import {
  syncScheduleNotification,
  syncAllScheduleNotifications,
  cancelScheduleNotifications,
} from "../services/notificationService";

export type { ScheduleItem };

export interface FinanceItem {
  id: string;
  title: string;
  amount: number;
  type: "pemasukan" | "pengeluaran";
  kategori: string;
  date: string;
}

interface AppContextType {
  schedules: ScheduleItem[];

  addSchedule: (
    item: Omit<ScheduleItem, "id" | "jamDibuat">
  ) => Promise<void>;

  updateSchedule: (
    id: string,
    item: Omit<ScheduleItem, "id" | "jamDibuat">
  ) => Promise<void>;

  deleteSchedule: (id: string) => Promise<void>;

  finances: FinanceItem[];

  addFinance: (
    item: Omit<FinanceItem, "id">
  ) => Promise<void>;

  updateFinance: (
    id: string,
    item: Omit<FinanceItem, "id">
  ) => Promise<void>;

  deleteFinance: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

const SCHEDULE_KEY = "@campus_schedules";
const FINANCE_KEY = "@campus_finances";

// Helper untuk membuat notifikasi satu jadwal.
const updateScheduleReminder = async (
  schedule: ScheduleItem
) => {
  try {
    const settings = await getSettings();

    await syncScheduleNotification(
      schedule,
      settings.notifications
    );
  } catch (error) {
    console.error(
      "Gagal memperbarui notifikasi jadwal:",
      error
    );
  }
};

export const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [finances, setFinances] = useState<FinanceItem[]>([]);

  useEffect(() => {
    loadStorageData();
  }, []);

  // =====================================
  // LOAD DATA
  // =====================================

  const loadStorageData = async () => {
    try {
      const [
        savedSchedules,
        savedFinances,
        settings,
      ] = await Promise.all([
        AsyncStorage.getItem(SCHEDULE_KEY),
        AsyncStorage.getItem(FINANCE_KEY),
        getSettings(),
      ]);

      const loadedSchedules: ScheduleItem[] =
        savedSchedules
          ? JSON.parse(savedSchedules)
          : [];

      const loadedFinances: FinanceItem[] =
        savedFinances
          ? JSON.parse(savedFinances)
          : [];

      setSchedules(loadedSchedules);
      setFinances(loadedFinances);

      // Sinkronkan notifikasi dengan data lokal.
      await syncAllScheduleNotifications(
        loadedSchedules,
        settings.notifications
      );
    } catch (error) {
      console.error(
        "Gagal memuat data dari lokal:",
        error
      );
    }
  };

  // =====================================
  // CRUD JADWAL
  // =====================================

  const addSchedule = async (
    item: Omit<ScheduleItem, "id" | "jamDibuat">
  ) => {
    const jamDibuat = new Date().toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
      jamDibuat,
    };

    const updated = [newItem, ...schedules];

    // Simpan jadwal terlebih dahulu.
    await AsyncStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(updated)
    );

    setSchedules(updated);

    // Buat notifikasi setelah jadwal berhasil disimpan.
    await updateScheduleReminder(newItem);
  };

  const updateSchedule = async (
    id: string,
    item: Omit<ScheduleItem, "id" | "jamDibuat">
  ) => {
    const existing = schedules.find(
      (schedule) => schedule.id === id
    );

    const updated = schedules.map((schedule) =>
      schedule.id === id
        ? {
            ...item,
            id,
            jamDibuat:
              existing?.jamDibuat ||
              new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
          }
        : schedule
    );

    await AsyncStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(updated)
    );

    setSchedules(updated);

    const updatedSchedule = updated.find(
      (schedule) => schedule.id === id
    );

    if (updatedSchedule) {
      // Fungsi ini membatalkan notifikasi lama
      // kemudian membuat notifikasi yang baru.
      await updateScheduleReminder(updatedSchedule);
    }
  };

  const deleteSchedule = async (id: string) => {
    const updated = schedules.filter(
      (schedule) => schedule.id !== id
    );

    await AsyncStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(updated)
    );

    setSchedules(updated);

    // Batalkan semua notifikasi milik jadwal ini.
    try {
      await cancelScheduleNotifications(id);
    } catch (error) {
      console.error(
        "Gagal menghapus notifikasi jadwal:",
        error
      );
    }
  };

  // =====================================
  // CRUD KEUANGAN
  // =====================================

  const addFinance = async (
    item: Omit<FinanceItem, "id">
  ) => {
    const newItem: FinanceItem = {
      ...item,
      id: Date.now().toString(),
    };

    const updated = [newItem, ...finances];

    await AsyncStorage.setItem(
      FINANCE_KEY,
      JSON.stringify(updated)
    );

    setFinances(updated);
  };

  const updateFinance = async (
    id: string,
    item: Omit<FinanceItem, "id">
  ) => {
    const updated = finances.map((finance) =>
      finance.id === id
        ? { ...item, id }
        : finance
    );

    await AsyncStorage.setItem(
      FINANCE_KEY,
      JSON.stringify(updated)
    );

    setFinances(updated);
  };

  const deleteFinance = async (id: string) => {
    const updated = finances.filter(
      (finance) => finance.id !== id
    );

    await AsyncStorage.setItem(
      FINANCE_KEY,
      JSON.stringify(updated)
    );

    setFinances(updated);
  };

  return (
    <AppContext.Provider
      value={{
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,

        finances,
        addFinance,
        updateFinance,
        deleteFinance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp harus digunakan di dalam AppProvider"
    );
  }

  return context;
};