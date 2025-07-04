
// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';
// import ToastMessage from '@/app/components/Notifications/ToastMessage';
// import Button from '@/app/components/Button';
// import './jobs.css';
// import sanitizeText from '@/app/utils/sanitizeText';
// import { Brain } from 'lucide-react';
// import { useLanguage } from "@/app/utils/language/useLanguage";
// import {translatedJobFields} from './jobFields';

// export default function PostNewJob({ publisherId, publisherType, onSave, onClose }) {
//   const [jobData, setJobData] = useState({
//     field: '',
//     company: '',
//     location: '',
//     role: '',
//     minExperience: '',
//     description: '',
//     requirements: '',
//     advantages: '',
//     submitEmail: '',
//     submitLink: '',
//     companyWebsite: '',
//     jobViewLink: '',
//     jobTextInput: '',
//     attachment: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const fileInputRef = useRef();
//   const language = useLanguage();
//   const handleFormChange = (newData) => setJobData(newData);

//   const getTranslatedJobFieldOptions = (lang) => {
//     const defaultOption = { value: '', label: lang === 'he' ? 'בחר תחום' : 'Select Field' };
//     const options = Object.entries(translatedJobFields).map(([key, value]) => ({
//       value: key,
//       label: value[lang]
//     }));
//     return [defaultOption, ...options];
//   };

//   const isEmptyValue = (value) => {
//     if (!value) return true;
//     const cleaned = value.trim().toLowerCase();
//     return ['not specified', 'לא צויין', 'n/a', 'none', 'null', 'אין מידע'].includes(cleaned);
//   };

//   const normalizeAIData = (data) => ({
//     company: data.company || '',
//     location: data.location || '',
//     role: data.role || '',
//     minExperience: (typeof data.minExperience === 'number') ? data.minExperience : '',
//     description: data.description || '',
//     requirements: data.requirements || '',
//     advantages: data.advantages || '',
//     submitEmail: data.submitEmail || '',
//     submitLink: data.submitLink || '',
//     companyWebsite: data.companyWebsite || '',
//     jobViewLink: data.jobViewLink || '',
//   });

//   const resetForm = () => {
//     setJobData({
//       field: '',
//       company: '',
//       location: '',
//       role: '',
//       minExperience: '',
//       description: '',
//       requirements: '',
//       advantages: '',
//       submitEmail: '',
//       submitLink: '',
//       companyWebsite: '',
//       jobViewLink: '',
//       jobTextInput: '',
//       attachment: null,
//     });
//   };

//   const handleAutoFill = async () => {
//     const { jobTextInput, attachment } = jobData;

//     if (jobTextInput && attachment) {
//       setToast({ message: t('onlyOneInputAllowed', language), type: 'error' });
//       return;
//     }

//     if (!jobTextInput && !attachment) {
//       setToast({ message: t('textOrImageRequired', language), type: 'error' });
//       return;
//     }

//     try {
//       resetForm();

//       if (jobTextInput) {
//         const res = await fetch('http://localhost:5000/api/parse-job-text', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: jobTextInput }),
//         });
//         const result = await res.json();
//         const normalized = normalizeAIData(result);
//         setJobData(prev => ({ ...prev, ...normalized, jobTextInput: '', attachment: null }));
//       }

//       if (attachment) {
//         const formData = new FormData();
//         formData.append('image', attachment);
//         const res = await fetch('http://localhost:5000/api/extract-image-text', { method: 'POST', body: formData });
//         const result = await res.json();
//         if (result?.text) {
//           const fillRes = await fetch('http://localhost:5000/api/parse-job-text', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ text: result.text }),
//           });
//           const parsed = await fillRes.json();
//           const normalized = normalizeAIData(parsed);
//           setJobData(prev => ({ ...prev, ...normalized, jobTextInput: '', attachment: null }));
//           if (fileInputRef.current) fileInputRef.current.value = null;
//         } else {
//           setToast({ message: t('textExtractionFailed', language), type: 'error' });
//         }
//       }

//       setToast({ message: t('fieldsAutoFilled', language), type: 'success' });
//     } catch (err) {
//       console.error('Auto-fill error:', err);
//       setToast({ message: t('autoFillFailed', language), type: 'error' });
//     }
//   };

//   const validateForm = () => {
//     const errors = [];
//     const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
//     const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

//     const field = jobData.field?.trim() || '';
//     const company = sanitizeText(jobData.company || '', 100);
//     const location = sanitizeText(jobData.location || '', 60);
//     const role = sanitizeText(jobData.role || '', 100);
//     const minExperience = jobData.minExperience;
//     const description = sanitizeText(jobData.description || '', 1000);
//     const requirements = sanitizeText(jobData.requirements || '', 1000);
//     const advantages = sanitizeText(jobData.advantages || '', 1000);
//     const submitEmail = jobData.submitEmail?.trim() || '';
//     const submitLink = jobData.submitLink?.trim() || '';
//     const companyWebsite = jobData.companyWebsite?.trim() || '';
//     const jobViewLink = jobData.jobViewLink?.trim() || '';

//     if (!field) errors.push(t('fieldRequired', language));

//     if (!company) errors.push(t('companyRequired', language));
//     else if (company === 'tooLong') errors.push(t('companyTooLong', language));

//     if (!role) errors.push(t('roleRequired', language));
//     else if (role === 'tooLong') errors.push(t('roleTooLong', language));

//     if (location && location === 'tooLong') errors.push(t('locationTooLong', language));

//     if (minExperience && isNaN(minExperience)) errors.push(t('experienceInvalid', language));

//     if (description === 'tooLong') errors.push(t('descriptionTooLong', language));
//     if (requirements === 'tooLong') errors.push(t('requirementsTooLong', language));
//     if (advantages === 'tooLong') errors.push(t('advantagesTooLong', language));

//     if (submitEmail && !emailPattern.test(submitEmail)) errors.push(t('emailInvalid', language));

//     if (submitLink && !urlPattern.test(submitLink)) errors.push(t('urlInvalid', language));
//     if (companyWebsite && !urlPattern.test(companyWebsite)) errors.push(t('urlInvalid', language));
//     if (jobViewLink && !urlPattern.test(jobViewLink)) errors.push(t('urlInvalid', language));

//     return errors;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setToast({ message: validationErrors[0], type: 'error' });
//       return;
//     }

//     if (!publisherId || !publisherType) {
//       setToast({ message: t('userNotRecognized', language), type: 'error' });
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(jobData).forEach(([key, value]) => {
//       if (value instanceof File) formData.append(key, value);
//       else formData.append(key, value || '');
//     });

//     formData.append('publisherId', publisherId);
//     formData.append('publisherType', publisherType);

//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/jobs', { method: 'POST', body: formData });
//       if (response.ok) {
//         const result = await response.json();
//         setToast({ message: t('jobAddedSuccessfully', language), type: 'success' });
//         resetForm();
//         onSave(result);
//         onClose();
//       } else {
//         const error = await response.json();
//         setToast({ message: error?.error || t('eventError', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//       setToast({ message: t('serverError', language), type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     { key: 'company', required: true },
//     { key: 'location' },
//     { key: 'role' },
//     { key: 'minExperience' },
//     { key: 'description', type: 'textarea' },
//     { key: 'requirements', type: 'textarea' },
//     { key: 'advantages', type: 'textarea' },
//     { key: 'submitEmail' },
//     { key: 'submitLink' },
//     { key: 'companyWebsite' },
//     { key: 'jobViewLink' },
//     { key: 'field', type: 'select', required: true, options: getTranslatedJobFieldOptions(language) },
//   ];

//   return (
//     <div className='PNJ-container' dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <div className="auto-fill-box">
//         <h2 className="auto-fill-title">{t('autoFillTitle', language)}</h2>
//         <p className="auto-fill-description">{t('autoFillExplanation', language)}</p>
//         <textarea 
//           className="auto-fill-textarea" 
//           value={jobData.jobTextInput} 
//           onChange={(e) => setJobData((prev) => ({ ...prev, jobTextInput: e.target.value }))} 
//           placeholder={t('textInputPlaceholder', language)} 
//         />
//         <div className="upload-section">
//           <label className='ml-4 font-bold'>{t('uploadImageLabel', language)}</label>
//           <input 
//             type="file" 
//             accept="image/*" 
//             ref={fileInputRef} 
//             onChange={(e) => { const file = e.target.files[0]; 
//             setJobData((prev) => ({ ...prev, attachment: file })); }} 
//           />
//         </div>
//         <Button 
//           text={t('autoFillButton', language)} 
//           onClick={handleAutoFill} 
//           icon={<Brain size={18} className="inline mr-2" />}
//         />
//       </div>

//       <div className="add-job-box">
//         <GenericForm
//           titleKey="postNewJob" 
//           fields={fields} 
//           data={jobData} 
//           onChange={handleFormChange} 
//           onPrimary={handleSubmit} 
//           onSecondary={onClose} 
//           primaryLabel={loading ? '' : 'submitJob'} 
//           secondaryLabel="cancel" disabledPrimary={loading} 
//         />
//       </div>

//       {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//     </div>
//   );
// }


'use client';

import { useState, useRef } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
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
  const fileInputRef = useRef();
  const language = useLanguage();
  const [autoFilling, setAutoFilling] = useState(false);

  const handleChange = (key, value) => setJobData(prev => ({ ...prev, [key]: value }));

  const handleAutoFill = async () => {
    const { jobTextInput, attachment } = jobData;
    if (jobTextInput && attachment) return setToast({ message: t('onlyOneInputAllowed', language), type: 'error' });
    if (!jobTextInput && !attachment) return setToast({ message: t('textOrImageRequired', language), type: 'error' });
    if (jobTextInput.length > 1500)return setToast({ message: t('textTooLong', language), type: 'error' });
    setAutoFilling(true);

    try {
      if (jobTextInput) {
        const res = await fetch('http://localhost:5000/api/parse-job-text', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: jobTextInput })
        });
        const result = await res.json();
        setJobData(prev => ({ ...prev, ...result, jobTextInput: '', attachment: null }));
      }
      if (attachment) {
        const formData = new FormData();
        formData.append('image', attachment);
        const res = await fetch('http://localhost:5000/api/extract-image-text', { method: 'POST', body: formData });
        const result = await res.json();
        if (result?.text) {
          const fillRes = await fetch('http://localhost:5000/api/parse-job-text', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: result.text })
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

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;
    const field = jobData.field?.trim() || '';
    const company = sanitizeText(jobData.company || '', 100);
    const location = sanitizeText(jobData.location || '', 60);
    const role = sanitizeText(jobData.role || '', 100);
    const minExperience = jobData.minExperience;
    const description = sanitizeText(jobData.description || '', 1000);
    const requirements = sanitizeText(jobData.requirements || '', 1000);
    const advantages = sanitizeText(jobData.advantages || '', 1000);
    const submitEmail = jobData.submitEmail?.trim() || '';
    const submitLink = jobData.submitLink?.trim() || '';
    const companyWebsite = jobData.companyWebsite?.trim() || '';
    const jobViewLink = jobData.jobViewLink?.trim() || '';

    if (!field) errors.push(t('fieldRequired', language));

    if (!company) errors.push(t('companyRequired', language));
    else if (company === 'tooLong') errors.push(t('companyTooLong', language));

    if (!role) errors.push(t('roleRequired', language));
    else if (role === 'tooLong') errors.push(t('roleTooLong', language));

    if (location === 'tooLong') errors.push(t('locationTooLong', language));
    if (minExperience && isNaN(minExperience)) errors.push(t('experienceInvalid', language));

    if (description === 'tooLong') errors.push(t('descriptionTooLong', language));
    if (requirements === 'tooLong') errors.push(t('requirementsTooLong', language));
    if (advantages === 'tooLong') errors.push(t('advantagesTooLong', language));

    if (submitEmail && !emailPattern.test(submitEmail)) errors.push(t('emailInvalid', language));
    if (submitLink && !urlPattern.test(submitLink)) errors.push(t('urlInvalid', language));
    if (companyWebsite && !urlPattern.test(companyWebsite)) errors.push(t('urlInvalid', language));
    if (jobViewLink && !urlPattern.test(jobViewLink)) errors.push(t('urlInvalid', language));

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) return setToast({ message: validationErrors[0], type: 'error' });
    if (!publisherId || !publisherType) return setToast({ message: t('userNotRecognized', language), type: 'error' });

    const formData = new FormData();
    Object.entries(jobData).forEach(([key, value]) => {
      formData.append(key, value instanceof File ? value : value || '');
    });
    formData.append('publisherId', publisherId);
    formData.append('publisherType', publisherType);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs', { method: 'POST', body: formData });
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

          {[ 'company','location','role','minExperience','submitEmail','submitLink','companyWebsite','jobViewLink','description','requirements','advantages' ].map((key) => (
            <div key={key} className="postNewJob-form-field">
              <label>{t(key, language)}</label>
              {[ 'description','requirements','advantages' ].includes(key) ? (
                <textarea value={jobData[key]} onChange={(e) => handleChange(key, e.target.value)} />
              ) : (
                <input type="text" value={jobData[key]} onChange={(e) => handleChange(key, e.target.value)} />
              )}
            </div>
          ))}
        </div>

        <div className="postNewJob-form-buttons">
          <Button text={t('submitJob', language)} onClick={handleSubmit} disabled={loading} />
          <Button text={t('cancel', language)} onClick={closeModal} variant="secondary" />
        </div>

        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}