'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function EventsPerMonthChart({ data }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(getLanguage());
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const chartData = Object.entries(data).map(([month, count]) => ({
    month,
    count
  }));

  const marginDirection = language === 'he' ? 'marginRight' : 'marginLeft';

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ffa500" />
        </BarChart>
      </ResponsiveContainer>

      <div 
        style={{ [marginDirection]: '10%' , marginTop: '15px', fontSize: '1rem', textAlign: 'start' }}
        dir={language === 'he' ? 'rtl' : 'ltr'}>
        <p>- {language === 'he' 
          ? 'הגרף מציג את כמות האירועים שפורסמו בכל חודש.'
          : 'The chart shows the number of events published each month.'}
        </p>
        <p>- {language === 'he' 
          ? 'הציר האנכי מייצג את החודש'
          : 'The X-axis represents the month.'}
        </p>- {language === 'he' 
          ? ' והציר האופקי את מספר האירועים באותו חודש.'
          : 'and the Y-axis represents the number of events in that month.'}
      </div>
    </div>
  );
}
