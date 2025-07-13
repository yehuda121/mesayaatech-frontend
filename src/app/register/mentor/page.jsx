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
