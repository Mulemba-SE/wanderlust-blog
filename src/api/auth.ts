const BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Login failed." }));
    throw new Error(err.message ?? "Login failed.");
  }

  const { token } = await res.json();
  localStorage.setItem("token", token);
  return token;
}

export function logout(): void {
  localStorage.removeItem("token");
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Forgot password request failed." }));
    throw new Error(err.message ?? "Forgot password request failed.");
  }

  return res.json();
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword: password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Password reset failed." }));
    throw new Error(err.message ?? "Password reset failed.");
  }

  return res.json();
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getTokenPayload(): Record<string, unknown> | null {
  const token = getToken();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const payload = getTokenPayload();
  return payload?.role === "admin";
}
