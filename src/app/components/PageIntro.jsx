'use client';
import { t } from '@/app/utils/loadTranslations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function PageIntro({ titleKey, subtitleKey }) {
  const router = useRouter();
  const language = useLanguage();

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
