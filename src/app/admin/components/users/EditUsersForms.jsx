'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../../language';
import { t } from '@/app/utils/loadTranslations';
import Button from '../../../components/Button';

export default function EditUsersForms({ user, onClose, onSave, onDelete }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderField = (key) => {
    const isArray = Array.isArray(formData[key]);
    return (
      <label key={key} className="block mb-2">
        <span className="font-medium">{t(key, language)}</span>
        {isArray ? (
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData[key].join(', ')}
            onChange={(e) => handleChange(key, e.target.value.split(',').map(s => s.trim()))}
          />
        ) : key === 'notes' || key === 'experience' || key === 'pastMentoring' ? (
          <textarea
            className="w-full border p-2 rounded h-20"
            value={formData[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ) : (
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        )}
      </label>
    );
  };

  const keysByType = {
    reservist: [
      'fullName', 'idNumber', 'email', 'phone', 'armyRole', 'location',
      'fields', 'experience', 'linkedin', 'notes', 'status'
    ],
    mentor: [
      'fullName', 'idNumber', 'email', 'phone', 'profession', 'location',
      'specialties', 'experience', 'pastMentoring', 'availability', 'linkedin', 'notes', 'status'
    ],
    ambassador: [
      'fullName', 'idNumber', 'email', 'phone', 'currentCompany', 'position',
      'location', 'canShareJobs', 'jobFields', 'linkedin', 'notes', 'status'
    ]
  };

  const fieldsToRender = keysByType[formData.userType] || [];

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <h2 className="form-title">{t('editUserDetails', language)}</h2>

        <form className="form-wrapper">
          {fieldsToRender.map(renderField)}
        </form>

        <div className="form-actions">
          <Button
            text={t('deleteUser', language)}
            color="red"
            onClick={() => {
              if (confirm(t('confirmDeleteUser', language))) {
                onDelete(user);
              }
            }}
          />
          <Button
            text={t('cancel', language)}
            onClick={onClose}
          />
          <Button
            text={t('saveChanges', language)}
            onClick={() => onSave(formData)}
          />
        </div>
      </div>
    </div>
  );

}
