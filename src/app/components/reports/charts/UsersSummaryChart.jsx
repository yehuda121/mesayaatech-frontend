'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";
import './charts.css';

export default function UsersSummaryChart({ data }) {
  const language = useLanguage();

  const chartData = [
    { name: t('reservists', language), value: data.reservists },
    { name: t('mentors', language), value: data.mentors },
    { name: t('ambassadors', language), value: data.ambassadors }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div 
      className="users-summary-container"
      dir={language === 'he'? 'rtl' : 'ltr'}
      >
      <div>
        <table style={{ borderCollapse: 'collapse', fontSize: '1.1rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left' }}>{t('userType', language)}</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>{t('amount', language)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>{t('reservists', language)}</td>
              <td style={{ padding: '8px' }}>{data.reservists}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>{t('mentors', language)}</td>
              <td style={{ padding: '8px' }}>{data.mentors}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>{t('ambassadors', language)}</td>
              <td style={{ padding: '8px' }}>{data.ambassadors}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ width: 400, height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
