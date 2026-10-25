import { useMemo } from 'react';

import type { User } from '@/types/user';

import { AbilityContext } from '@/configs/casl/can.config';
import defineAbilityFor from '@/configs/casl/permissions.config';

type AccessProviderProps = {
  children: React.ReactNode;
  profile?: User;
};

export function AccessProvider({ children, profile }: AccessProviderProps) {
  const permissions = profile?.role?.permissions;

  const ability = useMemo(() => defineAbilityFor(permissions), [permissions]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
