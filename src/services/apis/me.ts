import type {
  MyAvatarResponse,
  MyAvatarUploadUrlPayload,
  SetMyAvatarPayload,
  UploadUrlResult,
} from '@/types/media';

import axiosInstance from '@/services/axios-instance';

const meApi = {
  getAvatarUploadUrl: (
    payload: MyAvatarUploadUrlPayload,
  ): Promise<UploadUrlResult> =>
    axiosInstance.post('/me/avatar/upload-url', payload),
  setAvatar: (payload: SetMyAvatarPayload): Promise<MyAvatarResponse> =>
    axiosInstance.put('/me/avatar', payload),
  deleteAvatar: (): Promise<MyAvatarResponse> =>
    axiosInstance.delete('/me/avatar'),
};

export default meApi;
