'use client';
import { useEffect, useState } from 'react';

export default function EventUpdateDelete() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({ title: '', date: '' });

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/import-events');
  
      if (!res.ok) {
        const text = await res.text();
        console.error('שגיאת רשת או נתיב:', res.status, text);
        return;
      }
  
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('שגיאה בעת קבלת האירועים:', err);
    }
  };
  

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (event) => {
    const filename = `${event.date}-${event.title.replace(/\s+/g, '-')}.json`;
    const res = await fetch(`http://localhost:5000/api/delete-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });
    if (res.ok) fetchEvents();
  };

  const filteredEvents = events.filter((e) => {
    return (
      e.title.includes(filter.title) &&
      (!filter.date || e.date === filter.date)
    );
  });

  return (
    <div>
      <h2>עדכון / מחיקת אירועים</h2>
      <div style={{ marginBottom: '1em' }}>
        <input
          type="text"
          placeholder="סנן לפי כותרת"
          value={filter.title}
          onChange={(e) => setFilter({ ...filter, title: e.target.value })}
        />
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>
      {filteredEvents.length === 0 ? (
        <p>לא נמצאו אירועים</p>
      ) : (
        <ul>
          {filteredEvents.map((event, i) => (
            <li key={i} style={{ marginBottom: '1em' }}>
              <strong>{event.title}</strong> – {event.date} {event.time}<br />
              <small>{event.location}</small><br />
              <button onClick={() => handleDelete(event)}>מחק</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
