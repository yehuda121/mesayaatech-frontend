'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';

export default function reseveRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
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

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const t = {
    title: { he: "הרשמה למילואימניק", en: "Reservist Registration" },
    fullName: { he: "שם מלא", en: "Full Name" },
    idNumber: { he: "תעודת זהות", en: "ID Number" },
    email: { he: "אימייל", en: "Email" },
    phone: { he: "מספר טלפון", en: "Phone" },
    armyRole: { he: "תפקיד עיקרי במילואים", en: "Army Role" },
    location: { he: "מיקום גאוגרפי", en: "Location" },
    fieldsTitle: {
      he: "אילו תחומי עיסוק רלוונטיים לך? (בחר כמה שרוצים)",
      en: "Which professional fields are relevant to you? (Select all that apply)"
    },
    experience: { he: "ניסיון מקצועי", en: "Professional Experience" },
    linkedin: { he: "קישור ללינקדאין (לא חובה)", en: "LinkedIn link (optional)" },
    notes: { he: "הערות נוספות (לא חובה)", en: "Additional Notes (optional)" },
    submit: { he: "שלח בקשה", en: "Submit" },
    success: { he: "הבקשה נשלחה ונשמרה בהצלחה!", en: "Form submitted successfully!" },
    error: { he: "אירעה שגיאה בשליחה", en: "An error occurred during submission" },
    login: { he: "יש לי חשבון קיים", en: "I already have an account" },
    switchLang: { he: "English", en: "עברית" }
  };
  const translatedFields = {
    "הייטק": { he: "הייטק", en: "Hi-Tech" },
    "ניהול": { he: "ניהול", en: "Management" },
    "לוגיסטיקה": { he: "לוגיסטיקה", en: "Logistics" },
    "חינוך": { he: "חינוך", en: "Education" },
    "שיווק": { he: "שיווק", en: "Marketing" },
    "אחר": { he: "אחר", en: "Other" }
  };
  

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
            {language === 'he' ? 'English' : 'עברית'}
          </button>

        </div>

        <h1 className="text-3xl font-bold text-center">{t.title[language]}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <label>{t.armyRole[language]}*:
            <input name="armyRole" required value={formData.armyRole} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.location[language]}*:
            <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <fieldset>
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

          <label>{t.experience[language]}*:
            <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

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
