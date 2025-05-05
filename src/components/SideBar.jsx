'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { getLanguage, toggleLanguage } from "../app/language";
import "./SideBar.css";

export default function SideBar({ navItems }) {
  const [language, setLanguage] = useState(getLanguage());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage(); // מעדכן ב-localStorage וגם מפיץ event
    setLanguage(newLang);
  };

  useEffect(() => {
    setLanguage(getLanguage());

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleLanguageChange = () => {
      setLanguage(getLanguage());
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>

        <div className="menu-icons">
          {!menuOpen && <div className="menu-icon" onClick={toggleMenu}>☰</div>}
          {menuOpen && <div className="close-icon" onClick={toggleMenu}>✖</div>}
        </div>

        <div className={`sidebar ${menuOpen ? 'open' : 'closed'}`} ref={menuRef}>
          <Button
            text={language === "he" ? "English" : "עברית 🇮🇱"}
            onClick={() => {
              handleToggleLanguage();
              setTimeout(() => setMenuOpen(false), 100);
            }}
          />
          <div className="divider"></div>
          {navItems.map(({ labelHe, labelEn, path, onClick }) => (
            <Button
              key={labelEn}
              text={language === "he" ? labelHe : labelEn}
              onClick={() => {
                setMenuOpen(false);
                if (typeof onClick === 'function') {
                  onClick(); // קריאה לפעולה פנימית
                } else if (typeof path === 'string') {
                  router.push(path); // התנהגות רגילה
                }
              }}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
