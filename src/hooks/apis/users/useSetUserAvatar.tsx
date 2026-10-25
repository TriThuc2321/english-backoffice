import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { SetUserAvatarPayload } from '@/types/user';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi, userApi } from '@/services/apis';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';
import { assertMediaFile } from '@/utils/media';

const useSetUserAvatar = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, file }: SetUserAvatarPayload) => {
      if (!file) return userApi.edit({ id, avatarMediaId: null });

      const owner = { scope: MediaScope.AVATAR, ownerId: id };
      const kind = MediaKind.IMAGE;
      assertMediaFile(t, file, owner.scope, kind);

      const { storageKey, uploadUrl, headers } = await mediaApi.getUploadUrl({
        ...owner,
        kind,
        contentType: file.type,
      });
      await mediaApi.putFile(uploadUrl, file, headers);
      const media = await mediaApi.create({ ...owner, kind, storageKey });

      return userApi.edit({ id, avatarMediaId: media.id });
    },
    onSuccess: (_, { file }) => {
      toast.success(
        t(file ? 'avatar.toast.updateSuccess' : 'avatar.toast.removeSuccess'),
      );
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CMS_USER.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CMS_USER.BY_ID],
      });
      // The edited user may be the one logged in
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.USER.PROFILE],
      });
    },
    onError: (err, { file }) => {
      toast.danger(
        t(file ? 'avatar.toast.updateError' : 'avatar.toast.removeError'),
        { description: err.message },
      );
    },
  });
};

export default useSetUserAvatar;
