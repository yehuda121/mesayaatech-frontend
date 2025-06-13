'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useEventsPerMonth() {
  const { data, error, isLoading } = useSWR('events-per-month', () => fetchReport('events-per-month'));

  return {
    eventsData: data,
    eventsError: error,
    eventsLoading: isLoading
  };
}
