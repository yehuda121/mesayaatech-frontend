'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';

export default function AddNewJob({ onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    attachment: null, // for file
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setUserType(localStorage.getItem("userType"));
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const handleFormChange = (newData) => {
    setJobData(newData);
  };

  const handleSubmit = async () => {
    if (!userId || !userType) {
      alert(t("userNotRecognized", language));
      return;
    }

    const formData = new FormData();
    formData.append("title", jobData.title);
    formData.append("company", jobData.company);
    formData.append("location", jobData.location);
    formData.append("description", jobData.description);
    formData.append("publisherId", userId);
    formData.append("publisherType", userType);
    if (jobData.attachment instanceof File) {
      formData.append("attachment", jobData.attachment);
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result);
        onClose();
      } else {
        const error = await response.json();
        console.error("Upload error:", error);
        alert(error?.error || t("eventError", language));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(t("serverError", language));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'title' },
    { key: 'company' },
    { key: 'location' },
    { key: 'description', type: 'textarea' },
    { key: 'attachment', type: 'file', labelOverride: 'uploadFile' }
  ];

  return (
    <div className="add-job-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="add-job-box">
        <GenericForm
          titleKey="postNewJob"
          fields={fields}
          data={jobData}
          onChange={handleFormChange}
          onPrimary={handleSubmit}
          onSecondary={onClose}
          primaryLabel={loading ? '' : 'submitJob'}
          secondaryLabel="cancel"
          disabledPrimary={loading}
        />
      </div>
    </div>
  );
}
