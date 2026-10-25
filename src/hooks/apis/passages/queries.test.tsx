import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithProviders } from '@/test/utils';
import { MarkedBy } from '@/types/common';
import { PassageStatus } from '@/types/passage';

import useGetPassageById from './useGetPassageById';
import useGetPassages from './useGetPassages';
import useGetPassagesInfinity from './useGetPassagesInfinity';

const TOTAL = 25;

// Serves TOTAL passages paginated by page/take and records each query
const servePages = () => {
  const queries: URLSearchParams[] = [];
  server.use(
    http.get(`${API_URL}/passages`, ({ request }) => {
      const query = new URL(request.url).searchParams;
      queries.push(query);
      const page = Number(query.get('page'));
      const take = Number(query.get('take'));
      const ids = Array.from({ length: TOTAL }, (_, i) => `p${i + 1}`);
      return HttpResponse.json({
        data: ids.slice((page - 1) * take, page * take).map((id) => ({ id })),
        meta: { page, take, totalCount: TOTAL },
      });
    }),
  );
  return queries;
};

describe('useGetPassages', () => {
  it('sends the filters as query params', async () => {
    const queries = servePages();

    const { result } = renderHookWithProviders(() =>
      useGetPassages({
        page: 2,
        take: 10,
        search: 'nile',
        status: PassageStatus.DRAFT,
        markedBy: MarkedBy.NUMBER,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data?.[0]).toEqual({ id: 'p11' });
    expect(Object.fromEntries(queries[0])).toEqual({
      page: '2',
      take: '10',
      search: 'nile',
      status: 'DRAFT',
      markedBy: 'NUMBER',
    });
  });
});

describe('useGetPassageById', () => {
  it('fetches the passage by id', async () => {
    server.use(
      http.get(`${API_URL}/passages/:id`, ({ params }) =>
        HttpResponse.json({ id: params.id, title: 'The Nile' }),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetPassageById('p1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'p1', title: 'The Nile' });
  });

  it('does not fetch without an id', () => {
    const { result } = renderHookWithProviders(() => useGetPassageById(''));

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetPassagesInfinity', () => {
  it('flattens the pages and stops after the last one', async () => {
    const queries = servePages();

    const { result } = renderHookWithProviders(() =>
      useGetPassagesInfinity({ search: 'nile', take: 50 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(10);
    expect(result.current.hasNextPage).toBe(true);

    await act(() => result.current.fetchNextPage());
    await act(() => result.current.fetchNextPage());

    await waitFor(() => expect(result.current.data).toHaveLength(TOTAL));
    expect(result.current.data?.at(-1)).toEqual({ id: `p${TOTAL}` });
    expect(result.current.hasNextPage).toBe(false);
    // take is always 10, whatever the caller passes
    expect(queries.map((q) => [q.get('page'), q.get('take')])).toEqual([
      ['1', '10'],
      ['2', '10'],
      ['3', '10'],
    ]);
    expect(queries.every((q) => q.get('search') === 'nile')).toBe(true);
  });

  it('has no next page when the response has no meta', async () => {
    server.use(
      http.get(`${API_URL}/passages`, () =>
        HttpResponse.json({ data: [{ id: 'p1' }] }),
      ),
    );

    const { result } = renderHookWithProviders(() =>
      useGetPassagesInfinity({}),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'p1' }]);
    expect(result.current.hasNextPage).toBe(false);
  });
});
