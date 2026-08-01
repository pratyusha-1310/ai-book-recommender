import type { Book } from "@/types/book";

interface GoogleBooksApiResponse {
  items?: Array<{
    id?: string;
    volumeInfo?: {
      title?: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
        small?: string;
        medium?: string;
        large?: string;
        extraLarge?: string;
      };
      categories?: string[];
      publishedDate?: string;
      averageRating?: number;
      ratingsCount?: number;
    };
  }>;
}

const DEFAULT_THUMBNAIL =
  "https://via.placeholder.com/128x192?text=No+Cover";

function cleanDescription(description: string): string {
    return description
        .replace(/<br\s*\/?>/gi, "\n") // Replace <br> and <br/> with newlines
        .replace(/<\/p>/gi, "\n\n") // Replace </p> with newlines
        .replace(/<[^>]*>/g, "") // Remove all other HTML tags
        .replace(/&nbsp;/gi, " ") // Replace &nbsp; with space
        .replace(/&amp;/gi, "&") // Replace &amp; with &
        .replace(/&quot;/gi, '"') // Replace &quot; with "
        .replace(/&#39;/gi, "'") // Replace &#39; with '
        .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with two newlines
        .trim(); // Trim leading and trailing whitespace
}
/**
 * Searches the Google Books API for books matching the provided query.
 * Returns a normalized array of books that can be reused across the app.
 */
export async function searchBooks(
  query: string,
  maxResults = 10
): Promise<Book[]> {
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
      throw new Error(
        `Google Books API request failed with status ${response.status}`
      );
    }

    const data = (await response.json()) as GoogleBooksApiResponse;
    const items = data.items ?? [];

    return items.map((item) => {
      const volumeInfo = item.volumeInfo ?? {};
      const imageLinks = volumeInfo.imageLinks;

      const thumbnail =
        imageLinks?.extraLarge ??
        imageLinks?.large ??
        imageLinks?.medium ??
        imageLinks?.small ??
        imageLinks?.thumbnail ??
        imageLinks?.smallThumbnail ??
        DEFAULT_THUMBNAIL;

      const secureThumbnail = thumbnail.replace(
        /^http:\/\//,
        "https://"
      );

      return {
        id: item.id ?? "",
        title: volumeInfo.title ?? "Untitled",
        authors: volumeInfo.authors ?? [],
        description:
          volumeInfo.description ?? "No description available.",
        thumbnail: secureThumbnail,
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
export async function getBookById(id: string): Promise<Book> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Books API key is not configured.");
  }

  const url = new URL(
    `https://www.googleapis.com/books/v1/volumes/${id}`
  );

  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `Google Books API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  const volumeInfo = data.volumeInfo ?? {};
  const imageLinks = volumeInfo.imageLinks;

  const thumbnail =
    imageLinks?.extraLarge ??
    imageLinks?.large ??
    imageLinks?.medium ??
    imageLinks?.small ??
    imageLinks?.thumbnail ??
    imageLinks?.smallThumbnail ??
    DEFAULT_THUMBNAIL;

  const secureThumbnail = thumbnail.replace(
    /^http:\/\//,
    "https://"
  );

  return {
    id: data.id ?? id,
    title: volumeInfo.title ?? "Untitled",
    authors: volumeInfo.authors ?? [],
    description:
      volumeInfo.description ? cleanDescription(volumeInfo.description) : "No description available.",
    thumbnail: secureThumbnail,
    categories: volumeInfo.categories ?? [],
    publishedDate: volumeInfo.publishedDate ?? "Unknown",
    averageRating: volumeInfo.averageRating ?? 0,
    ratingsCount: volumeInfo.ratingsCount ?? 0,
  } satisfies Book;
}