import type { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
} from "./auth.schema.js";
import {
  registerUser,
  loginUser,
  getUserById,
} from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: validation.error.issues.map((issue) => issue.message),
    });
  }

  try {
    const result = await registerUser(validation.data);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred on the server",
    });
  }
}

export async function login(req: Request, res: Response) {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data",
      errors: validation.error.issues.map((issue) => issue.message),
    });
  }

  try {
    const result = await loginUser(validation.data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred on the server",
    });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = res.locals.userId as number;
    const user = await getUserById(userId);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred on the server",
    });
  }
}