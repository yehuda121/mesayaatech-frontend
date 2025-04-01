"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import "./LandingPage.css";
import Button from "../components/Button";
import { getLanguagePreference, setLanguagePreference } from './language';
import { useEffect } from "react";

export default function LandingPage() {
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
        <div>
            <header className="header">
                <nav className="navbar">
                    <div className="logo">
                        <img src="/logo.png" alt="Logo" className="logo-image" />
                    </div>
                    <div className="nav-links">
                        <Button text={language === "he" ? "אודות" : "About"} onClick={() => window.location.href = "#about"} />
                        <Button text={language === "he" ? "הירשם" : "Sign Up"} onClick={() => router.push("/register")} />
                        <Button text={language === "he" ? "התחברות" : "Login"} onClick={() => window.location.href = "#login"} />
                        <Button text={language === "he" ? "🇮🇱 עברית" : "English"} onClick={toggleLanguage} />
                        <Button text="HomePageReserve" onClick={() => router.push("/HomePageReserve")} />
                    </div>
                </nav>
                <div className="hero">
                    <h1>{language === "he" ? "הפלטפורמה לתמיכה במשרתי מילואים" : "The Platform for Reservist Support"}</h1>
                    <p>{language === "he" ? "מצא עבודה עם ליווי מקצועי ומותאם אישית" : "Find a job with professional and personalized guidance"}</p>
                    <Button text={language === "he" ? "התחל עכשיו" : "Get Started"} onClick={() => window.location.href = "#signup"} />
                </div>
            </header>

            <section id="about" className="py-16 text-center">
                <h3 className="text-3xl font-bold">למה מסייעטק?</h3>
                <div className="flex justify-center mt-6 space-x-8">
                    <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
                        <h4 className="font-bold text-xl">🎯 התאמה חכמה</h4>
                        <p>מצא מנטור רלוונטי לפי תחום ומיקום</p>
                    </div>
                    <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
                        <h4 className="font-bold text-xl">📝 הכנה לראיונות</h4>
                        <p>קבל פידבק AI לשיפור הראיונות</p>
                    </div>
                    <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
                        <h4 className="font-bold text-xl">💼 משרות בלעדיות</h4>
                        <p>עיין בהזדמנויות עבודה שמציעים שגרירים</p>
                    </div>
                </div>
            </section>

            <main>
                <section id="about" className="about">
                    <h2>{language === "he" ? "אודות הפלטפורמה" : "About the Platform"}</h2>
                    <p>{language === "he" ?
                        "מסייעטק נועדה לסייע למשרתי מילואים להשתלב בשוק העבודה בעזרת חיבור למנטורים מקצועיים..."
                        : "Mesayaatech is designed to help reservists integrate into the job market through professional mentoring..."}
                    </p>
                </section>

            </main>

            <footer className="footer">
                <p>{language === "he" ? "© כל הזכויות שמורות למסייעטק 2025" : "© All rights reserved to Mesayaatech 2025"}</p>
            </footer>
        </div>
    );
}
