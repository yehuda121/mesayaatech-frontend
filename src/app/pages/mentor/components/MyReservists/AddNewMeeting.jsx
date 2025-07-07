'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from '@/app/utils/language/useLanguage';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import sanitizeText from '@/app/utils/sanitizeText';
import './AddNewMeeting.css';
import Button from '@/app/components/Button/Button';

export default function AddNewMeeting({ mentorId, reservistId, onAdd, onClose }) {
  const [formData, setFormData] = useState({
    date: '',
    mode: '',
    topics: '',
    tasks: '',
    futurTasks: '',
    note: ''
  });
  const [alert, setAlert] = useState(null);
  const language = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { date, mode, topics, tasks, futurTasks, note } = formData;

    if (!date) return t('meetingDateRequired', language);

    const cleanedMode = sanitizeText(mode, 50);
    if (!cleanedMode) return t('meetingModeRequired', language);
    if (cleanedMode === 'tooLong') return t('meetingModeTooLong', language);

    const cleanedFields = [
      { value: topics, key: 'meetingTopicsTooLong' },
      { value: tasks, key: 'meetingTasksTooLong' },
      { value: futurTasks, key: 'futurTasksTooLong' },
      { value: note, key: 'noteTooLong' }
    ];

    for (let { value, key } of cleanedFields) {
      const result = sanitizeText(value, 300);
      if (result === 'tooLong') return t(key, language);
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setAlert({ message: error, type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/add-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, reservistId, meeting: formData })
      });

      if (res.ok) {
        setAlert({ message: t('meetingAddedSuccessfully', language), type: 'success' });
        onAdd();
      } else {
        setAlert({ message: t('meetingAddFailed', language), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: t('meetingAddFailed', language), type: 'error' });
    }
  };

  return (
    <div className="ANM-wrapper" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="ANM-form-box">
         <button className="ANM-close-btn" onClick={onClose}>✖</button>
        <h2 className="ANM-title">{t('addMeeting', language)}</h2>

        <div className="ANM-grid">
          <label className="ANM-label">
            {t('meetingDate', language)}<span style={{ color: 'red' }}>*</span>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="ANM-input" />
          </label>

          <label className="ANM-label">
            {t('meetingMode', language)}<span style={{ color: 'red' }}>*</span>
            <input type="text" name="mode" value={formData.mode} onChange={handleChange} className="ANM-input" />
        </label>
        {/* </div>
        <div className="ANM-grid"> */}
          <label className="ANM-label">
            {t('meetingTopics', language)}
            <textarea name="topics" value={formData.topics} onChange={handleChange} className="ANM-textarea" />
          </label>

          <label className="ANM-label">
            {t('meetingTasks', language)}
            <textarea name="tasks" value={formData.tasks} onChange={handleChange} className="ANM-textarea" />
          </label>

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
          <Button onClick={handleSubmit} >{t('save', language)}</Button>
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
