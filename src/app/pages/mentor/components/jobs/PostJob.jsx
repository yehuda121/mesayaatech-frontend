'use client';

import { useState, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import Button from '@/app/components/Button';
// import './PostJob.css';

export default function PostJob({ publisherId, publisherType, onSuccess }) {
  const [language, setLanguage] = useState(getLanguage());
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
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
    if (!publisherId || !publisherType) {
      alert(t("userNotRecognized", language));
      return;
    }

    const formData = new FormData();
    formData.append("title", jobData.title);
    formData.append("company", jobData.company);
    formData.append("location", jobData.location);
    formData.append("description", jobData.description);
    formData.append("publisherId", publisherId);
    formData.append("publisherType", publisherType);
    if (file) formData.append("attachment", file);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        alert(t("jobPostedSuccess", language));
        setJobData({ title: '', company: '', location: '', description: '' });
        setFile(null);
      } else {
        const error = await response.json();
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
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className="post-job-container">
      
      <form className="post-job-form" onSubmit={handleSubmit}>
        <h2 className="post-job-title">{t("postNewJob", language)}</h2>
        {['title', 'company', 'location'].map((field) => (
          <div key={field}>
            <label className="post-job-label">
              {t(field === 'title' ? 'jobTitle' : field, language)}
            </label>
            <input
              name={field}
              value={jobData[field]}
              onChange={handleChange}
              required
              className="post-job-input"
            />
          </div>
        ))}

        <div>
          <label className="post-job-label">
            {t("description", language)}
          </label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
            className="post-job-textarea"
          />
        </div>

        <div>
          <label className="post-job-label">
            {t("uploadFile", language)}
          </label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="post-job-actions">
          <Button text={loading ? '...' : t("submitJob", language)} type="submit" />
        </div>
      </form>
    </div>
  );
}
