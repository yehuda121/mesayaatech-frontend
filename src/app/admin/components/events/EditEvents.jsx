// 'use client';
// import { useEffect, useState } from 'react';
// import { getLanguage } from '../../../language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '../../../components/Button';

// export default function EditEvents({ event, onClose, onSave }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(event);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     if (!formData.eventId) {
//       console.error('Missing eventId');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           eventId: formData.eventId,
//           updatedData: formData,
//         }),
//       });

//       if (res.ok) {
//         onSave(formData);
//       } else {
//         const error = await res.text();
//         console.error('Update failed:', error);
//       }
//     } catch (err) {
//       console.error('Error updating event:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <div className="modal-box">
//         <h2 className="form-title">{t('editEventTitle', language)}</h2>

//         <form className="form-wrapper">
//           <label className="form-label">
//             {t('eventTitle', language)}
//             <input
//               name="title"
//               value={formData.title || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('eventDescription', language)}
//             <textarea
//               name="description"
//               value={formData.description || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('eventDate', language)}
//             <input
//               type="date"
//               name="date"
//               value={formData.date || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('eventTime', language)}
//             <input
//               type="time"
//               name="time"
//               value={formData.time || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('eventLocation', language)}
//             <input
//               name="location"
//               value={formData.location || ''}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="form-label">
//             {t('eventNotes', language)}
//             <textarea
//               name="notes"
//               value={formData.notes || ''}
//               onChange={handleChange}
//               className="form-textarea short"
//             />
//           </label>
//         </form>

//         {Array.isArray(formData.participants) && formData.participants.length > 0 && (
//           <div className="event-participants">
//             <h3 className="participants-title">{t('eventParticipants', language)}</h3>
//             <ul className="participants-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
//               {formData.participants.map((p, index) => (
//                 <li key={index}>
//                   {p.fullName} - {p.email} - {p.idNumber}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <div className="form-actions">
//           <Button text={t('cancel', language)} onClick={onClose} />
//           <Button
//             text={loading ? '...' : t('saveChanges', language)}
//             onClick={handleSave}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '../../../language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditEvents({ event, onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(event);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSave = async () => {
    if (!formData.eventId) {
      console.error('Missing eventId');
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
        console.error('Update failed:', error);
      }
    } catch (err) {
      console.error('Error updating event:', err);
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
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <GenericForm
          titleKey="editEventTitle"
          fields={fields}
          data={formData}
          onChange={setFormData}
          onPrimary={handleSave}
          onSecondary={onClose}
          primaryLabel={loading ? '' : 'saveChanges'}
          secondaryLabel="cancel"
        >
          {Array.isArray(formData.participants) && formData.participants.length > 0 && (
            <div className="event-participants">
              <h3 className="participants-title">{t('eventParticipants', language)}</h3>
              <ul className="participants-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
                {formData.participants.map((p, index) => (
                  <li key={index}>
                    {p.fullName} - {p.email} - {p.idNumber}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GenericForm>
      </div>
    </div>
  );
}
