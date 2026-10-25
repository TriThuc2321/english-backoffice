import { Skeleton } from '@heroui/react';

const TeacherSkeleton = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <Skeleton className="rounded-field h-14 w-full" />
      <Skeleton className="rounded-field h-14 w-full" />
      <Skeleton className="rounded-field h-14 w-full" />
      <Skeleton className="rounded-field h-14 w-full" />
      <div className="flex justify-end gap-2">
        <Skeleton className="rounded-field h-10 w-24" />
      </div>
    </div>
  );
};

export default TeacherSkeleton;
