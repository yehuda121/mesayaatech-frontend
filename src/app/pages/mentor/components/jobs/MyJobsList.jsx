'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';

export default function MyJobsList({ publisherId, onEdit }) {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs-by-publisherID/by-publisher?publisherId=${publisherId}&idType=mentor`);
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (publisherId) {
      fetchJobs();
    }
  }, [publisherId]);

    const handleDelete = async (jobId) => {
    if (!confirm(t('confirmDelete', language))) return;

    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    try {
        const res = await fetch('http://localhost:5000/api/delete-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId, userType })
        });

        if (res.ok) {
        alert(t('jobDeleted', language));
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
        } else {
        alert(t('deleteFailed', language));
        }
    } catch (err) {
        console.error('Delete failed:', err);
        alert(t('serverError', language));
    }
    };

  if (loading) {
    return <p>{t('loading', language)}...</p>;
  }

  if (!jobs.length) {
    return <p className="no-jobs-message">{t('noJobsPosted', language)}</p>;
  }

  return (
    <div  dir={language === 'he' ? 'rtl' : 'ltr'} className="mentor-jobs-list">
      <h2 className="section-title">{t('myPostedJobs', language)}</h2>
      <ul className="jobs-grid">
        {jobs.map((job) => (
          <li key={job.jobId} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>{t('company', language)}:</strong> {job.company}</p>
            <p><strong>{t('location', language)}:</strong> {job.location}</p>
            <p className="job-description">{job.description}</p>
            <div className="job-actions">
                <Button 
                    text={t('edit', language)} 
                    onClick={() => onEdit(job)} 
                />
                <Button
                    text={t('delete', language)}
                    color='red'
                    onClick={() => handleDelete(job.jobId)}
                />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
