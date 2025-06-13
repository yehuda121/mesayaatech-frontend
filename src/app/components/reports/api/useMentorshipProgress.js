'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useMentorshipProgress() {
  const { data, error, isLoading } = useSWR('reservists-mentorship-status', () => fetchReport('reservists-mentorship-status'));

  return {
    mentorshipData: data,
    mentorshipError: error,
    mentorshipLoading: isLoading
  };
}
