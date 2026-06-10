import crypto from "crypto";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAdminEmail, getFrontendUrl } from "../config/env";
import { requireAuth, AuthRequest } from "../middleware/auth";
import {
  findAdminByEmail,
  findAdminByResetToken,
  countAdmins,
  createAdmin,
  updateAdminPassword,
  setAdminResetToken,
  clearAdminResetToken,
} from "../db/queries/auth";
import { sendPasswordResetEmail } from "../services/mailer";

const router = Router();

// ── One-time setup ────────────────────────────────────────────────────────────
// Creates the first admin account. Returns 403 if an admin already exists,
// so this endpoint is self-sealing — it can only succeed once.

router.post("/auth/setup", async (req, res) => {
  try {
    const existing = await countAdmins();
    if (existing > 0) {
      return res.status(403).json({ message: "Setup already complete." });
    }

    const { name, email, password } = req.body;
    const seededAdminEmail = getAdminEmail();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (seededAdminEmail && email !== seededAdminEmail) {
      return res.status(403).json({ message: "Setup is restricted to the seeded admin email." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await createAdmin({
      email,
      password: hashed,
      role: "admin",
      name,
      phone: "",
      gender: "",
    });

    res.status(201).json({ message: "Admin account created. You can now sign in." });
  } catch (err) {
    console.error("[POST /auth/setup]", err);
    res.status(500).json({ message: "Setup failed." });
  }
});

// ── Signup ────────────────────────────────────────────────────────────────────

router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, phone, gender, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const seededAdminEmail = getAdminEmail();
    if (seededAdminEmail && email === seededAdminEmail) {
      return res.status(409).json({ message: "This admin email is reserved. Please sign in or reset the password." });
    }

    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await createAdmin({
      email,
      password: hashed,
      role: "editor",
      name,
      phone: phone || "",
      gender: gender || "",
    });

    res.status(201).json({ message: "Account created. You can now sign in." });
  } catch (err) {
    console.error("[POST /auth/signup]", err);
    res.status(500).json({ message: "Sign up failed." });
  }
});

router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const admin = await findAdminByEmail(email);
    if (admin) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 20).toISOString(); // 20 minutes
      await setAdminResetToken(email, resetToken, expiresAt);

      const frontendUrl = getFrontendUrl();
      const resetLink = `${frontendUrl}/auth/reset?token=${resetToken}`;
      try {
        await sendPasswordResetEmail(email, resetLink);
      } catch (mailError) {
        console.error("[sendPasswordResetEmail]", mailError);
        console.log(`Password reset link for ${email}: ${resetLink}`);
      }
    }

    res.json({
      message:
        "If that email exists, a password reset link has been sent. Check your email.",
    });
  } catch (err) {
    console.error("[POST /auth/forgot-password]", err);
    res.status(500).json({ message: "Failed to request password reset." });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const admin = await findAdminByResetToken(token);
    if (!admin || !admin.resetTokenExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    if (new Date(admin.resetTokenExpiresAt) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await updateAdminPassword(admin.email, hashed);
    await clearAdminResetToken(admin.email);

    res.json({ message: "Password has been reset. You can now sign in." });
  } catch (err) {
    console.error("[POST /auth/reset-password]", err);
    res.status(500).json({ message: "Password reset failed." });
  }
});

router.post("/auth/change-password", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const auth = req.admin;

    if (!auth) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const existingAdmin = await findAdminByEmail(auth.email);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Account not found." });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, existingAdmin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await updateAdminPassword(auth.email, hashed);

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("[POST /auth/change-password]", err);
    res.status(500).json({ message: "Password change failed." });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Use the role stored in the database rather than re-deriving it from
    // ADMIN_EMAIL. This means roles assigned at seed time (or via the DB
    // directly) are respected, and promoting a user to "admin" in the DB
    // takes effect on their next login without any code change.
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("[POST /auth/login]", err);
    res.status(500).json({ message: "Login failed." });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.json({ message: "Logged out successfully." });
});

export default router;
