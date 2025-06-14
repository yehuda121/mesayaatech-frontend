// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';
// import ToastMessage from '@/app/components/notifications/ToastMessage';

// export default function EditJob({ job, onClose, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(job || {});
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     setUserId(localStorage.getItem('userId'));
//     setUserType(localStorage.getItem('userType'));
//   }, []);

//   const validateForm = () => {
//     const errors = [];
//     const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
//     const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

//     const company = formData.company?.trim() || '';
//     const role = formData.role?.trim() || '';
//     const location = formData.location?.trim() || '';
//     const minExperience = formData.minExperience?.trim() || '';
//     const description = formData.description?.trim() || '';
//     const requirements = formData.requirements?.trim() || '';
//     const advantages = formData.advantages?.trim() || '';
//     const submitEmail = formData.submitEmail?.trim() || '';
//     const submitLink = formData.submitLink?.trim() || '';
//     const companyWebsite = formData.companyWebsite?.trim() || '';
//     const jobViewLink = formData.jobViewLink?.trim() || '';

//     if (!company) errors.push(t('companyRequired', language));
//     else if (company.length > 100) errors.push(t('companyTooLong', language));

//     if (!role) errors.push(t('roleRequired', language));
//     else if (role.length > 100) errors.push(t('roleTooLong', language));

//     if (location && location.length > 60) errors.push(t('locationTooLong', language));

//     if (minExperience && isNaN(minExperience)) errors.push(t('experienceInvalid', language));

//     if (description.length > 1000) errors.push(t('descriptionTooLong', language));
//     if (requirements.length > 1000) errors.push(t('requirementsTooLong', language));
//     if (advantages.length > 1000) errors.push(t('advantagesTooLong', language));

//     if (submitEmail && !emailPattern.test(submitEmail)) errors.push(t('emailInvalid', language));
//     if (submitLink && !urlPattern.test(submitLink)) errors.push(t('urlInvalid', language));
//     if (companyWebsite && !urlPattern.test(companyWebsite)) errors.push(t('urlInvalid', language));
//     if (jobViewLink && !urlPattern.test(jobViewLink)) errors.push(t('urlInvalid', language));

//     return errors;
//   };


//   const handleSave = async () => {
//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setToast({ message: validationErrors[0], type: 'error' });
//       return;
//     }
    
//     if (!formData.jobId || !userId || !userType) {
//       setToast({ message: t('missingFields', language), type: 'error' });
//       return;
//     }

//     const { publisherId, ...editableFields } = formData;

//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-job', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           jobId: formData.jobId,
//           updatedData: editableFields,
//           userId,
//           userType
//         })
//       });

//       if (res.ok) {
//         setToast({ message: t('jobUpdatedSuccess', language), type: 'success' });
//         onSave(formData);
//       } else {
//         const err = await res.json();
//         setToast({ message: err?.error || t('saveFailed', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Update failed:', err);
//       setToast({ message: t('serverError', language), type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     { key: 'company', required: true },
//     { key: 'location' },
//     { key: 'role', required: true },
//     { key: 'minExperience' },
//     { key: 'description', type: 'textarea' },
//     { key: 'requirements', type: 'textarea' },
//     { key: 'advantages', type: 'textarea' },
//     { key: 'submitEmail' },
//     { key: 'submitLink' },
//     { key: 'companyWebsite' },
//     { key: 'jobViewLink' }
//   ];

//   return (
//     <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <GenericForm
//         titleKey="editJobTitle"
//         fields={fields}
//         data={formData}
//         onChange={setFormData}
//         onPrimary={handleSave}
//         onSecondary={onClose}
//         onCloseIcon={onClose}
//         primaryLabel={loading ? '' : 'saveChanges'}
//         secondaryLabel="cancel"
//         disabledPrimary={loading}
//       />
//       {toast && (
//         <ToastMessage
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/notifications/ToastMessage';
import { translatedJobFields } from '@/app/components/jobs/jobFields';

export default function EditJob({ job, onClose, onSave }) {
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
    <div className="generic-modal-overlay-for-edit-job" dir={language === 'he' ? 'rtl' : 'ltr'}>
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
