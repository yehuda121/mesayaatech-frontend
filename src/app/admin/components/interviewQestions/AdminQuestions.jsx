'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { ThumbsUp, Edit2, MessageCircle, Eye, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function AdminQuestions({ onEdit, onAnswer, onView }) {
  const [language, setLanguage] = useState(getLanguage());
  const [questions, setQuestions] = useState([]);
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setLanguage(getLanguage());

    const token = localStorage.getItem('idToken');
    if (token) {
      const decoded = jwtDecode(token);
      setFullName(decoded.name || '');
      setIdNumber(decoded['custom:idNumber'] || decoded.sub || '');
    }

    fetchQuestions();
  }, []);
  
  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);


  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/get-questions');
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

    const handleDelete = async (questionId) => {
    if (!confirm(t('confirmDeleteQuestion', language))) return;

    try {
      const res = await fetch('http://localhost:5000/api/delete-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });

      if (res.ok) {
        setMyQuestions(prev => prev.filter(q => q.questionId !== questionId));
      } else {
        alert(t('deleteFailed', language));
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      alert(t('serverError', language));
    }
  };

  const hasLiked = (likes = []) => likes.some(like => like.idNumber === idNumber);

  const handleLike = async (questionId, alreadyLiked) => {
    try {
      console.log('Submitting like:', { questionId, idNumber, fullName });

      const res = await fetch('http://localhost:5000/api/toggle-question-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });

      if (!res.ok) return;

      setQuestions(prev =>
        prev.map((q) =>
          q.questionId !== questionId
            ? q
            : {
                ...q,
                likes: alreadyLiked
                  ? q.likes.filter((like) => like.idNumber !== idNumber)
                  : [...(q.likes || []), { idNumber, fullName, likedAt: new Date().toISOString() }]
              }
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericCardSection
        titleKey="interviewQuesTitle"
        data={questions}
        filters={[]}
        renderCard={(q) => (
          <div className="question-card">
            <p><strong>{t('question', language)}:</strong> {q.text}</p>
            <p><strong>{t('category', language)}:</strong> {t(q.category, language)}</p>
            <p><strong>{t('createdAt', language)}:</strong> {new Date(q.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</p>
            <p><strong>{t('createdBy', language)}:</strong> {q.createdBy?.split('#')[0] || '-'}</p>

            <div className="flex gap-4 mt-2">
              <button title={t('viewAnswers', language)} onClick={() => onView && onView(q)}>
                <Eye size={18} />
              </button>
              <button title={t('editQuestion', language)} onClick={() => onEdit && onEdit(q)}>
                <Edit2 size={18}/>
              </button>
              <button title={t('answerQuestion', language)} onClick={() => onAnswer && onAnswer(q.questionId)}>
                <MessageCircle size={18} />
              </button>
              <button title={t('deleteQuestion', language)} onClick={() => handleDelete(q.questionId, q.createdBy)}>
                <Trash2 size={18} />
              </button>

              <div
                onClick={() => handleLike(q.questionId, hasLiked(q.likes))}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px'
                }}
                title={t('likeThisQuestion', language)}
              >
                <ThumbsUp
                  size={20}
                  color={hasLiked(q.likes) ? '#007bff' : '#ccc'}
                />
                <span>{q.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
        emptyTextKey="noQuestionsFound"
      />
    </div>
  );
}