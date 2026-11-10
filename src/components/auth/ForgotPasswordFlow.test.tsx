import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';

import ForgotPasswordFlow from './ForgotPasswordFlow';

const renderFlow = () => {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <p>Login</p> },
      { path: '/forgot-password', element: <ForgotPasswordFlow /> },
    ],
    { initialEntries: ['/forgot-password'] },
  );
  renderWithProviders(<RouterProvider router={router} />);
  return router;
};

describe('<ForgotPasswordFlow>', () => {
  it('sends a code, then resets the password and returns to login', async () => {
    const resets: unknown[] = [];
    server.use(
      http.post(`${API_URL}/auth/forgot-password`, () =>
        HttpResponse.json({ message: 'Check your email' }),
      ),
      http.post(`${API_URL}/auth/reset-password`, async ({ request }) => {
        resets.push(await request.json());
        return new HttpResponse(null, { status: 201 });
      }),
    );
    const router = renderFlow();
    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co');
    await user.click(screen.getByRole('button', { name: 'Send code' }));

    await user.type(
      await screen.findByRole('textbox', { name: 'Code' }),
      '123456',
    );
    await user.type(screen.getByLabelText('New password'), 'newpass123');
    await user.type(
      screen.getByLabelText('Confirm new password'),
      'newpass123',
    );
    await user.click(screen.getByRole('button', { name: 'Set new password' }));

    expect(await screen.findByText('Login')).toBeInTheDocument();
    expect(router.state.location.search).toBe('?reset=success');
    expect(resets).toEqual([
      { email: 'a@b.co', code: '123456', newPassword: 'newpass123' },
    ]);
  });

  it('shows an invalid code error', async () => {
    server.use(
      http.post(`${API_URL}/auth/forgot-password`, () =>
        HttpResponse.json({ message: 'Check your email' }),
      ),
      http.post(`${API_URL}/auth/reset-password`, () =>
        HttpResponse.json(
          { statusCode: 400, code: 'INVALID_CODE' },
          { status: 400 },
        ),
      ),
    );
    renderFlow();
    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co');
    await user.click(screen.getByRole('button', { name: 'Send code' }));
    await user.type(
      await screen.findByRole('textbox', { name: 'Code' }),
      '000000',
    );
    await user.type(screen.getByLabelText('New password'), 'newpass123');
    await user.type(
      screen.getByLabelText('Confirm new password'),
      'newpass123',
    );
    await user.click(screen.getByRole('button', { name: 'Set new password' }));

    expect(
      await screen.findByText(
        'The code is wrong or has expired. Request a new one.',
      ),
    ).toBeInTheDocument();
  });
});
