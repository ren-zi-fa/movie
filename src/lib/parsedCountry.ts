import * as cheerio from "cheerio";
import { Country } from "@/types";

export function parseCountry(html: string): Country[] {
  const $ = cheerio.load(html);
  const movies: Country[] = [];

  $("#gmr-main-load article").each((_, el) => {
    const element = $(el);

    const title = element.find(".entry-title a").text().trim();
    const url = element.find(".entry-title a").attr("href") ?? "";
    const trailer = element.find(".gmr-trailer-popup").attr("href") ?? "";
    const watchLink = element.find(".gmr-watch-button").attr("href") ?? "";
    const thumbnail = element.find("img").attr("src") ?? "";
    const rating = element
      .find(".gmr-rating-item")
      .text()
      .replace(/[^0-9.]/g, "")
      .trim();
    const releaseDate = element.find("time").attr("datetime") ?? "";
    const director = element
      .find('[itemprop="director"] [itemprop="name"]')
      .text()
      .trim();

    const genres: string[] = [];
    element.find(".gmr-movie-on a[rel='category tag']").each((_, genreEl) => {
      genres.push($(genreEl).text().trim());
    });

    movies.push({
      title,
      url,
      trailer,
      thumbnail,
      watchLink,
      rating,
      releaseDate,
      director,
      genres,
    });
  });

  return movies;
}
