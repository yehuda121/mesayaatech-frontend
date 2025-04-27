
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLanguage, toggleLanguage } from "../../../language";
import "./mentor.css";

export default function MentorDashboard() {
  const router = useRouter();
  const [language, setLanguage] = useState(getLanguage());

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  const navItems = [
    { label: language === "he" ? "ראשי" : "Dashboard", path: "/HomePageMentor" },
    { label: language === "he" ? "רשימת המלווים שלי" : "My Reservists", path: "/mentor/my-reservists" },
    { label: language === "he" ? "פניות חדשות לליווי" : "New Requests", path: "/mentor/requests" },
    { label: language === "he" ? "משרות רלוונטיות" : "Job Matches", path: "/mentor/job-matches" },
    { label: language === "he" ? "פרסום משרה" : "Post Job", path: "/pages/jobs/newJob" },
    { label: language === "he" ? "פידבקים שהתקבלו" : "Feedback", path: "/mentor/feedback" },
    { label: language === "he" ? "סטטיסטיקות" : "Statistics", path: "/mentor/stats" },
    { label: language === "he" ? "הפרופיל שלי" : "My Profile", path: "/mentor/profile" },
  ];

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
          {navItems.map(({ label, path }) => (
            <button key={path} onClick={() => router.push(path)}>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1>{language === "he" ? "לוח הבקרה של המנטור" : "Mentor Dashboard"}</h1>
        <p>
          {language === "he"
            ? "כאן תוכל לנהל את כל הפעולות שלך כמנטור."
            : "Manage all your mentoring tasks in one place."}
        </p>

        <div className="dashboard-grid">
          <DashboardCard
            title={language === "he" ? "רשימת המלווים שלי" : "My Reservists"}
            description={language === "he" ? "צפה במלווים שאתה מלווה" : "View reservists you're mentoring"}
            onClick={() => router.push("/mentor/my-reservists")}
          />
          <DashboardCard
            title={language === "he" ? "פניות חדשות לליווי" : "New Requests"}
            description={language === "he" ? "בדוק בקשות ליווי" : "Check new mentoring requests"}
            onClick={() => router.push("/mentor/requests")}
          />
          <DashboardCard
            title={language === "he" ? "פרסום משרה חדשה" : "Post New Job"}
            description={language === "he" ? "הוסף משרה למערכת" : "Post a job opportunity"}
            onClick={() => router.push("/pages/jobs/newJob")}
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

