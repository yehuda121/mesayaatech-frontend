// 'use client';

// import { useEffect, useState } from "react";
// import { getLanguage } from "../language";
// import SideBar from "../../components/SideBar";
// import "./LandingPage.css";

// export default function LandingPage() {
//   const [language, setLanguage] = useState(getLanguage());

//   useEffect(() => {
//     setLanguage(getLanguage());

//     const handleLanguageChange = () => {
//       setLanguage(getLanguage());
//     };

//     window.addEventListener("languageChanged", handleLanguageChange);
//     return () => {
//       window.removeEventListener("languageChanged", handleLanguageChange);
//     };
//   }, []);

//   const navItems = [
//     { labelHe: "הרשמה", labelEn: "Sign Up", path: "/register" },
//     { labelHe: "התחברות", labelEn: "Login", path: "/login" },
//     { labelHe: "דף בית מנטור", labelEn: "Mentor homePage", path: "/pages/mentor/MentorHomePage" },
//     { labelHe: "דף בית מילואימניק", labelEn: "Reserve homePage", path: "/pages/reserve/ReserveHomePage" },
//     { labelHe: "מנהל", labelEn: "Admin", path: "/admin" },
//     { labelHe: "אירועים", labelEn: "Events", path: "/events" },
//   ];

//   return (
//     <div>
//       <SideBar navItems={navItems} />
//         <div className="LPtop_Section">
//           <h1>{language === "he" ? "הפלטפורמה לתמיכה במשרתי מילואים" : "The Platform for Reservist Support"}</h1>
//           <p>{language === "he" ? "מצא עבודה עם ליווי מקצועי ומותאם אישית" : "Find a job with professional and personalized guidance"}</p>
//           <button onClick={() => window.location.href = "#signup"}>
//             {language === "he" ? "התחל עכשיו" : "Get Started"}
//           </button>
//         </div>
//         <main className="dashboard-main">
//           <section className="aboutSection" id="aboutSection">
//             <h2>{language === "he" ? "אודות הפרויקט" : "About the Project"}</h2>
//             <p>
//               {language === "he"
//                 ? "מסייעטק היא פלטפורמה דיגיטלית ייחודית שנועדה לסייע למשרתי מילואים להשתלב בצורה יעילה בשוק העבודה."
//                 : "Mesayaatech is a unique digital platform designed to help Israeli reservists integrate effectively into the workforce."}
//             </p>
//           </section>
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from "react";
import { getLanguage } from "../language";
import SideBar from "../../components/SideBar";
import { t } from "@/app/utils/loadTranslations"; // ← חדש
import "./LandingPage.css";

export default function LandingPage() {
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
    { labelHe: t('signup', 'he'), labelEn: t('signup', 'en'), path: "/register" },
    { labelHe: t('login', 'he'), labelEn: t('login', 'en'), path: "/login" },
    { labelHe: t('mentorHome', 'he'), labelEn: t('mentorHome', 'en'), path: "/pages/mentor/MentorHomePage" },
    { labelHe: t('reserveHome', 'he'), labelEn: t('reserveHome', 'en'), path: "/pages/reserve/ReserveHomePage" },
    { labelHe: t('admin', 'he'), labelEn: t('admin', 'en'), path: "/admin" },
    { labelHe: t('events', 'he'), labelEn: t('events', 'en'), path: "/events" },
  ];

  return (
    <div>
      <SideBar navItems={navItems} />
      <div className="LPtop_Section">
        <h1>{t('landingTitle', language)}</h1>
        <p>{t('landingSubtitle', language)}</p>
        <button onClick={() => window.location.href = "#signup"}>
          {t('getStarted', language)}
        </button>
      </div>

      <main className="dashboard-main">
        <section className="aboutSection" id="aboutSection">
          <h2>{t('aboutProject', language)}</h2>
          <p>{t('aboutText', language)}</p>
        </section>
      </main>
    </div>
  );
}
