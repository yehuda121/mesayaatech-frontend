'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/notifications/ToastMessage';

export default function AdminEditJob({ job, onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(job || {});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setUserType(localStorage.getItem('userType'));
  }, []);

  const handleSave = async () => {
    if (!formData.jobId || !userId || !userType) {
      setToast({ message: t('missingFields', language), type: 'error' });
      return;
    }

    // אל תשנה את publisherId
    const { publisherId, ...editableFields } = formData;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: formData.jobId,
          updatedData: editableFields,
          userId,
          userType
        })
      });

      if (res.ok) {
        setToast({ message: t('jobUpdatedSuccess', language), type: 'success' });
        onSave(formData);
      } else {
        const err = await res.json();
        setToast({ message: err?.error || t('saveFailed', language), type: 'error' });
      }
    } catch (err) {
      console.error('Update failed:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'company', required: true },
    { key: 'location' },
    { key: 'role', required: true },
    { key: 'minExperience' },
    { key: 'description', type: 'textarea' },
    { key: 'requirements', type: 'textarea' },
    { key: 'advantages', type: 'textarea' },
    { key: 'submitEmail' },
    { key: 'submitLink' },
    { key: 'companyWebsite' },
    { key: 'jobViewLink' }
  ];

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericForm
        titleKey="editJobTitle"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSave}
        onSecondary={onClose}
        onCloseIcon={onClose}
        primaryLabel={loading ? '' : 'saveChanges'}
        secondaryLabel="cancel"
        disabledPrimary={loading}
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
