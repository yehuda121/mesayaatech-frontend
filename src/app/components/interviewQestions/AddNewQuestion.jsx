'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';

export default function AddNewQuestion({ onSuccess, fullName, idNumber }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({
    text: '',
    category: '',
    createdBy: '', // Only fullName
  });
  const [toast, setToast] = useState(null);

  // If fullName or ID is missing, show error message
  if (!fullName || !idNumber) {
    return <p style={{ color: 'red' }}>Missing fullName or ID number. Please log in properly.</p>;
  }

  // List of available categories for the dropdown
  const categories = [
    { value: "choose a categorie", labelHe: "בחר קטגוריה", labelEn: "choose a categorie" },
    { value: "tech", labelHe: "הייטק", labelEn: "Tech" },
    { value: "management", labelHe: "ניהול", labelEn: "Management" },
    { value: "logistics", labelHe: "לוגיסטיקה", labelEn: "Logistics" },
    { value: "education", labelHe: "חינוך", labelEn: "Education" },
    { value: "marketing", labelHe: "שיווק", labelEn: "Marketing" },
    { value: "other", labelHe: "אחר", labelEn: "Other" }
  ];

  // On mount: set language and createdBy as fullName
  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    if (fullName) {
      setFormData((prev) => ({
        ...prev,
        createdBy: fullName.trim(), // Save only full name
      }));
    }

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [fullName, idNumber]);

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    // Validate required fields
    if (!formData.text || !formData.category || !formData.createdBy) {
      let message = '';
      if (!formData.text) {
        message = t('missingQuestionText', language);
      } else if (!formData.category) {
        message = t('missingCategory', language);
      } else if (!formData.createdBy) {
        message = t('missingCreatedBy', language);
      }
      setToast({ message, type: 'error' });
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
    <>
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
    </>
  );
}
