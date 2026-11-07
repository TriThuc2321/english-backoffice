import { toast } from '@heroui/react';
import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import i18n from '@/i18n';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils';
import { ASSESSMENT_ERROR } from '@/types/grading';

import useCreateAssessment from './useCreateAssessment';

vi.mock('@heroui/react', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  toast: { success: vi.fn(), danger: vi.fn() },
}));

const renderMutation = () => {
  const queryClient = createTestQueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHookWithProviders(useCreateAssessment, {
    queryClient,
  });
  return { result, invalidate };
};

const entries = [{ partId: null, criteria: { FC: 7, LR: 6.5, GRA: 7, P: 6 } }];
const SECTION_KEY = { queryKey: [REACT_QUERY_KEYS.GRADING.SECTION, 's1'] };
const ASSESSMENTS_KEY = {
  queryKey: [REACT_QUERY_KEYS.GRADING.ASSESSMENTS, 's1'],
};

const failWith = (status: number, body: object) =>
  server.use(
    http.post(`${API_URL}/grading/sections/:id/assessments`, () =>
      HttpResponse.json(body, { status }),
    ),
  );

beforeEach(() => {
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.danger).mockClear();
});

describe('useCreateAssessment', () => {
  it('posts the assessment without the id and invalidates section, revisions and queue', async () => {
    let body: unknown;
    server.use(
      http.post(
        `${API_URL}/grading/sections/s1/assessments`,
        async ({ request }) => {
          body = await request.json();
          return HttpResponse.json({ id: 'a1', revision: 1 }, { status: 201 });
        },
      ),
    );
    const { result, invalidate } = renderMutation();

    await act(() =>
      result.current.mutateAsync({ id: 's1', expectedRevision: 0, entries }),
    );

    expect(body).toEqual({ expectedRevision: 0, entries });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('grading.toast.saveSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith(SECTION_KEY);
    expect(invalidate).toHaveBeenCalledWith(ASSESSMENTS_KEY);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.GRADING.QUEUE],
    });
  });

  it('refreshes the section and shows the conflict message on a stale revision', async () => {
    failWith(409, {
      statusCode: 409,
      code: ASSESSMENT_ERROR.REVISION_CONFLICT,
      message: 'Stale revision',
    });
    const { result, invalidate } = renderMutation();

    act(() =>
      result.current.mutate({ id: 's1', expectedRevision: 0, entries }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(i18n.t('grading.toast.conflict'));
    expect(invalidate).toHaveBeenCalledWith(SECTION_KEY);
    expect(invalidate).toHaveBeenCalledWith(ASSESSMENTS_KEY);
  });

  it('says the section can no longer be graded', async () => {
    failWith(409, {
      statusCode: 409,
      code: ASSESSMENT_ERROR.NOT_GRADABLE,
      message: 'Not gradable',
    });
    const { result } = renderMutation();

    act(() =>
      result.current.mutate({ id: 's1', expectedRevision: 0, entries }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('grading.toast.notGradable'),
    );
  });

  it('toasts validation messages joined', async () => {
    failWith(400, {
      statusCode: 400,
      message: ['part 12: missing criterion TA', 'part 13: is missing'],
    });
    const { result, invalidate } = renderMutation();

    act(() =>
      result.current.mutate({ id: 's1', expectedRevision: 0, entries }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('grading.toast.saveError'),
      { description: 'part 12: missing criterion TA; part 13: is missing' },
    );
    expect(invalidate).not.toHaveBeenCalled();
  });
});
