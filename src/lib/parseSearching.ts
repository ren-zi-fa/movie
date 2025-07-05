import { SearchMovie } from "@/types";
import * as cheerio from "cheerio";

export function parsedSearchMovie(html: string): SearchMovie[] {
  const $ = cheerio.load(html);
  const movies: SearchMovie[] = [];

  $("#gmr-main-load article").each((_, el) => {
    const element = $(el);

    const url = element.find(".entry-title a").attr("href") ?? "";
    const title = element.find(".entry-title a").text().trim();
    const trailer = element.find(".gmr-trailer-popup").attr("href") ?? "";
    const thumbnail = element.find("img").attr("src") ?? "";
    const rating = element
      .find(".gmr-rating-item")
      .text()
      .replace(/[^0-9.]/g, "")
      .trim();
    const duration = element.find(".gmr-duration-item").text().trim(); // optional if needed
    const watchLink = url; // fallback if no explicit watch button on this page
    const releaseDate =
      element.find('time[itemprop="dateCreated"]').attr("datetime") ?? "";
    const director = element
      .find('[itemprop="director"] [itemprop="name"]')
      .text()
      .trim();
    const genres: string[] = [];
    element.find('.gmr-movie-on a[rel="category tag"]').each((_, genreEl) => {
      genres.push($(genreEl).text().trim());
    });

    const country = element
      .find('[itemprop="contentLocation"] a')
      .text()
      .trim();

    movies.push({
      title,
      country,
      duration,
      url,
      trailer,
      thumbnail,
      watchLink,
      rating,
      genres,
      releaseDate,
      director,
    });
  });

  return movies;
}
