import { AbilityBuilder, createMongoAbility } from '@casl/ability';

import type { RolePermission } from '@/types/role';

export default function defineAbilityFor(permissions: RolePermission[] = []) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  permissions.forEach(({ action, subject }) => {
    can(action!, subject!);
  });

  return build();
}
