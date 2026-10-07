import type { User } from '@/types/user';

import { AbilityContext } from '@/configs/casl/can.config';
import defineAbilityFor from '@/configs/casl/permissions.config';

type AccessProviderProps = {
  children: React.ReactNode;
  profile?: User;
};

export function AccessProvider({ children, profile }: AccessProviderProps) {
  return (
    <AbilityContext.Provider
      value={defineAbilityFor(profile?.role?.permissions)}
    >
      {children}
    </AbilityContext.Provider>
  );
}
