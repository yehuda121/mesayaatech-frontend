// 'use client';
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; 
// import "./LandingPage.css";
// import Button from "../components/Button";
// import { getLanguage, toggleLanguage } from "./language";

// export default function LandingPage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const router = useRouter();

//   const handleToggleLanguage = () => {
//     const newLang = toggleLanguage();
//     setLanguage(newLang);
//   };

//   useEffect(() => {
//     setLanguage(getLanguage());
//   }, []);

//   return (
//     <div>
//       <header className="header">
//         <nav className="navbar">
//           <div className="logo">
//             <img src="/logo.png" alt="Logo" className="logo-image" />
//           </div>
//           <div className="nav-links">
//             <Button text={language === "he" ? "אודות" : "About"} onClick={() => window.location.href = "#about"} />
//             <Button text={language === "he" ? "הירשם" : "Sign Up"} onClick={() => router.push("/register")} />
//             <Button text={language === "he" ? "התחברות" : "Login"} onClick={() => window.location.href = "#login"} />
//             <Button text={language === "he" ? "🇮🇱 עברית" : "English"} onClick={handleToggleLanguage} />
//             <Button text="כניסה לדף הבית של מנטור (זמני)" onClick={() => router.push("/pages/mentor/MentorHomePage")} />
//             <Button text="HomePageReserve" onClick={() => router.push("/pages/reserve/ReserveHomePage")} />
//             <Button text={language === "he" ? "נהל" : "admin"} onClick={() => router.push("/admin")} />
//           </div>
//         </nav>

//         <div className="hero">
//           <h1>{language === "he" ? "הפלטפורמה לתמיכה במשרתי מילואים" : "The Platform for Reservist Support"}</h1>
//           <p>{language === "he" ? "מצא עבודה עם ליווי מקצועי ומותאם אישית" : "Find a job with professional and personalized guidance"}</p>
//           <Button text={language === "he" ? "התחל עכשיו" : "Get Started"} onClick={() => window.location.href = "#signup"} />
//         </div>
//       </header>

//       <section id="about" className="py-16 text-center">
//         <h3 className="text-3xl font-bold">למה מסייעטק?</h3>
//         <div className="flex justify-center mt-6 space-x-8">
//           <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
//             <h4 className="font-bold text-xl">🎯 התאמה חכמה</h4>
//             <p>מצא מנטור רלוונטי לפי תחום ומיקום</p>
//           </div>
//           <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
//             <h4 className="font-bold text-xl">📝 הכנה לראיונות</h4>
//             <p>קבל פידבק AI לשיפור הראיונות</p>
//           </div>
//           <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
//             <h4 className="font-bold text-xl">💼 משרות בלעדיות</h4>
//             <p>עיין בהזדמנויות עבודה שמציעים שגרירים</p>
//           </div>
//         </div>
//       </section>

//       <main>
//         <section id="about" className="about">
//           <h2>{language === "he" ? "אודות הפלטפורמה" : "About the Platform"}</h2>
//           <p>
//             {language === "he"
//               ? "מסייעטק נועדה לסייע למשרתי מילואים להשתלב בשוק העבודה בעזרת חיבור למנטורים מקצועיים..."
//               : "Mesayaatech is designed to help reservists integrate into the job market through professional mentoring..."}
//           </p>
//         </section>
//       </main>

//       <footer className="footer">
//         <p>{language === "he" ? "© כל הזכויות שמורות למסייעטק 2025" : "© All rights reserved to Mesayaatech 2025"}</p>
//       </footer>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./LandingPage.css";
import Button from "../components/Button";
import { getLanguage, toggleLanguage } from "./language";

export default function LandingPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="logo-image" />
          </div>

          {!menuOpen && (
            <div className="menu-icon" onClick={toggleMenu}>
              ☰
            </div>
          )}

          <div className={`sidebar ${menuOpen ? 'open' : ''}`} ref={menuRef}>
            <div className="close-icon" onClick={toggleMenu}>✖</div>
            <Button text={language === "he" ?  "English" : "🇮🇱 עברית"} onClick={() => { setMenuOpen(false); handleToggleLanguage(); }} />
            <Button text={language === "he" ? "הרשמה" : "Sign Up"} onClick={() => { setMenuOpen(false); router.push("/register"); }} />
            <Button text={language === "he" ? "התחברות עם חשבון קיים" : "Login"} onClick={() => { setMenuOpen(false); window.location.href = "#login"; }} />
            <Button text="כניסה לדף הבית של מנטור (זמני)" onClick={() => { setMenuOpen(false); router.push("/pages/mentor/MentorHomePage"); }} />
            <Button text="HomePageReserve" onClick={() => { setMenuOpen(false); router.push("/pages/reserve/ReserveHomePage"); }} />
            <Button text={language === "he" ? "מנהל" : "admin"} onClick={() => { setMenuOpen(false); router.push("/admin"); }} />
            <Button text={language === "he" ? "אירועים" : "events"} onClick={() => { setMenuOpen(false); router.push("/events"); }} />
          </div>
        </nav>

        <div className="hero">
          <h1>{language === "he" ? "הפלטפורמה לתמיכה במשרתי מילואים" : "The Platform for Reservist Support"}</h1>
          <p>{language === "he" ? "מצא עבודה עם ליווי מקצועי ומותאם אישית" : "Find a job with professional and personalized guidance"}</p>
          <Button text={language === "he" ? "התחל עכשיו" : "Get Started"} onClick={() => window.location.href = "#signup"} />
        </div>
      </header>
      <section className="aboutSection" id="aboutSection">
        <h2>{language === "he" ? "אודות הפרויקט" : "About the Project"}</h2>
        <p>
          {language === "he"
            ? "מסייעטק היא פלטפורמה דיגיטלית ייחודית שנועדה לסייע למשרתי מילואים להשתלב בצורה יעילה בשוק העבודה. באמצעות התאמה חכמה למנטורים מקצועיים, ניהול תהליך ליווי אישי, והצגת משרות ייעודיות, הפלטפורמה נותנת מענה מדויק לצרכים הייחודיים של משרתי המילואים בישראל."
            : "Mesayaatech is a unique digital platform designed to help Israeli reservists integrate effectively into the workforce. Through smart matching with professional mentors, personalized mentoring management, and a dedicated job board, the platform addresses the specific needs of reservists in Israel."}
        </p>
      </section>
    </div>
  );
}
