"use client";
import React, { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function ViewEvent({ event, onClose }) {
  const [language, setLanguage] = useState('he'); // default fallback

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  if (!event) return null;

  return (
    <div 
      className="modal-overlay" 
      dir={language === 'he' ? 'rtl' : 'ltr'} 
      style={{
        width: '30%',
        height: '30%',
        backgroundColor: 'white',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        padding: '1.5rem',
        zIndex: 1000,
      }}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">{event.title}</h2>
        <p><strong>{t('eventDate', language)}:</strong> {event.date}</p>
        <p><strong>{t('eventTime', language)}:</strong> {event.time}</p>
        <p><strong>{t('eventLocation', language)}:</strong> {event.location}</p>
        <p><strong>{t('eventDescription', language)}:</strong> {event.description}</p>
        {event.notes && <p><strong>{t('eventNotes', language)}:</strong> {event.notes}</p>}
        {event.organizerName && <p><strong>{t('eventOrganizer', language)}:</strong> {event.organizerName}</p>}
      </div>
    </div>
  );
}
