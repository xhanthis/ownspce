'use client';

import { useParams } from 'next/navigation';
import { usePageContent } from '@/hooks/usePageContent';
import PageRenderer from '@/components/PageRenderer';

export default function PageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { page, isLoading } = usePageContent(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <span className="text-sm text-zinc-400">Loading...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <span className="text-sm text-zinc-400">Page not found.</span>
      </div>
    );
  }

  return <PageRenderer page={page} />;
}
