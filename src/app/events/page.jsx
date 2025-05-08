'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { getLanguage } from '@/app/language';

export default function Events() {
  const [language, setLanguage] = useState(getLanguage());
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/import-events');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const futureEvents = data.filter(event => new Date(event.date) >= new Date());
      setEvents(futureEvents);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const t = {
    title: { he: 'כותרת', en: 'Title' },
    date: { he: 'תאריך', en: 'Date' },
    time: { he: 'שעה', en: 'Time' },
    location: { he: 'מיקום', en: 'Location' },
    filterTitle: { he: 'סנן לפי כותרת', en: 'Filter by title' },
    filterDate: { he: 'סנן לפי תאריך', en: 'Filter by date' }
  };

  const filteredEvents = events.filter((e) =>
    e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-center">
        {language === 'he' ? 'אירועים קרובים' : 'Upcoming Events'}
      </h2>

      <div className="flex gap-2 items-center" style={{ direction: 'rtl' }}>
        <input
          type="text"
          placeholder={t.filterTitle[language]}
          className="border p-2 rounded w-full"
          value={filter.title}
          onChange={(e) => setFilter({ ...filter, title: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center">
          {language === 'he' ? 'לא נמצאו אירועים' : 'No events found'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEvents.map((event, i) => (
            <div key={i} className="border p-4 rounded shadow flex flex-col gap-2 overflow-hidden">
              <div className="text-lg font-bold truncate">{event.title}</div>
              <div>{event.date} {event.time}</div>
              <div className="truncate">{event.location}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
