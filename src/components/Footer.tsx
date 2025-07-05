"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-900 dark:border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Dibuat oleh{" "}
        <span className="font-semibold text-gray-800 dark:text-white">
          Renzi Febriandika
        </span>
      </div>
    </footer>
  );
}
