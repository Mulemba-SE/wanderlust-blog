export enum Category {
  Adventure = "Adventure",
  Culture = "Culture",
  Food = "Food",
  Nature = "Nature",
  City = "City",
}

export type ID = string;
export type Slug = string;

export interface Author {
  id: ID;
  name: string;
  avatar: string;
  bio: string;
}

export interface Post {
  id: ID;
  slug: Slug;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  tags: string[];
}
