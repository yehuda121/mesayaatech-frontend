'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import '../interviewPrep.css';
import AddAnswerModal from './AddAnswerModal';

export default function QuestionList({ userType, sortMode = 'default', userId }) {
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

      // מיון לפי פופולריות אם צריך
      const sorted = sortMode === 'popular'
        ? [...data].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        : data;

      setQuestions(sorted);

      const grouped = {};
      sorted.forEach((q) => {
        const field = q.category || 'other';
        if (!grouped[field]) grouped[field] = [];
        grouped[field].push(q);
      });
      setGroupedQuestions(grouped);
    } catch (err) {
      console.error('❌ Failed to load questions:', err);
    }
  };

  const toggleLike = async (questionId) => {
    try {
      const idNumber = localStorage.getItem('idNumber');
      const fullName = localStorage.getItem('fullName');

      const res = await fetch('http://localhost:5000/api/interview/like-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName }),
      });

      if (res.ok) {
        fetchQuestions(); // רענון הלייקים
      } else {
        console.error('Failed to toggle like');
      }
    } catch (err) {
      console.error('Error liking question:', err);
    }
  };

  const hasLiked = (likes) => {
    const idNumber = localStorage.getItem('idNumber');
    return likes?.some(like => like.idNumber === idNumber);
  };

  return (
    <div className="question-list-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-center mb-6">
        {t('interviewQuesTitle', language)}
      </h1>

      {Object.keys(groupedQuestions).length === 0 ? (
        <p className="text-center">{t('noQuestionsFound', language)}</p>
      ) : (
        Object.entries(groupedQuestions).map(([field, questionsInField]) => (
          <div key={field} className="question-section">
            <h2 className="field-title">{field || t('noCategory', language)}</h2>
            {questionsInField.map((question) => (
              <div key={question.questionId} className="question-box">
                <div className="flex justify-between items-center">
                  <p className="question-text">{question.text || ''}</p>
                  <button
                    className="like-btn"
                    onClick={() => toggleLike(question.questionId)}
                    title={t('like', language)}
                  >
                    {hasLiked(question.likes) ? '❤️' : '🤍'} {question.likes?.length || 0}
                  </button>
                </div>

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
