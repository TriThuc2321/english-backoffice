import type { RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import type { RolePermission } from '@/types/role';

import { AbilityContext } from '@/configs/casl/can.config';
import defineAbilityFor from '@/configs/casl/permissions.config';
import i18n from '@/i18n';

type ProviderOptions = {
  permissions?: RolePermission[];
  queryClient?: QueryClient;
};

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

const createWrapper = ({
  permissions = [],
  queryClient = createTestQueryClient(),
}: ProviderOptions) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AbilityContext.Provider value={defineAbilityFor(permissions)}>
            {children}
          </AbilityContext.Provider>
        </I18nextProvider>
      </QueryClientProvider>
    );
  };

export const renderWithProviders = (
  ui: ReactNode,
  {
    permissions,
    queryClient,
    ...options
  }: ProviderOptions & RenderOptions = {},
) =>
  render(ui, {
    wrapper: createWrapper({ permissions, queryClient }),
    ...options,
  });

export const renderHookWithProviders = <T,>(
  hook: () => T,
  options: ProviderOptions = {},
) => renderHook(hook, { wrapper: createWrapper(options) });
