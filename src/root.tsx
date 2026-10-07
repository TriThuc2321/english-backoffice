import { Toast } from '@heroui/react';
import { StrictMode } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from 'react-router';

import './styles/index.css';

import '@/i18n';
import Loader from '@/components/shared/Loader';
import { ReactQueryProvider, ThemeProvider, LocaleProvider } from '@/providers';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <div className="bg-background flex min-h-dvh items-center justify-center">
      <Loader />
    </div>
  );
}

export default function Root() {
  return (
    <StrictMode>
      <ThemeProvider>
        <LocaleProvider>
          <ReactQueryProvider>
            <Outlet />
            <Toast.Provider placement="top end" />
          </ReactQueryProvider>
        </LocaleProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
