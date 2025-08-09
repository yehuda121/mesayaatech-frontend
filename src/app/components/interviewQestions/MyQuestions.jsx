'use client';
import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import GenericCardSection from '@/app/components/GenericCardSection/GenericCardSection';
import { Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/app/utils/language/useLanguage';
import EditQuestion from './EditQuestion';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';
import AlertMessage from '@/app/components/Notifications/AlertMessage';

export default function MyQuestions({ idNumber, fullName }) {
  const [myQuestions, setMyQuestions] = useState([]);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const language = useLanguage();
  const [confirmData, setConfirmData] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      await fetchMyQuestions();
    };
    loadQuestions();
  }, []);

  const fetchMyQuestions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/get-questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
        }
      });

      const data = await res.json();
      const mine = data.filter(q => q.createdBy?.trim() === fullName?.trim());
      setMyQuestions(mine);
    } catch (err) {
      console.error('Error fetching my questions:', err);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ questionId, idNumber, fullName })
      });

      if (res.ok) {
        setMyQuestions(prev => prev.filter(q => q.questionId !== questionId));
        setAlertMessage({ message: t('questionDeletedSuccessfuly', language), type: 'success' });
      } else {
        setAlertMessage({ message: t('deleteFailed', language), type: 'error' });
      }
    } catch (err) {
      setAlertMessage({ message: t('serverError', language), type: 'error' });
      console.error('Error deleting question:', err);
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

            <div className="flex gap-4 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuestionToEdit(q);
                }}
                title={t('edit', language)}
              >
                <Edit2 size={18} />
              </button>

              <button
                title={t('delete', language)}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmData({ questionId: q.questionId });
                }}
              ><Trash2 size={18} /></button>
            </div>
          </div>
        )}
        emptyTextKey="noQuestionsFound"
      />
      {questionToEdit && (
        <EditQuestion
          question={questionToEdit}
          onClose={() => setQuestionToEdit(null)}
          onSave={() => {
            setQuestionToEdit(null);
            fetchMyQuestions(); 
          }}
        />
      )}
      {confirmData && (
        <ConfirmDialog
          title={t('confirmDelete', language)}
          message={t('confirmDeleteQuestion', language)}
          onConfirm={() => {
            handleDelete(confirmData.questionId);
            setConfirmData(null);
          }}
          onCancel={() => setConfirmData(null)}
        />
      )}
      {alertMessage && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
        />
      )}

    </div>
  );
}
