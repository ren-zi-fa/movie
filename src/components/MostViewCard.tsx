import useSWR from "swr";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Play, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface MostView {
  title: string;
  url: string;
  thumbnail: string;
  country: string;
  genres: string[];
  rating?: string;
  year?: string;
  views?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const fetcher = (url: string): Promise<ApiResponse<MostView[]>> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

const ImageDisplay = ({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}

      {imageError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          <Play className="w-8 h-8 mb-2" />
          <span className="text-xs text-center px-2">{title}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-auto mx-auto h-auto transition-all duration-300 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
        <Play className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

const MostViewCard = ({ item }: { item: MostView }) => {
  const router = useRouter();
  const url = item.url;
  const watchLink = url.replace(
    process.env.NEXT_PUBLIC_TARGET_URL as string,
    ""
  );
  const handleClick = () => {
    router.push(`/watch${watchLink}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
      <div onClick={handleClick}>
        <ImageDisplay
          src={item.thumbnail}
          alt={item.title}
          title={item.title}
        />
        <CardContent className="p-3 space-y-2 flex-1">
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
            {item.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">{item.country}</span>
            {item.year && (
              <span className="flex-shrink-0 ml-2">{item.year}</span>
            )}
          </div>
          {(item.rating || item.views) && (
            <div className="flex items-center justify-between text-xs">
              {item.rating && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px] font-medium">
                  ⭐ {item.rating}
                </span>
              )}
              {item.views && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{item.views.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {item.genres.slice(0, 2).map((genre, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5"
              >
                {genre}
              </Badge>
            ))}
            {item.genres.length > 2 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                +{item.genres.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const SkeletonCard = () => (
  <CarouselItem className="pl-2 md:pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
    <div className="p-1">
      <Card className="h-full">
        <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
        <CardContent className="space-y-2 p-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-12" />
          </div>
        </CardContent>
      </Card>
    </div>
  </CarouselItem>
);

const CardMostView = () => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<MostView[]>>(
    "/api/most-view",
    fetcher
  );

  if (error) {
    return (
      <div className="w-full px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load most viewed movies.</span>
            <button
              onClick={() => mutate()}
              className="text-sm underline hover:no-underline"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : data?.data?.map((item, idx) => (
                <CarouselItem
                  key={`${item.title}-${idx}`}
                  className="pl-2 md:pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/4"
                >
                  <div className="p-1">
                    <MostViewCard item={item} />
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>

        <CarouselPrevious className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full shadow p-1" />
        <CarouselNext className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full shadow p-1" />
      </Carousel>

      <div className="md:hidden mt-2 text-center">
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <span>Scroll to see more</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
            <div
              className="w-1 h-1 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-1 h-1 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMostView;
