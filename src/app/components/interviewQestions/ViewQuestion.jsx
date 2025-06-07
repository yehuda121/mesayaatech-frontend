// 'use client';

// import { useEffect, useState } from 'react';
// import { getLanguage } from '@/app/language';
// import { t } from '@/app/utils/loadTranslations';
// import Button from '@/app/components/Button';
// import './interviewQuestions.css';

// export default function ViewQuestion({ question, onClose }) {
//   const [language, setLanguage] = useState(getLanguage());

//   useEffect(() => {
//     const handleLangChange = () => setLanguage(getLanguage());
//     window.addEventListener('languageChanged', handleLangChange);
//     return () => window.removeEventListener('languageChanged', handleLangChange);
//   }, []);

//   if (!question) return null;

//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleString(language === 'he' ? 'he-IL' : 'en-US');

//   return (
//     <div className="modal-overlay" dir={language === 'he' ? 'rtl' : 'ltr'}>
//       <div className="modal-content text-start">
//         <h2 className="generic-form-title">{t('questionDetails', language)}</h2>

//         <p><strong>{t('question', language)}:</strong> {question.text}</p>
//         <p><strong>{t('category', language)}:</strong> {question.category}</p>
//         <p><strong>{t('createdAt', language)}:</strong> {formatDate(question.createdAt)}</p>
//         <p>
//           <strong>{t('createdBy', language)}:</strong>{' '}
//           {question.createdBy?.split('#')[0] || t('unknownUser', language)}
//         </p>

//         <p><strong>{t('likes', language)}:</strong> {question.likes?.length || 0}</p>

//         {question.answers?.length > 0 && (
//             <>
//                 <h3 className="answers-title">
//                 {t('answers', language)}
//                 </h3>
//                 <ul className="answer-list">
//                 {question.answers.map((ans) => (
//                     <li key={ans.answerId} className="answer-item">
//                     <div className="answer-meta-row">
//                         <span className="answer-meta-name">
//                         {ans.answeredName || t('unknownUser', language)}
//                         </span>
//                         <span className="answer-meta-dot">•</span>
//                         <span className="answer-meta-date">
//                         {new Date(ans.createdAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
//                         </span>
//                     </div>

//                     <br />
//                     {ans.text}
//                     </li>
//                 ))}
//                 </ul>
//             </>
//             )}
//         <div className="generic-form-buttons">
//           <Button onClick={onClose}>
//             {t('close', language)}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import { t } from '@/app/utils/loadTranslations';
import GenericForm from '@/app/components/GenericForm/GenericForm';
import './interviewQuestions.css';

export default function ViewQuestion({ question, onClose }) {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => setLanguage(getLanguage());
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      dir={language === 'he' ? 'rtl' : 'ltr'}
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-xl w-full mx-auto">
        <GenericForm
          titleKey="questionDetails"
          fields={[]}
          data={{}}
          onChange={() => {}}
          onCloseIcon={onClose}
        >
          <div className="question-details-text">
            <p><strong>{t('question', language)}:</strong> {displayData.text}</p>
            <p><strong>{t('category', language)}:</strong> {displayData.category}</p>
            <p><strong>{t('createdAt', language)}:</strong> {displayData.createdAt}</p>
            <p><strong>{t('createdBy', language)}:</strong> {displayData.createdBy}</p>
            <p><strong>{t('likes', language)}:</strong> {displayData.likes}</p>
          </div>

          {question.answers?.length > 0 && (
            <>
              <h3 className="answers-title">{t('answers', language)}</h3>
              <ul className="answer-list">
                {question.answers.map((ans) => (
                  <li key={ans.answerId} className="answer-item">
                    <div className="answer-meta-row">
                      <span className="answer-meta-name">
                        {ans.answeredName || t('unknownUser', language)}
                      </span>
                      <span className="answer-meta-dot">•</span>
                      <span className="answer-meta-date">
                        {formatDate(ans.createdAt)}
                      </span>
                    </div>
                    <br />
                    {ans.text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </GenericForm>
      </div>
    </div>
  );
}
