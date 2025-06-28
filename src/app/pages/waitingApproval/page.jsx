'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import './approval.css';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function WaitingApprovalPage() {
  const router = useRouter();
  const language = useLanguage();

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
