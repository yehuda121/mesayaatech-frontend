// // EditJob.jsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '@/app/components/Button';

// export default function EditJob({ job, onClose, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(job);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState(null); // user's ID from localStorage
//   const [userType, setUserType] = useState(null); // user's type (admin, mentor, etc.)

//   // listen for language change events
//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   // load user info on mount
//   useEffect(() => {
//     setUserId(localStorage.getItem('userId'));
//     setUserType(localStorage.getItem('userType'));
//   }, []);

//   // update form data when input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // handle saving the updated job
//   const handleSave = async () => {
//     if (!formData.jobId || !userId || !userType) return;
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-job', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           jobId: formData.jobId,
//           updatedData: formData,
//           userId,
//           userType
//         })
//       });
//       if (res.ok) {
//         onSave(formData);
//       } else {
//         alert(t('saveFailed', language));
//       }
//     } catch (err) {
//       console.error('Update failed:', err);
//       alert(t('serverError', language));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // handle deleting the job
//   const handleDelete = async () => {
//     if (!confirm(t('confirmDelete', language))) return;
//     try {
//       const res = await fetch('http://localhost:5000/api/delete-job', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ jobId: formData.jobId, userId, userType })
//       });
//       if (res.ok) {
//         alert(t('jobDeleted', language));
//         onClose();
//       } else {
//         alert(t('deleteFailed', language));
//       }
//     } catch (err) {
//       console.error('Delete failed:', err);
//       alert(t('serverError', language));
//     }
//   };

//   return (
//     <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
//         <div className="modal-box">
//         <h2 className="form-title">{t('editJobTitle', language)}</h2>

//         <form className="form-wrapper">
//             <label className="form-label">
//             {t('jobTitle', language)}
//             <input
//                 name="title"
//                 value={formData.title || ''}
//                 onChange={handleChange}
//             />
//             </label>

//             <label className="form-label">
//             {t('company', language)}
//             <input
//                 name="company"
//                 value={formData.company || ''}
//                 onChange={handleChange}
//             />
//             </label>

//             <label className="form-label">
//             {t('location', language)}
//             <input
//                 name="location"
//                 value={formData.location || ''}
//                 onChange={handleChange}
//             />
//             </label>

//             <label className="form-label">
//             {t('description', language)}
//             <textarea
//                 name="description"
//                 value={formData.description || ''}
//                 onChange={handleChange}
//             />
//             </label>
//         </form>

//         <div className="form-actions">
//             <Button text={t('delete', language)} color="red" onClick={handleDelete} />
//             <Button text={loading ? '...' : t('saveChanges', language)} onClick={handleSave} />
//             <Button text={t('cancel', language)} onClick={onClose} />
//         </div>
//         </div>
//     </div>
//     );

// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditJob({ job, onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(job);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

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
    if (!formData.jobId || !userId || !userType) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: formData.jobId,
          updatedData: formData,
          userId,
          userType
        })
      });
      if (res.ok) {
        onSave(formData);
      } else {
        alert(t('saveFailed', language));
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert(t('serverError', language));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'title', labelOverride: 'jobTitle' },
    { key: 'company', labelOverride: 'company' },
    { key: 'location', labelOverride: 'location' },
    { key: 'description', type: 'textarea', labelOverride: 'description' }
  ];

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <GenericForm
          titleKey="editJobTitle"
          fields={fields}
          data={formData}
          onChange={setFormData}
          onPrimary={handleSave}
          onSecondary={onClose}
          primaryLabel={loading ? '' : 'saveChanges'}
          secondaryLabel="cancel"
        />
      </div>
    </div>
  );
}
