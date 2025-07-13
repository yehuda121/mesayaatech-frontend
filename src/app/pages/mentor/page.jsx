'use client';

import { useEffect, useState, useMemo } from 'react';
import SideBar from '@/app/components/SideBar';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import EditMentorForm from './components/EditMentorForm';
import MyJobsList from '../../components/jobs/MyJobsList';
import EditMentorJob from '@/app/components/jobs/EditJob';
import EventsPage from '@/app/components/events/ViewAllEvents';
import QuestionsList from '@/app/components/interviewQestions/QuestionsList';
import FindReservist from './components/FindReservist';
import ViewAllJobs from '@/app/components/jobs/ViewAllJobs';
import Button from '@/app/components/Button/Button';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import MyQuestions from '@/app/components/interviewQestions/MyQuestions';
import MyReservists from './components/MyReservists/MyReservists';
import MentorshipProgress from './components/MyReservists/MentorshipProgress';
import './mentor.css';
import ChangePassword from '@/app/login/ChangePassword/ChangePassword';
import { Brain } from 'lucide-react';
import { useRoleGuard } from "@/app/utils/isExpectedRoll/useRoleGuard";
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function MentorHomePage() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [view, setView] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questionToAnswer, setQuestionToAnswer] = useState(null);
  const [selectedReservistId, setSelectedReservistId] = useState(null);
  const language = useLanguage();
  const router = useRouter();
  useRoleGuard("mentor");

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
    if (!idNumber) return;

    const fetchUserForm = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/get-user-form?userType=mentor&idNumber=${idNumber}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(t('serverError', language), err);
        if (language) setToast({ message: t('errorLoadingForm', language), type: 'error' });
      }
    };

    fetchUserForm();
  }, [idNumber, language]);

  const handleNavigation = (newView) => setView(newView);

  const navItems = useMemo(() => {
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
        path: '#all-events',
        onClick: () => handleNavigation('all-events')
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
        icon: <Brain size={18} className="inline mr-2" />,
        path: '#find-reservist',
        onClick: () => handleNavigation('find-reservist')
      },
      {
        labelHe: t('myReservists', language),
        labelEn: t('myReservists', language),
        path: '#myReservists',
        onClick: () => handleNavigation('myReservists')
      },
      {
        labelHe: t('changePassword', 'he'),
        labelEn: t('changePassword', 'en'),
        path: '#changePassword',
        onClick: () => handleNavigation('change-password')
      },
    ];
  }, [language]);

  const handleManageReservist = (idNumber) => {
    setSelectedReservistId(idNumber);
    setView('manage-reservist');
  };

  if (!language || !idNumber) {
    return <p style={{ padding: '2rem' }}>{t('loading', language || 'he')}</p>;
  }

  return (
    <div className="mentor-container">
      <SideBar navItems={navItems} />

      <main className="mentor-main">
        {view === 'dashboard' && (
          <>
            <h1 className="mentor-welcome">
              {t('mentorWelcomeTitle', language).replace('{{name}}', userData?.fullName || '')}
            </h1>
            
            <MyReservists onManageReservist={handleManageReservist} />
          </>
        )}

        {view === 'allJobs' && (
          <div>
            <div className="mentor-button-group">
              <Button text={t('myJobsList', language)} onClick={() => handleNavigation('myJobsList')} />
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
              mentorId={idNumber}
            />
          </div>
        )}
        
        {view === 'myJobsList' && (
          <div className="mentor-main-view">
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
          <div className="mentor-main-view">
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

        {view === 'all-events' && (
          <div className="mentor-main-view">
            <EventsPage idNumber={idNumber} fullName={fullName} email={email} />
          </div>
        )}

        {view === 'interview-ques' && 
          <div>
            <div className='mentor-button-group'>
              <Button text={t('myQuestions', language)} onClick={() => handleNavigation('my-questions')} />
            </div>
            <QuestionsList
              onAnswer={(question) => {
                setQuestionToAnswer(question);
                setView('post-answer');
              }}
            />
          </div>
        }

        {view === 'myReservists' && (
          <div className='mt-10'>
            <MyReservists onManageReservist={handleManageReservist} />
          </div>
        )}

        {view === 'manage-reservist' && selectedReservistId && (
          <div>
            <MentorshipProgress mentorId={idNumber} reservistId={selectedReservistId} />
          </div>
        )}


        {view === 'find-reservist' && (
          <div className='mentor-main-view'>
            <FindReservist mentorId={idNumber} onBack={() => setView('dashboard')} />
          </div>
        )}
        
        {view === 'change-password' && (<ChangePassword/>)}

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
