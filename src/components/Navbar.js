import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useLocation } from "react-router-dom";
const PUBLIC_LINKS = [
    { label: "home", path: "/" },
    { label: "blog", path: "/blog" },
    { label: "about", path: "/about" },
];
const Navbar = ({ authed, isAdmin, onLogout }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (_jsxs("nav", { className: "navbar", children: [_jsxs("button", { className: "nav-logo", onClick: () => navigate("/"), children: [_jsx("span", { className: "nav-logo__mark", children: "W" }), _jsx("span", { children: "Wanderlust" })] }), _jsxs("div", { className: "nav-links", children: [PUBLIC_LINKS.map(({ label, path }) => (_jsx("button", { className: `nav-link ${pathname === path ? "active" : ""}`, onClick: () => navigate(path), children: label }, path))), authed && (_jsxs(_Fragment, { children: [isAdmin && (_jsx("button", { className: `nav-link nav-link--admin ${pathname === "/admin" ? "active" : ""}`, onClick: () => navigate("/admin"), children: "admin" })), _jsx("button", { className: "nav-link nav-link--logout", onClick: onLogout, children: "sign out" })] })), !authed && (_jsx(_Fragment, { children: _jsx("button", { className: `nav-link ${pathname === "/auth" ? "active" : ""}`, onClick: () => navigate("/auth"), children: "sign in" }) }))] })] }));
};
export default Navbar;
