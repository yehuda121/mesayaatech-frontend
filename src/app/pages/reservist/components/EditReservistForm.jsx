'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditReservistForm({ userData, onSave, onBack }) {
  const [language, setLanguage] = useState(null);
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmClearMentor, setConfirmClearMentor] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    setLanguage(getLanguage());
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  // Load user data into form
  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        mentorId: userData.mentorId || null,
      });
      setInitialData({
        ...userData,
        mentorId: userData.mentorId || null,
      });
    }
  }, [userData]);

  if (!language) return null;

  const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

  const fields = [
    { key: 'fullName' },
    { key: 'email' },
    { key: 'phone' },
    { key: 'armyRole' },
    { key: 'location' },
    { key: 'fields' },
    { key: 'experience', type: 'textarea' },
    { key: 'linkedin' },
    { key: 'aboutMeIntro', type: 'textarea' },
    { key: 'notes', type: 'textarea' },
    {
      key: 'mentorId',
      type: 'checkbox',
      labelOverride: 'notInterestedInMentor',
      transform: {
        toValue: (val) => val === 'notInterested',
        fromEvent: (checked) => (checked ? 'notInterested' : null),
      },
    },
  ];

  const handleFieldChange = (newData) => {
    if (
      newData.mentorId === 'notInterested' &&
      initialData.mentorId &&
      initialData.mentorId !== 'notInterested'
    ) {
      setConfirmClearMentor(true);
    } else {
      setFormData(newData);
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName?.trim();
    const email = formData.email?.trim();
    const phone = formData.phone?.trim();
    const armyRole = formData.armyRole?.trim();
    const location = formData.location?.trim();
    const experience = formData.experience?.trim();
    const linkedin = formData.linkedin?.trim();

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (email && !emailPattern.test(email)) errors.push(t('emailInvalid', language));
    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!armyRole) errors.push(t('armyRoleRequired', language));
    else if (/[^\w\sא-ת]/.test(armyRole)) errors.push(t('armyRoleInvalid', language));

    if (!location) errors.push(t('locationRequired', language));
    if (!experience) errors.push(t('experienceRequired', language));
    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlertMessage({ message: validationErrors[0], type: 'error' });
      return;
    }

    setSaving(true);
    try {
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
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    onBack();
  };

  return (
    <>
      {alertMessage && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {confirmClearMentor && (
        <ConfirmDialog
          title={t('confirmRemoveMentorTitle', language)}
          message={t('confirmRemoveMentorText', language)}
          onConfirm={() => {
            setFormData({ ...formData, mentorId: 'notInterested' });
            setConfirmClearMentor(false);
          }}
          onCancel={() => setConfirmClearMentor(false)}
        />
      )}

      <GenericForm
        titleKey="editUserDetails"
        fields={fields}
        data={formData}
        onChange={handleFieldChange}
        onPrimary={handleSubmit}
        onSecondary={handleCancel}
        primaryLabel={saving ? '' : 'saveChanges'}
        secondaryLabel="cancel"
        disabledPrimary={!isModified}
      />
    </>
  );
}
