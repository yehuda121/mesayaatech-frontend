'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditAmbassadorFormAdmin({ user, onClose, onSave, onDelete }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleChange = (newData) => {
    setFormData(newData);
  };

  const fields = [
    { key: 'fullName' },
    { key: 'idNumber', readonly: true },
    { key: 'email' },
    { key: 'phone' },
    { key: 'currentCompany' },
    { key: 'position' },
    { key: 'location' },
    { key: 'canShareJobs' },
    {
      key: 'jobFields',
      transform: {
        toValue: (v) => Array.isArray(v) ? v.join(', ') : '',
        fromEvent: (val) => val.split(',').map((s) => s.trim())
      }
    },
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
            if (confirm(t('confirmDeleteUser', language))) {
              onDelete(user);
            }
          }}
          primaryLabel="saveChanges"
          secondaryLabel="cancel"
          deleteLabel="deleteUser"
        />
    </div>
  );
}
