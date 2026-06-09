import React, { useState } from "react";
import { login, forgotPassword, resetPassword } from "../api/auth";

type AuthView = "login" | "signup" | "forgot" | "reset";

const AuthPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>("login");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    token: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const apiRoot = import.meta.env.DEV
        ? "/api"
        : import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : "/api";

      const payload = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      const res = await fetch(`${apiRoot}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({ message: "Sign up failed." }));

      if (!res.ok) {
        if (json.message === "Email already in use.") {
          setError("Email already exists. Please sign in.");
        } else {
          setError(json.message ?? "Sign up failed.");
        }
        setLoading(false);
        return;
      }

      setView("login");
      setError(null);
      setMessage("Account created. Please sign in.");
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await login(form.email, form.password);
      onLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await forgotPassword(form.email);
      setMessage("If that email exists, a reset link has been sent.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await resetPassword(form.token, form.password);
      setView("login");
      setMessage("Password reset. Please sign in.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
    <div className="login-card" style={{ width: "min(560px, 90%)", maxWidth: "600px" }}>
        <div className="login-card__header">
          <h1 className="nav-logo">
            <span className="logo-w">W</span>
            Wanderlust
          </h1>
          <p className="login-card__sub">
            {view === "login"
              ? "Welcome back"
              : view === "signup"
              ? "Create your account"
              : view === "forgot"
              ? "Forgot password"
              : "Reset password"}
          </p>
        </div>

        {view === "login" ? (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            {message && <p className="login-success">{message}</p>}
            {error && <p className="login-error">{error}</p>}
            <div className="login-form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                autoFocus
              />
            </div>
            <div className="login-form__field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>
            <button
              className="btn-primary login-form__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p
              className="login-form__sub"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              No account yet?{" "}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setView("signup");
                  setError(null);
                  setMessage(null);
                }}
              >
                Sign up
              </button>
            </p>
            <p
              className="login-form__sub"
              style={{ marginTop: "0.5rem", textAlign: "center" }}
            >
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setView("forgot");
                  setError(null);
                  setMessage(null);
                }}
              >
                Forgot password?
              </button>
            </p>
          </form>
        ) : view === "forgot" ? (
          <form className="login-form" onSubmit={handleForgotSubmit}>
            {message && <p className="login-success">{message}</p>}
            {error && <p className="login-error">{error}</p>}
            <div className="login-form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                autoFocus
              />
            </div>
            <button
              className="btn-primary login-form__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending reset link..." : "Send reset link"}
            </button>
            <p
              className="login-form__sub"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              Remembered your password?{" "}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setView("login");
                  setError(null);
                  setMessage(null);
                }}
              >
                Sign in
              </button>
            </p>
            <p
              className="login-form__sub"
              style={{ marginTop: "0.5rem", textAlign: "center" }}
            >
              Have a reset code?{" "}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setView("reset");
                  setError(null);
                  setMessage(null);
                }}
              >
                Enter code
              </button>
            </p>
          </form>
        ) : view === "reset" ? (
          <form className="login-form" onSubmit={handleResetSubmit}>
            {message && <p className="login-success">{message}</p>}
            {error && <p className="login-error">{error}</p>}
            <div className="login-form__field">
              <label htmlFor="token">Reset Code</label>
              <input
                id="token"
                name="token"
                type="text"
                value={form.token}
                onChange={handleChange}
                placeholder="Enter reset code"
                required
                autoFocus
              />
            </div>
            <div className="login-form__field">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>
            <button
              className="btn-primary login-form__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
            <p
              className="login-form__sub"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              Back to sign in?{" "}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setView("login");
                  setError(null);
                  setMessage(null);
                }}
              >
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleSignupSubmit}>
            {message && <p className="login-success">{message}</p>}
            {error && <p className="login-error">{error}</p>}
            <div
              className="login-form__row"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}
            >
              <div className="login-form__field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  
                  required
                />
              </div>
              <div className="login-form__field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                 
                  required
                />
              </div>
            </div>
            <div
              className="login-form__row"
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}
            >
              <div className="login-form__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>
            <div className="login-form__field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>
            <button
              className="btn-primary login-form__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
            <p
              className="login-form__sub"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              Already have an account?{" "}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setView("login");
                  setError(null);
                  setMessage(null);
                }}
              >
                Sign in
              </button>
            </p>
            <p
              className="login-form__sub"
              style={{ marginTop: "0.5rem", textAlign: "center" }}
            >
              If this admin email already exists, please sign in instead.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
