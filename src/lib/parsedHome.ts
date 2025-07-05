import { Movie } from "@/types";
import * as cheerio from "cheerio";

export function parsedHome(html: string): Movie[] {
  const $ = cheerio.load(html);
  const movies: Movie[] = [];

  $(".gmr-item-modulepost").each((_, el) => {
    const element = $(el);

    const title = element.find(".entry-title a").text().trim();
    const url = element.find(".entry-title a").attr("href") ?? "";
    const trailer = element.find(".gmr-trailer-popup").attr("href") ?? "";
    const thumbnail = element.find("img").attr("src") ?? "";
    const watchLink = element.find(".gmr-watch-btn").attr("href") ?? "";
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

    movies.push({
      title,
      url,
      trailer,
      thumbnail,
      watchLink,
      rating,
      releaseDate,
      director,
    });
  });

  return movies;
}
