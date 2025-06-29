'use client';

import { t } from '@/app/utils/loadTranslations';

export default function Step1({ data, onChange, onNext, language }) {
  return (
    <div className="step-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="form-group">
        <label htmlFor="fullName">{t('fullName', language)}</label>
        <input
          id="fullName"
          type="text"
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="idNumber">{t('idNumber', language)}</label>
        <input
          id="idNumber"
          type="text"
          value={data.idNumber}
          onChange={(e) => onChange('idNumber', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">{t('email', language)}</label>
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">{t('phone', language)}</label>
        <input
          id="phone"
          type="text"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onNext}>
          {t('next', language)}
        </button>
      </div>
    </div>
  );
}
