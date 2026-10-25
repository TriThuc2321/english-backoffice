import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithProviders } from '@/test/utils';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

import useGetMediaList from './useGetMediaList';

// Records each list query and answers with an empty page
const captureQueries = () => {
  const queries: URLSearchParams[] = [];
  server.use(
    http.get(`${API_URL}/media`, ({ request }) => {
      queries.push(new URL(request.url).searchParams);
      return HttpResponse.json({
        data: [],
        meta: { page: 1, take: 10, totalCount: 0 },
      });
    }),
  );
  return queries;
};

describe('useGetMediaList', () => {
  it('sends the filters as query params', async () => {
    const queries = captureQueries();

    const { result } = renderHookWithProviders(() =>
      useGetMediaList({
        page: 2,
        take: 20,
        scope: MediaScope.TEST,
        ownerId: '7',
        kind: MediaKind.AUDIO,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Object.fromEntries(queries[0])).toEqual({
      page: '2',
      take: '20',
      scope: 'TEST',
      ownerId: '7',
      kind: 'AUDIO',
    });
  });

  it('waits for an owner by default', () => {
    const queries = captureQueries();

    const { result } = renderHookWithProviders(() =>
      useGetMediaList({ scope: MediaScope.TEST }),
    );

    expect(result.current.fetchStatus).toBe('idle');
    expect(queries).toHaveLength(0);
  });

  it('lists everything when enabled explicitly', async () => {
    const queries = captureQueries();

    const { result } = renderHookWithProviders(() =>
      useGetMediaList({ page: 1, take: 10 }, { enabled: true }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queries[0].has('ownerId')).toBe(false);
  });
});
