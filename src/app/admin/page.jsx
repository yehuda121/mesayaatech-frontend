// 'use client';
// import { useState } from 'react';
// import UsersTable from "./components/usersTable";
// import "./admin.css";
// import CreateEvent from './components/CreateEvent';
// // import EventUpdateDelete from './EventUpdateDelete';


// export default function AdminPage() {
//   const [users, setUsers] = useState([]);
//   const [view, setView] = useState('');
//   const [openSection, setOpenSection] = useState('');

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

//   const renderContent = () => {
//     if (!view) return null;
//     if (view === 'create-event') return <EventUploadForm />;
//     if (view === 'update-event') return <EventUpdateDelete />;
//     return (
//       <UsersTable
//         users={filterUsers()}
//         onStatusChange={(user, status) => {/* עדכון סטטוס */}}
//       />
//     );
//   };
  

//   const handleSelect = async (type) => {
//     setView(type);
//     const res = await fetch('http://localhost:5000/api/import-users');
//     const data = await res.json();
//     setUsers(data);
//   };

//   const filterUsers = () => {
//     if (!view) return [];
//     const [status, role] = view.split('-');
//     if (role === 'all') return users.filter(u => u.status === status);
//     return users.filter(u => u.status === status && u.userType === role);
//   };

//   const renderTable = () => {
//     if (!view) return null;
//     return (
//       <UsersTable
//         users={filterUsers()}
//         onStatusChange={handleStatusChange}
//       />
//     );
//   };

//   return (
//     <div className="admin-container">
//       <aside className="admin-sidebar">
//         <h2>ניהול</h2>
//         <div>
//           <button onClick={() => toggleSection('pending')}>
//             <span style={{ marginLeft: '6px' }}>
//               {openSection === 'pending' ? '🔽' : '▶️'}
//             </span>
//             משתמשים ממתינים לאישור
//           </button>
//           {openSection === 'pending' && (
//             <div>
//               <button className="sub-button pending-all" onClick={() => handleSelect('pending-all')}>כולם</button>
//               <button className="sub-button pending-reservist" onClick={() => handleSelect('pending-reservist')}>מילואים</button>
//               <button className="sub-button pending-mentor" onClick={() => handleSelect('pending-mentor')}>מנטורים</button>
//               <button className="sub-button pending-ambassador" onClick={() => handleSelect('pending-ambassador')}>שגרירים</button>
//             </div>
//           )}

//           <button onClick={() => toggleSection('denied')}>
//             <span style={{ marginLeft: '6px' }}>
//               {openSection === 'denied' ? '🔽' : '▶️'}
//             </span>
//             משתמשים שנדחו
//           </button>
//           {openSection === 'denied' && (
//             <div>
//               <button className="sub-button denied-all" onClick={() => handleSelect('denied-all')}>כולם</button>
//               <button className="sub-button denied-reservist" onClick={() => handleSelect('denied-reservist')}>מילואים</button>
//               <button className="sub-button denied-mentor" onClick={() => handleSelect('denied-mentor')}>מנטורים</button>
//               <button className="sub-button denied-ambassador" onClick={() => handleSelect('denied-ambassador')}>שגרירים</button>
//             </div>
//           )}

//           <button onClick={() => toggleSection('approved')}>
//             <span style={{ marginLeft: '6px' }}>
//               {openSection === 'approved' ? '🔽' : '▶️'}
//             </span>
//             משתמשים שאושרו
//           </button>
//           {openSection === 'approved' && (
//             <div>
//               <button className="sub-button approved-all" onClick={() => handleSelect('approved-all')}>כולם</button>
//               <button className="sub-button approved-reservist" onClick={() => handleSelect('approved-reservist')}>מילואים</button>
//               <button className="sub-button approved-mentor" onClick={() => handleSelect('approved-mentor')}>מנטורים</button>
//               <button className="sub-button approved-ambassador" onClick={() => handleSelect('approved-ambassador')}>שגרירים</button>
//             </div>
//           )}
//           <button onClick={() => toggleSection('events')}>
//             <span style={{ marginLeft: '6px' }}>
//               {openSection === 'events' ? '🔽' : '▶️'}
//             </span>
//             אירועים
//           </button>
//           {openSection === 'events' && (
//             <div>
//               <button className="sub-button" onClick={() => setView('create-event')}>יצירת אירוע חדש</button>
//               <button className="sub-button" onClick={() => setView('update-event')}>עדכון / מחיקת אירוע</button>
//             </div>
//           )}
//         </div>
//       </aside>
      

//       <main className="admin-main">
//         {renderTable()}
//       </main>
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import UsersTable from "./components/usersTable";
import CreateEvent from './components/CreateEvent';
import EventUpdateDelete from './components/EventUpdateDelete';
import "./admin.css";
import { useRouter } from "next/navigation"; 

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('');
  const [openSection, setOpenSection] = useState('');
  const router = useRouter();

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? '' : section);
  };

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/import-users');
    const data = await res.json();
    setUsers(data);
  };
  
  const handleStatusChange = async (user, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user.fullName,
          idNumber: user.idNumber,
          userType: user.userType,
          status: status,
        }),
      });

      if (!res.ok) {
        console.error('שגיאה בעת עדכון סטטוס:', await res.text());
        return;
      }

      await fetchUsers();
    } catch (error) {
      console.error('שגיאה בחיבור לשרת בעת שינוי סטטוס:', error);
    }
  };

  const handleSelect = async (type) => {
    setView(type);
    const res = await fetch('http://localhost:5000/api/import-users');
    const data = await res.json();
    setUsers(data);
  };

  const filterUsers = () => {
    if (!view) return [];
    const [status, role] = view.split('-');
    if (role === 'all') return users.filter(u => u.status === status);
    return users.filter(u => u.status === status && u.userType === role);
  };

  const renderContent = () => {
    if (!view) return null;

    if (view === 'create-event') return <CreateEvent />;
    if (view === 'update-event') return <EventUpdateDelete />;

    // otherwise – table of users
    return (
      <UsersTable
        users={filterUsers()}
        onStatusChange={handleStatusChange}
      />
    );
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>ניהול</h2>
        <div>
          {/* משתמשים ממתינים */}
          <button onClick={() => toggleSection('pending')}>
            <span style={{ marginLeft: '6px' }}>
              {openSection === 'pending' ? '🔽' : '▶️'}
            </span>
            משתמשים ממתינים לאישור
          </button>
          {openSection === 'pending' && (
            <div>
              <button className="sub-button pending-all" onClick={() => handleSelect('pending-all')}>כולם</button>
              <button className="sub-button pending-reservist" onClick={() => handleSelect('pending-reservist')}>מילואים</button>
              <button className="sub-button pending-mentor" onClick={() => handleSelect('pending-mentor')}>מנטורים</button>
              <button className="sub-button pending-ambassador" onClick={() => handleSelect('pending-ambassador')}>שגרירים</button>
            </div>
          )}

          {/* משתמשים שנדחו */}
          <button onClick={() => toggleSection('denied')}>
            <span style={{ marginLeft: '6px' }}>
              {openSection === 'denied' ? '🔽' : '▶️'}
            </span>
            משתמשים שנדחו
          </button>
          {openSection === 'denied' && (
            <div>
              <button className="sub-button denied-all" onClick={() => handleSelect('denied-all')}>כולם</button>
              <button className="sub-button denied-reservist" onClick={() => handleSelect('denied-reservist')}>מילואים</button>
              <button className="sub-button denied-mentor" onClick={() => handleSelect('denied-mentor')}>מנטורים</button>
              <button className="sub-button denied-ambassador" onClick={() => handleSelect('denied-ambassador')}>שגרירים</button>
            </div>
          )}

          {/* משתמשים שאושרו */}
          <button onClick={() => toggleSection('approved')}>
            <span style={{ marginLeft: '6px' }}>
              {openSection === 'approved' ? '🔽' : '▶️'}
            </span>
            משתמשים שאושרו
          </button>
          {openSection === 'approved' && (
            <div>
              <button className="sub-button approved-all" onClick={() => handleSelect('approved-all')}>כולם</button>
              <button className="sub-button approved-reservist" onClick={() => handleSelect('approved-reservist')}>מילואים</button>
              <button className="sub-button approved-mentor" onClick={() => handleSelect('approved-mentor')}>מנטורים</button>
              <button className="sub-button approved-ambassador" onClick={() => handleSelect('approved-ambassador')}>שגרירים</button>
            </div>
          )}

          {/* אירועים */}
          <button onClick={() => toggleSection('events')}>
            <span style={{ marginLeft: '6px' }}>
              {openSection === 'events' ? '🔽' : '▶️'}
            </span>
            אירועים
          </button>
          {openSection === 'events' && (
            <div>
              <button className="sub-button" onClick={() => setView('create-event')}>יצירת אירוע חדש</button>
              <button className="sub-button" onClick={() => setView('update-event')}>עדכון / מחיקת אירוע</button>
            </div>
          )}
           {/* לחצן משרות */}
           <button onClick={() => router.push("/pages/jobs")}>
            📄 משרות
          </button>
          
        </div>
      </aside>

      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
}
