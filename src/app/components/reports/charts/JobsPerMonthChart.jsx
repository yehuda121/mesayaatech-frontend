'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function JobsPerMonthChart({ data }) {
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

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <div 
        style={{ [language === 'he' ? 'marginRight' : 'marginLeft']: '10%' , marginTop: '15px', fontSize: '1rem', textAlign: 'start' }}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <p>- {language === 'he' 
          ? 'הגרף מציג את כמות המשרות שפורסמו בכל חודש.'
          : 'The chart shows the number of jobs published each month.'}
        </p>
        <p>- {language === 'he' 
          ? 'הציר האופקי מייצג את החודש'
          : 'The horizontal axis represents the month.'}
        </p>
        <p>- {language === 'he' 
          ? 'והציר האנכי מייצג את כמות המשרות בכל חודש.'
          : 'The vertical axis represents the number of jobs in each month.'}
        </p>
      </div>

    </div>
  );
}
