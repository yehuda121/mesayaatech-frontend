
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import EditEvents from './EditEvents';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';

export default function ViewEvents({ events, setEvents, handleNavigation }) {
  const [language, setLanguage] = useState(getLanguage());
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [showPast, setShowPast] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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
    const confirmed = confirm(t('confirmDeleteEvent', language));
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:5000/api/delete-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.eventId })
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.eventId !== event.eventId));
      }
    } catch (err) {
      console.error('שגיאה בעת מחיקת האירוע:', err);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
  );

  return (
    <>
      <div className='mt-1 mb-3'>
        <Button
          text={t('createEvent', language)}
          onClick={() => {
            handleNavigation('create-event')
          }}
        />
      </div>
      <GenericCardSection
        titleKey="viewEvents"
        filters={[
          <input
            key="title"
            type="text"
            placeholder={t('filterTitle', language)}
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            className="card-filter flexible"
          />,
          <input
            key="date"
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className="card-filter date-filter"
          />,
          <Button
            key="toggle"
            className="card-filter button-filter"
            size="sm"
            onClick={() => setShowPast(!showPast)}
          >
            {showPast ? t('hidePast', language) : t('showPast', language)}
          </Button>
        ]}
        data={filteredEvents}
        renderCard={(event) => (
          <>
            <div className="event-title text-center font-bold text-lg mb-2">{event.title}</div>

            <div className='text-start' dir={language === 'he' ? 'rtl' : 'ltr'}>
              <span className="font-bold">{t('date', language)}:</span> {event.date}
            </div>

            <div className='text-start' dir={language === 'he' ? 'rtl' : 'ltr'}>
              <span className="font-bold">{t('time', language)}:</span> {event.time}
            </div>

            <div className='text-start' dir={language === 'he' ? 'rtl' : 'ltr'}>
              <span className="font-bold">{t('location', language)}:</span> {event.location}
            </div>

            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={(e) => { e.stopPropagation(); setEditingEvent(event); }}>
                {t('edit', language)}
              </Button>
              <Button size="sm" color="red" onClick={(e) => { e.stopPropagation(); handleDelete(event); }}>
                {t('delete', language)}
              </Button>
            </div>
          </>

        )}
        onCardClick={() => {}}
        emptyTextKey="noEventsFound"
      />

      {editingEvent && (
        <EditEvents
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={(updated) => {
            setEvents(prev =>
              prev.map(ev => ev.eventId === updated.eventId ? updated : ev)
            );
            setEditingEvent(null);
          }}
        />
      )}
    </>
  );
} 
