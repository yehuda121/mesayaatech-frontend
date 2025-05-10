"use client";
import React, { useState, useEffect } from "react";
import { getLanguage, toggleLanguage } from "@/app/language";
import { useRouter } from "next/navigation";
import "../mentor/MentorHomePage/mentor.css";

export default function JobsPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ location: "", company: "" });

  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguage());
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserType) setUserType(storedUserType);
    if (storedUserId) setUserId(storedUserId);
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

  const handleDelete = async (jobId) => {
    if (!confirm(language === "he" ? "האם אתה בטוח שברצונך למחוק את המשרה?" : "Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/delete-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, userId, userType }),
      });

      if (res.ok) {
        alert(language === "he" ? "המשרה נמחקה בהצלחה" : "Job deleted successfully");
        fetchJobs(); // Refresh list
      } else {
        const err = await res.json();
        alert(err.error || (language === "he" ? "שגיאה במחיקה" : "Failed to delete job"));
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert(language === "he" ? "שגיאת שרת" : "Server error");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const newFiltered = jobs.filter((job) => {
      const locationMatch = !newFilters.location || job.location?.includes(newFilters.location);
      const companyMatch = !newFilters.company || job.company?.includes(newFilters.company);
      return locationMatch && companyMatch;
    });
    setFilteredJobs(newFiltered);
  };

  const handleNavigateHome = () => {
    if (!userType) return;
    switch (userType) {
      case "mentor": router.push("/pages/mentor/MentorHomePage"); break;
      case "reservist": router.push("/pages/reserve/ReserveHomePage"); break;
      case "ambassador": router.push("/pages/ambassador/AmbassadorHomePage"); break;
      case "admin": router.push("/admin"); break;
      default: router.push("/"); break;
    }
  };

  const canPostJob = userType === "mentor" || userType === "ambassador" || userType === "admin";

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">מסייעטק</h2>
        <div className="language-toggle">
          <button onClick={toggleLanguage}>
            {language === "he" ? "English" : "עברית 🇮🇱"}
          </button>
        </div>
        <nav className="dashboard-nav">
          <button onClick={handleNavigateHome}>{language === "he" ? "ראשי" : "Home"}</button>
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="font-semibold">{language === "he" ? "מיקום" : "Location"}:</label>
            <input type="text" name="location" value={filters.location} onChange={handleFilterChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="font-semibold">{language === "he" ? "חברה" : "Company"}:</label>
            <input type="text" name="company" value={filters.company} onChange={handleFilterChange} className="border p-2 rounded w-full" />
          </div>
        </div>

        {/* Jobs list */}
        <div className="dashboard-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => {
              const isOwner = job.publisherId === userId || userType === "admin";
              return (
                <div key={idx} className="dashboard-card">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">{job.title}</h3>
                  <p className="text-gray-700">{language === "he" ? "חברה" : "Company"}: {job.company}</p>
                  <p className="text-gray-700">{language === "he" ? "מיקום" : "Location"}: {job.location}</p>
                  <p className="text-gray-600 mt-2">{job.description}</p>

                  {isOwner && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => router.push(`/pages/jobs/editJob?jobId=${job.jobId}`)}
                        className="text-blue-600 underline"
                      >
                        {language === "he" ? "ערוך" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(job.jobId)}
                        className="text-red-600 underline"
                      >
                        {language === "he" ? "מחק" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">{language === "he" ? "אין משרות להצגה." : "No jobs to display."}</p>
          )}
        </div>
      </main>
    </div>
  );
}
