// admin/page.jsx
'use client';
import { useState } from 'react';
import AdminTable from "./table";
import "./admin.css";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/import-users');
    const data = await res.json();
    setUsers(data);
  };

  const handleSelect = async (type) => {
    setView(type);
    const res = await fetch('http://localhost:5000/api/import-users');
    const data = await res.json();
    setUsers(data);
    console.log("Data from server:", data);
  };  

  const filterUsers = () => {
    if (view === 'pending') return users.filter(u => u.status === 'pending');
    if (view === 'approved-all') return users.filter(u => u.status === 'approved');
    if (view.startsWith('approved-')) {
      const role = view.split('-')[1];
      return users.filter(u => u.status === 'approved' && u.userType === role);
    }
    return [];
  };

  const renderTable = () => {
    if (!view || view.startsWith('menu')) return null;
    return <AdminTable users={filterUsers()} onStatusChange={() => fetchUsers()} />;
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>ניהול</h2>
        <div>
          <button onClick={() => setView(view === 'menu-users' ? '' : 'menu-users')}>ניהול משתמשים</button>
          {view === 'menu-users' && (
            <div>
              <button onClick={() => handleSelect('pending')}>משתמשים הממתינים לאישור</button>
              <button onClick={() => setView(view === 'menu-approved' ? '' : 'menu-approved')}>משתמשים שאושרו</button>
              {view === 'menu-approved' && (
                <div>
                  <button onClick={() => handleSelect('approved-reservist')}>מילואימניקים</button>
                  <button onClick={() => handleSelect('approved-mentor')}>מנטורים</button>
                  <button onClick={() => handleSelect('approved-ambassador')}>שגרירים</button>
                  <button onClick={() => handleSelect('approved-all')}>כולם</button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      <main className="admin-main">
        {renderTable()}
      </main>
    </div>
  );
}