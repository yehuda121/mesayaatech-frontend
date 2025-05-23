'use client';
import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { getLanguage } from '../../../language';
import { t } from '@/app/utils/loadTranslations';

export default function ViewEvents({ events, setEvents, onEdit }) {
  const [language, setLanguage] = useState(getLanguage());
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetchEvents();
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [showPast]);

  const fetchEvents = async () => {
    try {
      const url = `http://localhost:5000/api/import-events${showPast ? '?includePast=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('שגיאה בעת קבלת האירועים:', err);
    }
  };

  const handleDelete = async (event) => {
    const res = await fetch(`http://localhost:5000/api/delete-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.eventId })
    });
    if (res.ok) {
      setEvents(prev => prev.filter(e => e.eventId !== event.eventId));
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
  );

  const togglePastLabel = language === 'he'
    ? showPast ? 'הסתר אירועים שעברו' : 'הצג אירועים שעברו'
    : showPast ? 'Hide Past Events' : 'Show Past Events';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-center">{t('editEventTitle', language)}</h2>

      <div className="flex gap-2 items-center" style={{ direction: 'rtl' }}>
        <input
          type="text"
          placeholder={t('filterTitle', language)}
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
        <Button
          text={togglePastLabel}
          size="sm"
          onClick={() => setShowPast(!showPast)}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center">{t('noEventsFound', language)}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEvents.map((event, i) => (
            <div key={i} className="border p-4 rounded shadow flex flex-col gap-2 overflow-hidden">
              <div className="text-lg font-bold truncate">{event.title}</div>
              <div>{event.date} {event.time}</div>
              <div className="truncate">{event.location}</div>
              <div className="flex gap-2 mt-2" style={{ direction: 'rtl' }}>
                <Button text={t('edit', language)} onClick={() => onEdit(event)} />
                <Button text={t('delete', language)} color="danger" onClick={() => handleDelete(event)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
