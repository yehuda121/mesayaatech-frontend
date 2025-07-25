'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { UserCog } from 'lucide-react';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function MyReservists({ onManageReservist }) {
  const [reservists, setReservists] = useState([]);
  const router = useRouter();
  const language = useLanguage();

  useEffect(() => {
    const token = sessionStorage.getItem('idToken');
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
      // console.log("mentorId: ", mentorId);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/get-my-reservists?mentorId=${mentorId}`);
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
          type="button"
          title={t('manageReservist', language)}
          onClick={() => {
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
      data={Array.isArray(reservists) ? reservists : []}
      renderCard={renderReservistCard}
      emptyTextKey="noReservistsAssigned"
    />
  );
}
