'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';

export default function EditReservistForm({ userData, onSave, onBack }) {
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

  const keys = [
    'fullName', 'email', 'phone', 'armyRole', 'location',
    'fields', 'experience', 'linkedin', 'notes'
  ];

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
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-center">{t('editUserDetails', language)}</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map((key) => (
          <label 
            key={key}
            className={`block ${language === 'he' ? 'text-right' : 'text-left'}`}
            dir={language === 'he' ? 'rtl' : 'ltr'}
          >
            <span className="font-medium">{t(key, language)}</span>
            {(key === 'experience' || key === 'notes') ? (
              <textarea
                className="w-full border p-2 rounded h-24"
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
        ))}
      </form>
      <div className="flex  mt-6">
        <div className="flex gap-2">
          <Button
            text={t('cancel', language)}
            onClick={() => {
              handleCancel();
              onBack();
            }}
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
