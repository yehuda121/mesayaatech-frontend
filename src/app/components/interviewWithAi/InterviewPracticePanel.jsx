"use client";

import { useState, useEffect } from "react";
import { translatedJobFields } from '@/app/components/jobs/jobFields';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Button from '@/app/components/Button';
import AlertMessage from '@/app/components/notifications/AlertMessage';
import { t } from '@/app/utils/loadTranslations';

export default function InterviewPracticePanel({ userId, email, language, role }) {
  const [view, setView] = useState("main");
  const [question, setQuestion] = useState(null);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [remaining, setRemaining] = useState(10);
  const [alert, setAlert] = useState(null);

  const difficulties = ["easy", "medium", "hard"];

  useEffect(() => {
    // Load user's previous questions and scores
    async function fetchHistory() {
      const res = await fetch("http://localhost:5000/api/interview/fetch-questions-history?userId=" + userId);
      const data = await res.json();
      if (res.ok) {
        setHistory(data.history || []);
        setRemaining(10 - (data.todayCount || 0));
      }
    }
    fetchHistory();
  }, [userId]);

  const handleRequestQuestion = async () => {
    if (!category || !difficulty) {
      setAlert({ type: "warning", message: t("interviewMissingFields", language) });
      return;
    }
    const res = await fetch("http://localhost:5000/api/interview/getQuestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email, category, difficulty, language }),
    });
    const data = await res.json();
    if (res.ok) {
      cleanText(data.question);
      setQuestion(data.question);
      setUserAnswer("");
      setEvaluation(null);
      setRemaining(prev => prev - 1);
    } else {
      setAlert({ type: "error", message: data.error || t("interviewQuestionError", language) });
    }
  };

  const cleanText = (text) => {
    return text.replace(/\*/g, '');
  };

  const handleEvaluate = async () => {
    if (!question || !userAnswer.trim()) {
      setAlert({ type: "warning", message: t("interviewMissingAnswer", language) });
      return;
    }
    const res = await fetch("http://localhost:5000/api/interview/evaluateAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, question, userAnswer, language }),
    });
    const data = await res.json();
    if (res.ok) {
      setEvaluation(data);
    } else {
      setAlert({ type: "error", message: data.error || t("interviewEvaluationError", language) });
    }
  };

  const handleSubmitToBank = async () => {
    await fetch("http://localhost:5000/api/submit-question-to-bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, category, difficulty, language }),
    });
    setAlert({ type: "success", message: t("interviewSubmittedToBank", language) });
  };

  const avgScore =
    history.length > 0 ? Math.round((history.reduce((sum, q) => sum + (q.score || 0), 0) / history.length) * 100) / 100 : null;

  return (
    <div className="p-4">
      {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}

      <div className="mb-4 flex gap-2 flex-wrap">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">{t("interviewSelectCategory", language)}</option>
          {Object.entries(translatedJobFields).map(([hebrewKey, translations]) => (
            <option key={hebrewKey} value={translations.en}>
              {translations[language]}
            </option>
          ))}
        </select>


        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border p-2 rounded">
          <option value="">{t("interviewSelectDifficulty", language)}</option>
          {difficulties.map(level => (
            <option key={level} value={level}>{t(`interviewDifficulty_${level}`, language)}</option>
          ))}
        </select>

        <Button onClick={handleRequestQuestion}>{t("interviewAskQuestion", language)}</Button>
        <Button variant="outline" onClick={() => setView("history")}>{t("interviewMyQuestions", language)}</Button>
      </div>

      {question && (
        <div className="mb-4 alin-start" dir={language === 'he' ? 'rtl' : 'tlr'}>
          <p className="font-bold mb-2">{t("interviewQuestionLabel", language)}:</p>
          <p className="bg-gray-100 p-3 rounded mb-2">{cleanText(question)}</p>

          <textarea
            rows={4}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder={t("interviewYourAnswerPlaceholder", language)}
          />

          <div className="flex gap-2 mt-2">
            <Button onClick={handleEvaluate}>{t("interviewEvaluate", language)}</Button>
            {role !== "reservist" && (
              <Button variant="secondary" onClick={handleSubmitToBank}>{t("interviewSubmitToBank", language)}</Button>
            )}
          </div>
        </div>
      )}

      {evaluation && (
        <div className="border rounded p-3 mb-4">
          <p><strong>{t("interviewScore", language)}:</strong> {evaluation.score} / 10</p>
          <p><strong>{t("interviewPositiveFeedback", language)}:</strong> {cleanText(evaluation.feedback?.positive)}</p>
          <p><strong>{t("interviewNegativeFeedback", language)}:</strong> {cleanText(evaluation.feedback?.negative)}</p>
          <p><strong>{t("interviewIdealAnswer", language)}:</strong> {cleanText(evaluation.idealAnswer)}</p>
        </div>
      )}

      {view === "history" && (
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("interviewProgressGraph", language)}</h2>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history.map((item, i) => ({ name: i + 1, score: item.score }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>{t("interviewNoHistory", language)}</p>
          )}

          {avgScore !== null && (
            <p className="mt-2">{t("interviewAverageScore", language)}: {avgScore}</p>
          )}

          <p className="mt-2">{t("interviewRemainingQuestions", language)}: {remaining} / 10</p>
        </div>
      )}
    </div>
  );
}
