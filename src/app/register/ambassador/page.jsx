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
  const [language, setLanguage] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (formData) => {
    try {
      const existingUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/imports-user-registration-form/all`;
      const existingRes = await fetch(existingUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` }
      });

      const existingUsers = await existingRes.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) return showAlert(t('emailAlreadyExists', language), 'error');
      if (idExists) return showAlert(t('idNumberAlreadyExists', language), 'error');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/upload-registration-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
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

  if (!language) return null;

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
