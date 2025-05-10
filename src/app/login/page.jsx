'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

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
        // If login requires new password
        if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
          router.push(`/login/new-password?email=${email}&session=${data.session}`);
          return;
        }

        console.log('Login successful:', data);

        // Decode role from idToken
        const decoded = jwtDecode(data.idToken);
        const role = decoded['custom:role'];

        // Save token for use in app
        localStorage.setItem('userId', decoded.sub);
        localStorage.setItem('userType', role);
        localStorage.setItem('idToken', data.idToken);

        // Navigate based on role
        if (role === 'mentor') router.push('/pages/mentor/MentorHomePage');
        else if (role === 'reservist') router.push('/reservist/home');
        else if (role === 'ambassador') router.push('/ambassador/home');
        else router.push('/');

        setMessage('התחברת בהצלחה!');
      } else {
        setMessage('שגיאה: ' + (data.message || 'Login failed'));
      }
    } catch (err) {
      console.error(err);
      setMessage('שגיאה כללית. בדוק את הקונסול.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">התחברות</h1>
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <input
            type="email"
            value={email}
            placeholder="אימייל"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            placeholder="סיסמה"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            התחבר
          </button>
        </form>
        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}