'use client';

import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '@/app/utils/language/language';
import { useRouter } from 'next/navigation';
import '@/app/components/GenericForm/GenericForm.css';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import sanitizeText from '@/app/utils/sanitizeText';
import '../registrationForm.css';
import PageIntro from '@/app/components/PageIntro';
import MultiStepForm from '@/app/components/MultiStepForm/MultiStepForm';

export default function MentorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSubmit = async (formData) => {
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      showAlert(validationErrors[0], 'error');
      return false;
    }

    try {
      const resUsers = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/imports-user-registration-form?userType=mentor`);
      const existingUsers = await resUsers.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) {
        showAlert(t('emailAlreadyExists', language), 'error');
        return false;
      }
      if (idExists) {
        showAlert(t('idNumberAlreadyExists', language), 'error');
        return false;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-registration-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType: 'mentor', status: 'pending' }),
      });

      if (res.ok) {
        router.push('/pages/waitingApproval');
        return true;
      } else {
        const errorText = await res.text();
        showAlert(`${t('mentorError', language)}: ${errorText}`, 'error');
        return false;
      }
    } catch (error) {
      showAlert(`${t('mentorError', language)}: ${error.message}`, 'error');
      return false;
    }
  };

  const validateForm = (formData) => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = sanitizeText(formData.fullName.trim(), 70);
    const idNumber = formData.idNumber.replace(/\s/g, '');
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const specialties = (formData.specialties || []).map(v =>
      v.normalize("NFKC").replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim()
    ).filter(v => v !== '');

    const location = formData.location.trim();
    const experience = sanitizeText(formData.experience, 1000);
    const pastMentoring = sanitizeText(formData.pastMentoring, 1000);
    const availability = sanitizeText(formData.availability, 200);
    const linkedin = formData.linkedin.trim();
    const notes = sanitizeText(formData.notes, 500);
    const aboutMe = sanitizeText(formData.aboutMe, 1000);

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (fullName === 'tooLong') errors.push(t('fullNameIsTooLong', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));
    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));
    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));
    if (specialties.length === 0) errors.push(t('mainProfessionRequired', language));
    if (!location) errors.push(t('locationRequired', language));
    if (!experience) errors.push(t('experienceRequired', language));
    else if (experience === 'tooLong') errors.push(t('experienceIsTooLong', language));
    if (pastMentoring === 'tooLong') errors.push(t('pastMentoringIsTooLong', language));
    if (availability === 'tooLong') errors.push(t('availabilityIsTooLong', language));
    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));
    if (notes === 'tooLong') errors.push(t('notesIsTooLong', language));
    if (aboutMe === 'tooLong') errors.push(t('aboutMeIsTooLong', language));

    return errors;
  };

  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="register-page">
      <PageIntro 
        titleKey="mentorWelcome" 
        subtitleKey="mentorWelcomeSubtitle"
        onClick={() => {
          const newLang = toggleLanguage();
          setLanguage(newLang);
        }}
        language={language}
      />

      <MultiStepForm
        key={language}
        onSubmit={handleSubmit}
        language={language}
        userType="mentor"
      />

      {alert && (
        <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}
    </div>
  );
}
