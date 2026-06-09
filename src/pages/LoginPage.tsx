import React, { useState } from "react";
import { login } from "../api/auth";
import { useLocation } from "react-router-dom";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const location = useLocation();
  const startsAtLogin = location.pathname === "/login";
  const [showLogin, setShowLogin] = useState(startsAtLogin);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL ?? "http://localhost:4000"
        }/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const json = await res.json().catch(() => ({ message: "Sign up failed." }));

      if (!res.ok) {
        setError(json.message ?? "Sign up failed.");
        setLoading(false);
        return;
      }

      setShowLogin(true);
      setError(null);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="nav-logo">
            <span className="logo-w">W</span>
            Wanderlust
          </h1>
          <p className="login-card__sub">
            {showLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {showLogin ? (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            {error && <p className="login-error">{error}</p>}
            <div className="login-form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mulembaevans37@gmail.com"
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
                onClick={() => setShowLogin(false)}
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleSignupSubmit}>
            {error && <p className="login-error">{error}</p>}
            {["name", "phone", "gender"].map((field) => (
              <div className="login-form__field" key={field}>
                <label htmlFor={field}>
                  {field === "name"
                    ? "Full name"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={
                    field === "name"
                      ? "Evans Mulemba"
                      : field === "phone"
                      ? "+254700000000"
                      : "male / female / other"
                  }
                />
              </div>
            ))}
            <div className="login-form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mulembaevans37@gmail.com"
                required
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
                onClick={() => setShowLogin(true)}
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
