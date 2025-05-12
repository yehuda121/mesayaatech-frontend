'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import { t } from '@/app/utils/loadTranslations';

export default function ReserveRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [success, setSuccess] = useState('');

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
    "הייטק": { he: " הייטק", en: "Hi-Tech" },
    "ניהול": { he: " ניהול", en: "Management" },
    "לוגיסטיקה": { he: " לוגיסטיקה", en: "Logistics" },
    "חינוך": { he: " חינוך", en: "Education" },
    "שיווק": { he: " שיווק", en: "Marketing" },
    "אחר": { he: " אחר", en: "Other" }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ['fullName', 'idNumber', 'email', 'phone', 'armyRole', 'location', 'experience'];
    for (let key of required) {
      if (!formData[key]) {
        setSuccess(`${t('pleaseFill', language)} ${t(key, language)}`);
        return;
      }
    }

    try {
      const res = await fetch('http://localhost:5000/api/upload-registration-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(t('reservistSuccess', language));
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
        console.error('שגיאה מהשרת:', errorText);
        setSuccess(`${t('reservistError', language)}: ${errorText}`);
      }
    } catch {
      setSuccess(t('reservistError', language));
    }
  };

  if (!language) return null;

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
        <div dir="ltr" className="flex justify-end gap-4 items-center w-full">
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

        <form onSubmit={handleSubmit} className="space-y-4" >
          <label>{t('fullName', language)}*:
            <input name="fullName" required value={formData.fullName} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('idNumber', language)}*:
            <input name="idNumber" required value={formData.idNumber} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('email', language)}*:
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('phone', language)}*:
            <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('armyRole', language)}*:
            <input name="armyRole" required value={formData.armyRole} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('location', language)}*:
            <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <fieldset>
            <legend className="font-semibold">{t('professionalFieldsSelect', language)}</legend>
            {Object.keys(translatedFields).map((field) => (
              <label key={field} className="block">
                <input
                  type="checkbox"
                  name="fields"
                  value={field}
                  checked={formData.fields.includes(field)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {translatedFields[field][language]}
              </label>
            ))}
          </fieldset>

          <label>{t('professionalExperience', language)}*:
            <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <label>{t('linkedinLink', language)}:
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('reservistNotes', language)}:
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <Button text={t('submit', language)} type="submit" />
        </form>

        {success && <p className="text-green-600 text-center font-bold">{success}</p>}
      </div>
    </div>
  );
}
