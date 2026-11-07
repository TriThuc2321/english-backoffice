import type {
  AttemptContent,
  AttemptResult,
  GetAttemptsParams,
  GetAttemptsResponse,
} from '@/types/attempt';

import axiosInstance from '@/services/axios-instance';

const attemptApi = {
  getAll: (params: GetAttemptsParams): Promise<GetAttemptsResponse> =>
    axiosInstance.get('/attempts', { params }),
  getResult: (id: string): Promise<AttemptResult> =>
    axiosInstance.get(`/attempts/${id}/result`),
  getContent: (id: string): Promise<AttemptContent> =>
    axiosInstance.get(`/attempts/${id}/content`),
};

export default attemptApi;
