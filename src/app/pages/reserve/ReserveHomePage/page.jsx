"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLanguage, toggleLanguage } from "@/app/language";
import "../../mentor/MentorHomePage/mentor.css";

export default function ReserveDashboard() {
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
    { label: language === "he" ? "ראשי" : "Dashboard", path: "/pages/reserve/ReserveHomePage" },
    { label: language === "he" ? "משרות" : "Jobs", path: "/pages/jobs"},
    { label: language === "he" ? "הפרופיל שלי" : "My Profile", path: "/reserve/profile" },
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
        <h1>{language === "he" ? "שלום, מאי 👋" : "Hello, May 👋"}</h1>
        <p>
          {language === "he"
            ? "כאן תמצאי את כל מה שאת צריכה כדי להתקדם בקריירה."
            : "Everything you need to boost your career."}
        </p>

        <div className="dashboard-grid">
          <DashboardCard
            title={language === "he" ? "הפרופיל שלי" : "My Profile"}
            description={language === "he" ? "נהל את הפרטים האישיים שלך" : "Manage your personal info"}
            onClick={() => router.push("/reserve/profile")}
          />
          <DashboardCard
            title={language === "he" ? "משרות" : "Jobs"}
            description={language === "he" ? "מצא משרות מותאמות" : "Find tailored jobs"}
            onClick={() => router.push("/pages/jobs")
            }
          />
          <DashboardCard
            title={language === "he" ? "הכנה לראיונות" : "Interview Prep"}
            description={language === "he" ? "תרגול וקבלת פידבק לשאלות ראיונות עבודה" : "Practice and get feedback on job interview questions"}
            onClick={() => router.push("/reserve/interview-prep")}
          />

          <DashboardCard
            title={language === "he" ? "פגישות קרובות" : "Upcoming Meetings"}
            description={language === "he" ? "צפי בפגישות הקרובות עם מנטורים" : "See your upcoming meetings"}
            onClick={() => router.push("/reserve/meetings")}
          />
          <DashboardCard
            title={language === "he" ? "פידבקים מהמנטור" : "Mentor Feedback"}
            description={language === "he" ? "ראה מה המנטורים חושבים עליך" : "See what mentors say about you"}
            onClick={() => router.push("/reserve/feedback")}
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
