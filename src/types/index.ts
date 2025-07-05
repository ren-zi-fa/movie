export interface Movie {
  title: string;
  url: string;
  trailer: string;
  thumbnail: string;
  watchLink: string;
  rating: string;
  releaseDate: string;
  director: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface MostView {
  title: string;
  url: string;
  thumbnail: string;
  genres: string[];
  country: string;
}

type Rating = {
  value: number;
  count: number;
};
export interface WatchMovie {
  title: string;
  thumbnail: string;
  description: string;
  rating: Rating;
  views: number;
  tagline: string;
  rated: string;
  quality: string;
  year: number;
  duration: string;
  releaseDate: string;
  language: string;
  country: string;
  director: string;
  actors: string[];
  genres: string[];
  playerIframe: string;
}

export interface SearchMovie {
  title: string;
  url: string;
  trailer: string;
  genres: string[];
  thumbnail: string;
  watchLink: string;
  rating: string;
  releaseDate: string;
  director: string;
  country: string;
  duration: string;
}

export interface Country {
  title: string;
  url: string;
  trailer: string;
  genres: string[];
  thumbnail: string;
  watchLink: string;
  rating: string;
  releaseDate: string;
  director: string;
}

export interface Bookmark {
  title: string;
  url: string;
  thumbnail: string;
  rating?: string;
  releaseDate?: string;
  genres?: string[];
  country?: string;
}
