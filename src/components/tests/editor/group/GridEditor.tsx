import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuMinus, LuPlus, LuX } from 'react-icons/lu';

import { ErrorText, TextInput } from '../fields';

type GridEditorProps = {
  headers?: string[];
  onHeadersChange?: (headers: string[]) => void;
  rows: string[][];
  onRowsChange: (rows: string[][]) => void;
  error?: string;
  isDisabled?: boolean;
};

// Table completion (with headers) and TOEIC info schedules (rows only)
const GridEditor = ({
  headers,
  onHeadersChange,
  rows,
  onRowsChange,
  error,
  isDisabled,
}: GridEditorProps) => {
  const { t } = useTranslation();
  const columns = Math.max(
    headers?.length ?? 0,
    ...rows.map((r) => r.length),
    1,
  );

  const setCell = (rowIndex: number, colIndex: number, value: string) =>
    onRowsChange(
      rows.map((row, r) =>
        r === rowIndex
          ? Array.from({ length: columns }, (_, c) =>
              c === colIndex ? value : (row[c] ?? ''),
            )
          : row,
      ),
    );

  const setHeader = (colIndex: number, value: string) =>
    onHeadersChange?.(
      Array.from({ length: columns }, (_, c) =>
        c === colIndex ? value : (headers?.[c] ?? ''),
      ),
    );

  const addColumn = () => {
    onRowsChange(rows.map((row) => [...row, '']));
    if (headers) onHeadersChange?.([...headers, '']);
  };

  const removeColumn = () => {
    if (columns <= 1) return;
    onRowsChange(rows.map((row) => row.slice(0, columns - 1)));
    if (headers) onHeadersChange?.(headers.slice(0, columns - 1));
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, minmax(8rem, 1fr)) auto`,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <div className="grid gap-2" style={gridStyle}>
          {headers &&
            Array.from({ length: columns }, (_, c) => (
              <TextInput
                key={`h${c}`}
                placeholder={t('tests.editor.group.header', { n: c + 1 })}
                value={headers[c] ?? ''}
                onChange={(v) => setHeader(c, v)}
                isDisabled={isDisabled}
              />
            ))}
          {headers && <span />}
          {rows.map((row, r) => [
            ...Array.from({ length: columns }, (_, c) => (
              <TextInput
                key={`${r}-${c}`}
                value={row[c] ?? ''}
                onChange={(v) => setCell(r, c, v)}
                isDisabled={isDisabled}
              />
            )),
            <Button
              key={`${r}-x`}
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label={t('tests.editor.group.removeRow')}
              isDisabled={isDisabled}
              onPress={() => onRowsChange(rows.filter((_, i) => i !== r))}
            >
              <LuX className="size-4" />
            </Button>,
          ])}
        </div>
      </div>
      <ErrorText>{error}</ErrorText>
      {!isDisabled && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            onPress={() =>
              onRowsChange([...rows, Array.from({ length: columns }, () => '')])
            }
          >
            <LuPlus className="size-4" />
            {t('tests.editor.group.addRow')}
          </Button>
          <Button size="sm" variant="ghost" onPress={addColumn}>
            <LuPlus className="size-4" />
            {t('tests.editor.group.addColumn')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            isDisabled={columns <= 1}
            onPress={removeColumn}
          >
            <LuMinus className="size-4" />
            {t('tests.editor.group.removeColumn')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GridEditor;
