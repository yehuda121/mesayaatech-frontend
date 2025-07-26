import sanitizeText from '@/app/utils/sanitizeText';

const SanitizeAmbassadorForm = ({ formData, language, t }) => {
  const errors = [];

  const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
  const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
  const idPattern = /^\d{9}$/;
  const urlPattern = /^https?:\/\/[\w.-]+\.\w+/;

  const rawFullName = formData.fullName?.trim() || '';
  const email = formData.email?.trim() || '';
  const idNumber = formData.idNumber?.trim() || '';
  const phone = formData.phone?.trim() || '';
  const location = formData.location?.trim() || '';
  const canShareJobs = formData.canShareJobs?.trim() || '';
  const linkedin = formData.linkedin?.trim() || '';
  const jobFields = formData.jobFields || [];

  const { text: currentCompany, tooLong: currentCompanyTooLong, wasModified: currentCompanyModified } =
    sanitizeText(formData.currentCompany || '', 200);
  const { text: position, tooLong: positionTooLong, wasModified: positionModified } =
    sanitizeText(formData.position || '', 200);
  const { text: notes, tooLong: notesTooLong, wasModified: notesModified } =
    sanitizeText(formData.notes || '', 500);
  const { text: aboutMe, tooLong: aboutMeTooLong, wasModified: aboutMeModified } =
    sanitizeText(formData.aboutMe || '', 1000);

  if (!rawFullName) {
    errors.push(t('fullNameRequired', language));
  } else if (/[^א-תa-zA-Z\s]/.test(rawFullName)) {
    errors.push(t('fullNameInvalid', language));
  } else if (rawFullName.length > 50) {
    errors.push(t('fullNameTooLong', language));
  }

  if (!idPattern.test(idNumber)) {
    errors.push(t('idNumberInvalid', language));
  }

  if (phone && !phonePattern.test(phone)) {
    errors.push(t('phoneInvalid', language));
  }

  if (!location) {
    errors.push(t('locationRequired', language));
  } else if (location.length > 60) {
    errors.push(t('locationTooLong', language));
  }

  if (!canShareJobs) {
    errors.push(t('canShareRequired', language));
  }

  if (linkedin && !urlPattern.test(linkedin)) {
    errors.push(t('linkedinInvalid', language));
  } else if (linkedin.length > 200) {
    errors.push(t('linkedinTooLong', language));
  }

  if (currentCompanyTooLong) errors.push(t('currentCompanyIsTooLong', language));
  else if (currentCompanyModified) errors.push(t('unsafeInputSanitized', language));

  if (positionTooLong) errors.push(t('positionIsTooLong', language));
  else if (positionModified) errors.push(t('unsafeInputSanitized', language));

  if (notesTooLong) errors.push(t('notesIsTooLong', language));
  else if (notesModified) errors.push(t('unsafeInputSanitized', language));

  if (aboutMeTooLong) errors.push(t('aboutMeIsTooLong', language));
  else if (aboutMeModified) errors.push(t('unsafeInputSanitized', language));

  return {
    errors,
    sanitized: {
      fullName: rawFullName,
      email,
      idNumber,
      phone,
      location,
      canShareJobs,
      linkedin,
      jobFields,
      currentCompany,
      position,
      notes,
      aboutMe
    }
  };
};

export default SanitizeAmbassadorForm;
