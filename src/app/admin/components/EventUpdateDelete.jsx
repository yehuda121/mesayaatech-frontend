// 'use client';
// import { useEffect, useState } from 'react';
// import Button from '../../../components/Button';
// import { getLanguage } from '../../language';

// const sanitizeTitleForKey = (title) => {
//   return title.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9א-ת-_]/g, '');
// };

// export default function EventUpdateDelete() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [events, setEvents] = useState([]);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', notes: '' });
//   const [filter, setFilter] = useState({ title: '', date: '' });

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
//       setEvents(data);
//     } catch (err) {
//       console.error('שגיאה בעת קבלת האירועים:', err);
//     }
//   };

//   const handleDelete = async (event) => {
//     const filename = `${event.date}-${sanitizeTitleForKey(event.title)}.json`;
//     const res = await fetch(`http://localhost:5000/api/delete-event`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ filename })
//     });
//     if (res.ok) fetchEvents();
//   };

//   const handleEditClick = (event) => {
//     setEditingEvent(event);
//     setFormData({ ...event });
//   };

//   const handleUpdate = async () => {
//     try {
//       const filename = `${editingEvent.date}-${sanitizeTitleForKey(editingEvent.title)}.json`;
//       const res = await fetch(`http://localhost:5000/api/update-event`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ filename, updatedData: formData })
//       });
//       if (res.ok) {
//         setEditingEvent(null);
//         fetchEvents();
//       }
//     } catch (err) {
//       console.error('שגיאה בעדכון אירוע:', err);
//     }
//   };

//   const t = {
//     updateTitle: { he: 'עדכון אירוע', en: 'Update Event' },
//     title: { he: 'כותרת', en: 'Title' },
//     description: { he: 'תיאור', en: 'Description' },
//     date: { he: 'תאריך', en: 'Date' },
//     time: { he: 'שעה', en: 'Time' },
//     location: { he: 'מיקום', en: 'Location' },
//     notes: { he: 'הערות', en: 'Notes' },
//     save: { he: 'שמור שינויים', en: 'Save Changes' },
//     cancel: { he: 'ביטול', en: 'Cancel' },
//     delete: { he: 'מחק', en: 'Delete' },
//     edit: { he: 'ערוך', en: 'Edit' },
//     filterTitle: { he: 'סנן לפי כותרת', en: 'Filter by title' },
//     filterDate: { he: 'סנן לפי תאריך', en: 'Filter by date' },
//   };

//   const filteredEvents = events.filter((e) =>
//     e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <h2 className="text-2xl font-bold text-center">{t.updateTitle[language]}</h2>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder={t.filterTitle[language]}
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
//         <p className="text-center">לא נמצאו אירועים</p>
//       ) : (
//         <div className="space-y-4">
//           {filteredEvents.map((event, i) => (
//             <div key={i} className="border p-4 rounded shadow flex flex-col gap-2">
//               <div className="text-lg font-bold">{event.title}</div>
//               <div>{event.date} {event.time}</div>
//               <div>{event.location}</div>
//               <div className="flex gap-2 mt-2">
//                 <Button text={t.edit[language]} onClick={() => handleEditClick(event)} />
//                 <Button text={t.delete[language]} color="danger" onClick={() => handleDelete(event)} />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {editingEvent && (
//         <div className="mt-8 border p-6 rounded bg-gray-50 shadow-md space-y-4">
//           <h3 className="text-xl font-bold text-center">{t.updateTitle[language]}</h3>
//           {["title", "description", "date", "time", "location", "notes"].map((key) => (
//             <label key={key} className="block">
//               {t[key][language]}
//               {key === "description" || key === "notes" ? (
//                 <textarea
//                   name={key}
//                   value={formData[key]}
//                   onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                   className="border p-2 w-full rounded h-20"
//                 />
//               ) : (
//                 <input
//                   name={key}
//                   type={key === "date" ? "date" : key === "time" ? "time" : "text"}
//                   value={formData[key]}
//                   onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                   className="border p-2 w-full rounded"
//                 />
//               )}
//             </label>
//           ))}
//           <div className="flex gap-2">
//             <Button text={t.save[language]} onClick={handleUpdate} />
//             <Button text={t.cancel[language]} color="gray" onClick={() => setEditingEvent(null)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { getLanguage } from '../../language';

// 🧼 ניקוי שם
const sanitizeTitleForKey = (title) => {
  return title.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9א-ת-_]/g, '');
};

export default function EventUpdateDelete() {
  const [language, setLanguage] = useState(getLanguage());
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', notes: '' });
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [showPast, setShowPast] = useState(false); // חדש

  useEffect(() => {
    fetchEvents();
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, [showPast]); // נשלח מחדש אם showPast משתנה

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
    const filename = `${event.date}-${sanitizeTitleForKey(event.title)}.json`;
    const res = await fetch(`http://localhost:5000/api/delete-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });
    if (res.ok) fetchEvents();
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setFormData({ ...event });
  };

  const handleUpdate = async () => {
    try {
      const filename = `${editingEvent.date}-${sanitizeTitleForKey(editingEvent.title)}.json`;
      const res = await fetch(`http://localhost:5000/api/update-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, updatedData: formData })
      });
      if (res.ok) {
        setEditingEvent(null);
        fetchEvents();
      }
    } catch (err) {
      console.error('שגיאה בעדכון אירוע:', err);
    }
  };

  const t = {
    updateTitle: { he: 'עדכון אירוע', en: 'Update Event' },
    title: { he: 'כותרת', en: 'Title' },
    description: { he: 'תיאור', en: 'Description' },
    date: { he: 'תאריך', en: 'Date' },
    time: { he: 'שעה', en: 'Time' },
    location: { he: 'מיקום', en: 'Location' },
    notes: { he: 'הערות', en: 'Notes' },
    save: { he: 'שמור שינויים', en: 'Save Changes' },
    cancel: { he: 'ביטול', en: 'Cancel' },
    delete: { he: 'מחק', en: 'Delete' },
    edit: { he: 'ערוך', en: 'Edit' },
    filterTitle: { he: 'סנן לפי כותרת', en: 'Filter by title' },
    filterDate: { he: 'סנן לפי תאריך', en: 'Filter by date' },
    togglePast: {
      he: showPast ? 'הסתר אירועים שעברו' : 'הצג אירועים שעברו',
      en: showPast ? 'Hide Past Events' : 'Show Past Events'
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.includes(filter.title) && (!filter.date || e.date === filter.date)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-center">{t.updateTitle[language]}</h2>

      <div className="flex gap-2 items-center">
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
        <Button
          text={t.togglePast[language]}
          size="sm"
          onClick={() => setShowPast(!showPast)}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center">לא נמצאו אירועים</p>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event, i) => (
            <div key={i} className="border p-4 rounded shadow flex flex-col gap-2">
              <div className="text-lg font-bold">{event.title}</div>
              <div>{event.date} {event.time}</div>
              <div>{event.location}</div>
              <div className="flex gap-2 mt-2">
                <Button text={t.edit[language]} onClick={() => handleEditClick(event)} />
                <Button text={t.delete[language]} color="danger" onClick={() => handleDelete(event)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEvent && (
        <div className="mt-8 border p-6 rounded bg-gray-50 shadow-md space-y-4">
          <h3 className="text-xl font-bold text-center">{t.updateTitle[language]}</h3>
          {["title", "description", "date", "time", "location", "notes"].map((key) => (
            <label key={key} className="block">
              {t[key][language]}
              {key === "description" || key === "notes" ? (
                <textarea
                  name={key}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="border p-2 w-full rounded h-20"
                />
              ) : (
                <input
                  name={key}
                  type={key === "date" ? "date" : key === "time" ? "time" : "text"}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="border p-2 w-full rounded"
                />
              )}
            </label>
          ))}
          <div className="flex gap-2">
            <Button text={t.save[language]} onClick={handleUpdate} />
            <Button text={t.cancel[language]} color="gray" onClick={() => setEditingEvent(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
