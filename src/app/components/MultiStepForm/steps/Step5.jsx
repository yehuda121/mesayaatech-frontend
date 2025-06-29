'use client';

import { t } from '@/app/utils/loadTranslations';

export default function Step5({ data, onChange, onBack, onSubmit, language, userType  }) {
  return (
    <div className={`step-container ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <div className="form-group">
      <label htmlFor="aboutMe">
        {t(
          userType === 'mentor'
            ? 'aboutMeIntroMentor'
            : userType === 'reservist'
            ? 'aboutMeIntro'
            : 'aboutMe',
          language
       )}
      </label>
        <textarea
          id="aboutMe"
          value={data.aboutMe}
          onChange={(e) => onChange('aboutMe', e.target.value)}
          rows={5}
        />
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onBack}>
          {t('back', language)}
        </button>
        <button type="button" className="primary-button" onClick={onSubmit}>
          {t('submit', language)}
        </button>
      </div>
    </div>
  );
}
