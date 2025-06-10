'use client';

import { useState, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function AddNewMeeting({ mentorId, reservistId, onAdd,onClose }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({
    date: '',
    mode: '',
    topics: '',
    tasks: ''
  });

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fields = [
    { key: 'date', labelKey: 'meetingDate', type: 'date', required: true },
    { key: 'mode', labelKey: 'meetingMode', type: 'text', required: true },
    { key: 'topics', labelKey: 'meetingTopics', type: 'textarea' },
    { key: 'tasks', labelKey: 'meetingTasks', type: 'textarea' },
    { key: 'futurTasks', labelKey: 'futurTasks', type: 'textarea' },
    { key: 'note', labelKey: 'note', type: 'note' }
  ];

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/add-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, reservistId, meeting: formData })
      });

      if (res.ok) {
        onAdd();
      } else {
        alert(t('meetingAddFailed', language));
      }
    } catch (err) {
      console.error(err);
      alert(t('meetingAddFailed', language));
    }
  };

  return (
    <GenericForm
      titleKey="addMeeting"
      fields={fields}
      data={formData}
      onChange={setFormData}
      onPrimary={handleSubmit}
      primaryLabel="save"
      onCloseIcon={onClose}
    />
  );
}
