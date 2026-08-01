import type { Book } from "@/types/book";

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="h-64 w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-700">
        <img
          src={book.thumbnail || "/placeholder-book.jpg"}
          alt={book.title || "Book cover"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {book.title || "Untitled Book"}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          by {book.authors?.length ? book.authors.join(", ") : "Unknown Author"}
        </p>

        {book.categories?.length > 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {book.categories.join(", ")}
          </p>
        )}

        <p className="text-base text-slate-700 dark:text-slate-300">
          {book.description
            ? book.description.length > 120
              ? `${book.description.substring(0, 120)}...`
              : book.description
            : "No description available for this book."}
        </p>
      </div>
    </div>
  );
}