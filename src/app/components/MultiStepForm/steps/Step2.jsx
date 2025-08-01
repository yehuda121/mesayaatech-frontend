'use client';

import { t } from '@/app/utils/loadTranslations';
import { locations } from '@/app/components/Locations';
import { JobFields } from '@/app/components/jobs/jobFields';

export default function Step2({ data, onChange, onNext, onBack, language, userType }) {
  const locationOptions = locations.flatMap((region) =>
    region.locations.map((loc) => ({
      value: language === 'he' ? loc.he : loc.en,
      label: language === 'he' ? loc.he : loc.en,
    }))
  );

  const fieldOptions = Object.keys(JobFields).map(value => ({
    value,
    label: t(value, language)
  }));

  return (
    <div className="step-container">
      {/* RESERVIST */}
      {userType === 'reservist' && (
        <>
          <div className="form-group">
            <label htmlFor="armyRole">
              {t('armyRole', language)}<span className="required-star">*</span>
            </label>
            <input
              id="armyRole"
              type="text"
              value={data.armyRole || ''}
              onChange={(e) => onChange('armyRole', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-group-title">
              {t('professionalFieldsSelect', language)}
              <span className="required-star">*</span>
            </label>
            <div className="checkbox-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
              {fieldOptions.map((opt) => (
                <div key={opt.value} className="checkbox-row">
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={(data.fields || []).includes(opt.value)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...(data.fields || []), opt.value]
                        : (data.fields || []).filter((v) => v !== opt.value);
                      onChange('fields', updated);
                    }}
                  />
                  <label>{opt.label}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MENTOR */}
      {userType === 'mentor' && (
        <div className="form-group">
          <label className="checkbox-group-title">
            {t('mainProfession', language)}<span className="required-star">*</span>
          </label>
          <div className="checkbox-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {fieldOptions.map((opt) => (
              <div key={opt.value} className="checkbox-row">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={(data.specialties || []).includes(opt.value)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...(data.specialties || []), opt.value]
                      : (data.specialties || []).filter((v) => v !== opt.value);
                    onChange('specialties', updated);
                  }}
                />
                <label>{opt.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AMBASSADOR */}
      {userType === 'ambassador' && (
        <>
          <div className="form-group">
            <label htmlFor="currentCompany">
              {t('currentCompany', language)}<span className="required-star">*</span>
            </label>
            <input
              id="currentCompany"
              type="text"
              value={data.currentCompany || ''}
              onChange={(e) => onChange('currentCompany', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">
              {t('position', language)}<span className="required-star">*</span>
            </label>
            <input
              id="position"
              type="text"
              value={data.position || ''}
              onChange={(e) => onChange('position', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="canShareJobs">
              {t('canShareJobs', language)}<span className="required-star">*</span>
            </label>
            <select
              id="canShareJobs"
              value={data.canShareJobs || ''}
              onChange={(e) => onChange('canShareJobs', e.target.value)}
            >
              <option value="">{language === 'he' ? 'בחר' : 'Select'}</option>
              <option value="כן">{language === 'he' ? 'כן' : 'Yes'}</option>
              <option value="אולי">{language === 'he' ? 'אולי' : 'Maybe'}</option>
              <option value="לא">{language === 'he' ? 'לא' : 'No'}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-group-title">
              {t('ambassadorJobFieldsTitle', language)}<span className="required-star">*</span>
            </label>
            <div className="checkbox-list" dir={language === 'he' ? 'rtl' : 'ltr'}>
              {fieldOptions.map((opt) => (
                <div key={opt.value} className="checkbox-row">
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={(data.jobFields || []).includes(opt.value)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...(data.jobFields || []), opt.value]
                        : (data.jobFields || []).filter((v) => v !== opt.value);
                      onChange('jobFields', updated);
                    }}
                  />
                  <label>{opt.label}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* LOCATION - COMMON */}
      <div className="form-group">
        <label htmlFor="location">
          {t('location', language)}<span className="required-star">*</span>
        </label>
        <select
          id="location"
          value={data.location}
          onChange={(e) => onChange('location', e.target.value)}
        >
          <option value="">{t('selectOption', language)}</option>
          {locationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* EXPERIENCE - COMMON */}
      {userType !== 'ambassador' && (
        <div className="form-group">
          <label htmlFor="experience">
            {t('experience', language)}<span className="required-star">*</span>
          </label>
          <textarea
            id="experience"
            value={data.experience}
            onChange={(e) => onChange('experience', e.target.value)}
            rows={4}
          />
        </div>
      )}

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
