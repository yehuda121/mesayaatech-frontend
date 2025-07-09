'use client';

import { useState } from 'react';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { t } from '@/app/utils/loadTranslations';
import './ChangePassword.css';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const language = useLanguage();

  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    password += 'Aa!1';
    setNewPassword(password);
    console.log('Generated new random password:', password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const accessToken = sessionStorage.getItem('accessToken');

    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(t('passwordChangeSuccess', language));
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(t('passwordChangeError', language) + ': ' + (data.message || t('generalError', language)));
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
    <div className="CP-change-password-page" dir={language === 'he' ? 'rtl' : 'ltr'} >
      <div className="CP-change-password-overlay">
        <div className="CP-change-password-title">
          <span>{t('changePasswordTitle', language)}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            placeholder={t('currentPassword', language)}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="CP-change-password-input"
          />

          <div className="CP-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              placeholder={t('newPassword', language)}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="CP-change-password-input pr-20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`CP-change-password-icon toggle ${language === 'he' ? 'left-12' : 'right-12'}`}
              title={showPassword ? t('hidePassword', language) : t('showPassword', language)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <button
              type="button"
              onClick={generateRandomPassword}
              className={`CP-change-password-icon generate ${language === 'he' ? 'left-3' : 'right-3'}`}
              title={t('generatePassword', language)}
            >
              <RefreshCcw size={18} />
            </button>
          </div>
          <div className={loading ? "CP-change-password-button-loading" : "CP-change-password-button"}>
            <Button>
              {loading ? t('loading', language) : t('changePassword', language)}
            </Button>
          </div>
        </form>

        {message && <p className="CP-change-password-message">{message}</p>}
      </div>
    </div>
  );
}
