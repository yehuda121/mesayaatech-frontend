'use client';

import { useEffect, useState } from 'react';
import QuestionList from './components/QuestionList';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InterviewPrepPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [questionText, setQuestionText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  const categories = [
    { value: "tech", labelHe: "הייטק", labelEn: "Tech" },
    { value: "management", labelHe: "ניהול", labelEn: "Management" },
    { value: "logistics", labelHe: "לוגיסטיקה", labelEn: "Logistics" },
    { value: "education", labelHe: "חינוך", labelEn: "Education" },
    { value: "marketing", labelHe: "שיווק", labelEn: "Marketing" },
    { value: "other", labelHe: "אחר", labelEn: "Other" }
  ];

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener("languageChanged", handleLangChange);
    setUserType(localStorage.getItem("userType"));
    setUserId(localStorage.getItem("userId"));

    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      text: questionText,
      category: selectedCategory,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('http://localhost:5000/api/interview/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(t("questionAdded", language));
        setQuestionText('');
        setSelectedCategory('');
      } else {
        toast.error(t("errorAddingQuestion", language));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("serverError", language));
    }
  };

  return (
    <div className="p-4" dir={language === 'he' ? 'rtl' : 'ltr'}>
      

      <QuestionList />

      {(userType === 'admin' || userType === 'mentor') && (
        <form className="question-form mt-8 max-w-xl mx-auto" onSubmit={handleSubmit}>
          <label className="block mb-3">
            {t("questionText", language)}
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-3">
            {t("questionCategory", language)}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">{t("selectCategory", language)}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {language === 'he' ? cat.labelHe : cat.labelEn}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {t("addQuestion", language)}
          </button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
}
