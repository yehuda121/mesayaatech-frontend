// 'use client';

// import { useEffect, useState } from 'react';
// import SideBar from '@/app/components/SideBar';
// import EditMentorForm from './profile/EditMentorForm';
// import { getLanguage } from '@/app/language';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';
// import { t } from '@/app/utils/loadTranslations';
// import './mentor.css';

// export default function MentorHomePage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [idNumber, setIdNumber] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const [userType, setUserType] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [view, setView] = useState('dashboard');

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
//       labelHe: t('navDashboard', language),
//       labelEn: t('navDashboard', language),
//       path: '#dashboard',
//       onClick: () => setView('dashboard')
//     },
//     {
//       labelHe: t('navMyReservists', language),
//       labelEn: t('navMyReservists', language),
//       path: '/mentor/my-reservists'
//     },
//     {
//       labelHe: t('navRequests', language),
//       labelEn: t('navRequests', language),
//       path: '/mentor/requests'
//     },
//     {
//       labelHe: t('navJobMatches', language),
//       labelEn: t('navJobMatches', language),
//       path: '/mentor/job-matches'
//     },
//     {
//       labelHe: t('navPostJob', language),
//       labelEn: t('navPostJob', language),
//       path: '/pages/jobs/newJob'
//     },
//     {
//       labelHe: t('navFeedback', language),
//       labelEn: t('navFeedback', language),
//       path: '/mentor/feedback'
//     },
//     {
//       labelHe: t('navPersonalDetails', language),
//       labelEn: t('navPersonalDetails', language),
//       path: '#form',
//       onClick: () => setView('form')
//     },
//     {
//       labelHe: t('navInterviewPrep', language),
//       labelEn: t('navInterviewPrep', language),
//       path: '/pages/interviewPrep'
//     }
//   ];

//   return (
//     <div className="mentor-container">
//       <SideBar navItems={navItems} />

//       <main className="mentor-main">
//         <h1 className="mentor-welcome">
//           {t('mentorWelcomeTitle', language).replace('{{name}}', fullName || '')}
//         </h1>
//         <p className="mentor-subtitle">
//           {t('mentorWelcomeSubtitle', language)}
//         </p>

//         {view === 'form' && userData && Object.keys(userData).length > 0 && (
//           <EditMentorForm
//             userData={userData}
//             onSave={(updated) => setUserData(updated)}
//             onBack={() => setView('dashboard')}
//           />
//         )}
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { t } from '@/app/utils/loadTranslations';
import EditMentorForm from './components/EditMentorForm';
import PostJob from './components/jobs/PostJob';

// import MyReservists from './components/MyReservists'; // hypothetical
// import Requests from './components/Requests'; // hypothetical
// import JobMatches from './components/JobMatches'; // hypothetical
// import FeedbackList from './components/FeedbackList'; // hypothetical
// import InterviewPrep from '@/app/pages/interviewPrep/page'; // assuming exists
import './mentor.css';

export default function MentorHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [view, setView] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFullName(decoded.name);
        setIdNumber(decoded['custom:idNumber'] || decoded.sub);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    } else {
      router.push('/login');
    }

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [router]);

  useEffect(() => {
    if (!idNumber) return;

    const fetchUserForm = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get-user-form?userType=mentor&idNumber=${idNumber}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Failed to load mentor form:', err);
      }
    };

    fetchUserForm();
  }, [idNumber]);

  const handleNavigation = (newView) => setView(newView);

  const navItems = [
    {
      labelHe: t('navDashboard', language),
      labelEn: t('navDashboard', language),
      path: '#dashboard',
      onClick: () => handleNavigation('dashboard')
    },
    {
      labelHe: t('navPersonalDetails', language),
      labelEn: t('navPersonalDetails', language),
      path: '#form',
      onClick: () => handleNavigation('form')
    },
    {
      labelHe: t('navPostJob', language),
      labelEn: t('navPostJob', language),
      path: '#post-job',
      onClick: () => handleNavigation('post-job')
    },
    {
      labelHe: t('navMyReservists', language),
      labelEn: t('navMyReservists', language),
      path: '#my-reservists',
      onClick: () => handleNavigation('my-reservists')
    },
    {
      labelHe: t('navRequests', language),
      labelEn: t('navRequests', language),
      path: '#requests',
      onClick: () => handleNavigation('requests')
    },
    {
      labelHe: t('navJobMatches', language),
      labelEn: t('navJobMatches', language),
      path: '#job-matches',
      onClick: () => handleNavigation('job-matches')
    },
    {
      labelHe: t('navFeedback', language),
      labelEn: t('navFeedback', language),
      path: '#feedback',
      onClick: () => handleNavigation('feedback')
    },
    {
      labelHe: t('navInterviewPrep', language),
      labelEn: t('navInterviewPrep', language),
      path: '#interview-prep',
      onClick: () => handleNavigation('interview-prep')
    }
  ];

  return (
    <div className="mentor-container">
      <SideBar navItems={navItems} />
      <main className="mentor-main">
        {view === 'dashboard' && (
          <>
            <h1 className="mentor-welcome">
              {t('mentorWelcomeTitle', language).replace('{{name}}', fullName)}
            </h1>
            <p className="mentor-subtitle">
              {t('mentorWelcomeSubtitle', language)}
            </p>
          </>
        )}

        {view === 'form' && userData && (
          <EditMentorForm
            userData={userData}
            onSave={(updated) => setUserData(updated)}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'my-reservists' && <MyReservists />}
        {view === 'requests' && <Requests />}
        {view === 'job-matches' && <JobMatches />}
        {view === 'post-job' && (
          <PostJob
            publisherId={idNumber}
            publisherType="mentor"
            onSuccess={() => setView('dashboard')}
          />
        )}
        {view === 'feedback' && <FeedbackList />}
        {view === 'interview-prep' && <InterviewPrep />}
      </main>
    </div>
  );
}
