import { Skeleton } from '@heroui/react';

const RoleSkeleton = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <Skeleton className="h-14 w-full rounded-lg" />
      <Skeleton className="h-14 w-full rounded-lg" />
      <Skeleton className="h-14 w-full rounded-lg" />
      <Skeleton className="h-14 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default RoleSkeleton;
