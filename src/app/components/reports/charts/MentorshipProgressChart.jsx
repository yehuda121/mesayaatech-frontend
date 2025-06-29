'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function MentorshipProgressChart({ data, meetingsSummary }) {
  const language = useLanguage();

  const chartData = Object.entries(data).map(([stage, count]) => ({
    stage,
    count
  }));

  const meetingsData = Object.entries(meetingsSummary).map(([meetingsCount, count]) => ({
    meetingsCount,
    count
  }));

  return (
    <div style={{ width: '100%', height: 450 }}>
      <ResponsiveContainer height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#00bcd4" />
        </BarChart>
      </ResponsiveContainer>

      <div 
        style={
          {[language === 'he' ? 'marginRight' : 'marginLeft']: '10%',
            marginTop: '15px', 
            fontSize: '1rem', 
            textAlign: 'start', 
            // marginBottom: '50px'
          }}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <p>- {language === 'he' 
          ? 'הגרף מציג את פילוח המשתמשים לפי שלבי הליווי.'
          : 'The chart shows the distribution of users by mentorship stages.'}
        </p>
        <p>- {language === 'he' 
          ? 'הציר האופקי מייצג את שלב הליווי'
          : 'The horizontal axis represents the mentorship stage.'}
        </p>
        <p>- {language === 'he' 
          ? 'והציר האנכי מייצג את כמות המשתמשים בכל שלב.'
          : 'The vertical axis represents the number of users in each stage.'}
        </p>
      </div>

      <div 
        style={{ 
          [language === 'he' ? 'marginRight' : 'marginLeft']: '10%', 
          marginTop: '25px', 
          fontSize: '1rem', 
          textAlign: 'start' 
        }}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <h3 className='font-bold'>{language === 'he' ? 'פילוח כמות פגישות:' : 'Meetings Summary:'}</h3>
        <ul style={{ paddingBottom: '50px', lineHeight: '1.8' }}>
          {meetingsData.map(({ meetingsCount, count }) => (
            <li key={meetingsCount}>
              {language === 'he' 
                ? `כמות המקרים בהן היה ${meetingsCount} פגישות הוא : ${count}`
                : `Number of cases with ${meetingsCount} meetings: ${count}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
