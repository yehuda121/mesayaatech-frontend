// 'use client';

// import { useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';
// import ToastMessage from '@/app/components/Notifications/ToastMessage';

// export default function PostNewJob({ publisherId, publisherType, onSave, onClose }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [jobData, setJobData] = useState({
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
//     attachment: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   const handleFormChange = (newData) => {
//     setJobData(newData);
//   };

//   const handleSubmit = async () => {
//     if (!publisherId || !publisherType) {
//       setToast({ message: t('userNotRecognized', language), type: 'error' });
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(jobData).forEach(([key, value]) => {
//       if (value instanceof File) {
//         formData.append(key, value);
//       } else {
//         formData.append(key, value || '');
//       }
//     });

//     formData.append('publisherId', publisherId);
//     formData.append('publisherType', publisherType);

//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/jobs', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setToast({ message: t('jobAddedSuccessfully', language), type: 'success' });
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
//     { key: 'attachment', type: 'file', labelOverride: 'uploadFile' }
//   ];

//   return (
//     <div className="add-job-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <div className="add-job-box">
//         <GenericForm
//           titleKey="postNewJob"
//           fields={fields}
//           data={jobData}
//           onChange={handleFormChange}
//           onPrimary={handleSubmit}
//           onSecondary={onClose}
//           primaryLabel={loading ? '' : 'submitJob'}
//           secondaryLabel="cancel"
//           disabledPrimary={loading}
//         />
//       </div>
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

import { useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import Button from '@/app/components/Button';

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

  const handleFormChange = (newData) => {
    setJobData(newData);
  };

  const handleSubmit = async () => {
    if (!publisherId || !publisherType) {
      setToast({ message: t('userNotRecognized', language), type: 'error' });
      return;
    }

    const formData = new FormData();
    Object.entries(jobData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value || '');
      }
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

  const handleAutoFillFromText = async () => {
    if (!jobData.jobTextInput) return;

    try {
      const res = await fetch('http://localhost:5000/api/parse-job-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobData.jobTextInput }),
      });
      const result = await res.json();
      setJobData((prev) => ({ ...prev, ...result }));
      setToast({ message: t('fieldsAutoFilled', language), type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: t('autoFillFailed', language), type: 'error' });
    }
  };

  const handleImageUploadAndExtract = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/extract-image-text', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result?.text) {
        setJobData((prev) => ({ ...prev, jobTextInput: result.text }));
        await handleAutoFillFromText();
      } else {
        setToast({ message: t('textExtractionFailed', language), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: t('textExtractionFailed', language), type: 'error' });
    }
  };

  const fields = [
    { key: 'jobTextInput', type: 'textarea', labelOverride: 'pasteFullJobText' },
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
    {
      key: 'attachment',
      type: 'file',
      labelOverride: 'uploadFile',
      onChange: (file) => handleImageUploadAndExtract(file),
    },
  ];

  return (
    <div className="add-job-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="add-job-box">
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
        <div className="mt-2">
          <Button
            text={t('autoFillButton', language)}
            onClick={handleAutoFillFromText}
            disabled={!jobData.jobTextInput}
          />
        </div>
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
