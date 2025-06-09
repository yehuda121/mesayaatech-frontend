// 'use client';

// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';

// export default function ReservistDetailsModal({ reservist, onClose }) {
//   const language = getLanguage();
//   if (!reservist) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose} dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <div
//         className="modal-content"
//         onClick={(e) => e.stopPropagation()} // prevent closing on content click
//       >
//         <button className="modal-close" onClick={onClose}>✖</button>
//         <h2 className="modal-title">{t('reservistDetails', language)}</h2>
//         <div className="modal-body">
//           <p><strong>{t('fullName', language)}:</strong> {reservist.fullName}</p>
//           <p><strong>{t('idNumber', language)}:</strong> {reservist.idNumber}</p>
//           <p><strong>{t('email', language)}:</strong> {reservist.email}</p>
//           <p><strong>{t('phone', language)}:</strong> {reservist.phone}</p>
//           <p><strong>{t('armyRole', language)}:</strong> {reservist.armyRole}</p>
//           <p><strong>{t('location', language)}:</strong> {reservist.location}</p>
//           <p><strong>{t('fields', language)}:</strong> {reservist.fields?.join(', ')}</p>
//           <p><strong>{t('experience', language)}:</strong> {reservist.experience}</p>
//           <p><strong>{t('linkedin', language)}:</strong> <a href={reservist.linkedin} target="_blank" rel="noreferrer">{reservist.linkedin}</a></p>
//           <p><strong>{t('notes', language)}:</strong> {reservist.notes}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import { Contact } from 'lucide-react';

export default function ReservistDetailsModal({ reservist, onClose }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  if (!reservist) return null;

  const renderLine = (labelKey, value, isLink = false) => {
    if (!value) return null;
    return (
      <p>
        <strong>{t(labelKey, language)}:</strong>{' '}
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    );
  };

  return (
    <div className="modal-overlay">
      <GenericForm
        titleKey="reservistDetails"
        fields={[]}
        data={{}}
        onChange={() => {}}
        onCloseIcon={onClose}
      >
        <div className="modal-body text-start space-y-2">
          <p className='font-bold text-center'>{t('Contact', language)}</p>
          {renderLine('fullName', reservist.fullName)}
          {renderLine('idNumber', reservist.idNumber)}
          {renderLine('email', reservist.email)}
          {renderLine('phone', reservist.phone)}
          {renderLine('location', reservist.location)}
          <p className='font-bold text-center'>{t('aboutMe', language)}</p>
          {renderLine('aboutMe', reservist.aboutMe)}
          {renderLine('armyRole', reservist.armyRole)}    
          {renderLine('fields', reservist.fields?.join(', '))}
          {renderLine('experience', reservist.experience)}
          {renderLine('linkedin', reservist.linkedin, true)}
          {renderLine('notes', reservist.notes)}
        </div>
      </GenericForm>
    </div>
  );
}
