import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Settings() {
  const handleLogout = () => {
    Alert.alert("Log Out", "Apakah Anda yakin ingin keluar dari akun?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => console.log("User logged out"),
      },
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
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your application settings</Text>
      </View>

      {/* General Section */}
      <Text style={styles.sectionTitle}>General</Text>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.settingItem,
            pressed && styles.itemPressed,
          ]}
          onPress={() => {}}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Manage schedule notifications
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.settingItem,
            pressed && styles.itemPressed,
          ]}
          onPress={() => {}}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Language</Text>
            <Text style={styles.settingDescription}>English</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Schedule Section */}
      <Text style={styles.sectionTitle}>Schedule</Text>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.settingItem,
            pressed && styles.itemPressed,
          ]}
          onPress={() => {}}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Default Reminder</Text>
            <Text style={styles.settingDescription}>
              15 minutes before class
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.settingItem,
            pressed && styles.itemPressed,
          ]}
          onPress={() => {}}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>First Day of Week</Text>
            <Text style={styles.settingDescription}>Monday</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* About Section */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.settingItem,
            pressed && styles.itemPressed,
          ]}
          onPress={() => {}}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>About A Day In Campus</Text>
            <Text style={styles.settingDescription}>Version 1.0.0</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemPressed: {
    backgroundColor: "#F9FAFB",
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  settingDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  arrow: {
    fontSize: 22,
    color: "#9CA3AF",
    fontWeight: "300",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  logoutPressed: {
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "bold",
  },
});
