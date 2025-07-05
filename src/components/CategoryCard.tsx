"use client";

import React from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  ExternalLink,
  Calendar,
  User,
  Star,
  AlertCircle,
} from "lucide-react";
import { ApiResponse, Country } from "@/types";
import MovieCardSkeleton from "./SkeletonLoading";
import { fetcher } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookmarkButton from "./BookmarkButton";

// Movie Card
const MovieCard = ({ movie }: { movie: Country }) => {
  const url = movie.watchLink;
  const slug = url.replace(process.env.NEXT_PUBLIC_TARGET_URL as string, "");
  const router = useRouter();
  const handleWatchClick = () => {
    router.push(`/watch${slug}`);
  };

  const handleTrailerClick = () => {
    if (movie.trailer) {
      window.open(movie.trailer, "_blank");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {movie.thumbnail ? (
          <Image
            width={300}
            height={300}
            referrerPolicy="no-referrer"
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <Play className="w-12 h-12" />
          </div>
        )}

        {/* Bookmark button */}
        <div className="absolute top-2 left-2 z-10">
          <BookmarkButton
            title={movie.title}
            url={`/watch${slug}`}
            thumbnail={movie.thumbnail}
            rating={movie.rating}
            releaseDate={movie.releaseDate}
            genres={movie.genres}
          />
        </div>

        {/* Rating badge */}
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {movie.rating}
          </div>
        )}
      </div>

      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </CardTitle>

        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {movie.genres.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{movie.genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          {movie.director && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="truncate">{movie.director}</span>
            </div>
          )}

          {movie.releaseDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(movie.releaseDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex gap-2">
          <Button
            onClick={handleWatchClick}
            className="flex-1"
            disabled={!movie.watchLink}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Now
          </Button>

          {movie.trailer && (
            <Button
              onClick={handleTrailerClick}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
interface CardCategoryProps {
  country: string;
}

const CardCategory: React.FC<CardCategoryProps> = ({ country }) => {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<ApiResponse<Country[]>>(
    country ? `/api/category/${country}` : null,
    fetcher
  );

  if (isLoading || !response) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load movies for {country}. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => mutate()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!response.success || !response.data || response.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Movies Found
          </h3>
          <p className="text-gray-500 mb-4">
            We couldn`t find any movies for :{country}.
          </p>
          <Button onClick={() => mutate()} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const movies = response.data;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 dark:text-white">
          Movies from {country}
        </h1>
        <p className="text-gray-600">
          Discover {movies.length} amazing{" "}
          {movies.length === 1 ? "movie" : "movies"} from {country}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.title}-${index}`} movie={movie} />
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Showing {movies.length} {movies.length === 1 ? "result" : "results"} for
        :{country}
      </div>
    </div>
  );
};

export default CardCategory;
