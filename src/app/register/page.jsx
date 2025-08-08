'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button/Button";
import { t } from "@/app/utils/loadTranslations";
import './registrationPage.css';
import '@/app/pages/LandingPage/LandingPage.css';
import { getLanguage, toggleLanguage } from "../utils/language/language";

export default function RegisterPage() {
  const [language, setLanguage] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  if (!language) return null;
  
  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <header className="LP-header">
        <div className="LP-logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
        </div>
        <div className="LP-buttons">
          <button onClick={() => router.push("/login")}> {t('login', language)} </button>
          <button onClick={() => router.push("/register")}> {t('signup', language)} </button>
          <button onClick={() => {
            const newLang = toggleLanguage();
            setLanguage(newLang);
          }}>
            <span className="lang-icon">🌐</span>
            <span className="lang-text"> {language === 'he' ? 'English' : 'עברית'} </span>
          </button>
        </div>
      </header>

      <main className='register-hero'>
        <div className="register-overlay-content">
          <h1>{t('registerWelcomeTitle', language)}</h1>
          <p>{t('registerWelcomeSubtitle', language)}</p>

          <p className="register-options-title">{t('registerAs', language)}</p>
          <div className="register-buttons-group">
            {["reserve", "mentor", "ambassador"].map((type) => (
              <div className="tooltip-wrapper" key={type}>
                <Button
                  text={t(`registerAs_${type}`, language)}
                  onClick={() => {
                    localStorage.setItem('language', language); 
                    router.push(`/register/${type}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
