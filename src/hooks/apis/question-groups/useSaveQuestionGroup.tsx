import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { SaveQuestionGroupPayload } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionApi, questionGroupApi } from '@/services/apis';

// Group PATCH + per-question diff, run sequentially. Removed questions go first
// so a questionType change isn't rejected because of stale answers.
const saveQuestionGroup = async ({
  groupId,
  group,
  deleteIds,
  updates,
  creates,
  order,
  originalIds,
}: SaveQuestionGroupPayload) => {
  if (deleteIds.length) await questionApi.delete(deleteIds);
  if (group) await questionGroupApi.edit(group);
  for (const update of updates) await questionApi.edit(update);

  const createdIds: number[] = [];
  for (const create of creates)
    createdIds.push((await questionApi.create(create)).id);

  let next = 0;
  const ids = order.map((id) => id ?? createdIds[next++]);
  const serverIds = [
    ...originalIds.filter((id) => !deleteIds.includes(id)),
    ...createdIds,
  ];
  if (ids.some((id, index) => id !== serverIds[index]))
    await questionApi.reorder({ groupId, ids });
};

const useSaveQuestionGroup = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: saveQuestionGroup,
    onSuccess: () => {
      toast.success(t('tests.toast.groupUpdateSuccess'));
    },
    onError: (err) => {
      toast.danger(t('tests.toast.groupUpdateError'), {
        description: err.message,
      });
    },
    // Partial failures still change data, so always refetch
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION.LIST],
      });
    },
  });
};

export default useSaveQuestionGroup;
