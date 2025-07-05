import { Hono } from "hono";
import axios from "axios";
import { Movie } from "@/types";
import { parsedHome } from "@/lib/parsedHome";

const target_url = process.env.TARGET_URL as string;
const homeRoute = new Hono();
homeRoute.get("/", async (c) => {
  try {
    const { data: html } = await axios.get(target_url);

    const movies: Movie[] = parsedHome(html);
    return c.json({ success: true, data: movies });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, data: [] }, 500);
  }
});

export default homeRoute;
