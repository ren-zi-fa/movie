import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "./ui/card";
const MovieCardSkeleton = () => {
  return (
    <Card className="h-full rounded-2xl shadow-md">
      <Skeleton className="w-full h-[180px] rounded-t-2xl" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </CardContent>
    </Card>
  );
};

export default MovieCardSkeleton;
