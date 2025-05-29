'use client';
import { useState, useEffect } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import './AnswerModal.css';

export default function AddAnswerModal({ questionId, onClose, onSuccess }) {
  const [language, setLanguage] = useState(getLanguage());
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const answeredBy = localStorage.getItem('userId');
    const answeredName = localStorage.getItem('fullName');

    if (!text.trim()) {
      setError(t('missingAnswer', language));
      return;
    }

    try {
      const payload = {
        questionId,
        text,
        answeredBy,
        answeredName,
        createdAt: new Date().toISOString()
      };

      console.log("📤 Sending answer payload:", payload);

      const res = await fetch('http://localhost:5000/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setText('');
        setError('');
        onSuccess(); // ריענון
        onClose();
      } else {
        const data = await res.json();
        setError(data?.error || t('serverError', language));
      }
    } catch (err) {
      console.error('❌ Error submitting answer:', err);
      setError(t('serverError', language));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h2>{t('addAnswer', language)}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('yourAnswer', language)}
            rows={4}
            className="answer-textarea"
          />
          {error && <p className="error">{error}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">
              {t('cancel', language)}
            </button>
            <button type="submit" className="submit-btn">
              {t('submit', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
