import { Button, Dropdown, Skeleton } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuEllipsisVertical, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { LevelSummary } from '@/types/level';

import MyButton from '@/components/shared/Button';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteLevel } from '@/hooks/apis/levels';
import { PermissionAction, SubjectName } from '@/types/auth';

interface LevelCardProps {
  level: LevelSummary;
  programId: string;
  deleteLevel: (ids: string[]) => void;
  isDeleting: boolean;
}

function LevelCard({
  level,
  programId,
  deleteLevel,
  isDeleting,
}: LevelCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ability = useCan();

  return (
    <div className="bg-default-50/60 flex items-start justify-between gap-3 rounded-xl border p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-default-900 truncate text-sm font-semibold">
            {level.name}
          </span>
          <span className="text-default-400 font-mono text-xs">
            {level.code}
          </span>
        </div>

        <div className="text-default-500 mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>
            {t('levels.table.displayOrder')}: {level.displayOrder}
          </span>
          {(level.ageMin != null || level.ageMax != null) && (
            <span>
              {t('levels.table.ageMin')}: {level.ageMin ?? '-'} —{' '}
              {t('levels.table.ageMax')}: {level.ageMax ?? '-'}
            </span>
          )}
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Levels}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() =>
            navigate(`/programs/${programId}/levels/${level.id}/edit`)
          }
        >
          <LuPencil className="size-4" />
        </MyButton>
        <ConfirmWrapper
          title={t('levels.deleteTitle')}
          description={t('levels.deleteConfirm', { name: level.code })}
          onConfirm={() => deleteLevel([level.id])}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Levels}
            isIconOnly
            size="sm"
            variant="outline"
            isDisabled={isDeleting}
          >
            <LuTrash2 className="text-danger size-4" />
          </MyButton>
        </ConfirmWrapper>
      </div>

      <div className="shrink-0 md:hidden">
        <Dropdown>
          <Dropdown.Trigger>
            <Button isIconOnly size="sm" variant="tertiary">
              <LuEllipsisVertical className="size-4" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="left">
            <Dropdown.Menu aria-label={t('common.actions')}>
              {ability.can(PermissionAction.Update, SubjectName.Levels) && (
                <Dropdown.Item
                  id="edit"
                  textValue={t('common.edit')}
                  onPress={() =>
                    navigate(`/programs/${programId}/levels/${level.id}/edit`)
                  }
                >
                  <span className="flex items-center gap-2">
                    <LuPencil className="size-4" />
                    {t('common.edit')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Levels) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('levels.deleteTitle')}
                    description={t('levels.deleteConfirm', {
                      name: level.code,
                    })}
                    onConfirm={() => deleteLevel([level.id])}
                  >
                    <span className="flex items-center gap-2">
                      <LuTrash2 className="size-4" />
                      {t('common.delete')}
                    </span>
                  </ConfirmWrapper>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}

interface LevelsCardsProps {
  data: LevelSummary[];
  isLoading?: boolean;
  programId: string;
}

export default function LevelsCards({
  data,
  isLoading,
  programId,
}: LevelsCardsProps) {
  const { t } = useTranslation();
  const { mutate: deleteLevel, isPending: isDeleting } = useDeleteLevel();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-default-400 rounded-xl border py-8 text-center text-sm">
        {t('common.noData')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((level) => (
        <LevelCard
          key={level.id}
          level={level}
          programId={programId}
          deleteLevel={deleteLevel}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
