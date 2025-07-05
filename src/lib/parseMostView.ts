import * as cheerio from "cheerio";
import { MostView } from "@/types";

export function parseView(html: string): MostView[] {
  const $ = cheerio.load(html);
  const movies: MostView[] = [];

  $(".idmuvi-rp-widget .idmuvi-rp-link").each((_, el) => {
    const element = $(el);

    const url = element.find("a").first().attr("href") ?? "";
    const title = element.find(".idmuvi-rp-title").text().trim();
    const thumbnail = element.find("img").attr("src") ?? "";

    const genres: string[] = [];
    element.find('.idmuvi-rp-meta a[rel="category tag"]').each((_, genreEl) => {
      genres.push($(genreEl).text().trim());
    });

    const country = element
      .find('.idmuvi-rp-meta [itemprop="contentLocation"] a')
      .text()
      .trim();

    movies.push({
      title,
      url,
      thumbnail,
      genres,
      country,
    });
  });

  return movies;
}
