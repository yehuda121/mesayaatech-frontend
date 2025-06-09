'use client';
import { useEffect, useState } from 'react';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ViewQuestion from './ViewQuestion'; 
import Button from '@/app/components/Button';
import { ThumbsUp, FileSearch, MessageCircleMore } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';


export default function QuestionsPage({ onAnswer }) {
  const [language, setLanguage] = useState(getLanguage());
  const [questions, setQuestions] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [sortMode, setSortMode] = useState('newest');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [idNumber, setIdNumber] = useState(null);

  const categories = [
    { value: "", labelHe: "הכול", labelEn: "All" },
    { value: "tech", labelHe: "הייטק", labelEn: "Tech" },
    { value: "management", labelHe: "ניהול", labelEn: "Management" },
    { value: "logistics", labelHe: "לוגיסטיקה", labelEn: "Logistics" },
    { value: "education", labelHe: "חינוך", labelEn: "Education" },
    { value: "marketing", labelHe: "שיווק", labelEn: "Marketing" },
    { value: "other", labelHe: "אחר", labelEn: "Other" }
  ];

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);

    const fullName = localStorage.getItem('fullName');
    const idToken = localStorage.getItem('idToken');

    const decodedType = jwtDecode(idToken);
    setUserType(decodedType['custom:role']);

    let idNumber = null;
    if (idToken) {
      try {
        const decoded = jwtDecode(idToken);
        idNumber = decoded['custom:idNumber'] || decoded['sub'];
        setIdNumber(idNumber);
      } catch (err) {
        console.error('Failed to decode idToken:', err);
      }
    }

    setUserId(localStorage.getItem("userId"));
    fetchQuestions();

    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/get-questions');
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error loading questions:', err);
    }
  };

  const hasLiked = (likes = []) => {
    return likes.some(like => like.idNumber === idNumber);
  };

  const handleLike = async (questionId, alreadyLiked) => {
    try {
      const fullName = localStorage.getItem('fullName');

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
    .filter(q => !filteredCategory || q.category === filteredCategory)
    .sort((a, b) => {
      if (sortMode === 'popular') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt); 
    });

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
      <select
        key="category"
        value={filteredCategory}
        onChange={(e) => setFilteredCategory(e.target.value)}
        style={{
          flex: 1,
          padding: '0.5rem 0.75rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '1rem',
          backgroundColor: '#fff',
          minWidth: '0'
        }}
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
        style={{
          flex: 1,
          padding: '0.5rem 0.75rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '1rem',
          backgroundColor: '#fff',
          minWidth: '0'
        }}
      >
        <option value="newest">{t('sortByNewest', language)}</option>
        <option value="popular">{t('sortByPopularity', language)}</option>
      </select>
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
              <strong>{t('createdBy', language)}:</strong>{' '}
              {q.createdBy?.split('#')[0] || t('unknownUser', language)}
            </p>

            {/* <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedQuestion(q); }}>
              {t('viewQestion', language)}
            </Button>

            {userType !== 'reservist' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswer && onAnswer(q);
                }}
              >
                {t('postAnswer', language)}
              </Button>
            )}

            <div
              onClick={(e) => {
                e.stopPropagation();
                handleLike(q.questionId, hasLiked(q.likes));
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <ThumbsUp
                size={22}
                color={hasLiked(q.likes) ? '#007bff' : '#ccc'}
              />
              <span>{q.likes?.length || 0}</span> */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuestion(q);
                  }}
                  title={t('viewQestion', language)}
                >
                  <FileSearch size={18} />
                </button>

                {userType !== 'reservist' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnswer && onAnswer(q);
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
            </div>
          </div>
        )}
      />

      {selectedQuestion && (
        <ViewQuestion
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
}
