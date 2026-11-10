type AuthCardProps = {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="bg-surface shadow-overlay flex w-full max-w-[400px] flex-col gap-5 rounded-3xl p-8">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {children}
    </main>
  );
}
