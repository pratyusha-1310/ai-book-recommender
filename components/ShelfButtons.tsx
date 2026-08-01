"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  saveBookToShelf,
  type ShelfType,
} from "@/lib/firestore";
import type { Book } from "@/types/book";

export default function ShelfButtons({ book }: { book: Book }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (shelf: ShelfType) => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in to save books to your shelves.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      await saveBookToShelf(user.uid, book, shelf);

      setMessage("Book saved to your shelf!");
    } catch {
      setMessage("Unable to save this book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">
        Add to My Shelf
      </h2>

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSave("want-to-read")}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          Want to Read
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSave("currently-reading")}
          className="rounded-xl border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950"
        >
          Currently Reading
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSave("finished")}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Finished
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {message}
        </p>
      )}
    </div>
  );
}