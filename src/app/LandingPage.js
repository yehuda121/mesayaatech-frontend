'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./LandingPage.css";
import Button from "../components/Button";
import { getLanguage, toggleLanguage } from "./language";

export default function LandingPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="logo-image" />
          </div>

          {/* אייקונים להצגה במסכים קטנים בלבד */}
          <div className="menu-icons">
            {!menuOpen && (
              <div className="menu-icon" onClick={toggleMenu}>
                ☰
              </div>
            )}
            {menuOpen && (
              <div className="close-icon" onClick={toggleMenu}>
                ✖
              </div>
            )}
          </div>

          <div className={`sidebar ${menuOpen ? 'open' : 'closed'}`} ref={menuRef}>
            <Button text={language === "he" ? "English" : "🇮🇱 עברית"} onClick={() => { setMenuOpen(false); handleToggleLanguage(); }} />
            <div className="divider"></div> {/* קו הפרדה קטן */}
            <Button text={language === "he" ? "הרשמה" : "Sign Up"} onClick={() => { setMenuOpen(false); router.push("/register"); }} />
            <Button text={language === "he" ? "התחברות עם חשבון קיים" : "Login"} onClick={() => { setMenuOpen(false); window.location.href = "#login"; }} />
            <Button text={language === "he" ? "דף בית מנטור" : "Mentor homePage"} onClick={() => { setMenuOpen(false); router.push("/pages/mentor/MentorHomePage"); }} />
            <Button text={language === "he" ? "דף בית מילואימניק" : "Reserve homePage"} onClick={() => { setMenuOpen(false); router.push("/pages/reserve/ReserveHomePage"); }} />
            <Button text={language === "he" ? "מנהל" : "admin"} onClick={() => { setMenuOpen(false); router.push("/admin"); }} />
            <Button text={language === "he" ? "אירועים" : "events"} onClick={() => { setMenuOpen(false); router.push("/events"); }} />
          </div>
        </nav>

        <div className="hero">
          <h1>{language === "he" ? "הפלטפורמה לתמיכה במשרתי מילואים" : "The Platform for Reservist Support"}</h1>
          <p>{language === "he" ? "מצא עבודה עם ליווי מקצועי ומותאם אישית" : "Find a job with professional and personalized guidance"}</p>
          <Button text={language === "he" ? "התחל עכשיו" : "Get Started"} onClick={() => window.location.href = "#signup"} />
        </div>
      </header>

      <section className="aboutSection" id="aboutSection">
        <h2>{language === "he" ? "אודות הפרויקט" : "About the Project"}</h2>
        <p>
          {language === "he"
            ? "מסייעטק היא פלטפורמה דיגיטלית ייחודית שנועדה לסייע למשרתי מילואים להשתלב בצורה יעילה בשוק העבודה."
            : "Mesayaatech is a unique digital platform designed to help Israeli reservists integrate effectively into the workforce."}
        </p>
      </section>
    </div>
  );
}
