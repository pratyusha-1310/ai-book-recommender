"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      </div>
    </main>
  );
}