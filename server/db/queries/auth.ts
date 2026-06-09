import { pool } from "../client";

export interface Admin {
  id: number;
  email: string;
  password: string;
  role: "admin" | "editor";
  name: string;
  phone: string;
  gender: string;
  resetToken?: string | null;
  resetTokenExpiresAt?: string | null;
}

export async function ensureResetTokenColumns(): Promise<void> {
  await pool.query(
    `ALTER TABLE admins
     ADD COLUMN IF NOT EXISTS reset_token TEXT,
     ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ`
  );
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  const { rows } = await pool.query(
    `SELECT id, email, password, role, name, phone, gender,
            reset_token AS "resetToken",
            reset_token_expires_at AS "resetTokenExpiresAt"
     FROM admins
     WHERE email = $1`,
    [email]
  );
  return rows.length ? (rows[0] as Admin) : null;
}

export async function findAdminByResetToken(token: string): Promise<Admin | null> {
  const { rows } = await pool.query(
    `SELECT id, email, password, role, name, phone, gender,
            reset_token AS "resetToken",
            reset_token_expires_at AS "resetTokenExpiresAt"
     FROM admins
     WHERE reset_token = $1`,
    [token]
  );
  return rows.length ? (rows[0] as Admin) : null;
}

export async function countAdmins(): Promise<number> {
  const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM admins`);
  return parseInt(rows[0].count, 10);
}

export async function createAdmin(data: {
  email: string;
  password: string;
  role: "admin" | "editor";
  name: string;
  phone: string;
  gender: string;
}): Promise<Admin> {
  const { rows } = await pool.query(
    `INSERT INTO admins (email, password, role, name, phone, gender)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, password, role, name, phone, gender`,
    [data.email, data.password, data.role, data.name, data.phone, data.gender]
  );
  return rows[0] as Admin;
}

export async function updateAdminPassword(email: string, password: string): Promise<void> {
  await pool.query(
    `UPDATE admins SET password = $1 WHERE email = $2`,
    [password, email]
  );
}

export async function setAdminResetToken(
  email: string,
  resetToken: string,
  expiresAt: string
): Promise<void> {
  await pool.query(
    `UPDATE admins SET reset_token = $1, reset_token_expires_at = $2 WHERE email = $3`,
    [resetToken, expiresAt, email]
  );
}

export async function clearAdminResetToken(email: string): Promise<void> {
  await pool.query(
    `UPDATE admins SET reset_token = NULL, reset_token_expires_at = NULL WHERE email = $1`,
    [email]
  );
}
