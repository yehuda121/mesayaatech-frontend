'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import './approval.css';

export default function WaitingApprovalPage() {
  const [language, setLanguage] = useState(getLanguage());
  const router = useRouter();

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  return (
    <div className="approval-container">
      <div className="approval-box">
        <h1>{t("approvalTitle", language)}</h1>
        <p>{t("approvalText", language)}</p>
        <button onClick={() => router.push("/")} className="back-home">
          {t("goToHome", language)}
        </button>
      </div>
    </div>
  );
}
