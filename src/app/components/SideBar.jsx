'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button/Button";
import { getLanguage, toggleLanguage } from "../utils/language/language";
import "./SideBar.css";
import { t } from "@/app/utils/loadTranslations";

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
          <button className="SB-lang-button" onClick={() => {
            handleToggleLanguage();
            setTimeout(() => setMenuOpen(false), 100);
          }}>
            <span className="SB-lang-text">{language === "he" ? "English" : "עברית"}</span>
            <img src="/icons/globe-icon.png" alt="globe" className="SB-lang-img" />
          </button>

          <div className="divider"></div>

          {navItems.map(({ labelHe, labelEn, path, onClick, icon }) => (
            <Button
              key={labelEn}
              text={
                <span className="flex items-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
                  {language === "he" ? labelHe : labelEn}
                  {icon && <span className="mr-2 ml-2">{icon}</span>}
                </span>
              }
              onClick={() => {
                setMenuOpen(false);
                if (typeof onClick === "function") {
                  onClick();
                } else if (typeof path === "string") {
                  router.push(path);
                }
              }}
            />
          ))}

          <div className="divider"></div>

          <Button
            text={t("logout", language)}
            onClick={() => {
              localStorage.removeItem("idToken");
              localStorage.removeItem("userId");
              localStorage.removeItem("userType");
              sessionStorage.clear();
              router.push("/");
            }}
          />

        </div>
      </nav>
    </header>
  );
}
