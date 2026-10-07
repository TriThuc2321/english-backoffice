import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';

import type { QuestionRange } from '../utils';

type QuestionTabsProps = {
  ranges: QuestionRange[];
  activeIndex: number;
  invalidIndexes: number[];
  onSelect: (index: number) => void;
  onAdd: () => void;
};

const QuestionTabs = ({
  ranges,
  activeIndex,
  invalidIndexes,
  onSelect,
  onAdd,
}: QuestionTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ranges.map((range, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={`relative rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
            index === activeIndex
              ? 'bg-accent text-accent-foreground'
              : 'bg-default-100 text-default-600 hover:bg-default-200'
          }`}
        >
          {range.count > 1
            ? t('tests.builder.editor.questionRange', {
                from: range.start,
                to: range.end,
              })
            : t('tests.builder.editor.question', { number: range.start })}
          {invalidIndexes.includes(index) && (
            <span className="bg-warning absolute -top-0.5 -right-0.5 size-2 rounded-full" />
          )}
        </button>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="border-default-300 text-default-500 hover:border-accent hover:text-accent flex items-center gap-1 rounded-lg border border-dashed px-2.5 py-1 text-xs font-medium transition-colors"
      >
        <LuPlus className="size-3" />
        {t('tests.builder.editor.addQuestion')}
      </button>
    </div>
  );
};

export default QuestionTabs;
