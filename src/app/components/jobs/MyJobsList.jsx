'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from "@/app/utils/language/useLanguage";
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import sanitizeText from '@/app/utils/sanitizeText';

export default function MyJobsList({publisherId, userType, onEdit }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const language = useLanguage();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/jobs-by-publisherID/by-publisher?publisherId=${publisherId}&idType=${userType}`;
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
          setJobs([]);
          setFilteredJobs([]);
          setAlertMessage({ message: t('jobsLoadError', language), type: 'error' });
        }
      } catch (_err) {
        setAlertMessage({ message: t('jobsServerError', language), type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    // If identifiers are missing, show a warning and stop loading
    if (!publisherId || !userType) {
      // console.log("publisherId: ",publisherId);
      // console.log("userType: ",userType);
      setLoading(false);
      setAlertMessage({ message: t('publisherIdMissing', language), type: 'warning' });
      return;
    }

    fetchJobs();
  }, [publisherId, userType, language]);

  function truncateText(text, maxLength = 30) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  // Delete a job with auth and consistent idNumber
  const handleDelete = async (jobId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
        },
        body: JSON.stringify({ jobId, userId: publisherId, userType })
      });

      if (res.ok) {
        setAlertMessage({ message: t('jobDeleted', language), type: 'success' });
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
        setFilteredJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      } else {
        const errText = await res.text().catch(() => '');
        console.error('Delete failed:', res.status, errText);
        setAlertMessage({ message: t('deleteFailed', language), type: 'error' });
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setAlertMessage({ message: t('serverError', language), type: 'error' });
    }
  };

  // Free-text filter with basic ranking; preserves original list when query is empty
  const handleFreeTextFilter = (e) => {
    const rawText = e.target.value ?? '';
    const { text, wasModified } = sanitizeText(rawText, 500);

    setSearchText(text);

    if (wasModified) {
      setAlertMessage({
        message: t('textSanitizedWarning', language),
        type: 'warning'
      });
    }

    const lowerText = (text || '').toLowerCase().trim();

    if (!lowerText) {
      // Empty query -> restore original list
      setFilteredJobs(jobs);
      return;
    }

    const sortedFiltered = (Array.isArray(jobs) ? jobs : [])
      .map((job) => {
        const company  = String(job.company  || '').toLowerCase();
        const role     = String(job.role     || '').toLowerCase();
        const location = String(job.location || '').toLowerCase();

        let score = 0;
        if (company.includes(lowerText))  score += 3;
        if (role.includes(lowerText))     score += 2;
        if (location.includes(lowerText)) score += 1;

        return { ...job, _matchScore: score };
      })
      .filter(j => j._matchScore > 0)
      .sort((a, b) => b._matchScore - a._matchScore)
      .map(({ _matchScore, ...job }) => job); // strip internal score

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
            {job.role && (
              <p><strong>{t('role', language)}:</strong> {truncateText(job.role, 40)}</p>
            )}
            {job.location && (
              <p><strong>{t('location', language)}:</strong> {job.location}</p>
            )}
            {job.minExperience !== undefined && job.minExperience !== null && (
              <p><strong>{t('minExperience', language)}:</strong> {job.minExperience}</p>
            )}
            {job.requirements && (
              <p><strong>{t('requirements', language)}:</strong> {truncateText(job.requirements, 100)}</p>
            )}
            {job.advantages && (
              <p><strong>{t('advantages', language)}:</strong> {truncateText(job.advantages, 50)}</p>
            )}
            {job.description && (
              <p className="job-description">{truncateText(job.description, 50)}</p>
            )}

            <div className="job-actions flex gap-4 mt-3">
              <button
                title={t('edit', language)}
                onClick={() => onEdit(job)}
              >
                <Edit2 size={20}/>
              </button>

              <button
                title={t('delete', language)}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmData(job.jobId);
                }}
              >
                <Trash2 size={20}/>
              </button>
            </div>
          </div>
        )}
        onCardClick={() => {}}
        emptyTextKey="noJobsPosted"
      />

      {alertMessage && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
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
