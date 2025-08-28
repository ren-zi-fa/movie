import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Movie } from "@/types";
import BookmarkButton from "./BookmarkButton";
import { Calendar, FilmIcon } from "lucide-react";
import { formatRating } from "@/lib/utils";
import Image from "next/image";

const situs = process.env.NEXT_PUBLIC_TARGET_URL as string;

export const SingleCard = ({ movie }: { movie: Movie }) => {
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

  const slugWatch = movie.watchLink.replace(situs, "");
  const slug = movie.url.replace(situs, "");
console.log(slugWatch)
console.log(slug)
  return (
    <div className="w-full">
      <Card className="h-full px-0  rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
        <div className="relative overflow-hidden rounded-t-2xl">
          {imageLoading && (
            <Skeleton className="w-full h-[200px] absolute inset-0 z-10" />
          )}
          <Image
            width={100}
            height={100}
            src={!movie.thumbnail || imageError ? "/blur.png" : movie.thumbnail}
            alt={movie.title || "Thumbnail tidak tersedia"}
            referrerPolicy="no-referrer"
            className={`rounded-t-2xl object-cover w-auto h-[200px] mx-auto transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />

          <div className="absolute top-1 right-2 flex gap-4 justify-between z-20">
            <div className=" dark:text-white text-gray-600  px-2 py-1">
              ⭐ {formatRating(movie.rating)}
            </div>
          </div>
          <div className="absolute top-1 left-4 flex gap-4 justify-between z-20">
            <BookmarkButton
              title={movie.title}
              url={`/watch${slug}`}
              thumbnail={movie.thumbnail}
              rating={movie.rating}
              releaseDate={movie.releaseDate}
            />
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col items-center justify-between">
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
                <span className="text-blue-600">
                  <FilmIcon size={15} />
                </span>
                <span className="truncate">{movie.director}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">
                  <Calendar size={15} />
                </span>
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
