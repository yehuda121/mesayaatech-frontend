'use client';
import { t } from '@/app/utils/loadTranslations';
import { useRouter } from 'next/navigation';

export default function PageIntro({ titleKey, subtitleKey, onClick, language}) {
  const router = useRouter();

  return (
    <>
      <div className="mentor-header">
        <img src="/logo.png" alt="Logo" className="mentor-logo" />
        <div className="mentor-header-buttons">
          <button onClick={() => router.push('/login')}>
            {t('mentorLogin', language)}
          </button>
          <button onClick={onClick}>
            {t('switchLang', language)}
          </button>
        </div>
      </div>

      <div className="mentor-intro-section">
        <h1>{t(titleKey, language)}</h1>
        {subtitleKey && (
          <p>{t(subtitleKey, language)}</p>
        )}
      </div>
    </>
  );
}
