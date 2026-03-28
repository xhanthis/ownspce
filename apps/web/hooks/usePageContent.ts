'use client';

import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });

export function usePageContent(pageId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/pages/${pageId}`,
    fetcher
  );

  return {
    page: data?.data ?? null,
    isLoading,
    error,
    mutate,
  };
}
