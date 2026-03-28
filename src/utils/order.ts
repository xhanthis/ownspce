/**
 * Float-based reorder utility.
 * Items are stored with a float `order` value. Reordering = pick a value
 * between the two neighbours. If precision runs out, rebalance all.
 */

export function orderBetween(before: number | null, after: number | null): number {
  if (before === null && after === null) return 1000;
  if (before === null) return (after as number) / 2;
  if (after === null) return before + 1000;
  return (before + after) / 2;
}

/** Returns new order values for all items after a full rebalance. */
export function rebalanceOrders(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (i + 1) * 1000);
}
