// // ViewJobs.jsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import EditJob from './editJob';

// export default function ViewJobs() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [filters, setFilters] = useState({ location: '', company: '' });
//   const [userId, setUserId] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [selectedJob, setSelectedJob] = useState(null);

//   useEffect(() => {
//     setLanguage(getLanguage());
//     setUserId(localStorage.getItem('userId'));
//     setUserType(localStorage.getItem('userType'));
//     fetchJobs();

//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/import-jobs');
//       const data = await res.json();
//       setJobs(data);
//       setFilteredJobs(data);
//     } catch (error) {
//       console.error('Failed to fetch jobs:', error);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     const newFilters = { ...filters, [name]: value };
//     setFilters(newFilters);
//     const filtered = jobs.filter((job) => {
//       const locationMatch = !newFilters.location || job.location?.includes(newFilters.location);
//       const companyMatch = !newFilters.company || job.company?.includes(newFilters.company);
//       return locationMatch && companyMatch;
//     });
//     setFilteredJobs(filtered);
//   };

//   return (
//     <div className="view-jobs-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
//         <h2 className="view-jobs-title">{t('jobList', language)}</h2>

//         <div className="job-filters">
//         <input
//             type="text"
//             name="location"
//             placeholder={t('filterByLocation', language)}
//             value={filters.location}
//             onChange={handleFilterChange}
//         />
//         <input
//             type="text"
//             name="company"
//             placeholder={t('filterByCompany', language)}
//             value={filters.company}
//             onChange={handleFilterChange}
//         />
//         </div>

//         <div className="job-grid">
//         {filteredJobs.map((job) => (
//             <div
//             key={job.jobId}
//             className="job-card"
//             onClick={() => setSelectedJob(job)}
//             >
//             <h3 className="job-title">{job.title}</h3>
//             <p>{t('company', language)}: {job.company}</p>
//             <p>{t('location', language)}: {job.location}</p>
//             </div>
//         ))}
//         </div>

//         {selectedJob && (
//         <EditJob
//             job={selectedJob}
//             onClose={() => setSelectedJob(null)}
//             onSave={(updatedJob) => {
//             setJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
//             setFilteredJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
//             setSelectedJob(null);
//             }}
//         />
//         )}
//     </div>
//     );

// }
// components/jobs/ViewJobs.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import EditJob from './editJob';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';

export default function ViewJobs() {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ location: '', company: '' });
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

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


  // handle deleting the job
  const handleDelete = async (jobId) => {
    if (!confirm(t('confirmDeleteJob', language))) return;
    try {
      const res = await fetch('http://localhost:5000/api/delete-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId, userType })
      });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.jobId !== jobId));
        setFilteredJobs(prev => prev.filter(j => j.jobId !== jobId));
      } else {
        alert(t('deleteFailed', language));
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(t('serverError', language));
    }
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
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={(e) => { e.stopPropagation(); setEditingJob(job); }}>
                {t('edit', language)}
              </Button>
              <Button size="sm" color="red" onClick={(e) => { e.stopPropagation(); handleDelete(job.jobId); }}>
                {t('delete', language)}
              </Button>
            </div>
          </>
        )}
        onCardClick={() => {}}
        emptyTextKey="noJobsFound"
      />

      {editingJob && (
        <EditJob
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={(updatedJob) => {
            setJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
            setFilteredJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
            setEditingJob(null);
          }}
        />
      )}
    </>
  );
} 
