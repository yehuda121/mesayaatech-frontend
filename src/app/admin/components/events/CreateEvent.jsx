// 'use client';

// import { useState, useEffect } from 'react';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';
// import AlertMessage from '@/app/components/notifications/AlertMessage';
// import '../../admin.css'
// import { useLanguage } from "@/app/utils/language/useLanguage";

// export default function CreateEventForm() {
//   const language = useLanguage();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     date: '',
//     time: '',
//     location: '',
//     notes: '',
//     participants: []
//   });
//   const [alert, setAlert] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const validateForm = () => {
//     const errors = [];

//     const title = formData.title?.trim() || '';
//     const description = formData.description?.trim() || '';
//     const date = formData.date?.trim() || '';
//     const location = formData.location?.trim() || '';
//     const notes = formData.notes?.trim() || '';

//     if (!title) errors.push(t('eventTitleRequired', language));
//     else if (title.length > 100) errors.push(t('eventTitleTooLong', language));

//     if (!description) errors.push(t('eventDescriptionRequired', language));
//     else if (description.length > 1000) errors.push(t('eventDescriptionTooLong', language));

//     if (!date) errors.push(t('eventDateRequired', language));

//     if (location.length > 200) errors.push(t('eventLocationTooLong', language));
//     if (notes.length > 1000) errors.push(t('eventNotesTooLong', language));

//     return errors;
//   };

//   const handleSubmit = async () => {
//     setAlert(null);

//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setAlert({ message: validationErrors[0], type: 'error' });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/upload-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const resData = await res.json();

//       if (res.ok) {
//         setAlert({ message: t('eventSuccess', language), type: 'success' });
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
//         setAlert({ message: resData.error || t('eventError', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Upload error:', err);
//       setAlert({ message: t('eventError', language), type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     { key: 'title', labelOverride: 'eventTitle' },
//     { key: 'description', type: 'textarea', labelOverride: 'eventDescription' },
//     { key: 'date', type: 'date', labelOverride: 'eventDate' },
//     { key: 'time', type: 'time', labelOverride: 'eventTime' },
//     { key: 'location', labelOverride: 'eventLocation' },
//     { key: 'notes', type: 'textarea', labelOverride: 'eventNotes' }
//   ];

//   return (
//     <div className='admin-create-event' dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <GenericForm
//         titleKey="createEventTitle"
//         fields={fields}
//         data={formData}
//         onChange={setFormData}
//         onPrimary={handleSubmit}
//         primaryLabel="eventSubmit"
//         disabledPrimary={loading}
//       />

//       {alert && (
//         <AlertMessage
//           message={alert.message}
//           type={alert.type}
//           onClose={() => setAlert(null)}
//         />
//       )}
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import './EditAndCreateEvent.css';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';

export default function CreateEventForm() {
  const language = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    participants: []
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    const { title = '', description = '', date = '', location = '', notes = '' } = formData;

    if (!title.trim()) errors.push(t('eventTitleRequired', language));
    else if (title.length > 100) errors.push(t('eventTitleTooLong', language));

    if (!description.trim()) errors.push(t('eventDescriptionRequired', language));
    else if (description.length > 1000) errors.push(t('eventDescriptionTooLong', language));

    if (!date.trim()) errors.push(t('eventDateRequired', language));

    if (location.length > 200) errors.push(t('eventLocationTooLong', language));
    if (notes.length > 1000) errors.push(t('eventNotesTooLong', language));

    return errors;
  };

  const handleSubmit = async () => {
    setAlert(null);
    const errors = validateForm();
    if (errors.length > 0) {
      setAlert({ message: errors[0], type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (res.ok) {
        setAlert({ message: t('eventSuccess', language), type: 'success' });
        setFormData({ title: '', description: '', date: '', time: '', location: '', notes: '', participants: [] });
      } else {
        setAlert({ message: resData.error || t('eventError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setAlert({ message: t('eventError', language), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='createEventForm'>
    <div className="event-form-wrapper" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className='createEventTitle'>{t('createEventTitle', language)}</h2>
      <form className="event-form-grid">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t('eventTitle', language)} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t('eventLocation', language)} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder={t('eventDescription', language)} rows={3}></textarea>
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder={t('eventNotes', language)} rows={3}></textarea>
      </form>

      <div className='creat-event-button'>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? t('loading', language) : t('eventSubmit', language)}
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
