import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProblemSkeleton() {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-5 w-[70px]" />
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}