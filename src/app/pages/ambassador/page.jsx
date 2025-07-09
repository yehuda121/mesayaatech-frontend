'use client';

import { useEffect, useState, useMemo } from 'react';
import SideBar from '@/app/components/SideBar';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import MyJobsList from '@/app/components/jobs/MyJobsList';
import EditAmbassadorJob from '@/app/components/jobs/EditJob';
import EventsPage from '@/app/components/events/ViewAllEvents';
import InterviewPrep from '@/app/components/interviewQestions/QuestionsList';
import ViewAllJobs from '@/app/components/jobs/ViewAllJobs';
import Button from '@/app/components/Button/Button';
import ToastMessage from '@/app/components/notifications/ToastMessage';
import MyQuestions from '@/app/components/interviewQestions/MyQuestions';
import EditAmbassadorForm from './EditAmbassadorForm';
import './ambassador.css';
import ChangePassword from '@/app/login/ChangePassword/ChangePassword';
import { useRoleGuard } from "@/app/utils/isExpectedRoll/useRoleGuard";
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function AmbassadorHomePage() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [view, setView] = useState('allJobs');
  const [userData, setUserData] = useState(null);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const language = useLanguage();
  const router = useRouter();
  useRoleGuard("ambassador");

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/get-user-form?userType=ambassador&idNumber=${idNumber}`);
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
    if (!language) return [];
    return [
      {
        labelHe: t('navPersonalDetails', language),
        labelEn: t('navPersonalDetails', language),
        path: '#editForm',
        onClick: () => handleNavigation('editForm')
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
        labelHe: t('changePassword', 'he'),
        labelEn: t('changePassword', 'en'),
        path: '#changePassword',
        onClick: () => handleNavigation('change-password')
      },
    ];
  }, [language]);

  if (!language || !idNumber) {
    return <p style={{ padding: '2rem' }}>{t('loading', language || 'he')}</p>;
  }

  return (
    <div className="ambassador-container">
      <SideBar navItems={navItems} />

      <main className="ambassador-main">

        {view === 'allJobs' && (
          <div>
            <div className="ambassador-button-group">
              <Button text={t('myJobsList', language)} onClick={() => handleNavigation('myJobsList')} />
            </div>
            <ViewAllJobs />
          </div>
        )}

        {view === 'editForm' && userData && (
          <div>
            <EditAmbassadorForm
              userData={userData}
              onSave={(updated) => setUserData(updated)}
              onBack={() => setView('allJobs')}
              onClose={() => setView('allJobs')}
            />
          </div>
        )}
        
        {view === 'myJobsList' && (
          <div className='ambassador-main-view'>
            <MyJobsList
              publisherId={`${email}#${idNumber}`}
              userType="ambassador"
              onEdit={(job) => {
                setSelectedJobForEdit(job);
                setView('edit-job');
              }}
            />
          </div>
        )}

        {view === 'change-password' && (<ChangePassword/>)}

        {view === 'my-questions' && (
          <div className='ambassador-main-view'>
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
          <EditAmbassadorJob
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
          <div className="ambassador-main-view">
            <EventsPage idNumber={idNumber} fullName={fullName} email={email} />
          </div>
        )}

        {view === 'interview-ques' && 
          <div>
            <div className='ambassador-button-group'>
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
