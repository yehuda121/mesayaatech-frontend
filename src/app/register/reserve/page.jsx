'use client';
import { useState } from 'react';
import { db } from '../../../utils/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import Button from '../../../components/Button';

export default function MilouimnikRegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    armyRole: '',
    location: '',
    fields: [],
    experience: '',
    linkedin: '',
    notes: '',
  });

  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        fields: checked
          ? [...prev.fields, value]
          : prev.fields.filter((field) => field !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUserRef = doc(collection(db, 'pending_users', 'milouimnik', 'users'));

    await setDoc(newUserRef, {
      ...formData,
      createdAt: new Date(),
    });

    setSuccess('הבקשה נשלחה בהצלחה! ממתין לאישור מנהל');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">הרשמה למילואימניק</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>שם מלא*:
          <input name="fullName" required value={formData.fullName} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>אימייל*:
          <input name="email" type="email" required value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>מספר טלפון*:
          <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>תפקיד עיקרי במילואים*:
          <input name="armyRole" required value={formData.armyRole} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>מיקום גאוגרפי*:
          <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <fieldset>
          <legend className="font-semibold">אילו תחומי עיסוק רלוונטיים לך?* (בחר כמה שרוצים)</legend>
          {['הייטק', 'ניהול', 'לוגיסטיקה', 'חינוך', 'שיווק', 'אחר'].map((field) => (
            <label key={field} className="block">
              <input
                type="checkbox"
                name="fields"
                value={field}
                checked={formData.fields.includes(field)}
                onChange={handleChange}
                className="mr-2"
              />
              {field}
            </label>
          ))}
        </fieldset>

        <label>ניסיון מקצועי*:
          <textarea name="experience" required value={formData.experience} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <label>קישור ללינקדאין (לא חובה):
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>הערות נוספות (לא חובה):
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full rounded h-24" />
        </label>

        <Button text="שלח בקשה" type="submit" />
      </form>

      {success && <p className="text-green-600 text-center font-bold">{success}</p>}
    </div>
  );
}
