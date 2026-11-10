export const AUTH_CLIENT = 'bo';

export const LOGIN_PATH = '/login';

export const FORGOT_PASSWORD_PATH = '/forgot-password';

export const RESET_SUCCESS_PARAM = 'reset';

export enum LoginError {
  GOOGLE_LOGIN_FAILED = 'google_login_failed',
  CMS_ACCESS_DENIED = 'cms_access_denied',
}

export const isLoginError = (value: unknown): value is LoginError =>
  Object.values<unknown>(LoginError).includes(value);

export type AuthErrorKey =
  | 'cms_access_denied'
  | 'email_not_verified'
  | 'invalid_credentials'
  | 'invalid_code'
  | 'too_many_requests'
  | 'unknown';
