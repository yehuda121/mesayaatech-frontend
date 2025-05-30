'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import SideBar from "../components/SideBar";
import { getLanguage } from "../language";
import { t } from "@/app/utils/loadTranslations";
import './registrationForm.css';

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

  const navItems = [
    { labelHe: "דף הבית", labelEn: "Home", path: "/" },
    { labelHe: "התחברות", labelEn: "Login", path: "/login" },
  ];

  return (
  <div>
    <SideBar navItems={navItems} />

    <div className="register-layout">
      <div className="register-top-section">
        <h1>{t('registerWelcomeTitle', language)}</h1>
        <p>{t('registerWelcomeSubtitle', language)}</p>
      </div>

      <div className="register-options-section">
        <p className="register-options-title">{t('registerAs', language)}</p>
        <div className="register-buttons-group">
          {["reserve", "mentor", "ambassador"].map((type) => (
            <div className="tooltip-wrapper" key={type}>
              <Button
                text={t(`registerAs_${type}`, language)}
                onClick={() => router.push(`/register/${type}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

}
