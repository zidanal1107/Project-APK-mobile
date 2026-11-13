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

type LoginNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Validasi", "Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Tidak dapat terhubung ke server. Periksa koneksi.";

      Alert.alert("Login gagal", message);
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
              Selamat datang!
            </Text>

            <Text className="mt-2 text-base text-slate-500">
              Login ke akun My Daily Campus kamu.
            </Text>
          </View>

          {/* Form */}
          <View className="rounded-3xl bg-white p-6 shadow-sm">
            <Text className="mb-2 font-semibold text-slate-700">
              Email
            </Text>

            <TextInput
              className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900"
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

            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50">
              <TextInput
                className="flex-1 px-4 py-3.5 text-slate-900"
                placeholder="Masukkan password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />

              <TouchableOpacity
                className="px-4"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Text className="font-medium text-blue-600">
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login button */}
            <TouchableOpacity
              className={`mt-6 items-center rounded-xl bg-blue-600 py-4 ${
                loading ? "opacity-70" : ""
              }`}
              onPress={() => {
                console.log("LOGIN PRESSED", email, password);
                handleLogin()}}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-bold text-white">
                  Login
                </Text>
              )}
            </TouchableOpacity>

            {/* Register navigation */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-slate-500">
                Belum memiliki akun?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
              >
                <Text className="font-bold text-blue-600">
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}