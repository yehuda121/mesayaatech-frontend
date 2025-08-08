'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLanguage, toggleLanguage } from "../../utils/language/language";
import { t } from "@/app/utils/loadTranslations";
import "./LandingPage.css";
import Button from "@/app/components/Button/Button";

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const lang = getLanguage();
    setLanguage(lang);

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
          <button onClick={() => router.push("/login")}>{t('login', language)}</button>
          <button onClick={() => router.push("/register")}>{t('signup', language)}</button>
          <button onClick={() => {
              const newLang = toggleLanguage();
              setLanguage(newLang);
            }}
          >
            <span className="lang-icon">🌐</span>
            <span className="lang-text">{language === 'he' ? 'English' : 'עברית'}</span>
          </button>
        </div>
      </header>

      <div className="LP-top_Section with-image">
        <img src="/landingPage.png" alt="Reservist collage" className="LP-image" />
        <div className="LP-top_Content">
          <h1>{t('landingTitle', language)}</h1>
          <p>{t('landingSubtitle', language)}</p>
        </div>
        <div className="LP-top_Gradient"></div>
      </div>

      <main className="LP-about_main">
        <section className="LP-about-section">
          <h2>{t('aboutProject', language)}</h2>

          <div className="LP-about-grid">
            <div className="LP-about-card">
              <h3>{t('aboutGoalTitle', language)}</h3>
              <p>{t('aboutGoalText', language)}</p>
            </div>
            <div className="LP-about-card">
              <h3>{t('aboutFeaturesTitle', language)}</h3>
              <p>{t('aboutFeaturesText', language)}</p>
            </div>
            <div className="LP-about-card">
              <h3>{t('aboutAudienceTitle', language)}</h3>
              <p>{t('aboutAudienceText', language)}</p>
            </div>
          </div>

          <Button  onClick={() => router.push("/register")}>
            {t('joinNow', language)}
          </Button>
        </section>
      </main>
    </div>
  );
}
