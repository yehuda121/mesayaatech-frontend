// 'use client';
// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '@/app/components/Button';

// export default function EditReservistFormAdmin({ user, mentorsMap, onClose, onSave, onDelete }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [formData, setFormData] = useState(user);
//   const [mentorDetails, setMentorDetails] = useState(null);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     const mentorId = formData.mentorId;
//     if (mentorId && mentorId !== 'notInterested') {
//         const id = mentorId.replace('mentor#', '');
//         fetch(`http://localhost:5000/api/get-user-form?userType=mentor&idNumber=${id}`)
//         .then(res => res.ok ? res.json() : null)
//         .then(data => setMentorDetails(data))
//         .catch(() => setMentorDetails(null));
//     }
//     }, [formData.mentorId]);


//   const handleChange = (key, value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   const isArrayField = (key) => Array.isArray(formData[key]);

//   const renderField = (key) => (
//     <label key={key} className="block mb-2">
//       <span className="font-medium">{t(key, language)}</span>
//       {isArrayField(key) ? (
//         <input
//           type="text"
//           className="w-full border p-2 rounded"
//           value={formData[key].join(', ')}
//           onChange={(e) =>
//             handleChange(key, e.target.value.split(',').map((s) => s.trim()))
//           }
//         />
//       ) : key === 'notes' || key === 'experience' ? (
//         <textarea
//           className="w-full border p-2 rounded h-20"
//           value={formData[key] || ''}
//           onChange={(e) => handleChange(key, e.target.value)}
//         />
//       ) : (
//         <input
//           type="text"
//           className="w-full border p-2 rounded"
//           value={formData[key] || ''}
//           onChange={(e) => handleChange(key, e.target.value)}
//         />
//       )}
//     </label>
//   );

//   const fields = [
//     'fullName', 'idNumber', 'email', 'phone', 'armyRole',
//     'location', 'fields', 'experience', 'linkedin', 'notes'
//   ];

//   // Render mentor information
//     const renderMentorDetails = () => {
//     const mentorId = (formData.mentorId || '').trim();

//     if (mentorId === 'notInterested') {
//         return <p className="text-sm text-red-600">{t('notInterestedInMentor', language)}</p>;
//     }

//     if (!mentorId) {
//         return <p className="text-sm text-gray-600">{t('noMentorAssigned', language)}</p>;
//     }

//     if (!mentorDetails) {
//         return <p className="text-sm text-yellow-600">{t('mentorDataUnavailable', language)}</p>;
//     }

//     return (
//         <p className="text-sm text-green-700">
//         {t('assignedMentor', language)}: {mentorDetails.fullName} ({mentorDetails.phone})
//         </p>
//     );
//     };

//   return (
//     <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <div className="modal-box">
//         <h2 className="form-title">{t('editUserDetails', language)}</h2>

//         <form className="form-wrapper">
//           {fields.map(renderField)}

//           {/* Mentor display section */}
//           <div className="mt-4">
//             <span className="font-medium block">{t('mentor', language)}:</span>
//             {renderMentorDetails()}
//           </div>
//         </form>

//         <div className="form-actions">
//           <Button text={t('deleteUser', language)} color="red" onClick={() => {
//             if (confirm(t('confirmDeleteUser', language))) {
//               onDelete(user);
//             }
//           }} />
//           <Button text={t('cancel', language)} onClick={onClose} />
//           <Button text={t('saveChanges', language)} onClick={() => onSave(formData)} />
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
import Button from '@/app/components/Button';

export default function EditReservistFormAdmin({ user, mentorsMap, onClose, onSave, onDelete }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(user);
  const [mentorDetails, setMentorDetails] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const mentorId = formData.mentorId;

    if (typeof mentorId === 'string' && mentorId.startsWith('mentor#')) {
      const id = mentorId.replace('mentor#', '');
      fetch(`http://localhost:5000/api/get-user-form?userType=mentor&idNumber=${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setMentorDetails(data))
        .catch(() => setMentorDetails(null));
    } else {
      setMentorDetails(null); // reset if no valid mentor ID
    }
  }, [formData.mentorId]);


  const handleChange = (newData) => {
    setFormData(newData);
  };

  const fields = [
    { key: 'fullName' },
    { key: 'idNumber' },
    { key: 'email' },
    { key: 'phone' },
    { key: 'armyRole' },
    { key: 'location' },
    {
      key: 'fields',
      labelOverride: 'fields',
      transform: {
        toValue: (v) => Array.isArray(v) ? v.join(', ') : '',
        fromEvent: (val) => val.split(',').map((s) => s.trim())
      }
    },
    { key: 'experience', type: 'textarea' },
    { key: 'linkedin' },
    { key: 'notes', type: 'textarea' }
  ];

  const renderMentorDetails = () => {
    // const mentorId = (formData.mentorId || '').trim();
    const mentorId = typeof formData.mentorId === 'string'
      ? formData.mentorId.trim() : '';

    if (mentorId === 'notInterested') {
      return <p className="text-sm text-red-600">{t('notInterestedInMentor', language)}</p>;
    }

    if (!mentorId) {
      return <p className="text-sm text-gray-600">{t('noMentorAssigned', language)}</p>;
    }

    if (!mentorDetails) {
      return <p className="text-sm text-yellow-600">{t('mentorDataUnavailable', language)}</p>;
    }

    return (
      <p className="text-sm text-green-700">
        {t('assignedMentor', language)}: {mentorDetails.fullName} ({mentorDetails.phone})
      </p>
    );
  };

  const handleDeleteClick = () => {
    if (confirm(t('confirmDeleteUser', language))) {
      onDelete(user);
    }
  };

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <GenericForm
          titleKey="editUserDetails"
          fields={fields}
          data={formData}
          onChange={handleChange}
          onPrimary={() => onSave(formData)}
          onSecondary={onClose}
          onDelete={handleDeleteClick}
          primaryLabel="saveChanges"
          secondaryLabel="cancel"
          deleteLabel="deleteUser"
        >
          <div className="mt-4">
            <span className="font-medium block">{t('mentor', language)}:</span>
            {renderMentorDetails()}
          </div>
        </GenericForm>

      </div>
    </div>
  );
}
