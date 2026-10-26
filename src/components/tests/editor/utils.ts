import type { TestPart } from '@/types/test';

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

type PassageRef = { id: number; title: string };

// IELTS groups inherit the part's passage; a group's own passages (TOEIC Part 7) win
export const resolveGroupPassages = (
  groupPassages: PassageRef[],
  part: Pick<TestPart, 'passage'>,
): PassageRef[] => {
  if (groupPassages.length) return groupPassages;
  return part.passage
    ? [{ id: part.passage.id, title: part.passage.title }]
    : [];
};
