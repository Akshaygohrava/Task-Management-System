import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();

  const showToggle = location.pathname === "/";

  return (
    <div className={`layout-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
      {showToggle && (
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
