'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar';
import Events from '@/app/components/events/ViewAllEvents';
import EditReservistForm from '../components/EditReservistForm';
import ViewJobs from '@/app/components/jobs/ViewAllJobs';
import JobDetailsModal from '@/app/components/jobs/viewJob';
import { getLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { t } from '@/app/utils/loadTranslations';
import InterviewQues  from '@/app/components/interviewQestions/QuestionsList';
import MentorringProscess from '../components/mentorringProscess';
import '../reservist.css';

export default function ReservistHomePage() {
  const [language, setLanguage] = useState(null);
  const [idNumber, setIdNumber] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);
  const [mentorId, setMentorID] = useState(null);
  const [mentorName, setMentorName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentLang = getLanguage();
    if (currentLang) setLanguage(currentLang);
    const handleLangChange = () => {
      const updatedLang = getLanguage();
      setLanguage(updatedLang || 'he');
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded['custom:role'];
        const expectedRole = 'reservist';
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

        setIdNumber(decoded['custom:idNumber'] || decoded.sub);
        setEmail(decoded.email);
        setUserType(role);
      } catch (err) {
        console.error('Failed to decode token:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!userType || !idNumber) return;

    const fetchUserForm = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/get-user-form?userType=${userType}&idNumber=${idNumber}`
        );
        const data = await res.json();
        setUserData(data);
        setFullName(data.fullName);
        setMentorID(data.mentorId || null)
        if (data.mentorId) {
          const mentorIdNumber = data.mentorId.split('#')[1]; // extract ID number
          if (mentorIdNumber) {
            try {
              const mentorRes = await fetch(
                `http://localhost:5000/api/get-user-form?userType=mentor&idNumber=${mentorIdNumber}`
              );
              const mentorData = await mentorRes.json();
              setMentorName(mentorData.fullName || '');
            } catch (err) {
              console.error('Failed to load mentor name:', err);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load user form:', err);
      }
    };

    fetchUserForm();
  }, [userType, idNumber]);

  const navItems = [
    { 
      labelHe: t('navDashboard', 'he'), 
      labelEn: t('navDashboard', 'en'), 
      path: '#dashboard', 
      onClick: () => setView('dashboard') 
    },
    { labelHe: t('navPersonalDetails', 'he'), 
      labelEn: t('navPersonalDetails', 'en'), 
      path: '#form', 
      onClick: () => setView('form') 
    },
    { labelHe: t('events', 'he'), 
      labelEn: t('events', 'en'), 
      path: '#events-section', 
      onClick: () => setView('events') 
    },
    { 
      labelHe: t('jobs', 'he'), 
      labelEn: t('jobs', 'en'), 
      path: '#jobs-section', 
      onClick: () => setView('jobs') 
    },
    { 
      labelHe: t('interviewQues', 'he'), 
      labelEn: t('interviewQues', 'en'), 
      path: '#interviewQues',
      onClick: () => setView('interviewQues') 
    },
    { 
      labelHe: t('mentorringProscess', 'he'), 
      labelEn: t('mentorringProscess', 'en'), 
      path: '#mentorringProscess',
      onClick: () => setView('mentorringProscess') 
    },

  ];

  if (!language) return null;

  return (
    <div className="reservist-container">
      <SideBar navItems={navItems} />

      <main className="reservist-main">
        <h1 className="reservist-welcome">
          {`${t('welcome', language)}${fullName ? ', ' + fullName : (language === 'he' ? '!' : ' Reservist!')}`}
        </h1>

        {view === 'dashboard' && (
          <>
            <h2 className="reservist-section-title text-center mb-6" dir={language === 'he' ? 'rtl' : 'ltr'}></h2>
            <div className="reservist-columns">
              <div>
                <ViewJobs
                  limit={4}
                  onCardClick={(job) => {
                    setSelectedJob(job);
                    setView('view-job');
                  }}
                />
              </div>

              <div>
                <Events limit={4} idNumber={idNumber} fullName={fullName} email={email} />
              </div>
            </div>
          </>
        )}

        {view === 'form' && userData && Object.keys(userData).length > 0 && (
          <div className='EditreservistForm'>
            <EditReservistForm
              userData={userData}
              mentorId={mentorId}
              mentorName={mentorName}
              onSave={(updated) => {
                setUserData(updated);
                setFullName(updated.fullName);
              }}
              onBack={() => setView('dashboard')}
            />
          </div>
        )}

        {view === 'events' && idNumber && fullName && email && (
          <Events idNumber={idNumber} fullName={fullName} email={email} />
        )}

        {view === 'jobs' && (
          <div className="reservist-jobs-section">
            <ViewJobs
              onCardClick={(job) => {
                setSelectedJob(job);
                setView('view-job');
              }}
            />
          </div>
        )}

        {view === 'view-job' && selectedJob && (
          <div className="modal-overlay">
            <div className="modal-box">
            <JobDetailsModal
              job={selectedJob}
              onClose={() => {
                setSelectedJob(null);
                setView('jobs');
              }}
            />
            </div>
          </div>
        )}
        {view === 'interviewQues' && <InterviewQues />}
        
        {view === 'mentorringProscess' &&
          <MentorringProscess mentorId={mentorId} reservistId={idNumber}/>
        }
      </main>
    </div>
  );
}
