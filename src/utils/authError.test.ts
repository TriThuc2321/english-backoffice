import { describe, expect, it } from 'vitest';

import { getAuthErrorKey } from './authError';

describe('getAuthErrorKey', () => {
  it('prefers the machine-readable code', () => {
    expect(
      getAuthErrorKey({ statusCode: 403, code: 'CMS_ACCESS_DENIED' }),
    ).toBe('cms_access_denied');
    expect(
      getAuthErrorKey({ statusCode: 403, code: 'EMAIL_NOT_VERIFIED' }),
    ).toBe('email_not_verified');
    expect(getAuthErrorKey({ statusCode: 400, code: 'INVALID_CODE' })).toBe(
      'invalid_code',
    );
  });

  it('falls back to the status', () => {
    expect(getAuthErrorKey({ statusCode: 401 })).toBe('invalid_credentials');
    expect(getAuthErrorKey({ statusCode: 429 })).toBe('too_many_requests');
    expect(getAuthErrorKey(undefined)).toBe('unknown');
  });
});
