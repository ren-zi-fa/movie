import { Bookmark } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkState {
  bookmarks: Bookmark[];
  toggleBookmark: (item: Bookmark) => void;
  isBookmarked: (url: string) => boolean;
  clearBookmarks: () => void;
  removeBookmark: (url: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      toggleBookmark: (item) => {
        const current = get().bookmarks;
        const exists = current.some((b) => b.url === item.url);
        const updated = exists
          ? current.filter((b) => b.url !== item.url)
          : [...current, item];
        set({ bookmarks: updated });
      },
      removeBookmark: (url) => {
        const current = get().bookmarks;
        const updated = current.filter((b) => b.url !== url);
        set({ bookmarks: updated });
      },

      isBookmarked: (url) => get().bookmarks.some((b) => b.url === url),
      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: "bookmark-storage",
    }
  )
);
