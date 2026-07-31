// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB16-ZUrmZ7FcjqAER17lfgNALgUkgGDXI",
  authDomain: "ai-book-recommender-1f598.firebaseapp.com",
  projectId: "ai-book-recommender-1f598",
  storageBucket: "ai-book-recommender-1f598.firebasestorage.app",
  messagingSenderId: "588614175253",
  appId: "1:588614175253:web:0a8770e96084b282029c1c"
};

// Initialize Firebase
const app = !getApps().length? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;