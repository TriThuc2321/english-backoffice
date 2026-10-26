import type { ReactNode } from 'react';

import { Chip, cn } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { TypeSample } from './samples';

import { PassagePane } from './parts';
import { VIEWS } from './views';

const KEYWORDS =
  /\b(ONE|TWO|THREE|NO MORE THAN|AND\/OR A NUMBER|ONLY|TRUE|FALSE|NOT GIVEN|YES|NO)\b/;

const Instruction = ({ text }: { text: string }) => (
  <span className="text-foreground/80 basis-full text-sm leading-relaxed whitespace-pre-line">
    {text.split(KEYWORDS).map((part, i) =>
      i % 2 ? (
        <b key={i} className="text-accent font-semibold">
          {part}
        </b>
      ) : (
        part
      ),
    )}
  </span>
);

const groupRange = (sample: TypeSample) => {
  const first = sample.questions[0]?.n;
  const last = sample.questions.at(-1);
  if (first == null || !last) return undefined;
  const end = last.nTo ?? last.n;
  return first === end ? `${first}` : `${first}–${end}`;
};

type GroupPreviewProps = {
  sample: TypeSample;
  footer?: ReactNode;
  // Drops the outer box, for when the parent already renders a Card
  bare?: boolean;
};

// Must render inside a PreviewContext.Provider for `sample`
const GroupPreview = ({ sample, footer, bare }: GroupPreviewProps) => {
  const { t } = useTranslation();
  const View = VIEWS[sample.view];
  const range = groupRange(sample);

  const header = (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1.5',
        !bare && 'border-border bg-default/50 border-b px-4 py-3',
      )}
    >
      {range && (
        <Chip color="accent" size="sm" variant="soft">
          <Chip.Label className="font-semibold">
            {t('tests.editor.typePreview.questions', { range })}
          </Chip.Label>
        </Chip>
      )}
      {sample.group.instruction && (
        <Instruction text={sample.group.instruction} />
      )}
    </div>
  );

  if (bare) {
    return (
      <div className="flex min-w-0 flex-col gap-3">
        {header}
        {sample.passage && (
          <PassagePane
            passage={sample.passage}
            className="bg-default/40 rounded-field border-0 md:border-r-0"
          />
        )}
        <div className="min-w-0">
          <View />
        </div>
        {footer}
      </div>
    );
  }

  const body = (
    <div className="min-w-0 p-4">
      <View />
    </div>
  );

  return (
    <div className="border-border bg-surface overflow-hidden rounded-xl border">
      {header}
      {sample.passage ? (
        <div className="grid md:grid-cols-2">
          <PassagePane passage={sample.passage} />
          {body}
        </div>
      ) : (
        body
      )}
      {footer}
    </div>
  );
};

export default GroupPreview;
