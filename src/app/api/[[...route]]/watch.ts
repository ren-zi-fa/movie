import { Hono } from "hono";
import axios from "axios";
import { parseWatch } from "@/lib/parsedWatch";
import { WatchMovie } from "@/types";

const target_url = process.env.TARGET_URL as string;
const watchroute = new Hono();

watchroute.get("/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");

    const { data: html } = await axios.get(`${target_url}/${slug}`);
    const data: WatchMovie = parseWatch(html);
    return c.json({ success: true, data: data });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, data: [] }, 500);
  }
});

export default watchroute;
