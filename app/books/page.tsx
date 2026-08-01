"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { searchBooks } from "@/lib/googleBooks";
import type { Book } from "@/types/book";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("fiction");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await searchBooks(query, 20);

        if (isMounted) {
          setBooks(results);
        }
      } catch {
        if (isMounted) {
          setError("We couldn’t load books right now. Please try again soon.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBooks();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.28),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <nav className="flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/80 px-6 py-4 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            AI Book Recommender
            </h2>

            <div className="flex gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Link
                    href="/"
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    Home
                </Link>

                <Link
                    href="/books"
                    className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    Browse Books
                </Link>
            </div>
        </nav>
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Discover More
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Browse Books
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Explore a curated collection of fiction titles and discover your next favorite read.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />

                <button
                    onClick={() => {
                    if (searchInput.trim()) {
                        setQuery(searchInput);
                    }
                    }}
                    className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
                >
                    Search
                </button>
            </div>
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              Loading books...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300">
              {error}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id || book.title} book={book} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
