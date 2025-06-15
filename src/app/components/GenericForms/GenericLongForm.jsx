'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import './GenericLongForm.css';

export default function GenericLongForm({ titleKey, children, onCloseIcon }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  return (
    <div className="GLF-overlay">
      <div className="GLF-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
        {onCloseIcon && (
          <button className="GLF-close-button" onClick={onCloseIcon} aria-label="Close">✖</button>
        )}
        <h2 className="GLF-title">{t(titleKey, language)}</h2>
        <div className="GLF-content">{children}</div>
      </div>
    </div>
  );
}
