'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '../../../language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';

export default function EditEvents({ event, onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(event);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

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
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericForm
        titleKey="editEventTitle"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSave}
        onSecondary={onClose}
        onCloseIcon={onClose}
        primaryLabel={loading ? '' : 'saveChanges'}
        secondaryLabel="cancel"
      >
        {(formData.participants?.length > 0) ? (
          <div className="event-participants">
            <h3 className="participants-title">{t('eventParticipants', language)}</h3>
            <ul dir={language === 'he' ? 'rtl' : 'ltr'}>
              {formData.participants.map((p, index) => (
                <li key={index}>
                  {p.fullName} - {p.email} - {p.idNumber}
                </li>
              ))}
            </ul>
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
