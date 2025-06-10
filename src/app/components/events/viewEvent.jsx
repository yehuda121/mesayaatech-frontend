'use client';
import React, { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function ViewEvent({ event, onClose }) {
  const [language, setLanguage] = useState('he');

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  if (!event) return null;

  const renderLine = (labelKey, value) => {
    if (!value) return null;
    return (
      <p className="mb-1">
        <strong>{t(labelKey, language)}:</strong> {value}
      </p>
    );
  };

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericForm
        titleKey="viewEvent"
        fields={[]}
        data={{}}
        onChange={() => {}}
        onCloseIcon={onClose}
      >
        <div className="text-start space-y-2">
          {renderLine('eventDate', event.date)}
          {renderLine('eventTime', event.time)}
          {renderLine('location', event.location)}
          {renderLine('eventDescription', event.description)}
          {renderLine('eventNotes', event.notes)}
          {renderLine('eventOrganizer', event.organizerName)}
        </div>
      </GenericForm>
    </div>
  );
}
