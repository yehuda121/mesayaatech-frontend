'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import '../interviewPrep.css';

export default function QuestionList() {
  const [language, setLanguage] = useState(getLanguage());
  const [questions, setQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});

  useEffect(() => {
    setLanguage(getLanguage());

    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    fetchQuestions();

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/interview/questions');
      const data = await res.json();
      setQuestions(data);

      // Group questions by field
      const grouped = {};
      data.forEach((q) => {
        if (!grouped[q.field]) grouped[q.field] = [];
        grouped[q.field].push(q);
      });
      setGroupedQuestions(grouped);

    } catch (err) {
      console.error('❌ Failed to load questions:', err);
    }
  };

  return (
    <div className="question-list-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-center mb-6">
        {t('interviewPrepTitle', language)}
      </h1>

      {Object.keys(groupedQuestions).length === 0 ? (
        <p className="text-center">{t('noQuestionsFound', language)}</p>
      ) : (
        Object.entries(groupedQuestions).map(([field, questionsInField]) => (
          <div key={field} className="question-section">
            <h2 className="field-title">{field}</h2>

            {questionsInField.map((question) => (
              <div key={question.questionId} className="question-box">
                <p className="question-text">{question.text}</p>

                <div className="answers-list">
                  {(question.answers || []).map((ans, idx) => (
                    <div key={idx} className="answer-item">✔ {ans}</div>
                  ))}
                </div>

                <button className="add-answer-btn">
                  {t('addAnswer', language)}
                </button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
