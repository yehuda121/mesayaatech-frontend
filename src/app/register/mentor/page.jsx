'use client';
import { useState } from 'react';
import Button from '../../../components/Button';

export default function mentorRegisterForm() {
  const [formData, setFormData] = useState({
    userType: 'mentor',
    status: 'pending',
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    specialties: [],
    experience: '',
    pastMentoring: '',
    availability: '',
    linkedin: '',
    notes: '',
  });

  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        specialties: checked
          ? [...prev.specialties, value]
          : prev.specialties.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/upload-registration-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess('הרישום נשלח בהצלחה!');
        setFormData({
          fullName: '',
          idNumber: '',
          email: '',
          phone: '',
          profession: '',
          location: '',
          specialties: [],
          experience: '',
          pastMentoring: '',
          availability: '',
          linkedin: '',
          notes: '',
        });
      } else {
        throw new Error('שליחה נכשלה');
      }
    } catch (err) {
      console.error('שגיאה:', err);
      setSuccess('אירעה שגיאה בשליחה');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">הרשמה למנטור</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>שם מלא*:
          <input name="fullName" required value={formData.fullName} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>תעודת זהות*:
          <input name="idNumber" required value={formData.idNumber} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>אימייל*:
          <input name="email" type="email" required value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>מספר טלפון*:
          <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>תחום עיסוק עיקרי*:
          <input name="profession" required value={formData.profession} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>מיקום גאוגרפי*:
          <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <fieldset>
          <legend className="font-semibold">תחומי מומחיות (אפשר לבחור כמה):</legend>
          {['חיפוש עבודה', 'כתיבת קורות חיים', 'הכנה לראיונות', 'בניית מסלול קריירה', 'שיפור מיומנויות רכות', 'אחר'].map((field) => (
            <label key={field} className="block">
              <input
                type="checkbox"
                name="specialties"
                value={field}
                checked={formData.specialties.includes(field)}
                onChange={handleChange}
                className="mr-2"
              />
              {field}
            </label>
          ))}
        </fieldset>

        <label>רקע מקצועי (ציין ניסיון רלוונטי)*:
          <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <label>ניסיון קודם בהדרכה/מנטורינג:
          <textarea name="pastMentoring" value={formData.pastMentoring} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <label>זמינות (שעות/ימים מועדפים):
          <input name="availability" value={formData.availability} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>לינקדאין (לא חובה):
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>הערות נוספות:
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <Button text="שלח בקשה" type="submit" />
      </form>

      {success && <p className="text-green-600 text-center font-bold">{success}</p>}
    </div>
  );
}
