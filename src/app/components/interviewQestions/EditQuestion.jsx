'use client';

import { useState, useEffect } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";
import { translatedJobFields } from "@/app/components/jobs/jobFields";

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

  const handleSubmit = async () => {
    if (!formData.text || !formData.category) {
      setToast({ message: t('missingFields', language), type: 'error' });
      return;
    }

    if (formData.text.length > 500) {
      setToast({ message: t('questionTooLong', language), type: 'error' });
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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div
        className="relative max-w-xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <GenericForm
          titleKey="editQuestion"
          fields={fields}
          data={formData}
          onChange={setFormData}
          onPrimary={handleSubmit}
          onSecondary={onClose}
          onCloseIcon={onClose}
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
      </div>
    </div>
  );
}
