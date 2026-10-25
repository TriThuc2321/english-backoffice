import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { Role } from '@/types/role';

import { PERMISSION_ID, PERMISSIONS } from '@/test/fixtures/permissions';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';
import { Status } from '@/types/common';

import EditRole from './EditRole';

const ROLE: Role = {
  id: 3,
  name: 'Teacher',
  code: 'TEACHER',
  canAccessCms: true,
  status: Status.ACTIVE,
  systemRole: false,
  // The API returns pairs, the form works with permission ids
  permissions: [
    { action: 'manage', subject: 'user' },
    { action: 'read', subject: 'role' },
  ],
};

const renderEditRole = (role: Role) => {
  const patches: unknown[] = [];
  server.use(
    http.get(`${API_URL}/roles/:id`, () => HttpResponse.json(role)),
    http.get(`${API_URL}/permissions`, () => HttpResponse.json(PERMISSIONS)),
    http.patch(`${API_URL}/roles/:id`, async ({ request }) => {
      patches.push(await request.json());
      return HttpResponse.json(role);
    }),
  );
  const router = createMemoryRouter(
    [
      { path: '/roles', element: <p>Roles list</p> },
      { path: '/roles/:id', element: <p>Role detail</p> },
      { path: '/roles/:id/edit', element: <EditRole id={String(role.id)} /> },
    ],
    { initialEntries: [`/roles/${role.id}/edit`] },
  );
  renderWithProviders(<RouterProvider router={router} />);
  return { router, patches };
};

describe('<EditRole>', () => {
  it('pre-fills the form and maps permissions to ids', async () => {
    renderEditRole(ROLE);

    const name = await screen.findByRole('textbox', { name: 'Name' });
    await waitFor(() => expect(name).toHaveValue('Teacher'));
    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveValue(
      'TEACHER',
    );
    await waitFor(() =>
      expect(
        screen.getByRole('checkbox', { name: 'Select all user' }),
      ).toBeChecked(),
    );
    expect(screen.getByRole('checkbox', { name: 'read role' })).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'update role' }),
    ).not.toBeChecked();
  });

  it('submits the edited role and returns to the list', async () => {
    const { router, patches } = renderEditRole(ROLE);
    const user = userEvent.setup();

    const name = await screen.findByRole('textbox', { name: 'Name' });
    await waitFor(() => expect(name).toHaveValue('Teacher'));
    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: 'read role' })).toBeChecked(),
    );
    await user.clear(name);
    await user.type(name, 'Senior Teacher');
    await user.click(screen.getByRole('checkbox', { name: 'update role' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/roles'));
    expect(patches).toHaveLength(1);
    const [body] = patches as { permissionIds: number[] }[];
    expect(body).toMatchObject({
      name: 'Senior Teacher',
      code: 'TEACHER',
      status: Status.ACTIVE,
      canAccessCms: true,
    });
    expect([...body.permissionIds].sort((a, b) => a - b)).toEqual([
      PERMISSION_ID.MANAGE_USER,
      PERMISSION_ID.READ_ROLE,
      PERMISSION_ID.UPDATE_ROLE,
    ]);
  });

  it('redirects a system role to its detail page', async () => {
    const { router } = renderEditRole({ ...ROLE, systemRole: true });

    await screen.findByText('Role detail');
    expect(router.state.location.pathname).toBe('/roles/3');
  });
});
