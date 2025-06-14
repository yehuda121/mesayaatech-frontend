'use client'

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';

export default function LocationsSummaryChart({ data }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(getLanguage());
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const chartData = Object.entries(data).map(([location, count]) => ({
    location,
    count
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6666', '#00bcd4', '#ffa500', '#9966cc'];

  return (
    <div style={{ textAlign: 'start', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', marginTop: '30px' }}
        dir={language === 'he' ? 'rtl' : 'ltr'}>

        <div>
            <table style={{ borderCollapse: 'collapse', fontSize: '1.1rem' }}>
            <thead>
                <tr>
                <th style={{ padding: '8px', textAlign: 'left' }}>{t('location', language)}</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>{t('amount', language)}</th>
                </tr>
            </thead>
            <tbody>
                {chartData.map(({ location, count }) => (
                <tr key={location}>
                    <td style={{ padding: '8px' }}>{location}</td>
                    <td style={{ padding: '8px' }}>{count}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      
        <div style={{ width: 400, height: 400 }}>
            <ResponsiveContainer>
            <PieChart>
                <Pie
                data={chartData}
                dataKey="count"
                nameKey="location"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
