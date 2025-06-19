'use client';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PageIntro({ titleKey, subtitleKey }) {
  const [language, setLanguage] = useState(getLanguage());
  const router = useRouter();

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  return (
    <>
      <div className="mentor-header">
        <img src="/logo.png" alt="Logo" className="mentor-logo" />
        <div className="mentor-header-buttons">
          <button onClick={() => router.push('/login')}>
            {t('mentorLogin', language)}
          </button>
          <button onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}>
            {t('switchLang', language)}
          </button>
        </div>
      </div>

      <div className="mentor-intro-section">
        <h1>{t(titleKey, language)}</h1>
        <p>{t(subtitleKey, language)}</p>
      </div>
    </>
  );
}
