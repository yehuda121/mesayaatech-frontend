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
import InterviewPrep from '../interviewPrep/page';
import FindReservist from './components/FindReservist';
import ViewAllJobs from '@/app/components/jobs/ViewAllJobs';
import Button from '@/app/components/Button';
import ToastMessage from '@/app/components/notifications/ToastMessage';

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
        labelHe: t('navInterviewPrep', language),
        labelEn: t('navInterviewPrep', language),
        path: '#interview-prep',
        onClick: () => handleNavigation('interview-prep')
      },
      {
        labelHe: t('findReservist', language),
        labelEn: t('findReservist', language),
        path: '#find-reservist',
        onClick: () => handleNavigation('find-reservist')
      },
    ];
  }, [language]);

  if (!language || !idNumber) return null;

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
          <>
            <div className="flex gap-2 mt-3 mb-3 justify-start" dir="rtl">
              <Button text={t('myJobsList', language)} onClick={() => handleNavigation('myJobsList')} />
              <Button text={t('postNewJob', language)} onClick={() => handleNavigation('post-job')} />
            </div>
            <ViewAllJobs />
          </>
        )}

        {view === 'form' && userData && (
          <EditMentorForm
            userData={userData}
            onSave={(updated) => setUserData(updated)}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'post-job' && (
          <PostNewJob
            publisherId={`${email}#${idNumber}`}
            publisherType="mentor"
            onSave={() => {
              setToast({ message: t('jobPostedSuccess', language), type: 'success' });
              setView('dashboard');
            }}
            onClose={() => setView('dashboard')}
          />
        )}
        
        {view === 'myJobsList' && (
          <MyJobsList
            publisherId={`${email}#${idNumber}`}
            onEdit={(job) => {
              setSelectedJobForEdit(job);
              setView('edit-job');
            }}
          />
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
          <EventsPage idNumber={idNumber} fullName={fullName} email={email} />
        )}

        {view === 'interview-prep' && <InterviewPrep />}

        {view === 'find-reservist' && (
          <FindReservist mentorId={idNumber} onBack={() => setView('dashboard')} />
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
