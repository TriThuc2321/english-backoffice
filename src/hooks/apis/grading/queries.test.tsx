import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithProviders } from '@/test/utils';
import { GradingStatus } from '@/types/grading';
import { SkillType } from '@/types/test';

import useGetAssessments from './useGetAssessments';
import useGetGradingQueue from './useGetGradingQueue';
import useGetGradingSection from './useGetGradingSection';

describe('useGetGradingQueue', () => {
  it('sends the queue filters as query params', async () => {
    const queries: URLSearchParams[] = [];
    server.use(
      http.get(`${API_URL}/grading/queue`, ({ request }) => {
        queries.push(new URL(request.url).searchParams);
        return HttpResponse.json({ data: [], meta: { totalCount: 0 } });
      }),
    );

    const { result } = renderHookWithProviders(() =>
      useGetGradingQueue({
        page: 1,
        take: 10,
        gradingStatus: GradingStatus.GRADED,
        skill: SkillType.WRITING,
        search: 'an',
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Object.fromEntries(queries[0])).toEqual({
      page: '1',
      take: '10',
      gradingStatus: 'GRADED',
      skill: 'WRITING',
      search: 'an',
    });
  });
});

describe('useGetGradingSection', () => {
  it('fetches the section by id', async () => {
    server.use(
      http.get(`${API_URL}/grading/sections/:id`, ({ params }) =>
        HttpResponse.json({ attemptSectionId: params.id, revision: 0 }),
      ),
    );

    const { result } = renderHookWithProviders(() =>
      useGetGradingSection('s1'),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.attemptSectionId).toBe('s1');
  });
});

describe('useGetAssessments', () => {
  it('fetches every revision of the section', async () => {
    server.use(
      http.get(`${API_URL}/grading/sections/:id/assessments`, () =>
        HttpResponse.json([
          { id: 'a2', revision: 2 },
          { id: 'a1', revision: 1 },
        ]),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetAssessments('s1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((a) => a.revision)).toEqual([2, 1]);
  });
});
