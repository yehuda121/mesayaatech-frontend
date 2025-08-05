'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";
import { JobFields  } from "@/app/components/jobs/jobFields";
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import './style/EditQuestion.css';

export default function EditQuestion({ question, onClose, onSave }) {
  const [formData, setFormData] = useState({
    text: question.text || '',
    category: question.category || '',
  });
  const [toast, setToast] = useState(null);
  const language = useLanguage();
  const fieldOptions = [
    { value: '', label: t('all', language) },
    ...Object.keys(JobFields).map(value => ({
      value,
      label: t(`${value}`, language)
    }))
  ];


  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log('cat: ', formData.category);
    if (!formData.text.trim() || !formData.category) {
      setToast({ message: t('missingFields', language), type: 'error' });
      return;
    }

    const { text, wasModified } = sanitizeText(formData.text.trim(), 1000);
    setFormData({ text: text, category: formData.category });
    if (wasModified) {
      setToast({ message: t('textSanitizedWarning', language), type: 'warning' });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/update-question`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({
          questionId: question.questionId,
          ...formData
        }),
      });

      if (res.ok) {
        setToast({ message: t('questionUpdated', language), type: 'success' });
        if (onSave) onSave();
        onClose();
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error updating question:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  return (
    <div
      className="editQuestion-overlay"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div className="editQuestion-box" onClick={(e) => e.stopPropagation()}>
        <button className="editQuestion-close" onClick={onClose}>×</button>
        <h2 className="editQuestion-title">{t('editQuestion', language)}</h2>
        <div className="editQuestion-grid">
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
          <label>
            {t('questionText', language)}
            <textarea
              value={formData.text}
              onChange={e => handleChange('text', e.target.value)}
              rows={5}
              maxLength={500}
            />
          </label>
        </div>
        <div className="editQuestion-actions">
          <Button onClick={handleSubmit}>{t('save', language)}</Button>
        </div>

        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
