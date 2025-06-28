'use client';

import { useState, useEffect } from 'react';
import { t } from '@/app/utils/loadTranslations';
import './ViewProgress.css';
import { useLanguage } from "@/app/utils/language/useLanguage";

export default function ViewProgress({ progressData, onClose }) {
  const language = useLanguage();

  const progressStages = [
    t('stage1', language),
    t('stage2', language),
    t('stage3', language),
    t('stage4', language),
    t('stage5', language)
  ];

  return (
    <div className="VP-overlay">
      <div className="VP-container" dir={language === 'he' ? 'rtl' : 'ltr'}>
        {onClose && (
          <button className="VP-close-button" onClick={onClose} aria-label="Close">✖</button>
        )}

        <h2 className="VP-title">{t("mentorshipProgressTitle", language)}</h2>

        <div className="VP-content">
          <div className="VP-info">
            <p><strong>{t('mentor', language)}:</strong> {progressData.mentorName}</p>
            <p><strong>{t('reservist', language)}:</strong> {progressData.reservistName}</p>
            <p><strong>{t('progressStage', language)}:</strong> {progressData.progressStage ? progressStages[progressData.progressStage - 1] : t('unknownStage', language)}</p>
          </div>

          <div className="VP-inner-scrolling">
            <h4 className="VP-meetings-title">{t('meetingHistory', language)}</h4>

            {progressData.meetings && progressData.meetings.length > 0 ? (
              progressData.meetings.map((meeting, idx) => (
                <div key={idx} className="VP-meeting-item">
                  <p><strong>{t('meetingDate', language)}:</strong> {meeting.date}</p>
                  <p><strong>{t('meetingMode', language)}:</strong> {meeting.mode}</p>
                  <p><strong>{t('meetingTopics', language)}:</strong> {meeting.topics}</p>
                  <p><strong>{t('meetingTasks', language)}:</strong> {meeting.tasks}</p>
                  <p><strong>{t('futurTasks', language)}:</strong> {meeting.futurTasks}</p>
                  <p><strong>{t('notes', language)}:</strong> {meeting.note}</p>
                </div>
              ))
            ) : (
              <p>{t('noMeetingsYet', language)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
