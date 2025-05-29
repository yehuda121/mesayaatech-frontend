'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getLanguage, toggleLanguage } from '../language';
import { t } from '@/app/utils/loadTranslations';
import './login.css';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
          router.push(`/login/new-password?email=${email}&session=${data.session}`);
          return;
        }

        const decoded = jwtDecode(data.idToken);
        const role = decoded['custom:role'];

        localStorage.setItem('userId', decoded.sub);
        localStorage.setItem('userType', role);
        localStorage.setItem('idToken', data.idToken);

        if (role === 'admin') router.push('./admin');
        else if (role === 'mentor') router.push('/pages/mentor/MentorHomePage');
        else if (role === 'reservist') router.push('/pages/reservist/home');
        else if (role === 'ambassador') router.push('/pages/ambassador/home');
        else router.push('/');


        setMessage(t('loginSuccess', language));
      } else {
        setMessage(t('loginError', language) + ': ' + (data.message || t('loginFailed', language)));
      }
    } catch (err) {
      console.error(err);
      setMessage(t('generalError', language));
    }
  };

  if (!language) return null;

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="login-page">
      <div className="login-overlay">
        <div className="login-title">
          <span>{t('login', language)}</span>
          <button onClick={() => setLanguage(toggleLanguage())} className="text-sm underline">
            {t('switchLang', language)}
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
        <input
          type="email"
          value={email}
          placeholder={t('email', language)}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
          autoComplete="email"
        />

        <input
          type="password"
          value={password}
          placeholder={t('password', language)}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="login-button"
        >
          {t('loginButton', language)}
        </button>

        </form>
        {message && <p className="text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
