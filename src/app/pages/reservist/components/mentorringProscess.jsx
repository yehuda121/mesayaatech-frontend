'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function MentorshipProgress({ reservistId, mentorId }) {
  const language = useLanguage();
  const [progressData, setProgressData] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const extractMentorIdNumber = (mentorId) => {
    if (!mentorId || typeof mentorId !== 'string') return null;
    const parts = mentorId.split('#');
    return parts.length === 2 ? parts[1] : null;
  };

  useEffect(() => {
    if (mentorId && reservistId) {
      fetchProgress();
    }
  }, [mentorId, reservistId]);

  const fetchProgress = async () => {
    const mentorIdNumber = extractMentorIdNumber(mentorId);

    if (!mentorIdNumber || !reservistId) {
      return; 
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/init-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId: mentorIdNumber, reservistId })
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/getMentorshipProgress?mentorId=${mentorIdNumber}&reservistId=${reservistId}`);
      const data = await res.json();
      if (res.ok) setProgressData(data);
      else throw new Error(data.error);
    } catch (err) {
      console.error(err);
      setToast({ message: t('fetchProgressError', language), type: 'error' });
    }
  };

  const progressStages = [
    t('stage1', language),
    t('stage2', language),
    t('stage3', language),
    t('stage4', language),
    t('stage5', language)
  ];

  return (
    <div>
      <h2 className='font-bold text-center text-xl'>{t('mentorshipProgressTitle', language)}</h2>

      {!mentorId && (
        <p className="text-center text-lg text-red-600 mt-4">
          {t('noMentorAssigned', language)}
        </p>
      )}

      {mentorId && progressData && (
        <div dir={language === 'he' ? 'rtl' : 'ltr'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'start' }}>
            <h1 className='font-bold'>{t('mentorName', language)}:</h1>
            <h1>{progressData.mentorName}</h1>
          </div>
          <p className="mt-4 mb-4 text-lg">
            <span 
              className={`px-3 py-1 rounded-full font-semibold inline-block ${
                progressData?.progressStage === 1 ? 'bg-gray-200 text-gray-800' :
                progressData?.progressStage === 2 ? 'bg-blue-200 text-blue-800' :
                progressData?.progressStage === 3 ? 'bg-yellow-200 text-yellow-800' :
                progressData?.progressStage === 4 ? 'bg-orange-200 text-orange-800' :
                progressData?.progressStage === 5 ? 'bg-green-200 text-green-800' :
                'bg-red-200 text-red-800'
              }`}
            >
              {Number.isInteger(progressData?.progressStage) &&
              progressData.progressStage >= 1 &&
              progressData.progressStage <= progressStages.length
                ? progressStages[progressData.progressStage - 1]
                : t('unknownStage', language)}
            </span>
          </p>

          <GenericCardSection
            titleKey="meetingHistory"
            filters={[]}
            data={(progressData.meetings || []).map((m, i) => ({ ...m, __index: i }))}
            emptyTextKey="noMeetingsYet"
            renderCard={(m) => (
              <div>
                <p><strong>{t('meetingDate', language)}:</strong> {m.date}</p>
                <p><strong>{t('meetingMode', language)}:</strong> {m.mode}</p>
                <p><strong>{t('meetingTopics', language)}:</strong> {m.topics}</p>
                <p><strong>{t('meetingTasks', language)}:</strong> {m.tasks}</p>
                <p><strong>{t('futurTasks', language)}:</strong> {m.futurTasks}</p>
                <p><strong>{t('note', language)}:</strong> {m.note}</p>
              </div>
            )}
          />
        </div>
      )}

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}
    </div>
  );
}
