import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionSkeleton() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <CardTitle>
            <Skeleton className="h-6 w-64" />
          </CardTitle>
        </div>
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Points Summary */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 border-t py-4 text-sm"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="border-t pt-4 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
    </Card>
  )
}

