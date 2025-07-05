"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

const categories = [
  { name: "Korea", href: "/category/korea" },
  { name: "China", href: "/category/china" },
  { name: "Filipina", href: "/category/philippines" },
];

export default function SecondNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-background border-t border-b py-2">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Kategori */}
        <div className="flex justify-center gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-full transition-colors",
                pathname === cat.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Bookmark Button */}
        <Link
          href="/bookmark"
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition"
          title="Lihat Bookmark"
        >
          <Bookmark className="w-5 h-5" />
          <span className="hidden sm:inline">Bookmark</span>
        </Link>
      </div>
    </nav>
  );
}
