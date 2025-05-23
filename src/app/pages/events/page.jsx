// 'use client';

// import { useEffect, useState } from 'react';
// import Button from '@/app/components/Button';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';

// export default function Events({ idNumber, fullName, email }) {
//   const [language, setLanguage] = useState(getLanguage());
//   const [filter, setFilter] = useState({ title: '', date: '' });
//   const [events, setEvents] = useState([]);
//   const [joinedEvents, setJoinedEvents] = useState({});

//   useEffect(() => {
//     fetchEvents();
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/import-events');
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       const futureEvents = data.filter(event => new Date(event.date) >= new Date());
//       setEvents(futureEvents);
//     } catch (err) {
//       console.error('Failed to load events:', err);
//     }
//   };

//   const handleJoin = async (eventId) => {
//     if (!idNumber || !fullName || !email) {
//       alert(t('missingUserDetails', language));
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:5000/api/join-to-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ eventId, idNumber, fullName, email }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setJoinedEvents((prev) => ({ ...prev, [eventId]: true }));
//         alert(t('successJoin', language));
//       } else {
//         alert(data.error || t('joinError', language));
//       }
//     } catch (err) {
//       console.error('Join error:', err);
//       alert(t('serverError', language));
//     }
//   };

//   const filteredEvents = events.filter((e) =>
//     e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <h2 className="text-2xl font-bold text-center">
//         {t('upcomingEvents', language)}
//       </h2>

//       <div className="flex gap-2 items-center" style={{ direction: 'rtl' }}>
//         <input
//           type="text"
//           placeholder={t('filterTitle', language)}
//           className="border p-2 rounded w-full"
//           value={filter.title}
//           onChange={(e) => setFilter({ ...filter, title: e.target.value })}
//         />
//         <input
//           type="date"
//           className="border p-2 rounded"
//           value={filter.date}
//           onChange={(e) => setFilter({ ...filter, date: e.target.value })}
//         />
//       </div>

//       {filteredEvents.length === 0 ? (
//         <p className="text-center">
//           {t('noEventsFound', language)}
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {filteredEvents.map((event, i) => (
//             <div key={i} className="border p-4 rounded shadow flex flex-col gap-2 overflow-hidden">
//               <div className="text-lg font-bold truncate">{event.title}</div>
//               <div>{event.date} {event.time}</div>
//               <div className="truncate">{event.location}</div>
//               <div className="mt-2">
//                 {joinedEvents[event.eventId] ? (
//                   <span className="text-green-600 font-semibold">{t('joined', language)}</span>
//                 ) : (
//                   <Button
//                     text={t('join', language)}
//                     size="sm"
//                     onClick={() => handleJoin(event.eventId)}
//                   />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Button from '@/app/components/Button';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ViewEvent from './viewEvent';

export default function Events({ idNumber, fullName, email }) {
  const [language, setLanguage] = useState(getLanguage());
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleJoin = async (eventId) => {
    if (!idNumber || !fullName || !email) {
      alert(t('missingUserDetails', language));
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/join-to-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, idNumber, fullName, email })
      });

      const data = await res.json();
      if (res.ok) {
        setJoinedEvents((prev) => ({ ...prev, [eventId]: true }));
        alert(t('successJoin', language));
      } else {
        alert(data.error || t('joinError', language));
      }
    } catch (err) {
      console.error('Join error:', err);
      alert(t('serverError', language));
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-center">{t('upcomingEvents', language)}</h2>

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
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center">{t('noEventsFound', language)}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEvents.map((event, i) => (
            <div
              key={i}
              className="border p-4 rounded shadow flex flex-col gap-2 overflow-hidden cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="text-lg font-bold truncate">{event.title}</div>
              <div>{event.date} {event.time}</div>
              <div className="truncate">{event.location}</div>
              <div className="mt-2">
                {joinedEvents[event.eventId] ? (
                  <span className="text-green-600 font-semibold">{t('joined', language)}</span>
                ) : (
                  <Button
                    text={t('join', language)}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoin(event.eventId);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <ViewEvent event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
