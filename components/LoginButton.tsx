"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { ensureUserDocument } from "@/lib/firestore";

export default function LoginButton() {
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

  return (
    <button
      onClick={handleGoogleSignIn}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
    >
      Sign in with Google
    </button>
  );
}