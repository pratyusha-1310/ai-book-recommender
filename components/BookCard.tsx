import Link from "next/link";
import type { Book } from "@/types/book";

export default function BookCard({ book, matchReason}: { book: Book; matchReason?: string }) {
  return (
    <Link href={`/books/${book.id}`}className="block">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {matchReason && (
            <div className="rounded-xl bg-indigo-50 px-3 py-2 dark:bg-indigo-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
                ✨ Why this matches
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {matchReason}
                </p>
            </div>
            )}
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                <img
                src={book.thumbnail || "/placeholder-book.jpg"}
                alt={book.title || "Book cover"}
                className="h-full w-full object-contain"
                />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {book.title || "Untitled Book"}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                by {book.authors?.length
                    ? book.authors.join(", ")
                    : "Unknown Author"}
                </p>

                {book.categories?.length > 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {book.categories.join(", ")}
                </p>
                )}

                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                {book.description
                    ? book.description.length > 120
                    ? `${book.description.substring(0, 120)}...`
                    : book.description
                    : "No description available for this book."}
                </p>
            </div>
        </div>
    </Link>
  );
}