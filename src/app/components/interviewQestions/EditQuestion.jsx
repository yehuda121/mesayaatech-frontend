'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";
import { translatedJobFields } from "@/app/components/jobs/jobFields";
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import './ViewQuestion.css';

export default function EditQuestion({ question, onClose, onSave }) {
  const [formData, setFormData] = useState({
    text: question.text || '',
    category: question.category || '',
  });
  const [toast, setToast] = useState(null);
  const language = useLanguage();
  const categories = [
    { value: "", labelHe: "הכל", labelEn: "All" },
    ...Object.entries(translatedJobFields).map(([value, labels]) => ({
      value,
      labelHe: labels.he,
      labelEn: labels.en,
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
        headers: { 'Content-Type': 'application/json' },
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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('editQuestion-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className="editQuestion-overlay"
      onClick={handleOverlayClick}
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
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {language === 'he' ? cat.labelHe : cat.labelEn}
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
