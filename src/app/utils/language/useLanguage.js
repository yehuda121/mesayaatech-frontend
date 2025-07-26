// hooks/useLanguage.js
// import { useState, useEffect } from "react";
// import { getLanguage } from "@/app/utils/language/language";

// export function useLanguage() {
//   const [language, setLanguage] = useState(getLanguage());

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener("languageChanged", handleLangChange);
//     return () => window.removeEventListener("languageChanged", handleLangChange);
//   }, []);

//   return language;
// }


import { useEffect, useState } from "react";
import { getLanguage } from "@/app/utils/language/language";

export function useLanguage() {
  const [language, setLanguage] = useState('he'); 

  useEffect(() => {
    const lang = getLanguage(); 
    setLanguage(lang);

    const handleLangChange = () => {
      const updated = getLanguage();
      setLanguage(updated);
    };

    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  return language;
}

