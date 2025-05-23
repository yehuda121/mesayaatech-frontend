// AddNewJob.jsx 
'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';

export default function AddNewJob({ onClose, onSave }) {
  const [language, setLanguage] = useState(getLanguage());
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setUserType(localStorage.getItem("userType"));
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (file) formData.append("attachment", file);

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

  return (
    <div className="add-job-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <div className="add-job-box">
        <h2 className="form-title">{t("postNewJob", language)}</h2>

        <form className="form-wrapper" onSubmit={handleSubmit}>
            <div>
            <label className="form-label">{t("jobTitle", language)}</label>
            <input
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <label className="form-label">{t("company", language)}</label>
            <input
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <label className="form-label">{t("location", language)}</label>
            <input
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <label className="form-label">{t("description", language)}</label>
            <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <label className="form-label">{t("uploadFile", language)}</label>
            <input type="file" onChange={handleFileChange} />
            </div>

            <div className="form-actions">
            <Button
                text={t("cancel", language)}
                onClick={onClose}
                type="button"
            />
            <Button
                text={loading ? '...' : t("submitJob", language)}
                type="submit"
            />
            </div>
        </form>
        </div>
    </div>
    );
}
