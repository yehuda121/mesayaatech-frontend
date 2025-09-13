'use client';

import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '@/app/utils/language/language';
import { useRouter } from 'next/navigation';
import '@/app/components/GenericForm/GenericForm.css';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import '../registrationPage.css';
import PageIntro from '@/app/components/PageIntro';
import MultiStepForm from '@/app/components/MultiStepForm/MultiStepForm';

export default function MentorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-registration-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
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

  if (!language) return null;

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
