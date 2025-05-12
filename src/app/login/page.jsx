'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getLanguage, toggleLanguage } from '../language';
import { t } from '@/app/utils/loadTranslations';

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

        if (role === 'mentor') router.push('/pages/mentor/MentorHomePage');
        else if (role === 'reservist') router.push('/reservist/home');
        else if (role === 'ambassador') router.push('/ambassador/home');
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
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('login', language)}</h1>
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
            className="w-full p-2 border rounded"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            placeholder={t('password', language)}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {t('loginButton', language)}
          </button>
        </form>
        {message && <p className="text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
