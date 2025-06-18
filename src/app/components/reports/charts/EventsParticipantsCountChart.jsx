'use client'

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function EventsParticipantsCountChart({ data }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

    // if (!data || !Array.isArray(data)) {
    //     return <p>{t('loadingReports', language)}</p>;
    // }
    if (!data) {
    console.log('📭 No data received yet');
    return <p>no data</p>;
    }
    if (!Array.isArray(data)) {
    console.log('❗Data is not array:', data);
    return <p>!Array.isArray(data)</p>;
    }


  const chartData = data.map(event => ({
    name: `${event.title} (${event.date})`,
    count: event.count
  }));

  const marginDirection = language === 'he' ? 'marginRight' : 'marginLeft';

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#009999" />
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          [marginDirection]: '10%',
          marginTop: '15px',
          fontSize: '1rem',
          textAlign: 'start'
        }}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <p>- {t('participantsChartDescription1', language)}</p>
        <p>- {t('participantsChartDescription2', language)}</p>
        <p>- {t('participantsChartDescription3', language)}</p>
      </div>
    </div>
  );
}
