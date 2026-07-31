import LoginButton from "@/components/LoginButton";
const featuredBooks = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Contemporary Fiction",
    blurb: "A moving story about choices, regret, and the lives we could have lived.",
    accent: "from-fuchsia-500 to-purple-600",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Improvement",
    blurb: "Practical, evidence-based strategies to build better routines and lasting change.",
    accent: "from-sky-500 to-cyan-600",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    blurb: "A sweeping, thought-provoking journey through human history and civilization.",
    accent: "from-emerald-500 to-lime-600",
  },
];

const genres = ["Fantasy", "Sci-Fi", "Romance", "Biography", "Thriller", "Self-Help"];

const testimonials = [
  {
    quote:
      "It feels like the app knows my reading soul. Every recommendation is spot on.",
    name: "Maya Chen",
    role: "Book lover",
  },
  {
    quote:
      "I discovered authors I never would have found on my own. It is beautifully curated.",
    name: "Daniel Brooks",
    role: "Design Lead",
  },
  {
    quote:
      "The recommendations are thoughtful, elegant, and always match my mood perfectly.",
    name: "Ava Patel",
    role: "Product Designer",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.28),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:gap-8">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-lg font-semibold text-white">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                AI Book Recommender
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Curated for your next favorite read</p>
            </div>
          </div>
          <a
            href="#featured"
            className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            Explore Books
          </a>
        </header>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                ✨ Smart recommendations for every mood
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Find Your Next Favourite Book With AI
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                Discover beautifully matched books through intelligent, personalized recommendations tailored to your taste, mood, and curiosity.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#featured"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Get Started
                </a>
                <a
                  href="#genres"
                  className="rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Explore Books
                </a>
              </div>

              <div className="mt-4">
                <LoginButton />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl dark:border-slate-800">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Today’s match</p>
                  <p className="text-xl font-semibold">“Curious & reflective”</p>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                  98% match
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">Recommended for you</p>
                <h2 className="mt-2 text-2xl font-semibold">The Art of Possibility</h2>
                <p className="mt-2 text-sm text-white/80">
                  A thoughtful read blending inspiration, deep reflection, and beautifully layered storytelling.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mood</p>
                  <p className="mt-1 font-semibold">Calm</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Genre</p>
                  <p className="mt-1 font-semibold">Inspiration</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Length</p>
                  <p className="mt-1 font-semibold">Medium</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Premium experience</p>
              <h2 className="mt-2 text-2xl font-semibold">Go beyond browsing with a smarter reading journey.</h2>
            </div>
            <a href="#featured" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90">
              Discover More
            </a>
          </div>
        </section>

        <section id="featured" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Featured Books
                </p>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Popular picks this week</h3>
              </div>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                View all
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featuredBooks.map((book) => (
                <article
                  key={book.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`h-24 rounded-2xl bg-gradient-to-br ${book.accent}`} />
                  <div className="mt-4">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{book.category}</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{book.title}</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by {book.author}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{book.blurb}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">How it works</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Three simple steps to your next favorite book</h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">1. Share your vibe</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Tell us your favorite genres, themes, and reading energy.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">2. Let AI curate</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">We match your taste with thoughtful, high-quality recommendations.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">3. Start reading</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Save your favorites and build your perfect reading list.</p>
              </div>
            </div>
          </aside>
        </section>

        <section id="genres" className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Trending Genres
              </p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Popular themes readers are loving right now</h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Explore curated genres powered by AI, from literary fiction to fast-paced thrillers and personal growth.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {genres.map((genre) => (
              <div
                key={genre}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{genre}</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    Trending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Testimonials
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Loved by readers everywhere</h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">“{item.quote}”</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 rounded-[2rem] border border-white/70 bg-white/70 px-6 py-5 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AI Book Recommender. Discover your next chapter.</p>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              Instagram
            </a>
            <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              Twitter
            </a>
            <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}