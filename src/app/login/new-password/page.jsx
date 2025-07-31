
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import sanitizeText from '@/app/utils/sanitizeText';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function NewPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [session, setSession] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [alert, setAlert] = useState(null);
  const language = useLanguage();

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const sessionFromUrl = searchParams.get('session');
    if (emailFromUrl && sessionFromUrl) {
      setEmail(emailFromUrl);
      setSession(sessionFromUrl);
    } else {
      setMessage('Missing information.');
    }
  }, [searchParams]);

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

    const cleanPassword = sanitizeText(newPassword, 100, 'default');
    if (cleanPassword.wasModified) {
      setNewPassword(cleanPassword.text);
      setAlert({
        type: 'warning',
        message: t('fieldsSanitizedWarning', language)
      });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/completeNewPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ email, newPassword: cleanPassword.text, session })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password changed successfully');
        sessionStorage.setItem('idToken', data.tokens.IdToken);
        router.push('/login');
      } else {
        setMessage(data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error updating password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-4 text-center">Set a New Password</h2>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-2 border rounded pr-20"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-12 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            title={showPassword ? 'Hide Password' : 'Show Password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <button
            type="button"
            onClick={generateRandomPassword}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            title="Generate strong password"
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        {alert && (
          <AlertMessage
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

      </form>
    </div>
  );
}
