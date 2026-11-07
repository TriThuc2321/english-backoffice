import { Card, Input, Label, TextField } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, type MetaFunction } from 'react-router';

import type { GradingQueueStatus, GradingSkill } from '@/types/grading';

import { GradingQueueTable } from '@/components/grading';
import FilterSelect from '@/components/shared/FilterSelect';
import { EMPTY_LIST } from '@/constants/common';
import { useDebounce } from '@/hooks';
import { useGetGradingQueue } from '@/hooks/apis/grading';
import { GradingStatus } from '@/types/grading';
import { SkillType } from '@/types/test';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta(
    'Grading',
    'Grade IELTS Writing and Speaking sections submitted by students.',
  );

const ALL = 'ALL';
const STATUSES: GradingQueueStatus[] = [
  GradingStatus.PENDING,
  GradingStatus.GRADED,
];
const SKILLS: GradingSkill[] = [SkillType.WRITING, SkillType.SPEAKING];

export default function GradingQueuePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);
  const searchParam = searchParams.get('search') ?? '';
  const status =
    STATUSES.find((v) => v === searchParams.get('status')) ??
    GradingStatus.PENDING;
  const skill = SKILLS.find((v) => v === searchParams.get('skill'));
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

  const { data, isLoading } = useGetGradingQueue({
    page,
    take,
    gradingStatus: status,
    skill,
    testId,
    search: searchParam || undefined,
  });

  const items = data?.data ?? EMPTY_LIST;
  const total = data?.meta?.totalCount ?? 0;

  const setFilter = (name: 'status' | 'skill', value: string) =>
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
            label={t('grading.field.status')}
            value={status}
            onChange={(value) => setFilter('status', value)}
            options={STATUSES.map((v) => ({
              id: v,
              label: t(`grading.status.${v}`),
            }))}
          />
          <FilterSelect
            label={t('grading.field.skill')}
            value={skill ?? ALL}
            onChange={(value) => setFilter('skill', value)}
            options={[
              { id: ALL, label: t('grading.filters.all') },
              ...SKILLS.map((v) => ({ id: v, label: t(`tests.skill.${v}`) })),
            ]}
          />
          <TextField
            value={search}
            onChange={setSearch}
            aria-label="Search students"
          >
            <Label>{t('common.search')}</Label>
            <Input
              className="ml-0.5 md:w-64"
              placeholder={t('grading.searchPlaceholder')}
            />
          </TextField>
        </Card.Header>

        <Card.Content className="p-0">
          <GradingQueueTable
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
