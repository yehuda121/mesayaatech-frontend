'use client';
import { useEffect, useState } from 'react';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { t } from '@/app/utils/loadTranslations';
import ViewQuestion from './ViewQuestion'; 
import Button from '@/app/components/Button/Button';
import { ThumbsUp, FileSearch, MessageCircleMore, Book, BookOpen, Edit2, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useLanguage } from "@/app/utils/language/useLanguage";
import { JobFields } from "@/app/components/jobs/jobFields";
import PostAnswer from './PostAnswer';
import ConfirmDialog from '../Notifications/ConfirmDialog';
import EditQuestion from './EditQuestion';
import DraggableButton from '@/app/components/DraggableButton/DraggableButton';
import AddQuestion from './AddNewQuestion';
import sanitizeText from '@/app/utils/sanitizeText';
import AlertMessage from '../Notifications/AlertMessage';
import './style/QuestionsPage.css'; 

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const selectedQuestion = questions.find(q => q.questionId === selectedQuestionId);
  const [questionToEdit, setQuestionToEdit] = useState(null); 
  const [questionToAnswer, setQuestionToAnswer] = useState(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [sortMode, setSortMode] = useState('newest');
  const [filteredCategory, setFilteredCategory] = useState('');
  const [filterLikedOnly, setFilterLikedOnly] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterReadOnly, setFilterReadOnly] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [alert, setAlert] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [fullName, setFullName] = useState('');
  const language = useLanguage();

  const fieldOptions = [
    { value: '', label: t('all', language) },
    ...Object.keys(JobFields).map(value => ({ value, label: t(`${value}`, language) }))
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const storedIdNumber = sessionStorage.getItem('idNumber');
    const storedFullName = sessionStorage.getItem('fullName');
    const storedUserType = sessionStorage.getItem('userType');

    if (storedIdNumber) setUserId(storedIdNumber);
    if (storedFullName) setFullName(storedFullName);
    if (storedUserType) setUserType(storedUserType);
  }, []);

  const hasRead = (readBy = []) => readBy.some(read => read.idNumber === userId);

  const handleReadToggle = async (questionId, alreadyRead) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/toggle-question-read`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` 
        },
        body: JSON.stringify({ questionId, idNumber: userId, fullName })
      });
      if (!res.ok) return;

      setQuestions(prev =>
        prev.map(q => {
          if (q.questionId !== questionId) return q;
          const prevRead = q.readBy || [];
          const updatedRead = alreadyRead
            ? prevRead.filter(read => read.idNumber !== userId)
            : [...prevRead, { idNumber: userId, fullName, readAt: new Date().toISOString() }];
          return { ...q, readBy: updatedRead };
        })
      );
    } catch (err) {
      console.error('Read toggle failed:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/get-questions`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` }
      });
      const data = await res.json();
      const formatted = data.map(q => ({
        ...q,
        questionId: q.questionId || q.PK?.replace('question#', ''),
        PK: q.PK,
      }));
      setQuestions(formatted);
    } catch (err) {
      console.error('Error loading questions:', err);
    }
  };

  const hasLiked = (likes = []) => likes.some(like => like.idNumber === userId);

  const handleLike = async (questionId, alreadyLiked) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/toggle-question-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ questionId, idNumber: userId, fullName })
      });
      if (!res.ok) {
        console.error('Like toggle failed');
        return;
      }

      setQuestions(prev =>
        prev.map(q => {
          if (q.questionId !== questionId) return q;
          const prevLikes = q.likes || [];
          const updatedLikes = alreadyLiked
            ? prevLikes.filter(like => like.idNumber !== userId)
            : [...prevLikes, { idNumber: userId, fullName, likedAt: new Date().toISOString() }];
          return { ...q, likes: updatedLikes };
        })
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const filteredAndSorted = questions
    .filter(q =>
      (q.text || '').toLowerCase().includes((searchText || '').toLowerCase()) &&
      (!filteredCategory || q.category === filteredCategory) &&
      (!filterLikedOnly || hasLiked(q.likes)) &&
      (!filterReadOnly || !hasRead(q.readBy))
    )
    .sort((a, b) => (sortMode === 'popular'
      ? (b.likes?.length || 0) - (a.likes?.length || 0)
      : new Date(b.createdAt) - new Date(a.createdAt)
    ));

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ questionId, idNumber: userId, fullName })
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

  function truncateText(text, maxLength = 30) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  const filters = [
    <div key="filter-wrap" className="questions-filters">
      <input
        key="search"
        type="text"
        value={searchText}
        onChange={(e) => {
          const result = sanitizeText(e.target.value, 100);
          if (result.wasModified) {
            setAlert({ message: t('unsafeInputSanitized', language), type: 'warning' });
          }
          setSearchText(result.text);
        }}
        placeholder={t('searchByText', language)}
        className="filter-input"
      />
      <select
        key="category"
        value={filteredCategory}
        onChange={(e) => setFilteredCategory(e.target.value)}
        className="filter-input compact-filter"
      >
        {fieldOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        key="sort"
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value)}
        className="filter-input compact-filter"
      >
        <option value="newest">{t('sortByNewest', language)}</option>
        <option value="popular">{t('sortByPopularity', language)}</option>
      </select>
      <Button onClick={() => setFilterLikedOnly(!filterLikedOnly)}>
        {filterLikedOnly ? t('cancel', language) : t('likedQuestions', language)}
      </Button>
      <Button onClick={() => setFilterReadOnly(!filterReadOnly)}>
        {filterReadOnly ? t('cancel', language) : t('readQuestions', language)}
      </Button>
    </div>
  ];

  return (
    <div className='text-start' dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericCardSection
        titleKey="interviewQuesTitle"
        filters={filters}
        data={filteredAndSorted}
        renderCard={(q) => (
          <div className="question-card">
            <p><strong>{t('question', language)}:</strong> {truncateText(q.text, 100)}</p>
            <p><strong>{t('createdAt', language)}:</strong> {new Date(q.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</p>
            <p><strong>{t('createdBy', language)}:</strong>{' '}
              {q.createdBy?.split('#')[0] === 'Admin'
                ? t('Admin', language)
                : (q.createdBy?.split('#')[0] || t('unknownUser', language))}
            </p>

            <div className="question-actions">
              <button
                className='view-btn'
                onClick={(e) => { e.stopPropagation(); setSelectedQuestionId(q.questionId); }}
                title={t('viewQestion', language)}
              >
                <FileSearch size={18} />
              </button>

              {userType !== 'reservist' && (
                <button
                  className='answer-btn'
                  onClick={(e) => { e.stopPropagation(); setQuestionToAnswer(q); }}
                  title={t('postAnswer', language)}
                >
                  <MessageCircleMore size={18} />
                </button>
              )}

              <div
                className={`like-toggle ${hasLiked(q.likes) ? 'liked' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleLike(q.questionId, hasLiked(q.likes)); }}
                title={t('like', language)}
              >
                <ThumbsUp size={22} className="icon" />
                <span className="like-count">{q.likes?.length || 0}</span>
              </div>

              <div
                className={`read-toggle ${hasRead(q.readBy) ? 'read' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleReadToggle(q.questionId, hasRead(q.readBy)); }}
                title={hasRead(q.readBy) ? t('markAsUnread', language) : t('markAsRead', language)}
              >
                {hasRead(q.readBy) ? <BookOpen size={22} className="icon" /> : <Book size={22} className="icon" />}
              </div>

              {userType === 'admin' && (
                <div className="admin-actions">
                  <button
                    title={t('edit', language)}
                    onClick={(e) => { e.stopPropagation(); setQuestionToEdit(q); }}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    title={t('delete', language)}
                    onClick={(e) => { e.stopPropagation(); handleDelete(q.questionId); }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      />

      {userType !== 'reservist' && (
        <DraggableButton title={t('addNewQuestion', language)} onClick={() => setShowAddQuestion(true)} />
      )}

      {showAddQuestion && (
        <AddQuestion
          onClose={() => setShowAddQuestion(false)}
          onSuccess={() => { setShowAddQuestion(false); fetchQuestions(); }}
          fullName={fullName}
          idNumber={userId}
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

      {questionToEdit && (
        <EditQuestion
          question={questionToEdit}
          onClose={() => setQuestionToEdit(null)}
          onSave={() => { setQuestionToEdit(null); fetchQuestions(); }}
        />
      )}

      {selectedQuestion && (
        <ViewQuestion
          question={selectedQuestion}
          onClose={() => setSelectedQuestionId(null)}
          onUpdate={fetchQuestions}
        />
      )}

      {questionToAnswer && (
        <PostAnswer
          questionId={questionToAnswer.questionId}
          fullName={fullName}
          idNumber={userId}
          onSuccess={() => { fetchQuestions(); }}
          onClose={() => setQuestionToAnswer(null)}
        />
      )}

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
