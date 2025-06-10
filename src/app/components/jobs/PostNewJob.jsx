'use client';

import { useState, useRef, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import Button from '@/app/components/Button';
import './jobs.css';

export default function PostNewJob({ publisherId, publisherType, onSave, onClose }) {
  const [language, setLanguage] = useState(getLanguage());
  const [jobData, setJobData] = useState({
    company: '',
    location: '',
    role: '',
    minExperience: '',
    description: '',
    requirements: '',
    advantages: '',
    submitEmail: '',
    submitLink: '',
    companyWebsite: '',
    jobViewLink: '',
    jobTextInput: '',
    attachment: null,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef();

  const handleFormChange = (newData) => {
    setJobData(newData);
  };

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getLanguage());
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);


  const handleAutoFill = async () => {
    const { jobTextInput, attachment } = jobData;

    if (jobTextInput && attachment) {
      setToast({ message: t('onlyOneInputAllowed', language), type: 'error' });
      return;
    }

    if (!jobTextInput && !attachment) {
      setToast({ message: t('textOrImageRequired', language), type: 'error' });
      return;
    }

    try {
      if (jobTextInput) {
        const res = await fetch('http://localhost:5000/api/parse-job-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: jobTextInput }),
        });
        const result = await res.json();
        setJobData((prev) => ({
          ...prev,
          ...result,
          jobTextInput: '',
          attachment: null,
        }));
      }

      if (attachment) {
        const formData = new FormData();
        formData.append('image', attachment);
        const res = await fetch('http://localhost:5000/api/extract-image-text', {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result?.text) {
          const fillRes = await fetch('http://localhost:5000/api/parse-job-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: result.text }),
          });
          const parsed = await fillRes.json();
          setJobData((prev) => ({
            ...prev,
            ...parsed,
            jobTextInput: '',
            attachment: null,
          }));
          if (fileInputRef.current) fileInputRef.current.value = null;
        } else {
          setToast({ message: t('textExtractionFailed', language), type: 'error' });
        }
      }

      setToast({ message: t('fieldsAutoFilled', language), type: 'success' });
    } catch (err) {
      console.error('Auto-fill error:', err);
      setToast({ message: t('autoFillFailed', language), type: 'error' });
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    const {
      company,
      role,
      location,
      minExperience,
      description,
      requirements,
      advantages,
      submitEmail,
      submitLink,
      companyWebsite,
      jobViewLink
    } = jobData;

    if (!company?.trim()) errors.push(t('companyRequired', language));
    else if (company.trim().length > 100) errors.push(t('companyTooLong', language));

    if (!role?.trim()) errors.push(t('roleRequired', language));
    else if (role.trim().length > 100) errors.push(t('roleTooLong', language));

    if (location?.trim().length > 60) errors.push(t('locationTooLong', language));
    if (minExperience && isNaN(minExperience)) errors.push(t('experienceInvalid', language));
    if (description?.trim().length > 1000) errors.push(t('descriptionTooLong', language));
    if (requirements?.trim().length > 1000) errors.push(t('requirementsTooLong', language));
    if (advantages?.trim().length > 1000) errors.push(t('advantagesTooLong', language));
    if (submitEmail?.trim() && !emailPattern.test(submitEmail.trim())) errors.push(t('emailInvalid', language));
    if (submitLink?.trim() && !urlPattern.test(submitLink.trim())) errors.push(t('urlInvalid', language));
    if (companyWebsite?.trim() && !urlPattern.test(companyWebsite.trim())) errors.push(t('urlInvalid', language));
    if (jobViewLink?.trim() && !urlPattern.test(jobViewLink.trim())) errors.push(t('urlInvalid', language));

    return errors;
  };


  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setToast({ message: validationErrors[0], type: 'error' });
      return;
    }

    if (!publisherId || !publisherType) {
      setToast({ message: t('userNotRecognized', language), type: 'error' });
      return;
    }

    const formData = new FormData();
    Object.entries(jobData).forEach(([key, value]) => {
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, value || '');
    });

    formData.append('publisherId', publisherId);
    formData.append('publisherType', publisherType);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setToast({ message: t('jobAddedSuccessfully', language), type: 'success' });
        onSave(result);
        onClose();
      } else {
        const error = await response.json();
        setToast({ message: error?.error || t('eventError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'company', required: true },
    { key: 'location' },
    { key: 'role' },
    { key: 'minExperience' },
    { key: 'description', type: 'textarea' },
    { key: 'requirements', type: 'textarea' },
    { key: 'advantages', type: 'textarea' },
    { key: 'submitEmail' },
    { key: 'submitLink' },
    { key: 'companyWebsite' },
    { key: 'jobViewLink' },
  ];

  return (
    <div className="add-job-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      
      <div className="auto-fill-box">
        <h2 className="auto-fill-title">{t('autoFillTitle', language)}</h2>
        <p className="auto-fill-description">{t('autoFillExplanation', language)}</p>

        <textarea
          className="auto-fill-textarea"
          value={jobData.jobTextInput}
          onChange={(e) => setJobData((prev) => ({ ...prev, jobTextInput: e.target.value }))}
          placeholder={t('textInputPlaceholder', language)}
        />

        <div className="upload-section">
          <label>{t('uploadImageLabel', language)}</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              setJobData((prev) => ({ ...prev, attachment: file }));
            }}
          />
        </div>

        <Button text={t('autoFillButton', language)} onClick={handleAutoFill} />
      </div>


      <div className="add-job-box mt-4">
        <GenericForm
          titleKey="postNewJob"
          fields={fields}
          data={jobData}
          onChange={handleFormChange}
          onPrimary={handleSubmit}
          onSecondary={onClose}
          primaryLabel={loading ? '' : 'submitJob'}
          secondaryLabel="cancel"
          disabledPrimary={loading}
        />
      </div>

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
