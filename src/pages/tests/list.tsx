import { Card, Input, Label, TextField } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';
import { useNavigate, useSearchParams, type MetaFunction } from 'react-router';

import MyButton from '@/components/shared/Button';
import FilterSelect from '@/components/shared/FilterSelect';
import { TestsTable } from '@/components/tests';
import { EMPTY_LIST } from '@/constants/common';
import { useDebounce } from '@/hooks';
import { useGetTests } from '@/hooks/apis/tests';
import { PermissionAction, SubjectName } from '@/types/auth';
import { ExamType, TestStatus, type EditableTestStatus } from '@/types/test';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Tests', 'Manage IELTS tests in the MyEnglish platform.');

const ALL = 'ALL';

const EXAM_TYPES = Object.values(ExamType);
const STATUSES: EditableTestStatus[] = [TestStatus.DRAFT, TestStatus.PUBLISHED];

export default function TestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);
  const searchParam = searchParams.get('search') ?? '';
  const examTypeParam = searchParams.get('examType');
  const statusParam = searchParams.get('status');

  const examType = EXAM_TYPES.find((v) => v === examTypeParam);
  const status = STATUSES.find((v) => v === statusParam);

  const [search, setSearch] = useState(searchParam);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const next = debouncedSearch.trim();
    if (next === searchParam) return;
    setSearchParams((prev) => {
      if (next) prev.set('search', next);
      else prev.delete('search');
      prev.set('page', '1');
      return prev;
    });
  }, [debouncedSearch, searchParam, setSearchParams]);

  const { data, isLoading } = useGetTests({
    page,
    take,
    search: searchParam || undefined,
    examType,
    status,
  });

  const tests = data?.data ?? EMPTY_LIST;
  const total = data?.meta?.totalCount ?? 0;

  const setFilter = (name: 'examType' | 'status', value: string) =>
    setSearchParams((prev) => {
      if (value === ALL) prev.delete(name);
      else prev.set(name, value);
      prev.set('page', '1');
      return prev;
    });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header className="flex-col justify-between gap-3 md:flex-row md:items-end">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <TextField
              value={search}
              onChange={setSearch}
              aria-label="Search tests"
            >
              <Label>{t('common.search')}</Label>
              <Input
                className="ml-0.5 md:w-64"
                placeholder={t('tests.searchPlaceholder')}
              />
            </TextField>

            <FilterSelect
              label={t('tests.table.examType')}
              value={examType ?? ALL}
              onChange={(value) => setFilter('examType', value)}
              options={[
                { id: ALL, label: t('tests.filters.all') },
                ...EXAM_TYPES.map((v) => ({
                  id: v,
                  label: t(`tests.examType.${v}`),
                })),
              ]}
            />

            <FilterSelect
              label={t('tests.table.publishStatus')}
              value={status ?? ALL}
              onChange={(value) => setFilter('status', value)}
              options={[
                { id: ALL, label: t('tests.filters.all') },
                ...STATUSES.map((v) => ({
                  id: v,
                  label: t(`tests.status.${v}`),
                })),
              ]}
            />
          </div>

          <MyButton
            className="self-end"
            I={PermissionAction.Create}
            a={SubjectName.Tests}
            variant="primary"
            onPress={() => navigate('/tests/create')}
          >
            <LuPlus className="size-4" />
            {t('tests.createButton')}
          </MyButton>
        </Card.Header>

        <Card.Content className="p-0">
          <TestsTable
            data={tests}
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
