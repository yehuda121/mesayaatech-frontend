// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';
// import ToastMessage from '@/app/components/Notifications/ToastMessage';

// export default function PostAnswer({ questionId, fullName, idNumber, onSuccess, onClose }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState({ text: '' });
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const handleSubmit = async (e) => {
//     if (e?.preventDefault) e.preventDefault();

//     if (!formData.text) {
//       setToast({ message: t('missingAnswerText', language), type: 'error' });
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:5000/api/post-answer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           questionId,
//           idNumber,
//           fullName,
//           text: formData.text.trim()
//         })
//       });

//       if (res.ok) {
//         setToast({ message: t('answerPosted', language), type: 'success' });
//         setFormData({ text: '' });
//         setTimeout(() => {
//           if (onSuccess) onSuccess();
//           if (onClose) onClose();
//           location.reload();
//         }, 300);
//       } else {
//         const data = await res.json();
//         setToast({ message: data?.error || t('serverError', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Error posting answer:', err);
//       setToast({ message: t('serverError', language), type: 'error' });
//     }
//   };

//   const fields = [
//     {
//       key: 'text',
//       type: 'textarea',
//       labelOverride: 'answer'
//     }
//   ];

//   const handleOverlayClick = (e) => {
//     if (e.target.classList.contains('modal-overlay')) {
//       if (onClose) onClose();
//     }
//   };

//   return (
//     <div
//       className="modal-overlay"
//       onClick={handleOverlayClick}
//       dir={language === 'he' ? 'rtl' : 'ltr'}
//     >
//       <div
//         className="relative max-w-xl w-full mx-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
//           aria-label="Close"
//         >
//           ×
//         </button>

//         <GenericForm
//           titleKey="postAnswer"
//           fields={fields}
//           data={formData}
//           onChange={setFormData}
//           onPrimary={handleSubmit}
//           primaryLabel="submit"
//         />

//         {toast && (
//           <ToastMessage
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import ToastMessage from '@/app/components/Notifications/ToastMessage';

export default function PostAnswer({ questionId, fullName, idNumber, onSuccess, onClose }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({ text: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!formData.text) {
      setToast({ message: t('missingAnswerText', language), type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/post-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          idNumber,
          fullName,
          text: formData.text.trim()
        })
      });

      if (res.ok) {
        setToast({ message: t('answerPosted', language), type: 'success' });
        setFormData({ text: '' });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
          location.reload();
        }, 300);
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error posting answer:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  const fields = [
    {
      key: 'text',
      type: 'textarea',
      labelOverride: 'answer'
    }
  ];

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      if (onClose) onClose();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div
        className="relative max-w-xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <GenericForm
          titleKey="postAnswer"
          fields={fields}
          data={formData}
          onChange={setFormData}
          onSecondary={onClose}
          onCloseIcon={onClose}
          secondaryLabel="close"
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
      </div>
    </div>
  );
}
