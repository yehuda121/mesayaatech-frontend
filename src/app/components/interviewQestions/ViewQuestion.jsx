 'use client'; 

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import './ViewQuestion.css';
import { useLanguage } from "@/app/utils/language/useLanguage";
import EditAnswerModal from "./EditAnswerModal";

export default function ViewQuestion({ question, onClose, onUpdate  }) {
  const language = useLanguage();
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [answers, setAnswers] = useState(question.answers || []);
  useEffect(() => {
    setAnswers(question.answers || []);
  }, [question]);
  


  const idNumber = typeof window !== 'undefined' ? localStorage.getItem('idNumber') : null;
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  

  
  
  console.log("📦 question object:", question);

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
  
    console.log("Sending delete request with:", {
      questionId: finalQuestionId,
      answerId: `answer#${answerId}`,
      userId: idNumber,
      userType
    });
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/delete-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: finalQuestionId,
          answerId,
          userId: idNumber,
          userType,
        }),
        
      });
    if (res.ok) {
      if (onUpdate) onUpdate();   
      setEditingAnswer(null); 
    } else {
      const data = await res.json();
      alert(data?.error || t('serverError', language));
    }
    } catch (err) {
      console.error(err);
      alert(t('serverError', language));
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
            <p><strong>{t('category', language)}:</strong> {displayData.category}</p>
            <p><strong>{t('createdAt', language)}:</strong> {displayData.createdAt}</p>
            <p><strong>{t('createdBy', language)}:</strong> {displayData.createdBy}</p>
            <p><strong>{t('likes', language)}:</strong> {displayData.likes}</p>
          </div>

          
          <div className="VQ-inner-scrolling" dir={language === 'he' ? 'rtl' : 'ltr'}>
            {question.answers?.length > 0 ? (
              <>
                <h3 className="VQ-answers">{t('answers', language)}</h3>
                <ul className="VQ-answer-list">
                  {answers.map((ans) => {
                    
                    const canEditOrDelete =
                    userType === 'admin' ||
                    (idNumber && ans.answeredBy?.split('#')[1] === idNumber);

                      // console.log('🔎 תשובה:', ans.text);
                      // console.log('answeredBy:', ans.answeredBy);
                      // console.log('idNumber:', idNumber);
                      // console.log('userType:', userType);
                      // console.log('canEditOrDelete:', canEditOrDelete);

                    return (
                      <li key={ans.answerId} className="VQ-answer-item">
                        <span className="VQ-answer-meta-date">{formatDate(ans.createdAt)}</span>
                        <div className="VQ-answer-meta-row" dir={language === 'he' ? 'rtl' : 'ltr'}>
                          <span className="VQ-answer-meta-dot">• </span>
                          <span className="VQ-answer-meta-name" dir="auto">
                            {ans.answeredName || t('unknownUser', language)}
                          </span> - {ans.text}

                          {canEditOrDelete && (
                            <span className="VQ-answer-actions" style={{ marginInlineStart: '10px' }}>
                              <button onClick={() => setEditingAnswer(ans)}>✏️</button>
                              <button onClick={() => handleDeleteAnswer(ans.answerId)}>🗑</button>
                            </span>
                          )}
                        </div>
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
    </div>
  );
}