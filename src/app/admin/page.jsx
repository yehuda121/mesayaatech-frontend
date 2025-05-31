
// 'use client';
// import { useEffect, useState } from 'react';
// import { getLanguage } from '../language';
// import SideBar from '../components/SideBar';
// import UsersTable from './components/users/usersTable';
// import CreateEvent from './components/events/CreateEvent';
// import ViewEvents from './components/events/ViewEvents';
// import EditEvents from './components/events/EditEvents';
// import ViewJobs from './components/jobs/viewJobs';
// import EditJob from './components/jobs/editJob';
// import AddJob from './components/jobs/addNewJob';
// import { t } from '@/app/utils/loadTranslations';
// import './admin.css';

// export default function AdminPage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [view, setView] = useState('');
//   const [eventToEdit, setEventToEdit] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loadingPending, setLoadingPending] = useState(true);

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     const fetchPendingUsers = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/imports-user-registration-form/all');
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           const filtered = data.filter(u => u.status === 'pending');
//           setPendingUsers(filtered);
//         } else {
//           setPendingUsers([]);
//         }
//       } catch (err) {
//         console.error('Failed to fetch users', err);
//         setPendingUsers([]);
//       } finally {
//         setLoadingPending(false);
//       }
//     };

//     fetchPendingUsers();
//   }, []);

//   const handleNavigation = (newView) => {
//     setEventToEdit(null);       
//     setSelectedJob(null);       
//     setView(newView); 
//   };

//   const navItems = [
//     {
//       labelHe: t('viewUsers', 'he'),
//       labelEn: t('viewUsers', 'en'),
//       path: '#view-users',
//       onClick: () => handleNavigation('users')
//     },
//     {
//       labelHe: t('createEvent', 'he'),
//       labelEn: t('createEvent', 'en'),
//       path: '#create-event',
//       onClick: () => handleNavigation('create-event')
//     },
//     {
//       labelHe: t('viewEvents', 'he'),
//       labelEn: t('viewEvents', 'en'),
//       path: '#view-events',
//       onClick: () => handleNavigation('view-events')
//     },
//     {
//       labelHe: t('manageJobs', 'he'),
//       labelEn: t('manageJobs', 'en'),
//       path: '#view-jobs',
//       onClick: () => handleNavigation('view-jobs')
//     },
//     {
//       labelHe: t('addJob', 'he'),
//       labelEn: t('addJob', 'en'),
//       path: '#add-job',
//       onClick: () => handleNavigation('add-job')
//     },
//     {
//       labelHe: t('navInterviewPrep', 'he'),
//       labelEn: t('navInterviewPrep', 'en'),
//       path: '/pages/interviewPrep'
//     }
//   ];

//   return (
//     <div>
//       <SideBar navItems={navItems} />
//       <div className="admin-container">
//         <main className="admin-main">

//           {view === '' && (
//             <>
//               {loadingPending ? (
//                 <p>{t('loading', language)}</p>
//               ) : pendingUsers.length > 0 ? (
//                 <UsersTable users={pendingUsers} />
//               ) : (
//                 <p>{t('noPendingUsers', language)}</p>
//               )}
//             </>
//           )}

//           {view === 'create-event' && <CreateEvent />}
//           {view === 'view-events' && (
//             <ViewEvents
//               events={events}
//               setEvents={setEvents}
//               onEdit={(ev) => setEventToEdit(ev)}
//             />
//           )}
//           {view === 'view-jobs' && (
//             <ViewJobs
//               jobs={jobs}
//               setJobs={setJobs}
//               onEdit={(job) => setSelectedJob(job)}
//             />
//           )}
//           {view === 'add-job' && (
//             <AddJob
//               onClose={() => setView('')}
//               onSave={(newJob) => {
//                 setJobs(prev => [...prev, newJob]);
//                 setView('view-jobs');
//               }}
//             />
//           )}
//           {view === 'users' && <UsersTable />}
//         </main>
//       </div>

//       {eventToEdit && (
//         <EditEvents
//           event={eventToEdit}
//           onClose={() => setEventToEdit(null)}
//           onSave={(updatedEvent) => {
//             setEventToEdit(null);
//             setEvents(prev =>
//               prev.map(ev => ev.eventId === updatedEvent.eventId ? updatedEvent : ev)
//             );
//           }}
//         />
//       )}

//       {selectedJob && (
//         <EditJob
//           job={selectedJob}
//           onClose={() => setSelectedJob(null)}
//           onSave={(updatedJob) => {
//             setJobs(prev =>
//               prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j)
//             );
//             setSelectedJob(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '../language';
import SideBar from '../components/SideBar';
import UsersTable from './components/users/usersTable';
import CreateEvent from './components/events/CreateEvent';
import ViewEvents from './components/events/ViewEvents';
import EditEvents from './components/events/EditEvents';
import ViewJobs from './components/jobs/viewJobs';
import EditJob from './components/jobs/editJob';
import AddJob from './components/jobs/addNewJob';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import './admin.css';

export default function AdminPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [view, setView] = useState('');
  const [eventToEdit, setEventToEdit] = useState(null);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded['custom:role'];
        const expectedRole = 'admin';
        const roleToPath = {
          admin: '/admin',
          mentor: '/pages/mentor',
          reservist: '/pages/reservist/home',
          ambassador: '/pages/ambassador/home'
        };

        if (role !== expectedRole) {
          router.push(roleToPath[role] || '/login');
          return;
        }
      } catch (err) {
        console.error('Token decode failed:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/imports-user-registration-form/all');
        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = data.filter(u => u.status === 'pending');
          setPendingUsers(filtered);
        } else {
          setPendingUsers([]);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
        setPendingUsers([]);
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleNavigation = (newView) => {
    setEventToEdit(null);
    setSelectedJob(null);
    setView(newView);
  };

  const navItems = [
    {
      labelHe: t('viewUsers', 'he'),
      labelEn: t('viewUsers', 'en'),
      path: '#view-users',
      onClick: () => handleNavigation('users')
    },
    {
      labelHe: t('createEvent', 'he'),
      labelEn: t('createEvent', 'en'),
      path: '#create-event',
      onClick: () => handleNavigation('create-event')
    },
    {
      labelHe: t('viewEvents', 'he'),
      labelEn: t('viewEvents', 'en'),
      path: '#view-events',
      onClick: () => handleNavigation('view-events')
    },
    {
      labelHe: t('manageJobs', 'he'),
      labelEn: t('manageJobs', 'en'),
      path: '#view-jobs',
      onClick: () => handleNavigation('view-jobs')
    },
    {
      labelHe: t('addJob', 'he'),
      labelEn: t('addJob', 'en'),
      path: '#add-job',
      onClick: () => handleNavigation('add-job')
    },
    {
      labelHe: t('navInterviewPrep', 'he'),
      labelEn: t('navInterviewPrep', 'en'),
      path: '/pages/interviewPrep'
    }
  ];

  return (
    <div>
      <SideBar navItems={navItems} />
      <div className="admin-container">
        <main className="admin-main">
          {view === '' && (
            <>
              {loadingPending ? (
                <p>{t('loading', language)}</p>
              ) : pendingUsers.length > 0 ? (
                <UsersTable users={pendingUsers} />
              ) : (
                <p>{t('noPendingUsers', language)}</p>
              )}
            </>
          )}

          {view === 'create-event' && <CreateEvent />}
          {view === 'view-events' && (
            <ViewEvents
              events={events}
              setEvents={setEvents}
              onEdit={(ev) => setEventToEdit(ev)}
            />
          )}
          {view === 'view-jobs' && (
            <ViewJobs
              jobs={jobs}
              setJobs={setJobs}
              onEdit={(job) => setSelectedJob(job)}
            />
          )}
          {view === 'add-job' && (
            <AddJob
              onClose={() => setView('')}
              onSave={(newJob) => {
                setJobs(prev => [...prev, newJob]);
                setView('view-jobs');
              }}
            />
          )}
          {view === 'users' && <UsersTable />}
        </main>
      </div>

      {eventToEdit && (
        <EditEvents
          event={eventToEdit}
          onClose={() => setEventToEdit(null)}
          onSave={(updatedEvent) => {
            setEventToEdit(null);
            setEvents(prev =>
              prev.map(ev => ev.eventId === updatedEvent.eventId ? updatedEvent : ev)
            );
          }}
        />
      )}

      {selectedJob && (
        <EditJob
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={(updatedJob) => {
            setJobs(prev =>
              prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j)
            );
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
