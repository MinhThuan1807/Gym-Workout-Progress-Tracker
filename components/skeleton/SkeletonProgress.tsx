import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProgress() {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Chart Skeleton */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Calendar Skeleton */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="space-y-4 w-full max-w-sm">
            {/* Calendar Header */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={`header-${i}`} className="h-8 w-full rounded-md" />
              ))}
              {/* Calendar days */}
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={`day-${i}`} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}