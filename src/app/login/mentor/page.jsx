
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLanguage, toggleLanguage } from "../../language";

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
    { label: language === "he" ? "פרסום משרה" : "Post Job", path: "/mentor/post-job" },
    { label: language === "he" ? "פידבקים שהתקבלו" : "Feedback", path: "/mentor/feedback" },
    { label: language === "he" ? "סטטיסטיקות" : "Statistics", path: "/mentor/stats" },
    { label: language === "he" ? "הפרופיל שלי" : "My Profile", path: "/mentor/profile" },
  ];

  return (
    <div className="flex flex-row-reverse min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">מסייעטק</h2>

        
        <div className="text-sm mb-4 text-right">
          <button
            onClick={handleToggleLanguage}
            className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            {language === "he" ? "English" : "עברית 🇮🇱"}
          </button>
        </div>

        {/* ניווט */}
        <nav className="space-y-4">
          {navItems.map(({ label, path }) => (
            <button
              key={path}
              className="block text-right w-full text-white hover:bg-blue-700 px-4 py-2 rounded transition"
              onClick={() => router.push(path)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      
      <main className="flex-1 bg-gray-100 p-10 text-right">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          {language === "he" ? "לוח הבקרה של המנטור" : "Mentor Dashboard"}
        </h1>
        <p className="text-gray-700 mb-8">
          {language === "he"
            ? "כאן תוכל לנהל את כל הפעולות שלך כמנטור."
            : "Manage all your mentoring tasks in one place."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            onClick={() => router.push("/mentor/post-job")}
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition duration-200"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
