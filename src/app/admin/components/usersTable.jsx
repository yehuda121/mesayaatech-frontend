'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../language';
import { t } from '@/app/utils/loadTranslations';
import EditUsersForms from './EditUsersForms';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [language, setLanguage] = useState(getLanguage());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/imports-user-registration-form/all`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('שגיאה: השרת לא החזיר מערך:', data);
        setUsers([]);
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error('שגיאה בשליפת משתמשים:', err);
    }
  };

  const handleStatusChange = async (user, status) => {
    try {
      if (status === 'approved') {
        const createRes = await fetch('http://localhost:5000/api/approve-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.fullName,
            role: user.userType,
            idNumber: user.idNumber
          }),
        });

        if (!createRes.ok) {
          const errorText = await createRes.text();
          console.error('Error creating Cognito user:', errorText);
          alert('Failed to send email – please verify the email address is valid');
          return;
        }
      }

      const res = await fetch('http://localhost:5000/api/update-user-status/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user.fullName,
          idNumber: user.idNumber,
          userType: user.userType,
          status,
        }),
      });

      if (!res.ok) {
        console.error('Error updating status in DynamoDB:', await res.text());
        return;
      }

      setUsers(prev =>
        prev.map(u =>
          u.idNumber === user.idNumber && u.userType === user.userType
            ? { ...u, status }
            : u
        )
      );
    } catch (err) {
      console.error('General error during status change:', err);
      alert('A general error occurred. Check the console for details.');
    }
  };

  // const handleDeleteUser = async (user) => {
  //   try {
  //     // Attempt to delete from Cognito if approved
  //     if (user.status === 'approved' && user.email) {
  //       await fetch('http://localhost:5000/api/delete-cognito-user', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ email: user.email })
  //       });
  //     }

  //     const res = await fetch('http://localhost:5000/api/delete-user-form', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         userType: user.userType,
  //         idNumber: user.idNumber,
  //       }),
  //     });

  //     if (!res.ok) {
  //       console.error('שגיאה במחיקת משתמש:', await res.text());
  //       return;
  //     }

  //     setUsers(prev => prev.filter(u =>
  //       !(u.idNumber === user.idNumber && u.userType === user.userType)
  //     ));
  //     setSelectedForm(null);
  //   } catch (err) {
  //     console.error('שגיאה במחיקת משתמש:', err);
  //   }
  // };
  const handleDeleteUser = async (user) => {
    try {
      // Attempt to delete from Cognito if approved
      if (user.status === 'approved' && user.email) {
        const cognitoRes = await fetch('http://localhost:5000/api/delete-cognito-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });

        if (!cognitoRes.ok) {
          const text = await cognitoRes.text();
          console.error('error deleteing the user from cognito: ', text);
          alert(t('cognitoDeleteError', language));
        }
      }

      // Delete from DynamoDB
      const res = await fetch('http://localhost:5000/api/delete-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: user.userType,
          idNumber: user.idNumber,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('error deleteing user registration form: ', text);
        alert(t('dynamoDeleteError', language));
        return;
      }

      setUsers(prev =>
        prev.filter(u =>
          !(u.idNumber === user.idNumber && u.userType === user.userType)
        )
      );
      setSelectedForm(null);
      alert(t('userDeletedSuccessfully', language));

    } catch (err) {
      console.error('error deleting user: ', err);
      alert(t('generalDeleteError', language));
    }
  };


  const statusMap = {
    pending: t('pending', language),
    approved: t('approved', language),
    denied: t('denied', language)
  };

  const userTypeMap = {
    reservist: t('reservist', language),
    mentor: t('mentor', language),
    ambassador: t('ambassador', language)
  };

  const filteredUsers = users.filter((user) => {
    const text = searchTerm.toLowerCase();
    const matchText =
      user.fullName?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.phone?.toLowerCase().includes(text);

    const matchType = filterType === 'all' || user.userType === filterType;
    const matchStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchText && matchType && matchStatus;
  });

  const handleSaveUser = async (updatedUser) => {
    try {
      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        console.error('שגיאה בעדכון משתמש:', await res.text());
        return;
      }

      setUsers(prev =>
        prev.map(u =>
          u.idNumber === updatedUser.idNumber && u.userType === updatedUser.userType
            ? updatedUser
            : u
        )
      );
      setSelectedForm(null);
    } catch (err) {
      console.error('שגיאה בעדכון משתמש:', err);
    }
  };

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchPlaceholder', language)}
          className="border rounded p-2 flex-1"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="type">{t('userType', language)}</option>
          <option value="reservist">{t('reservist', language)}</option>
          <option value="mentor">{t('mentor', language)}</option>
          <option value="ambassador">{t('ambassador', language)}</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="status">{t('status', language)}</option>
          <option value="pending">{t('pending', language)}</option>
          <option value="approved">{t('approved', language)}</option>
          <option value="denied">{t('denied', language)}</option>
        </select>
      </div>

      <table className="w-full border text-right">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">{t('name', language)}</th>
            <th className="p-2">{t('id', language)}</th>
            <th className="p-2">{t('status', language)}</th>
            <th className="p-2">{t('userType', language)}</th>
            <th className="p-2">{t('actions', language)}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={`${user.userType}-${user.idNumber}`} className="border-t cursor-pointer" onClick={() => setSelectedForm(user)}>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.idNumber}</td>
              <td className="p-2">{statusMap[user.status] || user.status}</td>
              <td className="p-2">{userTypeMap[user.userType] || user.userType}</td>
              <td className="p-2">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user.status !== 'approved') handleStatusChange(user, 'approved');
                    }}
                    disabled={user.status === 'approved'}
                    className={`px-3 py-1 rounded text-white ${user.status === 'approved' ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {t('approve', language)}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user.status !== 'denied') handleStatusChange(user, 'denied');
                    }}
                    disabled={user.status === 'denied'}
                    className={`px-3 py-1 rounded text-white ${user.status === 'denied' ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {t('deny', language)}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedForm && (
        <EditUsersForms
          user={selectedForm}
          onClose={() => setSelectedForm(null)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}
