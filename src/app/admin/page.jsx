// AdminPage.jsx - add job as main view like event creation
'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../language';
import SideBar from '../components/SideBar';
import UsersTable from './components/users/usersTable';
import CreateEvent from './components/events/CreateEvent';
import ViewEvents from './components/events/ViewEvents';
import EditEvents from './components/events/EditEvents';
import ViewJobs from './components/jobs/viewJobs';
import EditJob from './components/jobs/editJob';
import AddJob from './components/jobs/addNewJob';
import { t } from '@/app/utils/loadTranslations';
import './admin.css';

export default function AdminPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [view, setView] = useState('');
  const [eventToEdit, setEventToEdit] = useState(null);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const navItems = [
    {
      labelHe: t('viewUsers', 'he'),
      labelEn: t('viewUsers', 'en'),
      path: '#view-users',
      onClick: () => setView('users')
    },
    {
      labelHe: t('createEvent', 'he'),
      labelEn: t('createEvent', 'en'),
      path: '#create-event',
      onClick: () => setView('create-event')
    },
    {
      labelHe: t('viewEvents', 'he'),
      labelEn: t('viewEvents', 'en'),
      path: '#view-events',
      onClick: () => setView('view-events')
    },
    {
      labelHe: t('manageJobs', 'he'),
      labelEn: t('manageJobs', 'en'),
      path: '#view-jobs',
      onClick: () => setView('view-jobs')
    },
    {
      labelHe: t('addJob', 'he'),
      labelEn: t('addJob', 'en'),
      path: '#add-job',
      onClick: () => setView('add-job')
    }
  ];

  return (
    <div>
      <SideBar navItems={navItems} />
      <div className="admin-container">
        <main className="admin-main">
          {view === 'create-event' && <CreateEvent />}
          {view === 'view-events' && (
            <ViewEvents
              events={events}
              setEvents={setEvents}
              onEdit={(ev) => setEventToEdit(ev)}
            />
          )}
          {view === 'view-jobs' && (
            <ViewJobs
              jobs={jobs}
              setJobs={setJobs}
              onEdit={(job) => setSelectedJob(job)}
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