"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../LandingPage.css";
import Button from "../../components/Button";
import { getLanguage, toggleLanguage } from "../language";

export default function RegisterPage() {
  const [language, setLanguage] = useState(getLanguage());
  const router = useRouter();

  const handleToggleLanguage = () => {
    const newLang = toggleLanguage();
    setLanguage(newLang);
  };

  useEffect(() => {
    setLanguage(getLanguage());
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold">
        {language === "he" ? "ברוך הבא למסייעטק" : "Welcome to Mesayaatech"}
      </h1>

      <div className="space-y-4 text-center">
        <p className="text-xl">
          {language === "he" ? "?יש לך כבר חשבון" : "Already have an account?"}
        </p>
        <Button
          text={language === "he" ? "התחברות" : "Login"}
          onClick={() => router.push("/login")}
        />
      </div>

      <div className="space-y-4 text-center">
        <p className="text-xl">
          {language === "he" ? "אין לך חשבון? הירשם עכשיו בתור" : "Don't have an account? Register as"}
        </p>

        <div className="space-y-4">
          {["reserve", "mentor", "ambassador"].map((type) => (
            <div className="tooltip-wrapper" key={type}>
              <span className="tooltip-text">{getTooltip(type)}</span>
              <Button
                text={
                  language === "he" ? 
                  type === "reserve" ? "מילואימניק": 
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

      <div className="absolute top-4 right-4">
        <Button
          text={language === "he" ? "English" : "עברית 🇮🇱"}
          onClick={handleToggleLanguage}
        />
      </div>
    </div>
  );
}