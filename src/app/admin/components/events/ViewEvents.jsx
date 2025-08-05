
'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button/Button';
import EditEvents from './EditEvents';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Edit2, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import { useLanguage } from "@/app/utils/language/useLanguage";
import sanitizeText from '@/app/utils/sanitizeText';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import DraggableAddButton from '@/app/components/DraggableButton/DraggableButton';
import CreateEvent from './CreateEvent';

export default function ViewEvents() {
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [showPast, setShowPast] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const language = useLanguage();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [showPast]);

  const fetchEvents = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/import-events${showPast ? '?includePast=true' : ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
        }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleDelete = async (event) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ eventId: event.eventId })
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.eventId !== event.eventId));
        setEventToDelete(null);
      }
    } catch (err) {
      console.error('Error deleteing event:', err);
    }
  };

  const filteredEvents = events.filter((e) => {
    const isPast = new Date(e.date) < new Date(); 
    const titleMatch = e.title.includes(filter.title);
    const dateMatch = !filter.date || e.date === filter.date;

    return (showPast ? isPast : !isPast) && titleMatch && dateMatch;
  });


  return (
    <>
      <GenericCardSection
        titleKey="viewEvents"
        filters={[
          <input
            key="title"
            type="text"
            placeholder={t('filterTitle', language)}
            value={filter.title}
            onChange={(e) => {
              const result = sanitizeText(e.target.value, 100);
              if (result.wasModified) {
                setToastMessage({
                  message: t('unsafeInputSanitized', language),
                  type: 'warning'
                });
              }
              setFilter({ ...filter, title: result.text });
            }}
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

            <div className="mt-2 flex gap-4">
              <button title={t('editevent', language)} onClick={(e) => { e.stopPropagation(); setEditingEvent(event); }}>
                <Edit2 size={18}/>
              </button>
              <button title={t('deleteEvent', language)} onClick={(e) => { e.stopPropagation(); setEventToDelete(event); }}>
                <Trash2 size={18} />
              </button>
            </div>
          </>

        )}
        onCardClick={() => {}}
        emptyTextKey="noEventsFound"
      />

      <DraggableAddButton
        title={t('createEventTitle', language)}
        onClick={() => setShowCreateEventModal(true)}
      />

      {showCreateEventModal && (
        <CreateEvent onClose={() => setShowCreateEventModal(false)} />
      )}

      {eventToDelete && (
        <ConfirmDialog
          title={t('confirmDelete', language)}
          message={t('confirmDeleteEvent', language)}
          onConfirm={() => handleDelete(eventToDelete)}
          onCancel={() => setEventToDelete(null)}
        />
      )}

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

      {toastMessage  && (
        <ToastMessage
          message={toastMessage.message}
          type={toastMessage.type}
          duration={3000}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
} 
