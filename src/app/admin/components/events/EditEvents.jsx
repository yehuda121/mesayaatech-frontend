// 'use client';

// import { useState } from 'react';
// import { t } from '@/app/utils/loadTranslations';
// import { useLanguage } from "@/app/utils/language/useLanguage";
// import './EditAndCreateEvent.css';
// import Button from '@/app/components/Button/Button';
// import AlertMessage from '@/app/components/Notifications/AlertMessage';

// export default function EditEventModal({ event, onClose, onSave }) {
//   const language = useLanguage();
//   const [formData, setFormData] = useState(event);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   const handleChange = (key, value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           eventId: formData.eventId,
//           updatedData: formData
//         }),
//       });

//       if (res.ok) {
//         setAlert({ message: t('eventUpdatedSuccessfully', language), type: 'success' });
//         onSave(formData);
//       } else {
//         const errText = await res.text()
//         console.error(errText);
//         setAlert({ message: t('saveError', language), type: 'error' });
//       }
//     } catch (err) {
//       setAlert({ message: t('saveError', language), type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!formData) return null;

//   return (
//     <div className="EE-overlay">
//       <div className="EE-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
//         {onClose && (
//           <button className="EE-close-button" onClick={onClose} aria-label="Close">✖</button>
//         )}

//         <h2 className="EE-title">{t('editEventTitle', language)}</h2>

//         <div className="EE-content">
//           {['title', 'description', 'date', 'time', 'location', 'notes'].map((field) => (
//             <div key={field} className="EE-input-group">
//               <label className="EE-label" htmlFor={field}>
//                 {t(`event${field.charAt(0).toUpperCase() + field.slice(1)}`, language)}
//               </label>
//               {field === 'description' || field === 'notes' ? (
//                 <textarea
//                   id={field}
//                   value={formData[field] || ''}
//                   onChange={(e) => handleChange(field, e.target.value)}
//                   className="EE-textarea"
//                 />
//               ) : (
//                 <input
//                   id={field}
//                   type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
//                   value={formData[field] || ''}
//                   onChange={(e) => handleChange(field, e.target.value)}
//                   className={`EE-input ${['date', 'time'].includes(field) ? 'EE-input-narrow' : ''}`}
//                 />
//               )}
//             </div>
//           ))}

//           <div className="EE-participants-section">
//             <h3 className="EE-subtitle">
//               {t('eventParticipants', language)} ({formData.participants?.length || 0})
//             </h3>

//             {formData.participants?.length > 0 ? (
//               <div className="EE-participants-scroll">
//                 <ul className="EE-participant-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
//                   {formData.participants.map((p, index) => (
//                     <li key={index} className="EE-participant-item">
//                       {p.fullName} - {p.email} - {p.idNumber}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p>{t('noParticipants', language)}</p>
//             )}
//           </div>

//           <div className="EE-button">
//             <Button onClick={handleSave} disabled={loading}>
//               {loading ? t('saving', language) : t('saveChanges', language)}
//             </Button>
//           </div>
//         </div>

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


'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from '@/app/utils/language/useLanguage';
import './EditAndCreateEvent.css';
import Button from '@/app/components/Button/Button';
import AlertMessage from '@/app/components/Notifications/AlertMessage';

export default function EditEventModal({ event, onClose, onSave }) {
  const language = useLanguage();
  const [formData, setFormData] = useState(event);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: formData.eventId,
          updatedData: formData
        }),
      });

      if (res.ok) {
        setAlert({ message: t('eventUpdatedSuccessfully', language), type: 'success' });
        onSave(formData);
      } else {
        const errText = await res.text();
        console.error(errText);
        setAlert({ message: t('saveError', language), type: 'error' });
      }
    } catch (err) {
      setAlert({ message: t('saveError', language), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <div className='CE-createEventForm'>
      <div className="CE-event-form-wrapper" dir={language === 'he' ? 'rtl' : 'ltr'}>
        {onClose && (
          <button className="EE-close-button" onClick={onClose} aria-label="Close">✖</button>
        )}

        <h2 className='CE-createEventTitle'>{t('editEventTitle', language)}</h2>

        <form className="CE-event-form-grid">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t('eventTitle', language)} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} />
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t('eventLocation', language)} />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder={t('eventDescription', language)} rows={3}></textarea>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder={t('eventNotes', language)} rows={3}></textarea>
        </form>

        <div className="EE-participants-section">
          <h3 className="EE-subtitle">
            {t('eventParticipants', language)} ({formData.participants?.length || 0})
          </h3>

          {formData.participants?.length > 0 ? (
            <div className="EE-participants-scroll">
              <ul className="EE-participant-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
                {formData.participants.map((p, index) => (
                  <li key={index} className="EE-participant-item">
                    {p.fullName} - {p.email} - {p.idNumber}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>{t('noParticipants', language)}</p>
          )}
        </div>

        <div className="CE-creat-event-button">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? t('saving', language) : t('saveChanges', language)}
          </Button>
        </div>

        {alert && (
          <AlertMessage
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
}
