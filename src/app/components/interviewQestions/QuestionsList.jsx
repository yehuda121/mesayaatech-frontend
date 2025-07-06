'use client';
import { useEffect, useState } from 'react';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { t } from '@/app/utils/loadTranslations';
import ViewQuestion from './ViewQuestion'; 
import Button from '@/app/components/Button/Button';
import { ThumbsUp, FileSearch, MessageCircleMore,  Book, BookOpen , Edit2,Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useLanguage } from "@/app/utils/language/useLanguage";
import { translatedJobFields } from "@/app/components/jobs/jobFields";
import PostAnswer from './PostAnswer';
import ConfirmDialog from '../notifications/ConfirmDialog';
import EditQuestion from './EditQuestion';
import DraggableButton from '@/app/components/DraggableButton/DraggableButton';
import AddQuestion from './AddNewQuestion';

export default function QuestionsPage({ onAnswer }) {
  const [questions, setQuestions] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [sortMode, setSortMode] = useState('newest');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const selectedQuestion = questions.find(q => q.questionId === selectedQuestionId);
  const [userType, setUserType] = useState(null);
  const [idNumber, setIdNumber] = useState(null);
  const [filterLikedOnly, setFilterLikedOnly] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterReadOnly, setFilterReadOnly] = useState(false);
  const [fullName, setFullName] = useState('');
  const [questionToAnswer, setQuestionToAnswer] = useState(null);
  const language = useLanguage();
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [alert, setAlert] = useState(null);
  const [questionToEdit, setQuestionToEdit] = useState(null); 
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const categories = [
    { value: "", labelHe: "הכל", labelEn: "All" },
    ...Object.entries(translatedJobFields).map(([value, labels]) => ({
      value,
      labelHe: labels.he,
      labelEn: labels.en,
    }))
  ];

  useEffect(() => {
    const idToken = sessionStorage.getItem('idToken');
    const fullName = sessionStorage.getItem('fullName');

    if (idToken) {
      try {
        const decoded = jwtDecode(idToken);
        setUserType(decoded['custom:role']);
        setIdNumber(decoded['custom:idNumber'] || decoded['sub']);
        setFullName(fullName);
      } catch (err) {
        console.error('Failed to decode idToken:', err);
      }
    }

    fetchQuestions();
  }, []);

  const hasRead = (readBy = []) => {
    return readBy.some(read => read.idNumber === idNumber);
  };

  const handleReadToggle = async (questionId, alreadyRead) => {
    try {
      const res = await fetch('http://localhost:5000/api/toggle-question-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });

      if (!res.ok) return;

      setQuestions(prev =>
        prev.map(q => {
          if (q.questionId !== questionId) return q;
          const prevRead = q.readBy || [];
          const updatedRead = alreadyRead
            ? prevRead.filter(read => read.idNumber !== idNumber)
            : [...prevRead, { idNumber, fullName, readAt: new Date().toISOString() }];

          return { ...q, readBy: updatedRead };
        })
      );
    } catch (err) {
      console.error('Read toggle failed:', err);
    }
  };

  // const fetchQuestions = async () => {
  //   try {
  //     const res = await fetch('http://localhost:5000/api/get-questions');
  //     const data = await res.json();
  //     setQuestions(data);
  //   } catch (err) {
  //     console.error('Error loading questions:', err);
  //   }
  // };
  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/get-questions');
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
  

  const hasLiked = (likes = []) => {
    return likes.some(like => like.idNumber === idNumber);
  };

  const handleLike = async (questionId, alreadyLiked) => {
    try {
      const res = await fetch('http://localhost:5000/api/toggle-question-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });

      if (!res.ok) {
        console.error('Like toggle failed');
        return;
      }

      setQuestions((prev) =>
        prev.map((q) => {
          if (q.questionId !== questionId) return q;

          const prevLikes = q.likes || [];
          const updatedLikes = alreadyLiked
            ? prevLikes.filter((like) => like.idNumber !== idNumber)
            : [...prevLikes, { idNumber, fullName, likedAt: new Date().toISOString() }];

          return { ...q, likes: updatedLikes };
        })
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const filteredAndSorted = questions
    .filter(q =>
      q.text.toLowerCase().includes(searchText.toLowerCase()) &&
      (!filteredCategory || q.category === filteredCategory) &&
      (!filterLikedOnly || hasLiked(q.likes)) &&
      (!filterReadOnly || !hasRead(q.readBy))
    )
    .sort((a, b) => {
      if (sortMode === 'popular') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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

  const filters = [
    <div
      key="filter-wrap"
      style={{
        display: 'flex',
        width: '100%',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <input
        key="search"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={t('searchByText', language)}
        className="filter-input"
      />
      <select
        key="category"
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
      <select
        key="sort"
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value)}
        className="filter-input"
      >
        <option value="newest">{t('sortByNewest', language)}</option>
        <option value="popular">{t('sortByPopularity', language)}</option>
      </select>
      <Button
        onClick={() => setFilterLikedOnly(!filterLikedOnly)}
      >
        {filterLikedOnly ? t('cancel', language) : t('likedQuestions', language)}
      </Button>
      <Button
        onClick={() => setFilterReadOnly(!filterReadOnly)}
      >
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
            <p><strong>{t('question', language)}:</strong> {q.text}</p>
            <p><strong>{t('createdAt', language)}:</strong> {new Date(q.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</p>
            <p>
              <strong>{t('createdBy', language)}:</strong> {q.createdBy?.split('#')[0] || t('unknownUser', language)}
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className='text-green-600'
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedQuestionId(q.questionId);
                }}
                title={t('viewQestion', language)}
              >
                <FileSearch size={18} />
              </button>

              {userType !== 'reservist' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuestionToAnswer(q);
                  }}
                  title={t('postAnswer', language)}
                >
                  <MessageCircleMore size={18} />
                </button>
              )}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(q.questionId, hasLiked(q.likes));
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
                title={t('like', language)}
              >
                <ThumbsUp
                  size={22}
                  color={hasLiked(q.likes) ? '#007bff' : '#ccc'}
                />
                <span>{q.likes?.length || 0}</span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadToggle(q.questionId, hasRead(q.readBy));
                }}
                title={hasRead(q.readBy) ? t('markAsUnread', language) : t('markAsRead', language)}
                style={{ cursor: 'pointer', fontSize: '20px' }}
              >
                {hasRead(q.readBy) ? (
                  <BookOpen size={22} color="#4CAF50" />
                ) : (
                  <Book size={22} color="#bbb" />
                )}
              </div>
                            
              {userType === 'admin' && (
                <div className="mt-3 flex gap-4">
                  <button
                    title={t('edit', language)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuestionToEdit(q); 
                    }}
                  >
                    <Edit2 size={20} />
                  </button>

                  <button
                    title={t('delete', language)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(q.questionId);
                    }}
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
        <DraggableButton
          title={t('addNewQuestion', language)}
          onClick={() => setShowAddQuestion(true)}
        />
      )}

      {showAddQuestion && (
        <AddQuestion
          onClose={() => setShowAddQuestion(false)}
          onSuccess={() => {
            setShowAddQuestion(false);
            fetchQuestions();
          }}
          fullName={fullName}
          idNumber={idNumber}
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
          onSave={() => {
            setQuestionToEdit(null);
            fetchQuestions();
          }}
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
          idNumber={idNumber}
          onSuccess={() => {
            fetchQuestions();
          }}
          onClose={() => setQuestionToAnswer(null)}
        />
      )}
    </div>
  );
}