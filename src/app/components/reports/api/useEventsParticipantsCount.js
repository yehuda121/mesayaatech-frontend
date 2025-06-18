'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useEventsParticipantsCount() {
  const { data, error, isLoading } = useSWR('events-participants-count', () =>
    fetchReport('events-participants-count')
  );

  return {
    participantsData: data,
    participantsError: error,
    participantsLoading: isLoading
  };
}
