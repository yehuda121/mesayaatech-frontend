'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import Button from '@/app/components/Button';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import '../../register/registrationForm.css';
import { locations } from '@/app/components/Locations';

export default function EditAmbassadorForm({ userData, onSave , onClose, onDelete, role }) {
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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        jobFields: checked
          ? [...(prev.jobFields || []), value]
          : prev.jobFields.filter(f => f !== value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const idPattern = /^\d{9}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    const fullName = formData.fullName?.trim() || '';
    const idNumber = formData.idNumber?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const location = formData.location?.trim() || '';
    const canShareJobs = formData.canShareJobs?.trim() || '';
    const linkedin = formData.linkedin?.trim() || '';

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));
    else if (fullName.length > 50) errors.push(t('fullNameTooLong', language));

    if (!idPattern.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (phone && (phone.length !== 11  || phone.length !== 10) && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!location) errors.push(t('locationRequired', language));
    else if (location.length > 60) errors.push(t('locationTooLong', language));

    if (!canShareJobs) errors.push(t('canShareRequired', language));

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
        localStorage.setItem('ambassadorFullName', formData.fullName);
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

  const handleDeleteClick = () => {
    if (confirm(t('confirmDeleteUser', language))) {
      onDelete(userData);
    }
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

          <label>{t('email', language)}*:
            <input name="idNumber" value={formData.email || ''} readOnly />
          </label>

          <label>{t('idNumber', language)}*:
            <input name="email" value={formData.idNumber || ''} readOnly />
          </label>

          <label>{t('phone', language)}:
            <input name="phone" value={formData.phone || ''} onChange={handleChange} />
          </label>

          <label>{t('currentCompany', language)}:
            <input name="currentCompany" value={formData.currentCompany || ''} onChange={handleChange} />
          </label>

          <label>{t('position', language)}:
            <input name="position" value={formData.position || ''} onChange={handleChange} />
          </label>

          <label>{t('location', language)}*:
            <select name="location" value={formData.location} onChange={handleChange}>
              <option value="">{t('selectLocation', language)}</option>
              {locations.map((region, regionIndex) => (
                <optgroup 
                  key={regionIndex} 
                  className='font-bold'
                  label={language === 'he' ? region.region.he : region.region.en}
                >
                  {region.locations.map((loc, locIndex) => (
                    <option key={locIndex} value={language === 'he' ? loc.he : loc.en}>
                      {language === 'he' ? loc.he : loc.en}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label>{t('canShareJobs', language)}*:
            <select name="canShareJobs" value={formData.canShareJobs || ''} onChange={handleChange}>
              <option value="">{language === 'he' ? 'בחר' : 'Select'}</option>
              <option value="כן">{language === 'he' ? 'כן' : 'Yes'}</option>
              <option value="אולי">{language === 'he' ? 'אולי' : 'Maybe'}</option>
              <option value="לא">{language === 'he' ? 'לא' : 'No'}</option>
            </select>
          </label>

          <fieldset>
            <legend>{t('ambassadorJobFieldsTitle', language)}</legend>
            {Object.keys(translatedJobFields).map((field) => (
              <label key={field} className="register-checkbox-label" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
                <input
                  type="checkbox"
                  name="jobFields"
                  value={field}
                  checked={(formData.jobFields || []).includes(field)}
                  onChange={handleChange}
                />
                {translatedJobFields[field][language]}
              </label>
            ))}
          </fieldset>

          <label>{t('linkedin', language)}:
            <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} />
          </label>

          <div className="register-buttons-group">
            <Button text={t('saveChanges', language)} type="submit" disabled={!isModified || saving} />
            <Button text={t('cancel', language)} type="button" onClick={handleCancel} />
            {role === 'admin' && (
              <Button color='red' text={t('deleteUser', language)} type="button" onClick={handleDeleteClick} />
            )}
          </div>
        </form>

        {alert && (
          <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
        )}
      </div>
    </div>
  );
}
