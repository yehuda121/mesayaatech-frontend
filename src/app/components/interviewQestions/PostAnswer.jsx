'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import ToastMessage from '@/app/components/Notifications/ToastMessage';
import { useLanguage } from "@/app/utils/language/useLanguage";
import './ViewQuestion.css';
import sanitizeText from '@/app/utils/sanitizeText';
import Button from '@/app/components/Button/Button';

export default function PostAnswer({ questionId, onSuccess, onClose }) {

  const idNumber = typeof window !== 'undefined' ? localStorage.getItem('idNumber') : null;
  const fullName = typeof window !== 'undefined' ? localStorage.getItem('fullName') : null;
  const [formData, setFormData] = useState({ text: '' });
  const [toast, setToast] = useState(null);
  const language = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;


  const handleSubmit = async (e) => {
    if (submitting) return;
    setSubmitting(true);

    if (e?.preventDefault) e.preventDefault();

    if (!formData.text) {
      setToast({ message: t('missingAnswerText', language), type: 'error' });
      return;
    }
    const sanitized = sanitizeText(formData.text.trim(), 1000);

    if (sanitized === 'tooLong') {
      setToast({ message: t('textTooLong', language), type: 'error' });
      return;
    }

    formData.text = sanitized;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/post-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          idNumber,
          fullName,
          text: formData.text.trim(),
          answeredBy: `${userType}#${idNumber}`,
          answeredName: fullName

        })
      });

      if (res.ok) {
        setToast({ message: t('answerPosted', language), type: 'success' });
        setFormData({ text: '' });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 300);
      } else {
        const data = await res.json();
        setToast({ message: data?.error || t('serverError', language), type: 'error' });
      }
    } catch (err) {
      console.error('Error posting answer:', err);
      setToast({ message: t('serverError', language), type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('postAnswer-overlay')) {
      if (onClose) onClose();
    }
  };

  return (
    <div
      className="postAnswer-overlay"
      onClick={handleOverlayClick}
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div className="postAnswer-box" onClick={(e) => e.stopPropagation()}>
        <button className="postAnswer-close" onClick={onClose}>×</button>
        <h2 className="postAnswer-title">{t('postAnswer', language)}</h2>
        <div className="postAnswer-grid">
          <label>
            {t('answer', language)}
            <textarea
              value={formData.text}
              onChange={e => setFormData({ text: e.target.value })}
              rows={6}
              maxLength={1000}
            />
          </label>
        </div>
        <div className="postAnswer-actions">
          <Button onClick={handleSubmit} disabled={submitting}>{t('submit', language)}</Button>
        </div>
        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
