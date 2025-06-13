'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useJobsPerMonth() {
  const { data, error, isLoading} = useSWR('jobs-per-month', () => fetchReport('jobs-per-month'));

  return {
    jobsData: data,
    jobError: error,
    jobLoading: isLoading
  };
}



