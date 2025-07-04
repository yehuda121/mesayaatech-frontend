'use client';

import React from 'react';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";
import './Events.css';

export default function ViewEvent({ event, onClose }) {
  const language = useLanguage();

  if (!event) return null;

  return (
    <div
      className="event-modal-overlay"
      dir={language === 'he' ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="event-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="event-modal-close"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="event-modal-title">
          {t('viewEvent', language)}
        </h2>

        <div className="event-modal-content">
          <Line label={t('eventDate', language)} value={event.date} />
          <Line label={t('eventTime', language)} value={event.time} />
          <Line label={t('location', language)} value={event.location} />
          <Line label={t('eventDescription', language)} value={event.description} />
          <Line label={t('eventNotes', language)} value={event.notes} />
          <Line label={t('eventOrganizer', language)} value={event.organizerName} />
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <strong className="event-line-label">{label}:</strong> {value}
    </p>
  );
}
