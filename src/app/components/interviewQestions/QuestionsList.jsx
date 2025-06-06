'use client';
import { useEffect, useState } from 'react';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import ViewQuestion from './ViewQuestion'; 
import Button from '@/app/components/Button';
import { ThumbsUp } from 'lucide-react';


export default function QuestionsPage() {
  const [language, setLanguage] = useState(getLanguage());
  const [questions, setQuestions] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [sortMode, setSortMode] = useState('newest');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userId, setUserId] = useState(null);
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
    setUserId(localStorage.getItem("userId"));
    setIdNumber(localStorage.getItem("idNumber"));
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
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

  const handleLike = async (questionId) => {
    try {
      const fullName = localStorage.getItem('fullName');
      await fetch('http://localhost:5000/api/interview/like-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });
      fetchQuestions();
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const hasLiked = (likes = []) => {
    return likes.some(like => like.idNumber === idNumber);
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

            <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedQuestion(q); }}>
              {t('viewQestion', language)}
            </Button>

            <div
              onClick={() => handleLike(q.questionId)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '4px' }}
            >
              <ThumbsUp
                size={22}
                color={hasLiked(q.likes) ? '#007bff' : '#ccc'}
              />
              <span>{q.likes?.length || 0}</span>
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
