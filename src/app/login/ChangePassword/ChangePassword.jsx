'use client';

import { useState } from 'react';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { t } from '@/app/utils/loadTranslations';
import './ChangePassword.css';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import AlertMessage from '@/app/components/Notifications/AlertMessage';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const language = useLanguage();
  const [alert, setAlert] = useState(null);

  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    password += 'Aa!1';
    setNewPassword(password);
    // console.log('Generated new random password:', password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const accessToken = sessionStorage.getItem('accessToken');

    const cleanCurrent = sanitizeText(currentPassword, 100);
    const cleanNew = sanitizeText(newPassword, 100);

    if (cleanCurrent.wasModified || cleanNew.wasModified) {
      setCurrentPassword(cleanCurrent.text);
      setNewPassword(cleanNew.text);
      setAlert({ type: 'warning', message: t('fieldsSanitizedWarning', language) });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ currentPassword: cleanCurrent.text, newPassword: cleanNew.text })
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: t('passwordChangeSuccess', language) });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        let ErrorMessage = t('passwordChangeError', language);
        if (data.message?.includes('Password not long enough')) {
          ErrorMessage = t('passwordTooShort', language);
        } else if (data.message?.includes('must include uppercase')) {
          ErrorMessage = t('passwordMissingUppercase', language);
        } else if (data.message?.includes('must include lowercase')) {
          ErrorMessage = t('passwordMissingLowercase', language);
        } else if (data.message?.includes('must include number')) {
          ErrorMessage = t('passwordMissingNumber', language);
        } else if (data.message) {
          ErrorMessage = t('InvalidPassword', language);
        }
        console.error(data.message);
        setAlert({ type: 'error', message: ErrorMessage });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: t('generalError', language) });
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
