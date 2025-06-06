// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';
// import ToastMessage from '@/app/components/Notifications/ToastMessage';

// export default function AddNewQuestion({ onSuccess }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState({
//     text: '',
//     createdBy: '',
//   });
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);

//     const fullName = localStorage.getItem('fullName') || '';
//     const idNumber = localStorage.getItem('idNumber') || '';
//     setFormData((prev) => ({
//       ...prev,
//       createdBy: `${fullName}#${idNumber}`,
//     }));

//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/interview/add-question', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setToast({ message: t('questionAdded', language), type: 'success' });
//         setFormData((prev) => ({ ...prev, text: '' }));
//         if (onSuccess) onSuccess();
//       } else {
//         const data = await res.json();
//         setToast({ message: data?.error || t('serverError', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Failed to submit question:', err);
//       setToast({ message: t('serverError', language), type: 'error' });
//     }
//   };

//   const fields = [
//     {
//       key: 'text',
//       type: 'textarea',
//       labelOverride: 'questionText'
//     },
//     {
//       key: 'category',
//       type: 'text',
//       labelOverride: 'category'
//     }
//   ];


//   return (
//     <>
//       <GenericForm
//         titleKey="addNewQuestion"
//         fields={fields}
//         data={formData}
//         onChange={setFormData}
//         onPrimary={handleSubmit}
//         primaryLabel="submit"
//       />

//       {toast && (
//         <ToastMessage
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';

export default function AddNewQuestion({ onSuccess }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({
    text: '',
    category: '',
    createdBy: '',
  });
  const [toast, setToast] = useState(null);

  // הקטגוריות כפי שהיו בקובץ QuestionList.jsx
  const categories = [
    { value: "choose a categorie", labelHe: "בחר קטגוריה", labelEn: "choose a categorie" },
    { value: "tech", labelHe: "הייטק", labelEn: "Tech" },
    { value: "management", labelHe: "ניהול", labelEn: "Management" },
    { value: "logistics", labelHe: "לוגיסטיקה", labelEn: "Logistics" },
    { value: "education", labelHe: "חינוך", labelEn: "Education" },
    { value: "marketing", labelHe: "שיווק", labelEn: "Marketing" },
    { value: "other", labelHe: "אחר", labelEn: "Other" }
  ];

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    const fullName = localStorage.getItem('fullName') || '';
    const idNumber = localStorage.getItem('idNumber') || '';
    setFormData((prev) => ({
      ...prev,
      createdBy: `${fullName}#${idNumber}`,
    }));

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!formData.text || !formData.category || !formData.createdBy) {
      let message = '';
      if (!formData.text) {
        message = t('missingQuestionText', language);
      } else if (!formData.category) {
        message = t('missingCategory', language);
      } else if (!formData.createdBy) {
        message = t('missingCreatedBy', language);
      }

      setToast({ message, type: 'error' });
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/upload-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setToast({ message: t('questionAdded', language), type: 'success' });
        setFormData((prev) => ({ ...prev, text: '', category: '' }));
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Failed to submit question:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  const fields = [
    {
      key: 'text',
      type: 'textarea',
      labelOverride: 'questionText'
    },
    {
      key: 'category',
      type: 'select',
      labelOverride: 'questionCategory',
      options: categories.map(cat => ({
        value: cat.value,
        label: language === 'he' ? cat.labelHe : cat.labelEn
      }))
    }
  ];

  return (
    <>
      <GenericForm
        titleKey="addNewQuestion"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSubmit}
        primaryLabel="submit"
      />

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
