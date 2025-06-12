// 'use client';

// import React, { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '@/app/components/Button';
// import EditJob from '@/app/components/jobs/EditJob';
// import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
// import { Edit2, Trash2 } from 'lucide-react';

// export default function ViewJobs({handleNavigation}) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [filters, setFilters] = useState({ location: '', company: '' });
//   const [userId, setUserId] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [editingJob, setEditingJob] = useState(null);

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


//   // handle deleting the job
//   const handleDelete = async (jobId) => {
//     if (!confirm(t('confirmDeleteJob', language))) return;
//     try {
//       const res = await fetch('http://localhost:5000/api/delete-job', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ jobId, userId, userType })
//       });
//       if (res.ok) {
//         setJobs(prev => prev.filter(j => j.jobId !== jobId));
//         setFilteredJobs(prev => prev.filter(j => j.jobId !== jobId));
//       } else {
//         alert(t('deleteFailed', language));
//       }
//     } catch (err) {
//       console.error('Delete failed:', err);
//       alert(t('serverError', language));
//     }
//   };

//   return (
//     <>
//       <div className='mt-1 mb-3'>
//         <Button
//           text={t('addJob', language)}
//           onClick={() => {
//             handleNavigation('add-job')
//           }}
//         />
//       </div>
//       <GenericCardSection
//         titleKey="jobList"
//         filters={[
//           <input
//             key="location"
//             name="location"
//             placeholder={t('filterByLocation', language)}
//             value={filters.location}
//             onChange={handleFilterChange}
//             className="card-filter"
//           />,
//           <input
//             key="company"
//             name="company"
//             placeholder={t('filterByCompany', language)}
//             value={filters.company}
//             onChange={handleFilterChange}
//             className="card-filter"
//           />
//         ]}
//         data={filteredJobs}
//         renderCard={(job) => (
//           <>
//             <h3 className="font-bold text-lg">{job.title}</h3>
//             <p>{t('company', language)}: {job.company}</p>
//             <p>{t('location', language)}: {job.location}</p>
//             <div className="mt-3 flex gap-4">

//               <button title={t('edit', language)} onClick={(e) => { e.stopPropagation(); setEditingJob(job); }}>
//                 <Edit2 size={20}/>
//               </button>
//               <button title={t('delete', language)} color="red" onClick={(e) => { e.stopPropagation(); handleDelete(job.jobId); }}>
//                 <Trash2 size={20}/>
//               </button>
//             </div>
//           </>
//         )}
//         onCardClick={() => {}}
//         emptyTextKey="noJobsFound"
//       />

//       {editingJob && (
//         <EditJob
//           job={editingJob}
//           onClose={() => setEditingJob(null)}
//           onSave={(updatedJob) => {
//             setJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
//             setFilteredJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
//             setEditingJob(null);
//           }}
//         />
//       )}
//     </>
//   );
// } 
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import EditJob from '@/app/components/jobs/EditJob';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Edit2, Trash2, FileSearch, X } from 'lucide-react';
import '../../../components/jobs/filters.css';

export default function ViewJobs({ handleNavigation }) {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    location: '',
    company: '',
    field: '',
    minExperience: '',
    fromDate: '',
    toDate: ''
  });
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const fieldsOptions = [
    { value: '', labelHe: 'הכל', labelEn: 'All' },
    { value: 'הייטק', labelHe: 'הייטק', labelEn: 'Hi-Tech' },
    { value: 'פיננסים', labelHe: 'פיננסים', labelEn: 'Finance' },
    { value: 'לוגיסטיקה', labelHe: 'לוגיסטיקה', labelEn: 'Logistics' },
    { value: 'שיווק', labelHe: 'שיווק', labelEn: 'Marketing' },
    { value: 'חינוך', labelHe: 'חינוך', labelEn: 'Education' },
    { value: 'אחר', labelHe: 'אחר', labelEn: 'Other' }
  ];

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
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const text = filters.searchText.toLowerCase();
        const searchMatch = !text || (
          (job?.role || '').toLowerCase().includes(text) ||
          (job?.description || '').toLowerCase().includes(text) ||
          (job?.requirements || '').toLowerCase().includes(text) ||
          (job?.location || '').toLowerCase().includes(text) ||
          (job?.company || '').toLowerCase().includes(text) ||
          (job?.advantages || '').toLowerCase().includes(text)
        );

        const locationMatch = !filters.location || (job?.location || '').toLowerCase().includes(filters.location.toLowerCase());
        const companyMatch = !filters.company || (job?.company || '').toLowerCase().includes(filters.company.toLowerCase());
        const fieldMatch = !filters.field || (job?.field || '') === filters.field;

        let experienceMatch = true;
        if (filters.minExperience !== '') {
          const jobExp = job?.minExperience;
          const selectedExp = parseInt(filters.minExperience);
          if (jobExp !== undefined && jobExp !== null) {
            experienceMatch = jobExp <= selectedExp;
          }
        }

        const fromDateMatch = !filters.fromDate || new Date(job?.createdAt) >= new Date(filters.fromDate);
        const toDateMatch = !filters.toDate || new Date(job?.createdAt) <= new Date(filters.toDate);

        return searchMatch && locationMatch && companyMatch && fieldMatch && experienceMatch && fromDateMatch && toDateMatch;
      })
      .sort((a, b) => {
        const aExp = (a?.minExperience !== undefined && a?.minExperience !== null) ? a.minExperience : Infinity;
        const bExp = (b?.minExperience !== undefined && b?.minExperience !== null) ? b.minExperience : Infinity;
        return aExp - bExp;
      });
  }, [jobs, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearSingleField = (fieldName) => {
    setFilters((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleClearAll = () => {
    setFilters({
      searchText: '',
      location: '',
      company: '',
      field: '',
      minExperience: '',
      fromDate: '',
      toDate: ''
    });
  };

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
      } else {
        alert(t('deleteFailed', language));
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(t('serverError', language));
    }
  };

  const filtersUI = [
    <div key="searchText" className="filter-with-icon" style={{ flex: 1 }}>
      <input
        type="text"
        name="searchText"
        placeholder={t('searchByText', language)}
        value={filters.searchText}
        onChange={handleFilterChange}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
      />
    </div>,
    <Button key="advanced" onClick={() => setShowAdvanced(true)}>
      {t('advancedSearch', language)}
    </Button>,
    <Button key="clearAll" onClick={handleClearAll}>
      {t('clearFilters', language)}
    </Button>
  ];

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <div className='mt-1 mb-3'>
        <Button
          text={t('addJob', language)}
          onClick={() => {
            handleNavigation('add-job')
          }}
        />
      </div>

      <GenericCardSection
        titleKey="jobList"
        filters={filtersUI}
        data={filteredJobs}
        renderCard={(job) => (
          <>
            <h3 className="font-bold text-lg">{job?.role || t('noRole', language)}</h3>
            <p>{t('company', language)}: {job.company}</p>
            <p>{t('location', language)}: {job.location}</p>
            <div className="mt-3 flex gap-4">
              <button title={t('edit', language)} onClick={(e) => { e.stopPropagation(); setEditingJob(job); }}>
                <Edit2 size={20} />
              </button>
              <button title={t('delete', language)} onClick={(e) => { e.stopPropagation(); handleDelete(job.jobId); }}>
                <Trash2 size={20} />
              </button>
            </div>
          </>
        )}
        onCardClick={() => { }}
        emptyTextKey="noJobsFound"
      />

      {editingJob && (
        <EditJob
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={(updatedJob) => {
            setJobs(prev => prev.map(j => j.jobId === updatedJob.jobId ? updatedJob : j));
            setEditingJob(null);
          }}
        />
      )}

      {showAdvanced && (
        <div className="filters-modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <div className="filters-modal-box">
            <h3 className='font-bold text-xl text-center'>{t('advancedSearch', language)}</h3>

            {['location', 'company', 'field', 'minExperience', 'fromDate', 'toDate'].map((field) => (
              <div key={field} className="filters-modal-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>{t(`filterBy${field.charAt(0).toUpperCase() + field.slice(1)}`, language)}</label>
                  {filters[field] && (
                    <button onClick={() => clearSingleField(field)} style={{ background: 'none', border: 'none' }}>
                      <X size={18} />
                    </button>
                  )}
                </div>

                {field === 'field' ? (
                  <select name={field} value={filters[field]} onChange={handleFilterChange}>
                    {fieldsOptions.map((f) => (
                      <option key={f.value} value={f.value}>
                        {language === 'he' ? f.labelHe : f.labelEn}
                      </option>
                    ))}
                  </select>
                ) : field === 'minExperience' ? (
                  <select name={field} value={filters[field]} onChange={handleFilterChange}>
                    <option value="">{t('any', language)}</option>
                    {[0, 1, 2, 3, 5, 10].map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                ) : field === 'fromDate' || field === 'toDate' ? (
                  <input type="date" name={field} value={filters[field]} onChange={handleFilterChange} />
                ) : (
                  <input type="text" name={field} value={filters[field]} onChange={handleFilterChange} />
                )}
              </div>
            ))}

            <div className="filters-modal-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Button onClick={() => setShowAdvanced(false)}>{t('close', language)}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
