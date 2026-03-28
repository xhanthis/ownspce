import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '../api/client';

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

export function useAutoSave(pageId: string, content: unknown, title: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback(
    async (c: unknown, t: string) => {
      setSaveStatus('saving');
      try {
        await api(`/api/pages/${pageId}`, {
          method: 'PATCH',
          body: JSON.stringify({ content: c, title: t }),
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    },
    [pageId],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(content, title), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, title, save]);

  return { saveStatus, saveNow: () => save(content, title) };
}
