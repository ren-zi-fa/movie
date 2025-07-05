import { Hono } from "hono";
import axios from "axios";
import { SearchMovie } from "@/types";
import { parsedSearchMovie } from "@/lib/parseSearching";

const target_url = process.env.TARGET_URL as string;
const searchRoute = new Hono();

searchRoute.get("/", async (c) => {
  try {
    const query = c.req.query("q");

    const { data: html } = await axios.get(`${target_url}/?s=${query}`);
    const data: SearchMovie[] = parsedSearchMovie(html);
    return c.json({ success: true, data: data });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, data: [] }, 500);
  }
});

export default searchRoute;
