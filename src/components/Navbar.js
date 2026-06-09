import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const PUBLIC_LINKS = [
    { label: "home", path: "/" },
    { label: "blog", path: "/blog" },
    { label: "about", path: "/about" },
];
const Navbar = ({ authed, isAdmin, onLogout }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);
    const navigateTo = (path) => {
        navigate(path);
        setMobileOpen(false);
    };
    const handleLogout = () => {
        setMobileOpen(false);
        onLogout();
    };
    return (_jsxs("nav", { className: "navbar", children: [_jsxs("button", { className: "nav-logo", onClick: () => navigateTo("/"), children: [_jsx("span", { className: "nav-logo__mark", children: "W" }), _jsx("span", { children: "Wanderlust" })] }), _jsx("button", { className: `nav-toggle ${mobileOpen ? "open" : ""}`, onClick: () => setMobileOpen((current) => !current), "aria-label": mobileOpen ? "Close menu" : "Open menu", "aria-expanded": mobileOpen, children: _jsx("span", {}) }), _jsxs("div", { className: `nav-links ${mobileOpen ? "nav-links--open" : ""}`, children: [_jsx("button", { className: "nav-close", onClick: () => setMobileOpen(false), "aria-label": "Close menu", children: "\u00D7" }), PUBLIC_LINKS.map(({ label, path }) => (_jsx("button", { className: `nav-link ${pathname === path ? "active" : ""}`, onClick: () => navigateTo(path), children: label }, path))), authed && (_jsxs(_Fragment, { children: [isAdmin && (_jsx("button", { className: `nav-link nav-link--admin ${pathname === "/admin" ? "active" : ""}`, onClick: () => navigateTo("/admin"), children: "admin" })), _jsx("button", { className: "nav-link nav-link--logout", onClick: handleLogout, children: "sign out" })] })), !authed && (_jsx("button", { className: `nav-link ${pathname === "/auth" ? "active" : ""}`, onClick: () => navigateTo("/auth"), children: "sign in" }))] })] }));
};
export default Navbar;
