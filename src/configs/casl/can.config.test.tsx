import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/utils';

import { Can } from './can.config';

describe('<Can>', () => {
  it('renders children when the action is allowed', () => {
    renderWithProviders(
      <Can I="create" a="User">
        <button>Create user</button>
      </Can>,
      { permissions: [{ action: 'create', subject: 'User' }] },
    );

    expect(
      screen.getByRole('button', { name: 'Create user' }),
    ).toBeInTheDocument();
  });

  it('hides children when the action is not allowed', () => {
    renderWithProviders(
      <Can I="delete" a="User">
        <button>Delete user</button>
      </Can>,
      { permissions: [{ action: 'read', subject: 'User' }] },
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
