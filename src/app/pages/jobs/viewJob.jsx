'use client';
import React from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function ViewJob({ job, onClose }) {
  if (!job) return null;

  const language = getLanguage();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">{job.title}</h2>
        <p><strong>{t('company', language)}:</strong> {job.company}</p>
        <p><strong>{t('location', language)}:</strong> {job.location}</p>
        <p><strong>{t('description', language)}:</strong> {job.description}</p>
        {job.publisherName && (
          <p><strong>{t('publisher', language)}:</strong> {job.publisherName}</p>
        )}
      </div>
    </div>
  );
}
