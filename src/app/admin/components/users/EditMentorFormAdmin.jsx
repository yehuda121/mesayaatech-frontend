'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditMentorFormAdmin({ user, onClose, onSave, onDelete, reservists = [] }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(user);
  const [myReservists, setMyReservists] = useState([]);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const fetchReservists = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/filter-users?userType=reservist');
        const data = await res.json();
        if (Array.isArray(data)) {
          const mine = data.filter(r => r.mentorId === `mentor#${formData.idNumber}`);
          setMyReservists(mine);
        }
      } catch (err) {
        console.error('Error loading reservists:', err);
      }
    };

    fetchReservists();
  }, [formData.idNumber]);

  const handleChange = (newData) => {
    setFormData(newData);
  };

  const fields = [
    { key: 'fullName' },
    { key: 'idNumber' , readonly: true },
    { key: 'email' },
    { key: 'phone' },
    { key: 'profession' },
    { key: 'location' },
    {
      key: 'specialties',
      transform: {
        toValue: (v) => Array.isArray(v) ? v.join(', ') : '',
        fromEvent: (val) => val.split(',').map((s) => s.trim())
      }
    },
    { key: 'experience', type: 'textarea' },
    { key: 'pastMentoring', type: 'textarea' },
    { key: 'availability' },
    { key: 'linkedin' },
    { key: 'notes', type: 'textarea' }
  ];

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <GenericForm
          titleKey="editUserDetails"
          fields={fields}
          data={formData}
          onChange={handleChange}
          onPrimary={() => onSave(formData)}
          onSecondary={onClose}
          onCloseIcon={onClose}
          onDelete={() => {
            if (confirm(t('confirmDeleteUser', language))) onDelete(user);
          }}
          primaryLabel="saveChanges"
          secondaryLabel="cancel"
          deleteLabel="deleteUser"
        >
          <div className="mt-6">
            <h3 className="font-semibold text-base mb-2">{t('assignedReservists', language)}</h3>
            {myReservists.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {myReservists.map((r) => (
                  <li key={r.idNumber}>
                    {r.fullName} ({r.phone})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">{t('noReservistsAssigned', language)}</p>
            )}
          </div>
        </GenericForm>
    </div>
  );
}
