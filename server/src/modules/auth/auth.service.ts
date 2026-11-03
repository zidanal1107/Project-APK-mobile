import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { RegisterInput, LoginInput } from "./auth.schema.js";
import { db } from "../../database/connection.js";
import { env } from "../../config/env.js";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

function generateToken(userId: number): string {
  const secret = env.jwtSecret;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { userId },
    secret,
    {
      expiresIn:
        (env.jwtExpiresIn as jwt.SignOptions["expiresIn"]) || "1d",
    }
  );
}

export async function registerUser(data: RegisterInput) {
  const [existingUsers] = await db.execute<UserRow[]>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [data.email]
  );

  if (existingUsers.length > 0) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)`,
    [data.name, data.email, passwordHash]
  );

  const userId = result.insertId;

  return {
    user: {
      id: userId,
      name: data.name,
      email: data.email,
    },
    token: generateToken(userId),
  };
}

export async function loginUser(data: LoginInput) {
  const [users] = await db.execute<UserRow[]>(
    "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
    [data.email]
  );

  const user = users[0];

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user.id),
  };
}

export async function getUserById(userId: number) {
  const [users] = await db.execute<UserRow[]>(
    "SELECT id, name, email FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  const user = users[0];

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}