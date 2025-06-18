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
import useTopJobPublishers from '@/app/components/reports/api/useTopJobPublishers';
import TopJobPublishersChart from '@/app/components/reports/charts/TopJobPublishersChart';
import useMeetingsSummary from '@/app/components/reports/api/useMeetingsSummary';
import useLocationsSummary from '@/app/components/reports/api/useLocationsSummary';
import LocationsSummaryChart from '@/app/components/reports/charts/LocationsSummaryChart';
import useEventsParticipantsCount from '@/app/components/reports/api/useEventsParticipantsCount';
import EventsParticipantsCountChart from '@/app/components/reports/charts/EventsParticipantsCountChart';


export default function ReportsDashboard() {
    const [view, setView] = useState('');
    const [language, setLanguage] = useState(getLanguage() || 'he');
    const router = useRouter();

    const { usersData, usersError, usersLoading } = useUsersSummary();
    const { jobsData, jobsError, jobsLoading } = useJobsPerMonth();
    const { eventsData, eventsError, eventsLoading } = useEventsPerMonth();    
    const { mentorshipData, mentorshipError, mentorshipLoading } = useMentorshipProgress();
    const { publishersData, publishersError, publishersLoading } = useTopJobPublishers();
    const { meetingsSummaryData, meetingsSummaryError, meetingsSummaryLoading } = useMeetingsSummary();
    const { locationsData, locationsError, locationsLoading } = useLocationsSummary();
    const { participantsData  } = useEventsParticipantsCount();

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
        },
        {
            labelHe: t('navTopJobPublishers', 'he'),
            labelEn: t('navTopJobPublishers', 'en'),
            path: '#topJobPublishers',
            onClick: () => handleNavigation('topJobPublishers')
        },
        {
            labelHe: t('navLocationsSummary', 'he'),
            labelEn: t('navLocationsSummary', 'en'),
            path: '#locationsSummary',
            onClick: () => handleNavigation('locationsSummary')
        },
        {
            labelHe: t('eventsParticipants', 'he'),
            labelEn: t('eventsParticipants', 'en'),
            path: '#eventsParticipants',
            onClick: () => handleNavigation('eventsParticipants')
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
                            <MentorshipProgressChart data={mentorshipData} meetingsSummary={meetingsSummaryData} />
                        </div>
                        )}
                    </>
                )}

                {view === 'topJobPublishers' && (
                    <>
                        {publishersLoading && <p>{t('loadingReports', language)}</p>}
                        {publishersError && <p>{t('failedToLoadData', language)}</p>}
                        {publishersData && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 className='reports-title'>{t('topJobPublishersTitle', language)}</h2>
                            <TopJobPublishersChart data={publishersData} />
                        </div>
                        )}
                    </>
                )}
                {view === 'locationsSummary' && (
                    <>
                        {locationsLoading && <p>{t('loadingReports', language)}</p>}
                        {locationsError && <p>{t('failedToLoadData', language)}</p>}
                        {locationsData && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 className='reports-title'>{t('locationsSummaryTitle', language)}</h2>
                            <LocationsSummaryChart data={locationsData} />
                        </div>
                        )}
                    </>
                )}
                {view === 'eventsParticipants' && (
                    <>
                        <div style={{ marginTop: '50px' }}>
                            <h2 className='reports-title'>{t('eventsParticipantsTitle', language)}</h2>
                            <EventsParticipantsCountChart data={participantsData } />
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}

