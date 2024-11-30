import { DiscussionSkeleton } from "./DiscussionSkeleton";
import { ProblemSkeleton } from "./ProblemSkeleton";
import { SectionHeaderSkeleton } from "./SectionHeaderSkeleton";


export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-gray-100 rounded-lg shadow-sm p-6">
          <div className="rounded-lg shadow-sm p-6">
            <SectionHeaderSkeleton showButton={true} />
            {/* <StatsSkeleton /> */}
          </div>
          <ProblemSkeleton count={5} />
        </div>
      </div>

      <div>
        <div className="bg-gray-100 rounded-lg shadow-sm p-6">
          <SectionHeaderSkeleton />
          <DiscussionSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}