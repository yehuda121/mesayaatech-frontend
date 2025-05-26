'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage, toggleLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import SideBar from '@/app/components/SideBar';
import '@/app/pages/ambassador/home/ambassador.css';

export default function AmbassadorHomePage() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setLanguage(getLanguage());

    const tokenName = localStorage.getItem('fullName');
    if (tokenName) setFullName(tokenName);

    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const navItems = [
    {
      labelHe: 'צפה במשרות',
      labelEn: 'View Jobs',
      path: '/pages/jobs'
    },
    {
      labelHe: 'הוסף משרה',
      labelEn: 'Add Job',
      path: '/pages/jobs/newJob'
    }
  ];

  return (
    <div className="reservist-container">
      <SideBar navItems={navItems} />

      <main className="reservist-main">
        <h1 className="reservist-welcome">
          {language === 'he'
            ? `ברוך הבא${fullName ? ', ' + fullName : ' שגריר יקר!'}`
            : `Welcome${fullName ? ', ' + fullName + '!' : ' Ambassador!'}`}
        </h1>

        <div className="reservist-columns">
          <div className="reservist-column">
            <h2 className="reservist-column-title">{t('jobList', language)}</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => router.push('/pages/jobs')}
            >
              {t('viewJobs', language)}
            </button>
          </div>

          <div className="reservist-column">
            <h2 className="reservist-column-title">{t('postNewJob', language)}</h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => router.push('/pages/jobs/newJob')}
            >
              {t('addJob', language)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
