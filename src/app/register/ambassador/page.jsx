'use client';

import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../../utils/language/language';
import { useRouter } from 'next/navigation';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import MultiStepForm from '@/app/components/MultiStepForm/MultiStepForm';
import PageIntro from '@/app/components/PageIntro';
import { t } from '@/app/utils/loadTranslations';
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

  const handleSubmit = async (formData) => {
    try {
      const existingRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/imports-user-registration-form/all`);
      const existingUsers = await existingRes.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) return showAlert(t('emailAlreadyExists', language), 'error');
      if (idExists) return showAlert(t('idNumberAlreadyExists', language), 'error');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-registration-form`, {
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
