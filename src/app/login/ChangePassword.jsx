// 'use client';

// import { useState, useEffect } from 'react';
// import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
// import { getLanguage, toggleLanguage } from '../language';
// import { t } from '@/app/utils/loadTranslations';
// import './login.css';

// export default function ChangePassword() {
//   const [language, setLanguage] = useState(null);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLanguage(getLanguage());
//     const handleLanguageChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLanguageChange);
//     return () => window.removeEventListener('languageChanged', handleLanguageChange);
//   }, []);

//   const generateRandomPassword = () => {
//     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
//     let password = '';
//     for (let i = 0; i < 8; i++) {
//       password += charset[Math.floor(Math.random() * charset.length)];
//     }
//     password += 'Aa!1';
//     setNewPassword(password);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     // const idToken = localStorage.getItem('idToken');
//     const accessToken = localStorage.getItem('accessToken');

//     try {
//       const res = await fetch('http://localhost:5000/api/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         //   Authorization: idToken
//         Authorization: accessToken
//         },
//         body: JSON.stringify({ currentPassword, newPassword })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(t('passwordChangeSuccess', language));
//         setCurrentPassword('');
//         setNewPassword('');
//       } else {
//         setMessage(t('passwordChangeError', language) + ': ' + (data.message || t('generalError', language)));
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage(t('generalError', language));
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!language) return null;

//   return (
//     <div dir={language === 'he' ? 'rtl' : 'ltr'} className="login-page">
//       <div className="login-overlay">
//         <div className="login-title">
//           <span>{t('changePasswordTitle', language)}</span>
//           <button onClick={() => setLanguage(toggleLanguage())} className="text-sm underline">
//             {t('switchLang', language)}
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="password"
//             value={currentPassword}
//             placeholder={t('currentPassword', language)}
//             onChange={(e) => setCurrentPassword(e.target.value)}
//             required
//             className="login-input"
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={newPassword}
//               placeholder={t('newPassword', language)}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               className="login-input pr-20"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className={`absolute top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 ${
//                 language === 'he' ? 'left-12' : 'right-12'
//               }`}
//               title={showPassword ? t('hidePassword', language) : t('showPassword', language)}
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>

//             <button
//               type="button"
//               onClick={generateRandomPassword}
//               className={`absolute top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 ${
//                 language === 'he' ? 'left-3' : 'right-3'
//               }`}
//               title={t('generatePassword', language)}
//             >
//               <RefreshCcw size={18} />
//             </button>
//           </div>

//           <button type="submit" className="login-button" disabled={loading}>
//             {loading ? t('loading', language) : t('changePassword', language)}
//           </button>
//         </form>

//         {message && <p className="text-center text-red-500 mt-3">{message}</p>}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { getLanguage, toggleLanguage } from '../language';
import { t } from '@/app/utils/loadTranslations';
import './login.css';

export default function ChangePassword() {
  const [language, setLanguage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLanguageChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

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

    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token retrieved from localStorage:', accessToken ? '[REDACTED]' : 'null');

    console.log('Sending change password request to backend...');
    console.log('Current password:', currentPassword ? '[REDACTED]' : 'empty');
    console.log('New password:', newPassword ? '[REDACTED]' : 'empty');

    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        console.log('Password changed successfully.');
        setMessage(t('passwordChangeSuccess', language));
        setCurrentPassword('');
        setNewPassword('');
      } else {
        console.warn('Password change failed:', data.message || 'Unknown error');
        setMessage(t('passwordChangeError', language) + ': ' + (data.message || t('generalError', language)));
      }
    } catch (err) {
      console.error('Network or server error during password change:', err);
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
          <span>{t('changePasswordTitle', language)}</span>
          <button onClick={() => setLanguage(toggleLanguage())} className="text-sm underline">
            {t('switchLang', language)}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            placeholder={t('currentPassword', language)}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
            {loading ? t('loading', language) : t('changePassword', language)}
          </button>
        </form>

        {message && <p className="text-center text-red-500 mt-3">{message}</p>}
      </div>
    </div>
  );
}
