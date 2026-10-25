import type {
  GroupContentFormData,
  OptionFormData,
  QuestionFormData,
  QuestionGroupFormData,
} from '@/schemas/test';
import type {
  CreateQuestionGroupPayload,
  EditQuestionPayload,
  Question,
  QuestionAnswer,
  QuestionContent,
  QuestionGroup,
  QuestionInput,
  QuestionType,
  SaveQuestionGroupPayload,
} from '@/types/test';

import {
  QUESTION_TYPES,
  resolveAnswerKind,
  usesWordLimit,
} from '@/constants/questionTypes';

import { byOrder } from './utils';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

export const letterAt = (index: number) => LETTERS[index] ?? String(index + 1);

export const nextOptionKey = (
  options: OptionFormData[],
  style: 'letter' | 'roman' = 'letter',
) => {
  const used = new Set(options.map((o) => o.key));
  const pool = style === 'roman' ? ROMAN : [...LETTERS];
  return pool.find((key) => !used.has(key)) ?? '';
};

const letterOptions = (count: number): OptionFormData[] =>
  Array.from({ length: count }, (_, i) => ({ key: letterAt(i), text: '' }));

const emptyToUndefined = (value: string) => value.trim() || undefined;

export const emptyContent = (): GroupContentFormData => ({
  options: [],
  allowReuse: false,
  template: '',
  headers: [],
  rows: [],
  infoTitle: '',
});

export const defaultContent = (type: QuestionType): GroupContentFormData => {
  const content = emptyContent();
  switch (QUESTION_TYPES[type].groupContent) {
    case 'matching':
      content.options =
        type === 'MATCHING_HEADINGS'
          ? ROMAN.slice(0, 2).map((key) => ({ key, text: '' }))
          : letterOptions(2);
      break;
    case 'matchingInfo':
      content.options = letterOptions(4);
      break;
    case 'labels':
      content.options = letterOptions(3);
      break;
    case 'table':
      content.headers = ['', ''];
      content.rows = [['', '']];
      break;
    case 'info':
      content.rows = [['', '']];
      break;
  }
  return content;
};

export const defaultQuestion = (
  type: QuestionType,
  numberFrom: number,
): QuestionFormData => {
  const spec = QUESTION_TYPES[type];
  const optionCount = type === 'QUESTION_RESPONSE' ? 3 : 4;
  return {
    numberFrom,
    numberTo: spec.answer === 'keys' ? numberFrom + 1 : undefined,
    prompt: '',
    options:
      spec.questionContent === 'options' ||
      spec.questionContent === 'optionsNoText'
        ? letterOptions(optionCount)
        : [],
    prepSeconds: undefined,
    responseSeconds: undefined,
    key: '',
    keys: [],
    accepted: [''],
    sample: '',
    rubric: [],
    explanation: '',
    evidenceParagraphId: undefined,
    evidenceQuote: '',
    audioMediaId: undefined,
    imageMediaId: undefined,
    audioStartMs: undefined,
  };
};

// Keep the parts of a question that make sense under any type
export const resetQuestionForType = (
  question: QuestionFormData,
  type: QuestionType,
): QuestionFormData => ({
  ...defaultQuestion(type, question.numberFrom),
  prompt: question.prompt,
  explanation: question.explanation,
  evidenceParagraphId: question.evidenceParagraphId,
  evidenceQuote: question.evidenceQuote,
  audioMediaId: question.audioMediaId,
  imageMediaId: question.imageMediaId,
  audioStartMs: question.audioStartMs,
});

/* ---------- API -> form ---------- */

type RawOption = { key?: unknown; text?: unknown };

const toOptions = (value: unknown): OptionFormData[] =>
  Array.isArray(value)
    ? (value as RawOption[]).map((o) => ({
        key: String(o.key ?? ''),
        text: o.text == null ? '' : String(o.text),
      }))
    : [];

const toStringRows = (value: unknown): string[][] =>
  Array.isArray(value)
    ? value.map((row) =>
        Array.isArray(row) ? row.map((cell) => String(cell ?? '')) : [],
      )
    : [];

const toStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];

const contentToForm = (
  content: QuestionContent | null,
): GroupContentFormData => {
  const c = (content ?? {}) as Record<string, unknown>;
  const table = (c.table ?? {}) as Record<string, unknown>;
  const info = (c.info ?? {}) as Record<string, unknown>;
  return {
    options: toOptions(c.options),
    allowReuse: !!c.allowReuse,
    template: typeof c.template === 'string' ? c.template : '',
    headers: toStrings(table.headers),
    rows: toStringRows(c.table ? table.rows : info.rows),
    infoTitle: typeof info.title === 'string' ? info.title : '',
  };
};

export const questionToForm = (question: Question): QuestionFormData => {
  const content = (question.content ?? {}) as Record<string, unknown>;
  const answer = question.answer as Record<string, unknown>;
  const rubric = (answer.rubric ?? {}) as Record<string, unknown>;
  const accepted = toStrings(answer.accepted);
  return {
    id: question.id,
    numberFrom: question.numberFrom,
    numberTo: question.numberTo,
    prompt: question.prompt ?? '',
    options: toOptions(content.options),
    prepSeconds:
      typeof content.prepSeconds === 'number' ? content.prepSeconds : undefined,
    responseSeconds:
      typeof content.responseSeconds === 'number'
        ? content.responseSeconds
        : undefined,
    key: typeof answer.key === 'string' ? answer.key : '',
    keys: toStrings(answer.keys),
    accepted: accepted.length ? accepted : [''],
    sample: typeof answer.sample === 'string' ? answer.sample : '',
    rubric: Object.entries(rubric).map(([name, value]) => ({
      name,
      value: String(value),
    })),
    explanation: question.explanation ?? '',
    evidenceParagraphId: question.evidence?.paragraphId,
    evidenceQuote: question.evidence?.quote ?? '',
    audioMediaId: question.audioMediaId ?? undefined,
    imageMediaId: question.imageMediaId ?? undefined,
    audioStartMs: question.audioStartMs ?? undefined,
  };
};

export const groupToForm = (group: QuestionGroup): QuestionGroupFormData => ({
  questionType: group.questionType,
  instruction: group.instruction ?? '',
  wordLimit: group.wordLimit ?? undefined,
  audioMediaId: group.audioMediaId ?? undefined,
  imageMediaId: group.imageMediaId ?? undefined,
  passages: byOrder(group.groupPassages).map((gp) => ({
    id: gp.passage.id,
    title: gp.passage.title,
  })),
  content: contentToForm(group.content),
  questions: byOrder(group.questions ?? []).map(questionToForm),
});

export const newGroupForm = (
  type: QuestionType,
  firstNumber: number,
): QuestionGroupFormData => ({
  questionType: type,
  instruction: '',
  wordLimit: undefined,
  audioMediaId: undefined,
  imageMediaId: undefined,
  passages: [],
  content: defaultContent(type),
  questions: [defaultQuestion(type, firstNumber)],
});

/* ---------- form -> API ---------- */

const cleanOptions = (options: OptionFormData[], withText: boolean) =>
  options.map((o) =>
    withText || o.text.trim()
      ? { key: o.key.trim(), text: o.text.trim() }
      : { key: o.key.trim() },
  );

const groupContentPayload = (
  values: QuestionGroupFormData,
): QuestionContent | undefined => {
  const { content } = values;
  const kind = QUESTION_TYPES[values.questionType].groupContent;
  switch (kind) {
    case 'matching':
    case 'matchingInfo':
      return {
        options: cleanOptions(content.options, kind === 'matching'),
        ...(content.allowReuse && { allowReuse: true }),
      };
    case 'labels':
      return { options: content.options.map((o) => ({ key: o.key.trim() })) };
    case 'template':
      return { template: content.template };
    case 'templateOptional':
      return content.template.trim()
        ? { template: content.template }
        : undefined;
    case 'summary':
      return {
        template: content.template,
        ...(content.options.length && {
          options: cleanOptions(content.options, true),
        }),
      };
    case 'table':
      return {
        table: {
          ...(content.headers.some((h) => h.trim()) && {
            headers: content.headers,
          }),
          rows: content.rows,
        },
      };
    case 'info':
      return {
        info: {
          ...(content.infoTitle.trim() && { title: content.infoTitle.trim() }),
          rows: content.rows,
        },
      };
    default:
      return undefined;
  }
};

const questionContentPayload = (
  type: QuestionType,
  q: QuestionFormData,
): QuestionContent | undefined => {
  switch (QUESTION_TYPES[type].questionContent) {
    case 'options':
      return { options: cleanOptions(q.options, true) };
    case 'optionsNoText':
      return { options: q.options.map((o) => ({ key: o.key.trim() })) };
    case 'timing':
      if (q.prepSeconds == null && q.responseSeconds == null) return undefined;
      return {
        ...(q.prepSeconds != null && { prepSeconds: q.prepSeconds }),
        ...(q.responseSeconds != null && {
          responseSeconds: q.responseSeconds,
        }),
      };
    default:
      return undefined;
  }
};

const answerPayload = (
  values: QuestionGroupFormData,
  q: QuestionFormData,
): QuestionAnswer => {
  const spec = QUESTION_TYPES[values.questionType];
  switch (resolveAnswerKind(spec, values.content)) {
    case 'key':
      return { key: q.key };
    case 'keys':
      return { keys: q.keys };
    case 'accepted':
      return { accepted: q.accepted.map((a) => a.trim()).filter(Boolean) };
    case 'sample': {
      const rubric = q.rubric.filter((r) => r.name.trim());
      return {
        sample: q.sample,
        ...(rubric.length && {
          rubric: Object.fromEntries(
            rubric.map((r) => [r.name.trim(), r.value]),
          ),
        }),
      };
    }
  }
};

const evidencePayload = (q: QuestionFormData) => {
  const quote = q.evidenceQuote.trim();
  if (q.evidenceParagraphId == null && !quote) return undefined;
  return {
    ...(q.evidenceParagraphId != null && {
      paragraphId: q.evidenceParagraphId,
    }),
    ...(quote && { quote }),
  };
};

const questionPayload = (
  values: QuestionGroupFormData,
  q: QuestionFormData,
): QuestionInput => {
  const isRange = QUESTION_TYPES[values.questionType].answer === 'keys';
  return {
    numberFrom: q.numberFrom,
    // Only `keys` answers may span a range
    numberTo: isRange ? (q.numberTo ?? q.numberFrom) : q.numberFrom,
    prompt: emptyToUndefined(q.prompt),
    content: questionContentPayload(values.questionType, q),
    answer: answerPayload(values, q),
    explanation: emptyToUndefined(q.explanation),
    evidence: evidencePayload(q),
    audioMediaId: q.audioMediaId,
    imageMediaId: q.imageMediaId,
    audioStartMs: q.audioStartMs,
  };
};

const groupFields = (values: QuestionGroupFormData) => {
  const spec = QUESTION_TYPES[values.questionType];
  return {
    questionType: values.questionType,
    instruction: emptyToUndefined(values.instruction),
    wordLimit: usesWordLimit(spec) ? values.wordLimit : undefined,
    content: groupContentPayload(values),
    audioMediaId: values.audioMediaId,
    imageMediaId: values.imageMediaId,
    passageIds: values.passages.map((p) => p.id),
  };
};

// PATCH: send null instead of undefined so cleared fields are removed
const withNulls = <T extends object>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v]),
  ) as { [K in keyof T]: Exclude<T[K], undefined> | null };

export const toCreateGroupPayload = (
  partId: number,
  values: QuestionGroupFormData,
): CreateQuestionGroupPayload => ({
  partId,
  ...groupFields(values),
  questions: values.questions.map((q) => questionPayload(values, q)),
});

// Structural equality; keys holding `undefined` count as absent, since
// they're never sent to the API
const same = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((item, i) => same(item, b[i]));

  const definedKeys = (obj: object) =>
    Object.entries(obj).flatMap(([k, v]) => (v === undefined ? [] : [k]));
  const aKeys = definedKeys(a);
  if (aKeys.length !== definedKeys(b).length) return false;
  return aKeys.every((k) =>
    same((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
  );
};

export const toSaveGroupPayload = (
  group: QuestionGroup,
  values: QuestionGroupFormData,
  isLocked: boolean,
): SaveQuestionGroupPayload => {
  const original = groupToForm(group);
  const originalById = new Map(
    original.questions.map((q) => [q.id!, questionPayload(original, q)]),
  );
  const keptIds = new Set(
    values.questions.flatMap((q) => (q.id ? [q.id] : [])),
  );

  const updates: EditQuestionPayload[] = [];
  const creates: SaveQuestionGroupPayload['creates'] = [];
  values.questions.forEach((q) => {
    const payload = questionPayload(values, q);
    if (!q.id) {
      creates.push({ groupId: group.id, ...payload });
      return;
    }
    if (same(payload, originalById.get(q.id))) return;
    // Locked test: only the answer key can be fixed
    updates.push(
      isLocked
        ? {
            id: q.id,
            ...withNulls({
              answer: payload.answer,
              explanation: payload.explanation,
              evidence: payload.evidence,
            }),
          }
        : { id: q.id, ...withNulls(payload) },
    );
  });

  const nextGroup = groupFields(values);
  const groupChanged = !same(nextGroup, groupFields(original));

  return {
    groupId: group.id,
    typeChanged: !isLocked && values.questionType !== group.questionType,
    group:
      !isLocked && groupChanged
        ? { id: group.id, ...withNulls(nextGroup) }
        : undefined,
    deleteIds: [...originalById.keys()].filter((id) => !keptIds.has(id)),
    updates,
    creates,
    order: values.questions.map((q) => q.id ?? null),
    originalIds: original.questions.map((q) => q.id!),
  };
};

export const groupRange = ({
  numberFrom,
  numberTo,
}: Pick<QuestionGroup, 'numberFrom' | 'numberTo'>) =>
  numberFrom === null || numberTo === null
    ? undefined
    : { from: numberFrom, to: numberTo };
