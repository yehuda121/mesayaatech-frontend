'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ViewEvent from './viewEvent';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import './Events.css';
import { Eye, CalendarPlus } from 'lucide-react';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ViewAllEvents({ idNumber, fullName, email }) {
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const language = useLanguage();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/import-events`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const futureEvents = data.filter(event => new Date(event.date) >= new Date());
      setEvents(futureEvents);

      const joinedMap = {};
      for (const event of futureEvents) {
        if (event.participants && Array.isArray(event.participants)) {
          const isJoined = event.participants.some(p => p.idNumber === idNumber);
          joinedMap[event.eventId] = isJoined;
        }
      }
      setJoinedEvents(joinedMap);
    } catch (err) {
      console.error('Failed to load events:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  const handleToggleJoin = async (eventId) => {
    if (!idNumber || !fullName || !email) {
      setToast({ message: t('missingUserDetails', language), type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/toggle-join-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, idNumber, fullName, email })
      });

      const data = await res.json();
      if (res.ok) {
        setJoinedEvents((prev) => ({ ...prev, [eventId]: data.joined }));
        setToast({ message: t(data.joined ? 'successJoin' : 'successUnjoin', language), type: 'success' });
      } else {
        setToast({ message: data.error || t('joinError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Join error:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
  );

  return (
    <>
      <GenericCardSection
        titleKey="upcomingEvents"
        filters={[
          <input
            key="title"
            type="text"
            placeholder={t('filterTitle', language)}
            className="card-filter flexible"
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
          />,
          <input
            key="date"
            type="date"
            className="card-filter date-filter"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        ]}
        data={filteredEvents}
        renderCard={(event) => (
          <>
            <div className="event-title">{event.title}</div>
            <div>{event.date} {event.time}</div>
            <div className="event-location">{event.location}</div>
            <div className="mt-2 flex items-center gap-3">
              {joinedEvents[event.eventId] ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleJoin(event.eventId);
                  }}
                  title={t('cancelJoin', language)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <CalendarPlus size={18} />
                  <span>{t('cancelJoin', language)}</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleJoin(event.eventId);
                  }}
                  title={t('join', language)}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <CalendarPlus size={18} />
                  <span>{t('conformArrive', language)}</span>
                </button>
              )}
              <button
                onClick={() => setSelectedEvent(event)}
                title={t('viewEventDetails', language)}
                className="text-blue-600 hover:text-blue-800 items-center flex gap-2"
              >
                <Eye size={18} />
                <span>{t('viewEvent', language)}</span>
              </button>
            </div>
          </>
        )}
        emptyTextKey="noEventsFound"
      />

      {selectedEvent && (
        <ViewEvent event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
