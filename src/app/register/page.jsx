'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import { t } from "@/app/utils/loadTranslations";
import './registrationForm.css';
import { getLanguage, toggleLanguage } from "../utils/language/language";

export default function RegisterPage() {
  const [language, setLanguage] = useState(getLanguage());
  const router = useRouter();

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getLanguage());
    };

    setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const navItems = [
    { labelHe: "דף הבית", labelEn: "Home", path: "/" },
    { labelHe: "התחברות", labelEn: "Login", path: "/login" },
  ];

  return (
    <div>
      <header className="register-header">
        <div className="register-logo">
          <img src="/logo.png" alt="Logo" className="register-logo-img" />
        </div>
        <div className="register-header-buttons">
          <button onClick={() => router.push("/login")}>
            {t('login', language)}
          </button>
          <button onClick={() => router.push("/register")}>
            {t('signup', language)}
          </button>
          <button
            onClick={() => {
              const newLang = toggleLanguage();
              setLanguage(newLang);
            }}
          >
            <span className="lang-icon">🌐</span>
            <span className="lang-text">{language === 'he' ? 'English' : 'עברית'}</span>
          </button>
        </div>
      </header>

      <div className="register-top-section">
        <h1>{t('registerWelcomeTitle', language)}</h1>
        <p>{t('registerWelcomeSubtitle', language)}</p>
      </div>

      <main className="register-about-section">
        <p className="register-options-title">{t('registerAs', language)}</p>
        <div className="register-buttons-group">
          {["reserve", "mentor", "ambassador"].map((type) => (
            <div className="tooltip-wrapper" key={type}>
              <Button
                text={t(`registerAs_${type}`, language)}
                onClick={() => router.push(`/register/${type}`)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );


}
