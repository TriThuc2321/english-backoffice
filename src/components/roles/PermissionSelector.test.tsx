import type { ReactNode } from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import type {
  CreateEditRoleFormData,
  CreateEditRoleFormInput,
} from '@/schemas/role';

import {
  makePermission,
  PERMISSION_ID,
  PERMISSIONS,
} from '@/test/fixtures/permissions';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';

import PermissionSelector, {
  groupPermission,
  sortActions,
} from './PermissionSelector';

const {
  FULL,
  MANAGE_USER,
  CREATE_USER,
  READ_USER,
  UPDATE_USER,
  DELETE_USER,
  READ_ROLE,
  UPDATE_ROLE,
  READ_DASHBOARD,
} = PERMISSION_ID;

const Harness = ({ initial }: { initial: number[] }): ReactNode => {
  const { control, watch } = useForm<
    CreateEditRoleFormInput,
    unknown,
    CreateEditRoleFormData
  >({ defaultValues: { permissionIds: initial } });
  const ids = [...(watch('permissionIds') ?? [])].sort((a, b) => a - b);

  return (
    <>
      <PermissionSelector control={control} />
      <output data-testid="value">{JSON.stringify(ids)}</output>
    </>
  );
};

const renderSelector = async (initial: number[] = []) => {
  server.use(
    http.get(`${API_URL}/permissions`, () => HttpResponse.json(PERMISSIONS)),
  );
  renderWithProviders(<Harness initial={initial} />);
  await screen.findByRole('checkbox', { name: 'Select all user' });
  return userEvent.setup();
};

const value = () => JSON.parse(screen.getByTestId('value').textContent!);
const checkbox = (name: string) => screen.getByRole('checkbox', { name });

describe('groupPermission', () => {
  it('returns an empty object without permissions', () => {
    expect(groupPermission(undefined)).toEqual({});
  });

  it('groups permissions by subject', () => {
    const groups = groupPermission(PERMISSIONS);

    expect(Object.keys(groups)).toEqual(['all', 'user', 'role', 'dashboard']);
    expect(groups.user.map((p) => p.id)).toEqual([
      MANAGE_USER,
      CREATE_USER,
      READ_USER,
      UPDATE_USER,
      DELETE_USER,
    ]);
  });
});

describe('sortActions', () => {
  it('orders CRUD first, then other actions alphabetically, without manage', () => {
    const rows = [
      {
        subject: 'test',
        byAction: {},
        permissions: [
          'publish',
          'delete',
          'manage',
          'read',
          'export',
          'create',
        ].map((action, i) => makePermission(i, action, 'test')),
      },
    ];

    expect(sortActions(rows)).toEqual([
      'create',
      'read',
      'delete',
      'export',
      'publish',
    ]);
  });
});

describe('<PermissionSelector>', () => {
  it('stores a full subject as its manage permission', async () => {
    const user = await renderSelector();

    await user.click(checkbox('Select all user'));

    expect(value()).toEqual([MANAGE_USER]);
    expect(checkbox('update user')).toBeChecked();
    expect(screen.getByText('4/4')).toBeInTheDocument();
  });

  it('expands manage into actions when one is unchecked', async () => {
    const user = await renderSelector([MANAGE_USER]);

    expect(checkbox('create user')).toBeChecked();

    await user.click(checkbox('update user'));

    expect(value()).toEqual([CREATE_USER, READ_USER, DELETE_USER]);
    expect(screen.getByText('3/4')).toBeInTheDocument();
  });

  it('compresses back to manage when every action is checked', async () => {
    const user = await renderSelector([CREATE_USER, READ_USER, DELETE_USER]);

    await user.click(checkbox('update user'));

    expect(value()).toEqual([MANAGE_USER]);
  });

  it('toggles a whole action column', async () => {
    const user = await renderSelector();

    await user.click(checkbox('Select all read'));

    expect(value()).toEqual([READ_USER, READ_ROLE, READ_DASHBOARD]);

    await user.click(checkbox('Select all read'));

    expect(value()).toEqual([]);
  });

  it('full permissions replaces the selection and restores it when turned off', async () => {
    const user = await renderSelector([READ_ROLE, UPDATE_ROLE]);

    await user.click(checkbox('Full permissions'));

    expect(value()).toEqual([FULL]);
    await waitFor(() => expect(checkbox('read role')).toBeDisabled());
    expect(checkbox('Select all user')).toBeDisabled();

    await user.click(checkbox('Full permissions'));

    expect(value()).toEqual([READ_ROLE, UPDATE_ROLE]);
    expect(checkbox('read role')).toBeEnabled();
  });
});
