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
    <div className="mt-8">
      <h2 className="text-xl font-semibold">
        My Notes
      </h2>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Keep private notes about this book.
      </p>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Write your thoughts, reminders, or favorite moments..."
        rows={5}
        className="mt-4 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Note"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {message}
        </p>
      )}
    </div>
  );
}