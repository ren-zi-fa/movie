import { Hono } from "hono";
import { handle } from "hono/vercel";
import home from "./home";
import mostView from "./most-view";
import watchroute from "./watch";
import searchRoute from "./search";
import countryRoute from "./country";

const app = new Hono().basePath("/api");

app.get("/", (c) => c.json({ message: "api omke" }));

export const routes = app
  .route("/home", home)
  .route("/most-view", mostView)
  .route("/watch", watchroute)
  .route("/search", searchRoute)
  .route("/category", countryRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
