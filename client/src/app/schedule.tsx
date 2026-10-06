import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// Array data untuk menghindari pengulangan komponen (DRY concept)
const SCHEDULE_DATA = [
  {
    id: "1",
    day: "Monday",
    timeStart: "08:00",
    timeEnd: "09:40",
    subject: "Struktur Data",
    room: "📍 Lab Informatika",
    lecturer: "👨‍🏫 Dosen Informatika",
  },
  {
    id: "2",
    day: "Tuesday",
    timeStart: "13:00",
    timeEnd: "14:40",
    subject: "Pemrograman Mobile",
    room: "📍 Lab Komputer",
    lecturer: "👨‍🏫 Dosen Informatika",
  },
  {
    id: "3",
    day: "Wednesday",
    timeStart: "10:00",
    timeEnd: "11:40",
    subject: "Metode Numerik",
    room: "📍 Ruang 305",
    lecturer: "👨‍🏫 Dosen Informatika",
  },
  {
    id: "4",
    day: "Thursday",
    timeStart: "08:00",
    timeEnd: "09:40",
    subject: "Statistik dan Probabilitas",
    room: "📍 Ruang 302",
    lecturer: "👨‍🏫 Dosen Informatika",
  },
  {
    id: "5",
    day: "Friday",
    timeStart: "13:00",
    timeEnd: "14:40",
    subject: "Algoritma Pemrograman",
    room: "📍 Lab Informatika",
    lecturer: "👨‍🏫 Dosen Informatika",
  },
];

export default function Schedule() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Schedule</Text>
        <Text style={styles.pageSubtitle}>Your weekly class schedule</Text>
      </View>

      {/* List Jadwal */}
      {SCHEDULE_DATA.map((item) => (
        <View key={item.id} style={styles.daySection}>
          <Text style={styles.dayTitle}>{item.day}</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{item.timeStart}</Text>
              <Text style={styles.timeEnd}>{item.timeEnd}</Text>
            </View>

            <View style={styles.line} />

            <View style={styles.infoContainer}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.room}>{item.room}</Text>
              <Text style={styles.lecturer}>{item.lecturer}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Tombol Add Schedule */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/add-schedule")}
      >
        <Text style={styles.addButtonText}>+ Add Schedule</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  daySection: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  scheduleCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    // Shadow lembut untuk iOS dan Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  timeContainer: {
    width: 55,
    justifyContent: "center",
  },
  time: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB",
  },
  timeEnd: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  line: {
    width: 3,
    backgroundColor: "#2563EB",
    borderRadius: 5,
    marginHorizontal: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  room: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },
  lecturer: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
