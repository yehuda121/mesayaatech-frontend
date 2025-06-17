'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../language';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage'; 
import '../registrationForm.css';
import { locations } from '@/app/components/Locations';

export default function MentorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [alert, setAlert] = useState(null); 

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

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName.trim();
    const idNumber = formData.idNumber.replace(/\s/g, '');
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const profession = formData.profession.trim();
    const location = formData.location.trim();
    const experience = formData.experience.trim();
    const linkedin = formData.linkedin.trim();

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!profession) errors.push(t('mainProfessionRequired', language));
    else if (/[^\w\sא-ת]/.test(profession)) errors.push(t('mainProfessionInvalid', language));

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
      const resUsers = await fetch(`http://localhost:5000/api/imports-user-registration-form?userType=mentor`);
      const existingUsers = await resUsers.json();

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
          aboutMe: '',
        });
      } else {
        const errorText = await res.text();
        setAlert({ message: `${t('mentorError', language)}: ${errorText}`, type: 'error' });
      }
    } catch {
      setAlert({ message: t('mentorError', language), type: 'error' });
    }
  };

  if (!language) return null;

  const translatedSpecialties = {
    "חיפוש עבודה": { he: " חיפוש עבודה", en: " Job Search" },
    "כתיבת קורות חיים": { he: " כתיבת קורות חיים", en: " Resume Writing" },
    "הכנה לראיונות": { he: " הכנה לראיונות", en: " Interview Prep" },
    "בניית מסלול קריירה": { he: " בניית מסלול קריירה", en: " Career Path Planning" },
    "שיפור מיומנויות רכות": { he: " שיפור מיומנויות רכות", en: " Soft Skills Improvement" },
    "אחר": { he: " אחר", en: " Other" }
  };

  return (
    <div className="register-page">
    <div className={`register-form-container ${language === 'he' ? 'register-form-direction-rtl' : 'register-form-direction-ltr'}`}>
      <div className="register-form-top-buttons">
        <button
          onClick={() => router.push('/login')}
          className="text-blue-700 font-medium hover:underline"
        >
          {t('mentorLogin', language)}
        </button>

        <button
          onClick={() => setLanguage(toggleLanguage())}
          className="text-sm underline hover:text-blue-600"
        >
          {t('switchLang', language)}
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center">{t('mentorRegisterTitle', language)}</h1>

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

        <label>{t('mainProfession', language)}*:
          <input name="profession" value={formData.profession} onChange={handleChange} />
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

        <fieldset>
          <legend>{t('mentorSpecialtiesTitle', language)}</legend>
          {Object.keys(translatedSpecialties).map((field) => (
            <label
              key={field}
              className="register-checkbox-label"
              style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}
            >
              <input
                type="checkbox"
                name="specialties"
                value={field}
                checked={formData.specialties.includes(field)}
                onChange={handleChange}
              />
              {translatedSpecialties[field][language]}
            </label>
          ))}
        </fieldset>

        <label>{t('mentorExperience', language)}*:
          <textarea name="experience" value={formData.experience} onChange={handleChange} className="h-24" />
        </label>

        <label>{t('mentorPastMentoring', language)}:
          <textarea name="pastMentoring" value={formData.pastMentoring} onChange={handleChange} className="h-24" />
        </label>

        <label>{t('mentorAvailability', language)}:
          <input name="availability" value={formData.availability} onChange={handleChange} />
        </label>

        <label>{t('mentorLinkedin', language)}:
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
        </label>

        <label>{t('notes', language)}:
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="h-24" />
        </label>

        <label>
          {t('aboutMeIntroMentor', language)}:
          <textarea
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            placeholder={t('aboutMePlaceholderMentor', language)}
            className="h-24"
          />
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
  </div>
  );
}
