import type { SortDescriptor } from '@heroui/react';
import type { Table as TableInstance } from '@tanstack/react-table';

import { cn, Spinner, Table } from '@heroui/react';
import { flexRender } from '@tanstack/react-table';
import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from 'react-icons/lu';

interface TanstackTableProps<T> {
  table: TableInstance<T>;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  ariaLabel?: string;
  className?: string;
  isLoading?: boolean;
  emptyContent?: string;
  footer?: React.ReactNode;
  maxHeight?: string;
}

function SortIcon({ direction }: { direction?: 'ascending' | 'descending' }) {
  if (direction === 'ascending') return <LuArrowUp className="size-3" />;
  if (direction === 'descending') return <LuArrowDown className="size-3" />;
  return <LuChevronsUpDown className="text-muted size-3" />;
}

function TanstackTable<T>({
  table,
  sortDescriptor,
  onSortChange,
  ariaLabel = 'Data table',
  className,
  isLoading,
  emptyContent = 'No data found',
  footer,
  maxHeight,
}: TanstackTableProps<T>) {
  const rows = table.getRowModel().rows;

  return (
    <div className={cn('relative flex flex-col gap-2', className)}>
      <div
        className="max-h-[calc(100vh-284px)] overflow-auto md:max-h-[calc(100vh-260px)] [&_.table-root]:grid-cols-[auto] [&_.table-root]:overflow-visible [&_table]:min-w-max [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-20"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <Table variant="secondary">
          <Table.Content
            aria-label={ariaLabel}
            sortDescriptor={sortDescriptor}
            onSortChange={onSortChange}
          >
            <Table.Header>
              {table.getHeaderGroups()[0]!.headers.map((header, i) => {
                const isPinnedRight = header.column.getIsPinned() === 'right';
                return (
                  <Table.Column
                    key={header.id}
                    id={header.id}
                    allowsSorting={header.column.getCanSort()}
                    isRowHeader={i === 0}
                    className={cn(
                      isPinnedRight &&
                        'sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]',
                    )}
                  >
                    {({ sortDirection }) => (
                      <span className="flex items-center justify-between gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <SortIcon direction={sortDirection} />
                        )}
                      </span>
                    )}
                  </Table.Column>
                );
              })}
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id} id={row.id} className="group">
                  {row.getVisibleCells().map((cell) => {
                    const isPinnedRight = cell.column.getIsPinned() === 'right';
                    return (
                      <Table.Cell
                        key={cell.id}
                        className={cn(
                          isPinnedRight &&
                            'bg-surface group-hover:bg-default sticky right-0 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]',
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      </div>

      {footer}

      {isLoading && (
        <div className="bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          <Spinner />
        </div>
      )}

      {isLoading && rows.length === 0 && <div className="h-40" />}

      {!isLoading && rows.length === 0 && (
        <div className="text-muted flex justify-center py-8 text-sm">
          {emptyContent}
        </div>
      )}
    </div>
  );
}

export default TanstackTable;
