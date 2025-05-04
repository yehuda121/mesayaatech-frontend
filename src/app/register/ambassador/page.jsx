'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';

export default function ambassadorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
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

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const t = {
    title: { he: "הרשמה לשגריר", en: "Ambassador Registration" },
    fullName: { he: "שם מלא", en: "Full Name" },
    idNumber: { he: "תעודת זהות", en: "ID Number" },
    email: { he: "אימייל", en: "Email" },
    phone: { he: "מספר טלפון", en: "Phone" },
    currentCompany: { he: "חברה נוכחית בה אתה עובד", en: "Current Company" },
    position: { he: "תפקיד נוכחי", en: "Current Position" },
    location: { he: "מיקום גאוגרפי", en: "Location" },
    canShareJobs: { he: "האם תוכל לשתף משרות מהארגון שלך?", en: "Can you share jobs from your organization?" },
    jobFieldsTitle: { he: "באילו תחומים יש לך גישה למשרות?", en: "Which fields do you have access to jobs in?" },
    linkedin: { he: "לינקדאין (לא חובה)", en: "LinkedIn (optional)" },
    notes: { he: "הערות נוספות", en: "Additional Notes" },
    submit: { he: "שלח בקשה", en: "Submit" },
    success: { he: "הרישום נשלח בהצלחה!", en: "Registration submitted successfully!" },
    error: { he: "אירעה שגיאה בשליחה", en: "An error occurred during submission" },
    login: { he: "יש לי חשבון קיים", en: "I already have an account" },
    switchLang: { he: "English", en: "עברית" }
  };

  const translatedJobFields = {
    "הייטק": { he: " הייטק", en: "Hi-Tech" },
    "פיננסים": { he: " פיננסים ", en: "Finance" },
    "לוגיסטיקה": { he: " לוגיסטיקה", en: "Logistics" },
    "שיווק": { he: " שיווק", en: "Marketing" },
    "חינוך": { he: " חינוך", en: "Education" },
    "אחר": { he: " אחר", en: "Other" }
  };

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
        setSuccess(language === 'he' ? `נא למלא את השדה: ${t[key].he}` : `Please fill out: ${t[key].en}`);
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
        setSuccess(t.success[language]);
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
        throw new Error();
      }
    } catch {
      setSuccess(t.error[language]);
    }
  };

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
        <div dir="ltr" className="flex justify-end gap-4 items-center w-full">
          <button
            onClick={() => router.push('/login')}
            className="text-blue-700 font-medium hover:underline"
          >
            {t.login[language]}
          </button>

          <button onClick={() => setLanguage(toggleLanguage())}
            className="text-sm underline hover:text-blue-600"
          >
            {t.switchLang[language]}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">{t.title[language]}</h1>

        <form onSubmit={handleSubmit} className={`space-y-4 ${language === 'he' ? 'text-right' : 'text-left'}`}>
        <label>{t.fullName[language]}*:
            <input name="fullName" required value={formData.fullName} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.idNumber[language]}*:
            <input name="idNumber" required value={formData.idNumber} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.email[language]}*:
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.phone[language]}*:
            <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.currentCompany[language]}:
            <input name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.position[language]}:
            <input name="position" value={formData.position} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.location[language]}*:
            <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.canShareJobs[language]}*:
            <select name="canShareJobs" required value={formData.canShareJobs} onChange={handleChange} className="border p-2 w-full rounded">
              <option value="">{language === 'he' ? 'בחר' : 'Select'}</option>
              <option value="כן">{language === 'he' ? 'כן' : 'Yes'}</option>
              <option value="אולי">{language === 'he' ? 'אולי' : 'Maybe'}</option>
              <option value="לא">{language === 'he' ? 'לא' : 'No'}</option>
            </select>
          </label>

          <fieldset>
            <legend className="font-semibold">{t.jobFieldsTitle[language]}</legend>
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

          <label>{t.linkedin[language]}:
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.notes[language]}:
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <Button text={t.submit[language]} type="submit" />
        </form>

        {success && <p className="text-green-600 text-center font-bold">{success}</p>}
      </div>
    </div>
  );
}
