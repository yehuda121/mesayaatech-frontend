'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import './EditAndCreateEvent.css';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';

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
    const { title = '', description = '', location = '', notes = '', date = '' } = formData;
    const { text: safeTitle, tooLong: titleTooLong, wasModified: titleModified } = sanitizeText(title, 100);
    const { text: safeDescription, tooLong: descTooLong, wasModified: descModified } = sanitizeText(description, 1000);
    const { text: safeLocation, tooLong: locationTooLong, wasModified: locationModified } = sanitizeText(location, 200);
    const { text: safeNotes, tooLong: notesTooLong, wasModified: notesModified } = sanitizeText(notes, 1000);

    if (!safeTitle) errors.push(t('eventTitleRequired', language));
    else if (titleTooLong) errors.push(t('eventTitleTooLong', language));
    else if (titleModified) errors.push(t('unsafeInputSanitized', language));

    if (!safeDescription) errors.push(t('eventDescriptionRequired', language));
    else if (descTooLong) errors.push(t('eventDescriptionTooLong', language));
    else if (descModified) errors.push(t('unsafeInputSanitized', language));

    if (!date.trim()) errors.push(t('eventDateRequired', language));

    if (locationTooLong) errors.push(t('eventLocationTooLong', language));
    else if (locationModified) errors.push(t('unsafeInputSanitized', language));

    if (notesTooLong) errors.push(t('eventNotesTooLong', language));
    else if (notesModified) errors.push(t('unsafeInputSanitized', language));

    setFormData(prev => ({
      ...prev,
      title: safeTitle,
      description: safeDescription,
      location: safeLocation,
      notes: safeNotes
    }));

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-event`, {
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
    <div className='CE-createEventForm'>
    <div className="CE-event-form-wrapper" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className='CE-createEventTitle'>{t('createEventTitle', language)}</h2>
      {/* <form className="CE-event-form-grid">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t('eventTitle', language)} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t('eventLocation', language)} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder={t('eventDescription', language)} rows={3}></textarea>
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder={t('eventNotes', language)} rows={3}></textarea>
      </form> */}

      <form className="CE-event-form-grid">
        <div className="CE-form-field">
          <label htmlFor="title">
            {t('eventTitle', language)}<span className="required-star">*</span>
          </label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="CE-form-field">
          <label htmlFor="date">
            {t('eventDate', language)}<span className="required-star">*</span>
          </label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="CE-form-field">
          <label htmlFor="time">
            {t('eventTime', language)}
          </label>
          <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} />
        </div>

        <div className="CE-form-field">
          <label htmlFor="location">
            {t('eventLocation', language)}
          </label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="CE-form-field">
          <label htmlFor="description">
            {t('eventDescription', language)}<span className="required-star">*</span>
          </label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3}></textarea>
        </div>

        <div className="CE-form-field">
          <label htmlFor="notes">
            {t('eventNotes', language)}
          </label>
          <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3}></textarea>
        </div>
      </form>

      <div className='CE-creat-event-button'>
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
