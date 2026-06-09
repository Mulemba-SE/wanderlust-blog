import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Setup failed.");
        setLoading(false);
        return;
      }

      navigate("/auth", { replace: true });
    } catch {
      setError("Could not connect to the server.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="nav-logo">
            <span className="logo-w">W</span>anderlust
          </h1>
          <p className="login-card__sub">Create your admin account</p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
            This page is only available once.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}

          <div className="login-form__field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Evans Mulemba"
              required
              autoFocus
            />
          </div>

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
            {loading ? "Creating account..." : "Create admin account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage;
