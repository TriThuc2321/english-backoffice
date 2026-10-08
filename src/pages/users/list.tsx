import { Card, Input, Label, TextField } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';
import { useNavigate, useSearchParams, type MetaFunction } from 'react-router';

import MyButton from '@/components/shared/Button';
import { UsersTable } from '@/components/users';
import { useDebounce } from '@/hooks';
import { useGetUsers } from '@/hooks/apis/users';
import { PermissionAction, SubjectName } from '@/types/auth';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () => pageMeta('Users', 'Manage CMS users.');

export default function UsersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetUsers({
    page,
    take,
    keyword: debouncedSearch || undefined,
  });

  const users = data?.data ?? [];
  const total = data?.meta?.totalCount ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header className="flex-col justify-between gap-3 md:flex-row md:items-end">
          <TextField
            value={search}
            onChange={setSearch}
            aria-label="Search users"
          >
            <Label>{t('common.search')}</Label>
            <Input
              className="ml-0.5 md:w-64"
              placeholder={t('cmsUsers.searchPlaceholder')}
            />
          </TextField>

          <MyButton
            className="self-end"
            I={PermissionAction.Create}
            a={SubjectName.Users}
            variant="primary"
            onPress={() => navigate('/users/create')}
          >
            <LuPlus className="size-4" />
            {t('cmsUsers.createButton')}
          </MyButton>
        </Card.Header>

        <Card.Content className="p-0">
          <UsersTable
            data={users}
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
