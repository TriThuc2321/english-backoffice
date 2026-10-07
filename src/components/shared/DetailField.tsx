import { cn } from '@heroui/react';

type DetailFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  span?: 'full' | 'half';
};

const DetailField = ({
  label,
  children,
  className,
  span,
}: DetailFieldProps) => (
  <div
    className={cn(
      'flex flex-col gap-1.5',
      span === 'full' && 'sm:col-span-2',
      className,
    )}
  >
    <span className="text-sm font-semibold">{label}</span>
    <div className="text-default-800 text-sm">{children}</div>
  </div>
);

type InfoCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2;
};

export const InfoCard = ({
  title,
  children,
  className,
  columns = 2,
}: InfoCardProps) => (
  <div className={cn('relative mt-2 rounded-xl border p-5', className)}>
    {title && (
      <p className="bg-surface absolute -top-3 left-4 px-2 text-base font-semibold">
        {title}
      </p>
    )}
    <div
      className={cn(
        'grid gap-x-6 gap-y-4',
        columns === 2 ? 'grid-cols-2' : 'grid-cols-1',
      )}
    >
      {children}
    </div>
  </div>
);

export default DetailField;
