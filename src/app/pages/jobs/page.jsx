"use client";
import React, { useState, useEffect } from "react";
import { getLanguage, toggleLanguage } from "@/app/language";
import { useRouter } from "next/navigation";
import "../mentor/MentorHomePage/mentor.css";


export default function JobsPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [userType, setUserType] = useState(null); // reservist / mentor / ambassador
  const router = useRouter();

  // Load language and user type from localStorage on mount
  useEffect(() => {
    setLanguage(getLanguage());
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  // Only mentors and ambassadors can post jobs
  const canPostJob = userType === "mentor" || userType === "ambassador";

  const handleNavigateHome = () => {
    switch (userType) {
      case "mentor":
        router.push("/mentor/MentorHomePage");
        break;
      case "reservist":
        router.push("/reserve/ReserveHomePage");
        break;
      case "ambassador":
        router.push("/ambassador/AmbassadorHomePage"); //create this page
        break;
      default:
        router.push("/");
        break;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">מסייעטק</h2>
        <div className="language-toggle">
          <button onClick={handleToggleLanguage}>
            {language === "he" ? "English" : "עברית 🇮🇱"}
          </button>
        </div>
        <nav className="dashboard-nav">
          <button onClick={handleNavigateHome}>
            {language === "he" ? "ראשי" : "Home"}
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <h1>{language === "he" ? "משרות פנויות" : "Available Jobs"}</h1>
        <p>
          {language === "he"
            ? "מצא משרה מתאימה או הוסף אחת חדשה אם באפשרותך."
            : "Find a suitable job or post a new one if you can."}
        </p>

        {/* Show "Add Job" button for mentors and ambassadors */}
        {canPostJob && (
          <div className="mb-6 text-right">
            <button
              onClick={() => router.push("/jobs/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {language === "he" ? "הוסף משרה" : "Post a Job"}
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          {/* TODO: Load and map job listings from backend (S3 or DB) */}
          <p className="text-gray-600">
            {language === "he" ? "אין עדיין משרות להצגה." : "No jobs to display yet."}
          </p>
        </div>
      </main>
    </div>
  );
}
