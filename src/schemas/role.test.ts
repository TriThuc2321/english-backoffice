import { describe, expect, it } from 'vitest';

import { Status } from '@/types/common';

import { VALIDATION_MESSAGE } from './message';
import { createEditRoleSchema } from './role';

const base = {
  name: 'Teacher',
  code: 'TEACHER',
  canAccessCms: true,
  permissionIds: [1, 2],
};

describe('createEditRoleSchema', () => {
  it('accepts a minimal role', async () => {
    await expect(createEditRoleSchema.isValid(base)).resolves.toBe(true);
  });

  it('accepts a role without permissions', async () => {
    await expect(
      createEditRoleSchema.isValid({ ...base, permissionIds: [] }),
    ).resolves.toBe(true);
  });

  it.each(['name', 'code', 'canAccessCms'])('requires %s', async (field) => {
    await expect(
      createEditRoleSchema.validate({ ...base, [field]: undefined }),
    ).rejects.toThrow(VALIDATION_MESSAGE.REQUIRED);
  });

  it('requires permissionIds to be defined', async () => {
    await expect(
      createEditRoleSchema.isValid({ ...base, permissionIds: undefined }),
    ).resolves.toBe(false);
  });

  it.each([Status.ACTIVE, Status.INACTIVE])(
    'accepts status %s',
    async (status) => {
      await expect(
        createEditRoleSchema.isValid({ ...base, status }),
      ).resolves.toBe(true);
    },
  );

  it('rejects the DELETED status', async () => {
    await expect(
      createEditRoleSchema.isValid({ ...base, status: Status.DELETED }),
    ).resolves.toBe(false);
  });
});
