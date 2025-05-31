'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage, toggleLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import SideBar from '@/app/components/SideBar';
import { jwtDecode } from 'jwt-decode';
import '@/app/pages/ambassador/home/ambassador.css';

export default function AmbassadorHomePage() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [fullName, setFullName] = useState('');

  // ✅ Validate JWT and redirect if role is invalid
  useEffect(() => {
    setLanguage(getLanguage());

    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded['custom:role'];
        const expectedRole = 'ambassador';

        const roleToPath = {
          reservist: '/pages/reservist/home',
          mentor: '/pages/mentor',
          ambassador: '/pages/ambassador/home',
          admin: '/admin'
        };

        if (role !== expectedRole) {
          router.push(roleToPath[role] || '/login');
          return;
        }

        // fallback name in case Cognito fails to populate localStorage['fullName']
        setFullName(decoded.name || '');
      } catch (err) {
        console.error('Token decoding failed:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [router]);

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
