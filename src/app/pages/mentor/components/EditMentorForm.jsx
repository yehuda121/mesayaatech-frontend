// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '@/app/components/Button';
// import AlertMessage from '@/app/components/notifications/AlertMessage';

// export default function EditMentorForm({ userData, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(userData || {});
//   const [initialData, setInitialData] = useState(userData || {});
//   const [saving, setSaving] = useState(false);
//   const [alert, setAlert] = useState(null); // alert message
//   const router = useRouter();

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     if (userData) {
//       setFormData(userData);
//       setInitialData(userData);
//     }
//   }, [userData]);

//   const labels = {
//     fullName: 'fullName',
//     email: 'email',
//     phone: 'phone',
//     armyRole: 'armyRole',
//     profession: 'profession',
//     fields: 'fields',
//     specialties: 'specialties',
//     experience: 'experience',
//     linkedin: 'linkedin',
//     notes: 'notes'
//   };

//   const keys = Object.keys(labels);

//   const handleChange = (key, value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

//   // ✅ Validation logic
//   const validateForm = () => {
//     const errors = [];
//     const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
//     const phonePattern = /^\d{9,10}$/;
//     const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

//     const fullName = formData.fullName?.trim() || '';
//     const email = formData.email?.trim() || '';
//     const phone = formData.phone?.trim() || '';
//     const profession = formData.profession?.trim() || '';
//     const location = formData.location?.trim() || '';
//     const experience = formData.experience?.trim() || '';
//     const linkedin = formData.linkedin?.trim() || '';
//     const idNumber = formData.idNumber?.replace(/\s/g, '') || '';

//     if (!fullName) errors.push(t('fullNameRequired', language));
//     else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

//     if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

//     if (!email) errors.push(t('emailRequired', language));
//     else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

//     if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

//     if (!profession) errors.push(t('mainProfessionRequired', language));
//     else if (/[^\w\sא-ת]/.test(profession)) errors.push(t('mainProfessionInvalid', language));

//     if (!location) errors.push(t('locationRequired', language));

//     if (!experience) errors.push(t('experienceRequired', language));

//     if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

//     return errors;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setAlert({ message: validationErrors[0], type: 'error' });
//       return;
//     }

//     setSaving(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-user-form', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const result = await res.json();
//       if (res.ok) {
//         setAlert({ message: t('saveSuccess', language), type: 'success' });
//         setInitialData(formData);
//         onSave(result);
//       } else {
//         setAlert({ message: result.error || t('saveError', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Error saving user form:', err);
//       setAlert({ message: t('saveError', language), type: 'error' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData(initialData);
//     setAlert(null);
//   };

//   return (
//     <div
//       dir={language === 'he' ? 'rtl' : 'ltr'}
//       className="edit-mentor-container"
//     >
//       <h2 className="edit-mentor-title">
//         {t('editUserDetails', language)}
//       </h2>

//       {alert && (
//         <AlertMessage
//           message={alert.message}
//           type={alert.type}
//           onClose={() => setAlert(null)}
//         />
//       )}

//       <form className="edit-mentor-form">
//         {keys.map((key) => (
//           <label key={key} className="edit-mentor-label">
//             <span className="edit-mentor-label-text">
//               {t(key, language)}
//             </span>
//             {(key === 'experience' || key === 'notes') ? (
//               <textarea
//                 className="edit-mentor-textarea"
//                 value={formData[key] || ''}
//                 onChange={(e) => handleChange(key, e.target.value)}
//               />
//             ) : (
//               <input
//                 type="text"
//                 className="edit-mentor-input"
//                 value={formData[key] || ''}
//                 onChange={(e) => handleChange(key, e.target.value)}
//               />
//             )}
//           </label>
//         ))}
//       </form>

//       <div className="edit-mentor-footer">
//         <div className="edit-mentor-buttons">
//           <Button
//             text={t('cancel', language)}
//             onClick={handleCancel}
//             disabled={!isModified}
//           />
//           <Button
//             text={saving ? '...' : t('saveChanges', language)}
//             onClick={handleSubmit}
//             disabled={!isModified}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditMentorForm({ userData, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
      setInitialData(userData);
    }
  }, [userData]);

  const fields = [
    { key: 'fullName' },
    { key: 'email' },
    { key: 'phone' },
    { key: 'armyRole' },
    { key: 'profession' },
    { key: 'fields' },
    { key: 'specialties' },
    { key: 'experience', type: 'textarea' },
    { key: 'linkedin' },
    { key: 'notes', type: 'textarea' }
  ];

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName?.trim() || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const profession = formData.profession?.trim() || '';
    const location = formData.location?.trim() || '';
    const experience = formData.experience?.trim() || '';
    const linkedin = formData.linkedin?.trim() || '';
    const idNumber = formData.idNumber?.replace(/\s/g, '') || '';

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!profession) errors.push(t('mainProfessionRequired', language));
    else if (/[^\w\sא-ת]/.test(profession)) errors.push(t('mainProfessionInvalid', language));

    if (!location) errors.push(t('locationRequired', language));
    if (!experience) errors.push(t('experienceRequired', language));
    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlert({ message: validationErrors[0], type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (res.ok) {
        setAlert({ message: t('saveSuccess', language), type: 'success' });
        setInitialData(formData);
        onSave(result);
      } else {
        setAlert({ message: result.error || t('saveError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error saving user form:', err);
      setAlert({ message: t('saveError', language), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setAlert(null);
  };

  return (
    <>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <GenericForm
        titleKey="editUserDetails"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSubmit}
        onSecondary={handleCancel}
        primaryLabel={saving ? '' : 'saveChanges'}
        secondaryLabel="cancel"
        disabledPrimary={!isModified}
      />
    </>
  );
}
