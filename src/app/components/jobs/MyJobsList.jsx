'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from "@/app/utils/language/useLanguage";
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import sanitizeText from '@/app/utils/sanitizeText';

export default function MyJobsList({ publisherId, userType = "mentor", onEdit }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const language = useLanguage();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const encodedPublisherId = encodeURIComponent(publisherId);
        const url =
          `${process.env.NEXT_PUBLIC_API_BASE}/api/jobs-by-publisherID/by-publisher?publisherId=${encodedPublisherId}&idType=${userType}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
          }
        });
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
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ jobId, userId, userType })
      });

      if (res.ok) {
        setToast({ message: t('jobDeleted', language), type: 'success' });
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
        setFilteredJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      } else {
        setToast({message: t('deleteFailed', language), type: 'error'});
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setToast({message: t('serverError', language), type: 'error'});
    }
  };

  const handleFreeTextFilter = (e) => {
    const rawText = e.target.value ?? '';  
    const { text, wasModified } = sanitizeText(rawText, 500);

    // Update display value (sanitized)
    setSearchText(text);

    if (wasModified) {
      setToast({
        message: t('textSanitizedWarning', language),
        type: 'warning'
      });
    }

    const lowerText = String(text || '').toLowerCase();

    const sortedFiltered = (Array.isArray(jobs) ? jobs : [])
      .map((job) => {
        let company = '';
        let role = '';
        let location = '';

        company = String(job.company || '').toLowerCase();
        role = String(job.role || '').toLowerCase();
        location = String(job.location || '').toLowerCase();

        let score = 0;
        if (company.includes(lowerText)) score += 3;
        if (role.includes(lowerText)) score += 2;
        if (location.includes(lowerText)) score += 1;

        return { ...job, _matchScore: score };
      })
      .sort((a, b) => b._matchScore - a._matchScore)
      .map(({ _matchScore, ...job }) => job); // Remove match score from result

    setFilteredJobs(sortedFiltered);
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
            key="freeText"
            name="freeText"
            placeholder={t('filterFreeText', language)}
            value={searchText || ''}
            onChange={handleFreeTextFilter}
            className="card-filter"
          />
        ]}
        data={filteredJobs}
        renderCard={(job) => (
          <div className='text-start'>
            <h3 className="font-bold text-lg">{job.company || t('noCompany', language)}</h3>
            {job.role && <p><strong>{t('role', language)}:</strong> {job.role}</p>}
            {job.location && <p><strong>{t('location', language)}:</strong> {job.location}</p>}
            {job.minExperience !== undefined && job.minExperience !== null && (
              <p><strong>{t('minExperience', language)}:</strong> {job.minExperience}</p>
            )}
            {job.requirements && <p><strong>{t('requirements', language)}:</strong> {job.requirements}</p>}
            {job.advantages && <p><strong>{t('advantages', language)}:</strong> {job.advantages}</p>}
            {job.description && <p className="job-description">{job.description}</p>}
            <div className="job-actions flex gap-4 mt-3">
              <button title={t('edit', language)} onClick={() => onEdit(job)}>
                <Edit2 size={20}/>
              </button>
              <button title={t('delete', language)} 
                // onClick={() => handleDelete(job.jobId)}>
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmData(job.jobId);
                }}>
                <Trash2 size={20}/>
              </button>

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

      {confirmData && (
        <ConfirmDialog
          title={t('confirmDelete', language)}
          message={t('confirmDeleteJob', language)}
          onConfirm={() => {
            handleDelete(confirmData);
            setConfirmData(null);
          }}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
