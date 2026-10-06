/**
 * Utility untuk konversi dan format tanggal/waktu pada tampilan UI.
 */

// Format standar header Home Screen (contoh: "Tuesday, 6 October 2026")
export const formatHeaderDate = (date: Date = new Date(), locale: 'en-US' | 'id-ID' = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Format singkat untuk list jadwal (contoh: "Tue, 6 Oct")
export const formatShortDate = (date: Date = new Date(), locale: 'en-US' | 'id-ID' = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
};

// Mendapatkan nama hari saja (contoh: "Tuesday" atau "Selasa")
export const getDayName = (date: Date = new Date(), locale: 'en-US' | 'id-ID' = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
};

// Mengecek apakah tanggal yang dimasukkan adalah hari ini
export const isToday = (targetDate: Date): boolean => {
  const today = new Date();
  return (
    targetDate.getDate() === today.getDate() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getFullYear() === today.getFullYear()
  );
};