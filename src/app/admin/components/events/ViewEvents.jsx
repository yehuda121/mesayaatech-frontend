// 'use client';
// import { useEffect, useState } from 'react';
// import Button from '../../../components/Button';
// import { getLanguage } from '../../../language';
// import { t } from '@/app/utils/loadTranslations';

// export default function ViewEvents({ events, setEvents, onEdit }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [filter, setFilter] = useState({ title: '', date: '' });
//   const [showPast, setShowPast] = useState(false);

//   useEffect(() => {
//     fetchEvents();
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, [showPast]);

//   const fetchEvents = async () => {
//     try {
//       const url = `http://localhost:5000/api/import-events${showPast ? '?includePast=true' : ''}`;
//       const res = await fetch(url);
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setEvents(data);
//     } catch (err) {
//       console.error('שגיאה בעת קבלת האירועים:', err);
//     }
//   };

//   const handleDelete = async (event) => {
//     const res = await fetch(`http://localhost:5000/api/delete-event`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ eventId: event.eventId })
//     });
//     if (res.ok) {
//       setEvents(prev => prev.filter(e => e.eventId !== event.eventId));
//     }
//   };

//   const filteredEvents = events.filter((e) =>
//     e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
//   );

//   const togglePastLabel = language === 'he'
//     ? showPast ? 'הסתר אירועים שעברו' : 'הצג אירועים שעברו'
//     : showPast ? 'Hide Past Events' : 'Show Past Events';

//   return (
//     <div className="view-events-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <h2 className="view-events-title">{t('editEventTitle', language)}</h2>

//       <div className="event-filters">
//         <input
//           type="text"
//           placeholder={t('filterTitle', language)}
//           value={filter.title}
//           onChange={(e) => setFilter({ ...filter, title: e.target.value })}
//         />
//         <input
//           type="date"
//           value={filter.date}
//           onChange={(e) => setFilter({ ...filter, date: e.target.value })}
//         />
//         <Button
//           text={togglePastLabel}
//           size="sm"
//           onClick={() => setShowPast(!showPast)}
//         />
//       </div>

//       {filteredEvents.length === 0 ? (
//         <p className="event-empty-message">{t('noEventsFound', language)}</p>
//       ) : (
//         <div className="event-grid">
//           {filteredEvents.map((event, i) => (
//             <div key={i} className="event-card">
//               <div className="event-title">{event.title}</div>
//               <div className="event-date-time">{event.date} {event.time}</div>
//               <div className="event-location">{event.location}</div>
//               <div className="event-actions">
//                 <Button text={t('edit', language)} onClick={() => onEdit(event)} />
//                 <Button
//                   text={t('delete', language)}
//                   color="red"
//                   onClick={() => {
//                     if (confirm(t('confirmDeleteEvent', language))) {
//                       handleDelete(event);
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );


// }
// components/events/ViewEvents.jsx
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
import EditEvents from './EditEvents';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';

export default function ViewEvents({ events, setEvents }) {
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
      <GenericCardSection
        titleKey="editEventTitle"
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
            <div className="event-title">{event.title}</div>
            <div>{event.date} {event.time}</div>
            <div>{event.location}</div>
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
