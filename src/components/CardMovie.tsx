"use client";

import { fetcher } from "@/lib/utils";
import { ApiResponse, Movie } from "@/types";
import useSWR from "swr";
import { useState } from "react";
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
  const [visibleCount, setVisibleCount] = useState(12); // Mulai dengan 12 item
  const ITEMS_PER_PAGE = 12; // Jumlah item yang dimuat setiap kali

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

  // Handle loading state
  if (isLoading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
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

  // Get movies to display (berdasarkan visibleCount)
  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, movies.length));
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Koleksi Film
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Menampilkan {visibleMovies.length} dari {movies.length} film
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {visibleMovies.map((movie,index) => (
          <SingleCard
            key={`${movie.url}-${index}-${movie.title
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
            movie={movie}
            style={{}} // Tidak perlu style untuk grid biasa
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Muat Lebih Banyak ({movies.length - visibleCount} film tersisa)
          </button>
        </div>
      )}

      {/* End message when all items are loaded */}
      {!hasMore && movies.length > ITEMS_PER_PAGE && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Semua film telah dimuat
          </p>
        </div>
      )}
    </div>
  );
}
