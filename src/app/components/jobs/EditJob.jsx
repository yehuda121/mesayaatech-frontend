'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/notifications/ToastMessage';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';
import './jobs.css';

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

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

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

  const fieldOptions = [
    { value: '', label: language === 'he' ? 'בחר תחום' : 'Select field' },
    ...Object.keys(translatedJobFields).map(value => ({
      value,
      label: language === 'he' ? translatedJobFields[value].he : translatedJobFields[value].en
    }))
  ];

  return (
    <div className="edit-job-overlay" dir={language === 'he' ? 'rtl' : 'ltr'} onClick={onClose}>
      <div className="edit-job-form">
        <button className='edit-job-close-button' onClick={onClose}>✖</button>
        <h2 className="edit-job-title">{t('editJobTitle', language)}</h2>
        <div className="edit-job-grid">
          <label>
            {t('company', language)}
            <input value={formData.company || ''} onChange={e => handleChange('company', e.target.value)} />
          </label>
          <label>
            {t('role', language)}
            <input value={formData.role || ''} onChange={e => handleChange('role', e.target.value)} />
          </label>
          <label>
            {t('location', language)}
            <input value={formData.location || ''} onChange={e => handleChange('location', e.target.value)} />
          </label>
          <label>
            {t('minExperience', language)}
            <input value={formData.minExperience || ''} onChange={e => handleChange('minExperience', e.target.value)} />
          </label>
          <label className="textarea">
            {t('description', language)}
            <textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} />
          </label>
          <label className="textarea">
            {t('requirements', language)}
            <textarea value={formData.requirements || ''} onChange={e => handleChange('requirements', e.target.value)} />
          </label>
          <label className="textarea">
            {t('advantages', language)}
            <textarea value={formData.advantages || ''} onChange={e => handleChange('advantages', e.target.value)} />
          </label>
          <label>
            {t('submitEmail', language)}
            <input value={formData.submitEmail || ''} onChange={e => handleChange('submitEmail', e.target.value)} />
          </label>
          <label>
            {t('submitLink', language)}
            <input value={formData.submitLink || ''} onChange={e => handleChange('submitLink', e.target.value)} />
          </label>
          <label>
            {t('companyWebsite', language)}
            <input value={formData.companyWebsite || ''} onChange={e => handleChange('companyWebsite', e.target.value)} />
          </label>
          <label>
            {t('jobViewLink', language)}
            <input value={formData.jobViewLink || ''} onChange={e => handleChange('jobViewLink', e.target.value)} />
          </label>
          <label>
            {t('field', language)}
            <select value={formData.field || ''} onChange={e => handleChange('field', e.target.value)}>
              {fieldOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="edit-job-actions">
          <Button onClick={handleSave} disabled={loading}>{t('saveChanges', language)}</Button>
          <Button onClick={onClose}>{t('cancel', language)}</Button>
        </div>
        {toast && (
          <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
}
