'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';
import ToastMessage from '@/app/components/notifications/ToastMessage';
import ReservistDetailsModal from './ReservistDetails';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import Button from '@/app/components/Button';

export default function FindReservist({ mentorId, onBack }) {
  const [language, setLanguage] = useState(getLanguage());
  const [reservists, setReservists] = useState([]);
  const [showContact, setShowContact] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [selectedReservist, setSelectedReservist] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const fetchReservists = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/match-reservists-to-mentor?mentorId=${mentorId}`);
        const data = await res.json();
        setReservists(data);
      } catch (err) {
        console.error('Error loading matches:', err);
        setToast({ message: t('errorLoadingReservists', language), type: 'error' });
      }
    };

    fetchReservists();
  }, [language]);

  const handleAssign = async (reservistId) => {
    try {
      const res = await fetch('http://localhost:5000/api/assign-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, reservistId }),
      });

      if (res.ok) {
        setReservists((prev) => prev.filter((r) => r.idNumber !== reservistId));
        setToast({ message: t('assignedSuccess', language), type: 'success' });
      } else {
        throw new Error();
      }
    } catch {
      setToast({ message: t('assignedFail', language), type: 'error' });
    }
  };

  const renderCard = (r) => (
    <div key={r.idNumber} className="reservist-card">
      <h3 className="text-lg font-bold text-blue-700 mb-2">{r.fullName}</h3>
      <p><strong>{t('fields', language)}:</strong> {r.fields?.join(', ')}</p>
      <p><strong>{t('location', language)}:</strong> {r.location}</p>
      <p><strong>{t('matchScore', language)}:</strong> {r.matchScore || 0}%</p>
      {r.aboutMe && (
        <p><strong>{t('aboutMe', language)}:</strong> {r.aboutMe}</p>
      )}

      {showContact === r.idNumber && (
        <div className="text-sm mt-1 text-gray-600">
          <p><strong>{t('email', language)}:</strong> {r.email}</p>
          <p><strong>{t('phone', language)}:</strong> {r.phone}</p>
          {r.scoreBreakdown && (
            <>
              <p>{t('breakdownProfession', language)}: {r.scoreBreakdown.professionMatch}</p>
              <p>{t('breakdownLocation', language)}: {r.scoreBreakdown.locationMatch}</p>
              <p>{t('breakdownKeywords', language)}: {r.scoreBreakdown.keywordMatch}</p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <Button
          text={showContact === r.idNumber ? t('hideContact', language) : t('showContact', language)}
          onClick={() => setShowContact(prev => prev === r.idNumber ? null : r.idNumber)}
        />

        <Button
          text={t('addToMyReservists', language)}
          onClick={() => setConfirmData({ reservistId: r.idNumber, fullName: r.fullName })}
        />

        <Button
          text={t('viewDetails', language)}
          onClick={() => setSelectedReservist(r)}
        />
      </div>


    </div>
  );

  return (
    <div className="find-reservist-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-xl font-bold mb-4">{t('findReservist', language)}</h2>

      <GenericCardSection
        titleKey="recommendedReservists"
        filters={[]}
        data={reservists}
        renderCard={renderCard}
      />

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmData && (
        <ConfirmDialog
          title={t('confirmAssignTitle', language)}
          message={`${t('confirmAssignText', language)} ${confirmData.fullName}?`}
          onConfirm={() => {
            handleAssign(confirmData.reservistId);
            setConfirmData(null);
          }}
          onCancel={() => setConfirmData(null)}
        />
      )}

      {selectedReservist && (
        <ReservistDetailsModal
          reservist={selectedReservist}
          onClose={() => setSelectedReservist(null)}
        />
      )}
    </div>
  );
}
