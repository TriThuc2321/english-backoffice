import { Button, Card, Chip, Skeleton } from '@heroui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Passage } from '@/types/passage';
import type { QuestionGroup, TestPart } from '@/types/test';

import { usePassageParagraphs } from '@/components/tests/editor/group/PassagePreview';
import {
  GroupPreview,
  gradeSample,
  MediaAudio,
  PassagePane,
  PreviewContext,
  toSample,
  toSamplePassage,
  type GradeResult,
  type PreviewAnswers,
} from '@/components/tests/editor/typePreview';
import { byOrder } from '@/components/tests/editor/utils';
import {
  useGetQuestionGroups,
  useGetQuestionGroupsDetail,
} from '@/hooks/apis/question-groups';

type PreviewGroupProps = {
  group: QuestionGroup;
  partPassage?: Passage;
  answers: PreviewAnswers;
  onAnswer: (n: number, value: string | string[]) => void;
  checked: boolean;
  results: GradeResult['results'];
};

const GroupPassage = ({ passageId }: { passageId: number }) => {
  const { passage, isLoading } = usePassageParagraphs(passageId);
  const samplePassage = useMemo(
    () => (passage ? toSamplePassage(passage) : undefined),
    [passage],
  );

  if (isLoading) return <Skeleton className="rounded-field h-40" />;
  if (!samplePassage) return null;
  return (
    <PassagePane
      passage={samplePassage}
      className="bg-default/40 rounded-field border-0 md:border-r-0"
    />
  );
};

const PreviewGroup = ({
  group,
  partPassage,
  answers,
  onAnswer,
  checked,
  results,
}: PreviewGroupProps) => {
  const ownPassageIds = useMemo(
    () => byOrder(group.groupPassages ?? []).map((gp) => gp.passageId),
    [group.groupPassages],
  );
  const { passage, isLoading } = usePassageParagraphs(ownPassageIds[0]);
  // Own passages replace the part's; the part's is shown once beside all groups, so only text completion keeps it inline
  const sample = useMemo(
    () => ({ ...toSample(group, passage ?? partPassage), passage: undefined }),
    [group, passage, partPassage],
  );

  if (ownPassageIds.length && isLoading)
    return <Skeleton className="h-64 rounded-3xl" />;

  const passages =
    sample.view !== 'textcomp' && ownPassageIds.length ? (
      <>
        {ownPassageIds.map((passageId) => (
          <GroupPassage key={passageId} passageId={passageId} />
        ))}
      </>
    ) : undefined;

  return (
    <PreviewContext.Provider
      value={{ sample, answers, setAnswer: onAnswer, checked, results }}
    >
      <Card>
        <Card.Content>
          <GroupPreview sample={sample} bare passages={passages} />
        </Card.Content>
      </Card>
    </PreviewContext.Provider>
  );
};

type PartPreviewProps = {
  part: TestPart;
  partName: string;
  answers: Record<number, PreviewAnswers>;
  onAnswer: (groupId: number, n: number, value: string | string[]) => void;
  checked: boolean;
  onCheck: () => void;
  onReset: (groupIds: number[]) => void;
};

const PartPreview = ({
  part,
  partName,
  answers,
  onAnswer,
  checked,
  onCheck,
  onReset,
}: PartPreviewProps) => {
  const { t } = useTranslation();
  const { data, isLoading: isLoadingList } = useGetQuestionGroups(part.id);
  const ids = useMemo(() => byOrder(data ?? []).map((g) => g.id), [data]);
  const {
    data: groups,
    isLoading: isLoadingDetails,
    isError,
  } = useGetQuestionGroupsDetail(ids);
  const isLoading = isLoadingList || isLoadingDetails;
  const { passage: partPassage, isLoading: isLoadingPassage } =
    usePassageParagraphs(part.passageId ?? undefined);
  const partSamplePassage = useMemo(
    () => (partPassage ? toSamplePassage(partPassage) : undefined),
    [partPassage],
  );
  const inheritsPartPassage =
    !!part.passageId &&
    (isLoading || groups.some((group) => !group.groupPassages?.length));
  const partPassageMissing =
    inheritsPartPassage && !isLoadingPassage && !partSamplePassage;
  const showPartPassage = inheritsPartPassage && !partPassageMissing;

  // Grading only needs questions, so passages are not required here
  const grades = useMemo(
    () =>
      groups.map((group) =>
        gradeSample(toSample(group), answers[group.id] ?? {}),
      ),
    [groups, answers],
  );
  const score = grades.reduce((sum, g) => sum + g.score, 0);
  const total = grades.reduce((sum, g) => sum + g.total, 0);

  const groupList = (
    <>
      {isLoading && <Skeleton className="h-96 rounded-3xl" />}
      {!isLoading && isError && (
        <div className="text-danger rounded-3xl border py-8 text-center text-sm">
          {t('tests.preview.loadError')}
        </div>
      )}
      {!isLoading && !isError && !groups.length && (
        <div className="text-muted rounded-3xl border py-8 text-center text-sm">
          {t('tests.preview.noGroups')}
        </div>
      )}
      {groups.map((group, i) => (
        <PreviewGroup
          key={group.id}
          group={group}
          partPassage={partPassage}
          answers={answers[group.id] ?? {}}
          onAnswer={(n, value) => onAnswer(group.id, n, value)}
          checked={checked}
          results={grades[i].results}
        />
      ))}
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Card.Content className="flex flex-col gap-3">
          <h3 className="text-foreground/50 text-sm font-semibold uppercase">
            {partName}
          </h3>
          {part.instruction && (
            <p className="text-foreground/80 text-sm whitespace-pre-line">
              {part.instruction}
            </p>
          )}
          {partPassageMissing && (
            <p className="text-warning text-sm">
              {t('tests.preview.passageMissing')}
            </p>
          )}
          {part.audioMediaId && (
            <MediaAudio
              mediaId={part.audioMediaId}
              startMs={part.audioStartMs}
              endMs={part.audioEndMs}
            />
          )}
        </Card.Content>
      </Card>

      {showPartPassage ? (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <Card className="lg:sticky lg:top-0">
            <Card.Content>
              {isLoadingPassage && <Skeleton className="rounded-field h-96" />}
              {partSamplePassage && (
                <PassagePane
                  passage={partSamplePassage}
                  className="max-h-[calc(100vh-12rem)] border-0 p-0 md:border-r-0"
                />
              )}
            </Card.Content>
          </Card>
          <div className="flex min-w-0 flex-col gap-4">{groupList}</div>
        </div>
      ) : (
        groupList
      )}

      {!!groups.length && (
        <Card className="sticky bottom-0 z-20 shadow-lg">
          <Card.Content className="flex flex-row flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {checked && total > 0 && (
                <Chip
                  color={score === total ? 'success' : 'warning'}
                  size="sm"
                  variant="soft"
                >
                  <Chip.Label className="font-semibold">
                    {t('tests.editor.typePreview.score', { score, total })}
                  </Chip.Label>
                </Chip>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                onPress={() => onReset(groups.map((group) => group.id))}
              >
                {t('tests.editor.typePreview.reset')}
              </Button>
              <Button variant="primary" onPress={onCheck}>
                {t('tests.editor.typePreview.check')}
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default PartPreview;
