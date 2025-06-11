'use client';

import { useState, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function ViewProgress({ progressData, onclose }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const progressStages = [
    t('stage1', language),
    t('stage2', language),
    t('stage3', language),
    t('stage4', language),
    t('stage5', language)
  ];

  return (
    <GenericForm
      titleKey="mentorshipProgressTitle"
      data={{}}
      fields={[]} 
      onChange={() => {}}
      onCloseIcon={onclose}
    >
      <div className="text-start mb-4">
        <p><strong>{t('mentor', language)}:</strong> {progressData.mentorName}</p>
        <p><strong>{t('reservist', language)}:</strong> {progressData.reservistName}</p>
        <p><strong>{t('progressStage', language)}:</strong> {progressData.progressStage ? progressStages[progressData.progressStage - 1] : t('unknownStage', language)}</p>
      </div>

      <div>
        <h4 className="font-bold mb-2">{t('meetingHistory', language)}</h4>

        {progressData.meetings && progressData.meetings.length > 0 ? (
          progressData.meetings.map((meeting, idx) => (
            <div key={idx} className="border p-2 mb-2 rounded">
              <p><strong>{t('meetingDate', language)}:</strong> {meeting.date}</p>
              <p><strong>{t('meetingMode', language)}:</strong> {meeting.mode}</p>
              <p><strong>{t('meetingTopics', language)}:</strong> {meeting.topics}</p>
              <p><strong>{t('meetingTasks', language)}:</strong> {meeting.tasks}</p>
              <p><strong>{t('futurTasks', language)}:</strong> {meeting.futurTasks}</p>
              <p><strong>{t('notes', language)}:</strong> {meeting.note}</p>
            </div>
          ))
        ) : (
          <p>{t('noMeetingsYet', language)}</p>
        )}
      </div>
    </GenericForm>
  );
}
