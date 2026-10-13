export const toNumber = (v: string) => (v === '' ? undefined : Number(v));

export const byOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

// Reorder endpoints need every child id, in the new order
export const moveId = <T extends { id: number }>(
  items: T[],
  index: number,
  offset: -1 | 1,
) => {
  const ids = items.map((item) => item.id);
  const target = index + offset;
  [ids[index], ids[target]] = [ids[target], ids[index]];
  return ids;
};
