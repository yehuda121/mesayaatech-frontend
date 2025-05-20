"use client";
import React, { useState, useEffect } from "react";
import { getLanguage } from "../../../language";
import SideBar from "../../../../components/SideBar";
import "./mentor.css";

export default function MentorDashboard() {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    setLanguage(getLanguage());

    const handleLanguageChange = () => {
      setLanguage(getLanguage());
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const navItems = [
    { labelHe: "ראשי", labelEn: "Dashboard", path: "/mentor/MentorHomePage" },
    { labelHe: "רשימת המלווים שלי", labelEn: "My Reservists", path: "/mentor/my-reservists" },
    { labelHe: "פניות חדשות לליווי", labelEn: "New Requests", path: "/mentor/requests" },
    { labelHe: "משרות רלוונטיות", labelEn: "Job Matches", path: "/mentor/job-matches" },
    { labelHe: "פרסום משרה", labelEn: "Post Job", path: "/pages/jobs/newJob" },
    { labelHe: "פידבקים שהתקבלו", labelEn: "Feedback", path: "/mentor/feedback" },
    { labelHe: "הפרופיל שלי", labelEn: "My Profile", path: "/pages/mentor/profile" },
  ];

  return (
    <div>
      <SideBar navItems={navItems} />

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
            path="/mentor/my-reservists"
          />
          <DashboardCard
            title={language === "he" ? "פניות חדשות לליווי" : "New Requests"}
            description={language === "he" ? "בדוק בקשות ליווי" : "Check new mentoring requests"}
            path="/mentor/requests"
          />
          <DashboardCard
            title={language === "he" ? "פרסום משרה חדשה" : "Post New Job"}
            description={language === "he" ? "הוסף משרה למערכת" : "Post a job opportunity"}
            path="/pages/jobs/newJob"
          />
        </div>
      </main>
    </div>
  );
}

import { useRouter } from "next/navigation";
function DashboardCard({ title, description, path }) {
  const router = useRouter();
  return (
    <div className="dashboard-card" onClick={() => router.push(path)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
