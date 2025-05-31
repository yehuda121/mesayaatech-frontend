'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLanguage, toggleLanguage } from "../../language";
import { t } from "@/app/utils/loadTranslations";
import "./LandingPage.css";

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    setLanguage(getLanguage());

    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  return (
    <div>
      <header className="landing-header">
        <div className="landing-logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
        </div>
        <div className="landing-buttons">
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

      <div className="LPtop_Section">
        <h1>{t('landingTitle', language)}</h1>
        <p>{t('landingSubtitle', language)}</p>
      </div>

      <main className="LPabout_main">
        <section className="LPaboutSection">
          <h2>{t('aboutProject', language)}</h2>
          <p>{t('aboutText', language)}</p>
        </section>
      </main>
    </div>
  );
}

