'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/app/components/SideBar/SideBar';
import Events from '@/app/components/events/ViewAllEvents';
import EditReservistForm from './components/EditReservistForm';
import ViewJobs from '@/app/components/jobs/ViewAllJobs';
import { useRouter } from 'next/navigation';
import { t } from '@/app/utils/loadTranslations';
import InterviewQues  from '@/app/components/interviewQestions/QuestionsList';
import MentorringProscess from './components/mentorringProscess';
import InterviewPracticePanel from "@/app/components/interviewWithAi/InterviewPracticePanel";
import './reservist.css';
import ChangePassword from '@/app/login/ChangePassword/ChangePassword';
import { Brain } from 'lucide-react';
import { useRoleGuard } from "@/app/utils/isExpectedRoll/useRoleGuard";
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ReservistHomePage() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [mentorId, setMentorID] = useState(null);
  const [mentorName, setMentorName] = useState('');
  const language = useLanguage();
  const router = useRouter();
  useRoleGuard("reservist");

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
    if (!userType || !idNumber) return;

    const fetchUserForm = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/get-user-form?userType=${userType}&idNumber=${idNumber}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` }
        });

        const data = await res.json();
        setUserData(data);
        setFullName(data.fullName);
        setMentorID(data.mentorId || null)
        if (data.mentorId) {
          const mentorIdNumber = data.mentorId.split('#')[1]; 
          if (mentorIdNumber) {
            try {
              const mentorUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/get-user-form?userType=mentor&idNumber=${mentorIdNumber}` ;
              const mentorRes = await fetch(mentorUrl, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` }
              });

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
      label: t('navDashboard', language), 
      path: '#dashboard', 
      onClick: () => setView('dashboard') 
    },
    {
      label: t('userSettings', language),
      path: '#userSettings',
      onClick: () => setView('userSettings')
    },
    { 
      label: t('events', language), 
      path: '#events-section', 
      onClick: () => setView('events') 
    },
    { 
      label: t('jobs', language), 
      path: '#jobs-section', 
      onClick: () => setView('jobs') 
    },
    { 
      label: t('interviewQues', language), 
      path: '#interviewQues',
      onClick: () => setView('interviewQues') 
    },
    { 
      label: t('interviewWithAi', language), 
      path: '#InterviewPracticePanel',
      icon: <Brain size={18} className="inline mr-2" />,
      onClick: () => setView('InterviewPracticePanel') 
    },
    { 
      label: t('mentorringProscess', language), 
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
              <div>
                <Events limit={4} idNumber={idNumber} fullName={fullName} email={email} />
              </div>
          </>
        )}
        {view === 'userSettings' && (
          <div>
            <EditReservistForm
              userData={userData}
              mentorId={mentorId}
              mentorName={mentorName}
              onSave={(updated) => {
                setUserData(updated);
                setFullName(updated.fullName);
              }}
              onBack={() => setView('dashboard')}
              onChangePasswordClick={() => setView('change-password')}
            />
          </div>
        )}

        {view === 'change-password' && (<ChangePassword/>)}

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

        {view === 'InterviewPracticePanel' && idNumber && fullName && email && (
          <InterviewPracticePanel userId={idNumber} email={email} language={language} role={userType} />
        )}

        {view === 'jobs' && (
          <div className="reservist-jobs-section">
            <ViewJobs />
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
