import { describe, expect, it } from 'vitest';

import defineAbilityFor from './permissions.config';

describe('defineAbilityFor', () => {
  it('grants only the listed permissions', () => {
    const ability = defineAbilityFor([
      { action: 'read', subject: 'User' },
      { action: 'create', subject: 'Role' },
    ]);

    expect(ability.can('read', 'User')).toBe(true);
    expect(ability.can('create', 'Role')).toBe(true);
    expect(ability.can('delete', 'User')).toBe(false);
    expect(ability.can('read', 'Role')).toBe(false);
  });

  it('denies everything without permissions', () => {
    expect(defineAbilityFor().can('read', 'User')).toBe(false);
  });

  it('supports the manage/all wildcard', () => {
    const ability = defineAbilityFor([{ action: 'manage', subject: 'all' }]);

    expect(ability.can('delete', 'Test')).toBe(true);
  });
});
