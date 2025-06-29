'use client';

import { t } from '@/app/utils/loadTranslations';

export default function Step4({ data, onChange, onNext, onBack, onSubmit, isLastStep, language }) {
  return (
    <div className={`step-container ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <div className="form-group">
        <label htmlFor="linkedin">{t('linkedin', language)}</label>
        <input
          id="linkedin"
          type="text"
          value={data.linkedin}
          onChange={(e) => onChange('linkedin', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">{t('notes', language)}</label>
        <textarea
          id="notes"
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          rows={4}
        />
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>
          {t('back', language)}
        </button>
        {isLastStep ? (
          <button type="button" className="primary-button" onClick={onSubmit}>
            {t('submit', language)}
          </button>
        ) : (
          <button type="button" className="primary-button" onClick={onNext}>
            {t('next', language)}
          </button>
        )}
      </div>
    </div>
  );
}
