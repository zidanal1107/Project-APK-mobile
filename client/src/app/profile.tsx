import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Profile() {
  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Fitur edit profil akan segera hadir!");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Z</Text>
        </View>
        <Text style={styles.name}>Zidan</Text>
        <Text style={styles.role}>Informatics Engineering Student</Text>
      </View>

      {/* Personal Information */}
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.card}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>Zidan</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.value}>202510370110249</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.label}>Major</Text>
          <Text style={styles.value}>Informatics Engineering</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.label}>University</Text>
          <Text style={styles.value}>University</Text>
        </View>
      </View>

      {/* Academic Information */}
      <Text style={styles.sectionTitle}>Academic Information</Text>
      <View style={styles.card}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Semester</Text>
          <Text style={styles.value}>2</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.label}>Class</Text>
          <Text style={styles.value}>Informatics Engineering</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <Pressable
        style={({ pressed }) => [
          styles.editButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
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
  profileHeader: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    // Shadow lembut untuk Avatar
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  role: {
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
  infoItem: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 16,
  },
  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
