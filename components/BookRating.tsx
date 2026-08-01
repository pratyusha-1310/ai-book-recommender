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
    <div className="mt-8">
      <h2 className="text-xl font-semibold">
        My Rating
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        How would you rate this book?
      </p>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSaving}
            onClick={() => handleRating(star)}
            className="text-3xl transition hover:scale-110 disabled:opacity-50"
            aria-label={`Rate ${star} out of 5`}
          >
            {star <= rating ? "★" : "☆"}
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {message}
        </p>
      )}
    </div>
  );
}