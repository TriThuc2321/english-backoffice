import {
  Button,
  Chip,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuTriangleAlert, LuX } from 'react-icons/lu';

import type { Question, QuestionGroup, TestSection } from '@/types/test';
import type { DiagramLayout } from '@/types/test';

import MyButton from '@/components/shared/Button';
import { useGetPassageById } from '@/hooks/apis/passages';
import { useEditQuestionGroup } from '@/hooks/apis/questionGroups';
import { PermissionAction, SubjectName } from '@/types/auth';
import { QuestionType } from '@/types/test';

import { QUESTION_TYPES } from '../constants';
import {
  defaultQuestion,
  getQuestionRanges,
  isQuestionValid,
  paragraphLabels,
  toEditPayload,
} from '../utils';
import DiagramForm, { DiagramGroupFields } from './forms/DiagramForm';
import MatchingForm from './forms/MatchingForm';
import McqForm from './forms/McqForm';
import NoteHintForm from './forms/NoteHintForm';
import NoteNoHintForm from './forms/NoteNoHintForm';
import TfnForm from './forms/TfnForm';
import QuestionTabs from './QuestionTabs';
import WordBankInput from './WordBankInput';

type DraftQuestion = Question<any>;

type Draft = {
  id: string;
  guideline: string;
  questionType: QuestionType;
  questions: DraftQuestion[];
};

const initDraft = (group: QuestionGroup): Draft => {
  const questions = [...(group.questions as DraftQuestion[])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((question) => structuredClone(question));

  return {
    id: group.id,
    guideline: group.guideline ?? '',
    questionType: group.questionType,
    questions:
      questions.length > 0 ? questions : [defaultQuestion(group.questionType)],
  };
};

type QuestionGroupEditorProps = {
  group: QuestionGroup;
  section: TestSection | null;
  startNumber: number;
  onSaved: () => void;
  onCancel: () => void;
  onDirty: (dirty: boolean) => void;
};

const QuestionGroupEditor = ({
  group,
  section,
  startNumber,
  onSaved,
  onCancel,
  onDirty,
}: QuestionGroupEditorProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<Draft>(() => initDraft(group));
  const [wordBank, setWordBank] = useState<string[]>(() =>
    group.questionType === QuestionType.NOTE_COMPLETION_WITH_HINT
      ? ((group.questions[0]?.content as { wordBank?: string[] })?.wordBank ??
        [])
      : [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [pendingType, setPendingType] = useState<QuestionType | null>(null);

  const { mutate: editGroup, isPending: isSaving } = useEditQuestionGroup();

  const isMatching = draft.questionType === QuestionType.MATCHING_PARAGRAPH;
  const isDiagram =
    draft.questionType === QuestionType.DIAGRAM_LABEL_COMPLETION;
  const isNoteHint =
    draft.questionType === QuestionType.NOTE_COMPLETION_WITH_HINT;

  const passageId = isMatching
    ? (section?.passageId ?? section?.passage?.id ?? '')
    : '';
  const { data: passage } = useGetPassageById(passageId);
  const labels = paragraphLabels(
    passage?.markedBy,
    passage?.paragraphs?.length ?? 0,
  );

  const markDirty = () => {
    setDirty(true);
    onDirty(true);
  };

  const patchQuestion = (index: number, content: any) => {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((question, i) =>
        i === index ? { ...question, content } : question,
      ),
    }));
    markDirty();
  };

  const patchAllQuestions = (patch: Record<string, unknown>) => {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((question) => ({
        ...question,
        content: { ...question.content, ...patch },
      })),
    }));
    markDirty();
  };

  const addQuestion = () => {
    setDraft((prev) => {
      const first = prev.questions[0]?.content as
        | { imageUrl?: string; layout?: DiagramLayout }
        | undefined;
      const seed = isDiagram
        ? { imageUrl: first?.imageUrl, layout: first?.layout }
        : isNoteHint
          ? { wordBank }
          : undefined;
      return {
        ...prev,
        questions: [
          ...prev.questions,
          defaultQuestion(prev.questionType, prev.questions.length, seed),
        ],
      };
    });
    setActiveIndex(draft.questions.length);
    markDirty();
  };

  const removeQuestion = (index: number) => {
    if (draft.questions.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    setActiveIndex((prev) => Math.max(0, Math.min(prev, index - 1)));
    markDirty();
  };

  const applyTypeChange = (type: QuestionType) => {
    setDraft((prev) => ({
      ...prev,
      questionType: type,
      questions: [defaultQuestion(type)],
    }));
    setWordBank([]);
    setActiveIndex(0);
    setPendingType(null);
    markDirty();
  };

  const invalidIndexes = draft.questions
    .map((question, index) =>
      isQuestionValid(draft.questionType, question.content, wordBank)
        ? -1
        : index,
    )
    .filter((index) => index >= 0);
  const wordBankOK = !isNoteHint || wordBank.length > 0;
  const isValid =
    draft.questions.length > 0 && invalidIndexes.length === 0 && wordBankOK;
  const questionRanges = getQuestionRanges(
    draft.questionType,
    draft.questions,
    startNumber,
  );
  const questionCount = questionRanges.reduce(
    (total, range) => total + range.count,
    0,
  );

  const handleSave = () => {
    const stamped = isNoteHint
      ? {
          ...draft,
          questions: draft.questions.map((question) => ({
            ...question,
            content: { ...question.content, wordBank },
          })),
        }
      : draft;

    editGroup(toEditPayload(stamped as unknown as QuestionGroup), {
      onSuccess: () => {
        setDirty(false);
        onDirty(false);
        onSaved();
      },
    });
  };

  const activeQuestion = draft.questions[activeIndex];

  const renderSubForm = () => {
    if (!activeQuestion) return null;
    const content = activeQuestion.content as any;
    const onChange = (next: any) => patchQuestion(activeIndex, next);

    switch (draft.questionType) {
      case QuestionType.SINGLE_ANSWER:
        return (
          <McqForm content={content} isMultiple={false} onChange={onChange} />
        );
      case QuestionType.MULTIPLE_ANSWER:
        return (
          <McqForm content={content} isMultiple={true} onChange={onChange} />
        );
      case QuestionType.TFN_ANSWER:
        return (
          <TfnForm
            content={content}
            values={['TRUE', 'FALSE', 'NOT_GIVEN']}
            onChange={onChange}
          />
        );
      case QuestionType.YNN_ANSWER:
        return (
          <TfnForm
            content={content}
            values={['YES', 'NO', 'NOT_GIVEN']}
            onChange={onChange}
          />
        );
      case QuestionType.MATCHING_PARAGRAPH:
        return (
          <MatchingForm content={content} labels={labels} onChange={onChange} />
        );
      case QuestionType.NOTE_COMPLETION_WITH_HINT:
        return (
          <NoteHintForm
            content={content}
            wordBank={wordBank}
            onChange={onChange}
          />
        );
      case QuestionType.NOTE_COMPLETION_NO_HINT:
        return <NoteNoHintForm content={content} onChange={onChange} />;
      case QuestionType.DIAGRAM_LABEL_COMPLETION:
        return <DiagramForm content={content} onChange={onChange} />;
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-default-900 text-sm font-semibold">
            {t('tests.builder.editor.title')}
          </h3>
          {dirty && (
            <Chip size="sm" variant="soft" color="warning">
              <Chip.Label>{t('tests.builder.editor.unsaved')}</Chip.Label>
            </Chip>
          )}
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="ml-auto"
            onPress={onCancel}
            aria-label={t('tests.builder.editor.cancel')}
          >
            <LuX className="size-4" />
          </Button>
        </div>

        <Select
          fullWidth
          aria-label={t('tests.builder.editor.type')}
          selectedKey={draft.questionType}
          onSelectionChange={(key) => {
            if (key == null || key === draft.questionType) return;
            setPendingType(key as QuestionType);
          }}
        >
          <Label>{t('tests.builder.editor.type')}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {QUESTION_TYPES.map((type) => (
                <ListBox.Item
                  key={type}
                  id={type}
                  textValue={t(`tests.builder.types.${type}`)}
                >
                  {t(`tests.builder.types.${type}`)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <TextField
          fullWidth
          value={draft.guideline}
          onChange={(guideline) => {
            setDraft((prev) => ({ ...prev, guideline }));
            markDirty();
          }}
        >
          <Label>{t('tests.builder.editor.guideline')}</Label>
          <TextArea
            rows={2}
            placeholder={t('tests.builder.editor.guidelinePlaceholder')}
          />
        </TextField>

        {isMatching && labels.length === 0 && (
          <div className="border-warning/40 bg-warning/10 text-warning-700 flex items-start gap-2 rounded-lg border p-3 text-xs">
            <LuTriangleAlert className="mt-0.5 size-3.5 shrink-0" />
            {t('tests.builder.editor.passageWarning')}
          </div>
        )}

        {isNoteHint && (
          <WordBankInput
            words={wordBank}
            onChange={(words) => {
              setWordBank(words);
              markDirty();
            }}
            isInvalid={!wordBankOK}
          />
        )}

        {isDiagram && activeQuestion && (
          <DiagramGroupFields
            imageUrl={(activeQuestion.content as any).imageUrl ?? ''}
            layout={(activeQuestion.content as any).layout ?? 'listed'}
            onChange={(patch) => patchAllQuestions(patch)}
          />
        )}

        <div className="bg-default-200 h-px" />

        <QuestionTabs
          ranges={questionRanges}
          activeIndex={activeIndex}
          invalidIndexes={invalidIndexes}
          onSelect={setActiveIndex}
          onAdd={addQuestion}
        />

        {activeQuestion && (
          <div className="flex flex-col gap-3 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <Chip size="sm" variant="soft" color="accent">
                <Chip.Label className="font-mono">
                  {questionRanges[activeIndex]?.count > 1
                    ? t('tests.builder.editor.questionRange', {
                        from: questionRanges[activeIndex].start,
                        to: questionRanges[activeIndex].end,
                      })
                    : t('tests.builder.editor.question', {
                        number: questionRanges[activeIndex]?.start,
                      })}
                </Chip.Label>
              </Chip>
              <Button
                size="sm"
                variant="ghost"
                isDisabled={draft.questions.length <= 1}
                onPress={() => removeQuestion(activeIndex)}
              >
                {t('tests.builder.editor.removeQuestion')}
              </Button>
            </div>

            {renderSubForm()}

            <TextField
              fullWidth
              value={(activeQuestion.content as any).explanation ?? ''}
              onChange={(explanation) =>
                patchQuestion(activeIndex, {
                  ...(activeQuestion.content as any),
                  explanation,
                })
              }
            >
              <Label>{t('tests.builder.editor.explanation')}</Label>
              <TextArea
                rows={2}
                placeholder={t('tests.builder.editor.explanationHint')}
              />
            </TextField>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t p-3">
        <span className="text-default-500 text-xs">
          {t('tests.builder.editor.footerCount', {
            count: questionCount,
          })}
        </span>
        {!isValid && (
          <span className="text-warning text-xs">
            {t('tests.builder.editor.invalidHint')}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="tertiary" onPress={onCancel}>
            {t('tests.builder.editor.cancel')}
          </Button>
          <MyButton
            I={PermissionAction.Update}
            a={SubjectName.Tests}
            size="sm"
            variant="primary"
            isDisabled={!isValid}
            isPending={isSaving}
            onPress={handleSave}
          >
            {t('tests.builder.editor.saveGroup')}
          </MyButton>
        </div>
      </div>

      <Modal>
        <Modal.Backdrop
          isOpen={pendingType !== null}
          onOpenChange={(open) => {
            if (!open) setPendingType(null);
          }}
        >
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[400px]">
              <Modal.Header>
                <Modal.Icon className="bg-warning/15 text-warning">
                  <LuTriangleAlert className="size-5" />
                </Modal.Icon>
                <Modal.Heading>
                  {t('tests.builder.editor.typeChangeTitle')}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-default-600 text-sm">
                  {t('tests.builder.editor.typeChangeConfirm', {
                    type: pendingType
                      ? t(`tests.builder.types.${pendingType}`)
                      : '',
                  })}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" onPress={() => setPendingType(null)}>
                  {t('tests.builder.editor.cancel')}
                </Button>
                <Button
                  variant="danger"
                  onPress={() => pendingType && applyTypeChange(pendingType)}
                >
                  {t('tests.builder.editor.typeChangeTitle')}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default QuestionGroupEditor;
