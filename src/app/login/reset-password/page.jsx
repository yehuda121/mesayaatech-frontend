'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { t } from '@/app/utils/loadTranslations';
import '../login.css';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const language = useLanguage();

  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 8; i++) { 
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    password += 'Aa!1';
    setNewPassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/confirm-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t('passwordResetSuccess', language));
        setTimeout(() => router.push('/'), 2000);
      } else {
        setMessage(t('resetPasswordError', language) + ': ' + (data.message || t('generalError', language)));
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
          <span>{t('resetPasswordTitle', language)}</span>
          <button onClick={() => setLanguage(toggleLanguage())} className="text-sm underline">
            {t('switchLang', language)}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={verificationCode}
            placeholder={t('verificationCode', language)}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="login-input"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              placeholder={t('newPassword', language)}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="login-input pr-20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 ${
                language === 'he' ? 'left-12' : 'right-12'
              }`}
              title={showPassword ? t('hidePassword', language) : t('showPassword', language)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <button
              type="button"
              onClick={generateRandomPassword}
              className={`absolute top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 ${
                language === 'he' ? 'left-3' : 'right-3'
              }`}
              title={t('generatePassword', language)}
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('loading', language) : t('resetPasswordButton', language)}
          </button>
        </form>

        {message && <p className="text-center text-red-500 mt-3">{message}</p>}
      </div>
    </div>
  );
}
