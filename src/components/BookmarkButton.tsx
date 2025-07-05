"use client";

import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Bookmark as BookMarkType } from "@/types";

export default function BookmarkButton(bookmark: BookMarkType) {
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const bookmarked = isBookmarked(bookmark.url);

  return (
    <button
      onClick={() => toggleBookmark(bookmark)}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {bookmarked ? (
        <BookmarkCheck className="text-yellow-500" />
      ) : (
        <Bookmark className="text-blue-400" />
      )}
    </button>
  );
}
