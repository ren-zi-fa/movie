"use client";

import React from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BookmarkButton from "@/components/BookmarkButton";
import { formatRating } from "@/lib/utils";
import Image from "next/image";

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks } = useBookmarkStore();

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Bookmark</h1>
        {bookmarks.length > 0 && (
          <Button variant="destructive" onClick={clearBookmarks}>
            Hapus Semua
          </Button>
        )}
      </div>

      <Separator className="mb-6" />

      {bookmarks.length === 0 ? (
        <p className="text-muted-foreground text-center">
          Belum ada bookmark disimpan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookmarks.map((movie) => (
            <Card key={movie.url} className="flex flex-col overflow-hidden">
              {/* Thumbnail */}
              <div className="relative w-auto">
                <Image
                  width={100}
                  height={100}
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="object-cover w-auto h-auto mx-auto"
                  referrerPolicy="no-referrer"
                />

                {/* Bookmark button (pojok kiri atas) */}
                <div className="absolute top-1 left-4 z-20">
                  <BookmarkButton
                    title={movie.title}
                    url={`/watch${movie.url}`}
                    thumbnail={movie.thumbnail}
                    rating={movie.rating}
                    releaseDate={movie.releaseDate}
                  />
                </div>
              </div>

              {/* Header: Judul dan Rating */}
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">
                  {movie.title}
                </CardTitle>

                {movie.rating && (
                  <div className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>{formatRating(movie.rating)}</span>
                  </div>
                )}
              </CardHeader>

              {/* Konten: Genre, Tanggal, Tombol */}
              <CardContent className="flex flex-col gap-2">
                {movie.genres && movie.genres.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {movie.genres.join(", ")}
                  </p>
                )}

                {movie.releaseDate && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(movie.releaseDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                <Link
                  href={movie.url}
                  className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-sm text-center py-2 px-3 rounded-md transition"
                >
                  Tonton
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
