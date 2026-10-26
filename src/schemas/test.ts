import * as yup from 'yup';

import {
  extractPlaceholders,
  getKeyOptions,
  MAX_GROUP_PASSAGES,
  QUESTION_TYPES,
  resolveAnswerKind,
} from '@/constants/questionTypes';
import { ExamType, QuestionType, SkillType } from '@/types/test';

import type { InferFormInput } from './types';

import { VALIDATION_MESSAGE } from './message';

export const createTestSchema = yup.object().shape({
  examType: yup
    .mixed<ExamType>()
    .oneOf(Object.values(ExamType))
    .required(VALIDATION_MESSAGE.REQUIRED),
  title: yup.string().trim().required(VALIDATION_MESSAGE.REQUIRED).max(255),
  source: yup.string().max(255).defined(),
  durationMinutes: yup.number().integer().min(1).optional(),
  sections: yup
    .array()
    .of(
      yup.object().shape({
        skill: yup
          .mixed<SkillType>()
          .oneOf(Object.values(SkillType))
          .required(),
        enabled: yup.boolean().required(),
        durationMinutes: yup.number().integer().min(1).optional(),
      }),
    )
    .defined()
    .test(
      'at-least-one-section',
      VALIDATION_MESSAGE.SECTION_REQUIRED,
      (sections) => sections.some((section) => section.enabled),
    ),
});

export type CreateTestFormInput = InferFormInput<typeof createTestSchema>;
export type CreateTestFormData = yup.InferType<typeof createTestSchema>;

export const editTestSchema = yup.object().shape({
  examType: yup
    .mixed<ExamType>()
    .oneOf(Object.values(ExamType))
    .required(VALIDATION_MESSAGE.REQUIRED),
  title: yup.string().trim().required(VALIDATION_MESSAGE.REQUIRED).max(255),
  source: yup.string().max(255).defined(),
  durationMinutes: yup.number().integer().min(1).optional(),
});

export type EditTestFormInput = InferFormInput<typeof editTestSchema>;
export type EditTestFormData = yup.InferType<typeof editTestSchema>;

export const testSectionSchema = yup.object().shape({
  skill: yup
    .mixed<SkillType>()
    .oneOf(Object.values(SkillType))
    .required(VALIDATION_MESSAGE.REQUIRED),
  durationMinutes: yup.number().integer().min(1).optional(),
});

export type TestSectionFormInput = InferFormInput<typeof testSectionSchema>;
export type TestSectionFormData = yup.InferType<typeof testSectionSchema>;

const optionalInt = (min: number) => yup.number().integer().min(min).optional();

export const testPartSchema = yup.object().shape({
  title: yup.string().max(255).defined(),
  instruction: yup.string().defined(),
  audioMediaId: optionalInt(1),
  audioStartMs: optionalInt(0),
  audioEndMs: optionalInt(0).test(
    'after-start',
    VALIDATION_MESSAGE.AUDIO_END_AFTER_START,
    (end, ctx) => {
      const start = ctx.parent.audioStartMs as number | undefined;
      return end == null || start == null || end > start;
    },
  ),
  passage: yup
    .object({ id: yup.number().required(), title: yup.string().defined() })
    .optional()
    .default(undefined),
});

export type TestPartFormInput = InferFormInput<typeof testPartSchema>;
export type TestPartFormData = yup.InferType<typeof testPartSchema>;

const optionSchema = yup.object().shape({
  key: yup.string().defined(),
  text: yup.string().defined(),
});

const stringList = () => yup.array().of(yup.string().defined()).defined();

// One flat shape for every question type; the registry decides which fields
// are used (see src/constants/questionTypes.ts)
export const questionFormSchema = yup.object().shape({
  id: yup.number().optional(),
  numberFrom: yup
    .number()
    .integer()
    .min(1)
    .required(VALIDATION_MESSAGE.REQUIRED),
  numberTo: optionalInt(1),
  prompt: yup.string().defined(),
  options: yup.array().of(optionSchema).defined(),
  prepSeconds: optionalInt(0),
  responseSeconds: optionalInt(0),
  key: yup.string().defined(),
  keys: stringList(),
  accepted: stringList(),
  sample: yup.string().defined(),
  rubric: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().defined(),
        value: yup.string().defined(),
      }),
    )
    .defined(),
  explanation: yup.string().defined(),
  evidenceParagraphId: yup.number().optional(),
  evidenceQuote: yup.string().defined(),
  audioMediaId: optionalInt(1),
  imageMediaId: optionalInt(1),
  audioStartMs: optionalInt(0),
});

export type QuestionFormData = yup.InferType<typeof questionFormSchema>;

export const groupContentFormSchema = yup.object().shape({
  options: yup.array().of(optionSchema).defined(),
  allowReuse: yup.boolean().defined(),
  template: yup.string().defined(),
  headers: stringList(),
  rows: yup.array().of(stringList()).defined(),
  infoTitle: yup.string().defined(),
});

export type GroupContentFormData = yup.InferType<typeof groupContentFormSchema>;
export type OptionFormData = yup.InferType<typeof optionSchema>;

type GroupRuleValues = {
  questionType: QuestionType;
  content: GroupContentFormData;
  questions: QuestionFormData[];
};

const checkOptions = (
  options: OptionFormData[],
  withText: boolean,
  path: string,
) => {
  const errors: yup.ValidationError[] = [];
  const keys = options.map((o) => o.key.trim());
  if (options.length < 2)
    errors.push(
      new yup.ValidationError(VALIDATION_MESSAGE.OPTIONS_MIN, options, path),
    );
  else if (keys.some((k) => !k) || new Set(keys).size !== keys.length)
    errors.push(
      new yup.ValidationError(
        VALIDATION_MESSAGE.OPTION_KEYS_UNIQUE,
        options,
        path,
      ),
    );
  else if (withText && options.some((o) => !o.text.trim()))
    errors.push(
      new yup.ValidationError(
        VALIDATION_MESSAGE.OPTION_TEXT_REQUIRED,
        options,
        path,
      ),
    );
  return errors;
};

// Mirrors english-service/docs/question-formats.md; the API stays the source of truth
const validateGroupRules = (values: GroupRuleValues) => {
  const spec = QUESTION_TYPES[values.questionType];
  const { content, questions } = values;
  const errors: yup.ValidationError[] = [];
  const err = (message: string, path: string) =>
    errors.push(new yup.ValidationError(message, undefined, path));

  switch (spec.groupContent) {
    case 'matching':
    case 'matchingInfo':
    case 'labels':
      errors.push(
        ...checkOptions(
          content.options,
          spec.groupContent === 'matching',
          'content.options',
        ),
      );
      break;
    case 'summary':
      if (content.options.length)
        errors.push(...checkOptions(content.options, true, 'content.options'));
      if (!extractPlaceholders(content.template).length)
        err(VALIDATION_MESSAGE.PLACEHOLDER_REQUIRED, 'content.template');
      break;
    case 'template':
      if (!extractPlaceholders(content.template).length)
        err(VALIDATION_MESSAGE.PLACEHOLDER_REQUIRED, 'content.template');
      break;
    case 'templateOptional':
      if (
        content.template.trim() &&
        !extractPlaceholders(content.template).length
      )
        err(VALIDATION_MESSAGE.PLACEHOLDER_REQUIRED, 'content.template');
      break;
    case 'table':
      if (!content.rows.length)
        err(VALIDATION_MESSAGE.ROWS_REQUIRED, 'content.rows');
      else if (!extractPlaceholders(content.rows.flat().join(' ')).length)
        err(VALIDATION_MESSAGE.PLACEHOLDER_REQUIRED, 'content.rows');
      break;
    case 'info':
      if (!content.rows.length)
        err(VALIDATION_MESSAGE.ROWS_REQUIRED, 'content.rows');
      break;
  }

  if (!questions.length)
    err(VALIDATION_MESSAGE.QUESTIONS_REQUIRED, 'questions');

  const answerKind = resolveAnswerKind(spec, content);
  questions.forEach((q, i) => {
    const path = `questions.${i}`;
    if (
      spec.questionContent === 'options' ||
      spec.questionContent === 'optionsNoText'
    )
      errors.push(
        ...checkOptions(
          q.options,
          spec.questionContent === 'options',
          `${path}.options`,
        ),
      );

    const keyOptions = getKeyOptions(spec, content, q);
    switch (answerKind) {
      case 'key':
        if (!q.key) err(VALIDATION_MESSAGE.ANSWER_REQUIRED, `${path}.key`);
        else if (keyOptions.length && !keyOptions.includes(q.key))
          err(VALIDATION_MESSAGE.ANSWER_NOT_IN_OPTIONS, `${path}.key`);
        break;
      case 'keys': {
        const to = q.numberTo ?? q.numberFrom;
        if (to < q.numberFrom)
          err(VALIDATION_MESSAGE.NUMBER_TO_MIN, `${path}.numberTo`);
        else if (q.keys.length !== to - q.numberFrom + 1)
          err(VALIDATION_MESSAGE.KEYS_COUNT, `${path}.keys`);
        else if (q.keys.some((k) => !keyOptions.includes(k)))
          err(VALIDATION_MESSAGE.ANSWER_NOT_IN_OPTIONS, `${path}.keys`);
        break;
      }
      case 'accepted':
        if (!q.accepted.some((a) => a.trim()))
          err(VALIDATION_MESSAGE.ANSWER_REQUIRED, `${path}.accepted`);
        break;
      case 'sample':
        if (!q.sample.trim())
          err(VALIDATION_MESSAGE.ANSWER_REQUIRED, `${path}.sample`);
        break;
    }
  });

  return errors;
};

export const questionGroupSchema = yup
  .object()
  .shape({
    questionType: yup
      .mixed<QuestionType>()
      .oneOf(Object.values(QuestionType))
      .required(VALIDATION_MESSAGE.REQUIRED),
    instruction: yup.string().defined(),
    wordLimit: optionalInt(1),
    audioMediaId: optionalInt(1),
    imageMediaId: optionalInt(1),
    passages: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.number().required(),
          title: yup.string().defined(),
        }),
      )
      .max(MAX_GROUP_PASSAGES)
      .defined(),
    content: groupContentFormSchema,
    questions: yup.array().of(questionFormSchema).defined(),
  })
  .test('question-type-rules', function (values) {
    const errors = validateGroupRules(values as GroupRuleValues);
    return errors.length ? new yup.ValidationError(errors) : true;
  });

export type QuestionGroupFormInput = InferFormInput<typeof questionGroupSchema>;
export type QuestionGroupFormData = yup.InferType<typeof questionGroupSchema>;
