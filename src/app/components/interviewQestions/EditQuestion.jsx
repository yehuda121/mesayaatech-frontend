'use client';

import { useState, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';

export default function EditQuestion({ question, onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({
    text: question.text || '',
    category: question.category || '',
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const categories = [
    { value: "tech", labelHe: "הייטק", labelEn: "Tech" },
    { value: "management", labelHe: "ניהול", labelEn: "Management" },
    { value: "logistics", labelHe: "לוגיסטיקה", labelEn: "Logistics" },
    { value: "education", labelHe: "חינוך", labelEn: "Education" },
    { value: "marketing", labelHe: "שיווק", labelEn: "Marketing" },
    { value: "other", labelHe: "אחר", labelEn: "Other" }
  ];

  const handleSubmit = async () => {
    if (!formData.text || !formData.category) {
      setToast({ message: t('missingFields', language), type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/update-question', {
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

  const fields = [
    {
      key: 'text',
      type: 'textarea',
      labelOverride: 'questionText'
    },
    {
      key: 'category',
      type: 'select',
      labelOverride: 'questionCategory',
      options: categories.map(cat => ({
        value: cat.value,
        label: language === 'he' ? cat.labelHe : cat.labelEn
      }))
    }
  ];

  return (
    <>
      <GenericForm
        titleKey="editQuestion"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSubmit}
        onSecondary={onClose}
        primaryLabel="save"
        secondaryLabel="cancel"
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
