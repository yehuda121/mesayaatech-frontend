'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage'; 
import '../registrationForm.css';

export default function ReserveRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [alert, setAlert] = useState(null); 

  const [formData, setFormData] = useState({
    userType: 'reservist',
    status: 'pending',
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    armyRole: '',
    location: '',
    fields: [],
    experience: '',
    linkedin: '',
    notes: '',
  });

  const translatedFields = {
    "הייטק": { he: " הייטק", en: " Hi-Tech" },
    "ניהול": { he: " ניהול", en: " Management" },
    "לוגיסטיקה": { he: " לוגיסטיקה", en: " Logistics" },
    "חינוך": { he: " חינוך", en: " Education" },
    "שיווק": { he: " שיווק", en: " Marketing" },
    "אחר": { he: " אחר", en: " Other" }
  };

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        fields: checked
          ? [...prev.fields, value]
          : prev.fields.filter((field) => field !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName.trim();
    const idNumber = formData.idNumber.replace(/\s/g, '');
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const armyRole = formData.armyRole.trim();
    const location = formData.location.trim();
    const experience = formData.experience.trim();
    const linkedin = formData.linkedin.trim();

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!armyRole) errors.push(t('armyRoleRequired', language));
    else if (/[^\w\sא-ת]/.test(armyRole)) errors.push(t('armyRoleInvalid', language));

    if (!location) errors.push(t('locationRequired', language));

    if (!experience) errors.push(t('experienceRequired', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlert({ message: validationErrors[0], type: 'error' });
      return;
    }

    try {
      const existingRes = await fetch(`http://localhost:5000/api/imports-user-registration-form?userType=reservist`);
      const existingUsers = await existingRes.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) {
        setAlert({ message: t('emailAlreadyExists', language), type: 'error' });
        return;
      }
      if (idExists) {
        setAlert({ message: t('idNumberAlreadyExists', language), type: 'error' });
        return;
      }

      const res = await fetch('http://localhost:5000/api/upload-registration-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/pages/waitingApproval");
        setFormData({
          userType: 'reservist',
          status: 'pending',
          fullName: '',
          idNumber: '',
          email: '',
          phone: '',
          armyRole: '',
          location: '',
          fields: [],
          experience: '',
          linkedin: '',
          notes: '',
        });
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        setAlert({ message: `${t('reservistError', language)}: ${errorText}`, type: 'error' });
      }
    } catch {
      setAlert({ message: t('reservistError', language), type: 'error' });
    }
  };

  if (!language) return null;

  return (
    <div className={`register-form-container ${language === 'he' ? 'register-form-direction-rtl' : 'register-form-direction-ltr'}`}>
      <div className="register-form-top-buttons">
        <button
          onClick={() => router.push('/login')}
          className="text-blue-700 font-medium hover:underline"
        >
          {t('alreadyHaveAcconut', language)}
        </button>

        <button
          onClick={() => setLanguage(toggleLanguage())}
          className="text-sm underline hover:text-blue-600"
        >
          {t('switchLang', language)}
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center">{t('reservistRegisterTitle', language)}</h1>

      <form onSubmit={handleSubmit}>
        <label>{t('fullName', language)}*:
          <input name="fullName" value={formData.fullName} onChange={handleChange} />
        </label>

        <label>{t('idNumber', language)}*:
          <input name="idNumber" value={formData.idNumber} onChange={handleChange} />
        </label>

        <label>{t('email', language)}*:
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
        </label>

        <label>{t('phone', language)}:
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </label>

        <label>{t('armyRole', language)}*:
          <input name="armyRole" value={formData.armyRole} onChange={handleChange} />
        </label>

        <label>{t('location', language)}*:
          <input name="location" value={formData.location} onChange={handleChange} />
        </label>

        <fieldset>
          <legend>{t('professionalFieldsSelect', language)}</legend>
          {Object.keys(translatedFields).map((field) => (
            <label key={field}>
              <input
                type="checkbox"
                name="fields"
                value={field}
                checked={formData.fields.includes(field)}
                onChange={handleChange}
              />
              {translatedFields[field][language]}
            </label>
          ))}
        </fieldset>

        <label>{t('professionalExperience', language)}*:
          <textarea name="experience" value={formData.experience} onChange={handleChange} className="h-24" />
        </label>

        <label>{t('linkedinLink', language)}:
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
        </label>

        <label>{t('reservistNotes', language)}:
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="h-24" />
        </label>

        <Button text={t('submit', language)} type="submit" />
      </form>

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
