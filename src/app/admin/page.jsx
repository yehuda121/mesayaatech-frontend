'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '../language';
import SideBar from '@/app/components/SideBar';
import UsersTable from './components/users/usersTable';
import CreateEvent from './components/events/CreateEvent';
import ViewEvents from './components/events/ViewEvents';
import EditEvents from './components/events/EditEvents';
import ViewJobs from './components/jobs/viewJobs';
import EditJob from '@/app/components/jobs/EditJob';
import AddJob from '../components/jobs/PostNewJob';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import './admin.css';
import AdminQuestions from './components/interviewQestions/AdminQuestions';
import PostAnswer from '@/app/components/interviewQestions/PostAnswer';
import EditQuestion from '@/app/components/interviewQestions/EditQuestion';
import ViewQuestion from '@/app/components/interviewQestions/ViewQuestion';

export default function AdminPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [view, setView] = useState('');
  const [eventToEdit, setEventToEdit] = useState(null);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerQuestionId, setAnswerQuestionId] = useState(null);
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [questionToView, setQuestionToView] = useState(null);

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
        setFullName(decoded.name || '');
        setIdNumber(decoded['custom:idNumber'] || decoded.sub || '');

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
    setSelectedQuestion(null);
    setAnswerQuestionId(null);
    setView(newView);
  };

  const navItems = [
    {
      labelHe: t('users', 'he'),
      labelEn: t('users', 'en'),
      path: '#view-users',
      onClick: () => handleNavigation('users')
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
      path: '#interviewQues',
      onClick: () => handleNavigation('interviewQues')
    },
  ];

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
                  <CreateEvent />
                </>
              )}
            </>
          )}

          {view === 'create-event' && <CreateEvent />}

          {view === 'view-events' && (
            <ViewEvents
              events={events}
              setEvents={setEvents}
              onEdit={(ev) => setEventToEdit(ev)}
              handleNavigation={handleNavigation}
            />
          )}

          {view === 'view-jobs' && (
            <ViewJobs
              jobs={jobs}
              setJobs={setJobs}
              onEdit={(job) => setSelectedJob(job)}
              handleNavigation={handleNavigation}
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

          {view === 'interviewQues' && (
            <AdminQuestions
              onEdit={(q) => setSelectedQuestion(q)}
              onAnswer={(qid) => setAnswerQuestionId(qid)}
              onView={(q) => setQuestionToView(q)}
            />
          )}

          {answerQuestionId && (
            <div className="modal-overlay">
              <PostAnswer
                questionId={answerQuestionId}
                fullName={fullName}
                idNumber={idNumber}
                onSuccess={() => {
                  setAnswerQuestionId(null);
                }}
              />
            </div>
          )}
          {questionToView && (
            <div className="modal-overlay">
              <div className="modal-content">
                <ViewQuestion
                  question={questionToView}
                  onClose={() => setQuestionToView(null)}
                />
              </div>
            </div>
          )}

          {selectedQuestion && (
            <div className="modal-overlay">
              <EditQuestion
                question={selectedQuestion}
                onClose={() => setSelectedQuestion(null)}
                onSave={() => {
                  setSelectedQuestion(null);
                }}
              />
            </div>
          )}

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
