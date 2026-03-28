'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

export function useAutoSave(
  pageId: string,
  content: unknown,
  title: string
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const isFirstRender = useRef(true);

  const save = useCallback(
    async (contentToSave: unknown, titleToSave: string) => {
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentToSave, title: titleToSave }),
        });
        if (!res.ok) throw new Error('Save failed');
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    },
    [pageId]
  );

  const debouncedSave = useDebouncedCallback(
    (c: unknown, t: string) => save(c, t),
    1000
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedSave(content, title);
  }, [content, title, debouncedSave]);

  return { saveStatus, saveNow: () => save(content, title) };
}
