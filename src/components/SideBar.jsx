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
    const newLang = toggleLanguage();
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
    <div className={`sidebar ${menuOpen ? 'open' : 'closed'}`} ref={menuRef}>
      <button className="lang-button" onClick={() => {
        handleToggleLanguage();
        setTimeout(() => setMenuOpen(false), 100);
      }}>
        <span className="lang-text">{language === "he" ? "English" : "עברית"}</span>
        <img src="/icons/globe-icon.png" alt="globe" className="lang-img" />
      </button>

      <div className="divider"></div>

      {navItems.map(({ labelHe, labelEn, path, onClick }) => (
        <Button
          key={labelEn}
          text={language === "he" ? labelHe : labelEn}
          onClick={() => {
            setMenuOpen(false);
            if (typeof onClick === 'function') {
              onClick();
            } else if (typeof path === 'string') {
              router.push(path);
            }
          }}
        />
      ))}
    </div>
  );
}
