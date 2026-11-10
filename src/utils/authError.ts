import type { AuthErrorKey } from '@/constants/auth';
import type { ApiError } from '@/types/common';

const CODE_TO_KEY: Record<string, AuthErrorKey> = {
  CMS_ACCESS_DENIED: 'cms_access_denied',
  EMAIL_NOT_VERIFIED: 'email_not_verified',
  INVALID_CODE: 'invalid_code',
};

export const getAuthErrorKey = (error: unknown): AuthErrorKey => {
  const { code, statusCode } = (error ?? {}) as ApiError;
  if (code && CODE_TO_KEY[code]) {
    return CODE_TO_KEY[code];
  }
  if (statusCode === 401) {
    return 'invalid_credentials';
  }
  if (statusCode === 429) {
    return 'too_many_requests';
  }
  return 'unknown';
};
