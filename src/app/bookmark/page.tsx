"use client";

import React from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BookmarkButton from "@/components/BookmarkButton";
import { Star } from "lucide-react";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {bookmarks.map((movie) => (
            <Card key={movie.url} className="flex flex-col overflow-hidden">
              <div className="relative w-full aspect-[3/2]">
                <Image
                  src={movie.thumbnail}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 z-10">
                  <BookmarkButton {...movie} />
                </div>
                {movie.rating && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {movie.rating}
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">
                  {movie.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  {movie.releaseDate}
                </p>
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
