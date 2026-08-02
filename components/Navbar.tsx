"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged,signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { ensureUserDocument } from "@/lib/firestore";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setIsCheckingAuth(false);
  });


    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
        await signOut(auth);
        setIsProfileOpen(false);
    } catch (error) {
        console.error("Unable to sign out:", error);
    }
  };

  const handleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);

        await ensureUserDocument(result.user);
    } catch (error) {
        console.error("Google Sign-In failed:", error);
    }
  };

  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Browse Books",
      href: "/books",
    },
    {
      label: "Recommendations",
      href: "/recommend",
    },
    {
      label: "My Shelves",
      href: "/shelves",
    },
  ];

  return (
    <header className="relative z-50 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/80 sm:px-6">      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-lg font-semibold text-white">
            AI
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
              AI Book Recommender
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Find your next chapter
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
            {navItems.map((item) => {
                const isActive =
                    item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                            isActive
                                ? "bg-indigo-600 text-white"
                                : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                            }`}>
                        {item.label}
                    </Link>
                );
            })}

            {!isCheckingAuth && user && (
                <div className="relative ml-1">
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((current) => !current)}
                        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        aria-label="Open profile"
                        aria-expanded={isProfileOpen}
                        >
                        {user.photoURL ? (
                            <img
                            src={user.photoURL}
                            alt="Profile"
                            className="h-full w-full object-cover"
                            />
                        ) : (
                            user.displayName?.charAt(0).toUpperCase() ?? "U"
                        )}
                    </button>

                    {isProfileOpen && (
                    <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                {user.displayName?.charAt(0).toUpperCase() ?? "U"}
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900 dark:text-white">
                                    {user.displayName ?? "Reader"}
                                </p>

                                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

                            <Link
                                href="/settings"
                                onClick={() => setIsProfileOpen(false)}
                                className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                ⚙️ Settings
                            </Link>

                            <button
                                type="button"
                                onClick ={ handleSignOut }
                                className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
            {!isCheckingAuth && !user && (
                <button
                    type="button"
                    onClick={handleSignIn}
                    className="ml-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    Sign In
                </button>
            )}
        </nav>
        <button
        type="button"
        onClick={() => setIsMobileMenuOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isMobileMenuOpen}
        >
        {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}

            {!isCheckingAuth && user && (
              <>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  ⚙️ Settings
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            )}

            {!isCheckingAuth && !user && (
              <button
                type="button"
                onClick={handleSignIn}
                className="mt-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    
    </header>
  );
}