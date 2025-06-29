'use client';

import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../utils/language/language';
import { useRouter } from 'next/navigation';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import MultiStepForm from '@/app/components/MultiStepForm/MultiStepForm';
import PageIntro from '@/app/components/PageIntro';
import { t } from '@/app/utils/loadTranslations';
import sanitizeText from '@/app/utils/sanitizeText';
import '../registrationForm.css';

export default function AmbassadorRegisterForm() {
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
    const currentCompany = sanitizeText(formData.currentCompany, 200);
    const position = sanitizeText(formData.position, 200);
    const location = formData.location?.trim() || '';
    const canShare = formData.canShareJobs?.trim() || '';
    const linkedin = formData.linkedin?.trim() || '';
    const notes = sanitizeText(formData.notes, 500);
    const aboutMe = sanitizeText(formData.aboutMe, 1000);

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!location) errors.push(t('locationRequired', language));

    if (!canShare) errors.push(t('canShareRequired', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

    if (currentCompany === 'tooLong') errors.push(t('currentCompanyIsTooLong', language));
    if (position === 'tooLong') errors.push(t('positionIsTooLong', language));
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
      const existingRes = await fetch(`http://localhost:5000/api/imports-user-registration-form?userType=ambassador`);
      const existingUsers = await existingRes.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) return showAlert(t('emailAlreadyExists', language), 'error');
      if (idExists) return showAlert(t('idNumberAlreadyExists', language), 'error');

      const res = await fetch('http://localhost:5000/api/upload-registration-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType: 'ambassador', status: 'pending' }),
      });

      if (res.ok) {
        router.push("/pages/waitingApproval");
      } else {
        const errorText = await res.text();
        showAlert(`${t('ambassadorError', language)}: ${errorText}`, 'error');
      }
    } catch {
      showAlert(t('ambassadorError', language), 'error');
    }
  };

  return (
    <div className="register-page">
      <PageIntro 
        titleKey="ambassadorRegisterTitle" 
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
        userType="ambassador"
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
