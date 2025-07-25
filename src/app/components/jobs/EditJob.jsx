'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import './jobs.css';

export default function EditJob({ job, onClose, onSave }) {
  const [formData, setFormData] = useState(job || {});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
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
    if (submitEmail && !emailPattern.test(submitEmail)) errors.push(t('emailInvalid', language));
    if (submitLink && !urlPattern.test(submitLink)) errors.push(t('urlInvalid', language));
    if (companyWebsite && !urlPattern.test(companyWebsite)) errors.push(t('urlInvalid', language));
    if (jobViewLink && !urlPattern.test(jobViewLink)) errors.push(t('urlInvalid', language));
    return errors;
  };

  // Apply sanitization to relevant fields
  const sanitizeFields = (data) => {
    const limits = {
      company: 100,
      location: 60,
      role: 100,
      description: 1000,
      requirements: 1000,
      advantages: 1000
    };
    let modified = false;
    const sanitized = { ...data };
    for (const [key, maxLen] of Object.entries(limits)) {
      const { text, wasModified } = sanitizeText(data[key] || '', maxLen);
      sanitized[key] = text;
      if (wasModified) {
        modified = true;
        console.log("sanetized: ", key);
      }
    }
    return { sanitized, modified };
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

    const { sanitized, modified } = sanitizeFields(formData);
    setFormData(sanitized);
    if (modified) {
      setTimeout(() => {
        setConfirmDialog({
          title: t('fieldsSanitizedWarning', language),
          message: t('fieldsSanitizedConfirm', language),
          onConfirm: () => submitSanitized(sanitized),
          onCancel: () => {}
        });
      }, 0);
    } else {
      submitSanitized(sanitized);
    }
  };

  const submitSanitized = async (finalData) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/update-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: finalData.jobId,
          updatedData: finalData,
          userId,
          userType
        })
      });
      if (res.ok) {
        setToast({ message: t('jobUpdatedSuccess', language), type: 'success' });
        onSave(finalData);
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
    <div className="edit-job-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="edit-job-form">
        <button className='edit-job-close-button' onClick={onClose}>✖</button>
        <h2 className="edit-job-title">{t('editJobTitle', language)}</h2>
        <div className="edit-job-grid">
          <label>
            <div className="display-row">
              {t('company', language)}<span style={{ color: 'red', marginLeft: '2' }}>*</span>
            </div>
            <input value={formData.company || ''} onChange={e => handleChange('company', e.target.value)} />
          </label>
          <label>
            <div className="display-row">
              {t('role', language)}<span style={{ color: 'red', marginLeft: '2' }}>*</span>
            </div>
            <input value={formData.role || ''} onChange={e => handleChange('role', e.target.value)} />
          </label>
          <label>
            <div className="display-row">
              {t('field', language)}<span style={{ color: 'red', marginLeft: '2' }}>*</span>
            </div>
            <select
              value={formData.field || ''}
              onChange={(e) => handleChange('field', e.target.value)}
            >
              {fieldOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>{t('location', language)}<input value={formData.location || ''} onChange={e => handleChange('location', e.target.value)} /></label>
          <label>{t('minExperience', language)}<input type="number" min="0" step="1" value={formData.minExperience || ''} onChange={e => handleChange('minExperience', e.target.value)} /></label>
          <label>{t('description', language)}<textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} /></label>
          <label>{t('requirements', language)}<textarea value={formData.requirements || ''} onChange={e => handleChange('requirements', e.target.value)} /></label>
          <label>{t('advantages', language)}<textarea value={formData.advantages || ''} onChange={e => handleChange('advantages', e.target.value)} /></label>
          <label>{t('submitEmail', language)}<input value={formData.submitEmail || ''} onChange={e => handleChange('submitEmail', e.target.value)} /></label>
          <label>{t('submitLink', language)}<input value={formData.submitLink || ''} onChange={e => handleChange('submitLink', e.target.value)} /></label>
          <label>{t('companyWebsite', language)}<input value={formData.companyWebsite || ''} onChange={e => handleChange('companyWebsite', e.target.value)} /></label>
          <label>{t('jobViewLink', language)}<input value={formData.jobViewLink || ''} onChange={e => handleChange('jobViewLink', e.target.value)} /></label>
        </div>
        <div className="edit-job-actions">
          <Button onClick={handleSave} disabled={loading}>{t('saveChanges', language)}</Button>
          <Button onClick={onClose}>{t('cancel', language)}</Button>
        </div>

        {confirmDialog && (
          <ConfirmDialog
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={() => {
              setConfirmDialog(null);
              confirmDialog.onConfirm();
            }}
            onCancel={() => {
              setConfirmDialog(null);
              confirmDialog.onCancel();
            }}
          />
        )}

        { toast && (
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
