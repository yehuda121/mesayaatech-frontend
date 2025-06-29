'use client';

import { t } from '@/app/utils/loadTranslations';

export default function Step3({ data, onChange, onNext, onBack, language }) {
  return (
    <div className={`step-container ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <div className="form-group">
        <label htmlFor="pastMentoring">{t('pastMentoring', language)}</label>
        <textarea
          id="pastMentoring"
          value={data.pastMentoring}
          onChange={(e) => onChange('pastMentoring', e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="availability">{t('availability', language)}</label>
        <input
          id="availability"
          type="text"
          value={data.availability}
          onChange={(e) => onChange('availability', e.target.value)}
        />
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>
          {t('back', language)}
        </button>
        <button type="button" className="primary-button" onClick={onNext}>
          {t('next', language)}
        </button>
      </div>
    </div>
  );
}
