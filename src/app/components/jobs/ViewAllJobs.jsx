// components/ViewAllJobs.jsx
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ViewJob from './viewJob';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
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
    <>
      <GenericCardSection
        titleKey="jobList"
        filters={[
          <input
            key="location"
            name="location"
            placeholder={t('filterByLocation', language)}
            value={filters.location}
            onChange={handleFilterChange}
            className="card-filter"
          />,
          <input
            key="company"
            name="company"
            placeholder={t('filterByCompany', language)}
            value={filters.company}
            onChange={handleFilterChange}
            className="card-filter"
          />
        ]}
        data={filteredJobs}
        renderCard={(job) => (
          <>
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p>{t('company', language)}: {job.company}</p>
            <p>{t('location', language)}: {job.location}</p>
          </>
        )}
        onCardClick={(job) => setSelectedJob(job)}
        emptyTextKey="noJobsFound"
      />

      {selectedJob && (
        <ViewJob
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}