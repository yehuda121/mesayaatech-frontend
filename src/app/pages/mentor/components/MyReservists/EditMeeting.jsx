'use client';

import { useState, useEffect } from 'react';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function EditMeeting({ meeting, index, mentorId, reservistId, onSave, onClose }) {
  const [formData, setFormData] = useState({
    date: meeting.date || '',
    mode: meeting.mode || '',
    topics: meeting.topics || '',
    tasks: meeting.tasks || '',
    futurTasks: meeting.futurTasks || '',
    note: meeting.note || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const language = useLanguage();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/update-meeting`, {
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
