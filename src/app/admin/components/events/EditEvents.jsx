'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../../language';
import { t } from '@/app/utils/loadTranslations';
import Button from '../../../components/Button';

export default function EditEvents({ event, onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(event);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-center mb-4">{t('editEventTitle', language)}</h2>

        <form className="space-y-4">
          <label>{t('eventTitle', language)}
            <input
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </label>

          <label>{t('eventDescription', language)}
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="border p-2 w-full rounded h-24"
            />
          </label>

          <label>{t('eventDate', language)}
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </label>

          <label>{t('eventTime', language)}
            <input
              type="time"
              name="time"
              value={formData.time || ''}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </label>

          <label>{t('eventLocation', language)}
            <input
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </label>

          <label>{t('eventNotes', language)}
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="border p-2 w-full rounded h-20"
            />
          </label>
        </form>

        {Array.isArray(formData.participants) && formData.participants.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">{t('eventParticipants', language)}</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              {formData.participants.map((p, index) => (
                <li key={index}>
                  {p.fullName} - {p.email} - {p.idNumber}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button text={t('cancel', language)} onClick={onClose} />
          <Button
            text={loading ? '...' : t('saveChanges', language)}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
