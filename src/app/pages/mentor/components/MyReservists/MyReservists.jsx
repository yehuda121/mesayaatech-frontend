'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { UserCog } from 'lucide-react';
import Button from '@/app/components/Button';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';

export default function MyReservists({ onManageReservist }) {
  const [language, setLanguage] = useState(getLanguage());
  const [reservists, setReservists] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (!token) return;

    let mentorId = null;
    try {
      const decoded = jwtDecode(token);
      mentorId = decoded['custom:idNumber'];
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return;
    }

    if (!mentorId) return;

    const fetchReservists = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get-my-reservists?mentorId=${mentorId}`);
        const data = await res.json();
        if (Array.isArray(data)) setReservists(data);
      } catch (err) {
        console.error('Failed to load reservists:', err);
      }
    };

    fetchReservists();
  }, []);

  const renderReservistCard = (res) => (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-lg">{res.fullName}</h3>
      <p>{t('idNumber', language)}: {res.idNumber}</p>
      <div className="mt-2">
        <button
          title={t('manageReservist', language)}
          onClick={() => {
            // console.log('Managing reservist:', res.idNumber);
            onManageReservist(res.idNumber)
          }}
        ><UserCog size={25} /></button>
      </div>
    </div>
  );

  return (
    <GenericCardSection
      titleKey="myReservistsTitle"
      filters={[]}
      data={reservists}
      renderCard={renderReservistCard}
      emptyTextKey="noReservistsAssigned"
    />
  );
}
