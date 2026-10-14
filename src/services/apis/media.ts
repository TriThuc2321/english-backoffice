import type {
  CreateMediaPayload,
  EditMediaPayload,
  GetMediaParams,
  GetMediaResponse,
  Media,
  UploadUrlPayload,
  UploadUrlResult,
} from '@/types/media';
import type { DeleteResponse } from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const mediaApi = {
  getAll: (params: GetMediaParams): Promise<GetMediaResponse> =>
    axiosInstance.get('/media', { params }),
  getById: (id: number): Promise<Media> => axiosInstance.get(`/media/${id}`),
  getUploadUrl: (payload: UploadUrlPayload): Promise<UploadUrlResult> =>
    axiosInstance.post('/media/upload-url', payload),
  // Straight to R2: only the presigned headers, no Authorization
  putFile: async (
    uploadUrl: string,
    file: File,
    headers: Record<string, string>,
  ): Promise<void> => {
    const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers });
    if (!res.ok) {
      throw {
        message: `Upload failed (${res.status})`,
        statusCode: res.status,
      };
    }
  },
  create: (payload: CreateMediaPayload): Promise<Media> =>
    axiosInstance.post('/media', payload),
  edit: ({ id, ...payload }: EditMediaPayload): Promise<Media> =>
    axiosInstance.patch(`/media/${id}`, payload),
  delete: (id: number): Promise<DeleteResponse> =>
    axiosInstance.delete(`/media/${id}`),
};

export default mediaApi;
