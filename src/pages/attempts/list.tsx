import { Button, Card, Input, Label, TextField } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';
import { useSearchParams, type MetaFunction } from 'react-router';

import { AttemptsTable } from '@/components/attempts';
import FilterSelect from '@/components/shared/FilterSelect';
import { EMPTY_LIST } from '@/constants/common';
import { useDebounce } from '@/hooks';
import { useGetAttempts } from '@/hooks/apis/attempts';
import { AttemptStatus } from '@/types/attempt';
import { ExamType } from '@/types/test';
import { formatPersonName } from '@/utils/common';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Student Results', 'Browse the test attempts of every student.');

const ALL = 'ALL';
const STATUSES = Object.values(AttemptStatus);
const EXAM_TYPES = Object.values(ExamType);

export default function AttemptsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);
  const searchParam = searchParams.get('search') ?? '';
  const status = STATUSES.find((v) => v === searchParams.get('status'));
  const examType = EXAM_TYPES.find((v) => v === searchParams.get('examType'));
  const userId = searchParams.get('userId') ?? undefined;
  const testId = Number(searchParams.get('testId')) || undefined;

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

  const { data, isLoading } = useGetAttempts({
    page,
    take,
    status,
    examType,
    userId,
    testId,
    search: searchParam || undefined,
  });

  const items = data?.data ?? EMPTY_LIST;
  const total = data?.meta?.totalCount ?? 0;
  const filteredStudent = userId
    ? items.find((a) => a.student.id === userId)?.student
    : undefined;

  const setFilter = (name: string, value: string) =>
    setSearchParams((prev) => {
      if (value === ALL) prev.delete(name);
      else prev.set(name, value);
      prev.set('page', '1');
      return prev;
    });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header className="flex-col gap-3 md:flex-row md:items-end">
          <FilterSelect
            label={t('attempts.field.status')}
            value={status ?? ALL}
            onChange={(value) => setFilter('status', value)}
            options={[
              { id: ALL, label: t('attempts.filters.all') },
              ...STATUSES.map((v) => ({
                id: v,
                label: t(`attempts.status.${v}`),
              })),
            ]}
          />
          <FilterSelect
            label={t('attempts.field.examType')}
            value={examType ?? ALL}
            onChange={(value) => setFilter('examType', value)}
            options={[
              { id: ALL, label: t('attempts.filters.all') },
              ...EXAM_TYPES.map((v) => ({
                id: v,
                label: t(`tests.examType.${v}`),
              })),
            ]}
          />
          {userId ? (
            <Button
              variant="secondary"
              onPress={() => setFilter('userId', ALL)}
            >
              {t('attempts.filters.student', {
                name: filteredStudent
                  ? formatPersonName(filteredStudent)
                  : t('attempts.filters.selectedStudent'),
              })}
              <LuX className="size-4" />
            </Button>
          ) : (
            <TextField
              value={search}
              onChange={setSearch}
              aria-label="Search students"
            >
              <Label>{t('common.search')}</Label>
              <Input
                className="ml-0.5 md:w-64"
                placeholder={t('attempts.searchPlaceholder')}
              />
            </TextField>
          )}
        </Card.Header>

        <Card.Content className="p-0">
          <AttemptsTable
            data={items}
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
