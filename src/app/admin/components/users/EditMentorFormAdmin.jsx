'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';

export default function EditMentorFormAdmin({ user, onClose, onSave, onDelete, reservists = [] }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(user);
  const [myReservists, setMyReservists] = useState([]);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

    useEffect(() => {
        const fetchReservists = async () => {
            try {
            const res = await fetch('http://localhost:5000/api/filter-users?userType=reservist');
            const data = await res.json();

            if (Array.isArray(data)) {
                const mine = data.filter(r => r.mentorId === `mentor#${formData.idNumber}`);
                setMyReservists(mine);
            }
            } catch (err) {
            console.error('Error loading reservists:', err);
            }
        };

        fetchReservists();
    }, [formData.idNumber]);


  // Handle field change
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const mentorFields = [
    'fullName', 'idNumber', 'email', 'phone', 'profession', 'location',
    'specialties', 'experience', 'pastMentoring', 'availability', 'linkedin', 'notes'
  ];

  return (
    <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="modal-box">
        <h2 className="form-title">{t('editUserDetails', language)}</h2>

        <form className="form-wrapper">
          {mentorFields.map((key) => (
            <label key={key} className="block mb-2">
              <span className="font-medium">{t(key, language)}</span>
              {(key === 'experience' || key === 'notes' || key === 'pastMentoring') ? (
                <textarea
                  className="w-full border p-2 rounded h-20"
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : Array.isArray(formData[key]) ? (
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={formData[key].join(', ')}
                  onChange={(e) => handleChange(key, e.target.value.split(',').map(s => s.trim()))}
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

          <div className="mt-4">
            <strong>{t('assignedReservists', language)}:</strong>
            {myReservists.length > 0 ? (
            <ul className="list-disc list-inside mt-2">
                {myReservists.map((r) => (
                <li key={r.idNumber}>
                    {r.fullName} ({r.phone})
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-600">{t('noReservistsAssigned', language)}</p>
            )}
          </div>
        </form>

        <div className="form-actions">
          <Button text={t('deleteUser', language)} color="red" onClick={() => {
            if (confirm(t('confirmDeleteUser', language))) onDelete(user);
          }} />
          <Button text={t('cancel', language)} onClick={onClose} />
          <Button text={t('saveChanges', language)} onClick={() => onSave(formData)} />
        </div>
      </div>
    </div>
  );
}
