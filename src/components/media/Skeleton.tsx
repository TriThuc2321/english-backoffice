import { Skeleton } from '@heroui/react';

const MediaSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="rounded-field size-14" />
        <Skeleton className="rounded-field h-8 w-64" />
      </div>
      <Skeleton className="rounded-field h-14 w-full" />
      <Skeleton className="h-40 w-full rounded-3xl" />
      <Skeleton className="h-40 w-full rounded-3xl" />
    </div>
  );
};

export default MediaSkeleton;
