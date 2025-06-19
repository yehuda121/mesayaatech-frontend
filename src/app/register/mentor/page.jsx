// 'use client';
// import { useEffect, useState } from 'react';
// import { getLanguage, toggleLanguage } from '../../language';
// import { useRouter } from 'next/navigation';
// import Button from '../../components/Button';
// import { t } from '@/app/utils/loadTranslations';
// import AlertMessage from '@/app/components/notifications/AlertMessage'; 
// import '../registrationForm.css';
// import { locations } from '@/app/components/Locations';
// import sanitizeText from '@/app/utils/sanitizeText';

// export default function MentorRegisterForm() {
//   const router = useRouter();
//   const [language, setLanguage] = useState(null);
//   const [alert, setAlert] = useState(null); 

//   const [formData, setFormData] = useState({
//     userType: 'mentor',
//     status: 'pending',
//     fullName: '',
//     idNumber: '',
//     email: '',
//     phone: '',
//     profession: '',
//     location: '',
//     specialties: [],
//     experience: '',
//     pastMentoring: '',
//     availability: '',
//     linkedin: '',
//     notes: '',
//     aboutMe: '',
//   });

//   useEffect(() => {
//     setLanguage(getLanguage());
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === 'checkbox') {
//       setFormData((prev) => ({
//         ...prev,
//         specialties: checked
//           ? [...prev.specialties, value]
//           : prev.specialties.filter((s) => s !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const validateForm = () => {
//     const errors = [];
//     const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
//     const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
//     const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

//     const fullName = formData.fullName.trim();
//     const idNumber = formData.idNumber.replace(/\s/g, '');
//     const email = formData.email.trim();
//     const phone = formData.phone.trim();
//     const profession = formData.profession.trim();
//     const location = formData.location.trim();
//     const experience = sanitizeText(formData.experience, 1000);
//     const pastMentoring = sanitizeText(formData.pastMentoring, 1000);
//     const availability = sanitizeText(formData.availability, 200);
//     const linkedin = formData.linkedin.trim();
//     const notes = sanitizeText(formData.notes, 500);
//     const aboutMe = sanitizeText(formData.aboutMe, 1000);

//     if (!fullName) errors.push(t('fullNameRequired', language));
//     else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

//     if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

//     if (!email) errors.push(t('emailRequired', language));
//     else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

//     if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

//     if (!profession) errors.push(t('mainProfessionRequired', language));
//     else if (/[^\w\sא-ת]/.test(profession)) errors.push(t('mainProfessionInvalid', language));

//     if (!location) errors.push(t('locationRequired', language));

//     if (!experience) errors.push(t('experienceRequired', language));
//     else if (experience === 'tooLong') errors.push(t('experienceIsTooLong', language));

//     if (pastMentoring === 'tooLong') errors.push(t('pastMentoringIsTooLong', language));

//     if (availability === 'tooLong') errors.push(t('availabilityIsTooLong', language));

//     if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));

//     if (notes === 'tooLong') errors.push(t('notesIsTooLong', language));

//     if (aboutMe === 'tooLong') errors.push(t('aboutMeIsTooLong', language));

//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       showAlert(validationErrors[0], 'error');
//       return;
//     }

//     try {
//       const resUsers = await fetch(`http://localhost:5000/api/imports-user-registration-form?userType=mentor`);
//       const existingUsers = await resUsers.json();

//       const emailExists = existingUsers.some(user => user.email === formData.email);
//       const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

//       if (emailExists) {
//         showAlert(t('emailAlreadyExists', language), 'error');
//         return;
//       }
//       if (idExists) {
//         setAlert({ message: t('idNumberAlreadyExists', language), type: 'error' });
//         return;
//       }

//       const res = await fetch('http://localhost:5000/api/upload-registration-form', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         router.push("/pages/waitingApproval");
//         setFormData({
//           userType: 'mentor',
//           status: 'pending',
//           fullName: '',
//           idNumber: '',
//           email: '',
//           phone: '',
//           profession: '',
//           location: '',
//           specialties: [],
//           experience: '',
//           pastMentoring: '',
//           availability: '',
//           linkedin: '',
//           notes: '',
//           aboutMe: '',
//         });
//       } else {
//         const errorText = await res.text();
//         showAlert(`${t('mentorError', language)}: ${errorText}`, 'error');
//       }
//     } catch {
//       showAlert(`${t('mentorError', language)}: ${errorText}`, 'error');
//     }
//   };

//   if (!language) return null;

//   const translatedSpecialties = {
//     "חיפוש עבודה": { he: " חיפוש עבודה", en: " Job Search" },
//     "כתיבת קורות חיים": { he: " כתיבת קורות חיים", en: " Resume Writing" },
//     "הכנה לראיונות": { he: " הכנה לראיונות", en: " Interview Prep" },
//     "בניית מסלול קריירה": { he: " בניית מסלול קריירה", en: " Career Path Planning" },
//     "שיפור מיומנויות רכות": { he: " שיפור מיומנויות רכות", en: " Soft Skills Improvement" },
//     "אחר": { he: " אחר", en: " Other" }
//   };

//   const showAlert = (msg, type) => {
//     setAlert({ message: msg, type });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="register-page">
//     <div className={`register-form-container ${language === 'he' ? 'register-form-direction-rtl' : 'register-form-direction-ltr'}`}>
//       <div className="register-form-top-buttons">
//         <button
//           onClick={() => router.push('/login')}
//           className="text-blue-700 font-medium hover:underline"
//         >
//           {t('mentorLogin', language)}
//         </button>

//         <button
//           onClick={() => setLanguage(toggleLanguage())}
//           className="text-sm underline hover:text-blue-600"
//         >
//           {t('switchLang', language)}
//         </button>
//       </div>

//       <h1 className="text-3xl font-bold text-center">{t('mentorRegisterTitle', language)}</h1>

//       <form onSubmit={handleSubmit}>
//         <label>{t('fullName', language)}*:
//           <input name="fullName" value={formData.fullName} onChange={handleChange} />
//         </label>

//         <label>{t('idNumber', language)}*:
//           <input name="idNumber" value={formData.idNumber} onChange={handleChange} />
//         </label>

//         <label>{t('email', language)}*:
//           <input name="email" type="email" value={formData.email} onChange={handleChange} />
//         </label>

//         <label>{t('phone', language)}:
//           <input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
//         </label>

//         <label>{t('mainProfession', language)}*:
//           <input name="profession" value={formData.profession} onChange={handleChange} />
//         </label>
        
//         <label>{t('location', language)}*:
//           <select name="location" value={formData.location} onChange={handleChange}>
//             <option value="">{t('selectLocation', language)}</option>
//             {locations.map((region, regionIndex) => (
//               <optgroup 
//                 key={regionIndex} 
//                 className='font-bold'
//                 label={language === 'he' ? region.region.he : region.region.en}
//               >
//                 {region.locations.map((loc, locIndex) => (
//                   <option key={locIndex} value={language === 'he' ? loc.he : loc.en}>
//                     {language === 'he' ? loc.he : loc.en}
//                   </option>
//                 ))}
//               </optgroup>
//             ))}
//           </select>
//         </label>

//         <fieldset>
//           <legend>{t('mentorSpecialtiesTitle', language)}</legend>
//           {Object.keys(translatedSpecialties).map((field) => (
//             <label
//               key={field}
//               className="register-checkbox-label"
//               style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}
//             >
//               <input
//                 type="checkbox"
//                 name="specialties"
//                 value={field}
//                 checked={formData.specialties.includes(field)}
//                 onChange={handleChange}
//               />
//               {translatedSpecialties[field][language]}
//             </label>
//           ))}
//         </fieldset>

//         <label>{t('mentorExperience', language)}*:
//           <textarea name="experience" value={formData.experience} onChange={handleChange} className="h-24" />
//         </label>

//         <label>{t('mentorPastMentoring', language)}:
//           <textarea name="pastMentoring" value={formData.pastMentoring} onChange={handleChange} className="h-24" />
//         </label>

//         <label>{t('mentorAvailability', language)}:
//           <input name="availability" value={formData.availability} onChange={handleChange} />
//         </label>

//         <label>{t('mentorLinkedin', language)}:
//           <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
//         </label>

//         <label>{t('notes', language)}:
//           <textarea name="notes" value={formData.notes} onChange={handleChange} className="h-24" />
//         </label>

//         <label>
//           {t('aboutMeIntroMentor', language)}:
//           <textarea
//             name="aboutMe"
//             value={formData.aboutMe}
//             onChange={handleChange}
//             placeholder={t('aboutMePlaceholderMentor', language)}
//             className="h-24"
//           />
//         </label>
//         <div className='flex justify-center'>
//           <Button text={t('submit', language)} type="submit" />
//         </div>

//       </form>

//       {alert && (
//         <AlertMessage
//           message={alert.message}
//           type={alert.type}
//           onClose={() => setAlert(null)}
//         />
//       )}
//     </div>
//   </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { getLanguage, toggleLanguage } from '@/app/language';
import { useRouter } from 'next/navigation';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import '@/app/components/GenericForm/GenericForm.css';
import { t } from '@/app/utils/loadTranslations';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import { locations } from '@/app/components/Locations';
import sanitizeText from '@/app/utils/sanitizeText';
import '../registrationForm.css';
import PageIntro from '@/app/components/PageIntro';


export default function MentorRegisterForm() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    userType: 'mentor',
    status: 'pending',
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    specialties: [],
    experience: '',
    pastMentoring: '',
    availability: '',
    linkedin: '',
    notes: '',
    aboutMe: '',
  });

  useEffect(() => {
    setLanguage(getLanguage());
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showAlert(validationErrors[0], 'error');
      return false;
    }

    try {
      const resUsers = await fetch(`http://localhost:5000/api/imports-user-registration-form?userType=mentor`);
      const existingUsers = await resUsers.json();

      const emailExists = existingUsers.some(user => user.email === formData.email);
      const idExists = existingUsers.some(user => user.idNumber === formData.idNumber);

      if (emailExists) {
        showAlert(t('emailAlreadyExists', language), 'error');
        return false;
      }
      if (idExists) {
        showAlert(t('idNumberAlreadyExists', language), 'error');
        return false;
      }

      const res = await fetch('http://localhost:5000/api/upload-registration-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/pages/waitingApproval');
        return true;
      } else {
        const errorText = await res.text();
        showAlert(`${t('mentorError', language)}: ${errorText}`, 'error');
        return false;
      }
    } catch (error) {
      showAlert(`${t('mentorError', language)}: ${error.message}`, 'error');
      return false;
    }
  };

  const validateForm = () => {
    const errors = [];
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    const fullName = formData.fullName.trim();
    const idNumber = formData.idNumber.replace(/\s/g, '');
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const profession = formData.profession.trim();
    const location = formData.location.trim();
    const experience = sanitizeText(formData.experience, 1000);
    const pastMentoring = sanitizeText(formData.pastMentoring, 1000);
    const availability = sanitizeText(formData.availability, 200);
    const linkedin = formData.linkedin.trim();
    const notes = sanitizeText(formData.notes, 500);
    const aboutMe = sanitizeText(formData.aboutMe, 1000);

    if (!fullName) errors.push(t('fullNameRequired', language));
    else if (/[^א-תa-zA-Z\s]/.test(fullName)) errors.push(t('fullNameInvalid', language));

    if (!/^\d{9}$/.test(idNumber)) errors.push(t('idNumberInvalid', language));

    if (!email) errors.push(t('emailRequired', language));
    else if (!emailPattern.test(email)) errors.push(t('emailInvalid', language));

    if (phone && !phonePattern.test(phone)) errors.push(t('phoneInvalid', language));

    if (!profession) errors.push(t('mainProfessionRequired', language));
    else if (/[^\w\sא-ת]/.test(profession)) errors.push(t('mainProfessionInvalid', language));

    if (!location) errors.push(t('locationRequired', language));

    if (!experience) errors.push(t('experienceRequired', language));
    else if (experience === 'tooLong') errors.push(t('experienceIsTooLong', language));

    if (pastMentoring === 'tooLong') errors.push(t('pastMentoringIsTooLong', language));
    if (availability === 'tooLong') errors.push(t('availabilityIsTooLong', language));
    if (linkedin && !urlPattern.test(linkedin)) errors.push(t('linkedinInvalid', language));
    if (notes === 'tooLong') errors.push(t('notesIsTooLong', language));
    if (aboutMe === 'tooLong') errors.push(t('aboutMeIsTooLong', language));

    return errors;
  };

  const showAlert = (msg, type) => {
    setAlert({ message: msg, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!language) return null;

  const locationOptions = locations.flatMap((region) =>
    region.locations.map((loc) => ({
      value: language === 'he' ? loc.he : loc.en,
      label: language === 'he' ? loc.he : loc.en
    }))
  );

  const fields = [
    { key: 'fullName', type: 'text' },
    { key: 'idNumber', type: 'text' },
    { key: 'email', type: 'text' },
    { key: 'phone', type: 'text' },
    { key: 'profession', type: 'text', labelOverride: 'mainProfession' },
    { key: 'location', type: 'select', options: locationOptions },
    { key: 'experience', type: 'textarea' },
    { key: 'pastMentoring', type: 'textarea' },
    { key: 'availability', type: 'text' },
    { key: 'linkedin', type: 'text' },
    { key: 'notes', type: 'textarea' },
    { key: 'aboutMe', type: 'textarea' },
  ];

  return (
    <div className="register-page">
       <PageIntro
        titleKey="mentorWelcome"
        subtitleKey="mentorWelcomeSubtitle"
      />
    <div className="top-buttons-wrapper">
       <div className="register-form-top-buttons">
         <button onClick={() => router.push('/login')} className="text-blue-700 font-medium hover:underline">
          {t('mentorLogin', language)}
         </button>
         <button onClick={() => setLanguage(toggleLanguage())} className="text-sm underline hover:text-blue-600">
          {t('switchLang', language)}
         </button>
        </div>
      </div>


      <div className="GF-form-title-wrapper">
        <h2 className="GF-generic-form-title">🤝 {t('mentorRegisterTitle', language)}</h2>
      </div>
      

      <GenericForm
        titleKey="mentorRegisterTitle"
        fields={fields}
        data={formData}
        onChange={setFormData}
        onPrimary={handleSubmit}
        primaryLabel="submit"
      />

     

      {alert && (
        <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}
    </div>
  );
}
