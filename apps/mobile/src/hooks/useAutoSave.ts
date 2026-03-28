import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

export function useAutoSave(pageId: string, content: unknown, title: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingRef = useRef<{ content: unknown; title: string } | null>(null);
  const queryClient = useQueryClient();

  const save = useCallback(
    async (c: unknown, t: string) => {
      pendingRef.current = null;
      setSaveStatus('saving');
      try {
        await api(`/api/pages/${pageId}`, {
          method: 'PATCH',
          body: JSON.stringify({ content: c, title: t }),
        });
        setSaveStatus('saved');
        queryClient.invalidateQueries({ queryKey: ['pages'] });
      } catch {
        setSaveStatus('error');
      }
    },
    [pageId, queryClient],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    pendingRef.current = { content, title };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(content, title), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, title, save]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) {
        const { content: c, title: t } = pendingRef.current;
        api(`/api/pages/${pageId}`, {
          method: 'PATCH',
          body: JSON.stringify({ content: c, title: t }),
        }).then(() => {
          queryClient.invalidateQueries({ queryKey: ['pages'] });
        }).catch(() => {});
      }
    };
  }, [pageId, queryClient]);

  return { saveStatus, saveNow: () => save(content, title) };
}
