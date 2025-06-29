'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function PostAnswer({ questionId, fullName, idNumber, onSuccess, onClose }) {
  const [formData, setFormData] = useState({ text: '' });
  const [toast, setToast] = useState(null);
  const language = useLanguage();

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!formData.text) {
      setToast({ message: t('missingAnswerText', language), type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/post-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          idNumber,
          fullName,
          text: formData.text.trim()
        })
      });

      if (res.ok) {
        setToast({ message: t('answerPosted', language), type: 'success' });
        setFormData({ text: '' });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 300);
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error posting answer:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  const fields = [
    {
      key: 'text',
      type: 'textarea',
      labelOverride: 'answer'
    }
  ];

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      if (onClose) onClose();
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
          titleKey="postAnswer"
          fields={fields}
          data={formData}
          onChange={setFormData}
          onSecondary={onClose}
          onCloseIcon={onClose}
          secondaryLabel="close"
          onPrimary={handleSubmit}
          primaryLabel="submit"
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
