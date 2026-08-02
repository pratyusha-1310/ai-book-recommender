"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getBookPersonalData, saveBookNote } from "@/lib/firestore";

export default function BookNotes({
  bookId,
}: {
  bookId: string;
}) {
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const loadNote = async () => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    try {
      const data = await getBookPersonalData(
        user.uid,
        bookId
      );

      setNote(data.note);
    } catch (error) {
      console.error("Unable to load note:", error);
    }
  };

  void loadNote();
}, [bookId]);

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in to save a note.");
      return;
    }

    if (!note.trim()) {
      setMessage("Write a note before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      await saveBookNote(
        user.uid,
        bookId,
        note.trim()
      );

      setMessage("Note saved!");
    } catch (error) {
      console.error("Unable to save note:", error);
      setMessage("Unable to save your note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/70 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
          Private
        </p>

        <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
          My Notes
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep personal thoughts, reminders, or memorable moments from this book.
        </p>
      </div>

      <textarea
        value={note}
        onChange={(event) => {
          setNote(event.target.value);
          setMessage("");
        }}
        placeholder="Write your thoughts, reminders, or favorite moments..."
        rows={5}
        className="mt-4 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : note.trim() ? "Save Note" : "Add Note"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message === "Note saved!"
                ? "font-medium text-emerald-600 dark:text-emerald-400"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {message === "Note saved!" ? "✓ Note saved" : message}
          </p>
        )}
      </div>
    </section>
  );
}