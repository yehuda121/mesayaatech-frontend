'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import ReservistDetailsModal from './ReservistDetails';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { UserPlus , FileSearch , EyeOff, Eye, Trash2 } from 'lucide-react';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function FindReservist({ mentorId, onBack }) {
  const language = useLanguage();
  const [reservists, setReservists] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [selectedReservist, setSelectedReservist] = useState(null);
  const [expandedScore, setExpandedScore] = useState(null);

  useEffect(() => {
    const fetchReservists = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/match-reservists-to-mentor?mentorId=${mentorId}`);
        const data = await res.json();
        // Filter out reservists who are not interested in a mentor
        const filteredData = data.filter(r => 
          !r.notInterestedInMentor &&
          r.status === 'approved'
        );
        setReservists(filteredData);
      } catch (err) {
        console.error('Error loading matches:', err);
        setToast({ message: t('errorLoadingReservists', language), type: 'error' });
      }
    };

    fetchReservists();
  }, [language]);

  const handleAssign = async (reservistId) => {
    console.log("mentorId: ", mentorId);
    console.log("reservistId: ", reservistId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/assign-mentor`, {
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
      {r.aboutMe && (
        <p><strong>{t('aboutMe', language)}:</strong> {r.aboutMe}</p>
      )}

      <p className="flex items-center gap-2">
        <strong>{t('matchScore', language)}:</strong> {r.matchScore || 0}%
        <button
          title={t('viewScoreDetails', language)}
          onClick={() =>
            setExpandedScore(prev => prev === r.idNumber ? null : r.idNumber)
          }
          className="ml-1 text-blue-600 hover:text-blue-800"
        >
          {expandedScore === r.idNumber ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </p>

      {expandedScore === r.idNumber && r.scoreBreakdown && (
        <div className="text-sm ml-4 mt-1 space-y-1">
          <p>{t('breakdownProfession', language)}: {r.scoreBreakdown.professionMatch}</p>
          <p>{t('breakdownLocation', language)}: {r.scoreBreakdown.locationMatch}</p>
          <p>{t('breakdownKeywords', language)}: {r.scoreBreakdown.keywordMatch}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-3">
        <button
          onClick={() => setConfirmData({ reservistId: r.idNumber, fullName: r.fullName })}
          title={t('addToMyReservists', language)}
        >
          <UserPlus size={18} />
        </button>

        <button
          onClick={() => setSelectedReservist(r)}
          title={t('viewDetails', language)}
        >
          <FileSearch size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="find-reservist-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-xl font-bold mb-4 mt-5 text-center">{t('findReservist', language)}</h2>

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
