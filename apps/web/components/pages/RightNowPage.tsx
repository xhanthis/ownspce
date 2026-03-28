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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ACTIVE_MAX, ONDECK_MAX } from '@ownspce/core';
import type { RightNowItem, RightNowContent } from '@ownspce/core';
import { useAutoSave } from '@/hooks/useAutoSave';

type Lane = 'active' | 'onDeck' | 'holding';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

interface Page {
  id: string;
  title: string;
  content: unknown;
}

export default function RightNowPage({ page }: { page: Page }) {
  const initial = page.content as RightNowContent | null;
  const [title, setTitle] = useState(page.title);
  const [active, setActive] = useState<RightNowItem[]>(
    initial?.active ?? []
  );
  const [onDeck, setOnDeck] = useState<RightNowItem[]>(
    initial?.onDeck ?? []
  );
  const [holding, setHolding] = useState<RightNowItem[]>(
    initial?.holding ?? []
  );
  const [newText, setNewText] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const content: RightNowContent = { active, onDeck, holding };
  const { saveStatus } = useAutoSave(page.id, content, title);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function update(
    a: RightNowItem[],
    od: RightNowItem[],
    h: RightNowItem[]
  ) {
    setActive(a);
    setOnDeck(od);
    setHolding(h);
  }

  function addToHolding() {
    if (!newText.trim()) return;
    const item: RightNowItem = {
      id: uid(),
      text: newText.trim(),
      createdAt: new Date().toISOString(),
    };
    setNewText('');
    update(active, onDeck, [...holding, item]);
  }

  function completeActive(id: string) {
    const nextActive = active.filter((i) => i.id !== id);
    const nextOnDeck = [...onDeck];
    if (onDeck.length > 0 && nextActive.length < ACTIVE_MAX) {
      const promoted = nextOnDeck.shift()!;
      nextActive.push(promoted);
    }
    update(nextActive, nextOnDeck, holding);
  }

  function findLane(id: string): Lane | null {
    if (active.find((i) => i.id === id)) return 'active';
    if (onDeck.find((i) => i.id === id)) return 'onDeck';
    if (holding.find((i) => i.id === id)) return 'holding';
    return null;
  }

  function getLane(lane: Lane) {
    if (lane === 'active') return active;
    if (lane === 'onDeck') return onDeck;
    return holding;
  }

  function laneMax(lane: Lane) {
    if (lane === 'active') return ACTIVE_MAX;
    if (lane === 'onDeck') return ONDECK_MAX;
    return Infinity;
  }

  function handleDragStart(e: DragStartEvent) {
    setDraggingId(e.active.id as string);
  }

  function handleDragOver(e: DragOverEvent) {
    const { active: dragActive, over } = e;
    if (!over) return;
    const fromLane = findLane(dragActive.id as string);
    const toLane =
      findLane(over.id as string) ?? (over.id as Lane);
    if (!fromLane || !toLane || fromLane === toLane) return;

    const fromItems = [...getLane(fromLane)];
    const toItems = [...getLane(toLane)];
    if (toItems.length >= laneMax(toLane)) return;

    const itemIdx = fromItems.findIndex((i) => i.id === dragActive.id);
    const [item] = fromItems.splice(itemIdx, 1);
    const overIdx = toItems.findIndex((i) => i.id === over.id);
    toItems.splice(overIdx >= 0 ? overIdx : toItems.length, 0, item);

    const next = { active: [...active], onDeck: [...onDeck], holding: [...holding] };
    next[fromLane] = fromItems;
    next[toLane as Lane] = toItems;
    setActive(next.active);
    setOnDeck(next.onDeck);
    setHolding(next.holding);
  }

  function handleDragEnd(e: DragEndEvent) {
    setDraggingId(null);
    const { active: dragActive, over } = e;
    if (!over) return;
    const fromLane = findLane(dragActive.id as string);
    if (!fromLane) return;

    const items = [...getLane(fromLane)];
    const fromIdx = items.findIndex((i) => i.id === dragActive.id);
    const toIdx = items.findIndex((i) => i.id === over.id);
    if (fromIdx === toIdx) return;
    const [item] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, item);

    const next = { active: [...active], onDeck: [...onDeck], holding: [...holding] };
    next[fromLane] = items;
    setActive(next.active);
    setOnDeck(next.onDeck);
    setHolding(next.holding);
  }

  const allItems = [...active, ...onDeck, ...holding];
  const draggingItem = allItems.find((i) => i.id === draggingId);

  return (
    <div className="p-8 max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-transparent outline-none border-none w-full"
          placeholder="Right Now"
        />
        <span className="text-xs text-zinc-400 shrink-0 ml-4">
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        </span>
      </div>

      <div className="flex gap-2 mb-8">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addToHolding();
          }}
          placeholder="Add to holding stack..."
          className="flex-1 px-3 py-2 text-sm bg-[#F2F2F2] dark:bg-zinc-800 rounded-input outline-none border border-transparent focus:border-[#E0E0E0] dark:focus:border-zinc-600"
        />
        <button
          onClick={addToHolding}
          className="px-3 py-2 text-sm font-medium bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] rounded-input hover:opacity-80 transition-opacity"
        >
          Add
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LaneColumn
            id="active"
            label="Active"
            max={ACTIVE_MAX}
            items={active}
            onComplete={completeActive}
            accent
          />
          <LaneColumn
            id="onDeck"
            label="On Deck"
            max={ONDECK_MAX}
            items={onDeck}
          />
          <LaneColumn id="holding" label="Holding" items={holding} />
        </div>

        <DragOverlay>
          {draggingItem && (
            <div className="px-4 py-3 bg-white dark:bg-zinc-900 rounded-card border border-[#0A0A0A] dark:border-white shadow-lg text-sm opacity-90">
              {draggingItem.text}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function LaneColumn({
  id,
  label,
  max,
  items,
  onComplete,
  accent,
}: {
  id: Lane;
  label: string;
  max?: number;
  items: RightNowItem[];
  onComplete?: (id: string) => void;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-xs text-zinc-400">
          {items.length}
          {max ? `/${max}` : ''}
        </span>
        {max && items.length >= max && (
          <span className="text-xs text-[#FF6B4A]">full</span>
        )}
      </div>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={`flex flex-col gap-2 min-h-32 p-3 rounded-card border ${
            accent
              ? 'border-[#FF6B4A]/40'
              : 'border-[#E0E0E0] dark:border-zinc-800'
          } bg-[#F2F2F2] dark:bg-zinc-900`}
          data-lane={id}
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onComplete={onComplete}
              accent={accent}
            />
          ))}
          {items.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-4">
              Drop here
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableItem({
  item,
  onComplete,
  accent,
}: {
  item: RightNowItem;
  onComplete?: (id: string) => void;
  accent?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group flex items-start gap-3 px-3 py-2.5 rounded-input bg-white dark:bg-zinc-800 border border-[#E0E0E0] dark:border-zinc-700 cursor-grab active:cursor-grabbing select-none ${
        accent ? 'border-l-2 border-l-[#FF6B4A] pulse-accent' : ''
      }`}
    >
      <span className="flex-1 text-sm leading-snug">{item.text}</span>
      {onComplete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(item.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="shrink-0 w-4 h-4 rounded-full border border-[#E0E0E0] dark:border-zinc-600 hover:border-[#FF6B4A] hover:bg-[#FF6B4A] flex items-center justify-center transition-colors mt-0.5"
          title="Complete"
        >
          <span className="text-[8px] text-transparent hover:text-white">
            ✓
          </span>
        </button>
      )}
    </div>
  );
}
