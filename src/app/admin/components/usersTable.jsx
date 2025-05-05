'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../language';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [language, setLanguage] = useState(getLanguage());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/imports-user-registration-form`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('שגיאה בשליפת משתמשים:', err);
    }
  };

  const handleStatusChange = async (user, status) => {
    try {
      await fetch(`http://localhost:5000/api/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user.fullName,
          idNumber: user.idNumber,
          userType: user.userType,
          status,
        }),
      });
      fetchUsers();
    } catch (err) {
      console.error('שגיאה בעדכון סטטוס:', err);
    }
  };

  const t = {
    name: { he: "שם", en: "Name" },
    id: { he: "תעודת זהות", en: "ID" },
    type: { he: "סוג משתמש", en: "User Type" },
    status: { he: "סטטוס", en: "Status" },
    actions: { he: "אשר/דחה", en: "Actions" },
    approve: { he: "אשר", en: "Approve" },
    deny: { he: "דחה", en: "Deny" },
    formTitle: { he: "טופס הרשמה", en: "Registration Form" },
    searchPlaceholder: {
      he: "חפש לפי שם, אימייל או טלפון...",
      en: "Search by name, email or phone..."
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = searchTerm.toLowerCase();
  
    return (
      user.fullName?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.phone?.toLowerCase().includes(text)
    );
  });
  

  return (
    <div dir="rtl">
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder[language]}
          className="border rounded p-2 w-full"
        />
      </div>

      <table className="w-full border text-right">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">{t.name[language]}</th>
            <th className="p-2">{t.id[language]}</th>
            <th className="p-2">{t.type[language]}</th>
            <th className="p-2">{t.status[language]}</th>
            <th className="p-2">{t.actions[language]}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={`${user.userType}-${user.idNumber}`} className="border-t cursor-pointer" onClick={() => setSelectedForm(user)}>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.idNumber}</td>
              <td className="p-2">{user.userType}</td>
              <td className="p-2">{user.status}</td>
              <td className="p-2">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(user, 'approved'); }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    {t.approve[language]}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(user, 'denied'); }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    {t.deny[language]}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedForm && (
        <div className="mt-6 p-4 bg-white border rounded">
          <h3 className="text-lg font-bold mb-2">{t.formTitle[language]}</h3>
          <pre className="text-sm overflow-auto whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {Object.entries(selectedForm).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}
