'use client'
import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useUsersSummary() {
  const { data, error, isLoading } = useSWR('users-summary', () => fetchReport('users-summary'));

  return {
    usersData: data,
    usersError: error,
    usersLoading: isLoading
  };
}
