'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import Button from '@/app/components/Button';
import '../../../register/registrationForm.css';

export default function EditMentorForm({ userData, onSave, onClose }) {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const idPattern = /^\d{9}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    const fullName = formData.fullName?.trim() || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const idNumber = formData.idNumber?.trim() || '';
    const profession = formData.profession?.trim() || '';
    const location = formData.location?.trim() || '';
    const experience = formData.experience?.trim() || '';
    const linkedin = formData.linkedin?.trim() || '';

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));
    else if (fullName.length > 50) errors.push(t('fullNameTooLong', language));

    if (!idPattern.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));
    else if (email.length > 100) errors.push(t('emailTooLong', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!profession) errors.push(t('mainProfessionRequired', language));
    else if (profession.length > 60) errors.push(t('professionTooLong', language));

    if (!location) errors.push(t('locationRequired', language));
    else if (location.length > 60) errors.push(t('locationTooLong', language));

    if (!experience) errors.push(t('experienceRequired', language));
    else if (experience.length > 1000) errors.push(t('experienceTooLong', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));
    else if (linkedin.length > 200) errors.push(t('linkedinTooLong', language));

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlert({ message: validationErrors[0], type: 'error' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setAlert({ message: t('saveSuccess', language), type: 'success' });
        setInitialData(formData);
        localStorage.setItem('mentorFullName', formData.fullName);
        onSave(result);
      } else {
        setAlert({ message: result.error || t('saveError', language), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: t('saveError', language), type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setAlert(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onClose) onClose();
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="register-page">
      <div className={`register-form-container ${language === 'he' ? 'register-form-direction-rtl' : 'register-form-direction-ltr'}`}>
        <div className="register-form-top-buttons">
          <button
            onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            className="text-sm underline hover:text-blue-600"
          >
            {t('switchLang', language)}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">{t('editUserDetails', language)}</h1>

        <form onSubmit={handleSubmit}>
          <label>{t('fullName', language)}*:
            <input name="fullName" value={formData.fullName || ''} onChange={handleChange} />
          </label>

          <label>{t('idNumber', language)}*:
            <input name="idNumber" value={formData.idNumber || ''} readOnly />
          </label>

          <label>{t('email', language)}*:
            <input name="email" value={formData.email || ''} readOnly />
          </label>

          <label>{t('phone', language)}:
            <input name="phone" value={formData.phone || ''} onChange={handleChange} />
          </label>

          <label>{t('armyRole', language)}:
            <input name="armyRole" value={formData.armyRole || ''} onChange={handleChange} />
          </label>

          <label>{t('profession', language)}:
            <input name="profession" value={formData.profession || ''} onChange={handleChange} />
          </label>

          <label>{t('location', language)}*:
            <input name="location" value={formData.location || ''} onChange={handleChange} />
          </label>

          <label>{t('specialties', language)}:
            <input name="specialties" value={formData.specialties || ''} onChange={handleChange} />
          </label>

          <label>{t('experience', language)}:
            <textarea name="experience" value={formData.experience || ''} onChange={handleChange} />
          </label>

          <label>{t('pastMentoring', language)}:
            <textarea name="pastMentoring" value={formData.pastMentoring || ''} onChange={handleChange} />
          </label>

          <label>{t('linkedin', language)}:
            <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} />
          </label>

          <label>{t('aboutMeIntroMentor', language)}:
            <textarea name="aboutMeIntroMentor" value={formData.aboutMeIntroMentor || ''} onChange={handleChange} />
          </label>

          <label>{t('notes', language)}:
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} />
          </label>

          <div className="register-buttons-group">
            <Button text={t('saveChanges', language)} type="submit" disabled={!isModified || saving} />
            <Button text={t('cancel', language)} type="button" onClick={handleCancel} />
          </div>
        </form>

        {alert && (
          <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
        )}
      </div>
    </div>
  );
}
