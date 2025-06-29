'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/notifications/ToastMessage';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function EditJob({ job, onClose, onSave }) {
  const [formData, setFormData] = useState(job || {});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [toast, setToast] = useState(null);
  const language = useLanguage();

  useEffect(() => {
    setUserId(sessionStorage.getItem('userId'));
    setUserType(sessionStorage.getItem('userType'));
  }, []);

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    const {
      company = '', role = '', location = '', minExperience = '', description = '',
      requirements = '', advantages = '', submitEmail = '', submitLink = '',
      companyWebsite = '', jobViewLink = '', field = ''
    } = formData;

    if (!field) errors.push(t('fieldRequired', language));
    if (!company.trim()) errors.push(t('companyRequired', language));
    if (!role.trim()) errors.push(t('roleRequired', language));
    if (minExperience && isNaN(minExperience)) errors.push(t('experienceInvalid', language));
    if (submitEmail && !emailPattern.test(submitEmail)) errors.push(t('emailInvalid', language));
    if (submitLink && !urlPattern.test(submitLink)) errors.push(t('urlInvalid', language));
    if (companyWebsite && !urlPattern.test(companyWebsite)) errors.push(t('urlInvalid', language));
    if (jobViewLink && !urlPattern.test(jobViewLink)) errors.push(t('urlInvalid', language));

    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setToast({ message: validationErrors[0], type: 'error' });
      return;
    }

    if (!formData.jobId || !userId || !userType) {
      setToast({ message: t('missingFields', language), type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: formData.jobId,
          updatedData: formData,
          userId, userType
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
    { key: 'jobViewLink' },
    {
      key: 'field',
      required: true,
      type: 'select',
      options: [
        { value: '', label: language === 'he' ? 'בחר תחום' : 'Select field' },
        ...Object.keys(translatedJobFields).map(value => ({
          value,
          label: language === 'he' ? translatedJobFields[value].he : translatedJobFields[value].en
        }))
      ]
    }];

  return (
    <div className="GF-generic-modal-overlay-for-edit-job" dir={language === 'he' ? 'rtl' : 'ltr'}>
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
        <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
