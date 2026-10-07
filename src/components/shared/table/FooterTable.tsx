import { ListBox, Pagination, Select } from '@heroui/react';
import { memo, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { ROW_PER_PAGE_OPTIONS } from '@/constants/common';

type FooterTableProps = { page?: number; total?: number; take?: number };

const FooterTable = ({ page = 1, total = 0, take = 10 }: FooterTableProps) => {
  const [, setSearchParams] = useSearchParams();

  const pageCount = Math.ceil(total / take);
  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i + 1),
    [pageCount],
  );

  const onChangePage = (newPage: number) =>
    setSearchParams((prev) => {
      prev.set('page', String(newPage));
      return prev;
    });

  const onRowsPerPageChange = (key: string) =>
    setSearchParams((prev) => {
      prev.set('take', key);
      prev.set('page', '1');
      return prev;
    });

  if (!total) return null;

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <Select
        className="w-20"
        value={take.toString()}
        onChange={(key) => key && onRowsPerPageChange(key as string)}
        aria-label="Rows per page"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {ROW_PER_PAGE_OPTIONS.map(({ key, label }) => (
              <ListBox.Item key={key} id={key} textValue={label}>
                {label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <p className="text-muted min-w-fit text-sm">/ {total} items</p>

      <Pagination className="w-fit">
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page <= 1}
              onPress={() => onChangePage(page - 1)}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {pages.map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link
                isActive={p === page}
                onPress={() => onChangePage(p)}
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Next
              isDisabled={page >= pageCount}
              onPress={() => onChangePage(page + 1)}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
};

export default memo(FooterTable);
