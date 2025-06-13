'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useTopJobPublishers() {
  const { data, error, isLoading } = useSWR('top-job-publishers', () => fetchReport('top-job-publishers'));

  return {
    publishersData: data,
    publishersError: error,
    publishersLoading: isLoading
  };
}
