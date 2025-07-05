import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Movie } from "@/types";

const situs = process.env.NEXT_PUBLIC_TARGET_URL as string;

export const SingleCard = ({
  movie,
  style,
}: {
  movie: Movie;
  style?: React.CSSProperties; // Made optional since we don't need it for regular grid
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Tanggal tidak valid";
    }
  };

  const formatRating = (rating: string) => {
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? rating : numRating.toFixed(1);
  };

  const urlWatch = movie.watchLink;
  const slugWatch = urlWatch.replace(situs, "");

  return (
    <div style={style} className="w-full">
      <Card className="h-full rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          {imageLoading && (
            <Skeleton className="w-full h-[200px] absolute inset-0 z-10" />
          )}
          <Image
            src={imageError ? "/placeholder-movie.jpg" : movie.thumbnail}
            alt={movie.title}
            width={300}
            height={200}
            unoptimized
            referrerPolicy="no-referrer"
            className={`rounded-t-2xl object-cover w-full h-[200px] transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            ⭐ {formatRating(movie.rating)}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <Link
              href={`/watch${slugWatch}`}
              className="font-semibold text-base line-clamp-2 hover:underline transition-colors duration-200 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              title={movie.title}
            >
              {movie.title}
            </Link>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <span className="text-blue-600">🎬</span>
                <span className="truncate">{movie.director}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-green-600">📅</span>
                <span>{formatDate(movie.releaseDate)}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/watch${slugWatch}`}
            className="mt-4 inline-block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
             text-gray-900 dark:text-gray-100 text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            role="button"
          >
            Tonton
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
