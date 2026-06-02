import { Router, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { User } from "../models/User.js";
import { config } from "../config.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { usingLocalStore } from "../db.js";
import { localStore } from "../localStore.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts" },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: config.nodeEnv === "production" ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/login", loginLimiter, async (req, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }
  const { email, password } = parsed.data;
  const user = usingLocalStore
    ? await localStore.getUserByEmail(email)
    : await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = jwt.sign({ userId: user._id.toString() }, config.jwtSecret, {
    expiresIn: "7d",
  });
  res.cookie("token", token, cookieOptions);
  res.json({ ok: true, email: user.email });
});

router.post("/logout", (_req, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
  });
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = usingLocalStore
    ? await localStore.getUserById(req.userId || "")
    : await User.findById(req.userId).select("email");
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ email: user.email });
});

export default router;
