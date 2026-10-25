import type { RequestHandler } from 'msw';

import ENV from '@/configs/env.config';

export const API_URL = `${ENV.API_URL}/api`;

// Default handlers shared by every test; override per test with server.use()
export const handlers: RequestHandler[] = [];
