'use client';

import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../utils/language/language';
import { useRouter } from 'next/navigation';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import PageIntro from '@/app/components/PageIntro';
import MultiStepForm from '@/app/components/MultiStepForm/MultiStepForm';
import { t } from '@/app/utils/loadTranslations';
import sanitizeText from '@/app/utils/sanitizeText';
import '../registrationForm.css';

export default function ReserveRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = (formData) => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName?.trim() || '';
    const idNumber = formData.idNumber?.replace(/\s/g, '') || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const armyRole = formData.armyRole?.trim() || '';
    const location = formData.location?.trim() || '';
    const experience = sanitizeText(formData.experience, 1000);
    const linkedin = formData.linkedin?.trim() || '';
    const notes = sanitizeText(formData.notes, 500);
    const aboutMe = sanitizeText(formData.aboutMe, 1000);

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
    else if (experience === 'tooLong') errors.push(t('experienceIsTooLong', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

    if (notes === 'tooLong') errors.push(t('notesIsTooLong', language));
    if (aboutMe === 'tooLong') errors.push(t('aboutMeIsTooLong', language));

    return errors;
  };

  const handleSubmit = async (formData) => {
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      showAlert(validationErrors[0], 'error');
      return;
    }

    try {
      const existingRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/imports-user-registration-form?userType=reservist`);
      const existingUsers = await existingRes.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) {
        showAlert(t('emailAlreadyExists', language), 'error');
        return;
      }
      if (idExists) {
        showAlert(t('idNumberAlreadyExists', language), 'error');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-registration-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType: 'reservist', status: 'pending' }),
      });

      if (res.ok) {
        router.push("/pages/waitingApproval");
      } else {
        const errorText = await res.text();
        showAlert(`${t('reservistError', language)}: ${errorText}`, 'error');
      }
    } catch (err) {
      showAlert(t('reservistError', language), 'error');
    }
  };

  return (
    <div className="register-page">
      <PageIntro 
        titleKey="reservistWelcome" 
        subtitleKey="reservistWelcomeSubtitle"
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
        userType="reservist"
      />

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
