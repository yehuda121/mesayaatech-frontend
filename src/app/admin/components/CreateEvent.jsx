'use client';
import { useState } from 'react';
import Button from '../../../components/Button';

export default function EventUploadForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    link: '',
    notes: ''
  });

  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/upload-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      //------------
      let resData;
      try {
        resData = await res.json();
      } catch (e) {
        const text = await res.text();
        console.error('תגובה לא JSON:', text);
        setSuccess('שגיאה לא צפויה בשרת');
        return;
      }
      //------------
      if (res.ok) {
        setSuccess('האירוע נוסף בהצלחה!');
        setFormData({
          title: '',
          date: '',
          time: '',
          location: '',
          description: '',
          link: '',
          notes: ''
        });
      } else {
        console.error('שגיאה מהשרת:', resData);
        setSuccess(`שגיאה: ${resData.error || 'העלאה נכשלה'}`);
      }
    } catch (err) {
      console.error('שגיאה:', err);
      setSuccess('אירעה שגיאה בעת ההעלאה');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">יצירת אירוע חדש</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>כותרת האירוע*:
          <input name="title" required value={formData.title} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>תאריך האירוע*:
          <input name="date" type="date" required value={formData.date} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>שעת התחלה:
          <input name="time" type="time" value={formData.time} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>מיקום האירוע:
          <input name="location" value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>תיאור האירוע:
          <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <label>קישור להשתתפות:
          <input name="link" value={formData.link} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>הערות נוספות:
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-20" />
        </label>

        <Button text="צור אירוע" type="submit" />
      </form>

      {success && <p className="text-green-600 text-center font-bold">{success}</p>}
    </div>
  );
}
