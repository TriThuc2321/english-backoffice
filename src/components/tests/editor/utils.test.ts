import { describe, expect, it } from 'vitest';

import { resolveGroupPassages } from './utils';

const partPassage = { id: 9, title: 'Passage 2', subtitle: null };

describe('resolveGroupPassages', () => {
  it("prefers the group's own passages", () => {
    const own = [{ id: 1, title: 'Ad' }];
    expect(resolveGroupPassages(own, { passage: partPassage })).toEqual(own);
  });

  it("falls back to the part's passage", () => {
    expect(resolveGroupPassages([], { passage: partPassage })).toEqual([
      { id: 9, title: 'Passage 2' },
    ]);
  });

  it('returns nothing when neither has a passage', () => {
    expect(resolveGroupPassages([], { passage: null })).toEqual([]);
  });
});
