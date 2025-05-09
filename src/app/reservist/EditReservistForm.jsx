'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import Button from '@/components/Button';

export default function EditReservistForm({ userData, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);



  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);
  useEffect(() => {
    if (userData) {
      setFormData(userData);
      setInitialData(userData);
    }
  }, [userData]);

  const labels = {
    fullName: { he: 'שם מלא', en: 'Full Name' },
    email: { he: 'אימייל', en: 'Email' },
    phone: { he: 'טלפון', en: 'Phone' },
    armyRole: { he: 'תפקיד בצבא', en: 'Army Role' },
    location: { he: 'מיקום', en: 'Location' },
    fields: { he: 'תחומי עניין', en: 'Fields of Interest' },
    experience: { he: 'ניסיון תעסוקתי', en: 'Experience' },
    linkedin: { he: 'לינקדאין', en: 'LinkedIn' },
    notes: { he: 'הערות', en: 'Notes' }
  };

  const keys = Object.keys(labels);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (res.ok) {
        alert(language === 'he' ? 'הפרטים נשמרו בהצלחה' : 'Details saved successfully');
        setInitialData(formData);
        onSave(result);
      } else {
        alert(result.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Error saving user form:', err);
      alert(language === 'he' ? 'שגיאה בעת שמירה' : 'Error while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-center">
        {language === 'he' ? 'עריכת פרטים אישיים' : 'Edit Personal Information'}
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map((key) => (
          <label key={key} className="block">
            <span className="font-medium">{labels[key][language]}</span>
            {key === 'experience' || key === 'notes' ? (
              <textarea
                className="w-full border p-2 rounded h-24"
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </label>
        ))}
      </form>

      <div className="flex justify-end mt-6 gap-2">
        <Button
          text={language === 'he' ? 'ביטול' : 'Cancel'}
          onClick={handleCancel}
          disabled={!isModified}
        />
        <Button
          text={saving ? '...' : language === 'he' ? 'שמור שינויים' : 'Save Changes'}
          onClick={handleSubmit}
          disabled={!isModified}
        />
      </div>
    </div>
  );
}