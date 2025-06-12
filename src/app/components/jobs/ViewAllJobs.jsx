// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import ViewJob from './viewJob';
// import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
// import ToastMessage from '@/app/components/Notifications/ToastMessage';
// import './jobs.css';
// import Button from '../Button';
// import { FileSearch } from 'lucide-react';

// export default function ViewAllJobs() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [filters, setFilters] = useState({ location: '', company: '' });
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     setLanguage(getLanguage());
//     fetchJobs();
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/import-jobs');
//       if (!res.ok) throw new Error('Failed to fetch jobs');
//       const data = await res.json();
//       setJobs(data);
//       setFilteredJobs(data);
//     } catch (error) {
//       console.error('Failed to fetch jobs:', error);
//       setToast({ message: t('serverError', language), type: 'error' });
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     const newFilters = { ...filters, [name]: value };
//     setFilters(newFilters);
//     const filtered = jobs.filter((job) => {
//       const locationMatch = !newFilters.location || job?.location?.includes(newFilters.location);
//       const companyMatch = !newFilters.company || job?.company?.includes(newFilters.company);
//       return locationMatch && companyMatch;
//     });
//     setFilteredJobs(filtered);
//   };

//   return (
//     <>
//       <GenericCardSection
//         titleKey="jobList"
//         filters={[
//           <div className="filter-with-icon" key="location">
//             <span className="filter-icon">📍</span>
//             <input
//               type="text"
//               name="location"
//               placeholder={t('filterByLocation', language)}
//               value={filters.location}
//               onChange={handleFilterChange}
//             />
//           </div>,
        
//           <div className="filter-with-icon" key="company">
//             <span className="filter-icon">🏢</span>
//             <input
//               type="text"
//               name="company"
//               placeholder={t('filterByCompany', language)}
//               value={filters.company}
//               onChange={handleFilterChange}
//             />
//           </div>,
        
//           <Button key="clear"  onClick={() => {
//             setFilters({ location: '', company: '' });
//             setFilteredJobs(jobs);
//           }}>{t('clearFilters', language)}
//           </Button>
//         ]}
        
//         data={filteredJobs}
//         renderCard={(job) => (
//           <div className="job-card-content">
//             <h3 className="font-bold text-lg">{job?.company || t('noCompany', language)}</h3>
//             {job?.location && <p>{t('location', language)}: {job.location}</p>}
//             {job?.description && <p>{t('description', language)}: {job.description.slice(0, 100)}...</p>}

//             <div className="mt-2 flex items-center gap-2">
//               <button
//                 onClick={() => setSelectedJob(job)}
//                 title={t('viewJob', language)}
//                 className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//               >
//                 <FileSearch size={18} />
//                 <span>{t('viewJob', language)}</span>
//               </button>
//             </div>
//           </div>
//         )}
//         emptyTextKey="noJobsFound"
//       />

//       {selectedJob && (
//         <ViewJob
//           job={selectedJob}
//           onClose={() => setSelectedJob(null)}
//         />
//       )}

//       {toast && (
//         <ToastMessage
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </>
//   );
// }




'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ViewJob from './viewJob';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import './jobs.css';
import './filters.css'
import Button from '../Button';
import { FileSearch, X } from 'lucide-react';

export default function ViewAllJobs() {
  const [language, setLanguage] = useState(getLanguage());
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    location: '',
    company: '',
    category: '',
    experience: '',
    fromDate: '',
    toDate: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: '', labelHe: 'הכל', labelEn: 'All' },
    { value: 'tech', labelHe: 'הייטק', labelEn: 'Tech' },
    { value: 'finance', labelHe: 'פיננסים', labelEn: 'Finance' },
    { value: 'logistics', labelHe: 'לוגיסטיקה', labelEn: 'Logistics' },
    { value: 'marketing', labelHe: 'שיווק', labelEn: 'Marketing' },
    { value: 'education', labelHe: 'חינוך', labelEn: 'Education' },
    { value: 'other', labelHe: 'אחר', labelEn: 'Other' }
  ];

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
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setToast({ message: t('serverError', language), type: 'error' });
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
        const categoryMatch = !filters.category || (job?.field || '') === filters.category;

        let experienceMatch = true;
        if (filters.experience !== '') {
          const jobExp = job?.minExperience;
          const selectedExp = parseInt(filters.experience);
          if (jobExp !== undefined && jobExp !== null) {
            experienceMatch = jobExp <= selectedExp;
          }
        }

        const fromDateMatch = !filters.fromDate || new Date(job?.createdAt) >= new Date(filters.fromDate);
        const toDateMatch = !filters.toDate || new Date(job?.createdAt) <= new Date(filters.toDate);

        return searchMatch && locationMatch && companyMatch && categoryMatch && experienceMatch && fromDateMatch && toDateMatch;
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
      category: '',
      experience: '',
      fromDate: '',
      toDate: ''
    });
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

  return (
    <>
      <GenericCardSection
        titleKey="jobList"
        filters={filtersUI}
        data={filteredJobs}
        renderCard={(job) => (
          <div className="job-card-content">
            <h3 className="font-bold text-lg">{job?.company || t('noCompany', language)}</h3>
            {job?.location && <p>{t('location', language)}: {job.location}</p>}
            {job?.description && <p>{t('description', language)}: {job.description.slice(0, 100)}...</p>}

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedJob(job)}
                title={t('viewJob', language)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FileSearch size={18} />
                <span>{t('viewJob', language)}</span>
              </button>
            </div>
          </div>
        )}
        emptyTextKey="noJobsFound"
      />

      {selectedJob && (
        <ViewJob job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {toast && (
        <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {showAdvanced && (
        <div className="filters-modal-overlay" dir={language === 'he'? 'rtl' : 'ltr'}>
          <div className="filters-modal-box">
            <h3 className='font-bold text-xl text-center'>{t('advancedSearch', language)}</h3>

            {['location', 'company', 'category', 'experience', 'fromDate', 'toDate'].map((field) => (
              <div key={field} className="filters-modal-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>{t(`filterBy${field.charAt(0).toUpperCase() + field.slice(1)}`, language)}</label>
                  {filters[field] && (
                    <button onClick={() => clearSingleField(field)} style={{ background: 'none', border: 'none' }}>
                      <X size={18} />
                    </button>
                  )}
                </div>

                {field === 'category' ? (
                  <select name={field} value={filters[field]} onChange={handleFilterChange}>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'he' ? cat.labelHe : cat.labelEn}
                      </option>
                    ))}
                  </select>
                ) : field === 'experience' ? (
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

            <div className="filters-modal-actions">
              <Button onClick={() => setShowAdvanced(false)}>{t('close', language)}</Button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
