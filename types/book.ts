export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  categories: string[];
  publishedDate: string;
  averageRating: number;
  ratingsCount: number;
}