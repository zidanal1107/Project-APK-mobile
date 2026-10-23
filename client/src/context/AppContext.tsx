import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'akademik' | 'non-akademik';
}

export interface FinanceItem {
  id: string;
  title: string;
  amount: number;
  type: 'pemasukan' | 'pengeluaran';
  date: string;
}

interface AppContextType {
  schedules: ScheduleItem[];
  addSchedule: (item: Omit<ScheduleItem, 'id'>) => Promise<void>;
  updateSchedule: (id: string, item: Omit<ScheduleItem, 'id'>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  finances: FinanceItem[];
  addFinance: (item: Omit<FinanceItem, 'id'>) => Promise<void>;
  updateFinance: (id: string, item: Omit<FinanceItem, 'id'>) => Promise<void>;
  deleteFinance: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [finances, setFinances] = useState<FinanceItem[]>([]);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const savedSchedules = await AsyncStorage.getItem('@campus_schedules');
      const savedFinances = await AsyncStorage.getItem('@campus_finances');

      if (savedSchedules) setSchedules(JSON.parse(savedSchedules));
      if (savedFinances) setFinances(JSON.parse(savedFinances));
    } catch (error) {
      console.error('Gagal memuat data dari lokal:', error);
    }
  };

  // --- CRUD JADWAL ---
  const addSchedule = async (item: Omit<ScheduleItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const updated = [newItem, ...schedules];
    setSchedules(updated);
    await AsyncStorage.setItem('@campus_schedules', JSON.stringify(updated));
  };

  const updateSchedule = async (id: string, item: Omit<ScheduleItem, 'id'>) => {
    const updated = schedules.map((s) => (s.id === id ? { ...item, id } : s));
    setSchedules(updated);
    await AsyncStorage.setItem('@campus_schedules', JSON.stringify(updated));
  };

  const deleteSchedule = async (id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    await AsyncStorage.setItem('@campus_schedules', JSON.stringify(updated));
  };

  // --- CRUD KEUANGAN ---
  const addFinance = async (item: Omit<FinanceItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const updated = [newItem, ...finances];
    setFinances(updated);
    await AsyncStorage.setItem('@campus_finances', JSON.stringify(updated));
  };

  const updateFinance = async (id: string, item: Omit<FinanceItem, 'id'>) => {
    const updated = finances.map((f) => (f.id === id ? { ...item, id } : f));
    setFinances(updated);
    await AsyncStorage.setItem('@campus_finances', JSON.stringify(updated));
  };

  const deleteFinance = async (id: string) => {
    const updated = finances.filter((f) => f.id !== id);
    setFinances(updated);
    await AsyncStorage.setItem('@campus_finances', JSON.stringify(updated));
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
    throw new Error('useApp harus digunakan di dalam AppProvider');
  }
  return context;
};