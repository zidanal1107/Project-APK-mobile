import { Drawer, DrawerToggleButton } from "expo-router/drawer";
import { StyleSheet, Text, View } from "react-native";

// Pemetaan nama route ke Judul Halaman
const PAGE_TITLES: Record<string, string> = {
  index: "Home",
  schedule: "My Schedule",
  "add-schedule": "Add Schedule",
  chatbot: "Chatbot",
  settings: "Setting",
  profile: "Profile",
};

export default function Layout() {
  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#2563EB",
        },
        headerTintColor: "#FFFFFF",
        headerTitleAlign: "left",

        // 1. Nama Aplikasi di paling kiri
        headerTitle: () => <Text style={styles.appName}>A Day In Campus</Text>,
        headerLeft: () => null,

        // 2. Nama Halaman tepat di sebelah kanan, berdampingan dengan Hamburger
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Text style={styles.pageTitle} numberOfLines={1}>
              {PAGE_TITLES[route.name] ?? route.name}
            </Text>
            <DrawerToggleButton tintColor="#FFFFFF" />
          </View>
        ),

        drawerActiveTintColor: "#2563EB",
        drawerLabelStyle: { fontSize: 16 },
      })}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: "Home" }} />
      <Drawer.Screen name="schedule" options={{ drawerLabel: "My Schedule" }} />
      <Drawer.Screen
        name="add-schedule"
        options={{ drawerLabel: "Add Schedule" }}
      />
      <Drawer.Screen name="chatbot" options={{ drawerLabel: "Chatbot" }} />
      <Drawer.Screen name="profile" options={{ drawerLabel: "Profile" }} />
      <Drawer.Screen name="settings" options={{ drawerLabel: "Setting" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageTitle: {
    color: "#DBEAFE",
    fontSize: 14,
    fontWeight: "500",
  },
});
