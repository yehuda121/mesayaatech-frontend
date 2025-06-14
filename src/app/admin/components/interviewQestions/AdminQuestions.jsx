'use client';

import { useEffect, useState, useMemo } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { ThumbsUp, Edit2, MessageCircle, Eye, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import ConfirmDialog from '@/app/components/notifications/ConfirmDialog';

export default function AdminQuestions({ onEdit, onAnswer, onView }) {
  const [language, setLanguage] = useState(getLanguage());
  const [questions, setQuestions] = useState([]);
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('');
  const [alert, setAlert] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const categories = [
    { value: "", labelHe: "הכל", labelEn: "All" },
    { value: "tech", labelHe: "הייטק", labelEn: "Tech" },
    { value: "management", labelHe: "ניהול", labelEn: "Management" },
    { value: "logistics", labelHe: "לוגיסטיקה", labelEn: "Logistics" },
    { value: "education", labelHe: "חינוך", labelEn: "Education" },
    { value: "marketing", labelHe: "שיווק", labelEn: "Marketing" },
    { value: "other", labelHe: "אחר", labelEn: "Other" }
  ];

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
      setAlert({ message: t('serverError', language), type: 'error' });
    }
  };

  const handleDelete = (questionId) => {
    setConfirmDialog({
      title: t('confirmDeleteQuestionTitle', language),
      message: t('confirmDeleteQuestionText', language),
      onConfirm: () => confirmDelete(questionId),
      onCancel: () => setConfirmDialog(null),
    });
  };

  const confirmDelete = async (questionId) => {
    try {
      const res = await fetch('http://localhost:5000/api/delete-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });
      if (res.ok) {
        setQuestions(prev => prev.filter(q => q.questionId !== questionId));
        setAlert({ message: t('deleteSuccess', language), type: 'success' });
      } else {
        setAlert({ message: t('deleteFailed', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      setAlert({ message: t('serverError', language), type: 'error' });
    } finally {
      setConfirmDialog(null);
    }
  };

  const hasLiked = (likes = []) => likes.some(like => like.idNumber === idNumber);

  const handleLike = async (questionId, alreadyLiked) => {
    try {
      const res = await fetch('http://localhost:5000/api/toggle-question-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });

      if (!res.ok) return;

      setQuestions(prev =>
        prev.map(q =>
          q.questionId !== questionId
            ? q
            : {
                ...q,
                likes: alreadyLiked
                  ? q.likes.filter(like => like.idNumber !== idNumber)
                  : [...(q.likes || []), { idNumber, fullName, likedAt: new Date().toISOString() }]
              }
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const textMatch = q.text.toLowerCase().includes(searchText.toLowerCase());
      const categoryMatch = !filteredCategory || q.category === filteredCategory;
      return textMatch && categoryMatch;
    });
  }, [questions, searchText, filteredCategory]);

  const filters = [
    <input
      key="search"
      type="text"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder={t('searchByText', language)}
      className="filter-input"
    />,
    <select
      key="stage"
      value={filteredCategory}
      onChange={(e) => setFilteredCategory(e.target.value)}
      className="filter-input"
    >
      {categories.map(cat => (
        <option key={cat.value} value={cat.value}>
          {language === 'he' ? cat.labelHe : cat.labelEn}
        </option>
      ))}
    </select>
  ];

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericCardSection
        titleKey="interviewQuesTitle"
        data={filteredQuestions}
        filters={filters}
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
              <button title={t('deleteQuestion', language)} onClick={() => handleDelete(q.questionId)}>
                <Trash2 size={18} />
              </button>

              <div
                onClick={() => handleLike(q.questionId, hasLiked(q.likes))}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '4px' }}
                title={t('likeThisQuestion', language)}
              >
                <ThumbsUp size={20} color={hasLiked(q.likes) ? '#007bff' : '#ccc'} />
                <span>{q.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
        emptyTextKey="noQuestionsFound"
      />

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
}
