'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLanguage } from "@/app/language";
import { t } from "@/app/utils/loadTranslations";
import SideBar from "@/app/components/SideBar";

export default function AddJobPage() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    setLanguage(getLanguage());
    setUserId(localStorage.getItem("userId"));
    setUserType(localStorage.getItem("userType"));

    const onLangChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", onLangChange);
    return () => window.removeEventListener("languageChanged", onLangChange);
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

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/pages/jobs");
      } else {
        const error = await response.json();
        console.error("Upload error:", error);
        alert(error?.error || t("eventError", language));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(t("serverError", language));
    }
  };

  const navItems = [
    {
      labelHe: "חזרה לרשימת משרות",
      labelEn: "Back to Jobs",
      onClick: () => router.push("/pages/jobs")
    }
  ];

  return (
    <div className="dashboard-container">
      <SideBar navItems={navItems} />

      <main className="dashboard-main" style={{ paddingTop: '65px' }}>
      <h1 className="text-2xl font-bold mb-6">{t("postNewJob", language)}</h1>

      <div dir={language === 'he' ? 'rtl' : 'ltr'} className={`${language === 'he' ? 'text-right' : 'text-left'}`}>
        <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">
              {t("jobTitle", language)}
            </label>
            <input
              name="title"
              value={jobData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-700 mb-2">
              {t("company", language)}
            </label>
            <input
              name="company"
              value={jobData.company}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-700 mb-2">
              {t("location", language)}
            </label>
            <input
              name="location"
              value={jobData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-700 mb-2">
              {t("description", language)}
            </label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-700 mb-2">
              {t("uploadFile", language)}
            </label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {t("submitJob", language)}
          </button>
        </form>
        </div>
      </main>
    </div>
  );
}
