import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonExercises() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card 
          key={i} 
          className="rounded-2xl border shadow-sm overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="relative h-48 overflow-hidden">
            <Skeleton className="w-full h-full" />
            <div className="absolute top-3 right-3">
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
          </div>
          
          {/* Content Skeleton */}
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}