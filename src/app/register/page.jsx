"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../LandingPage.css";
import { getLanguagePreference, setLanguagePreference } from '../language';
import "../utils/amplify-config";
import { useEffect } from "react";
import Button from "../../components/Button";



export default function RegisterPage() {
  const [language, setLanguage] = useState('he');
  const router = useRouter();

  useEffect(() => {
    setLanguage(getLanguagePreference());
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const nextLang = prev === "he" ? "en" : "he";
      setLanguagePreference(nextLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLang;
        document.body.setAttribute("dir", nextLang === "he" ? "rtl" : "ltr");
      }
      return nextLang;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold">
        {language === "he" ? "ברוך הבא למסייעטק" : "Welcome to Mesayaatech"}
      </h1>

      <div className="space-y-4 text-center">
        <p className="text-xl">
          {language === "he" ? "יש לך חשבון קיים?" : "Already have an account?"}
        </p>
        <Button
          text={language === "he" ? "התחברות" : "Login"}
          onClick={() => router.push("/login")}
        />
      </div>

      <div className="space-y-4 text-center">
        <p className="text-xl">
          {language === "he" ? "אין לך חשבון? הירשם לפי התפקיד שלך:" : "Don't have an account? Register as:"}
        </p>

        <div className="space-y-4">
          <Button
            text={language === "he" ? "מילואימניק" : "Reservist"}
            onClick={() => router.push("/register/reserve")}
          />
          <Button
            text={language === "he" ? "מנטור" : "Mentor"}
            onClick={() => router.push("/register/mentor")}
          />
          <Button
            text={language === "he" ? "שגריר" : "Ambassador"}
            onClick={() => router.push("/register/ambassador")}
          />
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <Button
          text={language === "he" ? "English" : "עברית 🇮🇱"}
          onClick={toggleLanguage}
        />
      </div>
    </div>
  );
}
