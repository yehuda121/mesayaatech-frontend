'use client';
import React from 'react';
import { t } from '@/app/utils/loadTranslations';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import { useLanguage } from "@/app/utils/language/useLanguage";
import './jobs.css';

export default function ViewJob({ job, onClose }) {
  if (!job) return null;

  const language = useLanguage();

  const renderIfExists = (labelKey, value, isLink = false) => {
    if (!value) return null;
    return (
      <p>
        <strong className="viewJob-line-label">{t(labelKey, language)}:</strong>{' '}
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="viewJob-link">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    );
  };

  const renderField = (fieldValue) => {
    if (!fieldValue) return null;
    const fieldLabel = translatedJobFields[fieldValue]?.[language] || fieldValue;
    return (
      <p>
        <strong className="viewJob-line-label">{t('field', language)}:</strong> {fieldLabel}
      </p>
    );
  };

  return (
    <div className="viewJob-modal-overlay" onClick={onClose}>
      <div className="viewJob-modal-box" dir={language === 'he' ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
        <button className="viewJob-modal-close" onClick={onClose}>
          ✖
        </button>

        <h2 className="viewJob-modal-title">
          {t('company', language)}: {job.company || t('noCompany', language)}
        </h2>

        <div className="viewJob-modal-content">
          {renderIfExists('role', job.role)}
          {renderIfExists('location', job.location)}
          {renderField(job.field)}
          {renderIfExists('minExperience', job.minExperience)}
          {renderIfExists('description', job.description)}
          {renderIfExists('requirements', job.requirements)}
          {renderIfExists('advantages', job.advantages)}
          {renderIfExists('submitEmail', job.submitEmail)}
          {renderIfExists('submitLink', job.submitLink, true)}
          {renderIfExists('companyWebsite', job.companyWebsite, true)}
          {renderIfExists('jobViewLink', job.jobViewLink, true)}
          {job.publisherName && (
            <p>
              <strong className="viewJob-line-label">{t('publisher', language)}:</strong> {job.publisherName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
