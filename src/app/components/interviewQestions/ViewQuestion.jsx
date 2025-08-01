 'use client'; 

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import './ViewQuestion.css';
import { useLanguage } from "@/app/utils/language/useLanguage";
import EditAnswerModal from "./EditAnswerModal";
import { Edit2, Trash2 } from 'lucide-react';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import ConfirmDialog from '@/app/components/Notifications/ConfirmDialog';

export default function ViewQuestion({ question, onClose, onUpdate  }) {
  const language = useLanguage();
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [answers, setAnswers] = useState(question.answers || []);
  const [alert, setAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    setAnswers(question.answers || []);
  }, [question]);
  
  const idNumber = typeof window !== 'undefined' ? localStorage.getItem('idNumber') : null;
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  
  if (!question) return null;
  const finalQuestionId = question.questionId || question.PK;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(language === 'he' ? 'he-IL' : 'en-US');

  const displayData = {
    text: question.text,
    category: question.category,
    createdAt: formatDate(question.createdAt),
    createdBy: question.createdBy?.split('#')[0] || t('unknownUser', language),
    likes: question.likes?.length || 0
  };

  const handleDeleteAnswer = async (answerId) => {
    const idNumber = localStorage.getItem('idNumber');
    const userType = localStorage.getItem('userType');
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({
          questionId: finalQuestionId,
          answerId,
          userId: idNumber,
          userType,
        }),
        
      });
   
      if (res.ok) {
        if (onUpdate) onUpdate();
        setAlert({ message: t('answerDeleted', language), type: 'success' });
        setEditingAnswer(null); 
      } else {
        const data = await res.json();
        setAlert({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: t('serverError', language), type: 'error' });
    }finally {
      setConfirmDelete(null);
    }
  };

  const handleEditSuccess = (updatedAnswer) => {
    setEditingAnswer(null);    
    if (onUpdate) onUpdate();  
  };

  return (
    <div className="VQ-overlay" onClick={onClose}>
      <div
        className="VQ-container"
        dir={language === 'he' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >

        {onClose && (
          <button className="VQ-close-button" onClick={onClose} aria-label="Close">✖</button>
        )}

        <h2 className="VQ-title">{t("questionDetails", language)}</h2>

        <div className="VQ-content">
          <div className="VQ-question-info">
            <p><strong>{t('question', language)}:</strong> {displayData.text}</p>
            <p><strong>{t('field', language)}:</strong> {t(displayData.category, language)}</p>
            <p><strong>{t('createdAt', language)}:</strong> {displayData.createdAt}</p>
            <p><strong>{t('createdBy', language)}:</strong> {displayData.createdBy}</p>
            <p><strong>{t('likes', language)}:</strong> {displayData.likes}</p>
          </div>
          
          <div className="VQ-inner-scrolling" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {question.answers?.length > 0 ? (
              <>
                <h3 className="VQ-answers">{t('answers', language)}</h3>
                <ul className="VQ-answer-list">
                  {answers.map((ans, index) => {
                    
                    const canEditOrDelete = userType === 'admin' ||
                      (idNumber && ans.answeredBy?.split('#')[1] === idNumber);

                    return (
                      <li key={ans.answerId} className="VQ-answer-item">
                        <span className="VQ-answer-meta-date">{formatDate(ans.createdAt)}</span>
                        <div className="VQ-answer-meta-row" dir={language === 'he' ? 'rtl' : 'ltr'}>
                          <span className="VQ-answer-meta-dot">• </span>
                          <span className="VQ-answer-meta-name" dir="auto">
                            {ans.answeredName || t('unknownUser', language)}:
                          </span> {ans.text}

                          {canEditOrDelete && (
                            <span className="VQ-answer-actions" style={{ marginInlineStart: '10px' }}>
                              <button
                                title={t('edit', language)}
                                className="VQ-edit-btn"
                                onClick={() => setEditingAnswer(ans)}
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                title={t('delete', language)}
                                className="VQ-delete-btn"
                                onClick={() => setConfirmDelete(ans.answerId)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </span>
                          )}
                        </div>
                        {index < answers.length - 1 && <div className="VQ-answer-separator"></div>}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <h3 className="VQ-no-answers-yet">{t('noAnswersYet', language)}</h3>
            )}
          </div>
        </div>
      </div>

      {editingAnswer && (
        <EditAnswerModal
          answer={editingAnswer}
          questionId={question.questionId} 
          onClose={() => setEditingAnswer(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title={t('confirmDelete', language)}
          message={t('confirmDeleteMessage', language)}
          onConfirm={() =>handleDeleteAnswer(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

    </div>
  );
}