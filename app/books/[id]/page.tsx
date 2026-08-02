import Link from "next/link";
import { getBookById } from "@/lib/googleBooks";
import ShelfButtons from "@/components/ShelfButtons";
import BookNotes from "@/components/BookNotes";
import BookRating from "@/components/BookRating";
import BookReview from "@/components/BookReview";
import Navbar from "@/components/Navbar";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Navbar />

        <Link
          href="/books"
          className="inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to Browse Books
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start lg:grid-cols-[220px_1fr] lg:gap-10">
            <div className="flex justify-center sm:justify-start">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="max-h-80 w-auto max-w-full rounded-xl object-contain shadow-md"
              />
            </div>

            <div className="min-w-0">
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
              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-800/50 sm:p-6">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                    My Reading
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Your space for this book
                  </h2>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Manage your shelf, private notes, personal rating, and review.
                  </p>
                </div>

                <div className="space-y-6">
                  <ShelfButtons book={book} />
                  <BookNotes bookId={book.id} />
                  <BookRating bookId={book.id} />
                  <BookReview bookId={book.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}