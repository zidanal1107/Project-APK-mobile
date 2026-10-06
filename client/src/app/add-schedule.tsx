import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddSchedule() {
  const router = useRouter();

  // State untuk menyimpan nilai input formulir
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");
  const [room, setRoom] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSave = () => {
    // Validasi input sederhana
    if (!subject.trim() || !day.trim() || !startTime.trim()) {
      Alert.alert(
        "Peringatan",
        "Mohon isi minimal Subject, Day, dan Start Time!",
      );
      return;
    }

    // Simulasi simpan data
    const newSchedule = {
      subject,
      day,
      room,
      lecturer,
      startTime,
      endTime,
    };

    console.log("Schedule Saved:", newSchedule);

    Alert.alert("Berhasil", "Jadwal berhasil ditambahkan!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add Schedule</Text>
        <Text style={styles.subtitle}>Add a new class to your schedule</Text>
      </View>

      {/* Subject */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Struktur Data"
          placeholderTextColor="#9CA3AF"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      {/* Day */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Day</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Monday"
          placeholderTextColor="#9CA3AF"
          value={day}
          onChangeText={setDay}
        />
      </View>

      {/* Room */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Room</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Lab Informatika"
          placeholderTextColor="#9CA3AF"
          value={room}
          onChangeText={setRoom}
        />
      </View>

      {/* Lecturer */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lecturer</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Budi Santoso"
          placeholderTextColor="#9CA3AF"
          value={lecturer}
          onChangeText={setLecturer}
        />
      </View>

      {/* Time Row (Start Time & End Time disandingkan) */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            style={styles.input}
            placeholder="08:00"
            placeholderTextColor="#9CA3AF"
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>

        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>End Time</Text>
          <TextInput
            style={styles.input}
            placeholder="09:40"
            placeholderTextColor="#9CA3AF"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
      </View>

      {/* Save Button */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Schedule</Text>
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
  header: {
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
