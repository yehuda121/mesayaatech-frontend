'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getLanguage, toggleLanguage } from '../language';
import { t } from '@/app/utils/loadTranslations';
import './login.css';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
        localStorage.setItem('fullName', decoded.name);

        if (role === 'admin') router.push('./admin');
        else if (role === 'mentor') router.push('/pages/mentor');
        else if (role === 'reservist') router.push('/pages/reservist');
        else if (role === 'ambassador') router.push('/pages/ambassador');
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
        
        <div className="relative" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder={t('password', language)}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input pr-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 ${
              language === 'he' ? 'left-3' : 'right-3'
            }`}
            title={showPassword ? t('hidePassword', language) : t('showPassword', language)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>


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
