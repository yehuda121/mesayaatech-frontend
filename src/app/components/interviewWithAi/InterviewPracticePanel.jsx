// "use client";

// import { useState, useEffect } from "react";
// import { JobFields } from '@/app/components/jobs/jobFields';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import Button from '@/app/components/Button/Button';
// import AlertMessage from '@/app/components/Notifications/AlertMessage';
// import { t } from '@/app/utils/loadTranslations';
// import { sanitizeAnswer } from './sanitizeAnswer';
// import { useLanguage } from "@/app/utils/language/useLanguage";
// import './InterviewPracticePanel.css';
// // import { data } from "react-router-dom";

// export default function InterviewPracticePanel() {
//   const [view, setView] = useState("history");
//   const [question, setQuestion] = useState(null);
//   const [category, setCategory] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [difficulty, setDifficulty] = useState("");
//   const [userAnswer, setUserAnswer] = useState("");
//   const [evaluation, setEvaluation] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
//   const [remaining, setRemaining] = useState(10);
//   const [alert, setAlert] = useState(null);
//   const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
//   const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(false);
//   const [userId , setUserId ] = useState(null);
//   const [email, setEmail] = useState('');
//   const [userType, setUserType] = useState('');
//   const difficulties = ["easy", "medium", "hard"];
//   const language = useLanguage();

//   useEffect(() => {
//     fetchHistory();
//   }, [userId]);

//   useEffect(() => {
//     const storedIdNumber = sessionStorage.getItem('idNumber');
//     const storedEmail = sessionStorage.getItem('email');
//     const storedUserType = sessionStorage.getItem('userType');

//     if (storedIdNumber) setUserId(storedIdNumber);
//     if (storedEmail) setEmail(storedEmail);
//     if (storedUserType) setUserType(storedUserType);
//   }, []);

//   // const fetchHistory = async () => {
//   //   const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/interview/fetch-questions-history?userId=` + userId;
//   //   const res = await fetch(url, {
//   //     method: 'GET',
//   //     headers: {
//   //       'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
//   //     }
//   //   });

//   //   const data = await res.json();
//   //   if (res.ok) {
//   //     // console.log('data.history: ',data.history);
//   //     setHistory(data.history || []);
//   //     setRemaining(10 - (data.todayCount || 0));
//   //   }
//   //   else setAlert({ type: "error", message: t("couldntFetchHistory", language) });
//   // };
//   const fetchHistory = async () => {
//     if (isHistoryLoaded) return;
//     setIsHistoryLoaded(false);
//     const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/interview/fetch-questions-history?userId=` + userId;
//     try {
//       const res = await fetch(url, {
//         method: 'GET',
//         headers: { 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` }
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setHistory(data.history || []);
//         setRemaining(10 - (data.todayCount || 0));
//       } else {
//         setAlert({ type: "error", message: t("couldntFetchHistory", language) });
//         setHistory([]); 
//       }
//     } catch {
//       setAlert({ type: "error", message: t("couldntFetchHistory", language) });
//       setHistory([]);
//     } finally {
//       setIsHistoryLoaded(true);
//     }
//   };

//   const handleRequestQuestion = async () => {
//     if (!category || !difficulty) {
//       setAlert({ type: "warning", message: t("interviewMissingFields", language) });
//       return;
//     }

//     setIsLoadingQuestion(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/interview/getQuestion`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
//         body: JSON.stringify({ userId, email, category, difficulty, language }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setQuestion(data.question);
//         setUserAnswer("");
//         setEvaluation(null);
//         setRemaining(prev => prev - 1);
//       } else {
//         setAlert({ type: "error", message: data.error || t("interviewQuestionError", language) });
//       }
//     } catch {
//       setAlert({ type: "error", message: t("interviewQuestionError", language) });
//     }
//     setIsLoadingQuestion(false);
//   };

//   const cleanText = (text) => {
//     return text.replace(/\*/g, '');
//   };

//   const handleEvaluate = async () => {
//     if (!question || !userAnswer.trim()) {
//       setAlert({ type: "warning", message: t("interviewMissingAnswer", language) });
//       return;
//     }
//     setIsLoadingEvaluation(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/interview/evaluateAnswer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
//         body: JSON.stringify({ userId, question, userAnswer, language, category: selectedCategory, difficulty }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setEvaluation(data);
//         await fetchHistory();
//       } else {
//         setAlert({ type: "error", message: data.error || t("interviewEvaluationError", language) });
//       }
//     } catch {
//       setAlert({ type: "error", message: t("interviewEvaluationError", language) });
//     }
//     setIsLoadingEvaluation(false);
//   };
//   const fieldOptions = [
//     { value: '', label: t('selectField', language) },
//     ...Object.keys(JobFields).map(value => ({
//       value,
//       label: t(`${value}`, language)
//     }))
//   ];

//   const avgScore =
//     history.length > 0 ? Math.round((history.reduce((sum, q) => sum + (q.score || 0), 0) / history.length) * 100) / 100 : null;

//   return (
//     <div className="IPP-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      

//       <div className="IPP-selectGroup">
//         <select
//           value={category}
//           onChange={e => {setCategory(e.target.value); setSelectedCategory(e.target.value);}}
//           className="IPP-select"
//         >
//           {fieldOptions.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>

//         <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="IPP-select">
//           <option value="">{t("interviewSelectDifficulty", language)}</option>
//           {difficulties.map(level => (
//             <option key={level} value={level}>{t(`interviewDifficulty_${level}`, language)}</option>
//           ))}
//         </select>

//         <Button onClick={() => {
//           setView("question");
//           setQuestion(null);
//           setEvaluation(null);
//           handleRequestQuestion();
//         }} disabled={isLoadingQuestion}>
//           {isLoadingQuestion ? t("loading", language) : t("interviewAskQuestion", language)}
//         </Button>

//         <Button variant="outline" onClick={() => {
//           setView("history");
//           setQuestion(null);
//           setEvaluation(null);
//         }}>
//           {t("myQuestions", language)}
//         </Button>

//         <p className="IPP-remaining">({t("interviewRemainingQuestions", language)}: {remaining} / 10)</p>
//       </div>

//       {view === "question" && question && (
//         <div className="IPP-questionBox" dir={language === 'he' ? 'rtl' : 'ltr'}>
//           <p className="IPP-questionLabel">{t("question", language)}:</p>
//           <p className="IPP-questionText">{cleanText(question)}</p>

//           <textarea
//             rows={4}
//             value={userAnswer}
//             onChange={e => {
//               const sanitized = sanitizeAnswer(e.target.value);
//               if (sanitized !== e.target.value) {
//                 setAlert({
//                   message: t('unsafeInputSanitized', language),
//                   type: 'warning'
//                 });
//               }
//               setUserAnswer(sanitized);
//             }}
//             className="IPP-textarea"
//             placeholder={t("interviewYourAnswerPlaceholder", language)}
//           />

//           <div className="IPP-buttonGroup">
//             <Button onClick={handleEvaluate} disabled={isLoadingEvaluation || evaluation}>
//               {isLoadingEvaluation ? t("loading", language) : t("interviewEvaluate", language)}
//             </Button>
//           </div>
//         </div>
//       )}

//       {view === "question" && evaluation && (
//         <div className={`IPP-evaluationBox ${language === "he" ? "text-right" : "text-left"}`}>
//           <p className="IPP-evaluationText"><strong>{t("interviewScore", language)}:</strong> {evaluation.score} / 10</p>
//           <p className="IPP-evaluationText"><strong>{t("interviewPositiveFeedback", language)}:</strong> {cleanText(evaluation.feedback?.positive)}</p>
//           <p className="IPP-evaluationText"><strong>{t("interviewNegativeFeedback", language)}:</strong> {cleanText(evaluation.feedback?.negative)}</p>
//           <p className="IPP-evaluationText"><strong>{t("interviewIdealAnswer", language)}:</strong> {cleanText(evaluation.idealAnswer)}</p>
//         </div>
//       )}

//       {view === "history" && !isHistoryLoaded && (
//         <p>{t("loading", language)}</p>
//       )}

//       {view === "history" && isHistoryLoaded && (
//         <div>
//           <h2 className="IPP-historyTitle">{t("interviewProgressGraph", language)}</h2>
//           {history.length > 0 ? (
//             <div dir="ltr">
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={history.map((item, i) => ({ name: i + 1, score: item.score }))}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis domain={[0, 10]} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="score" stroke="#8884d8" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <p>{t("interviewNoHistory", language)}</p>
//           )}

//           {avgScore !== null && (
//             <p className="IPP-average">{t("interviewAverageScore", language)}: {avgScore}</p>
//           )}

//           <p className="IPP-historyRemaining">{t("interviewRemainingQuestions", language)}: {remaining} / 10</p>

//           <h3 className="IPP-previousTitle">{t("interviewPreviousQuestions", language)}</h3>

//           <ul className="IPP-questionList">
//             {history.map((item, index) => {
//               const question = item.question?.S || item.question;
//               const userAnswer = item.userAnswer?.S || item.userAnswer;
//               const idealAnswer = item.idealAnswer?.S || item.idealAnswer;
//               return (
//                 <li key={index} className="IPP-questionItem">
//                   <div><strong>{t("question", language)}:</strong> {question}</div>
//                   <div><strong>{t("yourQuestion", language)}:</strong> {userAnswer}</div>
//                   <div><strong>{t("idealAnswer", language)}:</strong> {idealAnswer}</div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}
//       {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { JobFields } from '@/app/components/jobs/jobFields';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Button from '@/app/components/Button/Button';
import AlertMessage from '@/app/components/Notifications/AlertMessage';
import { t } from '@/app/utils/loadTranslations';
import { sanitizeAnswer } from './sanitizeAnswer';
import { useLanguage } from "@/app/utils/language/useLanguage";
import './InterviewPracticePanel.css';

export default function InterviewPracticePanel() {
  const [view, setView] = useState("history");
  const [question, setQuestion] = useState(null);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [remaining, setRemaining] = useState(10);
  const [alert, setAlert] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(false);
  const [userId , setUserId ] = useState(null);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const difficulties = ["easy", "medium", "hard"];
  const language = useLanguage();

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  useEffect(() => {
    const storedIdNumber = sessionStorage.getItem('idNumber');
    const storedEmail = sessionStorage.getItem('email');
    const storedUserType = sessionStorage.getItem('userType');

    if (storedIdNumber) setUserId(storedIdNumber);
    if (storedEmail) setEmail(storedEmail);
    if (storedUserType) setUserType(storedUserType);
  }, []);

  const fetchHistory = async () => {
    if(!userId) return;
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/interview/fetch-questions-history?userId=` + userId;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      // console.log('ata.history: ',data.history);
      setHistory(data.history || []);
      setRemaining(10 - (data.todayCount || 0));
    }
  };

  const handleRequestQuestion = async () => {
    if (!category || !difficulty) {
      setAlert({ type: "warning", message: t("interviewMissingFields", language) });
      return;
    }

    setIsLoadingQuestion(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/interview/getQuestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ userId, email, category, difficulty, language }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.question);
        setUserAnswer("");
        setEvaluation(null);
        setRemaining(prev => prev - 1);
      } else {
        setAlert({ type: "error", message: data.error || t("interviewQuestionError", language) });
      }
    } catch {
      setAlert({ type: "error", message: t("interviewQuestionError", language) });
    }
    setIsLoadingQuestion(false);
  };

  const cleanText = (text) => {
    return text.replace(/\*/g, '');
  };

  const handleEvaluate = async () => {
    if (!question || !userAnswer.trim()) {
      setAlert({ type: "warning", message: t("interviewMissingAnswer", language) });
      return;
    }
    setIsLoadingEvaluation(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/interview/evaluateAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` },
        body: JSON.stringify({ userId, question, userAnswer, language, category: selectedCategory, difficulty }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvaluation(data);
        await fetchHistory();
      } else {
        setAlert({ type: "error", message: data.error || t("interviewEvaluationError", language) });
      }
    } catch {
      setAlert({ type: "error", message: t("interviewEvaluationError", language) });
    }
    setIsLoadingEvaluation(false);
  };
  const fieldOptions = [
    { value: '', label: t('selectField', language) },
    ...Object.keys(JobFields).map(value => ({
      value,
      label: t(`${value}`, language)
    }))
  ];

  const avgScore =
    history.length > 0 ? Math.round((history.reduce((sum, q) => sum + (q.score || 0), 0) / history.length) * 100) / 100 : null;

  return (
    <div className="IPP-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="IPP-selectGroup">
        <select
          value={category}
          onChange={e => {setCategory(e.target.value); setSelectedCategory(e.target.value);}}
          className="IPP-select"
        >
          {fieldOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="IPP-select">
          <option value="">{t("interviewSelectDifficulty", language)}</option>
          {difficulties.map(level => (
            <option key={level} value={level}>{t(`interviewDifficulty_${level}`, language)}</option>
          ))}
        </select>

        <Button onClick={() => {
          setView("question");
          setQuestion(null);
          setEvaluation(null);
          handleRequestQuestion();
        }} disabled={isLoadingQuestion}>
          {isLoadingQuestion ? t("loading", language) : t("interviewAskQuestion", language)}
        </Button>

        <Button variant="outline" onClick={() => {
          setView("history");
          setQuestion(null);
          setEvaluation(null);
        }}>
          {t("myQuestions", language)}
        </Button>

        <p className="IPP-remaining">({t("interviewRemainingQuestions", language)}: {remaining} / 10)</p>
      </div>

      {view === "question" && question && (
        <div className="IPP-questionBox" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <p className="IPP-questionLabel">{t("question", language)}:</p>
          <p className="IPP-questionText">{cleanText(question)}</p>

          <textarea
            rows={4}
            value={userAnswer}
            onChange={e => {
              const sanitized = sanitizeAnswer(e.target.value);
              if (sanitized !== e.target.value) {
                setAlert({
                  message: t('unsafeInputSanitized', language),
                  type: 'warning'
                });
              }
              setUserAnswer(sanitized);
            }}
            className="IPP-textarea"
            placeholder={t("interviewYourAnswerPlaceholder", language)}
          />

          <div className="IPP-buttonGroup">
            <Button onClick={handleEvaluate} disabled={isLoadingEvaluation || evaluation}>
              {isLoadingEvaluation ? t("loading", language) : t("interviewEvaluate", language)}
            </Button>
          </div>
        </div>
      )}

      {view === "question" && evaluation && (
        <div className={`IPP-evaluationBox ${language === "he" ? "text-right" : "text-left"}`}>
          <p className="IPP-evaluationText"><strong>{t("interviewScore", language)}:</strong> {evaluation.score} / 10</p>
          <p className="IPP-evaluationText"><strong>{t("interviewPositiveFeedback", language)}:</strong> {cleanText(evaluation.feedback?.positive)}</p>
          <p className="IPP-evaluationText"><strong>{t("interviewNegativeFeedback", language)}:</strong> {cleanText(evaluation.feedback?.negative)}</p>
          <p className="IPP-evaluationText"><strong>{t("interviewIdealAnswer", language)}:</strong> {cleanText(evaluation.idealAnswer)}</p>
        </div>
      )}

      {view === "history" && (
        <div>
          <h2 className="IPP-historyTitle">{t("interviewProgressGraph", language)}</h2>
          {history.length > 0 ? (
            <div dir="ltr">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history.map((item, i) => ({ name: i + 1, score: item.score }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>{t("interviewNoHistory", language)}</p>
          )}

          {avgScore !== null && (
            <p className="IPP-average">{t("interviewAverageScore", language)}: {avgScore}</p>
          )}

          <p className="IPP-historyRemaining">{t("interviewRemainingQuestions", language)}: {remaining} / 10</p>

          <h3 className="IPP-previousTitle">{t("interviewPreviousQuestions", language)}</h3>

          <ul className="IPP-questionList">
            {history.map((item, index) => {
              const question = item.question?.S || item.question;
              const userAnswer = item.userAnswer?.S || item.userAnswer;
              const idealAnswer = item.idealAnswer?.S || item.idealAnswer;
              return (
                <li key={index} className="IPP-questionItem">
                  <div><strong>{t("question", language)}:</strong> {question}</div>
                  <div><strong>{t("yourQuestion", language)}:</strong> {userAnswer}</div>
                  <div><strong>{t("idealAnswer", language)}:</strong> {idealAnswer}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}
    </div>
  );
}