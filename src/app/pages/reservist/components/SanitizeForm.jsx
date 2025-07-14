 import sanitizeText from '@/app/utils/sanitizeText';

 const SanitizeForm = ({ formData, language, t }) => {
    const errors = [];

    // Validation patterns
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
    const idPattern = /^\d{9}$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+/;

    // Raw values (not sanitized)
    const rawFullName = formData.fullName?.trim() || '';
    const email = formData.email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const idNumber = formData.idNumber?.trim() || '';
    const location = formData.location?.trim() || '';
    const linkedin = formData.linkedin?.trim() || '';
    const fields = formData.fields || [];

    // Sanitized free-text fields with indication of changes
    const { text: fullName, tooLong: fullNameTooLong, wasModified: fullNameModified } =
      sanitizeText(rawFullName, 50);

    const { text: armyRole, tooLong: armyRoleTooLong, wasModified: armyRoleModified } =
      sanitizeText(formData.armyRole || '', 60);

    const { text: experience, tooLong: experienceTooLong, wasModified: experienceModified } =
      sanitizeText(formData.experience || '', 1000);

    const { text: aboutMeIntro, tooLong: aboutMeTooLong, wasModified: aboutMeModified } =
      sanitizeText(formData.aboutMeIntro || '', 1000);

    const { text: notes, tooLong: notesTooLong, wasModified: notesModified } =
      sanitizeText(formData.notes || '', 500);

    // Full name validation
    if (!fullName) {
      errors.push(t('fullNameRequired', language));
    } else if (/[^א-תa-zA-Z\s]/.test(fullName)) {
      errors.push(t('fullNameInvalid', language));
    } else if (fullNameTooLong) {
      errors.push(t('fullNameTooLong', language));
    } else if (fullNameModified) {
      errors.push(t('fullNameSanitized', language)); 
    }

    // ID number validation
    if (!idPattern.test(idNumber)) {
      errors.push(t('idNumberInvalid', language));
    }

    // Email validation
    if (email && !emailPattern.test(email)) {
      errors.push(t('emailInvalid', language));
    } else if (email.length > 100) {
      errors.push(t('emailTooLong', language));
    }

    // Phone validation
    if (phone && !phonePattern.test(phone)) {
      errors.push(t('phoneInvalid', language));
    }

    // Army role validation
    if (!armyRole) {
      errors.push(t('armyRoleRequired', language));
    } else if (armyRoleTooLong) {
      errors.push(t('professionTooLong', language));
    } else if (armyRoleModified) {
      errors.push(t('armyRoleSanitized', language)); // Optional message
    }

    // Location validation
    if (!location) {
      errors.push(t('locationRequired', language));
    } else if (location.length > 60) {
      errors.push(t('locationTooLong', language));
    }

    // Experience validation
    if (!experience) {
      errors.push(t('experienceRequired', language));
    } else if (experienceTooLong) {
      errors.push(t('experienceTooLong', language));
    } else if (experienceModified) {
      errors.push(t('experienceSanitized', language)); // Optional message
    }

    // LinkedIn validation
    if (linkedin && !urlPattern.test(linkedin)) {
      errors.push(t('linkedinInvalid', language));
    } else if (linkedin.length > 200) {
      errors.push(t('linkedinTooLong', language));
    }

    // About me validation
    if (aboutMeTooLong) {
      errors.push(t('aboutMeTooLong', language));
    } else if (aboutMeModified) {
      errors.push(t('aboutMeSanitized', language)); // Optional
    }

    // Notes validation
    if (notesTooLong) {
      errors.push(t('notesIsTooLong', language));
    } else if (notesModified) {
      errors.push(t('notesSanitized', language)); // Optional
    }

    return {
        errors,
        sanitized: {
        fullName,
        email,
        phone,
        idNumber,
        armyRole,
        location,
        fields,
        experience,
        linkedin,
        aboutMeIntro,
        notes
        }
    };
  };

export default SanitizeForm;

