// hooks/useLanguage.js
import { useState, useEffect } from "react";
import { getLanguage } from "@/app/utils/language/language";

export function useLanguage() {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  return language;
}
