"use client";

import React from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  Eye,
  Star,
  MapPin,
  Languages,
  Users,
  Film,
  Play,
  AlertTriangle,
} from "lucide-react";
import { ApiResponse, WatchMovie } from "@/types";
import { fetcher } from "@/lib/utils";
import { WatchMovieSkeleton } from "./SkeletonWatch";
import Image from "next/image";
import BookmarkButton from "@/components/BookmarkButton";

interface WatchMovieProps {
  slug: string;
}

const ErrorComponent = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Coba Lagi
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

const WatchMovieCard: React.FC<WatchMovieProps> = ({ slug }) => {
  const {
    data: movie,
    error,
    isLoading,
    mutate,
  } = useSWR<ApiResponse<WatchMovie>>(`/api/watch/${slug}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  if (isLoading) return <WatchMovieSkeleton />;

  if (error)
    return (
      <ErrorComponent
        error="Gagal memuat data film. Silakan coba lagi."
        onRetry={() => mutate()}
      />
    );

  if (!movie)
    return (
      <ErrorComponent error="Film tidak ditemukan." onRetry={() => mutate()} />
    );

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Information */}
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-2xl md:text-3xl font-bold">
                    {movie.data.title}
                  </CardTitle>
                  <BookmarkButton
                    title={movie.data.title}
                    url={`/watch/${slug}`}
                    thumbnail={movie.data.thumbnail}
                    rating={movie.data.rating?.value?.toString()}
                    releaseDate={movie.data.releaseDate}
                    genres={movie.data.genres}
                    country={movie.data.country}
                  />
                </div>
                {movie.data.tagline && (
                  <p className="text-muted-foreground italic">
                    {movie.data.tagline}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{movie.data.rated}</Badge>
                  <Badge variant="outline">{movie.data.quality}</Badge>
                  <Badge variant="outline">{movie.data.year}</Badge>
                  {movie.data.rating.count && (
                    <Badge
                      variant="outline"
                      className={getRatingColor(movie.data.rating.count)}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {movie.data.rating.value}/10
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Sinopsis</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {movie.data.description}
                  </p>
                </div>

                {/* Movie Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>{formatViews(movie.data.views)} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{movie.data.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(movie.data.releaseDate).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span>{movie.data.language}</span>
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="font-semibold mb-2">Genre</h3>
                  <div className="flex flex-wrap gap-1">
                    {movie.data.genres.map((genre, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movie Player */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Tonton Film
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={movie.data.playerIframe}
                    className="w-full h-full"
                    allowFullScreen
                    title={movie.data.title}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Poster */}
            <Card>
              <CardContent className="p-4">
                <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4">
                  <Image
                    width={300}
                    height={300}
                    unoptimized
                    referrerPolicy="no-referrer"
                    src={movie.data.thumbnail}
                    alt={movie.data.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <Separator className="my-4" />

                {/* Movie Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Film className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">Sutradara</span>
                      <p className="text-muted-foreground">
                        {movie.data.director}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">Pemeran</span>
                      <p className="text-muted-foreground">
                        {movie.data.actors.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">Negara</span>
                      <p className="text-muted-foreground">
                        {movie.data.country}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tahun</span>
                  <span className="font-medium">{movie.data.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kualitas</span>
                  <span className="font-medium">{movie.data.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{movie.data.rating.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durasi</span>
                  <span className="font-medium">{movie.data.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bahasa</span>
                  <span className="font-medium">{movie.data.language}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchMovieCard;
