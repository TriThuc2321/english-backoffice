import type * as yup from 'yup';

import { describe, expect, it } from 'vitest';

import { ExamType, QuestionType, SkillType } from '@/types/test';

import type { GroupContentFormData, QuestionFormData } from './test';

import { VALIDATION_MESSAGE } from './message';
import { createTestSchema, questionGroupSchema, testPartSchema } from './test';

const validationErrors = async (
  schema: yup.AnyObjectSchema,
  value: unknown,
) => {
  try {
    await schema.validate(value, { abortEarly: false });
    return [];
  } catch (error) {
    return (error as yup.ValidationError).inner.map(({ path, message }) => ({
      path,
      message,
    }));
  }
};

describe('createTestSchema', () => {
  const base = {
    examType: ExamType.IELTS_ACADEMIC,
    title: 'Mock 1',
    slug: '',
    source: '',
  };
  const enabled = [{ skill: SkillType.READING, enabled: true }];

  it('requires at least one enabled section', async () => {
    const errors = await validationErrors(createTestSchema, {
      ...base,
      sections: [{ skill: SkillType.READING, enabled: false }],
    });

    expect(errors).toContainEqual({
      path: 'sections',
      message: VALIDATION_MESSAGE.SECTION_REQUIRED,
    });
  });

  it('accepts a test with an enabled section', async () => {
    await expect(
      createTestSchema.isValid({
        ...base,
        sections: [{ skill: SkillType.READING, enabled: true }],
      }),
    ).resolves.toBe(true);
  });

  it('rejects a blank title', async () => {
    await expect(
      createTestSchema.isValid({ ...base, title: '   ', sections: [] }),
    ).resolves.toBe(false);
  });

  it('accepts a valid slug', async () => {
    await expect(
      createTestSchema.isValid({
        ...base,
        slug: 'cambridge-18-test-1',
        sections: enabled,
      }),
    ).resolves.toBe(true);
  });

  it.each(['Bad Slug', 'trailing-', 'double--dash'])(
    'rejects the slug %j',
    async (slug) => {
      const errors = await validationErrors(createTestSchema, {
        ...base,
        slug,
        sections: enabled,
      });

      expect(errors).toContainEqual({
        path: 'slug',
        message: VALIDATION_MESSAGE.INVALID_SLUG,
      });
    },
  );
});

describe('testPartSchema', () => {
  const base = { title: '', instruction: '' };

  it('requires the audio end to be after the start', async () => {
    const errors = await validationErrors(testPartSchema, {
      ...base,
      audioStartMs: 5000,
      audioEndMs: 5000,
    });

    expect(errors).toContainEqual({
      path: 'audioEndMs',
      message: VALIDATION_MESSAGE.AUDIO_END_AFTER_START,
    });
  });

  it('allows an end without a start', async () => {
    await expect(
      testPartSchema.isValid({ ...base, audioEndMs: 1000 }),
    ).resolves.toBe(true);
  });
});

describe('questionGroupSchema', () => {
  const content = (
    overrides: Partial<GroupContentFormData> = {},
  ): GroupContentFormData => ({
    options: [],
    allowReuse: false,
    template: '',
    headers: [],
    rows: [],
    infoTitle: '',
    ...overrides,
  });

  const question = (
    overrides: Partial<QuestionFormData> = {},
  ): QuestionFormData => ({
    numberFrom: 1,
    prompt: '',
    options: [],
    key: '',
    keys: [],
    accepted: [],
    sample: '',
    rubric: [],
    explanation: '',
    evidenceQuote: '',
    ...overrides,
  });

  const group = (
    questionType: QuestionType,
    overrides: {
      content?: Partial<GroupContentFormData>;
      questions?: QuestionFormData[];
    } = {},
  ) => ({
    questionType,
    instruction: '',
    passages: [],
    content: content(overrides.content),
    questions: overrides.questions ?? [question()],
  });

  const twoOptions = [
    { key: 'A', text: 'Apple' },
    { key: 'B', text: 'Banana' },
  ];

  it('accepts a valid multiple choice group', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.MULTIPLE_CHOICE, {
        questions: [question({ options: twoOptions, key: 'A' })],
      }),
    );

    expect(errors).toEqual([]);
  });

  it('requires at least one question', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.SHORT_ANSWER, { questions: [] }),
    );

    expect(errors).toContainEqual({
      path: 'questions',
      message: VALIDATION_MESSAGE.QUESTIONS_REQUIRED,
    });
  });

  it('rejects duplicate option keys', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.MULTIPLE_CHOICE, {
        questions: [
          question({
            options: [
              { key: 'A', text: 'x' },
              { key: 'A', text: 'y' },
            ],
            key: 'A',
          }),
        ],
      }),
    );

    expect(errors).toContainEqual({
      path: 'questions.0.options',
      message: VALIDATION_MESSAGE.OPTION_KEYS_UNIQUE,
    });
  });

  it('rejects an answer that is not one of the options', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.MULTIPLE_CHOICE, {
        questions: [question({ options: twoOptions, key: 'C' })],
      }),
    );

    expect(errors).toContainEqual({
      path: 'questions.0.key',
      message: VALIDATION_MESSAGE.ANSWER_NOT_IN_OPTIONS,
    });
  });

  it('requires as many keys as the question range for multi-answer types', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.MULTIPLE_CHOICE_MULTI, {
        questions: [
          question({
            numberFrom: 1,
            numberTo: 2,
            options: twoOptions,
            keys: ['A'],
          }),
        ],
      }),
    );

    expect(errors).toContainEqual({
      path: 'questions.0.keys',
      message: VALIDATION_MESSAGE.KEYS_COUNT,
    });
  });

  it('requires a {{n}} placeholder in completion templates', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.FORM_COMPLETION, {
        content: { template: 'Name: ____' },
        questions: [question({ accepted: ['John'] })],
      }),
    );

    expect(errors).toContainEqual({
      path: 'content.template',
      message: VALIDATION_MESSAGE.PLACEHOLDER_REQUIRED,
    });
  });

  it('requires an accepted answer for free-text types', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.SHORT_ANSWER, {
        questions: [question({ accepted: ['  '] })],
      }),
    );

    expect(errors).toContainEqual({
      path: 'questions.0.accepted',
      message: VALIDATION_MESSAGE.ANSWER_REQUIRED,
    });
  });

  it('switches a summary to key answers when it has a word bank', async () => {
    const errors = await validationErrors(
      questionGroupSchema,
      group(QuestionType.SUMMARY_COMPLETION, {
        content: { template: 'The {{1}} is big', options: twoOptions },
        questions: [question({ accepted: ['cat'] })],
      }),
    );

    expect(errors).toContainEqual({
      path: 'questions.0.key',
      message: VALIDATION_MESSAGE.ANSWER_REQUIRED,
    });
  });

  it('limits the number of linked passages', async () => {
    const passages = [1, 2, 3, 4].map((id) => ({ id, title: `P${id}` }));

    await expect(
      questionGroupSchema.isValid({
        ...group(QuestionType.SHORT_ANSWER, {
          questions: [question({ accepted: ['x'] })],
        }),
        passages,
      }),
    ).resolves.toBe(false);
  });
});
