'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import { JobFields  } from '@/app/components/jobs/jobFields';
import { useLanguage } from "@/app/utils/language/useLanguage";
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import './style/AddNewQuestion.css';

export default function AddNewQuestion({ onSuccess, fullName, idNumber, onClose }) {
  const [formData, setFormData] = useState({ text: '', category: '', createdBy: '' });
  const [toast, setToast] = useState(null);
  const language = useLanguage();

  useEffect(() => {
    if (fullName) {
      setFormData((prev) => ({ ...prev, createdBy: fullName.trim() }));
    }
  }, [fullName]);

  if (!fullName || !idNumber) {
    return <p style={{ color: 'red' }}>{t('MissingNameOrID', language)}</p>;
  }

  const fieldOptions = [
    { value: '', label: t('all', language) },
    ...Object.keys(JobFields).map(value => ({
      value,
      label: t(`${value}`, language)
    }))
  ];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!formData.text.trim() || !formData.category || !formData.createdBy) {
      const message = !formData.text
        ? t('missingQuestionText', language)
        : !formData.category
        ? t('missingCategory', language)
        : t('missingCreatedBy', language);
      setToast({ message, type: 'error' });
      return;
    } 
    
    const { text, wasModified } = sanitizeText(formData.text.trim(), 1000);
    setFormData({ text: text, category: formData.category, createdBy: formData.createdBy });
    if (wasModified) {
      setToast({ message: t('textSanitizedWarning', language), type: 'warning' });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ ...formData, idNumber }),
      });

      if (res.ok) {
        setToast({ message: t('questionAdded', language), type: 'success' });
        setFormData((prev) => ({ ...prev, text: '', category: '' }));
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Failed to submit question:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  return (
    <div className="add-question-modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'} >
      <div className="add-question-form">
        <button className="add-question-close-button" onClick={onClose}>×</button>
        <h2 className="add-question-title">{t('addNewQuestion', language)}</h2>
        <div className="add-question-grid">
          <label>
            {t('questionText', language)}
            <textarea
              value={formData.text}
              onChange={e => handleChange('text', e.target.value)}
              maxLength={500}
              rows={5}
            />
          </label>
          <label>
            {t('questionCategory', language)}
            <select
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              {fieldOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="add-question-actions">
          <Button onClick={handleSubmit} className="save">{t('submit', language)}</Button>
        </div>
        {toast && (
          <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
}
