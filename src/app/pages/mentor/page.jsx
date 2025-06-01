'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { t } from '@/app/utils/loadTranslations';
import EditMentorForm from './components/EditMentorForm';
import PostJob from '../jobs/PostJob';
import MyJobsList from './components/jobs/MyJobsList';
import EditMentorJob from './components/jobs/editJob';
import EventsPage from '@/app/pages/events/page';
import InterviewPrep from '../interviewPrep/page';
import FindReservist from './components/FindReservist';
import ViewAllJobs from '../jobs/ViewAllJobs';
import Button from '@/app/components/Button';
// import AlertMessage from '@/app/components/notifications/AlertMessage';
// import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';
import ToastMessage from '@/app/components/notifications/ToastMessage';

import './mentor.css';

export default function MentorHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [view, setView] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState('');
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [toast, setToast] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());
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
        setToast({ message: t('errorLoadingForm', language), type: 'error' });
      }
    };

    fetchUserForm();
  }, [idNumber, language]);

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
      labelHe: t('jobs', language),
      labelEn: t('jobs', language),
      path: '#vallJobs',
      onClick: () => handleNavigation('allJobs')
    },
    // {
    //   labelHe: t('navPostJob', language),
    //   labelEn: t('navPostJob', language),
    //   path: '#post-job',
    //   onClick: () => handleNavigation('post-job')
    // },
    // {
    //   labelHe: t('myJobsList', language),
    //   labelEn: t('myJobsList', language),
    //   path: '#my-jobs',
    //   onClick: () => handleNavigation('myJobsList')
    // },
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

    // {
    //   labelHe: t('navMyReservists', language),
    //   labelEn: t('navMyReservists', language),
    //   path: '#my-reservists',
    //   onClick: () => handleNavigation('my-reservists')
    // },
    // {
    //   labelHe: t('navRequests', language),
    //   labelEn: t('navRequests', language),
    //   path: '#requests',
    //   onClick: () => handleNavigation('requests')
    // },
    // {
    //   labelHe: t('navJobMatches', language),
    //   labelEn: t('navJobMatches', language),
    //   path: '#job-matches',
    //   onClick: () => handleNavigation('job-matches')
    // },
    // {
    //   labelHe: t('navFeedback', language),
    //   labelEn: t('navFeedback', language),
    //   path: '#feedback',
    //   onClick: () => handleNavigation('feedback')
    // },
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
            <EventsPage
              idNumber={idNumber}
              fullName={fullName}
              email={email}
            />
          </>
        )}

        {view === 'allJobs' && (
          <>
            <div className="flex gap-2 mt-4 justify-start" dir="rtl">
              <Button
                text={t('myJobsList', language)}
                onClick={() => {
                  handleNavigation('myJobsList')
                }}
              />
              <Button
                text={t('postJob', language)}
                // size="sm"
                onClick={() => {
                  handleNavigation('post-job')
                }}
              />
            </div>
            <ViewAllJobs/>
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
          <PostJob
            publisherId={idNumber}
            publisherType="mentor"
            onSuccess={() => {
              setToast({ message: t('jobPostedSuccess', language), type: 'success' });
              setView('dashboard');
            }}
          />
        )}

        {view === 'myJobsList' && (
          <MyJobsList
            publisherId={idNumber}
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
          <EventsPage
            idNumber={idNumber}
            fullName={fullName}
            email={email}
          />
        )}

        {view === 'interview-prep' && (
          <InterviewPrep />
        )}

        {view === 'find-reservist' && (
          <FindReservist
            mentorId={idNumber}
            onBack={() => setView('dashboard')}
          />
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
