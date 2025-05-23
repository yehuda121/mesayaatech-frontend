// ViewJobs.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import EditJob from './editJob';

export default function ViewJobs() {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ location: '', company: '' });
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    setUserId(localStorage.getItem('userId'));
    setUserType(localStorage.getItem('userType'));
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
    <div className="p-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold mb-4">{t('jobList', language)}</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="location"
          placeholder={t('filterByLocation', language)}
          value={filters.location}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="company"
          placeholder={t('filterByCompany', language)}
          value={filters.company}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.jobId}
            className="border rounded p-4 shadow hover:shadow-md cursor-pointer flex flex-col gap-2"
            onClick={() => setSelectedJob(job)}
          >
            <h3 className="font-bold text-blue-700 truncate">{job.title}</h3>
            <p>{t('company', language)}: {job.company}</p>
            <p>{t('location', language)}: {job.location}</p>
          </div>
        ))}
      </div>

      {selectedJob && (
        <EditJob
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={(updatedJob) => {
            setJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
            setFilteredJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}