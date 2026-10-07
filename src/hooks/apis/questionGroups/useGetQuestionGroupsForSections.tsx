import { useQueries } from '@tanstack/react-query';

import type { QuestionGroup } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useGetQuestionGroupsForSections = (testSectionIds: string[]) =>
  useQueries({
    queries: testSectionIds.map((testSectionId) => ({
      queryKey: [
        REACT_QUERY_KEYS.QUESTION_GROUP.BY_TEST_SECTION_ID,
        testSectionId,
      ],
      queryFn: () => questionGroupApi.getByTestSectionId(testSectionId),
      enabled: !!testSectionId,
    })),
    combine: (results) => ({
      groupsBySection: testSectionIds.reduce<Record<string, QuestionGroup[]>>(
        (acc, id, index) => {
          acc[id] = results[index]?.data ?? [];
          return acc;
        },
        {},
      ),
      isLoading: results.some((r) => r.isLoading),
    }),
  });

export default useGetQuestionGroupsForSections;
