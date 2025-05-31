// 'use client';

// import { useEffect, useState } from 'react';
// import SideBar from '@/app/components/SideBar';
// import Events from '@/app/pages/events/page';
// import EditReservistForm from '../components/EditReservistForm';
// import ViewJob from '../../jobs/viewJob';
// import ViewJobsReadOnly from '@/app/pages/jobs/page';
// import { getLanguage } from '@/app/language';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';
// import { t } from '@/app/utils/loadTranslations';
// import '../reservist.css';

// export default function ReservistHomePage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [idNumber, setIdNumber] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [userType, setUserType] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [view, setView] = useState('dashboard'); 
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const router = useRouter();

//   useEffect(() => {
//     setLanguage(getLanguage());
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);

//     const token = localStorage.getItem('idToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setIdNumber(decoded['custom:idNumber'] || decoded.sub);
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
//     { labelHe: t('navDashboard', 'he'), labelEn: t('navDashboard', 'en'), path: '#dashboard', onClick: () => setView('dashboard') },
//     { labelHe: t('navPersonalDetails', 'he'), labelEn: t('navPersonalDetails', 'en'), path: '#form', onClick: () => setView('form') },
//     { labelHe: t('events', 'he'), labelEn: t('events', 'en'), path: '#events-section', onClick: () => setView('events') },
//     { labelHe: t('jobs', 'he'), labelEn: t('jobs', 'en'), path: '#jobs-section', onClick: () => setView('jobs') },
//     { labelHe: t('navInterviewPrep', 'he'), labelEn: t('navInterviewPrep', 'en'), path: '/pages/interviewPrep' },
//     { labelHe: t('navMeetings', 'he'), labelEn: t('navMeetings', 'en'), path: '/reserve/meetings' },
//     { labelHe: t('navFeedback', 'he'), labelEn: t('navFeedback', 'en'), path: '/reserve/feedback' }
//   ];

//   return (
//     <div className="reservist-container">
//       <SideBar navItems={navItems} />

//       <main className="reservist-main">
//         <h1 className="reservist-welcome">
//           {`${t('welcome', language)}${fullName ? ', ' + fullName : (language === 'he' ? '!' : ' Reservist!')}`}
//         </h1>

//         {view === 'dashboard' && (
//           <>
//             <h2 className="reservist-section-title text-center mb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
//               {t('whatsNew', language)}
//             </h2>

//             <div className="reservist-columns">
//               {/* jobs */}
//               <div className="reservist-column">
//                 <ViewJobsReadOnly limit={4} setSelectedJob={setSelectedJob} />
//               </div>

//               {/* events */}
//               <div className="reservist-column">
//                 <Events limit={4} idNumber={idNumber} fullName={fullName} email={email} />
//               </div>
//             </div>
//           </>
//         )}

//         {view === 'form' && userData && Object.keys(userData).length > 0 && (
//           <EditReservistForm
//             userData={userData}
//             onSave={(updated) => setUserData(updated)}
//             onBack={() => setView('dashboard')}
//           />
//         )}
        
//         {view === 'events' && idNumber && fullName && email && (
//           <Events idNumber={idNumber} fullName={fullName} email={email} />
//         )}
//         {view === 'jobs' && (
//           <div className="reservist-jobs-section">
//             <ViewJobsReadOnly setSelectedJob={setSelectedJob} />
//           </div>
//         )}


//         {selectedJob && <ViewJob job={selectedJob} onClose={() => setSelectedJob(null)} />}
//         {selectedEvent && <ViewEvent event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import Events from '@/app/pages/events/page';
import EditReservistForm from '../components/EditReservistForm';
import ViewJob from '../../jobs/viewJob';
import ViewJobsReadOnly from '@/app/pages/jobs/page';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { t } from '@/app/utils/loadTranslations';
import '../reservist.css';

export default function ReservistHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [idNumber, setIdNumber] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const router = useRouter();

  // Token + role validation
  useEffect(() => {
    setLanguage(getLanguage());
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded['custom:role'];
        const expectedRole = 'reservist';
        const roleToPath = {
          reservist: '/pages/reservist/home',
          mentor: '/pages/mentor',
          ambassador: '/pages/ambassador/home',
          admin: '/admin'
        };

        if (role !== expectedRole) {
          router.push(roleToPath[role] || '/login');
          return;
        }

        setIdNumber(decoded['custom:idNumber'] || decoded.sub);
        setFullName(decoded.name);
        setEmail(decoded.email);
        setUserType(role);
      } catch (err) {
        console.error('Failed to decode token:', err);
        router.push('/login');
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

  const navItems = [
    { labelHe: t('navDashboard', 'he'), labelEn: t('navDashboard', 'en'), path: '#dashboard', onClick: () => setView('dashboard') },
    { labelHe: t('navPersonalDetails', 'he'), labelEn: t('navPersonalDetails', 'en'), path: '#form', onClick: () => setView('form') },
    { labelHe: t('events', 'he'), labelEn: t('events', 'en'), path: '#events-section', onClick: () => setView('events') },
    { labelHe: t('jobs', 'he'), labelEn: t('jobs', 'en'), path: '#jobs-section', onClick: () => setView('jobs') },
    { labelHe: t('navInterviewPrep', 'he'), labelEn: t('navInterviewPrep', 'en'), path: '/pages/interviewPrep' },
    { labelHe: t('navMeetings', 'he'), labelEn: t('navMeetings', 'en'), path: '/reserve/meetings' },
    { labelHe: t('navFeedback', 'he'), labelEn: t('navFeedback', 'en'), path: '/reserve/feedback' }
  ];

  return (
    <div className="reservist-container">
      <SideBar navItems={navItems} />

      <main className="reservist-main">
        <h1 className="reservist-welcome">
          {`${t('welcome', language)}${fullName ? ', ' + fullName : (language === 'he' ? '!' : ' Reservist!')}`}
        </h1>

        {view === 'dashboard' && (
          <>
            <h2 className="reservist-section-title text-center mb-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
              {t('whatsNew', language)}
            </h2>

            <div className="reservist-columns">
              <div className="reservist-column">
                <ViewJobsReadOnly limit={4} setSelectedJob={setSelectedJob} />
              </div>

              <div className="reservist-column">
                <Events limit={4} idNumber={idNumber} fullName={fullName} email={email} />
              </div>
            </div>
          </>
        )}

        {view === 'form' && userData && Object.keys(userData).length > 0 && (
          <EditReservistForm
            userData={userData}
            onSave={(updated) => setUserData(updated)}
            onBack={() => setView('dashboard')}
          />
        )}
        
        {view === 'events' && idNumber && fullName && email && (
          <Events idNumber={idNumber} fullName={fullName} email={email} />
        )}

        {view === 'jobs' && (
          <div className="reservist-jobs-section">
            <ViewJobsReadOnly setSelectedJob={setSelectedJob} />
          </div>
        )}

        {selectedJob && <ViewJob job={selectedJob} onClose={() => setSelectedJob(null)} />}
        {selectedEvent && <ViewEvent event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </main>
    </div>
  );
}
