'use client'

import React from 'react';
import SideBar from '@/app/components/SideBar';
import { t } from '@/app/utils/loadTranslations';
import { useEffect, useState } from 'react';
import { getLanguage } from '@/app/language';
import './reports.css';
import { useRouter } from 'next/navigation';

import useUsersSummary from '@/app/components/reports/api/useUsersSummary';
import UsersSummaryChart from '@/app/components/reports/charts/UsersSummaryChart';
import useJobsPerMonth from '@/app/components/reports/api/useJobsPerMonth';
import JobsPerMonthChart from '@/app/components/reports/charts/JobsPerMonthChart';
import useEventsPerMonth from '@/app/components/reports/api/useEventsPerMonth';
import EventsPerMonthChart from '@/app/components/reports/charts/EventsPerMonthChart';
import useMentorshipProgress from '@/app/components/reports/api/useMentorshipProgress';
import MentorshipProgressChart from '@/app/components/reports/charts/MentorshipProgressChart';

export default function ReportsDashboard() {
    const [view, setView] = useState('');
    const [language, setLanguage] = useState(getLanguage() || 'he');
    const router = useRouter();

    const { usersData, usersError, usersLoading } = useUsersSummary();
    const { jobsData, jobsError, jobsLoading } = useJobsPerMonth();
    const { eventsData, eventsError, eventsLoading } = useEventsPerMonth();    
    const { mentorshipData, mentorshipError, mentorshipLoading } = useMentorshipProgress();

    useEffect(() => {
        const currentLang = getLanguage();
        if (currentLang) setLanguage(currentLang);
        const handleLangChange = () => {
            const updatedLang = getLanguage();
            setLanguage(updatedLang || 'he');
        };
        window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
    }, []);

    const handleNavigation = (newView) => {
        setView(newView);
        console.log("jobsData: ", jobsData);
        console.log("usersData: ", usersData);
    }

    const navItems = [
        { 
            labelHe: t('back', 'he'), 
            labelEn: t('back', 'en'), 
            path: '#backToAdmin', 
            onClick: () => backToAdmin() 
        },
        { 
            labelHe: t('navUserSummary', 'he'), 
            labelEn: t('navUserSummary', 'en'), 
            path: '#userSummary', 
            onClick: () => handleNavigation('userSummary') 
        },
        { 
            labelHe: t('navJobsPerMonth', 'he'), 
            labelEn: t('navJobsPerMonth', 'en'), 
            path: '#jobsPerMonth', 
            onClick: () => handleNavigation('jobsPerMonth') 
        },
        {
            labelHe: t('navEventsPerMonth', 'he'),
            labelEn: t('navEventsPerMonth', 'en'),
            path: '#eventsPerMonth',
            onClick: () => handleNavigation('eventsPerMonth')
        },
        {
            labelHe: t('navMentorshipProgress', 'he'),
            labelEn: t('navMentorshipProgress', 'en'),
            path: '#mentorshipProgress',
            onClick: () => handleNavigation('mentorshipProgress')
        }


    ];

    const backToAdmin = () => {
        router.push('../../admin');
    }

    return (
        <div className="reports-container">
            <SideBar navItems={navItems} />

            <main className="reports-main">

                {view === 'userSummary' && (
                    <>
                        {usersLoading && <p>{t('loadingReports', language)}</p>}
                        {usersError && <p>{t('failedToLoadData', language)}</p>}
                        {usersData && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 className='reports-title'>{t('usersSummaryTitle', language)}</h2>
                            <UsersSummaryChart data={usersData} />
                        </div>
                        )}
                    </>
                )}

                {view === 'jobsPerMonth' && (
                    <>
                        {jobsLoading && <p>{t('loadingReports', language)}</p>}
                        {jobsError && <p>{t('failedToLoadData', language)}</p>}
                        {jobsData && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 className='reports-title'>{t('jobsPerMonthTitle', language)}</h2>
                            <JobsPerMonthChart data={jobsData} />
                        </div>
                        )}
                    </>
                )}

                {view === 'eventsPerMonth' && (
                    <>
                        {eventsLoading && <p>{t('loadingReports', language)}</p>}
                        {eventsError && <p>{t('failedToLoadData', language)}</p>}
                        {eventsData && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 className='reports-title'>{t('eventsPerMonthTitle', language)}</h2>
                            <EventsPerMonthChart data={eventsData} />
                        </div>
                        )}
                    </>
                )}

                {view === 'mentorshipProgress' && (
                    <>
                        {mentorshipLoading && <p>{t('loadingReports', language)}</p>}
                        {mentorshipError && <p>{t('failedToLoadData', language)}</p>}
                        {mentorshipData && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 className='reports-title'>{t('mentorshipProgressReportTitle', language)}</h2>
                            <MentorshipProgressChart data={mentorshipData} />
                        </div>
                        )}
                    </>
                )}


            </main>
        </div>
    );
}

