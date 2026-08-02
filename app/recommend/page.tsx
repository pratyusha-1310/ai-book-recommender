"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { searchBooks } from "@/lib/googleBooks";
import type { Book } from "@/types/book";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserBooks, type SavedBook } from "@/lib/firestore";


const moods = [
  "Relaxing",
  "Emotional",
  "Adventurous",
  "Mysterious",
  "Inspiring",
  "Romantic",
];

const genres = [
  { name: "Fantasy", emoji: "🪄" },
  { name: "Mystery", emoji: "🕵️‍♂️" },
  { name: "Romance", emoji: "💗" },
  { name: "Science Fiction", emoji: "🚀" },
  { name: "Thriller", emoji: "🗡️" },
  { name: "Historical Fiction", emoji: "📜" },
  { name: "Self-Help", emoji: "📚" },
  { name: "Biography", emoji: "👤" },
];


export default function RecommendPage() {
  const [mood, setMood] = useState("");
  const [genresSelected, setGenresSelected] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [readingHistory, setReadingHistory] = useState<SavedBook[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setReadingHistory([]);
        return;
      }

      try {
        const books = await getUserBooks(user.uid);
        setReadingHistory(books);
      } catch (error) {
        console.error("Unable to load reading history:", error);
      }
    });

    return () => unsubscribe();
  }, []);


  const toggleGenre = (genre: string) => {
  setGenresSelected((current) =>
    current.includes(genre)
      ? current.filter((item) => item !== genre)
      : [...current, genre]
  );
  };
    const getMatchReason = (book: Book) => {
    const description = book.description?.toLowerCase() ?? "";
    const categories = book.categories ?? [];

    const matchingGenre = genresSelected.find((genre) =>
        categories.some((category) =>
        category.toLowerCase().includes(genre.toLowerCase())
        )
    );

    if (matchingGenre && mood) {
        return `A ${matchingGenre.toLowerCase()} pick that fits your ${mood.toLowerCase()} reading mood.`;
    }

    if (matchingGenre) {
        return `A strong match for your interest in ${matchingGenre.toLowerCase()}.`;
    }

    if (mood === "Mysterious" && (
        description.includes("mystery") ||
        description.includes("secret") ||
        description.includes("crime")
    )) {
        return "Its mystery and secrets fit the intriguing atmosphere you're looking for.";
    }

    if (mood === "Adventurous" && (
        description.includes("adventure") ||
        description.includes("journey") ||
        description.includes("quest")
    )) {
        return "Its journey-driven story makes it a natural match for an adventurous mood.";
    }

    if (mood === "Romantic" && (
        description.includes("love") ||
        description.includes("romance") ||
        description.includes("relationship")
    )) {
        return "Its focus on love and relationships suits the romantic mood you selected.";
    }

    if (mood === "Emotional" && (
        description.includes("family") ||
        description.includes("life") ||
        description.includes("loss")
    )) {
        return "Its personal themes could suit the emotional reading experience you're after.";
    }

    if (mood === "Inspiring" && (
        description.includes("life") ||
        description.includes("success") ||
        description.includes("change")
    )) {
        return "Its themes of growth and change make it a promising inspirational read.";
    }

    if (mood === "Relaxing") {
        return "A potentially gentler pick for the relaxed reading mood you selected.";
    }

    if (description.trim()) {
      return "This book shares themes with the reading experience you described.";
    }

    const historyGenres = readingHistory
      .flatMap((savedBook) => savedBook.categories ?? [])
      .map((category) => category.toLowerCase());

    const historyMatch = book.categories?.find((category) =>
      historyGenres.some(
        (historyGenre) =>
          category.toLowerCase().includes(historyGenre) ||
          historyGenre.includes(category.toLowerCase())
      )
    );

    if (historyMatch) {
      return `Recommended because you've previously shown interest in ${historyMatch.toLowerCase()} books.`;
    }

    return "A promising match based on your current reading preferences.";
  };
  const handleFindBooks = async () => {
  if (!mood && genresSelected.length === 0 && !description.trim()) {
    setError(
      "Choose a mood, select at least one genre, or describe what you want to read."
    );
    return;
  }

  try {
    setIsLoading(true);
    setError("");
    const highlyRatedCategories = readingHistory
      .filter((book) => book.personalRating >= 4)
      .flatMap((book) => book.categories ?? []);
    const finishedCategories = readingHistory
      .filter((book) => book.shelf === "finished")
      .flatMap((book) => book.categories ?? []);

    const currentlyReadingCategories = readingHistory
      .filter((book) => book.shelf === "currently-reading")
      .flatMap((book) => book.categories ?? []);

    const wantToReadCategories = readingHistory
      .filter((book) => book.shelf === "want-to-read")
      .flatMap((book) => book.categories ?? []);

    const historyCategories = Array.from(
      new Set([
        ...highlyRatedCategories,
        ...finishedCategories,
        ...currentlyReadingCategories,
        ...wantToReadCategories,
      ])
    ).slice(0, 3);

    const searchParts = [
      ...genresSelected,
      mood,
      description.trim(),
      ...historyCategories,
    ].filter(Boolean);
    const searchQuery = searchParts.join(" ");

    const results = await searchBooks(searchQuery, 20);

    const savedBookIds = new Set(
      readingHistory.map((book) => book.id)
    );

    const newRecommendations = results
      .filter((book) => !savedBookIds.has(book.id))
      .slice(0, 12);

    setRecommendations(newRecommendations);

    if (newRecommendations.length === 0) {
      setError(
        "We couldn't find a good match. Try changing your preferences."
      );
    }
  } catch (error) {
    console.error("Unable to find recommendations:", error);

    setError(
      "We couldn't load recommendations right now. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.28),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <Navbar />

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            AI Recommendations
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            What are you in the mood to read?
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Tell us what you're looking for and we'll find books that match
            your reading mood.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Choose your mood</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {moods.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMood(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    mood === item
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Choose a genre</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {genres.map((genre) => {
                const isSelected = genresSelected.includes(genre.name);

                return (
                  <button
                    key={genre.name}
                    type="button"
                    onClick={() => toggleGenre(genre.name)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {genre.name} {genre.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Anything specific you're looking for?
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Optional — describe the kind of story, theme, or reading
              experience you want.
            </p>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="For example: I want something magical and comforting with strong friendships..."
              rows={4}
              className="mt-4 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={handleFindBooks}
            disabled={isLoading}
            className="mt-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Finding books..." : "✨ Find My Books"}
          </button>
          {error && (
            <p className="mt-4 text-sm font-medium text-amber-700 dark:text-amber-300">
                {error}
            </p>
          )}
        </section>
        {recommendations.length > 0 && (
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8">
            <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                Recommended For You
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
                Books matching your reading mood
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Based on your selected mood, genres, and reading preferences.
            </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((book) => (
                <BookCard
                key={book.id || book.title}
                book={book}
                matchReason={getMatchReason(book)}  
                />
            ))}
            </div>
        </section>
        )}
      </div>
    </main>
  );
}