import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { clearAccessToken, getAccessToken } from '@/services/auth-token';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';

import EmailLoginForm from './EmailLoginForm';

const renderForm = () => {
  const bodies: unknown[] = [];
  const router = createMemoryRouter(
    [
      { path: '/', element: <p>Home</p> },
      { path: '/login', element: <EmailLoginForm /> },
    ],
    { initialEntries: ['/login'] },
  );
  renderWithProviders(<RouterProvider router={router} />);
  return { router, bodies };
};

const fill = async (email: string, password: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox', { name: 'Email' }), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
};

describe('<EmailLoginForm>', () => {
  afterEach(() => clearAccessToken());

  it('validates before calling the API', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findAllByText('This field is required')).toHaveLength(
      2,
    );
  });

  it('stores the token and goes home on success', async () => {
    const { router, bodies } = renderForm();
    server.use(
      http.post(`${API_URL}/auth/login`, async ({ request }) => {
        bodies.push(await request.json());
        return HttpResponse.json({ access_token: 'token-1' });
      }),
    );

    await fill('teacher@example.com', 'secret123');

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(getAccessToken()).toBe('token-1');
    expect(bodies).toEqual([
      { email: 'teacher@example.com', password: 'secret123', client: 'bo' },
    ]);
  });

  it('shows invalid credentials on 401 without refreshing', async () => {
    let refreshed = false;
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json(
          { statusCode: 401, message: 'Invalid credentials' },
          { status: 401 },
        ),
      ),
      http.post(`${API_URL}/auth/refresh`, () => {
        refreshed = true;
        return HttpResponse.json({}, { status: 401 });
      }),
    );
    renderForm();

    await fill('teacher@example.com', 'wrong');

    expect(
      await screen.findByText('The email or password is incorrect.'),
    ).toBeInTheDocument();
    expect(refreshed).toBe(false);
  });

  it('explains when the account has no CMS access', async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () =>
        HttpResponse.json(
          { statusCode: 403, code: 'CMS_ACCESS_DENIED' },
          { status: 403 },
        ),
      ),
    );
    renderForm();

    await fill('student@example.com', 'secret123');

    expect(
      await screen.findByText(
        'Your account does not have access to the dashboard.',
      ),
    ).toBeInTheDocument();
  });
});
