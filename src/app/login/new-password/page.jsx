'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function NewPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [session, setSession] = useState('');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/completeNewPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, session })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password changed successfully');
        localStorage.setItem('idToken', data.tokens.IdToken);
        router.push('/'); // Redirect to homepage
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
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Set a New Password</h2>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}
