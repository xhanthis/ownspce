'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAutoSave } from '@/hooks/useAutoSave';
import type { KanbanColumn, KanbanCard, KanbanContent } from '@ownspce/core';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

interface Page {
  id: string;
  title: string;
  content: unknown;
}

export default function KanbanPage({ page }: { page: Page }) {
  const initial = page.content as KanbanContent | null;
  const [title, setTitle] = useState(page.title);
  const [columns, setColumns] = useState<KanbanColumn[]>(
    initial?.columns ?? []
  );
  const [draggingCard, setDraggingCard] = useState<KanbanCard | null>(null);

  const content: KanbanContent = { columns };
  const { saveStatus } = useAutoSave(page.id, content, title);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function updateColumns(cols: KanbanColumn[]) {
    setColumns(cols);
  }

  function addColumn() {
    updateColumns([
      ...columns,
      { id: uid(), title: 'New Column', cards: [] },
    ]);
  }

  function renameColumn(colId: string, name: string) {
    updateColumns(
      columns.map((c) => (c.id === colId ? { ...c, title: name } : c))
    );
  }

  function deleteColumn(colId: string) {
    updateColumns(columns.filter((c) => c.id !== colId));
  }

  function addCard(colId: string, cardTitle: string) {
    if (!cardTitle.trim()) return;
    updateColumns(
      columns.map((c) =>
        c.id === colId
          ? {
              ...c,
              cards: [
                ...c.cards,
                { id: uid(), title: cardTitle.trim() },
              ],
            }
          : c
      )
    );
  }

  function deleteCard(colId: string, cardId: string) {
    updateColumns(
      columns.map((c) =>
        c.id === colId
          ? { ...c, cards: c.cards.filter((k) => k.id !== cardId) }
          : c
      )
    );
  }

  function findCardColumn(cardId: string): string | null {
    return (
      columns.find((c) => c.cards.find((k) => k.id === cardId))?.id ?? null
    );
  }

  function handleDragStart(e: DragStartEvent) {
    const colId = findCardColumn(e.active.id as string);
    if (!colId) return;
    const col = columns.find((c) => c.id === colId)!;
    const card = col.cards.find((k) => k.id === e.active.id)!;
    setDraggingCard(card);
  }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const fromColId = findCardColumn(active.id as string);
    const toColId =
      findCardColumn(over.id as string) ??
      (columns.find((c) => c.id === over.id)?.id ?? null);
    if (!fromColId || !toColId || fromColId === toColId) return;

    const fromCol = columns.find((c) => c.id === fromColId)!;
    const cardIdx = fromCol.cards.findIndex((k) => k.id === active.id);
    const [card] = [...fromCol.cards].splice(cardIdx, 1);
    const toCol = columns.find((c) => c.id === toColId)!;
    const overIdx = toCol.cards.findIndex((k) => k.id === over.id);

    setColumns(
      columns.map((c) => {
        if (c.id === fromColId)
          return { ...c, cards: c.cards.filter((k) => k.id !== active.id) };
        if (c.id === toColId) {
          const cards = [...c.cards];
          cards.splice(overIdx >= 0 ? overIdx : cards.length, 0, card);
          return { ...c, cards };
        }
        return c;
      })
    );
  }

  function handleDragEnd(e: DragEndEvent) {
    setDraggingCard(null);
    const { active, over } = e;
    if (!over) return;
    const fromColId = findCardColumn(active.id as string);
    if (!fromColId) return;

    const col = columns.find((c) => c.id === fromColId)!;
    const cards = [...col.cards];
    const fromIdx = cards.findIndex((k) => k.id === active.id);
    const toIdx = cards.findIndex((k) => k.id === over.id);
    if (fromIdx === toIdx) return;
    const [card] = cards.splice(fromIdx, 1);
    cards.splice(toIdx, 0, card);
    updateColumns(
      columns.map((c) => (c.id === fromColId ? { ...c, cards } : c))
    );
  }

  return (
    <div className="p-8 fade-in">
      <div className="flex items-center justify-between mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-transparent outline-none border-none w-full"
          placeholder="Untitled"
        />
        <span className="text-xs text-zinc-400 shrink-0 ml-4">
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={columns.map((c) => c.id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((col) => (
              <KanbanColumnComponent
                key={col.id}
                column={col}
                onRename={renameColumn}
                onDelete={deleteColumn}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
              />
            ))}
          </SortableContext>

          <button
            onClick={addColumn}
            className="shrink-0 w-64 h-12 flex items-center justify-center gap-2 rounded-card border border-dashed border-[#E0E0E0] dark:border-zinc-700 text-sm text-zinc-400 hover:border-[#0A0A0A] dark:hover:border-zinc-400 hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
          >
            + Add column
          </button>
        </div>

        <DragOverlay>
          {draggingCard && (
            <div className="w-60 px-3 py-2.5 bg-white dark:bg-zinc-800 rounded-card border border-[#0A0A0A] dark:border-white shadow-lg text-sm opacity-90">
              {draggingCard.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumnComponent({
  column,
  onRename,
  onDelete,
  onAddCard,
  onDeleteCard,
}: {
  column: KanbanColumn;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddCard: (colId: string, title: string) => void;
  onDeleteCard: (colId: string, cardId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [colTitle, setColTitle] = useState(column.title);
  const [newCard, setNewCard] = useState('');
  const [addingCard, setAddingCard] = useState(false);

  function submitRename() {
    setEditing(false);
    if (colTitle.trim()) onRename(column.id, colTitle.trim());
  }

  function submitCard() {
    if (newCard.trim()) {
      onAddCard(column.id, newCard);
      setNewCard('');
    }
    setAddingCard(false);
  }

  return (
    <div className="shrink-0 w-64 flex flex-col gap-3 rounded-card bg-[#F2F2F2] dark:bg-zinc-900 p-3 border border-[#E0E0E0] dark:border-zinc-800">
      <div className="flex items-center gap-2">
        {editing ? (
          <input
            value={colTitle}
            onChange={(e) => setColTitle(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename();
            }}
            autoFocus
            className="flex-1 text-sm font-semibold bg-transparent outline-none border-b border-[#0A0A0A] dark:border-white"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex-1 text-sm font-semibold text-left hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {column.title}
          </button>
        )}
        <span className="text-xs text-zinc-400">{column.cards.length}</span>
        <button
          onClick={() => onDelete(column.id)}
          className="text-zinc-300 hover:text-red-400 text-sm transition-colors"
        >
          &times;
        </button>
      </div>

      <SortableContext
        items={column.cards.map((k) => k.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-8">
          {column.cards.map((card) => (
            <KanbanCardComponent
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(column.id, card.id)}
            />
          ))}
        </div>
      </SortableContext>

      {addingCard ? (
        <div className="flex flex-col gap-1.5">
          <input
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitCard();
              if (e.key === 'Escape') setAddingCard(false);
            }}
            placeholder="Card title..."
            autoFocus
            className="px-2 py-1.5 text-xs bg-white dark:bg-zinc-800 rounded-input outline-none border border-[#E0E0E0] dark:border-zinc-700"
          />
          <div className="flex gap-1.5">
            <button
              onClick={submitCard}
              className="px-2 py-1 text-xs font-medium bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] rounded-input hover:opacity-80"
            >
              Add
            </button>
            <button
              onClick={() => setAddingCard(false)}
              className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingCard(true)}
          className="text-xs text-zinc-400 hover:text-[#0A0A0A] dark:hover:text-white text-left transition-colors py-1"
        >
          + Add card
        </button>
      )}
    </div>
  );
}

function KanbanCardComponent({
  card,
  onDelete,
}: {
  card: KanbanCard;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...attributes}
      {...listeners}
      className="group flex items-start gap-2 px-3 py-2.5 bg-white dark:bg-zinc-800 rounded-input border border-[#E0E0E0] dark:border-zinc-700 cursor-grab active:cursor-grabbing select-none"
    >
      <span className="flex-1 text-sm leading-snug">{card.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="hidden group-hover:block shrink-0 text-zinc-300 hover:text-red-400 text-sm transition-colors"
      >
        &times;
      </button>
    </div>
  );
}
