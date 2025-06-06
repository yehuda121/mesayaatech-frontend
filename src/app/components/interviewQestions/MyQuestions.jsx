'use client';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import Button from '@/app/components/Button';
import { Edit2 } from 'lucide-react';

export default function MyQuestions({ idNumber, fullName, onEdit }) {
  const [language, setLanguage] = useState(getLanguage());
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    fetchMyQuestions();
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const fetchMyQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/get-questions');
      const data = await res.json();
      const mine = data.filter(q => q.createdBy?.trim() === fullName?.trim());
      setMyQuestions(mine);
    } catch (err) {
      console.error('Error fetching my questions:', err);
    }
  };

  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <GenericCardSection
        titleKey="myQuestions"
        data={myQuestions}
        filters={[]}
        renderCard={(q) => (
          <div className="question-card">
            <p><strong>{t('question', language)}:</strong> {q.text}</p>
            <p><strong>{t('category', language)}:</strong> {t(q.category, language)}</p>
            <p><strong>{t('createdAt', language)}:</strong> {new Date(q.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</p>

            <Button
              icon={<Edit2 size={18} />}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(q);
              }}
              text={t('edit', language)}
            />
          </div>
        )}
        emptyTextKey="noQuestionsFound"
      />
    </div>
  );
}
