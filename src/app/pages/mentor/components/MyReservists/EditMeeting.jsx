'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from '@/app/utils/language/useLanguage';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import './AddNewMeeting.css';

export default function EditMeeting({ meeting, index, mentorId, reservistId, onSave, onClose }) {
  const [formData, setFormData] = useState({
    date: meeting?.date || '',
    mode: meeting?.mode || '',
    topics: meeting?.topics || '',
    tasks: meeting?.tasks || '',
    futurTasks: meeting?.futurTasks || '',
    note: meeting?.note || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const language = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Apply sanitization to relevant fields
  const sanitizeFields = (data) => {
    const limits = {
      mode: 500,
      topics: 500,
      tasks: 1000,
      futurTasks: 1000,
      note: 1000
    };
    let modified = false;
    const sanitized = { ...data };
    for (const [key, maxLen] of Object.entries(limits)) {
      const { text, wasModified } = sanitizeText(data[key] || '', maxLen);
      sanitized[key] = text;
      if (wasModified) {
        modified = true;
        console.log("sanetized: ", key);
      }
    }
    return { sanitized, modified };
  };

  const handleSubmit = async () => {
    if (!formData.date || !formData.mode) {
      let message = !formData.date ? t('meetingDateRequired', language) : t('meetingModeRequired', language);
      setAlert({ message: message, type: 'warning' });
      return;
    } 

    const { sanitized, modified } = sanitizeFields(formData);
    setFormData(sanitized);
    if (modified) {
      setAlert({ message: t('textSanitizedWarning', language), type: 'warning' });
      return;
    }

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
      setAlert({ message: t('saveMeetingFailed', language), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!meeting) return <div>{t('meetingNotFound', language)}</div>;

  return (
    <div className="ANM-wrapper" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="ANM-form-box">
        <button className="ANM-close-btn" onClick={onClose}>✖</button>
        <h2 className="ANM-title">{t('editMeetingTitle', language)}</h2>

        <div className="ANM-grid">
          <label className="ANM-label">
            {t('meetingDate', language)} <span style={{ color: 'red' }}>*</span>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="ANM-input" />
          </label>

          <label className="ANM-label">
            {t('meetingMode', language)} <span style={{ color: 'red' }}>*</span>
            <input type="text" name="mode" value={formData.mode} onChange={handleChange} className="ANM-input" />
          </label>
        </div>

        <div className="ANM-grid">
          <label className="ANM-label">
            {t('meetingTopics', language)}
            <textarea name="topics" value={formData.topics} onChange={handleChange} className="ANM-textarea" />
          </label>

          <label className="ANM-label">
            {t('meetingTasks', language)}
            <textarea name="tasks" value={formData.tasks} onChange={handleChange} className="ANM-textarea" />
          </label>
        </div>

        <div className="ANM-grid">
          <label className="ANM-label">
            {t('futurTasks', language)}
            <textarea name="futurTasks" value={formData.futurTasks} onChange={handleChange} className="ANM-textarea" />
          </label>

          <label className="ANM-label">
            {t('note', language)}
            <textarea name="note" value={formData.note} onChange={handleChange} className="ANM-textarea" />
          </label>
        </div>

        <div className="ANM-actions">
          <Button onClick={handleSubmit} disabled={isSaving}>
            {t('save', language)}
          </Button>
        </div>

        {alert && (
          <AlertMessage
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
}
