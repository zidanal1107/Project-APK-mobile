import axios from "axios";

import {
  getItem,
  setItem,
  deleteItem,
} from "./strorage";

import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("EXPO_PUBLIC_API_URL belum dikonfigurasi.");
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "my_daily_campus_token";

// =====================================
// REGISTER
// =====================================

export async function register(
  payload: RegisterPayload,
): Promise<AuthUser> {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    payload,
  );

  const { user, token } = response.data.data;

  await setItem(TOKEN_KEY, token);

  return user;
}

// =====================================
// LOGIN
// =====================================

export async function login(
  payload: LoginPayload,
): Promise<AuthUser> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    payload,
  );

  const { user, token } = response.data.data;

  await setItem(TOKEN_KEY, token);

  return user;
}

// =====================================
// GET TOKEN
// =====================================

export async function getToken(): Promise<string | null> {
  return getItem(TOKEN_KEY);
}

// =====================================
// LOGOUT
// =====================================

export async function logout(): Promise<void> {
  await deleteItem(TOKEN_KEY);
}

// =====================================
// GET PROFILE
// =====================================

export async function getProfile(): Promise<AuthUser> {
  const token = await getToken();

  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  const response = await api.get<{
    success: boolean;
    data: {
      user: AuthUser;
    };
  }>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data.user;
}