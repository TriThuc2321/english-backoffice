import type { Page, Route } from '@playwright/test';

import { test as base } from '@playwright/test';

import type { RolePermission } from '../../src/types/role';

import { makeProfile } from './data';

export const ACCESS_TOKEN = 'e2e-token';

export type MockRequest = {
  method: string;
  /** Path relative to `/api`, e.g. `/users/42` */
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
  body: unknown;
  authorized: boolean;
};

export type MockResponse = { status?: number; body?: unknown };

export type MockHandler =
  | MockResponse
  | ((request: MockRequest) => MockResponse | Promise<MockResponse>);

type Entry = {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: MockHandler;
};

const toPattern = (path: string) => {
  const keys: string[] = [];
  const source = path.replace(/:(\w+)/g, (_, key: string) => {
    keys.push(key);
    return '([^/]+)';
  });
  return { pattern: new RegExp(`^${source}$`), keys };
};

export const unauthorized: MockResponse = {
  status: 401,
  body: { statusCode: 401, message: 'Unauthorized' },
};

export class ApiMock {
  readonly requests: MockRequest[] = [];
  private readonly entries: Entry[] = [];

  /** Register a handler for `METHOD /path` (supports `:param`). Later calls win. */
  on(method: string, path: string, handler: MockHandler) {
    this.entries.push({
      method: method.toUpperCase(),
      ...toPattern(path),
      handler,
    });
    return this;
  }

  /** Requests sent to `METHOD /path`, in order. */
  calls(method: string, path: string) {
    const { pattern } = toPattern(path);
    return this.requests.filter(
      (request) =>
        request.method === method.toUpperCase() && pattern.test(request.path),
    );
  }

  /** Make the refresh cookie valid and serve a profile with these permissions. */
  loginAs(permissions: RolePermission[]) {
    const profile = makeProfile(permissions);
    this.on('POST', '/auth/refresh', { body: { access_token: ACCESS_TOKEN } });
    this.on('GET', '/auth/profile', ({ authorized }) =>
      authorized ? { body: profile } : unauthorized,
    );
    return profile;
  }

  async handle(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const path = url.pathname.replace(/^\/api/, '');

    let body: unknown = request.postData();
    try {
      body = request.postDataJSON();
    } catch {
      // not JSON, keep raw
    }

    const authorization = await request.headerValue('authorization');
    const mockRequest: MockRequest = {
      method,
      path,
      params: {},
      query: url.searchParams,
      body,
      authorized: authorization === `Bearer ${ACCESS_TOKEN}`,
    };
    this.requests.push(mockRequest);

    const entry = this.entries.findLast(
      (candidate) =>
        candidate.method === method && candidate.pattern.test(path),
    );

    if (!entry) {
      console.warn(`[e2e] unmocked request: ${method} ${path}`);
      return route.fulfill({
        status: 404,
        json: { statusCode: 404, message: `Not mocked: ${method} ${path}` },
      });
    }

    const match = entry.pattern.exec(path)!;
    entry.keys.forEach((key, i) => {
      mockRequest.params[key] = decodeURIComponent(match[i + 1]);
    });

    const { status = 200, body: responseBody = {} } =
      typeof entry.handler === 'function'
        ? await entry.handler(mockRequest)
        : entry.handler;

    return route.fulfill({ status, json: responseBody });
  }
}

const setupPage = async (page: Page, api: ApiMock) => {
  // Pin the UI language so selectors can use the English labels
  await page.addInitScript("localStorage.setItem('locale', 'en')");
  await page.route(
    (url) => url.pathname.startsWith('/api/'),
    (route) => api.handle(route),
  );
};

export const test = base.extend<{ api: ApiMock }>({
  api: async ({ page }, use) => {
    const api = new ApiMock();
    // Logged out by default: no refresh cookie, so every protected call is 401
    api.on('POST', '/auth/refresh', unauthorized);
    api.on('GET', '/auth/profile', unauthorized);
    api.on('POST', '/auth/logout', { body: {} });
    await setupPage(page, api);
    await use(api);
  },
});

export { expect } from '@playwright/test';
