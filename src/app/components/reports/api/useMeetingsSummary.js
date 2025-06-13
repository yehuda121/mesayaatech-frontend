'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useMeetingsSummary() {
  const { data, error, isLoading } = useSWR('mentorship-meetings-summary', () => fetchReport('mentorship-meetings-summary'));

  return {
    meetingsSummaryData: data,
    meetingsSummaryError: error,
    meetingsSummaryLoading: isLoading
  };
}
