import { Skeleton } from "@/components/ui/skeleton";


export function SectionHeaderSkeleton({ showButton = false }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-8 w-48" />
      {showButton && <Skeleton className="h-10 w-32" />}
    </div>
  );
}