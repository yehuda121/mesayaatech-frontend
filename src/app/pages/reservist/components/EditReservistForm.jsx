'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import AlertMessage from '@/app/components/notifications/AlertMessage'; // For validation and success messages

export default function EditReservistForm({ userData, onSave, onBack }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // Message box
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

  // Handle form field changes
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  // Validation logic for key fields
  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName?.trim();
    const email = formData.email?.trim();
    const phone = formData.phone?.trim();
    const armyRole = formData.armyRole?.trim();
    const location = formData.location?.trim();
    const experience = formData.experience?.trim();
    const linkedin = formData.linkedin?.trim();

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (email && !emailPattern.test(email)) errors.push(t('emailInvalid', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!armyRole) errors.push(t('armyRoleRequired', language));
    else if (/[^\w\sא-ת]/.test(armyRole)) errors.push(t('armyRoleInvalid', language));

    if (!location) errors.push(t('locationRequired', language));

    if (!experience) errors.push(t('experienceRequired', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

    return errors;
  };

  // Submit updated user form
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlertMessage({ message: validationErrors[0], type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (res.ok) {
        setAlertMessage({ message: t('saveSuccess', language), type: 'success' });
        setInitialData(formData);
        onSave(result);
      } else {
        setAlertMessage({ message: result.error || t('saveError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error saving user form:', err);
      setAlertMessage({ message: t('saveError', language), type: 'error' });
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

      {alertMessage && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
        />
      )}

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

      <div className="flex mt-6">
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
