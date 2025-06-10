'use client';

import { useState, useEffect } from 'react';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import { t } from '@/app/utils/loadTranslations';
import { getLanguage } from '@/app/language';

export default function EditMeeting({ meeting, index, mentorId, reservistId, onSave, onClose }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({
    date: meeting.date || '',
    mode: meeting.mode || '',
    topics: meeting.topics || '',
    tasks: meeting.tasks || '',
    futurTasks: meeting.futurTasks || '',
    note: meeting.note || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId,
          reservistId,
          meetingIndex: index,
          updatedMeeting: formData
        })
      });
      if (!res.ok) throw new Error();
      onSave();
    } catch (err) {
      alert(t('saveMeetingFailed', language));
    } finally {
      setIsSaving(false);
    }
  };

  if (!meeting) return <div>{t('meetingNotFound', language)}</div>;

  return (
    <GenericForm
      titleKey="editMeetingTitle"
      fields={[
        { key: 'date', type: 'date' },
        { key: 'mode', type: 'text' },
        { key: 'topics', type: 'textarea' },
        { key: 'tasks', type: 'textarea' },
        { key: 'futurTasks', type: 'textarea' },
        { key: 'note', type: 'textarea' }
      ]}
      data={formData}
      onChange={setFormData}
      onPrimary={handleSave}
      onSecondary={onClose}
      primaryLabel="save"
      secondaryLabel="cancel"
      disabledPrimary={isSaving}
      onCloseIcon={onClose}
    />
  );
}
