'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import '../login.css';
import { getLanguage, toggleLanguage } from "@/app/utils/language/language";
import sanitizeText from '@/app/utils/sanitizeText';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const sanitizedEmail = sanitizeText(email, 100, 'email');
    if (sanitizedEmail.wasModified) {
      setEmail(sanitizedEmail.text);
      setMessage(t('fieldsSanitizedWarning', language));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t('verificationCodeSent', language));
        setTimeout(() => {
          router.push(`/login/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setMessage(t('forgotPasswordError', language) + ': ' + (data.message || t('generalError', language)));
      }
    } catch (err) {
      console.error(err);
      setMessage(t('generalError', language));
    } finally {
      setLoading(false);
    }
  };

  if (!language) return null;

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="login-page">
      <div className="login-overlay">
        <div className="login-title">
          <span>{t('forgotPasswordTitle', language)}</span>
          <button onClick={() => setLanguage(toggleLanguage())} className="text-sm underline">
            {t('switchLang', language)}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <input
            type="email"
            value={email}
            placeholder={t('email', language)}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
            autoComplete="email"
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('sending', language) : t('sendVerificationCode', language)}
          </button>
        </form>

        {message && <p className="text-center text-red-500 mt-3">{message}</p>}
      </div>
    </div>
  );
}
