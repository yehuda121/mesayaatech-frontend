'use client';

import { useEffect, useState, useMemo } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ViewProgress from './ViewProgress';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Eye } from 'lucide-react';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function MentorshipsView() {
  const [mentorships, setMentorships] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);
  const [toast, setToast] = useState(null);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const language = useLanguage();

  useEffect(() => {
    fetchMentorships();
  }, []);

  const fetchMentorships = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/getAllProgress`);
      const data = await res.json();
      if (res.ok) {
        const enriched = data.map(item => ({
          ...item,
          mentorName: item.mentorName || '',
          reservistName: item.reservistName || ''
        }));
        setMentorships(enriched);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: t('fetchMentorshipsError', language), type: 'error' });
    }
  };

  const progressStages = [
    t('stage1', language),
    t('stage2', language),
    t('stage3', language),
    t('stage4', language),
    t('stage5', language)
  ];

  const filteredData = useMemo(() => {
    return mentorships.filter(item => {
      const mentorName = item.mentorName || '';
      const reservistName = item.reservistName || '';

      const nameMatch =
        mentorName.toLowerCase().includes(search.toLowerCase()) ||
        reservistName.toLowerCase().includes(search.toLowerCase());

      const stageMatch = stageFilter ? (item.progressStage === parseInt(stageFilter)) : true;
      return nameMatch && stageMatch;
    });
  }, [mentorships, search, stageFilter]);

  const filters = [
    <input
      key="search"
      type="text"
      placeholder={t('searchByName', language)}
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="filter-input"
    />,
    <select
      key="stage"
      value={stageFilter}
      onChange={e => setStageFilter(e.target.value)}
      className="filter-input"
    >
      <option value="">{t('allStages', language)}</option>
      {progressStages.map((stage, idx) => (
        <option key={idx + 1} value={idx + 1}>{stage}</option>
      ))}
    </select>
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '30px' }}>
      <GenericCardSection
        titleKey="allMentorships"
        filters={filters}
        data={filteredData}
        emptyTextKey="noMentorshipsFound"
        renderCard={(pair) => (
          <div>
            <p><strong>{t('mentor', language)}:</strong> {pair.mentorName}</p>
            <p><strong>{t('reservist', language)}:</strong> {pair.reservistName}</p>
            <p><strong>{t('progressStage', language)}:</strong> {pair.progressStage ? progressStages[pair.progressStage - 1] : t('unknownStage', language)}</p>

            <div style={{ marginTop: '10px' }}>
              <button title={t('viewProcess', language)} onClick={() => setSelectedPair(pair)}>
                <Eye size={22} />
              </button>
            </div>
          </div>
        )}
      />

      {selectedPair && (
        <ViewProgress progressData={selectedPair} onClose={() => setSelectedPair(null)} />
      )}

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {alert && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
}
