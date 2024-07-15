import { Skeleton } from "./ui/skeleton";

export function SkeletonLoader() {
  return (
    <div className="flex space-x-4 items-center justify-around transition-all ease-out">
      <Skeleton className="h-[120px] w-[120px] rounded-md bg-gray-500" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px] bg-gray-500" />
        <Skeleton className="h-4 w-[120px] bg-gray-500" />
        <Skeleton className="h-4 w-[150px] bg-gray-500" />
        <Skeleton className="h-4 w-[80px] bg-gray-500" />
      </div>
      <Skeleton className="h-[50px] w-[120px] bg-gray-500 mr-auto" />
    </div>
  );
}
