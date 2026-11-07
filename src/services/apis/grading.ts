import type {
  Assessment,
  CreateAssessmentPayload,
  GetGradingQueueParams,
  GetGradingQueueResponse,
  GradingSection,
} from '@/types/grading';

import axiosInstance from '@/services/axios-instance';

const gradingApi = {
  getQueue: (params: GetGradingQueueParams): Promise<GetGradingQueueResponse> =>
    axiosInstance.get('/grading/queue', { params }),
  getSection: (id: string): Promise<GradingSection> =>
    axiosInstance.get(`/grading/sections/${id}`),
  getAssessments: (id: string): Promise<Assessment[]> =>
    axiosInstance.get(`/grading/sections/${id}/assessments`),
  createAssessment: ({
    id,
    ...payload
  }: CreateAssessmentPayload): Promise<Assessment> =>
    axiosInstance.post(`/grading/sections/${id}/assessments`, payload),
};

export default gradingApi;
