import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { User } from '@/types/user';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi, meApi } from '@/services/apis';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';
import { assertMediaFile } from '@/utils/media';

// Self-service: the API takes the user from the token, so no scope/ownerId
const useSetMyAvatar = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    // null removes the current avatar
    mutationFn: async (file: File | null) => {
      if (!file) return meApi.deleteAvatar();

      assertMediaFile(t, file, MediaScope.AVATAR, MediaKind.IMAGE);
      const { storageKey, uploadUrl, headers } = await meApi.getAvatarUploadUrl(
        { contentType: file.type },
      );
      await mediaApi.putFile(uploadUrl, file, headers);

      return meApi.setAvatar({ storageKey });
    },
    onSuccess: ({ avatar }, file) => {
      toast.success(
        t(file ? 'avatar.toast.updateSuccess' : 'avatar.toast.removeSuccess'),
      );
      queryClient.setQueryData<User>([REACT_QUERY_KEYS.USER.PROFILE], (old) =>
        old ? { ...old, avatar: avatar ?? undefined } : old,
      );
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.USER.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.USER.BY_ID],
      });
    },
    onError: (err, file) => {
      toast.danger(
        t(file ? 'avatar.toast.updateError' : 'avatar.toast.removeError'),
        { description: err.message },
      );
    },
  });
};

export default useSetMyAvatar;
