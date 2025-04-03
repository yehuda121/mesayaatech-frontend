'use client';
import { useState } from 'react';
import Button from '../../../components/Button';

export default function ambassadorRegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    currentCompany: '',
    position: '',
    location: '',
    canShareJobs: '',
    jobFields: [],
    linkedin: '',
    notes: '',
    userType: 'ambassador'
  });

  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        jobFields: checked
          ? [...prev.jobFields, value]
          : prev.jobFields.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
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
          currentCompany: '',
          position: '',
          location: '',
          canShareJobs: '',
          jobFields: [],
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
      <h1 className="text-3xl font-bold text-center">הרשמה לשגריר</h1>

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

        <label>חברה נוכחית בה אתה עובד:
          <input name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>תפקיד נוכחי:
          <input name="position" value={formData.position} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>מיקום גאוגרפי*:
          <input name="location" required value={formData.location} onChange={handleChange} className="border p-2 w-full rounded" />
        </label>

        <label>האם תוכל לשתף משרות מהארגון שלך?*:
          <select name="canShareJobs" required value={formData.canShareJobs} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="">בחר</option>
            <option value="כן">כן</option>
            <option value="אולי">אולי</option>
            <option value="לא">לא</option>
          </select>
        </label>

        <fieldset>
          <legend className="font-semibold">באילו תחומים יש לך גישה למשרות?</legend>
          {['הייטק', 'פיננסים', 'לוגיסטיקה', 'שיווק', 'חינוך', 'אחר'].map((field) => (
            <label key={field} className="block">
              <input
                type="checkbox"
                name="jobFields"
                value={field}
                checked={formData.jobFields.includes(field)}
                onChange={handleChange}
                className="mr-2"
              />
              {field}
            </label>
          ))}
        </fieldset>

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
