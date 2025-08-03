'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getLanguage, toggleLanguage } from "@/app/utils/language/language";
import { t } from '@/app/utils/loadTranslations';
import './login.css';
import { Eye, EyeOff } from 'lucide-react';
import sanitizeText from '@/app/utils/sanitizeText';
import AlertMessage from '@/app/components/Notifications/AlertMessage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeText(email, 100, 'email');
    const sanitizedPassword = sanitizeText(password, 100);

    if (sanitizedEmail.wasModified || sanitizedPassword.wasModified) {
      setAlert({
        type: 'warning',
        message: t('fieldsSanitizedWarning', language) 
      });

      setEmail(sanitizedEmail.text);
      setPassword(sanitizedPassword.text);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
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

        // Store tokens and user info in sessionStorage
        sessionStorage.setItem('userId', decoded.sub);
        sessionStorage.setItem('userType', role);
        sessionStorage.setItem('idToken', data.idToken);
        sessionStorage.setItem('accessToken', data.accessToken); // Required for change password
        sessionStorage.setItem('refreshToken', data.refreshToken); // Optional
        sessionStorage.setItem('fullName', decoded.name);
        sessionStorage.setItem('idNumber', decoded['custom:idNumber'] || decoded.sub);
        sessionStorage.setItem('email', decoded.email);
        localStorage.setItem('idNumber', decoded['custom:idNumber'] || decoded.sub);
        localStorage.setItem('userType', role);
        localStorage.setItem('fullName', decoded.name);
        localStorage.setItem('email', decoded.email);

        setTimeout(() => {
          if (role === 'admin') router.replace('./admin');
          else if (role === 'mentor') router.replace('/pages/mentor');
          else if (role === 'reservist') router.replace('/pages/reservist');
          else if (role === 'ambassador') router.replace('/pages/ambassador');
          else router.push('/');
        }, 100);

        setMessage(t('loginSuccess', language));
      } else {
        let userMessage;
        if (data?.message?.toLowerCase().includes('email')) {
          userMessage = t('invalidEmail', language);
        } else if (data?.message?.toLowerCase().includes('password')) {
          userMessage = t('invalidPassword', language);
        } else {
          userMessage = t('loginFailed', language);
        }
        console.error('Login error:', data?.message);
        setMessage(`${t('loginError', language)}: ${userMessage}`);
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
          <button 
           className="text-sm underline"
            onClick={() => {
              const newLang = toggleLanguage();
              setLanguage(newLang);
            }}>
            {t('switchLang', language)}
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <input
            type="email"
            id="email"
            name="email"
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
              id="password"
              name="password"
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

          <button type="submit" className="login-button">
            {t('loginButton', language)}
          </button>

          <div className="text-center mt-3">
            <button 
              type="button" 
              className="text-sm underline text-blue-600 hover:text-blue-800"
              onClick={() => router.push('/login/forgot-password')}
            >
              {t('forgotPassword', language)}
            </button>
          </div>
        </form>

        {message && <p className="text-center text-red-500">{message}</p>}
        {alert && (
          <AlertMessage
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

      </div>
    </div>
  );
}
