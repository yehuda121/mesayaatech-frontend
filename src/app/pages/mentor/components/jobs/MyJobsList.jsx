'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';

export default function MyJobsList({ publisherId, onEdit }) {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ company: '', location: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const encodedPublisherId = encodeURIComponent(publisherId);
        const res = await fetch(
          `http://localhost:5000/api/jobs-by-publisherID/by-publisher?publisherId=${encodedPublisherId}&idType=mentor`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setJobs(data);
          setFilteredJobs(data);
        } else {
          // console.error("Expected array but got:", data);
          setJobs([]);
          setFilteredJobs([]);
          setToast({
            message: t('jobsLoadError', language),
            type: 'error'
          });
        }
      } catch (err) {
        // console.error('Failed to fetch jobs:', err);
        setToast({
          message: t('jobsServerError', language),
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (publisherId) {
      fetchJobs();
    } else {
      setToast({
        message: t('publisherIdMissing', language),
        type: 'warning'
      });
    }
  }, [publisherId, language]);


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
        setFilteredJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      } else {
        alert(t('deleteFailed', language));
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(t('serverError', language));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    const filtered = jobs.filter((job) => {
      const companyMatch = !newFilters.company || job?.company?.includes(newFilters.company);
      const locationMatch = !newFilters.location || job?.location?.includes(newFilters.location);
      const dateMatch = !newFilters.date || job?.postedAt?.startsWith(newFilters.date);
      return companyMatch && locationMatch && dateMatch;
    });
    setFilteredJobs(filtered);
  };

  if (loading) {
    return <p>{t('loading', language)}...</p>;
  }

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="mentor-jobs-list">
      <GenericCardSection
        titleKey="myPostedJobs"
        filters={[
          <input
            key="company"
            name="company"
            placeholder={t('filterByCompany', language)}
            value={filters.company}
            onChange={handleFilterChange}
            className="card-filter"
          />,
          <input
            key="location"
            name="location"
            placeholder={t('filterByLocation', language)}
            value={filters.location}
            onChange={handleFilterChange}
            className="card-filter"
          />,
          <input
            key="date"
            name="date"
            placeholder={t('filterByDate', language)}
            value={filters.date}
            onChange={handleFilterChange}
            className="card-filter"
          />
        ]}
        data={filteredJobs}
        renderCard={(job) => (
          <div className='text-start'>
            <h3 className="font-bold text-lg">{job.company || t('noCompany', language)}</h3>
            {job.role && <p><strong>{t('role', language)}:</strong> {job.role}</p>}
            {job.location && <p><strong>{t('location', language)}:</strong> {job.location}</p>}
            {job.minExperience && <p><strong>{t('minExperience', language)}:</strong> {job.minExperience}</p>}
            {job.requirements && <p><strong>{t('requirements', language)}:</strong> {job.requirements}</p>}
            {job.advantages && <p><strong>{t('advantages', language)}:</strong> {job.advantages}</p>}
            {job.description && <p className="job-description">{job.description}</p>}
            <div className="job-actions">
              <Button text={t('edit', language)} onClick={() => onEdit(job)} />
              <Button text={t('delete', language)} color='red' onClick={() => handleDelete(job.jobId)} />
            </div>
          </div>
        )}
        onCardClick={() => {}}
        emptyTextKey="noJobsPosted"
      />
      {toast && (
        <AlertMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
