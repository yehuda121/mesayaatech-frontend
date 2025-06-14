'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '../language';
import SideBar from '@/app/components/SideBar';
import UsersTable from './components/users/usersTable';
import CreateEvent from './components/events/CreateEvent';
import ViewEvents from './components/events/ViewEvents';
import EditEvents from './components/events/EditEvents';
import ViewJobs from '../components/jobs/ViewAllJobs';
import PostNewJob from '../components/jobs/PostNewJob';
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
import AddNewQues from '@/app/components/interviewQestions/AddNewQuestion';
import ViewMentorships from './components/mentorship/viewMentorships';
import Button from '../components/Button';

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
  const [email, setEmail] =useState('');
  const [questionToView, setQuestionToView] = useState(null);

  useEffect(() => {
    // Check JWT token and handle user authentication
    const token = localStorage.getItem('idToken');
    const handleLangChange = () => setLanguage(getLanguage());

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded['custom:role'];
        const expectedRole = 'admin';
        const roleToPath = {
          admin: '/admin',
          mentor: '/pages/mentor',
          reservist: '/pages/reservist',
          ambassador: '/pages/ambassador'
        };

        setFullName(decoded.name || '');
        setIdNumber(decoded['custom:idNumber'] || decoded.sub || '');
        setEmail(decoded['custom:email'] || decoded.email || '');

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

    // Listen to language change events
    window.addEventListener('languageChanged', handleLangChange);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('languageChanged', handleLangChange);
    };
  }, [router]);


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
      labelHe: t('Reports', 'he'),
      labelEn: t('Reports', 'en'),
      path: '#Reports',
      onClick: () => moovToReport()
    },
  ];

  const moovToReport = () => {
    router.push('../pages/reports');
  }

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
              <div className='mb-4'>
                <Button text={t('postNewJob', language)} onClick={() => handleNavigation('post-job')} />
              </div>
              <ViewJobs
                jobs={jobs}
                setJobs={setJobs}
                onEdit={(job) => setSelectedJob(job)}
                handleNavigation={handleNavigation}
              />
            </>
          )}

          {view === 'post-job' && (
            <>
              <AddJob
                publisherId={`${email}#${idNumber}`}
                onClose={() => setView('')}
                publisherType="admin"
                onSave={(newJob) => {
                  setJobs(prev => [...prev, newJob]);
                  setView('view-jobs');
                }}
              />
            </>
          )}

          {view === 'view-users' && <UsersTable />}

          {view === 'view-mentorships' && <ViewMentorships />}
          
          {view === 'interview-ques' && (
            <>
              <div className="flex gap-2 mt-3 mb-3 justify-start" dir="rtl">
                <Button text={t('AddNewQues', language)} onClick={() => handleNavigation('AddNewQues')} />
              </div>
              <AdminQuestions
                onEdit={(q) => setSelectedQuestion(q)}
                onAnswer={(qid) => setAnswerQuestionId(qid)}
                onView={(q) => setQuestionToView(q)}
              />
            </>
          )}

          {view === 'AddNewQues' && (
            <>
              <div className="flex gap-2 mt-3 mb-3 justify-start" dir="rtl">
                <Button text={t('interviewQues', language)} onClick={() => handleNavigation('interview-ques')} />
              </div>
              <AddNewQues
                fullName={fullName}
                idNumber={idNumber}
                onSuccess={() => setView('interview-ques')}
              />
            </>
          )}
          
          {answerQuestionId && (
            <div
              className="modal-overlay"
              onClick={(e) => {
                if (e.target.classList.contains('modal-overlay')) {
                  setAnswerQuestionId(null); 
                }
              }}
            >
              <div
                className="relative max-w-xl w-full mx-auto"
                onClick={(e) => e.stopPropagation()} 
              >
                <PostAnswer
                  questionId={answerQuestionId}
                  fullName={fullName}
                  idNumber={idNumber}
                  onSuccess={() => setAnswerQuestionId(null)}  
                  onClose={() => setAnswerQuestionId(null)} 
                />
              </div>
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
        // <div className='modal-overlay'>
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
        // </div>
      )}
    </div>
  );
}
