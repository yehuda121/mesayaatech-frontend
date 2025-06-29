'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { t } from '@/app/utils/loadTranslations';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function TopJobPublishersChart({ data }) {
  const [processedData, setProcessedData] = useState([]);
  const language = useLanguage();

  useEffect(() => {
    async function processData() {
      const result = await Promise.all(data.map(async (item) => {
        const publisherParts = item.publisherId.split('#');
        const email = publisherParts[0];
        const idNumber = publisherParts[1];
        const userType = item.publisherType;
        // console.log("item: ", userType);

        if (email === 'mesayaatech@gmail.com') {
          return { publisher: language === 'he' ? 'מנהל' : 'Admin', count: item.count };
        } else {
          try {
            const res = await fetch(`http://localhost:5000/api/get-user-form?userType=${userType}&idNumber=${idNumber}`);
            const userData = await res.json();
            return { publisher: userData.fullName || email, count: item.count };
          } catch (err) {
            console.error('Failed to load user data for publisher', email, err);
            return { publisher: email, count: item.count };
          }
        }
      }));
      setProcessedData(result);
    }

    if (data?.length > 0) {
      processData();
    }
  }, [data, language]);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer height={300}>
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="publisher" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ff6666" />
        </BarChart>
      </ResponsiveContainer>

      <div 
        style={{ [language === 'he' ? 'marginRight' : 'marginLeft']: '10%', marginTop: '15px', fontSize: '1rem', textAlign: 'start' }}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <p>- {language === 'he' 
          ? 'הגרף מציג את כמות המשרות שפורסמו לפי שם המפרסם.'
          : 'The chart shows the number of jobs published per publisher name.'}
        </p>
        <p>- {language === 'he' 
          ? 'הציר האופקי מייצג את שם המפרסם.'
          : 'The horizontal axis represents the publisher name.'}
        </p>
        <p>- {language === 'he' 
          ? 'הציר האנכי מייצג את כמות המשרות.'
          : 'The vertical axis represents the number of jobs.'}
        </p>
      </div>
    </div>
  );
}
