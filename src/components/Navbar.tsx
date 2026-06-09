import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  authed: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const PUBLIC_LINKS = [
  { label: "home",  path: "/" },
  { label: "blog",  path: "/blog" },
  { label: "about", path: "/about" },
];

const Navbar: React.FC<NavbarProps> = ({ authed, isAdmin, onLogout }) => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    onLogout();
  };

  return (
    <nav className="navbar">
      <button className="nav-logo" onClick={() => navigateTo("/")}> 
        <span className="nav-logo__mark">W</span>
        <span>Wanderlust</span>
      </button>

      <button
        className={`nav-toggle ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen((current) => !current)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        <span />
      </button>

      <div className={`nav-links ${mobileOpen ? "nav-links--open" : ""}`}>
        <button className="nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          ×
        </button>

        {PUBLIC_LINKS.map(({ label, path }) => (
          <button
            key={path}
            className={`nav-link ${pathname === path ? "active" : ""}`}
            onClick={() => navigateTo(path)}
          >
            {label}
          </button>
        ))}

        {authed && (
          <>
            {isAdmin && (
              <button
                className={`nav-link nav-link--admin ${pathname === "/admin" ? "active" : ""}`}
                onClick={() => navigateTo("/admin")}
              >
                admin
              </button>
            )}
            <button className="nav-link nav-link--logout" onClick={handleLogout}>
              sign out
            </button>
          </>
        )}

        {!authed && (
          <button
            className={`nav-link ${pathname === "/auth" ? "active" : ""}`}
            onClick={() => navigateTo("/auth")}
          >
            sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
