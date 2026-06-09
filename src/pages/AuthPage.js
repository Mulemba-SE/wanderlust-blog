import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { login, forgotPassword, resetPassword } from "../api/auth";
const AuthPage = ({ onLogin }) => {
    const [view, setView] = useState("login");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        token: "",
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            const apiRoot = import.meta.env.DEV
                ? "/api"
                : import.meta.env.VITE_API_URL
                    ? `${import.meta.env.VITE_API_URL}/api`
                    : "http://localhost:4000/api";
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
                }
                else {
                    setError(json.message ?? "Sign up failed.");
                }
                setLoading(false);
                return;
            }
            setView("login");
            setError(null);
            setMessage("Account created. Please sign in.");
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
        setMessage(null);
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
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            await forgotPassword(form.email);
            setMessage("If that email exists, a reset link has been sent.");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Request failed.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            await resetPassword(form.token, form.password);
            setView("login");
            setMessage("Password reset. Please sign in.");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Password reset failed.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "login-page", children: _jsxs("div", { className: "login-card", style: { width: "min(560px, 90%)", maxWidth: "600px" }, children: [_jsxs("div", { className: "login-card__header", children: [_jsxs("h1", { className: "nav-logo", children: [_jsx("span", { className: "logo-w", children: "W" }), "Wanderlust"] }), _jsx("p", { className: "login-card__sub", children: view === "login"
                                ? "Welcome back"
                                : view === "signup"
                                    ? "Create your account"
                                    : view === "forgot"
                                        ? "Forgot password"
                                        : "Reset password" })] }), view === "login" ? (_jsxs("form", { className: "login-form", onSubmit: handleLoginSubmit, children: [message && _jsx("p", { className: "login-success", children: message }), error && _jsx("p", { className: "login-error", children: error }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "mulembaevans37@gmail.com", required: true, autoFocus: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "At least 8 characters", required: true, minLength: 8 })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Signing in..." : "Sign in" }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "1rem", textAlign: "center" }, children: ["No account yet?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => {
                                        setView("signup");
                                        setError(null);
                                        setMessage(null);
                                    }, children: "Sign up" })] }), _jsx("p", { className: "login-form__sub", style: { marginTop: "0.5rem", textAlign: "center" }, children: _jsx("button", { type: "button", className: "btn-ghost", onClick: () => {
                                    setView("forgot");
                                    setError(null);
                                    setMessage(null);
                                }, children: "Forgot password?" }) })] })) : view === "forgot" ? (_jsxs("form", { className: "login-form", onSubmit: handleForgotSubmit, children: [message && _jsx("p", { className: "login-success", children: message }), error && _jsx("p", { className: "login-error", children: error }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "mulembaevans37@gmail.com", required: true, autoFocus: true })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Sending reset link..." : "Send reset link" }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "1rem", textAlign: "center" }, children: ["Remembered your password?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => {
                                        setView("login");
                                        setError(null);
                                        setMessage(null);
                                    }, children: "Sign in" })] }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "0.5rem", textAlign: "center" }, children: ["Have a reset code?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => {
                                        setView("reset");
                                        setError(null);
                                        setMessage(null);
                                    }, children: "Enter code" })] })] })) : view === "reset" ? (_jsxs("form", { className: "login-form", onSubmit: handleResetSubmit, children: [message && _jsx("p", { className: "login-success", children: message }), error && _jsx("p", { className: "login-error", children: error }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "token", children: "Reset Code" }), _jsx("input", { id: "token", name: "token", type: "text", value: form.token, onChange: handleChange, placeholder: "Enter reset code", required: true, autoFocus: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "password", children: "New password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "At least 8 characters", required: true, minLength: 8 })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Resetting password..." : "Reset password" }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "1rem", textAlign: "center" }, children: ["Back to sign in?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => {
                                        setView("login");
                                        setError(null);
                                        setMessage(null);
                                    }, children: "Sign in" })] })] })) : (_jsxs("form", { className: "login-form", onSubmit: handleSignupSubmit, children: [message && _jsx("p", { className: "login-success", children: message }), error && _jsx("p", { className: "login-error", children: error }), _jsxs("div", { className: "login-form__row", style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }, children: [_jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "firstName", children: "First name" }), _jsx("input", { id: "firstName", name: "firstName", type: "text", value: form.firstName, onChange: handleChange, placeholder: "Evans", required: true })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "lastName", children: "Last name" }), _jsx("input", { id: "lastName", name: "lastName", type: "text", value: form.lastName, onChange: handleChange, placeholder: "Mulemba", required: true })] })] }), _jsx("div", { className: "login-form__row", style: { display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }, children: _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "mulembaevans37@gmail.com", required: true })] }) }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "At least 8 characters", required: true, minLength: 8 })] }), _jsx("button", { className: "btn-primary login-form__submit", type: "submit", disabled: loading, children: loading ? "Creating account..." : "Sign up" }), _jsxs("p", { className: "login-form__sub", style: { marginTop: "1rem", textAlign: "center" }, children: ["Already have an account?", " ", _jsx("button", { type: "button", className: "btn-ghost", onClick: () => {
                                        setView("login");
                                        setError(null);
                                        setMessage(null);
                                    }, children: "Sign in" })] }), _jsx("p", { className: "login-form__sub", style: { marginTop: "0.5rem", textAlign: "center" }, children: "If this admin email already exists, please sign in instead." })] }))] }) }));
};
export default AuthPage;
