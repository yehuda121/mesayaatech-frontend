// components/Mentor/MentorshipProgress.jsx
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import { PlusCircle, ChevronRightCircle } from 'lucide-react';

export default function MentorshipProgress({ reservistId, mentorId }) {
  const [language, setLanguage] = useState(getLanguage());
  const [progressData, setProgressData] = useState(null);
  const [editingStage, setEditingStage] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    fetchProgress();
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/getAllProcess?mentorId=${mentorId}&reservistId=${reservistId}`);
      const data = await res.json();
      if (res.ok) setProgressData(data);
      else throw new Error(data.error);
    } catch (err) {
      console.error(err);
      setToast({ message: t('fetchProgressError', language), type: 'error' });
    }
  };

  const handleStageAdvance = () => {
    setConfirmDialog({
      message: t('confirmStageAdvance', language),
      onConfirm: async () => {
        try {
          const res = await fetch('http://localhost:5000/api/advance-stage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mentorId, reservistId })
          });
          if (res.ok) {
            fetchProgress();
            setToast({ message: t('stageAdvanced', language), type: 'success' });
          } else {
            throw new Error();
          }
        } catch {
          setToast({ message: t('stageAdvanceFailed', language), type: 'error' });
        }
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const progressStages = [
    t('stage1', language),
    t('stage2', language),
    t('stage3', language),
    t('stage4', language),
    t('stage5', language)
  ];

  const fields = [
    { key: 'date', labelKey: 'meetingDate', type: 'date', required: true },
    { key: 'mode', labelKey: 'meetingMode', type: 'text', required: true },
    { key: 'topics', labelKey: 'meetingTopics', type: 'textarea' },
    { key: 'tasks', labelKey: 'meetingTasks', type: 'textarea' }
  ];

  const addMeeting = async (meeting) => {
    try {
      const res = await fetch('http://localhost:5000/api/add-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, reservistId, meeting })
      });
      if (res.ok) {
        fetchProgress();
        setToast({ message: t('meetingAdded', language), type: 'success' });
      } else throw new Error();
    } catch {
      setToast({ message: t('meetingAddFailed', language), type: 'error' });
    }
  };

  return (
    <div>
      <h2>{t('mentorshipProgressTitle', language)}</h2>

      {progressData && (
        <div>
          <p>
            {t('currentStage', language)}: <strong>{progressStages[progressData.progressStage - 1]}</strong>
          </p>
          <Button icon={<ChevronRightCircle />} text={t('advanceStage', language)} onClick={handleStageAdvance} />

          <GenericCardSection
            titleKey="meetingHistory"
            items={progressData.meetings || []}
            renderItem={(m) => (
              <div>
                <p><strong>{t('meetingDate', language)}:</strong> {m.date}</p>
                <p><strong>{t('meetingMode', language)}:</strong> {m.mode}</p>
                <p><strong>{t('meetingTopics', language)}:</strong> {m.topics}</p>
                <p><strong>{t('meetingTasks', language)}:</strong> {m.tasks}</p>
              </div>
            )}
          />

          <h3>{t('addMeeting', language)}</h3>
          <GenericForm
            titleKey="addMeeting"
            fields={fields}
            data={{}}
            onChange={() => {}}
            onPrimary={addMeeting}
            primaryLabel="save"
          />
        </div>
      )}

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}
    </div>
  );
}
