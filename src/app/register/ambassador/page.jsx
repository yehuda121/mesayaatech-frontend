'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import { t } from '@/app/utils/loadTranslations';

export default function AmbassadorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    userType: 'ambassador',
    status: 'pending',
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    currentCompany: '',
    position: '',
    location: '',
    canShareJobs: '',
    jobFields: [],
    linkedin: '',
    notes: '',
  });

  const translatedJobFields = {
    "הייטק": { he: "הייטק", en: "Hi-Tech" },
    "פיננסים": { he: "פיננסים", en: "Finance" },
    "לוגיסטיקה": { he: "לוגיסטיקה", en: "Logistics" },
    "שיווק": { he: "שיווק", en: "Marketing" },
    "חינוך": { he: "חינוך", en: "Education" },
    "אחר": { he: "אחר", en: "Other" }
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
        jobFields: checked
          ? [...prev.jobFields, value]
          : prev.jobFields.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['fullName', 'idNumber', 'email', 'phone', 'location', 'canShareJobs'];
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
        setSuccess(t('ambassadorSuccess', language));
        setFormData({
          userType: 'ambassador',
          status: 'pending',
          fullName: '',
          idNumber: '',
          email: '',
          phone: '',
          currentCompany: '',
          position: '',
          location: '',
          canShareJobs: '',
          jobFields: [],
          linkedin: '',
          notes: '',
        });
      } else {
        const errorText = await res.text();
        console.error('שגיאה מהשרת:', errorText);
        setSuccess(`${t('ambassadorError', language)}: ${errorText}`);
      }
    } catch {
      setSuccess(t('ambassadorError', language));
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

          <button onClick={() => setLanguage(toggleLanguage())}
            className="text-sm underline hover:text-blue-600"
          >
            {t('switchLang', language)}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">{t('ambassadorRegisterTitle', language)}</h1>

        <form onSubmit={handleSubmit} className={`space-y-4 ${language === 'he' ? 'text-right' : 'text-left'}`}>
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

          <label>{t('currentCompany', language)}:
            <input name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('position', language)}:
            <input name="position" value={formData.position} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('location', language)}*:
            <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('canShareJobs', language)}*:
            <select name="canShareJobs" required value={formData.canShareJobs} onChange={handleChange} className="border p-2 w-full rounded">
              <option value="">{language === 'he' ? 'בחר' : 'Select'}</option>
              <option value="כן">{language === 'he' ? 'כן' : 'Yes'}</option>
              <option value="אולי">{language === 'he' ? 'אולי' : 'Maybe'}</option>
              <option value="לא">{language === 'he' ? 'לא' : 'No'}</option>
            </select>
          </label>

          <fieldset>
            <legend className="font-semibold">{t('ambassadorJobFieldsTitle', language)}</legend>
            {Object.keys(translatedJobFields).map((field) => (
              <label key={field} className="block">
                <input
                  type="checkbox"
                  name="jobFields"
                  value={field}
                  checked={formData.jobFields.includes(field)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {translatedJobFields[field][language]}
              </label>
            ))}
          </fieldset>

          <label>{t('linkedin', language)}:
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('notes', language)}:
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <Button text={t('submit', language)} type="submit" />
        </form>

        {success && <p className="text-green-600 text-center font-bold">{success}</p>}
      </div>
    </div>
  );
}
