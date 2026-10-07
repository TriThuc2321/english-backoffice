import { cn } from '@heroui/react';

type SectionProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2;
};

const Section = ({ title, children, className, columns = 2 }: SectionProps) => (
  <section className={cn('flex flex-col gap-4', className)}>
    {title && (
      <h3 className="text-foreground/50 text-sm font-semibold uppercase">
        {title}
      </h3>
    )}
    <div
      className={cn(
        'grid gap-x-6 gap-y-5',
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
      )}
    >
      {children}
    </div>
  </section>
);

export default Section;
