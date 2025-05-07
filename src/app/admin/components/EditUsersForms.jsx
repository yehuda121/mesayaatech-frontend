'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '../../language';
import Button from '../../../components/Button';

export default function EditUsersForms({ user, onClose, onSave, onDelete }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const labels = {
    fullName: { he: 'שם מלא', en: 'Full Name' },
    idNumber: { he: 'תעודת זהות', en: 'ID Number' },
    email: { he: 'אימייל', en: 'Email' },
    phone: { he: 'טלפון', en: 'Phone' },
    armyRole: { he: 'תפקיד בצבא', en: 'Army Role' },
    profession: { he: 'מקצוע', en: 'Profession' },
    location: { he: 'מיקום', en: 'Location' },
    fields: { he: 'תחומי עניין', en: 'Fields of Interest' },
    specialties: { he: 'תחומי התמחות', en: 'Specialties' },
    experience: { he: 'ניסיון תעסוקתי', en: 'Experience' },
    pastMentoring: { he: 'ניסיון בליווי קודם', en: 'Past Mentoring' },
    availability: { he: 'זמינות לליווי', en: 'Availability' },
    currentCompany: { he: 'מקום עבודה נוכחי', en: 'Current Company' },
    position: { he: 'תפקיד בארגון', en: 'Position' },
    canShareJobs: { he: 'יכול לשתף משרות', en: 'Can Share Jobs' },
    jobFields: { he: 'תחומי משרה', en: 'Job Fields' },
    linkedin: { he: 'לינקדאין', en: 'LinkedIn' },
    notes: { he: 'הערות', en: 'Notes' },
    status: { he: 'סטטוס', en: 'Status' },
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderField = (key) => {
    const isArray = Array.isArray(formData[key]);
    return (
      <label key={key} className="block mb-2">
        <span className="font-medium">{labels[key]?.[language] || key}</span>
        {isArray ? (
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData[key].join(', ')}
            onChange={(e) => handleChange(key, e.target.value.split(',').map(s => s.trim()))}
          />
        ) : key === 'notes' || key === 'experience' || key === 'pastMentoring' ? (
          <textarea
            className="w-full border p-2 rounded h-20"
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
    );
  };

  const keysByType = {
    reservist: [
      'fullName', 'idNumber', 'email', 'phone', 'armyRole', 'location',
      'fields', 'experience', 'linkedin', 'notes', 'status'
    ],
    mentor: [
      'fullName', 'idNumber', 'email', 'phone', 'profession', 'location',
      'specialties', 'experience', 'pastMentoring', 'availability', 'linkedin', 'notes', 'status'
    ],
    ambassador: [
      'fullName', 'idNumber', 'email', 'phone', 'currentCompany', 'position',
      'location', 'canShareJobs', 'jobFields', 'linkedin', 'notes', 'status'
    ]
  };

  const fieldsToRender = keysByType[formData.userType] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl overflow-y-auto max-h-[90vh]" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {language === 'he' ? 'עריכת פרטי משתמש' : 'Edit User Details'}
        </h2>

        <form className="space-y-4">
          {fieldsToRender.map(renderField)}
        </form>

        <div className="flex justify-between gap-3 mt-6 flex-wrap">
          <Button
            text={language === 'he' ? 'מחק משתמש' : 'Delete User'}
            color="danger"
            onClick={() => {
              if (confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק את המשתמש?' : 'Are you sure you want to delete this user?')) {
                onDelete(user);
              }
            }}
          />

          <div className="flex gap-2 ml-auto">
            <Button
              text={language === 'he' ? 'ביטול' : 'Cancel'}
              onClick={onClose}
            />
            <Button
              text={language === 'he' ? 'שמור שינויים' : 'Save Changes'}
              onClick={() => onSave(formData)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}