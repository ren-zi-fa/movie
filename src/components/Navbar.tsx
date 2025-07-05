"use client";

import Link from "next/link";
import SearchBox from "./SearchingBox";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Kiri: Logo atau Judul */}
        <Link
          href="/"
          className="text-xl font-semibold text-gray-900 dark:text-white"
        >
          🎬 Bajakin
        </Link>

        {/* Kanan: Search Box */}
        <div className="w-full max-w-sm">
          <SearchBox />
        </div>
      </div>
      
    </header>
  );
}
