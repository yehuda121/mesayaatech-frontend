'use client';

import { useEffect, useState, useMemo } from 'react';
import SideBar from '@/app/components/SideBar';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { t } from '@/app/utils/loadTranslations';
import EditMentorForm from './components/EditMentorForm';
import PostNewJob from '@/app/components/jobs/PostNewJob';
import MyJobsList from './components/jobs/MyJobsList';
import EditMentorJob from '@/app/components/jobs/EditJob';
import EventsPage from '@/app/components/events/ViewAllEvents';
import InterviewPrep from '@/app/components/interviewQestions/QuestionsList';
import FindReservist from './components/FindReservist';
import ViewAllJobs from '@/app/components/jobs/ViewAllJobs';
import Button from '@/app/components/Button';
import ToastMessage from '@/app/components/notifications/ToastMessage';
import AddNewQues from '@/app/components/interviewQestions/AddNewQuestion';
import MyQuestions from '@/app/components/interviewQestions/MyQuestions';
import EditQuestion from '@/app/components/interviewQestions/EditQuestion';
import PostAnswer from '@/app/components/interviewQestions/PostAnswer';
import MyReservists from './components/MyReservists/MyReservists';
import './mentor.css';

export default function MentorHomePage() {
  const [language, setLanguage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [view, setView] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState('');
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questionToAnswer, setQuestionToAnswer] = useState(null);
  const [selectedReservistId, setSelectedReservistId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lang = getLanguage();
      setLanguage(lang);

      const handleLangChange = () => setLanguage(getLanguage());
      window.addEventListener('languageChanged', handleLangChange);

      const token = localStorage.getItem('idToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const role = decoded['custom:role'];
          const expectedRole = 'mentor';
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

          setFullName(decoded.name);
          setIdNumber(decoded['custom:idNumber'] || decoded.sub);
          setEmail(decoded.email);
        } catch (err) {
          console.error('Failed to decode token:', err);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }

      return () => window.removeEventListener('languageChanged', handleLangChange);
    }
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
        if (language) setToast({ message: t('errorLoadingForm', language), type: 'error' });
      }
    };

    fetchUserForm();
  }, [idNumber, language]);

  const handleNavigation = (newView) => setView(newView);

  const navItems = useMemo(() => {
    if (!language) return [];
    return [
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
        labelHe: t('jobs', language),
        labelEn: t('jobs', language),
        path: '#vallJobs',
        onClick: () => handleNavigation('allJobs')
      },
      {
        labelHe: t('events', language),
        labelEn: t('events', language),
        path: '#events',
        onClick: () => handleNavigation('events')
      },
      {
        labelHe: t('interviewQuesTitle', language),
        labelEn: t('interviewQuesTitle', language),
        path: '#interview-prep',
        onClick: () => handleNavigation('interview-ques')
      },
      {
        labelHe: t('findReservist', language),
        labelEn: t('findReservist', language),
        path: '#find-reservist',
        onClick: () => handleNavigation('find-reservist')
      },
      {
        labelHe: t('myReservists', language),
        labelEn: t('myReservists', language),
        path: '#myReservists',
        onClick: () => handleNavigation('myReservists')
      },
    ];
  }, [language]);

  if (!language || !idNumber) {
    return <p style={{ padding: '2rem' }}>{t('loading', language || 'he')}</p>;
  }

  const handleManageReservist = (idNumber) => {
    setSelectedReservistId(idNumber);
    setView('manage-reservist');
  };

  return (
    <div className="mentor-container">
      <SideBar navItems={navItems} />

      <main className="mentor-main">

        {view === 'dashboard' && (
          <>
            <h1 className="mentor-welcome">
              {t('mentorWelcomeTitle', language).replace('{{name}}', fullName)}
            </h1>
            <EventsPage idNumber={idNumber} fullName={fullName} email={email} />
          </>
        )}

        {view === 'allJobs' && (
          <div>
            <div className="mentor-button-group">
              <Button text={t('myJobsList', language)} onClick={() => handleNavigation('myJobsList')} />
              <Button text={t('postNewJob', language)} onClick={() => handleNavigation('post-job')} />
            </div>
            <ViewAllJobs />
          </div>
        )}

        {view === 'form' && userData && (
          <div className='EditMentorForm'>
            <EditMentorForm
              userData={userData}
              onSave={(updated) => setUserData(updated)}
              onBack={() => setView('dashboard')}
              onClose={() => setView('dashboard')}
            />
          </div>
        )}

        {view === 'post-job' && (
          <div>
            <div className="mentor-button-group">
              <Button text={t('myJobsList', language)} onClick={() => handleNavigation('myJobsList')} />
              <Button text={t('jobs', language)} onClick={() => handleNavigation('allJobs')} />
            </div>
            <PostNewJob
              publisherId={`${email}#${idNumber}`}
              publisherType="mentor"
              onSave={() => {
                setToast({ message: t('jobPostedSuccess', language), type: 'success' });
                setView('dashboard');
              }}
            />
          </div>
        )}
        
        {view === 'myJobsList' && (
          <div>
            <div className="mentor-button-group">
                <Button text={t('jobs', language)} onClick={() => handleNavigation('allJobs')} />
                <Button text={t('postNewJob', language)} onClick={() => handleNavigation('post-job')} />
              </div>
            <MyJobsList
              publisherId={`${email}#${idNumber}`}
              onEdit={(job) => {
                setSelectedJobForEdit(job);
                setView('edit-job');
              }}
            />
          </div>
        )}

        {view === 'my-questions' && (
          <div>
            <div className="mentor-button-group">
              <Button text={t('AddNewQues', language)} onClick={() => handleNavigation('AddNewQues')} />
              <Button text={t('interviewQues', language)} onClick={() => handleNavigation('interview-ques')} />
            </div>
            <MyQuestions
              fullName={fullName}
              idNumber={idNumber}
              onEdit={(question) => {
                setQuestionToEdit(question);
                setView('edit-question');
              }}
              onAnswer={(question) => {
                setQuestionToAnswer(question);
                setView('post-answer');
              }}
            />
          </div>
        )}

        {view === 'edit-question' && questionToEdit && (
          <div>
            <div className="mentor-button-group">
              <Button text={t('AddNewQues', language)} onClick={() => handleNavigation('AddNewQues')} />
              <Button text={t('interviewQues', language)} onClick={() => handleNavigation('interview-ques')} />
              <Button text={t('myQuestions', language)} onClick={() => handleNavigation('my-questions')} />
            </div>
            <EditQuestion
              question={questionToEdit}
              onClose={() => {
                setQuestionToEdit(null);
                setView('my-questions');
              }}
              onSave={() => {
                setQuestionToEdit(null);
                setView('my-questions');
              }}
            />
          </div>
        )}

        {view === 'post-answer' && questionToAnswer && (
          <div>
            <div className="mentor-button-group">
              <Button text={t('AddNewQues', language)} onClick={() => handleNavigation('AddNewQues')} />
              <Button text={t('interviewQues', language)} onClick={() => handleNavigation('interview-ques')} />
              <Button text={t('myQuestions', language)} onClick={() => handleNavigation('my-questions')} />
            </div>
            <PostAnswer
              questionId={questionToAnswer.questionId}
              fullName={fullName}
              idNumber={idNumber}
              onSuccess={() => {
                setToast({ message: t('answerPosted', language), type: 'success' });
                setView('dashboard');
              }}
              onClose={() => setView('interview-ques')}
            />
          </div>
        )}

        {view === 'edit-job' && selectedJobForEdit && (
          <EditMentorJob
            job={selectedJobForEdit}
            onClose={() => {
              setSelectedJobForEdit(null);
              setView('myJobsList');
            }}
            onSave={(updated) => {
              setSelectedJobForEdit(null);
              setToast({ message: t('jobUpdatedSuccess', language), type: 'success' });
              setView('myJobsList');
            }}
          />
        )}

        {view === 'events' && (
          <div className="mentor-main-view">
            <EventsPage idNumber={idNumber} fullName={fullName} email={email} />
          </div>
        )}

        {view === 'interview-ques' && 
          <div>
            <div className='mentor-button-group'>
              <Button text={t('AddNewQues', language)} onClick={() => handleNavigation('AddNewQues')} />
              <Button text={t('myQuestions', language)} onClick={() => handleNavigation('my-questions')} />
            </div>
            <InterviewPrep
              onAnswer={(question) => {
                setQuestionToAnswer(question);
                setView('post-answer');
              }}
            />
          </div>
        }

        {view === 'AddNewQues' && (
          <div>
            <div className='mentor-button-group'>
              <Button text={t('interviewQues', language)} onClick={() => handleNavigation('interview-ques')} />
              <Button text={t('myQuestions', language)} onClick={() => handleNavigation('my-questions')} />
            </div>
            <AddNewQues
              fullName={fullName}
              idNumber={idNumber}
              onSuccess={() => {
                setToast({ message: t('questionAdded', language), type: 'success' });
                setView('interview-ques');
              }}
            />
          </div>
        )}

        {view === 'myReservists' && (
          <MyReservists onManageReservist={handleManageReservist} />
        )}

        {view === 'manage-reservist' && selectedReservistId && (
          <div>
            <h2>{t('reservistManagementTitle', language)}</h2>
            {/* כאן תוכל להוסיף קומפוננטה אמיתית לניהול מילואימניק */}
            <p>{t('managingReservist', language)}: {selectedReservistId}</p>
            <Button text={t('back', language)} onClick={() => setView('myReservists')} />
          </div>
        )}


        {view === 'find-reservist' && (
          <div className='mentor-main-view'>
            <FindReservist mentorId={idNumber} onBack={() => setView('dashboard')} />
          </div>
        )}

        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
  );
}
