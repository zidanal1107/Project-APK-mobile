import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, Zidan 👋</Text>

        <Text style={styles.date}>Tuesday, 6 October 2026</Text>
      </View>

      {/* Next Class */}
      <View style={styles.nextClass}>
        <Text style={styles.label}>NEXT CLASS</Text>

        <Text style={styles.subject}>Struktur Data</Text>

        <Text style={styles.time}>08:00 - 09:40</Text>

        <Text style={styles.room}>📍 Lab Informatika</Text>
      </View>

      {/* Today's Schedule */}
      <Text style={styles.sectionTitle}>Today's Schedule</Text>

      {/* Schedule 1 */}
      <View style={styles.scheduleCard}>
        <Text style={styles.scheduleTime}>08:00</Text>

        <View>
          <Text style={styles.scheduleSubject}>Struktur Data</Text>

          <Text style={styles.scheduleRoom}>Lab Informatika</Text>
        </View>
      </View>

      {/* Schedule 2 */}
      <View style={styles.scheduleCard}>
        <Text style={styles.scheduleTime}>13:00</Text>

        <View>
          <Text style={styles.scheduleSubject}>Pemrograman Mobile</Text>

          <Text style={styles.scheduleRoom}>Lab Komputer</Text>
        </View>
      </View>

      {/* Tasks */}
      <View style={styles.taskCard}>
        <Text style={styles.sectionTitle}>Tasks</Text>

        <Text style={styles.taskText}>3 tasks remaining</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  header: {
    marginTop: 40,
    marginBottom: 25,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },

  date: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },

  nextClass: {
    backgroundColor: "#2563EB",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#DBEAFE",
    marginBottom: 8,
  },

  subject: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  time: {
    fontSize: 16,
    color: "#DBEAFE",
    marginTop: 8,
  },

  room: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },

  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  scheduleTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
    width: 70,
  },

  scheduleSubject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  scheduleRoom: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginTop: 15,
    marginBottom: 30,
  },

  taskText: {
    fontSize: 15,
    color: "#6B7280",
  },
});
