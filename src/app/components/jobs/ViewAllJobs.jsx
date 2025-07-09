'use client';

import { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { t } from '@/app/utils/loadTranslations';
import ViewJob from './viewJob';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import EditJob from './EditJob';
import './jobs.css';
import './filters.css';
import Button from '../Button/Button';
import { FileSearch, Edit2, Trash2, X, PlusCircle } from 'lucide-react';
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import ConfirmDialog from '../notifications/ConfirmDialog';
import { useLanguage } from "@/app/utils/language/useLanguage";
import DraggableAddJobButton from '../DraggableButton/DraggableButton';
import AddNewJob from './PostNewJob';

export default function ViewAllJobs() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    location: '',
    company: '',
    field: '',
    experience: '',
    fromDate: '',
    toDate: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const language = useLanguage();
  const [addNewJobMode, setAddNewJobMode] = useState(false);

  const categories = [
    { value: '', labelHe: 'הכל', labelEn: 'All' },
    ...Object.entries(translatedJobFields).map(([value, labelObj]) => ({
      value,
      labelHe: labelObj.he,
      labelEn: labelObj.en
    }))
  ];

  useEffect(() => {
    const rawUserType = sessionStorage.getItem('userType');
    setUserType(rawUserType);
    const id = sessionStorage.getItem('userId');
    setUserId(id);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/import-jobs`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  // Delete job API call
  const handleDeleteJob = async (jobId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId, userType })
      });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.jobId !== jobId));
        setJobToDelete(null);
      } else {
        alert(t('deleteFailed', language));
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(t('serverError', language));
    }
  };

  // Main filtering logic using Fuse.js and other filters
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (filters.searchText) {
      const fuse = new Fuse(filtered, {
        keys: ['role', 'description', 'requirements', 'location', 'company', 'advantages'],
        threshold: 0.3,
        ignoreLocation: true
      });
      const result = fuse.search(filters.searchText);
      filtered = result.map(r => r.item);
    }

    if (filters.location) {
      const fuseLoc = new Fuse(filtered, {
        keys: ['location'],
        threshold: 0.3,
        ignoreLocation: true
      });
      const resultLoc = fuseLoc.search(filters.location);
      filtered = resultLoc.map(r => r.item);
    }

    if (filters.company) {
      const fuseComp = new Fuse(filtered, {
        keys: ['company'],
        threshold: 0.3,
        ignoreLocation: true
      });
      const resultComp = fuseComp.search(filters.company);
      filtered = resultComp.map(r => r.item);
    }

    if (filters.field) {
      filtered = filtered.filter(job => (job?.field || '') === filters.field);
    }

    if (filters.experience !== '') {
      const selectedExp = parseInt(filters.experience);
      filtered = filtered.filter(job => {
        const jobExp = job?.minExperience;
        return (jobExp !== undefined && jobExp !== null) ? jobExp <= selectedExp : true;
      });
    }

    if (filters.fromDate) {
      filtered = filtered.filter(job => new Date(job?.createdAt) >= new Date(filters.fromDate));
    }
    if (filters.toDate) {
      filtered = filtered.filter(job => new Date(job?.createdAt) <= new Date(filters.toDate));
    }

    filtered.sort((a, b) => {
      const aExp = (a?.minExperience !== undefined && a?.minExperience !== null) ? a.minExperience : Infinity;
      const bExp = (b?.minExperience !== undefined && b?.minExperience !== null) ? b.minExperience : Infinity;
      return aExp - bExp;
    });

    return filtered;
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

              {userType === 'admin' && (
                <div className="mt-3 flex gap-4">
                  <button title={t('edit', language)} onClick={(e) => { e.stopPropagation(); setEditingJob(job); }}>
                    <Edit2 size={20} />
                  </button>
                  <button title={t('delete', language)} onClick={(e) => { e.stopPropagation(); setJobToDelete(job.jobId); }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        emptyTextKey="noJobsFound"
      />

      {userType !== 'reservist' && (
        <DraggableAddJobButton
          title={t('postNewJob', language)}
          onClick={() => setAddNewJobMode(true)}
        />
      )}

      {jobToDelete && (
        <ConfirmDialog 
          title={t('confirmDelete', language)}
          message={t('confirmDeleteJob', language)}
          onConfirm={() => handleDeleteJob(jobToDelete)}
          onCancel={() => setJobToDelete(null)}
        />
      )}

      {selectedJob && (
        <ViewJob job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

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

      {toast && (
        <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {addNewJobMode && (
        <div className="post-new-job-modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <AddNewJob
            publisherId={userId}
            type={userType}
            onSave={(newJob) => {
              setJobs(prev => [...prev, newJob]);
              setAddNewJobMode(false);
            }}
            onClose={() => setAddNewJobMode(false)}
          />
        </div>
      )}

      {showAdvanced && (
        <div className="filters-modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <div className="filters-modal-box">
            <h3 className='font-bold text-xl text-center'>{t('advancedSearch', language)}</h3>

            <button className="filter-close" onClick={() => setShowAdvanced(false)}>
              ✖
            </button>

            {['location', 'company', 'field', 'experience', 'fromDate', 'toDate'].map((field) => (
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
