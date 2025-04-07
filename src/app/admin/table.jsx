// table.jsx (Component) 
import { useState } from 'react';

export default function AdminTable({ users, onStatusChange }) {
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForm = async (user) => {
    const folderName = `${user.fullName.trim().replace(/\s+/g, '-')}-${user.idNumber.trim()}`;
    const encodedFolder = encodeURIComponent(folderName);
  
    try {
      const res = await fetch(`http://localhost:5000/api/user-form?userType=${user.userType}&folder=${encodedFolder}`);
  
      if (!res.ok) {
        if (res.status === 404) {
          setSelectedForm({ error: 'הטופס לא נמצא ב־S3' });
        } else {
          setSelectedForm({ error: 'שגיאה בלתי צפויה בעת שליפת הטופס' });
        }
        return;
      }
  
      const data = await res.json();
      setSelectedForm(data);
    } catch (err) {
      console.error('שגיאה בשליפת טופס:', err);
      setSelectedForm({ error: 'שגיאה בחיבור לשרת' });
    }
  };
  

  return (
    <div>
      <table className="w-full border text-right">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">שם</th>
            <th className="p-2">תעודת זהות</th>
            <th className="p-2">סוג משתמש</th>
            <th className="p-2">סטטוס</th>
            <th className="p-2">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={`${user.userType}-${user.idNumber}`} className="border-t cursor-pointer" onClick={() => fetchForm(user)}>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.idNumber}</td>
              <td className="p-2">{user.userType}</td>
              <td className="p-2">{user.status}</td>
              <td className="p-2 flex gap-2 justify-end">
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusChange(user, 'approved'); }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  אשר
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusChange(user, 'denied'); }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  דחה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedForm && (
        <div className="mt-6 p-4 bg-white border rounded">
          <h3 className="text-lg font-bold mb-2">טופס הרשמה:</h3>
          {selectedForm.error ? (
            <p className="text-red-600">{selectedForm.error}</p>
          ) : (
            <pre className="text-sm overflow-auto whitespace-pre-wrap bg-gray-100 p-4 rounded">
              {JSON.stringify(selectedForm, null, 2)}
            </pre>
          )}
        </div>
      )}

    </div>
  );
}