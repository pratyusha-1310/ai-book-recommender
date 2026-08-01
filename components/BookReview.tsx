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
    <div className="mt-8">
      <h2 className="text-xl font-semibold">
        My Review
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Write your personal review of this book.
      </p>

      <textarea
        value={review}
        onChange={(event) => setReview(event.target.value)}
        placeholder="What did you think about this book?"
        rows={6}
        className="mt-4 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Review"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {message}
        </p>
      )}
    </div>
  );
}