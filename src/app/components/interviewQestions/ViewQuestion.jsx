'use client';

import { useEffect, useState } from 'react';
import { t } from '@/app/utils/loadTranslations';
import './ViewQuestion.css';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ViewQuestion({ question, onClose }) {
  const language = useLanguage();

  if (!question) return null;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(language === 'he' ? 'he-IL' : 'en-US');

  const displayData = {
    text: question.text,
    category: question.category,
    createdAt: formatDate(question.createdAt),
    createdBy: question.createdBy?.split('#')[0] || t('unknownUser', language),
    likes: question.likes?.length || 0
  };

  return (
    <div className="VQ-overlay" onClick={onClose}>
      <div className="VQ-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
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
                  {question.answers.map((ans) => (
                    <li key={ans.answerId} className="VQ-answer-item">
                        <span className="VQ-answer-meta-date">
                          {formatDate(ans.createdAt)}
                        </span>
                      <div className="VQ-answer-meta-row" dir={language === 'he' ? 'rtl' : 'ltr'}>
                        <span className="VQ-answer-meta-dot">• </span>
                        <span className="VQ-answer-meta-name" dir="auto">
                          {ans.answeredName || t('unknownUser', language)}
                        </span> - {ans.text}
                      </div>
                      <br />
                      
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h3 className="VQ-no-answers-yet">{t('noAnswersYet', language)}</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
