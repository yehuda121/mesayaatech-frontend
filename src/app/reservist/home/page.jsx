// app/reservist/home/page.jsx
'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import Events from '@/app/events/page';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function ReservistHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [idNumber, setIdNumber] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());

    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    // Load token from localStorage and decode idNumber
    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdNumber(decoded['custom:idNumber']);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    } else {
      // If no token, redirect to login
      router.push('/login');
    }

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [router]);

  const navItems = [
    {
      labelHe: 'פרטים אישיים',
      labelEn: 'Personal Details',
      path: '/reservist/form',
    },
    {
      labelHe: 'אירועים קרובים',
      labelEn: 'Upcoming Events',
      path: '#events-section',
    },
  ];

  return (
    <div>
      <SideBar navItems={navItems} />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {language === 'he' ? 'ברוך הבא מילואימניק יקר!' : 'Welcome Reservist!'}
        </h1>

        {idNumber && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              {language === 'he' ? 'הפרטים האישיים שלך' : 'Your Personal Information'}
            </h2>
            <p>
              {language === 'he'
                ? 'באפשרותך לגשת לטופס ההרשמה שלך ולעדכן פרטים לפי הצורך'
                : 'You can access and update your registration form as needed.'}
            </p>
            <button
              onClick={() => router.push('/reservist/form')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {language === 'he' ? 'לצפייה בטופס' : 'View Form'}
            </button>
          </section>
        )}

        <section id="events-section">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'he' ? 'אירועים קרובים' : 'Upcoming Events'}
          </h2>
          <Events />
        </section>
      </main>
    </div>
  );
}
