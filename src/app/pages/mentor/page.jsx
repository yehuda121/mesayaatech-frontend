'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { t } from '@/app/utils/loadTranslations';
import EditMentorForm from './components/EditMentorForm';
import PostJob from './components/jobs/PostJob';
import MyJobsList from './components/jobs/MyJobsList';
import EditMentorJob from './components/jobs/editJob';
import EventsPage from '@/app/pages/events/page';

import './mentor.css';

export default function MentorHomePage() {
  const [language, setLanguage] = useState(getLanguage());
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [view, setView] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [email, setEmail] = useState('');

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
        setEmail(decoded.email);
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
      labelHe: t('myJobsList', language),
      labelEn: t('myJobsList', language),
      path: '#my-jobs',
      onClick: () => handleNavigation('myJobsList')
    },
    {
      labelHe: t('events', language),
      labelEn: t('events', language),
      path: '#events',
      onClick: () => handleNavigation('events')
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
    // {
    //   labelHe: t('navInterviewPrep', language),
    //   labelEn: t('navInterviewPrep', language),
    //   path: '#interview-prep',
    //   onClick: () => handleNavigation('interview-prep')
    // }
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

        {view === 'feedback' && <FeedbackList />}
        {view === 'interview-prep' && <InterviewPrep />}
      </main>
    </div>
  );
}
