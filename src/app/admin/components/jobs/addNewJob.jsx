// AddNewJob.jsx (centered form style like CreateEvent)
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
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold text-center mb-6">{t("postNewJob", language)}</h2>

        <form className="space-y-6"onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">{t("jobTitle", language)}</label>
            <input name="title" value={jobData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">{t("company", language)}</label>
            <input name="company" value={jobData.company} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">{t("location", language)}</label>
            <input name="location" value={jobData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">{t("description", language)}</label>
            <textarea name="description" value={jobData.description} onChange={handleChange} className="w-full p-2 border rounded h-24" required />
          </div>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">{t("uploadFile", language)}</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="flex justify-end gap-3">
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
