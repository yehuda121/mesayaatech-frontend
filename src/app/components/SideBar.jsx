'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { getLanguage, toggleLanguage } from "../language";
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
          {/* <Button
            text={language === "he" ? "English" : "עברית 🇮🇱"}
            onClick={() => {
              handleToggleLanguage();
              setTimeout(() => setMenuOpen(false), 100);
            }}
          /> */}
          {/* <button className="lang-button" onClick={() => {
            handleToggleLanguage();
            setTimeout(() => setMenuOpen(false), 100);
          }}>
            <span className="lang-text">{language === "he" ? "English" : "עברית"}</span>
            <span className="lang-icon">🌐</span>
          </button> */}

          {/* <button className="lang-button" onClick={() => {
            handleToggleLanguage();
            setTimeout(() => setMenuOpen(false), 100);
          }}>
            <span className="lang-text">{language === "he" ? "English" : "עברית"}</span>
            <svg
              className="lang-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path fill="#002855" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 
                10 10 10-4.48 10-10S17.52 2 12 2zm5 14.5c-.82 0-1.5-.67-1.5-1.5
                0-.83.68-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.68 1.5-1.5 1.5zm-10
                0c-.82 0-1.5-.67-1.5-1.5 0-.83.68-1.5 1.5-1.5s1.5.67 1.5 
                1.5c0 .83-.68 1.5-1.5 1.5zM12 4c1.61 0 3.09.59 
                4.23 1.57-.27.35-.59.66-.94.94C14.9 5.68 13.49 5 12 
                5s-2.9.68-3.29 1.51c-.35-.28-.67-.59-.94-.94C8.91 4.59 
                10.39 4 12 4zM4 12c0-.7.1-1.38.29-2.02.26.12.55.19.86.19.83
                0 1.5-.68 1.5-1.5 0-.24-.06-.46-.16-.66C7.35 7.19 9.6 6 
                12 6s4.65 1.19 5.51 3.01c-.1.2-.16.42-.16.66 0 .82.68 
                1.5 1.5 1.5.31 0 .6-.07.86-.19.19.64.29 1.32.29 
                2.02s-.1 1.38-.29 2.02c-.26-.12-.55-.19-.86-.19-.83 
                0-1.5.68-1.5 1.5 0 .24.06.46.16.66C16.65 16.81 14.4 
                18 12 18s-4.65-1.19-5.51-3.01c.1-.2.16-.42.16-.66 0-.82-.68-1.5-1.5-1.5-.31 
                0-.6.07-.86.19C4.1 13.38 4 12.7 4 12zm8 8c-1.61 0-3.09-.59-4.23-1.57.27-.35.59-.66.94-.94.39.83 
                1.8 1.51 3.29 1.51s2.9-.68 3.29-1.51c.35.28.67.59.94.94C15.09 19.41 13.61 20 12 20z"/>
            </svg>
            
          </button> */}
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
              router.push("/");
            }}
          />

        </div>
      </nav>
    </header>
  );
}
