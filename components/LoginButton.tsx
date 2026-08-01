"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { ensureUserDocument } from "@/lib/firestore";

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      await ensureUserDocument(result.user);

      console.log("Logged in:", result.user);
      alert(`Welcome ${result.user.displayName}!`);
    } catch (error) {
      console.error(error);
      alert("Google Sign-In failed.");
    }
  };

  if (isCheckingAuth || user) {
    return null;
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}