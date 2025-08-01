import { useEffect, useState } from "react";
import { getLanguage } from "@/app/utils/language/language";

export function useLanguage() {
  const [language, setLanguage] = useState(null); 

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

