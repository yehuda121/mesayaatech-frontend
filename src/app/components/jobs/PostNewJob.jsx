// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';

// export default function AddNewJob({ onClose, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [userId, setUserId] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [jobData, setJobData] = useState({
//     title: '',
//     company: '',
//     location: '',
//     description: '',
//     attachment: null,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setUserId(localStorage.getItem("userId"));
//     setUserType(localStorage.getItem("userType"));
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener("languageChanged", handleLangChange);
//     return () => window.removeEventListener("languageChanged", handleLangChange);
//   }, []);

//   const handleFormChange = (newData) => {
//     setJobData(newData);
//   };

//   const handleSubmit = async () => {
//     if (!userId || !userType) {
//       alert(t("userNotRecognized", language));
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", jobData.title);
//     formData.append("company", jobData.company);
//     formData.append("location", jobData.location);
//     formData.append("description", jobData.description);
//     formData.append("publisherId", userId);
//     formData.append("publisherType", userType);
//     if (jobData.attachment instanceof File) {
//       formData.append("attachment", jobData.attachment);
//     }

//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/jobs", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         onSave(result);
//         onClose();
//       } else {
//         const error = await response.json();
//         console.error("Upload error:", error);
//         alert(error?.error || t("eventError", language));
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert(t("serverError", language));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     { key: 'title' },
//     { key: 'company' },
//     { key: 'location' },
//     { key: 'description', type: 'textarea' },
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
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';

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
    attachment: null
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
    { key: 'attachment', type: 'file', labelOverride: 'uploadFile' }
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
