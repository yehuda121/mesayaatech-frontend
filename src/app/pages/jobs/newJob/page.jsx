"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLanguage, toggleLanguage } from "@/app/language";
import "../../mentor/MentorHomePage/mentor.css";
export default function AddJobPage() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 New job submitted:", jobData);
    // save in s3 in futere
    router.push("/pages/jobs");
  };

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">מסייעטק</h2>
        <div className="language-toggle">
          <button onClick={handleToggleLanguage}>
            {language === "he" ? "English" : "עברית 🇮🇱"}
          </button>
        </div>
        <nav className="dashboard-nav">
          <button onClick={() => router.push("/pages/jobs")}>
            {language === "he" ? "חזרה למשרות" : "Back to Jobs"}
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1>{language === "he" ? "פרסום משרה חדשה" : "Post New Job"}</h1>
        <form className="space-y-6 mt-8 max-w-2xl" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold text-blue-700 mb-2">
              {language === "he" ? "שם המשרה" : "Job Title"}:
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
              {language === "he" ? "חברה" : "Company"}:
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
              {language === "he" ? "מיקום" : "Location"}:
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
              {language === "he" ? "תיאור" : "Description"}:
            </label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {language === "he" ? "שלח משרה" : "Submit Job"}
          </button>
        </form>
      </main>
    </div>
  );
}
