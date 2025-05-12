'use client';
import { useState, useEffect } from 'react';
import { getLanguage } from '../../language';
import { t } from '@/app/utils/loadTranslations';
import Button from '../../../components/Button';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold text-center">{t('createEventTitle', language)}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>{t('eventTitle', language)}
          <input name="title" value={formData.title} onChange={handleChange}
            className="border p-2 w-full rounded" />
        </label>

        <label>{t('eventDescription', language)}
          <textarea name="description" required value={formData.description} onChange={handleChange}
            className="border p-2 w-full rounded h-24" />
        </label>

        <label>{t('eventDate', language)}
          <input name="date" type="date" required value={formData.date} onChange={handleChange}
            className="border p-2 w-full rounded" />
        </label>

        <label>{t('eventTime', language)}
          <input name="time" type="time" value={formData.time} onChange={handleChange}
            className="border p-2 w-full rounded" />
        </label>

        <label>{t('eventLocation', language)}
          <input name="location" value={formData.location} onChange={handleChange}
            className="border p-2 w-full rounded" />
        </label>

        <label>{t('eventNotes', language)}
          <textarea name="notes" value={formData.notes} onChange={handleChange}
            className="border p-2 w-full rounded h-20" />
        </label>

        <Button text={t('eventSubmit', language)} type="submit" />
      </form>

      {success && <p className="text-center text-green-600 font-bold mt-4">{success}</p>}
    </div>
  );
}
