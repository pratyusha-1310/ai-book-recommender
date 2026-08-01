import { type User } from "firebase/auth";
import type { Book } from "@/types/book";
import { collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import app from "./firebase";

export const db = getFirestore(app);

export async function ensureUserDocument(user: User): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return;
  }

  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName ?? null,
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
  });
}
export type ShelfType =
  | "want-to-read"
  | "currently-reading"
  | "finished";

export interface SavedBook extends Book{
    shelf: ShelfType;
}
export async function saveBookToShelf(
  userId: string,
  book: Book,
  shelf: ShelfType
): Promise<void> {
  const bookRef = doc(
    db,
    "users",
    userId,
    "books",
    book.id
  );

  await setDoc(
    bookRef,
    {
      ...book,
      shelf,
      savedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
export async function getUserBooks(
  userId: string
): Promise<SavedBook[]> {
  const booksRef = collection(
    db,
    "users",
    userId,
    "books"
  );

  const snapshot = await getDocs(booksRef);

  return snapshot.docs.map((bookDoc) => {
    const data = bookDoc.data();

    return {
      id: bookDoc.id,
      title: data.title ?? "Untitled",
      authors: data.authors ?? [],
      description: data.description ?? "No description available.",
      thumbnail: data.thumbnail ?? "",
      categories: data.categories ?? [],
      publishedDate: data.publishedDate ?? "Unknown",
      averageRating: data.averageRating ?? 0,
      ratingsCount: data.ratingsCount ?? 0,
      shelf: data.shelf as ShelfType,
    };
  });
}
export async function saveBookNote(
  userId: string,
  bookId: string,
  note: string
): Promise<void> {
  const bookRef = doc(
    db,
    "users",
    userId,
    "books",
    bookId
  );

  await setDoc(
    bookRef,
    {
      note,
      noteUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
export async function saveBookRating(
  userId: string,
  bookId: string,
  rating: number
): Promise<void> {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const bookRef = doc(
    db,
    "users",
    userId,
    "books",
    bookId
  );

  await setDoc(
    bookRef,
    {
      personalRating: rating,
      ratingUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
export async function saveBookReview(
  userId: string,
  bookId: string,
  review: string
): Promise<void> {
  const bookRef = doc(
    db,
    "users",
    userId,
    "books",
    bookId
  );

  await setDoc(
    bookRef,
    {
      review,
      reviewUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
export interface BookPersonalData {
  note: string;
  personalRating: number;
  review: string;
}

export async function getBookPersonalData(
  userId: string,
  bookId: string
): Promise<BookPersonalData> {
  const bookRef = doc(
    db,
    "users",
    userId,
    "books",
    bookId
  );

  const bookSnap = await getDoc(bookRef);

  if (!bookSnap.exists()) {
    return {
      note: "",
      personalRating: 0,
      review: "",
    };
  }

  const data = bookSnap.data();

  return {
    note: data.note ?? "",
    personalRating: data.personalRating ?? 0,
    review: data.review ?? "",
  };
}