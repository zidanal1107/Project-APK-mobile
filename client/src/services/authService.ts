import axios from "axios";
import * as SecureStore from "expo-secure-store";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "my_daily_campus_token";

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const response = await api.post<AuthResponse>("/auth/register", payload);

  const { user, token } = response.data.data;

  await SecureStore.setItemAsync(TOKEN_KEY, token);

  return user;
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await api.post<AuthResponse>("/auth/login", payload);

  const { user, token } = response.data.data;

  await SecureStore.setItemAsync(TOKEN_KEY, token);

  return user;
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getProfile(): Promise<AuthUser> {
  const token = await getToken();

  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  const response = await api.get<{ success: boolean; data: { user: AuthUser } }>(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.user;
}