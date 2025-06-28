// 'use client';
// import React, { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/utils/language/language';
// import { t } from '@/app/utils/loadTranslations';
// import GenericForm from '@/app/components/GenericForm/GenericForm';

// export default function ViewEvent({ event, onClose }) {
//   const [language, setLanguage] = useState('he');

//   useEffect(() => {
//     setLanguage(getLanguage());
//   }, []);

//   if (!event) return null;

//   const renderLine = (labelKey, value) => {
//     if (!value) return null;
//     return (
//       <p className="mb-1">
//         <strong>{t(labelKey, language)}:</strong> {value}
//       </p>
//     );
//   };

//   return (
//     <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <GenericForm
//         titleKey="viewEvent"
//         fields={[]}
//         data={{}}
//         onChange={() => {}}
//         onCloseIcon={onClose}
//       >
//         <div className="text-start space-y-2">
//           {renderLine('eventDate', event.date)}
//           {renderLine('eventTime', event.time)}
//           {renderLine('location', event.location)}
//           {renderLine('eventDescription', event.description)}
//           {renderLine('eventNotes', event.notes)}
//           {renderLine('eventOrganizer', event.organizerName)}
//         </div>
//       </GenericForm>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ViewEvent({ event, onClose }) {
  const language = useLanguage();

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      dir={language === 'he' ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 left-4 text-xl text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          {t('viewEvent', language)}
        </h2>

        <div className="space-y-2 text-start">
          <Line label={t('eventDate', language)} value={event.date} />
          <Line label={t('eventTime', language)} value={event.time} />
          <Line label={t('location', language)} value={event.location} />
          <Line label={t('eventDescription', language)} value={event.description} />
          <Line label={t('eventNotes', language)} value={event.notes} />
          <Line label={t('eventOrganizer', language)} value={event.organizerName} />
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <strong className="weight-600">{label}:</strong> {value}
    </p>
  );
}
