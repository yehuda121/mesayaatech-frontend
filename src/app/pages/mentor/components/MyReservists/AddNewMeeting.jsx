'use client';

import { useState, useEffect } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function AddNewMeeting({ mentorId, reservistId, onAdd,onClose }) {
  const [formData, setFormData] = useState({
    date: '',
    mode: '',
    topics: '',
    tasks: ''
  });
  const [toast, setToast] = useState(null);
  const language = useLanguage();

  const fields = [
    { key: 'date', labelKey: 'meetingDate', type: 'date', required: true },
    { key: 'mode', labelKey: 'meetingMode', type: 'text', required: true },
    { key: 'topics', labelKey: 'meetingTopics', type: 'textarea' },
    { key: 'tasks', labelKey: 'meetingTasks', type: 'textarea' },
    { key: 'futurTasks', labelKey: 'futurTasks', type: 'textarea' },
    { key: 'note', labelKey: 'note', type: 'note' }
  ];

  const validateMeetingForm = () => {
    const { date, mode, topics, tasks, futurTasks, note } = formData;

    if (!date) return t('meetingDateRequired', language);
    if (!mode || mode.trim().length === 0) return t('meetingModeRequired', language);
    if (mode.length > 50) return t('meetingModeTooLong', language);
    if (topics && topics.length > 300) return t('meetingTopicsTooLong', language);
    if (tasks && tasks.length > 300) return t('meetingTasksTooLong', language);
    if (futurTasks && futurTasks.length > 300) return t('futurTasksTooLong', language);
    if (note && note.length > 300) return t('noteTooLong', language);

    return null;
  };

  const handleSubmit = async () => {
    const error = validateMeetingForm();
    if (error) {
      setToast({ message: error, type: 'error' });
      return;
    }
    
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
    <>
      <GenericForm
        titleKey="addMeeting"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSubmit}
        primaryLabel="save"
        onCloseIcon={onClose}
      />
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
