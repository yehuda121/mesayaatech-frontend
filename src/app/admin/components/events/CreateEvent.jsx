// 'use client';
// import { useState, useEffect } from 'react';
// import { getLanguage } from '../../../language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '../../../components/Button';

// export default function CreateEventForm() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     date: '',
//     time: '',
//     location: '',
//     notes: '',
//     participants: []
//   });
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccess('');

//     try {
//       const res = await fetch('http://localhost:5000/api/upload-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const resData = await res.json();

//       if (res.ok) {
//         setSuccess(t('eventSuccess', language));
//         setFormData({
//           title: '',
//           description: '',
//           date: '',
//           time: '',
//           location: '',
//           notes: '',
//           participants: []
//         });
//       } else {
//         setSuccess(resData.error || t('eventError', language));
//       }
//     } catch (err) {
//       console.error('Upload error:', err);
//       setSuccess(t('eventError', language));
//     }
//   };

//  return (
//   <div className="create-event-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
//     <h1 className="form-title">{t('createEventTitle', language)}</h1>
//     <form onSubmit={handleSubmit} className="form-wrapper">
//       <label className="form-label">
//         {t('eventTitle', language)}
//         <input
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//         />
//       </label>

//       <label className="form-label">
//         {t('eventDescription', language)}
//         <textarea
//           name="description"
//           required
//           value={formData.description}
//           onChange={handleChange}
//         />
//       </label>

//       <label className="form-label">
//         {t('eventDate', language)}
//         <input
//           name="date"
//           type="date"
//           required
//           value={formData.date}
//           onChange={handleChange}
//         />
//       </label>

//       <label className="form-label">
//         {t('eventTime', language)}
//         <input
//           name="time"
//           type="time"
//           value={formData.time}
//           onChange={handleChange}
//         />
//       </label>

//       <label className="form-label">
//         {t('eventLocation', language)}
//         <input
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//         />
//       </label>

//       <label className="form-label">
//         {t('eventNotes', language)}
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//         />
//       </label>

//       <Button text={t('eventSubmit', language)} type="submit" />
//     </form>

//     {success && <p className="form-success">{success}</p>}
//   </div>
//   );

// }
'use client';

import { useState, useEffect } from 'react';
import { getLanguage } from '../../../language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function CreateEventForm() {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    participants: []
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSubmit = async () => {
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/upload-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (res.ok) {
        setSuccess(t('eventSuccess', language));
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          notes: '',
          participants: []
        });
      } else {
        setSuccess(resData.error || t('eventError', language));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setSuccess(t('eventError', language));
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
    <div className="create-event-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericForm
        titleKey="createEventTitle"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSubmit}
        primaryLabel="eventSubmit"
      />

      {success && <p className="form-success">{success}</p>}
    </div>
  );
}
