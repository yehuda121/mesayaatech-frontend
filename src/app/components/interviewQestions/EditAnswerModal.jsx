'use client';

import { useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";
import './ViewQuestion.css';
import Button from '@/app/components/Button/Button';

export default function EditAnswerModal({ answer, questionId, onClose, onSuccess }) {
  const [text, setText] = useState(answer.text);
  const [toast, setToast] = useState(null);
  const language = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const idNumber = typeof window !== 'undefined' ? localStorage.getItem('idNumber') : null;
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  const handleSubmit = async () => {
    if (!text.trim()) {
      setToast({ message: t('missingAnswerText', language), type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/update-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          answerId: answer.answerId,
          updatedText: text.trim(),
          userId: idNumber,
          userType,
        }),
      });

      if (res.ok) {
        setToast({ message: t('answerUpdated', language), type: 'success' });
        setTimeout(() => {
            onSuccess({
                ...answer,
                text: text.trim(),
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
    <div className="postAnswer-overlay" onClick={(e) => e.target.classList.contains('postAnswer-overlay') && onClose()}>
      <div className="postAnswer-box" onClick={(e) => e.stopPropagation()}>
        <button className="postAnswer-close" onClick={onClose}>×</button>
        <h2 className="postAnswer-title">{t('editAnswer', language)}</h2>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} maxLength={1000} />
        <div className="postAnswer-actions">
          <Button onClick={handleSubmit} disabled={submitting}>{t('saveChanges', language)}</Button>
        </div>
        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
