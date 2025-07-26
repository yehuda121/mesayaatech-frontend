import sanitizeText from '@/app/utils/sanitizeText';

const SanitizeMentorForm = ({ formData, language, t }) => {
  const errors = [];

  const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
  const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
  const idPattern = /^\d{9}$/;
  const urlPattern = /^https?:\/\/[\w.-]+\.\w+/;

  const rawFullName = formData.fullName?.trim() || '';
  const email = formData.email?.trim() || '';
  const phone = formData.phone?.trim() || '';
  const idNumber = formData.idNumber?.trim() || '';
  const location = formData.location?.trim() || '';
  const linkedin = formData.linkedin?.trim() || '';
  const fields = formData.fields || [];

  const { text: fullName, tooLong: fullNameTooLong, wasModified: fullNameModified } =
    sanitizeText(rawFullName, 50);
  const { text: profession, tooLong: professionTooLong, wasModified: professionModified } =
    sanitizeText(formData.profession || '', 60);
  const { text: experience, tooLong: experienceTooLong, wasModified: experienceModified } =
    sanitizeText(formData.experience || '', 1000);
  const { text: notes, tooLong: notesTooLong, wasModified: notesModified } =
    sanitizeText(formData.notes || '', 500);
  const { text: aboutMeIntroMentor, tooLong: aboutMeTooLong, wasModified: aboutMeModified } =
    sanitizeText(formData.aboutMeIntroMentor || '', 1000);
  const { text: specialties, tooLong: specialtiesTooLong, wasModified: specialtiesModified } = 
    sanitizeText(formData.specialties || '', 200);

  if(specialtiesTooLong) errors.push(t('specialtiesTooLong', language));
  else if(specialtiesModified) errors.push(t('unsafeInputSanitized', language));

  if (!fullName) {
    errors.push(t('fullNameRequired', language));
  } else if (/[^א-תa-zA-Z\s]/.test(fullName)) {
    errors.push(t('fullNameInvalid', language));
  } else if (fullNameTooLong) {
    errors.push(t('fullNameTooLong', language));
  } else if (fullNameModified) {
    errors.push(t('unsafeInputSanitized', language));
  }

  if (!idPattern.test(idNumber)) {
    errors.push(t('idNumberInvalid', language));
  }

  if (email && !emailPattern.test(email)) {
    errors.push(t('emailInvalid', language));
  } else if (email.length > 100) {
    errors.push(t('emailTooLong', language));
  }

  if (phone && !phonePattern.test(phone)) {
    errors.push(t('phoneInvalid', language));
  }

  if (!profession) {
    errors.push(t('professionRequired', language));
  } else if (professionTooLong) {
    errors.push(t('professionTooLong', language));
  } else if (professionModified) {
    errors.push(t('unsafeInputSanitized', language));
  }

  if (!location) {
    errors.push(t('locationRequired', language));
  } else if (location.length > 60) {
    errors.push(t('locationTooLong', language));
  }

  if (!experience) {
    errors.push(t('experienceRequired', language));
  } else if (experienceTooLong) {
    errors.push(t('experienceTooLong', language));
  } else if (experienceModified) {
    errors.push(t('unsafeInputSanitized', language));
  }

  if (linkedin && !urlPattern.test(linkedin)) {
    errors.push(t('linkedinInvalid', language));
  } else if (linkedin.length > 200) {
    errors.push(t('linkedinTooLong', language));
  }

  if (aboutMeTooLong) {
    errors.push(t('aboutMeTooLong', language));
  } else if (aboutMeModified) {
    errors.push(t('unsafeInputSanitized', language));
  }

  if (notesTooLong) {
    errors.push(t('notesIsTooLong', language));
  } else if (notesModified) {
    errors.push(t('unsafeInputSanitized', language));
  }

  return {
    errors,
    sanitized: {
      fullName,
      specialties,
      email,
      phone,
      idNumber,
      profession,
      location,
      fields,
      experience,
      linkedin,
      aboutMeIntroMentor,
      notes
    }
  };
};

export default SanitizeMentorForm;
