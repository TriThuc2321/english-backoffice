import type { Audit, Params, Response } from '@/types/common';

import { TEST_SKILL, TEST_TYPE } from '@/constants/test';

export type TestItem = {
  id: number;
  name: string;
  type: string;
  skill: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
  audit: Audit;
};

const allTests = [
  {
    id: 1,
    name: 'Climate Change and the Inuit',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 2,
    name: 'Academic Writing Skills',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-16'),
    updatedAt: new Date('2025-01-16'),
  },
  {
    id: 3,
    name: 'Business Communication',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-17'),
    updatedAt: new Date('2025-01-17'),
  },
  {
    id: 4,
    name: 'Environmental Science',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    id: 5,
    name: 'University Lecture Series',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-19'),
  },
  {
    id: 6,
    name: 'Medical Research Methods',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: 7,
    name: 'News and Current Affairs',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-21'),
    updatedAt: new Date('2025-01-21'),
  },
  {
    id: 8,
    name: 'Technology and Innovation',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-22'),
  },
  {
    id: 9,
    name: 'Cultural Studies',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-23'),
    updatedAt: new Date('2025-01-23'),
  },
  {
    id: 10,
    name: 'Economic Theory',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-24'),
    updatedAt: new Date('2025-01-24'),
  },
  {
    id: 11,
    name: 'Social Psychology',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25'),
  },
  {
    id: 12,
    name: 'Historical Analysis',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-26'),
    updatedAt: new Date('2025-01-26'),
  },
  {
    id: 13,
    name: 'Scientific Research',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-27'),
    updatedAt: new Date('2025-01-27'),
  },
  {
    id: 14,
    name: 'Literature and Arts',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-28'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 15,
    name: 'Global Politics',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-01-29'),
    updatedAt: new Date('2025-01-29'),
  },
  {
    id: 16,
    name: 'Urban Planning',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-01-30'),
    updatedAt: new Date('2025-01-30'),
  },
  {
    id: 17,
    name: 'Educational Psychology',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 18,
    name: 'Digital Marketing',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-02'),
    updatedAt: new Date('2025-02-02'),
  },
  {
    id: 19,
    name: 'Renewable Energy',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-03'),
    updatedAt: new Date('2025-02-03'),
  },
  {
    id: 20,
    name: 'Philosophy and Ethics',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-04'),
    updatedAt: new Date('2025-02-04'),
  },
  {
    id: 21,
    name: 'International Relations',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-05'),
    updatedAt: new Date('2025-02-05'),
  },
  {
    id: 22,
    name: 'Data Science',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-06'),
    updatedAt: new Date('2025-02-06'),
  },
  {
    id: 23,
    name: 'Public Health',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-07'),
    updatedAt: new Date('2025-02-07'),
  },
  {
    id: 24,
    name: 'Artificial Intelligence',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-08'),
    updatedAt: new Date('2025-02-08'),
  },
  {
    id: 25,
    name: 'Sustainable Development',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-09'),
    updatedAt: new Date('2025-02-09'),
  },
  {
    id: 26,
    name: 'Criminal Justice',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-02-10'),
  },
  {
    id: 27,
    name: 'Media Studies',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-11'),
    updatedAt: new Date('2025-02-11'),
  },
  {
    id: 28,
    name: 'Space Exploration',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-12'),
    updatedAt: new Date('2025-02-12'),
  },
  {
    id: 29,
    name: 'Financial Markets',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-13'),
    updatedAt: new Date('2025-02-13'),
  },
  {
    id: 30,
    name: 'Human Rights',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-14'),
    updatedAt: new Date('2025-02-14'),
  },
  {
    id: 31,
    name: 'Sports Psychology',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-02-15'),
  },
  {
    id: 32,
    name: 'Cybersecurity',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-16'),
    updatedAt: new Date('2025-02-16'),
  },
  {
    id: 33,
    name: 'Climate Science',
    type: TEST_TYPE.PRACTICE_TEST,
    skill: TEST_SKILL.LISTENING,
    questionCount: 10,
    createdAt: new Date('2025-02-17'),
    updatedAt: new Date('2025-02-17'),
  },
  {
    id: 34,
    name: 'Global Economics',
    type: TEST_TYPE.FULL_TEST,
    skill: TEST_SKILL.READING,
    questionCount: 40,
    createdAt: new Date('2025-02-18'),
    updatedAt: new Date('2025-02-18'),
  },
];

export const getMockTests = (
  params?: Params,
): Promise<Response<TestItem[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page || 1;
      const take = params?.take || 10;
      const keyword = params?.keyword?.toLowerCase() || '';

      let filteredTests = allTests;
      if (keyword) {
        filteredTests = allTests.filter(
          (test) =>
            test.name.toLowerCase().includes(keyword) ||
            test.type.toLowerCase().includes(keyword) ||
            test.skill.toLowerCase().includes(keyword),
        );
      }

      const totalCount = filteredTests.length;
      const startIndex = (page - 1) * take;
      const endIndex = startIndex + take;
      const paginatedTests = filteredTests.slice(startIndex, endIndex);

      resolve({
        data: paginatedTests.map((test) => ({
          ...test,
          audit: {
            createdAt: new Date().toISOString(),
            createdBy: {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              avatar: 'https://example.com/avatar.png',
            },
            updatedAt: test.updatedAt.toISOString(),
          },
        })),
        meta: {
          page,
          take,
          totalCount,
        },
      });
    }, 100);
  });
};
