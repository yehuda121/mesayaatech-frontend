'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';

export default function PostAnswer({ questionId, fullName, idNumber, onSuccess }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({ text: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

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
        if (onSuccess) onSuccess();
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

  return (
    <>
      <GenericForm
        titleKey="postAnswer"
        fields={fields}
        data={formData}
        onChange={setFormData}
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
    </>
  );
}
