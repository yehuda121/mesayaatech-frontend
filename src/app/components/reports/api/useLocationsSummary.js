'use client'

import useSWR from 'swr';
import { fetchReport } from '@/app/utils/fetchReport';

export default function useLocationsSummary() {
  const { data, error, isLoading } = useSWR('reservists-location-summary', () => fetchReport('reservists-location-summary'));

  return {
    locationsData: data,
    locationsError: error,
    locationsLoading: isLoading
  };
}
