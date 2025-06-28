'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function EditEvents({ event, onClose, onSave }) {
  const [formData, setFormData] = useState(event);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const language = useLanguage();

  const validateForm = () => {
    const errors = [];

    const title = formData.title?.trim() || '';
    const description = formData.description?.trim() || '';
    const date = formData.date?.trim() || '';
    const location = formData.location?.trim() || '';
    const notes = formData.notes?.trim() || '';

    if (!title) errors.push(t('eventTitleRequired', language));
    else if (title.length > 100) errors.push(t('eventTitleTooLong', language));

    if (!description) errors.push(t('eventDescriptionRequired', language));
    else if (description.length > 1000) errors.push(t('eventDescriptionTooLong', language));

    if (!date) errors.push(t('eventDateRequired', language));

    if (location.length > 200) errors.push(t('eventLocationTooLong', language));
    if (notes.length > 1000) errors.push(t('eventNotesTooLong', language));

    return errors;
  };

  const handleSave = async () => {
    if (!formData.eventId) {
      setAlert({ message: t('eventIdMissing', language), type: 'error' });
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlert({ message: validationErrors[0], type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: formData.eventId,
          updatedData: formData,
        }),
      });

      if (res.ok) {
        onSave(formData);
      } else {
        const error = await res.text();
        setAlert({ message: error || t('saveError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setAlert({ message: t('saveError', language), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'title', labelOverride: 'eventTitle' },
    { key: 'description', type: 'textarea', labelOverride: 'eventDescription' },
    { key: 'date', type: 'date', labelOverride: 'eventDate' },
    { key: 'time', type: 'time', labelOverride: 'eventTime' },
    { key: 'location', labelOverride: 'eventLocation' },
    { key: 'notes', type: 'textarea', labelOverride: 'eventNotes' }
  ];

  return (
    <div className="GF-generic-modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericForm
        titleKey="editEventTitle"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSave}
        onCloseIcon={onClose}
        primaryLabel={loading ? '' : 'saveChanges'}
      >
        {(formData.participants?.length > 0) ? (
          <div className="event-participants">
            <h3 className='font-bold text-center mb-3'>
              {t('eventParticipants', language)} ({formData.participants.length})
            </h3>
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '0.5rem'
              }}
            >
              <ul dir={language === 'he' ? 'rtl' : 'ltr'} style={{ margin: 0, paddingInlineStart: '1rem' }}>
                {formData.participants.map((p, index) => (
                  <li key={index}>
                    {p.fullName} - {p.email} - {p.idNumber}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>{t('noParticipants', language)}</p>
        )}
      </GenericForm>

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/utils/language/language';
// import { t } from '@/app/utils/loadTranslations';
// import AlertMessage from '@/app/components/notifications/AlertMessage';

// export default function EditEvents({ event, onClose, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(event);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const updateField = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const validateForm = () => {
//     const { title = '', description = '', date = '', location = '', notes = '' } = formData;
//     const errors = [];

//     if (!title.trim()) errors.push(t('eventTitleRequired', language));
//     else if (title.length > 100) errors.push(t('eventTitleTooLong', language));

//     if (!description.trim()) errors.push(t('eventDescriptionRequired', language));
//     else if (description.length > 1000) errors.push(t('eventDescriptionTooLong', language));

//     if (!date.trim()) errors.push(t('eventDateRequired', language));

//     if (location.length > 200) errors.push(t('eventLocationTooLong', language));
//     if (notes.length > 1000) errors.push(t('eventNotesTooLong', language));

//     return errors;
//   };

//   const handleSave = async () => {
//     const errors = validateForm();
//     if (!formData.eventId) {
//       setAlert({ message: t('eventIdMissing', language), type: 'error' });
//       return;
//     }

//     if (errors.length > 0) {
//       setAlert({ message: errors[0], type: 'error' });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ eventId: formData.eventId, updatedData: formData }),
//       });

//       if (res.ok) {
//         onSave(formData);
//       } else {
//         const errText = await res.text();
//         setAlert({ message: errText || t('saveError', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Error updating event:', err);
//       setAlert({ message: t('saveError', language), type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
//       dir={language === 'he' ? 'rtl' : 'ltr'}
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-3 left-4 text-xl text-gray-600 hover:text-red-500"
//           onClick={onClose}
//         >
//           ✖
//         </button>

//         <h2 className="text-2xl font-bold text-center mb-6">{t('editEventTitle', language)}</h2>

//         <form className="space-y-4">
//           <Field label={t('eventTitle', language)} value={formData.title} onChange={v => updateField('title', v)} />
//           <Field label={t('eventDescription', language)} value={formData.description} onChange={v => updateField('description', v)} textarea />
//           <Field label={t('eventDate', language)} value={formData.date} onChange={v => updateField('date', v)} type="date" />
//           <Field label={t('eventTime', language)} value={formData.time} onChange={v => updateField('time', v)} type="time" />
//           <Field label={t('eventLocation', language)} value={formData.location} onChange={v => updateField('location', v)} />
//           <Field label={t('eventNotes', language)} value={formData.notes} onChange={v => updateField('notes', v)} textarea />

//           {formData.participants?.length > 0 ? (
//             <div>
//               <h3 className="font-semibold mt-4 mb-2">
//                 {t('eventParticipants', language)} ({formData.participants.length})
//               </h3>
//               <div className="border rounded-md max-h-40 overflow-y-auto p-2 bg-gray-50">
//                 <ul className="list-disc ps-5 space-y-1">
//                   {formData.participants.map((p, idx) => (
//                     <li key={idx}>
//                       {p.fullName} – {p.email} – {p.idNumber}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-600">{t('noParticipants', language)}</p>
//           )}

//           <button
//             type="button"
//             disabled={loading}
//             onClick={handleSave}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-6"
//           >
//             {loading ? t('saving', language) + '...' : t('saveChanges', language)}
//           </button>
//         </form>

//         {alert && (
//           <AlertMessage
//             message={alert.message}
//             type={alert.type}
//             onClose={() => setAlert(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function Field({ label, value, onChange, textarea = false, type = 'text' }) {
//   return (
//     <div className="flex flex-col">
//       <label className="font-medium mb-1">{label}</label>
//       {textarea ? (
//         <textarea
//           className="border rounded p-2"
//           value={value}
//           rows={4}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         <input
//           className="border rounded p-2"
//           type={type}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       )}
//     </div>
//   );
// }
