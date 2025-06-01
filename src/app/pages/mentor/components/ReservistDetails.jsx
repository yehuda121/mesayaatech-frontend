'use client';

import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function ReservistDetailsModal({ reservist, onClose }) {
  const language = getLanguage();
  if (!reservist) return null;

  return (
    <div className="modal-overlay" onClick={onClose} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing on content click
      >
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2 className="modal-title">{t('reservistDetails', language)}</h2>
        <div className="modal-body">
          <p><strong>{t('fullName', language)}:</strong> {reservist.fullName}</p>
          <p><strong>{t('idNumber', language)}:</strong> {reservist.idNumber}</p>
          <p><strong>{t('email', language)}:</strong> {reservist.email}</p>
          <p><strong>{t('phone', language)}:</strong> {reservist.phone}</p>
          <p><strong>{t('armyRole', language)}:</strong> {reservist.armyRole}</p>
          <p><strong>{t('location', language)}:</strong> {reservist.location}</p>
          <p><strong>{t('fields', language)}:</strong> {reservist.fields?.join(', ')}</p>
          <p><strong>{t('experience', language)}:</strong> {reservist.experience}</p>
          <p><strong>{t('linkedin', language)}:</strong> <a href={reservist.linkedin} target="_blank" rel="noreferrer">{reservist.linkedin}</a></p>
          <p><strong>{t('notes', language)}:</strong> {reservist.notes}</p>
        </div>
      </div>
    </div>
  );
}
