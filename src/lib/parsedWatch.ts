import { WatchMovie } from "@/types";
import * as cheerio from "cheerio";

export function parseWatch(html: string): WatchMovie {
  const $ = cheerio.load(html);
  const article = $("article.hentry");

  const title = article.find("h1.entry-title").text().trim();

  const thumbnail =
    article
      .find(".gmr-movie-data img")
      .last()
      .attr("src")
      ?.replace(/-\d+x\d+\.(jpg|png|webp)$/i, ".$1") || "";
  const description = article.find(".entry-content p").first().text().trim();

  const ratingValue =
    parseFloat(article.find("[itemprop='ratingValue']").text().trim()) || 0;
  const ratingCount =
    parseInt(article.find("[itemprop='ratingCount']").text().trim()) || 0;

  const views =
    parseInt(
      article.find(".post-views-count").first().text().replace(/\D/g, "")
    ) || 0;

  const tagline = article
    .find(".gmr-moviedata:contains('Tagline:')")
    .text()
    .replace("Tagline:", "")
    .trim();
  const rated = article
    .find(".gmr-moviedata:contains('Rating:')")
    .text()
    .replace("Rating:", "")
    .trim();
  const quality = article
    .find(".gmr-moviedata:contains('Kualitas:') a")
    .text()
    .trim();
  const year =
    parseInt(
      article.find(".gmr-moviedata:contains('Tahun:') a").text().trim()
    ) || 0;
  const duration = article
    .find(".gmr-moviedata:contains('Durasi:')")
    .text()
    .replace("Durasi:", "")
    .trim();
  const releaseDate =
    article.find(".gmr-moviedata:contains('Rilis:') time").attr("datetime") ||
    "";
  const language = article
    .find(".gmr-moviedata:contains('Bahasa:')")
    .text()
    .replace("Bahasa:", "")
    .trim();
  const country = article
    .find(".gmr-moviedata:contains('Negara:') a")
    .text()
    .trim();
  const director = article
    .find(".gmr-moviedata:contains('Direksi:') a")
    .text()
    .trim();

  const actors: string[] = [];
  article.find(".gmr-moviedata:contains('Pemain:') a").each((_, el) => {
    actors.push($(el).text().trim());
  });

  const genres: string[] = [];
  article.find(".gmr-moviedata:contains('Genre:') a").each((_, el) => {
    genres.push($(el).text().trim());
  });

  const playerIframe = article.find("iframe").attr("src") || "";

  return {
    title,
    thumbnail,
    description,
    rating: {
      value: ratingValue,
      count: ratingCount,
    },
    views,
    tagline,
    rated,
    quality,
    year,
    duration,
    releaseDate,
    language,
    country,
    director,
    actors,
    genres,

    playerIframe,
  };
}
