'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';

export default function EditMentorForm({ userData, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
      setInitialData(userData);
    }
  }, [userData]);

  const labels = {
    fullName: 'fullName',
    email: 'email',
    phone: 'phone',
    armyRole: 'armyRole',
    profession: 'profession',
    fields: 'fields',
    specialties: 'specialties',
    experience: 'experience',
    linkedin: 'linkedin',
    notes: 'notes'
  };

  const keys = Object.keys(labels);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (res.ok) {
        alert(t('saveSuccess', language));
        setInitialData(formData);
        onSave(result);
      } else {
        alert(result.error || t('saveError', language));
      }
    } catch (err) {
      console.error('Error saving user form:', err);
      alert(t('saveError', language));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  return (
  <div
    dir={language === 'he' ? 'rtl' : 'ltr'}
    className="edit-mentor-container"
  >
    <h2 className="edit-mentor-title">
      {t('editUserDetails', language)}
    </h2>

    <form className="edit-mentor-form">
      {keys.map((key) => (
        <label key={key} className="edit-mentor-label">
          <span className="edit-mentor-label-text">
            {t(key, language)}
          </span>
          {(key === 'experience' || key === 'notes') ? (
            <textarea
              className="edit-mentor-textarea"
              value={formData[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="edit-mentor-input"
              value={formData[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          )}
        </label>
      ))}
    </form>

    <div className="edit-mentor-footer">
      <div className="edit-mentor-buttons">
        <Button
          text={t('cancel', language)}
          onClick={handleCancel}
          disabled={!isModified}
        />
        <Button
          text={saving ? '...' : t('saveChanges', language)}
          onClick={handleSubmit}
          disabled={!isModified}
        />
      </div>
    </div>
  </div>
);

}
