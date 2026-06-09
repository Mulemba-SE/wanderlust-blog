import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated, logout } from "./api/auth";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import PostPage from "./pages/PostPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import SetupPage from "./pages/SetupPage";
import AdminPage from "./pages/AdminPage";
const Protected = ({ authed, children }) => {
    return authed ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/auth", replace: true });
};
const App = () => {
    const [authed, setAuthed] = useState(isAuthenticated());
    const [isAdminUser, setIsAdminUser] = useState(isAdmin());
    const handleLogin = () => {
        setAuthed(true);
        setIsAdminUser(isAdmin());
    };
    const handleLogout = () => {
        logout();
        setAuthed(false);
        setIsAdminUser(false);
    };
    return (_jsxs("div", { className: "app", children: [_jsx(Navbar, { authed: authed, isAdmin: isAdminUser, onLogout: handleLogout }), _jsx("main", { className: "main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/blog", element: _jsx(BlogPage, {}) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(PostPage, {}) }), _jsx(Route, { path: "/about", element: _jsx(AboutPage, {}) }), _jsx(Route, { path: "/setup", element: _jsx(SetupPage, {}) }), _jsx(Route, { path: "/auth", element: authed
                                ? isAdminUser
                                    ? _jsx(Navigate, { to: "/admin", replace: true })
                                    : _jsx(Navigate, { to: "/", replace: true })
                                : _jsx(AuthPage, { onLogin: handleLogin }) }), _jsx(Route, { path: "/login", element: _jsx(Navigate, { to: "/auth", replace: true }) }), _jsx(Route, { path: "/admin", element: _jsx(Protected, { authed: authed && isAdminUser, children: _jsx(AdminPage, { onUnauthorized: handleLogout }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx("footer", { className: "footer", children: _jsx("p", { children: "\u00A9 Evans_Wanderlust \u00B7 Built with TypeScript + React \u00B7 No algorithms, just good writing." }) })] }));
};
export default App;
