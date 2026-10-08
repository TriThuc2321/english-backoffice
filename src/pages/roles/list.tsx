import { Card, Input, Label, TextField } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';
import { useNavigate, useSearchParams, type MetaFunction } from 'react-router';

import { RolesTable } from '@/components/roles';
import MyButton from '@/components/shared/Button';
import { useDebounce } from '@/hooks';
import { useGetRoles } from '@/hooks/apis/roles';
import { PermissionAction, SubjectName } from '@/types/auth';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Roles', 'Configure roles and permissions for MyEnglish users.');

export default function RolesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetRoles({
    page,
    take,
    keyword: debouncedSearch || undefined,
  });

  const roles = data?.data ?? [];
  const total = data?.meta?.totalCount ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header className="flex-col justify-between gap-3 md:flex-row md:items-end">
          <TextField
            value={search}
            onChange={setSearch}
            aria-label="Search roles"
          >
            <Label>{t('common.search')}</Label>
            <Input
              className="ml-0.5 md:w-64"
              placeholder={t('roles.searchPlaceholder')}
            />
          </TextField>

          <MyButton
            className="self-end"
            I={PermissionAction.Create}
            a={SubjectName.Roles}
            variant="primary"
            onPress={() => navigate('/roles/create')}
          >
            <LuPlus className="size-4" />
            {t('roles.createButton')}
          </MyButton>
        </Card.Header>

        <Card.Content className="p-0">
          <RolesTable
            data={roles}
            isLoading={isLoading}
            page={page}
            take={take}
            total={total}
          />
        </Card.Content>
      </Card>
    </div>
  );
}
