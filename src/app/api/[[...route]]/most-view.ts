import { Hono } from "hono";
import axios from "axios";

import { MostView } from "@/types";
import { parseView } from "@/lib/parseMostView";

const target_url = process.env.TARGET_URL as string;
const mostView = new Hono();

mostView.get("/", async (c) => {
  try {
    const { data: html } = await axios.get(target_url);
    const movies: MostView[] = parseView(html);

    return c.json({ success: true, data: movies });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, data: [] }, 500);
  }
});

export default mostView;
