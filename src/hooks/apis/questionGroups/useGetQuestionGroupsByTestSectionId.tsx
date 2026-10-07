import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useGetQuestionGroupsByTestSectionId = (testSectionId: string) =>
  useQuery({
    queryKey: [
      REACT_QUERY_KEYS.QUESTION_GROUP.BY_TEST_SECTION_ID,
      testSectionId,
    ],
    queryFn: () => questionGroupApi.getByTestSectionId(testSectionId),
    enabled: !!testSectionId,
  });

export default useGetQuestionGroupsByTestSectionId;
