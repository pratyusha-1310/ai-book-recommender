"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import {getReadingGoals, saveReadingGoals, getUserBooks} from "@/lib/firestore";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingGoalsEnabled, setReadingGoalsEnabled] = useState(false);
  const [bookGoal, setBookGoal] = useState(12);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [goalMessage, setGoalMessage] = useState("");
  const [finishedBooksCount, setFinishedBooksCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const [goals, savedBooks] = await Promise.all([
            getReadingGoals(currentUser.uid),
            getUserBooks(currentUser.uid),
          ]);

          setReadingGoalsEnabled(goals.enabled);
          setBookGoal(goals.bookGoal);

          const finishedBooks = savedBooks.filter(
            (book) => book.shelf === "finished"
          );

          setFinishedBooksCount(finishedBooks.length);
        } catch (error) {
          console.error("Unable to load reading data:", error);
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveReadingGoals = async () => {
    if (!user) {
      setGoalMessage("Please sign in to save reading goals.");
      return;
    }

    if (bookGoal < 1) {
      setGoalMessage("Your reading goal must be at least 1 book.");
      return;
    }

    try {
      setIsSavingGoal(true);
      setGoalMessage("");

      await saveReadingGoals(
        user.uid,
        readingGoalsEnabled,
        bookGoal
      );

      setGoalMessage("Reading goal saved!");
    } catch (error) {
      console.error("Unable to save reading goals:", error);
      setGoalMessage("Unable to save your reading goal.");
    } finally {
      setIsSavingGoal(false);
    }
  };

  const readingProgress =
  bookGoal > 0
    ? Math.min(
        Math.round((finishedBooksCount / bookGoal) * 100),
        100
      )
    : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Navbar />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Settings
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your account and reading preferences.
          </p>

          {isLoading ? (
            <p className="mt-8 text-sm text-slate-500">
              Loading account...
            </p>
          ) : user ? (
            <div className="mt-8 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Signed in as
              </p>

              <p className="mt-2 font-semibold">
                {user.displayName ?? "Reader"}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">
                Sign in to manage your account settings.
              </p>
            </div>
          )}
        </section>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                Reading Preferences
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Reading Goals
              </h2>
              <div className="mt-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Your Progress
                  </p>

                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {readingProgress}%
                  </p>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {finishedBooksCount} of {bookGoal} books completed
                </p>
              </div>
              <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
                Set an optional reading goal for yourself. This is simply a gentle
                way to keep track of what you would like to read — no streaks,
                competition, or pressure.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setReadingGoalsEnabled((current) => !current)
              }
              aria-pressed={readingGoalsEnabled}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                readingGoalsEnabled
                  ? "bg-indigo-600"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
                  readingGoalsEnabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {readingGoalsEnabled && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
              <label
                htmlFor="bookGoal"
                className="font-semibold text-slate-900 dark:text-white"
              >
                Books I'd like to read
              </label>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose a comfortable personal goal. You can change it whenever you
                want.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <input
                  id="bookGoal"
                  type="number"
                  min="1"
                  max="500"
                  value={bookGoal}
                  onChange={(event) =>
                    setBookGoal(Number(event.target.value))
                  }
                  className="w-28 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
                />

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  books
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                A goal is just a guide — reading at your own pace is what matters.
              </p>
            </div>
          )}
          {user && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleSaveReadingGoals}
                disabled={isSavingGoal}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingGoal ? "Saving..." : "Save Reading Goal"}
              </button>

              {goalMessage && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {goalMessage === "Reading goal saved!"
                    ? "✓ Reading goal saved"
                    : goalMessage}
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}