// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import AlertMessage from '@/app/components/notifications/AlertMessage';
// import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';
// import GenericForm from '@/app/components/GenericForm/GenericForm';

// export default function EditReservistForm({ userData, mentorId, mentorName , onSave, onBack }) {
//   const [language, setLanguage] = useState(null);
//   const [formData, setFormData] = useState(userData || {});
//   const [initialData, setInitialData] = useState(userData || {});
//   const [saving, setSaving] = useState(false);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [confirmDialog, setConfirmDialog] = useState(null);

//   useEffect(() => {
//     setLanguage(getLanguage());
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   useEffect(() => {
//     if (userData) {
//       setFormData(userData);
//       setInitialData(userData);
//     }
//   }, [userData]);

//   if (!language) return null;

//   const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);

//   // Define fields for GenericForm 
//   const fields = [
//     { key: 'fullName' },
//     { key: 'email' },
//     { key: 'phone' },
//     { key: 'armyRole' },
//     { key: 'location' },
//     { key: 'fields' },
//     { key: 'experience', type: 'textarea' },
//     { key: 'linkedin' },
//     { key: 'aboutMeIntro', type: 'textarea' },
//     { key: 'notes', type: 'textarea' },
//     { key: 'notInterestedInMentor', type: 'checkbox', labelOverride: 'notInterestedInMentor' }
//   ];

//   // Handle form field changes and trigger confirmation dialog when required
//   const handleFieldChange = (newData) => {
//     // Only run confirmation logic when 'notInterestedInMentor' is changed
//     if (formData.notInterestedInMentor !== newData.notInterestedInMentor) {
//       const wasInterested = !formData.notInterestedInMentor;
//       const nowInterested = !newData.notInterestedInMentor;

//       if (mentorId) {
//         setConfirmDialog({
//           title: t('confirmRemoveMentorTitle', language),
//           message: t('confirmRemoveMentorWithDataText', language),
//           onConfirm: () => handleMentorRemoval(newData),
//           onCancel: () => setConfirmDialog(null)
//         });
//         return;
//       }

//       if (wasInterested && !nowInterested) {
//         setConfirmDialog({
//           title: t('confirmInterestedTitle', language),
//           message: t('confirmInterestedText', language),
//           onConfirm: () => {
//             setFormData(newData);
//             setConfirmDialog(null);
//           },
//           onCancel: () => setConfirmDialog(null)
//         });
//       } else if (!wasInterested && nowInterested) {
//         setConfirmDialog({
//           title: t('confirmNotInterestedTitle', language),
//           message: t('confirmNotInterestedText', language),
//           onConfirm: () => {
//             setFormData(newData);
//             setConfirmDialog(null);
//           },
//           onCancel: () => setConfirmDialog(null)
//         });
//       } else {
//         setFormData(newData);
//       }
//     } else {
//       // Regular fields update directly
//       setFormData(newData);
//     }
//   };


//   // Handle mentor removal including backend deletion of process data
//   const handleMentorRemoval = async (newData) => {
//     try {
//       const res = await fetch('http://localhost:5000/api/delete-progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reservistId: userData.idNumber, mentorId: mentorId })
//       });

//       if (res.ok) {
//         setFormData({ ...newData });
//         setAlertMessage({ message: t('mentorRemovedSuccess', language), type: 'success' });
//       } else {
//         const result = await res.json();
//         setAlertMessage({ message: result.error || t('mentorRemoveFailed', language), type: 'error' });
//       }
//     } catch (err) {
//       console.error('Error removing mentor:', err);
//       setAlertMessage({ message: t('mentorRemoveFailed', language), type: 'error' });
//     } finally {
//       setConfirmDialog(null);
//     }
//   };

//   // Validate form fields before save
//   const validateForm = () => {
//     const errors = [];
//     const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
//     const phonePattern = /^\d{9,10}$/;
//     const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

//     const fullName = formData.fullName?.trim() || '';
//     const email = formData.email?.trim() || '';
//     const phone = formData.phone?.trim() || '';
//     const armyRole = formData.armyRole?.trim() || '';
//     const location = formData.location?.trim() || '';
//     const experience = formData.experience?.trim() || '';
//     const linkedin = formData.linkedin?.trim() || '';

//     if (!fullName) errors.push(t('fullNameRequired', language));
//     else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));
//     else if (fullName.length > 50) errors.push(t('fullNameTooLong', language));

//     if (email && !emailPattern.test(email)) errors.push(t('emailInvalid', language));
//     else if (email.length > 100) errors.push(t('emailTooLong', language));

//     if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

//     if (!armyRole) errors.push(t('armyRoleRequired', language));
//     else if (/[^\w\sא-ת]/.test(armyRole)) errors.push(t('armyRoleInvalid', language));
//     else if (armyRole.length > 60) errors.push(t('professionTooLong', language));  

//     if (!location) errors.push(t('locationRequired', language));
//     else if (location.length > 60) errors.push(t('locationTooLong', language));

//     if (!experience) errors.push(t('experienceRequired', language));
//     else if (experience.length > 1000) errors.push(t('experienceTooLong', language));

//     if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));
//     else if (linkedin.length > 200) errors.push(t('linkedinTooLong', language));

//     return errors;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       setAlertMessage({ message: validationErrors[0], type: 'error' });
//       return false;
//     }

//     setSaving(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/update-user-form', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const result = await res.json();
//       if (res.ok) {
//         setAlertMessage({ message: t('saveSuccess', language), type: 'success' });
//         setInitialData(formData);
//         onSave(result);
//         return true;
//       } else {
//         setAlertMessage({ message: result.error || t('saveError', language), type: 'error' });
//         return false;
//       }
//     } catch (err) {
//       console.error('Error saving user form:', err);
//       setAlertMessage({ message: t('saveError', language), type: 'error' });
//       return false;
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData(initialData);
//     onBack();
//   };

//   return (
//     <>
//       {alertMessage && (
//         <AlertMessage message={alertMessage.message} type={alertMessage.type} onClose={() => setAlertMessage(null)} />
//       )}

//       {confirmDialog && (
//         <ConfirmDialog
//           title={confirmDialog.title}
//           message={confirmDialog.message}
//           onConfirm={confirmDialog.onConfirm}
//           onCancel={confirmDialog.onCancel}
//         />
//       )}

//       <GenericForm
//         titleKey="editUserDetails"
//         fields={fields}
//         data={formData}
//         onChange={handleFieldChange}
//         onPrimary={handleSubmit}
//         onSecondary={handleCancel}
//         primaryLabel={saving ? '' : 'saveChanges'}
//         secondaryLabel="cancel"
//         disabledPrimary={!isModified}
//       >
//       <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
//         {t('assignedMentor', language)}: {mentorName || t('noMentorAssigned', language)}
//       </div>

//       </GenericForm>
//     </>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function EditReservistForm({ userData, mentorId, mentorName, onSave, onBack }) {
  const [language, setLanguage] = useState(null);
  const [formData, setFormData] = useState(userData || {});
  const [initialData, setInitialData] = useState(userData || {});
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
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
    { key: 'notInterestedInMentor', type: 'checkbox', labelOverride: 'notInterestedInMentor' }
  ];

  const handleFieldChange = (newData) => {
    if (formData.notInterestedInMentor !== newData.notInterestedInMentor) {
      const wasInterested = !formData.notInterestedInMentor;
      const nowInterested = !newData.notInterestedInMentor;

      if (mentorId) {
        setConfirmDialog({
          title: t('confirmRemoveMentorTitle', language),
          message: t('confirmRemoveMentorWithDataText', language),
          onConfirm: () => {
            setFormData(newData);
            setConfirmDialog(null);
          },
          onCancel: () => setConfirmDialog(null)
        });
        return;
      }

      if (wasInterested && !nowInterested) {
        setConfirmDialog({
          title: t('confirmNotInterestedTitle', language),
          message: t('confirmNotInterestedText', language),
          onConfirm: () => {
            setFormData(newData);
            setConfirmDialog(null);
          },
          onCancel: () => setConfirmDialog(null)
        });
      } else if (!wasInterested && nowInterested) {
        setConfirmDialog({
          title: t('confirmInterestedTitle', language),
          message: t('confirmInterestedText', language),
          onConfirm: () => {
            setFormData(newData);
            setConfirmDialog(null);
          },
          onCancel: () => setConfirmDialog(null)
        });
      } else {
        setFormData(newData);
      }
    } else {
      setFormData(newData);
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^\d{9,10}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    const fullName = formData.fullName?.trim() || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const armyRole = formData.armyRole?.trim() || '';
    const location = formData.location?.trim() || '';
    const experience = formData.experience?.trim() || '';
    const linkedin = formData.linkedin?.trim() || '';

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));
    else if (fullName.length > 50) errors.push(t('fullNameTooLong', language));

    if (email && !emailPattern.test(email)) errors.push(t('emailInvalid', language));
    else if (email.length > 100) errors.push(t('emailTooLong', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!armyRole) errors.push(t('armyRoleRequired', language));
    else if (/[^\w\sא-ת]/.test(armyRole)) errors.push(t('armyRoleInvalid', language));
    else if (armyRole.length > 60) errors.push(t('professionTooLong', language));

    if (!location) errors.push(t('locationRequired', language));
    else if (location.length > 60) errors.push(t('locationTooLong', language));

    if (!experience) errors.push(t('experienceRequired', language));
    else if (experience.length > 1000) errors.push(t('experienceTooLong', language));

    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));
    else if (linkedin.length > 200) errors.push(t('linkedinTooLong', language));

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlertMessage({ message: validationErrors[0], type: 'error' });
      return false;
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
          return false;
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
        return true;
      } else {
        setAlertMessage({ message: result.error || t('saveError', language), type: 'error' });
        return false;
      }
    } catch (err) {
      console.error('Error saving user form:', err);
      setAlertMessage({ message: t('saveError', language), type: 'error' });
      return false;
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
        <AlertMessage message={alertMessage.message} type={alertMessage.type} onClose={() => setAlertMessage(null)} />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
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
      >
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          {t('assignedMentor', language)}: {mentorName || t('noMentorAssigned', language)}
        </div>
      </GenericForm>
    </>
  );
}
