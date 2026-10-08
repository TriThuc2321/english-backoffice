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
      'flex min-w-0 flex-col gap-1',
      span === 'full' && 'sm:col-span-full',
      className,
    )}
  >
    <span className="text-muted text-xs font-medium">{label}</span>
    <div className="text-foreground text-sm font-medium">{children}</div>
  </div>
);

type InfoCardProps = {
  title?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 4;
};

export const InfoCard = ({
  title,
  description,
  actions,
  children,
  className,
  columns = 2,
}: InfoCardProps) => (
  <section
    className={cn(
      'bg-default/40 flex flex-col gap-4 rounded-2xl p-5',
      className,
    )}
  >
    {(title || actions) && (
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {description && <p className="text-muted text-xs">{description}</p>}
        </div>
        {actions}
      </div>
    )}
    <div
      className={cn(
        'grid gap-x-6 gap-y-4',
        columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2',
        columns === 4 && 'lg:grid-cols-4',
      )}
    >
      {children}
    </div>
  </section>
);

export default DetailField;
