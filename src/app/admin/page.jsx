'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import UsersTable from './components/users/usersTable';
import CreateEvent from './components/events/CreateEvent';
import ViewEvents from './components/events/ViewEvents';
import EditEvents from './components/events/EditEvents';
import ViewJobs from '../components/jobs/ViewAllJobs';
import EditJob from '@/app/components/jobs/EditJob';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import './admin.css';
import InterviewQestions from '@/app/components/interviewQestions/QuestionsList';
import ViewMentorships from './components/mentorship/viewMentorships';
import ChangePassword from '@/app/login/ChangePassword/ChangePassword';
import InterviewPracticePanel from "@/app/components/interviewWithAi/InterviewPracticePanel";
import { useRoleGuard } from "@/app/utils/isExpectedRoll/useRoleGuard";
import { useLanguage } from "@/app/utils/language/useLanguage";
import { Brain } from 'lucide-react';

export default function AdminPage() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [view, setView] = useState('');
  const [eventToEdit, setEventToEdit] = useState(null);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const router = useRouter();
  const language = useLanguage();
  useRoleGuard("admin");

  useEffect(() => {
    const storedFullName = sessionStorage.getItem('fullName');
    const storedIdNumber = sessionStorage.getItem('idNumber');
    const storedEmail = sessionStorage.getItem('email');
    const storedUserType = sessionStorage.getItem('userType');

    if (storedFullName) setFullName(storedFullName);
    if (storedIdNumber) setIdNumber(storedIdNumber);
    if (storedEmail) setEmail(storedEmail);
    if (storedUserType) setUserType(storedUserType);
  }, []);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/imports-user-registration-form/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
          }
        });

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
    setView(newView);
  };

  const navItems = [
    {
      labelHe: t('users', 'he'),
      labelEn: t('users', 'en'),
      path: '#view-users',
      onClick: () => handleNavigation('view-users')
    },
    {
      labelHe: t('events', 'he'),
      labelEn: t('events', 'en'),
      path: '#view-events',
      onClick: () => handleNavigation('view-events')
    },
    {
      labelHe: t('jobs', 'he'),
      labelEn: t('jobs', 'en'),
      path: '#view-jobs',
      onClick: () => handleNavigation('view-jobs')
    },
    {
      labelHe: t('interviewQues', 'he'),
      labelEn: t('interviewQues', 'en'),
      path: '#interview-ques',
      onClick: () => handleNavigation('interview-ques')
    },
    {
      labelHe: t('viewMentorships', 'he'),
      labelEn: t('viewMentorships', 'en'),
      path: '#view-mentorships',
      onClick: () => handleNavigation('view-mentorships')
    },
    { 
      labelHe: t('interviewWithAi', 'he'), 
      labelEn: t('interviewWithAi', 'en'), 
      path: '#InterviewPracticePanel',
      icon: <Brain size={18} className="inline mr-2" />,
      onClick: () => setView('InterviewPracticePanel') 
    },
    {
      labelHe: t('Reports', 'he'),
      labelEn: t('Reports', 'en'),
      path: '#Reports',
      onClick: () => moovToReport()
    },
    {
      labelHe: t('changePassword', 'he'),
      labelEn: t('changePassword', 'en'),
      path: '#changePassword',
      onClick: () => handleNavigation('change-password')
    },
  ];

  const moovToReport = () => {
    router.push('../pages/reports');
  }

  if (!language) return null;
  
  return (
    <div>
      <SideBar navItems={navItems} />
      <div className="admin-container">
        <main className="admin-main">
          {view === '' && (
            <>
              {loadingPending ? (
                <p className='adminHomePageTitle'>{t('loading', language)}</p>
              ) : pendingUsers.length > 0 ? (
                <UsersTable users={pendingUsers} />
              ) : (
                <>
                  <p className='adminHomePageTitle'>{t('noPendingUsers', language)}</p>
                  <div className='CreateEventClass'>
                    <CreateEvent />
                  </div>
                </>
              )}
            </>
          )}

          {view === 'create-event' && 
            <div className='CreateEventClass'>
              <CreateEvent />
            </div>
          }

          {view === 'view-events' && (
            <ViewEvents
              events={events}
              setEvents={setEvents}
              onEdit={(ev) => setEventToEdit(ev)}
              handleNavigation={handleNavigation}
            />
          )}

          {view === 'view-jobs' && (
            <>
              <ViewJobs
                jobs={jobs}
                setJobs={setJobs}
                onEdit={(job) => setSelectedJob(job)}
                handleNavigation={handleNavigation}
              />
            </>
          )}

          {view === 'view-users' && <UsersTable />}

          {view === 'view-mentorships' && <ViewMentorships />}

          {view === 'InterviewPracticePanel' && idNumber && fullName && email && (
            <InterviewPracticePanel userId={idNumber} email={email} language={language} role='reservist' />
          )}
          
          {view === 'interview-ques' && (
            <>
              <InterviewQestions
                onEdit={(q) => setSelectedQuestion(q)}
                onAnswer={(qid) => setAnswerQuestionId(qid)}
                onView={(q) => setQuestionToView(q)}
              />
            </>
          )}
          
          {view === 'change-password' && (<ChangePassword/>)}
     
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
