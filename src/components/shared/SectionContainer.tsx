type SectionContainerProps = {
  children: React.ReactNode;
  title: string;
};

const SectionContainer = ({ children, title }: SectionContainerProps) => {
  return (
    <div className="relative mt-3 flex flex-col gap-4 rounded-xl border border-gray-100 p-6">
      <p className="absolute -top-2.5 left-4 bg-white px-2 text-sm font-semibold text-gray-500">
        {title}
      </p>
      {children}
    </div>
  );
};

export default SectionContainer;
