// 'use client';

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import "../LandingPage.css";
// import Button from "../../components/Button";
// import { getLanguage, toggleLanguage } from "../language";

// export default function RegisterPage() {
//   const [language, setLanguage] = useState(getLanguage());
//   const [menuOpen, setMenuOpen] = useState(false);
//   const router = useRouter();
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleToggleLanguage = () => {
//     const newLang = toggleLanguage();
//     setLanguage(newLang);
//   };

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   useEffect(() => {
//     setLanguage(getLanguage());
//   }, []);

//   const tooltips = {
//     reserve: {
//       he: "מחפש ליווי מקצועי ומציאת עבודה?",
//       en: "Looking for job search guidance and career support?"
//     },
//     mentor: {
//       he: "רוצה ללוות ולכוון משרתי מילואים בדרכם התעסוקתית?",
//       en: "Want to guide and support reservists on their career path?"
//     },
//     ambassador: {
//       he: "יש לך אפשרות לסייע עם משרות? הצטרף כשגריר!",
//       en: "Can you help by sharing job opportunities? Join as an ambassador!"
//     }
//   };

//   const getTooltip = (type) => tooltips[type][language];

//   return (
//     <div>
//       <header className="header">
//         <nav className="navbar">
//           <div className="logo">
//             <img src="/logo.png" alt="Logo" className="logo-image" />
//           </div>

//           <div className="menu-icons">
//             {!menuOpen && (
//               <div className="menu-icon" onClick={toggleMenu}>
//                 ☰
//               </div>
//             )}
//             {menuOpen && (
//               <div className="close-icon" onClick={toggleMenu}>
//                 ✖
//               </div>
//             )}
//           </div>

//           <div className={`sidebar ${menuOpen ? 'open' : 'closed'}`} ref={menuRef}>
//             <Button text={language === "he" ? "English" : "🇮🇱 עברית"} onClick={() => { setMenuOpen(false); handleToggleLanguage(); }} />
//             <div className="divider"></div>
//             <Button text={language === "he" ? "דף הבית" : "Home"} onClick={() => { setMenuOpen(false); router.push("/"); }} />
//             <Button text={language === "he" ? "התחברות" : "Login"} onClick={() => { setMenuOpen(false); router.push("/login"); }} />
//             <div>{language === "he" ? "או הירשם עכשיו" : "Register now"}</div>
//             <Button text={language === "he" ? "מילואימניק" : "reserve"} onClick={() => { setMenuOpen(false); router.push("/register/reserve"); }} />
//             <Button text={language === "he" ? "מנטור" : "mentor"} onClick={() => { setMenuOpen(false); router.push("/register/mentor"); }} />
//             <Button text={language === "he" ? "שגריר" : "Ambassador"} onClick={() => { setMenuOpen(false); router.push("/register/ambassador"); }} />
//           </div>
//         </nav>

//         <div className="hero">
//           <h1>{language === "he" ? "ברוך הבא למסייעטק" : "Welcome to Mesayaatech"}</h1>
//           <p>{language === "he" ? "הירשם והצטרף לקהילה" : "Register and join the community"}</p>
//         </div>
//       </header>

//       <section className="aboutSection" id="registerForm">
//         <div className="flex flex-col items-center justify-center p-8 space-y-8">
//           {/* <h2 className="text-3xl font-bold">
//             {language === "he" ? "התחבר או הירשם" : "Login or Register"}
//           </h2>

//           <div className="space-y-4 text-center">
//             <p className="text-xl">
//               {language === "he" ? "?יש לך כבר חשבון" : "Already have an account?"}
//             </p>
//             <Button
//               text={language === "he" ? "התחברות" : "Login"}
//               onClick={() => router.push("/login")}
//             />
//           </div> */}

//           <div className="space-y-4 text-center">
//             <p className="text-xl">
//               {language === "he" ? "הירשם עכשיו בתור" : "Register as"}
//             </p>

//             <div className="space-y-4">
//               {["reserve", "mentor", "ambassador"].map((type) => (
//                 <div className="tooltip-wrapper" key={type}>
//                   <span className="tooltip-text">{getTooltip(type)}</span>
//                   <Button
//                     text={
//                       language === "he"
//                         ? type === "reserve" ? "מילואימניק" :
//                           type === "mentor" ? "מנטור" : "שגריר"
//                         : type === "reserve" ? "Reservist" :
//                           type === "mentor" ? "Mentor" : "Ambassador"
//                     }
//                     onClick={() => router.push(`/register/${type}`)}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./../pages/LandingPage/LandingPage.css";
import Button from "../components/Button";
import SideBar from "../components/SideBar";
import { getLanguage } from "../language";

export default function RegisterPage() {
  const [language, setLanguage] = useState(getLanguage());
  const router = useRouter();

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getLanguage());
    };

    setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const tooltips = {
    reserve: {
      he: "מחפש ליווי מקצועי ומציאת עבודה?",
      en: "Looking for job search guidance and career support?"
    },
    mentor: {
      he: "רוצה ללוות ולכוון משרתי מילואים בדרכם התעסוקתית?",
      en: "Want to guide and support reservists on their career path?"
    },
    ambassador: {
      he: "יש לך אפשרות לסייע עם משרות? הצטרף כשגריר!",
      en: "Can you help by sharing job opportunities? Join as an ambassador!"
    }
  };

  const getTooltip = (type) => tooltips[type][language];

  const navItems = [
    { labelHe: "דף הבית", labelEn: "Home", path: "/" },
    { labelHe: "התחברות", labelEn: "Login", path: "/login" },
  ];

  return (
    <div>
      <SideBar navItems={navItems} />
      <div className="LPtop_Section">
        <h1>{language === "he" ? "ברוך הבא למסייעטק" : "Welcome to Mesayaatech"}</h1>
        <p>{language === "he" ? "הירשם והצטרף לקהילה" : "Register and join the community"}</p>
      </div>

      <main className="dashboard-main">
        <section className="aboutSection" id="registerForm">
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <div className="space-y-4 text-center">
              <p className="text-xl">
                {language === "he" ? "הירשם עכשיו בתור" : "Register as"}
              </p>

              <div className="flex flex-row gap-x-4 justify-center">
                {["reserve", "mentor", "ambassador"].map((type) => (
                  <div className="tooltip-wrapper" key={type}>
                    <span className="tooltip-text">{getTooltip(type)}</span>
                    <Button
                      text={
                        language === "he"
                          ? type === "reserve" ? "מילואימניק" :
                            type === "mentor" ? "מנטור" : "שגריר"
                          : type === "reserve" ? "Reservist" :
                            type === "mentor" ? "Mentor" : "Ambassador"
                      }
                      onClick={() => router.push(`/register/${type}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
