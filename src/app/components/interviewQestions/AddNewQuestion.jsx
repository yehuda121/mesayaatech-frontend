'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import {translatedJobFields } from '@/app/components/jobs/jobFields';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function AddNewQuestion({ onSuccess, fullName, idNumber }) {
  const [formData, setFormData] = useState({
    text: '',
    category: '',
    createdBy: '', // Only fullName
  });
  const [toast, setToast] = useState(null);
  const language = useLanguage();

  // If fullName or ID is missing, show error message
  if (!fullName || !idNumber) {
    return <p style={{ color: 'red' }}>{t('MissingNameOrID', language)}</p>;
  }

  // List of available categories for the dropdown
  const categories = [
    { value: "", labelHe: "הכל", labelEn: "All" },
    ...Object.entries(translatedJobFields).map(([value, labels]) => ({
      value,
      labelHe: labels.he,
      labelEn: labels.en,
    }))
  ];

  // On mount: set language and createdBy as fullName
  useEffect(() => {
    if (fullName) {
      setFormData((prev) => ({
        ...prev,
        createdBy: fullName.trim(), // Save only full name
      }));
    }
  }, [fullName, idNumber]);

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    // Validate required fields
    let message = '';
    if (!formData.text || !formData.category || !formData.createdBy) {
      if (!formData.text) {
        message = t('missingQuestionText', language);
      } else if (!formData.category) {
        message = t('missingCategory', language);
      } else if (!formData.createdBy) {
        message = t('missingCreatedBy', language);
      }
      setToast({ message, type: 'error' });
      return;
    } else if(formData.text.length > 500){
      setToast({ message: t('questionTooLong', language), type: 'error' });
      return;
    }

    // Send question to backend
    try {
      const res = await fetch('http://localhost:5000/api/upload-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, idNumber }), // Pass idNumber separately
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

  // Fields for GenericForm
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
    <div className='GF-generic-form-wrapper-add-new-question'>
      <GenericForm
        titleKey="addNewQuestion"
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
    </div>
  );
}
