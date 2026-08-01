"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserBooks,
  type SavedBook,
} from "@/lib/firestore";
import BookCard from "@/components/BookCard";

export default function ShelvesPage() {
  const [books, setBooks] = useState<SavedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoggedIn(false);
        setBooks([]);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const savedBooks = await getUserBooks(user.uid);
        setBooks(savedBooks);
      } catch (error) {
        console.error("Unable to load shelves:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const wantToRead = books.filter(
    (book) => book.shelf === "want-to-read"
  );

  const currentlyReading = books.filter(
    (book) => book.shelf === "currently-reading"
  );

  const finished = books.filter(
    (book) => book.shelf === "finished"
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold tracking-tight">
          My Shelves
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Keep track of the books you want to read, are currently reading,
          and have finished.
        </p>

        {isLoading ? (
          <p className="mt-8">Loading your shelves...</p>
        ) : !isLoggedIn ? (
          <p className="mt-8">
            Please sign in to view your shelves.
          </p>
        ) : (
          <div className="mt-10 space-y-12">
            <ShelfSection
              title="Want to Read"
              books={wantToRead}
            />

            <ShelfSection
              title="Currently Reading"
              books={currentlyReading}
            />

            <ShelfSection
              title="Finished"
              books={finished}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function ShelfSection({
  title,
  books,
}: {
  title: string;
  books: SavedBook[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      {books.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          No books on this shelf yet.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      )}
    </section>
  );
}
