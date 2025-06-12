
// 'use client';
// import React from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';

// export default function ViewJob({ job, onClose }) {
//   if (!job) return null;

//   const language = getLanguage();

//   const renderIfExists = (labelKey, value, isLink = false) => {
//     if (!value) return null;
//     return (
//       <p>
//         <strong>{t(labelKey, language)}:</strong>{' '}
//         {isLink ? (
//           <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//             {value}
//           </a>
//         ) : (
//           value
//         )}
//       </p>
//     );
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content text-start" dir={language === 'he' ? 'rtl' : 'ltr'}>
//         <button className="modal-close" onClick={onClose}>✖</button>
//         <h2 className={`text-xl font-bold mb-4 ${language === 'he' ? 'rtl' : 'ltr'}`}>
//           {t('company', language)}: {job.company || t('noCompany', language)}
//         </h2>

//         {renderIfExists('role', job.role)}
//         {renderIfExists('location', job.location)}
//         {renderIfExists('minExperience', job.minExperience)}
//         {renderIfExists('description', job.description)}
//         {renderIfExists('requirements', job.requirements)}
//         {renderIfExists('advantages', job.advantages)}
//         {renderIfExists('submitEmail', job.submitEmail)}
//         {renderIfExists('submitLink', job.submitLink, true)}
//         {renderIfExists('companyWebsite', job.companyWebsite, true)}
//         {renderIfExists('jobViewLink', job.jobViewLink, true)}

//         {job.publisherName && (
//           <p><strong>{t('publisher', language)}:</strong> {job.publisherName}</p>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import React from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import { translatedJobFields } from '@/app/components/jobs/jobFields';

export default function ViewJob({ job, onClose }) {
  if (!job) return null;

  const language = getLanguage();

  const renderIfExists = (labelKey, value, isLink = false) => {
    if (!value) return null;
    return (
      <p>
        <strong>{t(labelKey, language)}:</strong>{' '}
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    );
  };

  // Translate the field if exists
  const renderField = (fieldValue) => {
    if (!fieldValue) return null;
    const fieldLabel = translatedJobFields[fieldValue]?.[language] || fieldValue;
    return (
      <p>
        <strong>{t('field', language)}:</strong> {fieldLabel}
      </p>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content text-start" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2 className={`text-xl font-bold mb-4 ${language === 'he' ? 'rtl' : 'ltr'}`}>
          {t('company', language)}: {job.company || t('noCompany', language)}
        </h2>

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
          <p><strong>{t('publisher', language)}:</strong> {job.publisherName}</p>
        )}
      </div>
    </div>
  );
}
