
'use client'

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { t } from '@/app/utils/loadTranslations';
import { normalizeLocation } from '@/app/utils/normalizeLocation';
import { locations } from '@/app/components/Locations';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function LocationsSummaryChart({ data }) {
  const language = useLanguage();

  // Normalize all locations to avoid duplicates
  const normalizedCounts = {};

  Object.entries(data).forEach(([location, count]) => {
    const normalized = normalizeLocation(location);
    if (!normalizedCounts[normalized]) {
      normalizedCounts[normalized] = 0;
    }
    normalizedCounts[normalized] += count;
  });

  const chartData = Object.entries(normalizedCounts).map(([location, count]) => ({
    location,
    count
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6666', '#00bcd4', '#ffa500', '#9966cc'];

  // display function using locations only
  const getDisplayLocation = (normalizedLocation) => {
    for (const region of locations) {
      for (const loc of region.locations) {
        if (loc.en === normalizedLocation) {
          return language === 'he' ? loc.he : loc.en;
        }
      }
    }
    return normalizedLocation;
  };

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
                    <td style={{ padding: '8px' }}>{getDisplayLocation(location)}</td>
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
                <Tooltip formatter={(value, name) => [value, getDisplayLocation(name)]} />
            </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
