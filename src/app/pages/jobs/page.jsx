"use client";
import React, { useState, useEffect } from "react";
import { getLanguage, toggleLanguage } from "@/app/language";
import { useRouter } from "next/navigation";
import "../mentor/MentorHomePage/mentor.css";

export default function JobsPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [userType, setUserType] = useState(null); // reservist / mentor / ambassador / admin
  const [jobs, setJobs] = useState([]);  // כל המשרות
  const [filteredJobs, setFilteredJobs] = useState([]); // משרות אחרי סינון
  const [filters, setFilters] = useState({ location: "", company: "" });

  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/import-jobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  const handleNavigateHome = () => {
    if (!userType) {
      console.log("User type not loaded yet");
      return;
    }

    switch (userType) {
      case "mentor":
        router.push("/pages/mentor/MentorHomePage");
        break;
      case "reservist":
        router.push("/pages/reserve/ReserveHomePage");
        break;
      case "ambassador":
        router.push("/pages/ambassador/AmbassadorHomePage");
        break;
      case "admin":
        router.push("/admin");
        break;
      default:
        router.push("/");
        break;
    }
  };

  const canPostJob = userType === "mentor" || userType === "ambassador" || userType === "admin";

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // עדכון התצוגה בזמן אמת
    const newFiltered = jobs.filter((job) => {
      const locationMatch = !value || job.location?.includes(filters.location);
      const companyMatch = !filters.company || job.company?.includes(filters.company);
      return locationMatch && companyMatch;
    });
    setFilteredJobs(newFiltered);
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
          <button onClick={handleNavigateHome} disabled={!userType}>
            {language === "he" ? "ראשי" : "Home"}
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <h1>{language === "he" ? "משרות פנויות" : "Available Jobs"}</h1>

        {canPostJob && (
          <div className="mb-6 text-right">
            <button
              onClick={() => router.push("/pages/jobs/newJob")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {language === "he" ? "הוסף משרה" : "Post a Job"}
            </button>
          </div>
        )}

        {/* סינון */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="font-semibold">
              {language === "he" ? "מיקום" : "Location"}:
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              {language === "he" ? "חברה" : "Company"}:
            </label>
            <input
              type="text"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* הצגת משרות */}
        <div className="dashboard-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => (
              <div key={idx} className="dashboard-card">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{job.title}</h3>
                <p className="text-gray-700">{language === "he" ? "חברה" : "Company"}: {job.company}</p>
                <p className="text-gray-700">{language === "he" ? "מיקום" : "Location"}: {job.location}</p>
                <p className="text-gray-600 mt-2">{job.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">{language === "he" ? "אין משרות להצגה." : "No jobs to display."}</p>
          )}
        </div>
      </main>
    </div>
  );
}
