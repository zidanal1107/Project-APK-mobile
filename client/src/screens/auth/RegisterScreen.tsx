import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "../../context/AuthContext";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";

type RegisterNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Validasi", "Semua field wajib diisi.");
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert("Validasi", "Nama minimal 2 karakter.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Validasi", "Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Validasi",
        "Konfirmasi password tidak cocok."
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // AuthContext mengubah status autentikasi.
      // RootNavigation otomatis menampilkan AppNavigator.
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Register gagal. Periksa koneksi server.";

      Alert.alert("Register gagal", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-blue-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-10">
          {/* Header */}
          <View className="mb-8">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <Text className="text-3xl font-bold text-white">M</Text>
            </View>

            <Text className="text-3xl font-bold text-slate-900">
              Buat akun
            </Text>

            <Text className="mt-2 text-base text-slate-500">
              Mulai kelola aktivitas kampusmu.
            </Text>
          </View>

          {/* Form */}
          <View className="rounded-3xl bg-white p-6 shadow-sm">
            <Text className="mb-2 font-semibold text-slate-700">
              Nama lengkap
            </Text>

            <TextInput
              className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900"
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />

            <Text className="mb-2 font-semibold text-slate-700">
              Email
            </Text>

            <TextInput
              className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900"
              placeholder="Masukkan email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Text className="mb-2 font-semibold text-slate-700">
              Password
            </Text>

            <TextInput
              className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900"
              placeholder="Minimal 8 karakter"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />

            <Text className="mb-2 font-semibold text-slate-700">
              Konfirmasi password
            </Text>

            <TextInput
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900"
              placeholder="Ulangi password"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity
              className="mt-3 self-end"
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Text className="font-medium text-blue-600">
                {showPassword
                  ? "Sembunyikan password"
                  : "Lihat password"}
              </Text>
            </TouchableOpacity>

            {/* Register button */}
            <TouchableOpacity
              className={`mt-5 items-center rounded-xl bg-blue-600 py-4 ${
                loading ? "opacity-70" : ""
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-bold text-white">
                  Register
                </Text>
              )}
            </TouchableOpacity>

            {/* Login navigation */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-slate-500">
                Sudah memiliki akun?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                disabled={loading}
              >
                <Text className="font-bold text-blue-600">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}