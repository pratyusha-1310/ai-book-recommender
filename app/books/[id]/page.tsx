import Link from "next/link";
import { getBookById } from "@/lib/googleBooks";
import ShelfButtons from "@/components/ShelfButtons";
import BookNotes from "@/components/BookNotes";
import BookRating from "@/components/BookRating";
import BookReview from "@/components/BookReview";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/books"
          className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to Browse Books
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex shrink-0 justify-center md:w-64">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="max-h-96 w-auto rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {book.title}
              </h1>

              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                by{" "}
                {book.authors.length
                  ? book.authors.join(", ")
                  : "Unknown Author"}
              </p>

              {book.categories.length > 0 && (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Genre: {book.categories.join(", ")}
                </p>
              )}

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Published: {book.publishedDate}
              </p>

              {book.averageRating > 0 && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  ⭐ {book.averageRating} / 5
                  {book.ratingsCount > 0
                    ? ` (${book.ratingsCount} ratings)`
                    : ""}
                </p>
              )}

              <div className="mt-8">
                <h2 className="text-xl font-semibold">
                  Synopsis
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">
                  {book.description}
                </p>
              </div>
              <ShelfButtons book={book} />
              <BookNotes bookId={book.id} />
              <BookRating bookId={book.id} />
              <BookReview bookId={book.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}