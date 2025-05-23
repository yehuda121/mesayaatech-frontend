'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../language';
import { t } from '@/app/utils/loadTranslations';
import Button from '../../components/Button';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl overflow-y-auto max-h-[90vh]" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {t('editUserDetails', language)}
        </h2>

        <form className="space-y-4">
          {fieldsToRender.map(renderField)}
        </form>

        <div className="flex justify-between gap-3 mt-6 flex-wrap">
          <Button
            text={t('deleteUser', language)}
            color="red"
            onClick={() => {
              if (confirm(t('confirmDeleteUser', language))) {
                onDelete(user);
              }
            }}
          />

          <div className="flex gap-2 ml-auto">
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
    </div>
  );
}
