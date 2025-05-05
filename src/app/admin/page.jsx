// "use client";
// import { useState, useEffect } from 'react';
// import UsersTable from "./components/usersTable";
// import EventUploadForm from './components/CreateEvent';
// import EventUpdateDelete from './components/EventUpdateDelete';
// import "./admin.css";

// export default function AdminPage() {
//   const [users, setUsers] = useState([]);
//   const [view, setView] = useState('');
//   const [openSection, setOpenSection] = useState('');
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleSection = (section) => {
//     setOpenSection(prev => prev === section ? '' : section);
//   };

//   const fetchUsers = async () => {
//     const res = await fetch('http://localhost:5000/api/import-users');
//     const data = await res.json();
//     setUsers(data);
//   };

//   const handleStatusChange = async (user, status) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/update-status`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           fullName: user.fullName,
//           idNumber: user.idNumber,
//           userType: user.userType,
//           status: status,
//         }),
//       });
//       if (!res.ok) {
//         console.error('שגיאה בעת עדכון סטטוס:', await res.text());
//         return;
//       }
//       await fetchUsers();
//     } catch (error) {
//       console.error('שגיאה בחיבור לשרת בעת שינוי סטטוס:', error);
//     }
//   };

//   const handleSelect = async (viewType) => {
//     setView(viewType);
//     const [status, userType] = viewType.split('-');
  
//     const query = new URLSearchParams();
//     if (userType !== 'all') query.append('userType', userType);
//     query.append('status', status);
  
//     const res = await fetch(`http://localhost:5000/api/import-users?${query.toString()}`);
//     const data = await res.json();
//     setUsers(data);
//     setMenuOpen(false);
//   };
  

//   const filterUsers = () => {
//     if (!view) return [];
//     const [status, role] = view.split('-');
//     if (role === 'all') return users.filter(u => u.status === status);
//     return users.filter(u => u.status === status && u.userType === role);
//   };

//   const renderContent = () => {
//     if (!view) return null;
//     if (view === 'create-event') return <EventUploadForm />;
//     if (view === 'update-event') return <EventUpdateDelete />;
//     return (
//       <UsersTable
//         users={filterUsers()}
//         onStatusChange={handleStatusChange}
//       />
//     );
//   };
//   return (
//     <>
//       <header className="admin-header">
//         <nav className="admin-navbar">
//           <div className="logo">
//             <img src="/logo.png" alt="Logo" className="logo-image" />
//           </div>
  
//           <div className="menu-icons">
//             {!menuOpen && (
//               <div className="admin-menu-icon" onClick={() => setMenuOpen(true)}>
//                 ☰
//               </div>
//             )}
//             {menuOpen && (
//               <div className="admin-menu-icon" onClick={() => setMenuOpen(false)}>
//                 ✖
//               </div>
//             )}
//           </div>
  
//           <div className={`admin-sidebar ${menuOpen ? 'open' : 'closed'}`}>
//             <h2>ניהול</h2>
//             <div>
//               <button onClick={() => toggleSection('pending')}>
//                 <span style={{ marginLeft: '6px' }}>
//                   {openSection === 'pending' ? '🔽' : '▶️'}
//                 </span>
//                 משתמשים ממתינים לאישור
//               </button>
//               {openSection === 'pending' && (
//                 <div>
//                   <button className="sub-button" onClick={() => handleSelect('pending-all')}>כולם</button>
//                   <button className="sub-button" onClick={() => handleSelect('pending-reservist')}>מילואים</button>
//                   <button className="sub-button" onClick={() => handleSelect('pending-mentor')}>מנטורים</button>
//                   <button className="sub-button" onClick={() => handleSelect('pending-ambassador')}>שגרירים</button>
//                 </div>
//               )}
  
//               <button onClick={() => toggleSection('denied')}>
//                 <span style={{ marginLeft: '6px' }}>
//                   {openSection === 'denied' ? '🔽' : '▶️'}
//                 </span>
//                 משתמשים שנדחו
//               </button>
//               {openSection === 'denied' && (
//                 <div>
//                   <button className="sub-button" onClick={() => handleSelect('denied-all')}>כולם</button>
//                   <button className="sub-button" onClick={() => handleSelect('denied-reservist')}>מילואים</button>
//                   <button className="sub-button" onClick={() => handleSelect('denied-mentor')}>מנטורים</button>
//                   <button className="sub-button" onClick={() => handleSelect('denied-ambassador')}>שגרירים</button>
//                 </div>
//               )}
  
//               <button onClick={() => toggleSection('approved')}>
//                 <span style={{ marginLeft: '6px' }}>
//                   {openSection === 'approved' ? '🔽' : '▶️'}
//                 </span>
//                 משתמשים שאושרו
//               </button>
//               {openSection === 'approved' && (
//                 <div>
//                   <button className="sub-button" onClick={() => handleSelect('approved-all')}>כולם</button>
//                   <button className="sub-button" onClick={() => handleSelect('approved-reservist')}>מילואים</button>
//                   <button className="sub-button" onClick={() => handleSelect('approved-mentor')}>מנטורים</button>
//                   <button className="sub-button" onClick={() => handleSelect('approved-ambassador')}>שגרירים</button>
//                 </div>
//               )}
  
//               <button onClick={() => toggleSection('events')}>
//                 <span style={{ marginLeft: '6px' }}>
//                   {openSection === 'events' ? '🔽' : '▶️'}
//                 </span>
//                 אירועים
//               </button>
//               {openSection === 'events' && (
//                 <div>
//                   <button className="sub-button" onClick={() => setView('create-event')}>יצירת אירוע חדש</button>
//                   <button className="sub-button" onClick={() => setView('update-event')}>עדכון / מחיקת אירוע</button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </nav>
//       </header>
  
//       <div className="admin-container">
//         <main className="admin-main">
//           {renderContent()}
//         </main>
//       </div>
//     </>
//   );
  
// }
'use client';
import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '../language';
import SideBar from '../../components/SideBar';
import UsersTable from './components/usersTable';
import EventUploadForm from './components/CreateEvent';
import EventUpdateDelete from './components/EventUpdateDelete';
import './admin.css';

export default function AdminPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [view, setView] = useState('');

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const navItems = [
    {
      labelHe: "צפיה במשתמשים",
      labelEn: "#users",
      path: UsersTable,
      onClick: () => setView('users')
    },
    {
      labelHe: "יצירת אירוע חדש",
      labelEn: "Create Event",
      path: "#create-event",
      onClick: () => setView('create-event')
    },
    {
      labelHe: "צפיה באירועים קיימים",
      labelEn: "View Events",
      path: "#update-event",
      onClick: () => setView('update-event')
    },
    {
      labelHe: language === 'he' ? "English" : "עברית",
      labelEn: language === 'he' ? "English" : "עברית",
      path: "#language",
      onClick: () => setLanguage(toggleLanguage())
    }
  ];

  return (
    <div>
      <SideBar navItems={navItems} />
      <div className="admin-container">
        <main className="admin-main">
          {view === 'create-event' && <EventUploadForm />}
          {view === 'update-event' && <EventUpdateDelete />}
          {view === 'users' && <UsersTable />}
        </main>
      </div>
    </div>
  );
}
