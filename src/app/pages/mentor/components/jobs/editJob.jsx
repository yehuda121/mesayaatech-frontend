// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '@/app/components/Button';

// export default function EditMentorJob({ job, onClose, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(job);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     setUserId(localStorage.getItem('userId'));
//     setUserType(localStorage.getItem('userType'));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

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
//       <div className="modal-box">
//         <h2 className="form-title">{t('editJobTitle', language)}</h2>

//         <form className="form-wrapper">
//           <label className="form-label">
//             {t('jobTitle', language)}
//             <input
//               name="title"
//               value={formData.title || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('company', language)}
//             <input
//               name="company"
//               value={formData.company || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('location', language)}
//             <input
//               name="location"
//               value={formData.location || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('description', language)}
//             <textarea
//               name="description"
//               value={formData.description || ''}
//               onChange={handleChange}
//             />
//           </label>
//         </form>

//         <div className="form-actions">
//           <Button text={t('delete', language)} color="red" onClick={handleDelete} />
//           <Button text={loading ? '...' : t('saveChanges', language)} onClick={handleSave} />
//           <Button text={t('cancel', language)} onClick={onClose} />
//         </div>
//       </div>
//     </div>
//   );
// }
