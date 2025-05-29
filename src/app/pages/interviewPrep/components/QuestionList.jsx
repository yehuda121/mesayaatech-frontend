'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import '../interviewPrep.css';
import AddAnswerModal from './AddAnswerModal';

export default function QuestionList({ userType }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
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
      console.log("🧪 Raw answers for debug:", data.map(q => ({
        questionId: q.questionId,
        answers: q.answers
      })));      
      setQuestions(data);

      const grouped = {};
      data.forEach((q) => {
        const field = q.category || 'other';
        if (!grouped[field]) grouped[field] = [];
        grouped[field].push(q);
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
            <h2 className="field-title">{field || t('noCategory', language)}</h2>
            {questionsInField.map((question) => (
              <div key={question.questionId} className="question-box">
                <p className="question-text">{question.text || ''}</p>

                <div className="answers-list">
                  {(question.answers || []).map((ans) => (
                    <div key={ans.answerId} className="answer-item">
                    ✔ <span className="answer-meta">
                      {ans.answeredName || t('unknownUser', language)} • {new Date(ans.createdAt).toLocaleDateString()}:
                    </span> {ans.text}
                  </div>
                  
                  
                  ))}
                </div>

                {(userType === 'mentor' || userType === 'admin') && (
                  <button
                    className="add-answer-btn"
                    onClick={() => {
                      setSelectedQuestionId(question.questionId);
                      setShowModal(true);
                    }}
                  >
                    {t('addAnswer', language)}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      {showModal && selectedQuestionId && (
        <AddAnswerModal
          questionId={selectedQuestionId}
          onClose={() => setShowModal(false)}
          onSuccess={fetchQuestions}
        />
      )}
    </div>
  );
}
