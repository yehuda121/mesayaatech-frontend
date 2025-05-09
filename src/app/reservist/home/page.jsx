'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import Events from '@/app/events/page';
import EditReservistForm from '@/app/reservist/EditReservistForm';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import '@/app/reservist/reservist.css';

export default function ReservistHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [idNumber, setIdNumber] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('events'); // תצוגה פעילה

  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());

    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdNumber(decoded['custom:idNumber']);
        setFullName(decoded.name);
        setEmail(decoded.email);
        setUserType(decoded['custom:role']);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    } else {
      router.push('/login');
    }

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [router]);

  useEffect(() => {
    if (!userType || !idNumber) return;

    const fetchUserForm = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/get-user-form?userType=${userType}&idNumber=${idNumber}`
        );
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Failed to load user form:', err);
      }
    };

    fetchUserForm();
  }, [userType, idNumber]);

  const navItems = [
    {
      labelHe: 'פרטים אישיים',
      labelEn: 'Personal Details',
      path: '#form',
      onClick: () => setView('form')
    },
    {
      labelHe: 'אירועים קרובים',
      labelEn: 'Upcoming Events',
      path: '#events-section',
      onClick: () => setView('events')
    }
  ];

  return (
    <div className="reservist-container">
      <SideBar navItems={navItems} />

      <main className="reservist-main">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {language === 'he'
            ? `ברוך הבא${fullName ? ', ' + fullName : ' מילואימניק יקר!'}` 
            : `Welcome${fullName ? ', ' + fullName + '!' : ' Reservist!'}`}
        </h1>

        {view === 'form' && userData && Object.keys(userData).length > 0 && (
          <EditReservistForm
            userData={userData}
            onSave={(updated) => setUserData(updated)}
          />
        )}


        {view === 'events' && idNumber && fullName && email && (
          <Events idNumber={idNumber} fullName={fullName} email={email} />
        )}
      </main>
    </div>
  );
}
