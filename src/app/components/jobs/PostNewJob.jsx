'use client';

import { useState, useRef } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import Button from '@/app/components/Button/Button';
import { Brain } from 'lucide-react';
import { useLanguage } from '@/app/utils/language/useLanguage';
import { translatedJobFields } from './jobFields';
import sanitizeText from '@/app/utils/sanitizeText';
import './jobs.css';

export default function PostNewJobModal({ publisherId, publisherType, onSave, onClose }) {
  const [jobData, setJobData] = useState({
    field: '', company: '', location: '', role: '', minExperience: '',
    description: '', requirements: '', advantages: '', submitEmail: '',
    submitLink: '', companyWebsite: '', jobViewLink: '', jobTextInput: '', attachment: null
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const fileInputRef = useRef();
  const language = useLanguage();
  const [autoFilling, setAutoFilling] = useState(false);

  const handleChange = (key, value) => setJobData(prev => ({ ...prev, [key]: value }));

  const sanitizeJobData = (rawJobData) => {
    const fieldsToCheck = {
      company: 100,
      location: 60,
      role: 100,
      description: 1000,
      requirements: 1000,
      advantages: 1000,
      jobTextInput: 2500
    };
    let wasAnyFieldModified = false;
    const sanitized = { ...rawJobData };
    for (const [key, maxLength] of Object.entries(fieldsToCheck)) {
      const { text, wasModified } = sanitizeText(rawJobData[key] || '', maxLength);
      sanitized[key] = text;
      if (wasModified) wasAnyFieldModified = true;
    }
    return { sanitized, wasAnyFieldModified };
  };

  const handleAutoFill = async () => {
    const { jobTextInput, attachment } = jobData;
    if (jobTextInput && attachment) return setToast({ message: t('onlyOneInputAllowed', language), type: 'error' });
    if (!jobTextInput && !attachment) return setToast({ message: t('textOrImageRequired', language), type: 'error' });
    if (jobTextInput.length > 2500) return setToast({ message: t('textTooLong', language), type: 'error' });
    setAutoFilling(true);

    try {
      if (jobTextInput) {
        const { text, wasModified } = sanitizeText(jobTextInput, 2500);
        if (wasModified) setToast({ message: t('textSanitizedWarning', language), type: 'warning' });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/parse-job-text`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        const result = await res.json();
        setJobData(prev => ({ ...prev, ...result, jobTextInput: '', attachment: null }));
      }
      if (attachment) {
        const formData = new FormData();
        formData.append('image', attachment);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/extract-image-text`, {
          method: 'POST', body: formData
        });
        const result = await res.json();
        if (result?.text) {
          const { text, wasModified } = sanitizeText(result.text, 2500);
          if (wasModified) setToast({ message: t('textSanitizedWarning', language), type: 'warning' });
          const fillRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/parse-job-text`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          });
          const parsed = await fillRes.json();
          setJobData(prev => ({ ...prev, ...parsed, jobTextInput: '', attachment: null }));
          if (fileInputRef.current) fileInputRef.current.value = null;
        } else setToast({ message: t('textExtractionFailed', language), type: 'error' });
      }
      setToast({ message: t('fieldsAutoFilled', language), type: 'success' });
    } catch {
      setToast({ message: t('autoFillFailed', language), type: 'error' });
    } finally {
      setAutoFilling(false);
    }
  };

  const handleSubmit = async () => {
    if(!jobData.company || !jobData.field || !jobData.role) {
      setToast({ message: t('missingPostJobFields', language), type: 'error' });
      return;
    } 

    const { sanitized, wasAnyFieldModified } = sanitizeJobData(jobData);
    if (wasAnyFieldModified) {
      setJobData(sanitized);
      return setConfirmData(sanitized);
    }
    submitSanitizedJob(sanitized);
  };

  const submitSanitizedJob = async (finalJobData) => {
    const formData = new FormData();
    Object.entries(finalJobData).forEach(([key, value]) => {
      formData.append(key, value instanceof File ? value : value || '');
    });
    formData.append('publisherId', publisherId);
    formData.append('publisherType', publisherType);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/jobs`, { method: 'POST', body: formData });
      if (res.ok) {
        const result = await res.json();
        setToast({ message: t('jobAddedSuccessfully', language), type: 'success' });
        setJobData({
          field: '', company: '', location: '', role: '', minExperience: '',
          description: '', requirements: '', advantages: '', submitEmail: '',
          submitLink: '', companyWebsite: '', jobViewLink: '', jobTextInput: '', attachment: null
        });
        onSave(result);
        onClose();
      } else {
        const error = await res.json();
        setToast({ message: error?.error || t('eventError', language), type: 'error' });
      }
    } catch {
      setToast({ message: t('serverError', language), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => onClose();

  const getTranslatedJobFieldOptions = () => [
    { value: '', label: t('selectField', language) },
    ...Object.entries(translatedJobFields).map(([key, val]) => ({ value: key, label: val[language] }))
  ];

  return (
    <div className="postNewJob-modal-overlay" onClick={closeModal}>
      <div className="postNewJob-modal-container" dir={language === 'he' ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
        <button className="postNewJob-modal-close-button" onClick={closeModal}>✖</button>

        <div className="postNewJob-auto-fill-box">
          <h2>{t('autoFillTitle', language)}</h2>
          <p>{t('autoFillExplanation', language)}</p>
          <textarea
            value={jobData.jobTextInput}
            onChange={(e) => handleChange('jobTextInput', e.target.value)}
            placeholder={t('textInputPlaceholder', language)}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleChange('attachment', e.target.files[0])}
          />

          <Button
            text={autoFilling ? t('loading', language) : t('autoFillButton', language)}
            onClick={handleAutoFill}
            icon={!autoFilling && <Brain size={18} className="inline mr-2" />}
            disabled={autoFilling}
          />
        </div>

        <div className="postNewJob-job-form-grid">
          <div className="postNewJob-full-width">
            <label>{t('field', language)}<span className="postNewJob-required"> *</span></label>
            <select value={jobData.field} onChange={(e) => handleChange('field', e.target.value)}>
              {getTranslatedJobFieldOptions().map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {[ 'company','location','role','minExperience','submitEmail','submitLink','companyWebsite','jobViewLink','description','requirements','advantages' ].map((key) => {
            const isRequired = ['company', 'role'].includes(key);
            return (
              <div key={key} className="postNewJob-form-field">
                <label>
                  {t(key, language)}
                  {isRequired && <span className="postNewJob-required"> *</span>}
                </label>
                {['description', 'requirements', 'advantages'].includes(key) ? (
                  <textarea value={jobData[key]} onChange={(e) => handleChange(key, e.target.value)} />
                ) : (
                  <input type="text" value={jobData[key]} onChange={(e) => handleChange(key, e.target.value)} />
                )}
              </div>
            );
          })}
        </div>

        <div className="postNewJob-form-buttons">
          <Button text={t('submitJob', language)} onClick={handleSubmit} disabled={loading} />
          <Button text={t('cancel', language)} onClick={closeModal} variant="secondary" />
        </div>

        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {confirmData && (
          <ConfirmDialog
            title={t('fieldsSanitizedWarning', language)}
            message={t('fieldsSanitizedConfirm', language)}
            onConfirm={() => {
              submitSanitizedJob(confirmData);
              setConfirmData(null);
            }}
            onCancel={() => setConfirmData(null)}
          />
        )}
      </div>
    </div>
  );
}