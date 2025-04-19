'use client';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events') 
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div>
      <h1>אירועים קרובים</h1>
      {events.length === 0 ? (
        <p>אין אירועים כרגע</p>
      ) : (
        <ul>
          {events.map((event, idx) => (
            <li key={idx} style={{ marginBottom: '20px' }}>
              <h3>{event.title}</h3>
              <p>📅 {event.date} 🕒 {event.time}</p>
              <p>📍 {event.location}</p>
              <p>{event.description}</p>
              {event.link && <a href={event.link} target="_blank" rel="noreferrer">לצפייה / הרשמה</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
