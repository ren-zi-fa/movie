import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export const WatchMovieSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movie Info Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Player Skeleton */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="w-full h-[400px] rounded-lg" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="w-full h-[300px] rounded-lg mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
