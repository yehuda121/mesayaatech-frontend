'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';

export default function EditAmbassadorFormAdmin({ user, onClose, onSave, onDelete }) {
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

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <h2 className="form-title">{t('editUserDetails', language)}</h2>

        <form className="form-wrapper">
          <label className="block mb-2">
            <span className="font-medium">{t('fullName', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('idNumber', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.idNumber || ''}
              disabled
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('email', language)}</span>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('phone', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('currentCompany', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.currentCompany || ''}
              onChange={(e) => handleChange('currentCompany', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('position', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.position || ''}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('location', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('canShareJobs', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.canShareJobs || ''}
              onChange={(e) => handleChange('canShareJobs', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('jobFields', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={Array.isArray(formData.jobFields) ? formData.jobFields.join(', ') : ''}
              onChange={(e) =>
                handleChange(
                  'jobFields',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('linkedin', language)}</span>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
            />
          </label>
          <label className="block mb-2">
            <span className="font-medium">{t('notes', language)}</span>
            <textarea
              className="w-full border p-2 rounded h-20"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </label>
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
          <Button text={t('cancel', language)} onClick={onClose} />
          <Button text={t('saveChanges', language)} onClick={() => onSave(formData)} />
        </div>
      </div>
    </div>
  );
}
