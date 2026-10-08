import { Card, Input, Label, TextField } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';
import { useNavigate, useSearchParams, type MetaFunction } from 'react-router';

import MyButton from '@/components/shared/Button';
import { TeachersTable } from '@/components/teachers';
import { useDebounce } from '@/hooks';
import { useGetTeachers } from '@/hooks/apis/teachers';
import { PermissionAction, SubjectName } from '@/types/auth';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Teachers', 'Manage teachers in the MyEnglish platform.');

export default function TeachersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetTeachers({
    page,
    take,
    keyword: debouncedSearch || undefined,
  });

  const teachers = data?.data ?? [];
  const total = data?.meta?.totalCount ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header className="flex-col justify-between gap-3 md:flex-row md:items-end">
          <TextField
            value={search}
            onChange={setSearch}
            aria-label="Search teachers"
          >
            <Label>{t('common.search')}</Label>
            <Input
              className="ml-0.5 md:w-64"
              placeholder={t('teachers.searchPlaceholder')}
            />
          </TextField>

          <MyButton
            className="self-end"
            I={PermissionAction.Create}
            a={SubjectName.Teachers}
            variant="primary"
            onPress={() => navigate('/teachers/create')}
          >
            <LuPlus className="size-4" />
            {t('teachers.createButton')}
          </MyButton>
        </Card.Header>

        <Card.Content className="p-0">
          <TeachersTable
            data={teachers}
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
