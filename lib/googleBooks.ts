import type { Book } from "@/types/book";

interface GoogleBooksApiResponse {
  items?: Array<{
    id?: string;
    volumeInfo?: {
      title?: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
      categories?: string[];
      publishedDate?: string;
      averageRating?: number;
      ratingsCount?: number;
    };
  }>;
}

const DEFAULT_THUMBNAIL = "https://via.placeholder.com/128x192?text=No+Cover";

/**
 * Searches the Google Books API for books matching the provided query.
 * Returns a normalized array of books that can be reused across the app.
 */
export async function searchBooks(query: string, maxResults = 10): Promise<Book[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Books API key is not configured.");
  }

  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", normalizedQuery);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google Books API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as GoogleBooksApiResponse;
    const items = data.items ?? [];

    return items.map((item) => {
      const volumeInfo = item.volumeInfo ?? {};
      const thumbnail = volumeInfo.imageLinks?.thumbnail ?? DEFAULT_THUMBNAIL;

      return {
        id: item.id ?? "",
        title: volumeInfo.title ?? "Untitled",
        authors: volumeInfo.authors ?? [],
        description: volumeInfo.description ?? "No description available.",
        thumbnail,
        categories: volumeInfo.categories ?? [],
        publishedDate: volumeInfo.publishedDate ?? "Unknown",
        averageRating: volumeInfo.averageRating ?? 0,
        ratingsCount: volumeInfo.ratingsCount ?? 0,
      } satisfies Book;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to load books: ${error.message}`);
    }

    throw new Error("Unable to load books from Google Books API.");
  }
}
