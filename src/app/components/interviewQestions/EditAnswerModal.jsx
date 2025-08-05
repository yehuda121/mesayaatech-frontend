'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";
import Button from '@/app/components/Button/Button';
import sanitizeText from '@/app/utils/sanitizeText';
import './style/PostAnswer.css';

export default function EditAnswerModal({ answer, questionId, onClose, onSuccess }) {
  const [newAnswer, setNewAnswer] = useState(answer.text);
  const [toast, setToast] = useState(null);
  const language = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const idNumber = typeof window !== 'undefined' ? localStorage.getItem('idNumber') : null;  
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  const handleSubmit = async () => {
    if (!newAnswer.trim()) {
      setToast({ message: t('missingAnswerText', language), type: 'error' });
      return;
    }
    
    const { text, wasModified } = sanitizeText(newAnswer, 1000);
    setNewAnswer(text);
    if (wasModified) {
      setToast({ message: t('textSanitizedWarning', language), type: 'warning' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/update-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({
          questionId,
          answerId: answer.answerId,
          updatedText: newAnswer.trim(),
          userId: idNumber,
          userType,
        }),
      });

      if (res.ok) {
        setToast({ message: t('answerUpdated', language), type: 'success' });
        setTimeout(() => {
          onSuccess({
            ...answer,
            text: newAnswer.trim(),
          });
        }, 400);
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      setToast({ message: t('serverError', language), type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="postAnswer-overlay">
      <div className="postAnswer-box" onClick={(e) => e.stopPropagation()}>
        <button className="postAnswer-close" onClick={onClose}>×</button>
        <h2 className="postAnswer-title">{t('editAnswer', language)}</h2>
        <textarea className='textarea-edit-answer' value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} rows={6} maxLength={1000} />
        <div className="postAnswer-actions">
          <Button onClick={handleSubmit} disabled={submitting}>{t('saveChanges', language)}</Button>
        </div>
        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
