'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';

export default function mentorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    userType: 'mentor',
    status: 'pending',
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    specialties: [],
    experience: '',
    pastMentoring: '',
    availability: '',
    linkedin: '',
    notes: '',
  });

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const t = {
    title: { he: "הרשמה למנטור", en: "Mentor Registration" },
    fullName: { he: "שם מלא", en: "Full Name" },
    idNumber: { he: "תעודת זהות", en: "ID Number" },
    email: { he: "אימייל", en: "Email" },
    phone: { he: "מספר טלפון", en: "Phone" },
    profession: { he: "תחום עיסוק עיקרי", en: "Primary Profession" },
    location: { he: "מיקום גאוגרפי", en: "Location" },
    specialtiesTitle: {
      he: "תחומי מומחיות (אפשר לבחור כמה):",
      en: "Areas of expertise (select all that apply):"
    },
    experience: { he: "רקע מקצועי (ציין ניסיון רלוונטי)", en: "Professional Background" },
    pastMentoring: { he: "ניסיון קודם בהדרכה/מנטורינג", en: "Previous mentoring experience" },
    availability: { he: "זמינות (שעות/ימים מועדפים)", en: "Availability (preferred times/days)" },
    linkedin: { he: "לינקדאין (לא חובה)", en: "LinkedIn (optional)" },
    notes: { he: "הערות נוספות", en: "Additional Notes" },
    submit: { he: "שלח בקשה", en: "Submit" },
    success: { he: "הרישום נשלח בהצלחה!", en: "Registration sent successfully!" },
    error: { he: "אירעה שגיאה בשליחה", en: "An error occurred during submission" },
    login: { he: "יש לי חשבון קיים", en: "I already have an account" },
    switchLang: { he: "English", en: "עברית" }
  };

  const translatedSpecialties = {
    "חיפוש עבודה": { he: " חיפוש עבודה", en: "Job Search" },
    "כתיבת קורות חיים": { he: " כתיבת קורות חיים", en: "Resume Writing" },
    "הכנה לראיונות": { he: " הכנה לראיונות", en: "Interview Prep" },
    "בניית מסלול קריירה": { he: " בניית מסלול קריירה", en: "Career Path Planning" },
    "שיפור מיומנויות רכות": { he: " שיפור מיומנויות רכות", en: "Soft Skills Improvement" },
    "אחר": { he: " אחר", en: "Other" }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        specialties: checked
          ? [...prev.specialties, value]
          : prev.specialties.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ['fullName', 'idNumber', 'email', 'phone', 'profession', 'location', 'experience'];
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
          userType: 'mentor',
          status: 'pending',
          fullName: '',
          idNumber: '',
          email: '',
          phone: '',
          profession: '',
          location: '',
          specialties: [],
          experience: '',
          pastMentoring: '',
          availability: '',
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

          <label>{t.profession[language]}*:
            <input name="profession" required value={formData.profession} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t.location[language]}*:
            <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <fieldset>
            <legend className="font-semibold">{t.specialtiesTitle[language]}</legend>
            {Object.keys(translatedSpecialties).map((field) => (
              <label key={field} className="block">
                <input
                  type="checkbox"
                  name="specialties"
                  value={field}
                  checked={formData.specialties.includes(field)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {translatedSpecialties[field][language]}
              </label>
            ))}
          </fieldset>

          <label>{t.experience[language]}*:
            <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <label>{t.pastMentoring[language]}:
            <textarea name="pastMentoring" value={formData.pastMentoring} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <label>{t.availability[language]}:
            <input name="availability" value={formData.availability} onChange={handleChange} className="border p-2 w-full rounded" />
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
