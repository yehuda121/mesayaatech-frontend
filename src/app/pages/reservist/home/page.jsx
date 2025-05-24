// 'use client';

// import { useEffect, useState } from 'react';
// import SideBar from '@/app/components/SideBar';
// import Events from '@/app/pages/events/page';
// import EditReservistForm from '../components/EditReservistForm';
// import ViewJob from '../components/viewJob';
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
//   const [jobs, setJobs] = useState([]);
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

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/import-jobs');
//         const data = await res.json();
//         setJobs(data);
//       } catch (err) {
//         console.error('Failed to load jobs:', err);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const navItems = [
//     { labelHe: t('navDashboard', 'he'), labelEn: t('navDashboard', 'en'), path: '#dashboard', onClick: () => setView('dashboard') },
//     { labelHe: t('navPersonalDetails', 'he'), labelEn: t('navPersonalDetails', 'en'), path: '#form', onClick: () => setView('form') },
//     { labelHe: t('navEvents', 'he'), labelEn: t('navEvents', 'en'), path: '#events-section', onClick: () => setView('events') },
//     { labelHe: t('navJobs', 'he'), labelEn: t('navJobs', 'en'), path: '/pages/jobs' },
//     { labelHe: t('navInterviewPrep', 'he'), labelEn: t('navInterviewPrep', 'en'), path: '/reserve/interview-prep' },
//     { labelHe: t('navMeetings', 'he'), labelEn: t('navMeetings', 'en'), path: '/reserve/meetings' },
//     { labelHe: t('navFeedback', 'he'), labelEn: t('navFeedback', 'en'), path: '/reserve/feedback' }
//   ];

//   return (
//     <div className="reservist-container">
//       <SideBar navItems={navItems} />

//       <main className={`reservist-main`}>
//         <h1 className="reservist-welcome">
//           {`${t('welcome', language)}${fullName ? ', ' + fullName : (language === 'he' ? '!' : ' Reservist!')}`}
//         </h1>

//         {view === 'dashboard' && (
//           <>
//             <h2
//               className="reservist-section-title text-center mb-6"
//               dir={language === 'he' ? 'rtl' : 'ltr'}
//             >{t('whatsNew', language)}</h2>

//             <div className="reservist-columns">
//               {/* jobs */}
//               <div className="reservist-column">
//                 <h3 className="reservist-column-title text-center">
//                   {t('jobs', language)}
//                 </h3>
//                 {jobs.length > 0 ? jobs.slice().reverse().map((job, index) => (
//                 <div
//                   key={index}
//                   className="reservist-list-item hover:underline cursor-pointer"
//                   onClick={() => setSelectedJob(job)}
//                 >
//                   {job.title} @ {job.company}
//                 </div>
//                 )) : (
//                   <p className="reservist-news-empty">
//                     {t('noNewJobs', language)}
//                   </p>
//                 )}

//               </div>

//               {/* events */}
//               <div className="reservist-column">
//                 <Events idNumber={idNumber} fullName={fullName} email={email} />
//               </div>
//             </div>
//           </>
//         )}

//         {view === 'form' && userData && Object.keys(userData).length > 0 && (
//           <EditReservistForm userData={userData} onSave={(updated) => setUserData(updated)} />
//         )}

//         {view === 'events' && idNumber && fullName && email && (
//           <Events idNumber={idNumber} fullName={fullName} email={email} />
//         )}

//         {selectedJob && <ViewJob job={selectedJob} onClose={() => setSelectedJob(null)} />}
//         {selectedEvent && <ViewEvent event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
//       </main>
//     </div>
//   );
// }

// page.jsx - דף הבית של המילואימניק
'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import Events from '@/app/pages/events/page';
import EditReservistForm from '../components/EditReservistForm';
import ViewJob from '../components/viewJob';
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

  const navItems = [
    { labelHe: t('navDashboard', 'he'), labelEn: t('navDashboard', 'en'), path: '#dashboard', onClick: () => setView('dashboard') },
    { labelHe: t('navPersonalDetails', 'he'), labelEn: t('navPersonalDetails', 'en'), path: '#form', onClick: () => setView('form') },
    { labelHe: t('navEvents', 'he'), labelEn: t('navEvents', 'en'), path: '#events-section', onClick: () => setView('events') },
    { labelHe: t('navJobs', 'he'), labelEn: t('navJobs', 'en'), path: '/pages/jobs' },
    { labelHe: t('navInterviewPrep', 'he'), labelEn: t('navInterviewPrep', 'en'), path: '/reserve/interview-prep' },
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
              {/* משרות */}
              <div className="reservist-column">
                <ViewJobsReadOnly limit={4} setSelectedJob={setSelectedJob} />
              </div>

              {/* אירועים */}
              <div className="reservist-column">
                <Events limit={4} idNumber={idNumber} fullName={fullName} email={email} />
              </div>
            </div>
          </>
        )}

        {view === 'form' && userData && Object.keys(userData).length > 0 && (
          <EditReservistForm userData={userData} onSave={(updated) => setUserData(updated)} />
        )}

        {view === 'events' && idNumber && fullName && email && (
          <Events idNumber={idNumber} fullName={fullName} email={email} />
        )}

        {selectedJob && <ViewJob job={selectedJob} onClose={() => setSelectedJob(null)} />}
        {selectedEvent && <ViewEvent event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </main>
    </div>
  );
}
