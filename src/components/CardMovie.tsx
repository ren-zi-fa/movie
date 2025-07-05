"use client";

import { fetcher } from "@/lib/utils";
import { ApiResponse, Movie } from "@/types";
import useSWR from "swr";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import MovieCardSkeleton from "./SkeletonLoading";
import { SingleCard } from "./SingleCard";

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Gagal memuat film
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Terjadi kesalahan saat mengambil data film
      </p>
    </div>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Coba Lagi
    </button>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Tidak ada film ditemukan
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Belum ada film yang tersedia saat ini
      </p>
    </div>
  </div>
);

export default function CardMovie() {
  const { data, isLoading, error, mutate } = useSWR<ApiResponse<Movie[]>>(
    "/api/home",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  // Calculate responsive grid dimensions
  const calculateGridConfig = (width: number) => {
    let columnCount = 5;
    let cardWidth = 280;
    const cardHeight = 380; // Increased height for better content fit

    if (width < 640) {
      // Mobile
      columnCount = 1;
      cardWidth = width - 32; // Account for padding
    } else if (width < 768) {
      // Tablet portrait
      columnCount = 2;
      cardWidth = (width - 48) / 2; // Account for gaps
    } else if (width < 1024) {
      // Tablet landscape
      columnCount = 3;
      cardWidth = (width - 64) / 3;
    } else if (width < 1280) {
      // Desktop small
      columnCount = 4;
      cardWidth = (width - 80) / 4;
    } else {
      // Desktop large
      columnCount = 5;
      cardWidth = (width - 96) / 5;
    }

    return { columnCount, cardWidth, cardHeight };
  };

  // Handle loading state
  if (isLoading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState onRetry={() => mutate()} />
      </div>
    );
  }

  const movies = data.data;

  // Handle empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Koleksi Film
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ditemukan {movies.length} film
        </p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <AutoSizer>
          {({ height, width }) => {
            const { columnCount, cardWidth, cardHeight } =
              calculateGridConfig(width);
            const rowCount = Math.ceil(movies.length / columnCount);

            return (
              <Grid
                columnCount={columnCount}
                columnWidth={cardWidth}
                height={height}
                rowCount={rowCount}
                rowHeight={cardHeight}
                width={width}
                style={{
                  overflowX: "hidden",
                }}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const index = rowIndex * columnCount + columnIndex;
                  if (index >= movies.length) return null;

                  const movie = movies[index];
                  return (
                    <SingleCard key={movie.url} movie={movie} style={style} />
                  );
                }}
              </Grid>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}
