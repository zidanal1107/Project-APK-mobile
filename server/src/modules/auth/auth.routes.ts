import { Router } from "express";
import {
  register,
  login,
  getProfile,
} from "./auth.controller.js";
import { authenticateToken } from "./auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getProfile);

export default router;