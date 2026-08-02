"use client";

import {useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {getBookPersonalData, saveBookReview } from "@/lib/firestore";

export default function BookReview({
  bookId,
}: {
  bookId: string;
}) {
  const [review, setReview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const loadReview = async () => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    try {
      const data = await getBookPersonalData(
        user.uid,
        bookId
      );

      setReview(data.review);
    } catch (error) {
      console.error("Unable to load review:", error);
    }
  };

  void loadReview();
}, [bookId]);

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in to save a review.");
      return;
    }

    if (!review.trim()) {
      setMessage("Write a review before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      await saveBookReview(
        user.uid,
        bookId,
        review.trim()
      );

      setMessage("Review saved!");
    } catch (error) {
      console.error("Unable to save review:", error);
      setMessage("Unable to save your review. Please try again.");
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
          My Review
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Write your personal thoughts and overall impression of this book.
        </p>
      </div>

      <textarea
        value={review}
        onChange={(event) => {
          setReview(event.target.value);
          setMessage("");
        }}
        placeholder="What did you think about this book?"
        rows={6}
        className="mt-4 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : review.trim() ? "Save Review" : "Add Review"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message === "Review saved!"
                ? "font-medium text-emerald-600 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {message === "Review saved!" ? "✓ Review saved" : message}
          </p>
        )}
      </div>
    </section>
  );
}