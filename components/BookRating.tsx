"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getBookPersonalData, saveBookRating } from "@/lib/firestore";

export default function BookRating({
  bookId,
}: {
  bookId: string;
}) {
  const [rating, setRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

useEffect(() => {
  const loadRating = async () => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    try {
      const data = await getBookPersonalData(
        user.uid,
        bookId
      );

      setRating(data.personalRating);
    } catch (error) {
      console.error("Unable to load rating:", error);
    }
  };

  void loadRating();
}, [bookId]);

  const handleRating = async (newRating: number) => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in to rate this book.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      await saveBookRating(
        user.uid,
        bookId,
        newRating
      );

      setRating(newRating);
      setMessage("Rating saved!");
    } catch (error) {
      console.error("Unable to save rating:", error);
      setMessage("Unable to save your rating. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/70 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
          Personal
        </p>

        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
          My Rating
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          How would you rate this book?
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSaving}
              onClick={() => handleRating(star)}
              className="text-3xl text-amber-500 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Rate ${star} out of 5`}
            >
              {star <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>

        {rating > 0 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {rating} / 5
          </span>
        )}
      </div>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message === "Rating saved!"
              ? "font-medium text-emerald-600 dark:text-emerald-400"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {message === "Rating saved!" ? "✓ Rating saved" : message}
        </p>
      )}
    </section>
  );
}