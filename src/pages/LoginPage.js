import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { login } from "../api/auth";
import { useLocation } from "react-router-dom";
const LoginPage = ({ onLogin }) => {
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
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json().catch(() => ({ message: "Sign up failed." }));
            if (!res.ok) {
                setError(json.message ?? "Sign up failed.");
                setLoading(false);
                return;
            }
            setShowLogin(true);
            setError(null);
        }
        catch {
            setError("Could not connect to the server.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(form.email, form.password);
            onLogin();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Login failed.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "login-page", children: _jsxs("div", { className: "login-card", children: [_jsxs("div", { className: "login-card__header", children: [_jsxs("h1", { className: "nav-logo", children: [_jsx("span", { className: "logo-w", children: "W" }), "Wanderlust"] }), _jsx("p", { className: "login-card__sub", children: showLogin ? "Welcome back" : "Create your account" })] }), showLogin ? (_jsxs("form", { className: "login-form", onSubmit: handleLoginSubmit, children: [error && _jsx("p", { className: "login-error", children: error }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "mulembaevans37@gmail.com", required: true, autoFocus: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "At least 8 characters", required: true, minLength: 8 })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Signing in..." : "Sign in" }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "1rem", textAlign: "center" }, children: ["No account yet?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => setShowLogin(false), children: "Sign up" })] })] })) : (_jsxs("form", { className: "login-form", onSubmit: handleSignupSubmit, children: [error && _jsx("p", { className: "login-error", children: error }), ["name", "phone", "gender"].map((field) => (_jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: field, children: field === "name"
                                        ? "Full name"
                                        : field.charAt(0).toUpperCase() + field.slice(1) }), _jsx("input", { id: field, name: field, type: "text", value: form[field], onChange: handleChange, placeholder: field === "name"
                                        ? "Evans Mulemba"
                                        : field === "phone"
                                            ? "+254700000000"
                                            : "male / female / other" })] }, field))), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "mulembaevans37@gmail.com", required: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "At least 8 characters", required: true, minLength: 8 })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Creating account..." : "Sign up" }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "1rem", textAlign: "center" }, children: ["Already have an account?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => setShowLogin(true), children: "Sign in" })] })] }))] }) }));
};
export default LoginPage;
