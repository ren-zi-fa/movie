import { Hono } from "hono";
import { Country } from "@/types";
import { parseCountry } from "@/lib/parsedCountry";
import axiosInstance from "@/lib/axios";

const target_url = process.env.TARGET_URL as string;
const countryRoute = new Hono();

countryRoute.get("/:country", async (c) => {
  try {
    const country = c.req.param("country");

    const { data: html } = await axiosInstance.get(`${target_url}/country/${country}`);
    const data: Country[] = parseCountry(html);
    return c.json({ success: true, data: data });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, data: [] }, 500);
  }
});

export default countryRoute;
