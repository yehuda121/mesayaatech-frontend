// 'use client';

// import { useEffect, useState } from 'react';
// import SideBar from '@/components/SideBar';
// import Events from '@/app/events/page';
// import EditReservistForm from '@/app/reservist/EditReservistForm';
// import { getLanguage } from '@/app/language';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';
// import '@/app/reservist/reservist.css';

// export default function ReservistHomePage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [idNumber, setIdNumber] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [userType, setUserType] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [view, setView] = useState('events'); // תצוגה פעילה

//   const router = useRouter();

//   useEffect(() => {
//     setLanguage(getLanguage());

//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);

//     const token = localStorage.getItem('idToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setIdNumber(decoded['custom:idNumber']);
//         setFullName(decoded.name);
//         setEmail(decoded.email);
//         setUserType(decoded['custom:role']);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//       }
//     } else {
//       router.push('/login');
//     }

//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, [router]);

//   useEffect(() => {
//     if (!userType || !idNumber) return;

//     const fetchUserForm = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/get-user-form?userType=${userType}&idNumber=${idNumber}`
//         );
//         const data = await res.json();
//         setUserData(data);
//       } catch (err) {
//         console.error('Failed to load user form:', err);
//       }
//     };

//     fetchUserForm();
//   }, [userType, idNumber]);

//   const navItems = [
//     {
//       labelHe: 'פרטים אישיים',
//       labelEn: 'Personal Details',
//       path: '#form',
//       onClick: () => setView('form')
//     },
//     {
//       labelHe: 'אירועים קרובים',
//       labelEn: 'Upcoming Events',
//       path: '#events-section',
//       onClick: () => setView('events')
//     }
//   ];

//   return (
//     <div className="reservist-container">
//       <SideBar navItems={navItems} />

//       <main className="reservist-main">
//         <h1 className="text-2xl font-bold mb-6 text-center">
//           {language === 'he'
//             ? `ברוך הבא${fullName ? ', ' + fullName : ' מילואימניק יקר!'}` 
//             : `Welcome${fullName ? ', ' + fullName + '!' : ' Reservist!'}`}
//         </h1>

//         {view === 'form' && userData && Object.keys(userData).length > 0 && (
//           <EditReservistForm
//             userData={userData}
//             onSave={(updated) => setUserData(updated)}
//           />
//         )}


//         {view === 'events' && idNumber && fullName && email && (
//           <Events idNumber={idNumber} fullName={fullName} email={email} />
//         )}
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import Events from '@/app/events/page';
import EditReservistForm from '@/app/reservist/EditReservistForm';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import '@/app/reservist/reservist.css';

export default function ReservistHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [idNumber, setIdNumber] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);


  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());

    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdNumber(decoded['custom:idNumber'] || decoded.sub);
        setFullName(decoded.name);
        setEmail(decoded.email);
        setUserType(decoded['custom:role']);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    } else {
      router.push('/login');
    }

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [router]);

  useEffect(() => {
    if (!userType || !idNumber) return;

    const fetchUserForm = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/get-user-form?userType=${userType}&idNumber=${idNumber}`
        );
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Failed to load user form:', err);
      }
    };

    fetchUserForm();
  }, [userType, idNumber]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/import-jobs');
        const data = await res.json();
        setJobs(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
  
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/import-events');
        const data = await res.json();
        const futureEvents = data.filter(event => new Date(event.date) >= new Date());
        setEvents(futureEvents.slice(0, 3));
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };
  
    fetchJobs();
    fetchEvents();
  }, []);
  

  const navItems = [
    {
      labelHe: 'ראשי',
      labelEn: 'Dashboard',
      path: '#dashboard',
      onClick: () => setView('dashboard')
    },
    {
      labelHe: 'פרטים אישיים',
      labelEn: 'Personal Details',
      path: '#form',
      onClick: () => setView('form')
    },
    {
      labelHe: 'אירועים קרובים',
      labelEn: 'Upcoming Events',
      path: '#events-section',
      onClick: () => setView('events')
    },
    { labelHe: 'משרות',
      labelEn: 'Jobs',
      path: '/pages/jobs' },

    { labelHe: 'הכנה לראיונות',
      labelEn: 'Interview Prep', 
      path: '/reserve/interview-prep'
     },
    { labelHe: 'פגישות קרובות',
      labelEn: 'Upcoming Meetings',
      path: '/reserve/meetings' 
    },
    { labelHe: 'פידבקים מהמנטור', 
      labelEn: 'Mentor Feedback', 
      path: '/reserve/feedback' 
    }
  ];

  const DashboardCard = ({ title, description, onClick }) => (
    <div className="dashboard-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div className="reservist-container">
      <SideBar navItems={navItems} />

      <main className="reservist-main">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {language === 'he'
            ? `ברוך הבא${fullName ? ', ' + fullName : ' מילואימניק יקר!'}`
            : `Welcome${fullName ? ', ' + fullName + '!' : ' Reservist!'}`}
        </h1>

        {/* {view === 'dashboard' && (
          <div className="dashboard-grid">
            <DashboardCard
              title={language === 'he' ? 'הפרופיל שלי' : 'My Profile'}
              description={language === 'he' ? 'נהל את הפרטים האישיים שלך' : 'Manage your personal info'}
              onClick={() => router.push('/reserve/profile')}
            />
            <DashboardCard
              title={language === 'he' ? 'משרות' : 'Jobs'}
              description={language === 'he' ? 'מצא משרות מותאמות' : 'Find tailored jobs'}
              onClick={() => router.push('/pages/jobs')}
            />
            <DashboardCard
              title={language === 'he' ? 'הכנה לראיונות' : 'Interview Prep'}
              description={language === 'he' ? 'תרגול וקבלת פידבק לשאלות ראיונות עבודה' : 'Practice and get feedback on job interview questions'}
              onClick={() => router.push('/reserve/interview-prep')}
            />
            <DashboardCard
              title={language === 'he' ? 'פגישות קרובות' : 'Upcoming Meetings'}
              description={language === 'he' ? 'צפי בפגישות הקרובות עם מנטורים' : 'See your upcoming meetings'}
              onClick={() => router.push('/reserve/meetings')}
            />
            <DashboardCard
              title={language === 'he' ? 'פידבקים מהמנטור' : 'Mentor Feedback'}
              description={language === 'he' ? 'ראה מה המנטורים חושבים עליך' : 'See what mentors say about you'}
              onClick={() => router.push('/reserve/feedback')}
            />
          </div>
        )} */}
        {view === 'dashboard' && (
  <section className="whats-new-section bg-white p-4 rounded shadow mb-6">
    <h2 className="text-xl font-semibold mb-3">
      {language === 'he' ? 'מה חדש השבוע?' : "What's New This Week?"}
    </h2>

    {jobs.length > 0 ? (
      <div>
        <p className="mb-2 text-blue-700">
          {language === 'he' ? 'משרה חדשה פורסמה:' : 'New job posted:'}
        </p>
        <p className="font-bold">{jobs[0].title} @ {jobs[0].company}</p>
      </div>
    ) : (
      <p className="text-gray-600">
        {language === 'he' ? 'לא פורסמו משרות חדשות.' : 'No new jobs this week.'}
      </p>
    )}

    <hr className="my-4" />

    {events.length > 0 ? (
      <div>
        <p className="mb-2 text-green-700">
          {language === 'he' ? 'אירוע קרוב:' : 'Upcoming Event:'}
        </p>
        <p className="font-bold">{events[0].title} – {events[0].date}</p>
      </div>
    ) : (
      <p className="text-gray-600">
        {language === 'he' ? 'אין אירועים קרובים כרגע.' : 'No upcoming events for now.'}
      </p>
    )}
  </section>
)}


        {view === 'form' && userData && Object.keys(userData).length > 0 && (
          <EditReservistForm
            userData={userData}
            onSave={(updated) => setUserData(updated)}
          />
        )}

        {view === 'events' && idNumber && fullName && email && (
          <Events idNumber={idNumber} fullName={fullName} email={email} />
        )}
      </main>
    </div>
  );
}
