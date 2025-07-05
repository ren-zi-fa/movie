import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

 export const formatRating = (rating: string) => {
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? rating : numRating.toFixed(1);
  };
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
