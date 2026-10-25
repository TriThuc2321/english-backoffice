import { describe, expect, it } from 'vitest';

import { Gender, Status } from '@/types/common';

import { VALIDATION_MESSAGE } from './message';
import { createEditUserSchema } from './user';

const base = {
  email: 'a@b.com',
  firstName: 'An',
  lastName: 'Nguyen',
  roleId: 1,
};

describe('createEditUserSchema', () => {
  it('accepts a minimal user', async () => {
    await expect(createEditUserSchema.isValid(base)).resolves.toBe(true);
  });

  it('rejects an invalid email', async () => {
    await expect(
      createEditUserSchema.validate({ ...base, email: 'nope' }),
    ).rejects.toThrow(VALIDATION_MESSAGE.INVALID_EMAIL);
  });

  it('rejects a date of birth in the future', async () => {
    await expect(
      createEditUserSchema.validate({ ...base, dateOfBirth: '2999-01-01' }),
    ).rejects.toThrow(VALIDATION_MESSAGE.MUST_BE_PAST_DATE);
  });

  it('requires a role', async () => {
    await expect(
      createEditUserSchema.validate({ ...base, roleId: undefined }),
    ).rejects.toThrow(VALIDATION_MESSAGE.REQUIRED);
  });

  it('accepts a date of birth in the past', async () => {
    await expect(
      createEditUserSchema.isValid({ ...base, dateOfBirth: '2000-01-01' }),
    ).resolves.toBe(true);
  });

  it('rejects an unknown gender', async () => {
    await expect(
      createEditUserSchema.isValid({ ...base, gender: 'UNKNOWN' }),
    ).resolves.toBe(false);
    await expect(
      createEditUserSchema.isValid({ ...base, gender: Gender.FEMALE }),
    ).resolves.toBe(true);
  });

  it('rejects the DELETED status', async () => {
    await expect(
      createEditUserSchema.isValid({ ...base, status: Status.DELETED }),
    ).resolves.toBe(false);
  });

  it('treats empty optional strings as undefined', async () => {
    const value = await createEditUserSchema.validate({
      ...base,
      phone: '',
      dateOfBirth: '',
      address: '',
    });

    expect(value.phone).toBeUndefined();
    expect(value.dateOfBirth).toBeUndefined();
    expect(value.address).toBeUndefined();
  });
});
