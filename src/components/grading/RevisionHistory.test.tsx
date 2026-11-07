import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import type { Assessment } from '@/types/grading';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';
import { formatDateTime } from '@/utils/datetime';

import RevisionHistory from './RevisionHistory';

const person = (firstName: string, lastName: string) => ({
  id: firstName,
  email: null,
  firstName,
  lastName,
});

const REVISIONS: Assessment[] = [
  {
    id: 'as2',
    revision: 2,
    band: 7,
    grader: person('Lan', 'Pham'),
    createdAt: '2026-11-06T09:30:00.000Z',
    entries: [
      {
        partId: null,
        criteria: { FC: 7, LR: 7, GRA: 7, P: 7 },
        band: 7,
        feedback: 'Fluent and natural',
      },
    ],
  },
  {
    id: 'as1',
    revision: 1,
    band: 6.5,
    grader: person('Minh', 'Tran'),
    createdAt: '2026-11-05T15:00:00.000Z',
    entries: [
      {
        partId: null,
        criteria: { FC: 6.5, LR: 6.5, GRA: 7, P: 6 },
        band: 6.5,
        feedback: null,
      },
    ],
  },
];

describe('<RevisionHistory>', () => {
  it('lists every revision newest first with grader, time and bands', async () => {
    server.use(
      http.get(`${API_URL}/grading/sections/:id/assessments`, () =>
        HttpResponse.json(REVISIONS),
      ),
    );
    renderWithProviders(
      <RevisionHistory
        attemptSectionId="s1"
        expectedEntries={[
          { partId: null, task: null, criteria: ['FC', 'LR', 'GRA', 'P'] },
        ]}
      />,
    );

    const rows = await screen.findAllByRole('group', { name: /Revision \d/ });
    expect(rows.map((row) => row.getAttribute('aria-label'))).toEqual([
      'Revision 2',
      'Revision 1',
    ]);
    expect(within(rows[0]).getByText('Current')).toBeInTheDocument();
    expect(within(rows[1]).queryByText('Current')).toBeNull();
    expect(within(rows[0]).getByText('Lan Pham')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Minh Tran')).toBeInTheDocument();
    expect(
      within(rows[1]).getByText(
        formatDateTime(REVISIONS[1].createdAt, 'DD/MM/YYYY HH:mm'),
        { exact: false },
      ),
    ).toBeInTheDocument();

    await userEvent.click(within(rows[0]).getByText('Revision 2'));
    expect(within(rows[0]).getByText('Fluent and natural')).toBeVisible();
    expect(within(rows[0]).getByText('FC 7')).toBeVisible();
    expect(within(rows[0]).getByText('Speaking')).toBeVisible();
  });
});
