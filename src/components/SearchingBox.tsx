"use client";

import { Input } from "@/components/ui/input";
import { SearchMovie, ApiResponse } from "@/types";
import useSWR from "swr";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  fromEvent,
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
} from "rxjs";
import Image from "next/image";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { data, isLoading } = useSWR<ApiResponse<SearchMovie[]>>(
    enabled ? `/api/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const subscription = fromEvent(inputEl, "input")
      .pipe(
        map((e) => (e.target as HTMLInputElement).value),
        debounceTime(400),
        distinctUntilChanged(),
        filter((text) => text.length >= 2)
      )
      .subscribe((val) => {
        setQuery(val);
        setEnabled(true);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const results = data?.data || [];

  return (
    <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
      <Input
        ref={inputRef}
        placeholder="Search movies..."
        className="pl-3 pr-3"
        onFocus={() => setIsFocused(true)}
      />

      {isFocused && query && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading...
            </div>
          ) : results.length > 0 ? (
            results.map((movie) => {
              const url = movie.url;
              const slug = url.replace(
                process.env.NEXT_PUBLIC_TARGET_URL as string,
                ""
              );
              return (
                <Link
                  key={movie.url}
                  href={`/watch/${slug}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Image
                    width={100}
                    height={100}
                    unoptimized
                    referrerPolicy="no-referrer"
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded mr-3"
                  />
                  <div>
                    <div className="font-medium text-sm">{movie.title}</div>
                    <div className="text-xs text-gray-500">
                      {movie.director}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
