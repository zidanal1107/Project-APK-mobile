export interface ScheduleItem {
  id: string;
  name: string;
  start: string;
  end: string;
  class: string;
  dosen: string;
  ruangan: string;
  hari: string;
  jamDibuat: string;
  type: "akademik" | "non-akademik";
}