import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : "http://localhost:4000/api";
const SetupPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSubmit = async (e) => {
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
        }
        catch {
            setError("Could not connect to the server.");
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "login-page", children: _jsxs("div", { className: "login-card", children: [_jsxs("div", { className: "login-card__header", children: [_jsxs("h1", { className: "nav-logo", children: [_jsx("span", { className: "logo-w", children: "W" }), "anderlust"] }), _jsx("p", { className: "login-card__sub", children: "Create your admin account" }), _jsx("p", { style: { fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }, children: "This page is only available once." })] }), _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [error && _jsx("p", { className: "login-error", children: error }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "name", children: "Full name" }), _jsx("input", { id: "name", name: "name", type: "text", value: form.name, onChange: handleChange, placeholder: "Evans Mulemba", required: true, autoFocus: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "mulembaevans37@gmail.com", required: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "At least 8 characters", required: true, minLength: 8 })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Creating account..." : "Create admin account" })] })] }) }));
};
export default SetupPage;
