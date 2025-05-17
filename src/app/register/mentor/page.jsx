'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import { t } from '@/app/utils/loadTranslations';

export default function MentorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
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
    setLanguage(getLanguage());
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  if (!language) return null; // או Spinner

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
        router.push("/pages/waitingApproval");
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
      setSuccess(t('error', language));
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
            {t('mentorLogin', language)}
          </button>

          <button onClick={() => setLanguage(toggleLanguage())}
            className="text-sm underline hover:text-blue-600"
          >
            {t('switchLang', language)}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">{t('mentorRegisterTitle', language)}</h1>

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

          <label>{t('mainProfetion', language)}*:
            <input name="profession" required value={formData.profession} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('location', language)}*:
            <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <fieldset>
            <legend className="font-semibold">{t('mentorSpecialtiesTitle', language)}</legend>
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

          <label>{t('mentorExperience', language)}*:
            <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <label>{t('mentorPastMentoring', language)}:
            <textarea name="pastMentoring" value={formData.pastMentoring} onChange={handleChange} className="border p-2 w-full rounded h-24" />
          </label>

          <label>{t('mentorAvailability', language)}:
            <input name="availability" value={formData.availability} onChange={handleChange} className="border p-2 w-full rounded" />
          </label>

          <label>{t('mentorLinkedin', language)}:
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
