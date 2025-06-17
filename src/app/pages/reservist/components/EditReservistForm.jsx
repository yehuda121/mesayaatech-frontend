'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';
import Button from '@/app/components/Button';
import '../../../register/registrationForm.css';
import { locations } from '@/app/components/Locations';
import sanitizeText from '@/app/utils/sanitizeText';

export default function EditReservistForm({ userData, mentorId, mentorName, onSave, onClose, onDelete, role }) {
  const [language, setLanguage] = useState(getLanguage());
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'fields') {
        setFormData(prev => ({
          ...prev,
          fields: checked
            ? [...(prev.fields || []), value]
            : (prev.fields || []).filter(f => f !== value),
        }));
      } else if (name === 'notInterestedInMentor') {
        handleNotInterestedChange(checked);
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNotInterestedChange = (newValue) => {
    if (formData.notInterestedInMentor !== newValue) {
      if (mentorId) {
        setConfirmDialog({
          title: t('confirmRemoveMentorTitle', language),
          message: t('confirmRemoveMentorWithDataText', language),
          onConfirm: () => {
            setFormData(prev => ({ ...prev, notInterestedInMentor: newValue }));
            setConfirmDialog(null);
          },
          onCancel: () => setConfirmDialog(null)
        });
        return;
      }

      setConfirmDialog({
        title: newValue ? t('confirmNotInterestedTitle', language) : t('confirmInterestedTitle', language),
        message: newValue ? t('confirmNotInterestedText', language) : t('confirmInterestedText', language),
        onConfirm: () => {
          setFormData(prev => ({ ...prev, notInterestedInMentor: newValue }));
          setConfirmDialog(null);
        },
        onCancel: () => setConfirmDialog(null)
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
    const idPattern = /^\d{9}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    const fullName = formData.fullName?.trim() || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const idNumber = formData.idNumber?.trim() || '';
    const armyRole = sanitizeText(formData.armyRole || '', 60);
    const location = formData.location?.trim() || '';
    const fields = formData.fields || [];
    const experience = sanitizeText(formData.experience || '', 1000);
    const linkedin = formData.linkedin?.trim() || '';
    const aboutMeIntro = sanitizeText(formData.aboutMeIntro || '', 1000);
    const notes = sanitizeText(formData.notes || '', 500);

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));
    else if (fullName.length > 50) errors.push(t('fullNameTooLong', language));

    if (!idPattern.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (email && !emailPattern.test(email)) errors.push(t('emailInvalid', language));
    else if (email.length > 100) errors.push(t('emailTooLong', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!armyRole) errors.push(t('armyRoleRequired', language));
    else if (armyRole === 'tooLong') errors.push(t('professionTooLong', language));

    if (!location) errors.push(t('locationRequired', language));
    else if (location.length > 60) errors.push(t('locationTooLong', language));

    if (!experience) errors.push(t('experienceRequired', language));
    else if (experience === 'tooLong') errors.push(t('experienceTooLong', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));
    else if (linkedin.length > 200) errors.push(t('linkedinTooLong', language));

    if (aboutMeIntro === 'tooLong') errors.push(t('aboutMeTooLong', language));
    if (notes === 'tooLong') errors.push(t('notesIsTooLong', language));

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlertMessage({ message: validationErrors[0], type: 'error' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    try {
      if (formData.notInterestedInMentor && mentorId) {
        const resDelete = await fetch('http://localhost:5000/api/delete-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservistId: userData.idNumber, mentorId: mentorId })
        });

        if (!resDelete.ok) {
          const result = await resDelete.json();
          setAlertMessage({ message: result.error || t('mentorRemoveFailed', language), type: 'error' });
          return;
        }

        formData.mentorId = null;
      }

      const res = await fetch('http://localhost:5000/api/update-user-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setAlertMessage({ message: t('saveSuccess', language), type: 'success' });
        setInitialData(formData);
        onSave(result);
      } else {
        setAlertMessage({ message: result.error || t('saveError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error saving user form:', err);
      setAlertMessage({ message: t('saveError', language), type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setAlertMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onClose) onClose();
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleDeleteClick = () => {
    if (confirm(t('confirmDeleteUser', language))) {
      onDelete(userData);
    }
  };

  return (
    <div className="register-page">
      <div className={`register-form-container ${language === 'he' ? 'register-form-direction-rtl' : 'register-form-direction-ltr'}`}>
        <div className="register-form-top-buttons">
          <button
            onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            className="text-sm underline hover:text-blue-600"
          >
            {t('switchLang', language)}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">{t('editUserDetails', language)}</h1>

        <form onSubmit={handleSubmit}>
          <label>{t('fullName', language)}*:
            <input name="fullName" value={formData.fullName || ''} onChange={handleChange} />
          </label>

          <label>{t('idNumber', language)}*:
            <input name="idNumber" value={formData.idNumber || ''} readOnly />
          </label>

          <label>{t('email', language)}*:
            <input name="email" value={formData.email || ''} readOnly />
          </label>

          <label>{t('phone', language)}:
            <input name="phone" value={formData.phone || ''} onChange={handleChange} />
          </label>

          <label>{t('armyRole', language)}*:
            <input name="armyRole" value={formData.armyRole || ''} onChange={handleChange} />
          </label>

          <label>{t('location', language)}*:
            <select name="location" value={formData.location} onChange={handleChange}>
              <option value="">{t('selectLocation', language)}</option>
              {locations.map((region, regionIndex) => (
                <optgroup 
                  key={regionIndex} 
                  className='font-bold'
                  label={language === 'he' ? region.region.he : region.region.en}
                >
                  {region.locations.map((loc, locIndex) => (
                    <option key={locIndex} value={language === 'he' ? loc.he : loc.en}>
                      {language === 'he' ? loc.he : loc.en}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>{t('fields', language)}</legend>
            {['הייטק', 'ניהול', 'לוגיסטיקה', 'חינוך', 'שיווק', 'אחר'].map((field) => (
              <label key={field} className="register-checkbox-label" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
                <input
                  type="checkbox"
                  name="fields"
                  value={field}
                  checked={(formData.fields || []).includes(field)}
                  onChange={handleChange}
                />
                {field}
              </label>
            ))}
          </fieldset>


          <label>{t('experience', language)}*:
            <textarea name="experience" value={formData.experience || ''} onChange={handleChange} />
          </label>

          <label>{t('linkedin', language)}:
            <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} />
          </label>

          <label>{t('aboutMeIntro', language)}:
            <textarea name="aboutMeIntro" value={formData.aboutMeIntro || ''} onChange={handleChange} />
          </label>

          <label>{t('notes', language)}:
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} />
          </label>

          <label className="register-checkbox-label">
            <input type="checkbox" name="notInterestedInMentor" checked={formData.notInterestedInMentor || false} onChange={handleChange} />
            {t('notInterestedInMentor', language)}
          </label>

          <div className="register-buttons-group">
            <Button text={t('saveChanges', language)} type="submit" disabled={!isModified || saving} />
            <Button text={t('cancel', language)} type="button" onClick={handleCancel} />
            {role === 'admin' && (
              <Button color='red' text={t('deleteUser', language)} type="button" onClick={handleDeleteClick} />
            )}
          </div>
        </form>

        {alertMessage && (
          <AlertMessage message={alertMessage.message} type={alertMessage.type} onClose={() => setAlertMessage(null)} />
        )}

        {confirmDialog && (
          <ConfirmDialog title={confirmDialog.title} message={confirmDialog.message} onConfirm={confirmDialog.onConfirm} onCancel={confirmDialog.onCancel} />
        )}
      </div>
    </div>
  );
}
