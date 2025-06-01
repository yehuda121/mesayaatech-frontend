'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ViewJob from './viewJob';
import './jobs.css';

export default function ViewAllJobs() {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ location: '', company: '' });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    fetchJobs();
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/import-jobs');
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    const filtered = jobs.filter((job) => {
      const locationMatch = !newFilters.location || job.location?.includes(newFilters.location);
      const companyMatch = !newFilters.company || job.company?.includes(newFilters.company);
      return locationMatch && companyMatch;
    });
    setFilteredJobs(filtered);
  };

  return (
    <div className="view-jobs-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="view-jobs-title">{t('jobList', language)}</h2>

      <div className="job-filters">
        <input
          type="text"
          name="location"
          placeholder={t('filterByLocation', language)}
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="company"
          placeholder={t('filterByCompany', language)}
          value={filters.company}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      <div className="job-grid">
        {filteredJobs.map((job) => (
          <div
            key={job.jobId}
            className="job-card"
            onClick={() => setSelectedJob(job)}
          >
            <h3 className="job-title">{job.title}</h3>
            <p>{t('company', language)}: {job.company}</p>
            <p>{t('location', language)}: {job.location}</p>
          </div>
        ))}
      </div>

      {selectedJob && (
        <ViewJob
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
