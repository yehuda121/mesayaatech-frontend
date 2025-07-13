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

  const handleSubmit = async (formData) => {
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
