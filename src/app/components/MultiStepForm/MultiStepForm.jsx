'use client';

import { t } from '@/app/utils/loadTranslations';
import sanitizeText from '@/app/utils/sanitizeText';
import { useEffect, useState } from 'react';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import ProgressBar from './ProgressBar';

export default function MultiStepForm({ onSubmit, language, userType }) {
  const [step, setStep] = useState(1);
  
  
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    profession: '',
    specialties: [],
    pastMentoring: '',
    availability: '',
    armyRole: '',
    fields: [],
    location: '',
    experience: '',
    linkedin: '',
    notes: '',
    aboutMe: '',
    currentCompany: '',
    position: '',
    canShareJobs: '',
    jobFields: [],

  });

  const [error, setError] = useState('');

  const steps = 
  userType === 'reservist'
  ? [Step1, Step2, Step4, Step5] 
  : userType === 'ambassador'
  ? [Step1, Step2, Step4]
  : [Step1, Step2, Step3, Step4, Step5];

  const StepComponent = steps[step - 1];
  const stepKey = `${step}-${language}`;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateStep = () => {
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(05\d{8}|05\d{1}-\d{7})$/;
    const urlPattern = /^https?:\/\/[\w\.-]+\.\w+.*$/;

    if (step === 1) {
      if (!formData.fullName?.trim()) return t('fullNameRequired', language);
      if (formData.fullName.length > 70) return t('fullNameIsTooLong', language);
      if (/[^א-תa-zA-Z\s]/.test(formData.fullName)) return t('fullNameInvalid', language);

      if (!/^\d{9}$/.test(formData.idNumber)) return t('idNumberInvalid', language);

      if (!formData.email?.trim()) return t('emailRequired', language);
      if (!emailPattern.test(formData.email)) return t('emailInvalid', language);

      if (formData.phone && !phonePattern.test(formData.phone)) return t('phoneInvalid', language);
    }

    if (step === 2) {
      if (!formData.location?.trim()) return t('locationRequired', language);

      if (userType !== 'ambassador') {
        const experience = sanitizeText(formData.experience, 1000);
        if (!experience) return t('experienceRequired', language);
        if (experience === 'tooLong') return t('experienceIsTooLong', language);
      }

      if (userType === 'mentor') {
        const cleaned = (formData.specialties || []).map(v =>
          v.normalize("NFKC").replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim()
        ).filter(v => v !== '');
        if (cleaned.length === 0) return t('mainProfessionRequired', language);
        formData.specialties = cleaned;
      }

      if (userType === 'reservist') {
        const cleaned = (formData.fields || []).map(v =>
          v.normalize("NFKC").replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim()
        ).filter(v => v !== '');
        if (!formData.armyRole?.trim()) return t('armyRoleRequired', language);
        if (/[^\w\sא-ת]/.test(formData.armyRole)) return t('armyRoleInvalid', language);
        if (cleaned.length === 0) return t('professionalFieldsRequired', language);
        formData.fields = cleaned;
      }

      if (userType === 'ambassador') {
        const cleaned = (formData.jobFields || []).map(v =>
          v.normalize("NFKC").replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim()
        ).filter(v => v !== '');
        if (!formData.currentCompany?.trim()) return t('currentCompanyRequired', language);
        if (!formData.position?.trim()) return t('positionRequired', language);
        if (!formData.canShareJobs?.trim()) return t('canShareRequired', language);
        if (cleaned.length === 0) return t('ambassadorJobFieldsRequired', language);
        formData.jobFields = cleaned;
      }
      
    }

    if (step === 3 && userType === 'mentor') {
        const pastMentoring = sanitizeText(formData.pastMentoring, 1000);
        const availability = sanitizeText(formData.availability, 200);
        if (pastMentoring === 'tooLong') return t('pastMentoringIsTooLong', language);
        if (availability === 'tooLong') return t('availabilityIsTooLong', language);
      }
      

    if (step === 4) {
      const linkedin = formData.linkedin?.trim();
      const notes = sanitizeText(formData.notes, 500);
      if (linkedin && !urlPattern.test(linkedin)) return t('linkedinInvalid', language);
      if (notes === 'tooLong') return t('notesIsTooLong', language);
    }

    if (step === 5) {
      const aboutMe = sanitizeText(formData.aboutMe, 1000);
      if (aboutMe === 'tooLong') return t('aboutMeIsTooLong', language);
    }

    return ''; // No errors
  };

  const handleNext = () => {
    const errorMsg = validateStep();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    if (step > 1) setStep(prev => prev - 1);
  };

  return (
    <div className={`register-form-container ${language === 'he' ? 'rtl' : 'ltr'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <ProgressBar step={step} totalSteps={steps.length} />

      {error && (
        <div className="error-message" style={{ color: '#dc2626', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <StepComponent
        key={stepKey}
        data={formData}
        onChange={handleChange}
        onNext={handleNext}
        onBack={handleBack}
        isLastStep={step === steps.length}
        language={language}
        userType={userType}
        onSubmit={() => {
          
          if (userType === 'mentor') {
            formData.specialties = (formData.specialties || []).map(v =>
              v.normalize("NFKC").replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim()
            ).filter(v => v !== '');
          }
          if (userType === 'reservist') {
            formData.fields = (formData.fields || []).map(v =>
              v.normalize("NFKC").replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim()
            ).filter(v => v !== '');
          }

          const finalError = validateStep();
          if (finalError) {
            setError(finalError);
          } else {
            setError('');
            onSubmit(formData);
          }
        }}
      />
    </div>
  );
}
