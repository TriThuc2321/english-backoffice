import { describe, expect, it } from 'vitest';

import { MediaScope } from '@/types/media';

import { ownerHref } from './constants';

describe('ownerHref', () => {
  it('links tests and users', () => {
    expect(ownerHref(MediaScope.TEST, '5')).toBe('/tests/5/edit');
    expect(ownerHref(MediaScope.AVATAR, 'u1')).toBe('/users/u1');
  });

  it('has no page for attempt recordings', () => {
    expect(ownerHref(MediaScope.ATTEMPT, 'a1')).toBeNull();
  });
});
